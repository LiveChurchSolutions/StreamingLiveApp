import { ChatStateInterface, AttendanceInterface, MessageInterface, ChatRoomInterface, ChatUserInterface, ConversationInterface, ConnectionInterface } from "./Interfaces";
import { SocketHelper } from "./SocketHelper";
import { ConfigHelper } from "./ConfigHelper";
import Cookies from 'js-cookie';
import { ApiHelper } from "."

export class ChatHelper {

    static current: ChatStateInterface = { chatEnabled: false, mainRoom: null, hostRoom: null, privateRooms: [], user: { displayName: "Anonymous", isHost: false } };
    static onChange: () => void;

    static createRoom = (conversationId: string, title: string): ChatRoomInterface => {
        return {
            title: title,
            messages: [],
            attendance: { conversationId: conversationId, totalViewers: 0, viewers: [] },
            callout: { content: "" },
            conversationId: conversationId
        };
    }

    static initChat = async () => {
        return SocketHelper.init({
            attendanceHandler: ChatHelper.handleAttendance,
            calloutHandler: ChatHelper.handleCallout,
            deleteHandler: ChatHelper.handleDelete,
            messageHandler: ChatHelper.handleMessage,
            prayerRequestHandler: ChatHelper.handlePrayerRequest,
            disconnectHandler: ChatHelper.handleDisconnect,
            privateMessageHandler: ChatHelper.handlePrivateMessage,
        });
    }

    static handleDisconnect = () => {
        setTimeout(() => {
            console.log("RECONNECTING");
            //Silently reconnect
            if (SocketHelper.socket.readyState === SocketHelper.socket.CLOSED) {
                ChatHelper.initChat().then(() => {
                    const mRoom = ChatHelper.current.mainRoom;
                    ChatHelper.joinRoom(mRoom.conversationId, ConfigHelper.current.churchId);
                });
            }
        }, 1000);

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
        const rooms = [ChatHelper.current.mainRoom, ChatHelper.current.hostRoom];
        ChatHelper.current.privateRooms.forEach(r => rooms.push(r));
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
            if (room === ChatHelper.current.mainRoom) ConfigHelper.setTabUpdated("chat");
            if (room === ChatHelper.current.hostRoom) ConfigHelper.setTabUpdated("hostchat");
            else ConfigHelper.setTabUpdated("prayer");
            ChatHelper.onChange();
        }
    }

    static handlePrayerRequest = (conversation: ConversationInterface) => {
        const room = ChatHelper.current.hostRoom;
        if (room.prayerRequests === undefined) room.prayerRequests = [];
        room.prayerRequests.push(conversation);
        ConfigHelper.setTabUpdated("prayer");
        ChatHelper.onChange();
    }


    static handlePrivateMessage = (conversation: ConversationInterface) => {
        const privateRoom = ChatHelper.createRoom(conversation.id, "Private Chat");
        ChatHelper.current.privateRooms.push(privateRoom);
        ConfigHelper.addMissingPrivateTab();
        ChatHelper.onChange();
        ChatHelper.joinRoom(conversation.id, conversation.churchId);

        ConfigHelper.setTabUpdated("prayer");
    }


    static handleCatchup = (messages: MessageInterface[]) => {
        if (messages.length > 0) {
            const room = ChatHelper.getRoom(messages[0].conversationId);
            room.messages = [];
            messages.forEach(m => {
                switch (m.messageType) {
                    case "message": ChatHelper.handleMessage(m); break;
                    case "callout": ChatHelper.handleCallout(m); break;
                }
            });
        }
    }

    static getRoom = (conversationId: string): ChatRoomInterface => {
        const c = ChatHelper.current;
        var result: ChatRoomInterface = null;
        if (c.mainRoom?.conversationId === conversationId) result = c.mainRoom;
        else if (c.hostRoom?.conversationId === conversationId) result = c.hostRoom;
        else c.privateRooms.forEach(r => { if (r.conversationId === conversationId) result = r; });
        return result;
    }


    static insertLinks(text: string) {
        var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/ig;
        return text.replace(exp, "<a href='$1' target='_blank'>$1</a>");
    }

    static getUser() {
        var name = Cookies.get('displayName');
        if (name === undefined || name === null || name === '') { name = 'Anonymous'; Cookies.set('displayName', name); }
        var result: ChatUserInterface = { displayName: name, isHost: false };
        ChatHelper.current.user = result;
        return result;
    }


    static joinRoom(conversationId: string, churchId: string) {
        const connection: ConnectionInterface = { conversationId: conversationId, churchId: churchId, displayName: ChatHelper.current.user.displayName, socketId: SocketHelper.socketId }
        ApiHelper.postAnonymous("/connections", [connection], "MessagingApi");
        ApiHelper.getAnonymous("/messages/catchup/" + churchId + "/" + conversationId, "MessagingApi").then(messages => { ChatHelper.handleCatchup(messages) });
    }


}

