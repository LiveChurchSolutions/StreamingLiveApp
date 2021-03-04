import { ChatStateInterface, AttendanceInterface, MessageInterface, ChatRoomInterface } from "./Interfaces";
import { SocketHelper } from "./SocketHelper";


export class ChatHelper {

    static current: ChatStateInterface = { rooms: [], chatEnabled: false, user: { displayName: "Anonymous", isHost: false }, mainConversationId: "" };
    static onChange: () => void;


    static initChat = () => {
        SocketHelper.init({
            attendanceHandler: ChatHelper.handleAttendance,
            calloutHandler: ChatHelper.handleCallout,
            deleteHandler: ChatHelper.handleDelete,
            messageHandler: ChatHelper.handleMessage,
            prayerRequestHandler: ChatHelper.handlePrayerRequest
        });
    }

    static handleAttendance = (attendance: AttendanceInterface) => {
    }

    static handleCallout = (message: MessageInterface) => {
    }

    static handleDelete = (messageId: string) => {
    }

    static handleMessage = (message: MessageInterface) => {
        const room = ChatHelper.getOrCreateRoom(message.conversationId);
        room.messages.push(message);
        ChatHelper.onChange();
    }

    static handlePrayerRequest = (conversationId: string) => {
    }

    static setMainConversationId = (conversationId: string) => {
        ChatHelper.current.mainConversationId = conversationId;
        ChatHelper.onChange();
    }


    static getOrCreateRoom = (conversationId: string): ChatRoomInterface => {
        ChatHelper.current.rooms.forEach(r => {
            if (r.conversationId === conversationId) return r;
        });
        return { attendance: null, conversationId: conversationId, messages: [], callout: null }
    }

    static insertLinks(text: string) {
        var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/ig;
        return text.replace(exp, "<a href='$1' target='_blank'>$1</a>");
    }


}

