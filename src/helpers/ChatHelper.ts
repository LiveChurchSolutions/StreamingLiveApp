import { ChatStateInterface, AttendanceInterface, MessageInterface, ChatRoomInterface, ChatUserInterface } from "./Interfaces";
import { SocketHelper } from "./SocketHelper";
import Cookies from 'js-cookie';

export class ChatHelper {

    static current: ChatStateInterface = { chatEnabled: false, mainRoom: null, hostRoom: null, prayerRoom: null, user: { displayName: "Anonymous", isHost: false } };
    static onChange: () => void;


    static initChat = async () => {
        return SocketHelper.init({
            attendanceHandler: ChatHelper.handleAttendance,
            calloutHandler: ChatHelper.handleCallout,
            deleteHandler: ChatHelper.handleDelete,
            messageHandler: ChatHelper.handleMessage,
            prayerRequestHandler: ChatHelper.handlePrayerRequest
        });
    }

    static handleAttendance = (attendance: AttendanceInterface) => {
        const room = ChatHelper.getRoom(attendance.conversationId);
        if (room !== null) {
            room.attendance = attendance;
            ChatHelper.onChange();
        }
    }

    static handleCallout = (message: MessageInterface) => {
        const room = ChatHelper.getRoom(message.conversationId);
        if (room !== null) {
            room.callout = message;
            ChatHelper.onChange();
        }
    }

    static handleDelete = (messageId: string) => {
        const rooms = [ChatHelper.current.mainRoom, ChatHelper.current.hostRoom, ChatHelper.current.prayerRoom];
        rooms.forEach(room => {
            if (room !== null) {
                for (let i = room.messages.length - 1; i >= 0; i--) {
                    if (room.messages[i].id === messageId) room.messages.splice(i, 1);
                }
            }
        });
        ChatHelper.onChange();
    }

    static handleMessage = (message: MessageInterface) => {
        const room = ChatHelper.getRoom(message.conversationId);
        if (room !== null) {
            room.messages.push(message);
            ChatHelper.onChange();
        }
    }

    static handlePrayerRequest = (conversationId: string) => {
    }

    static handleCatchup = (messages: MessageInterface[]) => {
        messages.forEach(m => {
            switch (m.messageType) {
                case "message": ChatHelper.handleMessage(m); break;
                case "callout": ChatHelper.handleCallout(m); break;
            }
        });
    }

    static getRoom = (conversationId: string): ChatRoomInterface => {
        const c = ChatHelper.current
        if (c.mainRoom?.conversationId === conversationId) return c.mainRoom;
        else if (c.hostRoom?.conversationId === conversationId) return c.hostRoom;
        else if (c.prayerRoom?.conversationId === conversationId) return c.prayerRoom;
        else return null;
    }

    static insertLinks(text: string) {
        var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/ig;
        return text.replace(exp, "<a href='$1' target='_blank'>$1</a>");
    }

    static getUser() {
        var name = Cookies.get('displayName');
        if (name === undefined || name === null || name === '') { name = 'Anonymous'; Cookies.set('name', name); }
        var result: ChatUserInterface = { displayName: name, isHost: false };
        ChatHelper.current.user = result;
        return result;
    }


}

