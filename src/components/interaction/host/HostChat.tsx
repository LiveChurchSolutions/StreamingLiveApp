import React from "react";
import { ChatSend, Attendance, ChatReceive, ChatStateInterface } from "../..";

interface Props { chatState: ChatStateInterface, visible: boolean }
export const HostChat: React.FC<Props> = (props) => {
    return (
        <div className="chatContainer" style={(props.visible) ? {} : { display: "none" }} >
            <Attendance attendance={props.chatState.hostRoom.attendance} />
            <ChatReceive room={props.chatState.hostRoom} user={props.chatState.user} />
            <ChatSend room={props.chatState.hostRoom} />
        </div>
    );
}




