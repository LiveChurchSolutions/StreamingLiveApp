import { ChatStateInterface, AttendanceInterface, MessageInterface, ChatRoomInterface } from "./Interfaces";
import { SocketHelper } from "./SocketHelper";


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
    }

    static handleDelete = (messageId: string) => {
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


}

