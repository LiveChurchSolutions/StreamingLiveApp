import { ServicesHelper, EnvironmentHelper } from '.'
import { ApiHelper } from '../components';
import { PayloadInterface, ChatEventsInterface } from "../helpers/Interfaces"

export class SocketHelper {
    static socket: WebSocket;
    static socketId: string;

    static events: ChatEventsInterface;


    static init = async (events: ChatEventsInterface) => {
        SocketHelper.events = events;
        if (SocketHelper.socket !== undefined) {
            try { SocketHelper.socket.close(); } catch (e) { console.log(e); }
        }

        await new Promise((resolve) => {
            SocketHelper.socket = new WebSocket(EnvironmentHelper.MessagingSocket);
            SocketHelper.socket.onmessage = (event) => {
                const payload = JSON.parse(event.data);
                SocketHelper.handleMessage(payload);
            };
            SocketHelper.socket.onopen = (e) => {
                SocketHelper.socket.send("getId");
                resolve(null);
            };
        });
    }

    static handleMessage = (payload: PayloadInterface) => {
        console.log("RECEIVED '" + payload.action + "'");
        console.log(payload);
        switch (payload.action) {
            case "attendance": SocketHelper.events.attendanceHandler(payload.data); break;
            case "callout": SocketHelper.events.calloutHandler(payload.data); break;
            case "deleteMessage": SocketHelper.events.deleteHandler(payload.data); break;
            case "message": SocketHelper.events.messageHandler(payload.data); break;
            case "prayerRequest": SocketHelper.events.prayerRequestHandler(payload.data); break;
            case "socketId":
                SocketHelper.socketId = payload.data;
                break;
        }


    }


}

