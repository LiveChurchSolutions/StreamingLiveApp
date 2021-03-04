import React from "react";
import { ChatSend, Attendance, ChatReceive, ChatStateInterface, ConfigHelper, ChatHelper } from "../..";
import { ChatRoomInterface } from "../../../helpers";

interface Props { chatState: ChatStateInterface | undefined, visible: boolean }

export const HostChat: React.FC<Props> = (props) => {

    const [hostRoom, setHostRoom] = React.useState<ChatRoomInterface>(null);


    return (
        <div className="chatContainer" style={(props.visible) ? {} : { display: "none" }} >
            <Attendance attendance={hostRoom.attendance} />
            <ChatReceive room={hostRoom} user={props.chatState.user} />
            <ChatSend room={hostRoom} />
        </div>
    );
}




