import React from "react";
import { ChatSend, Callout, Attendance, ChatReceive } from ".";
import { ChatStateInterface, ConfigHelper, ServicesHelper, ChatHelper, ChatRoomInterface, ChatUserInterface } from "../../../helpers"

interface Props {
    room: ChatRoomInterface,
    user: ChatUserInterface,
    visible: boolean,
    enableCallout?: boolean,
    enableAttendance?: boolean,
}

export const Chat: React.FC<Props> = (props) => {

    const [chatEnabled, setChatEnabled] = React.useState(false);

    const updateChatEnabled = React.useCallback(() => {
        var cs = ServicesHelper.currentService;
        var result = false;
        if (cs !== null) {
            var currentTime = new Date();
            result = currentTime >= (cs.localChatStart || new Date()) && currentTime <= (cs.localChatEnd || new Date());
        }
        if (result !== chatEnabled) setChatEnabled(result);
    }, [chatEnabled]);

    React.useEffect(() => { setInterval(updateChatEnabled, 1000); }, [updateChatEnabled]);

    var className = (chatEnabled) ? "chatContainer" : "chatContainer chatDisabled";


    return (
        <div className={className} style={(props.visible) ? {} : { display: "none" }} >
            {(props.enableAttendance) ? <Attendance attendance={props.room.attendance} /> : null}
            {(props.enableCallout) ? <Callout room={props.room} user={props.user} /> : null}
            <ChatReceive room={props.room} user={props.user} />
            <ChatSend room={props.room} />
        </div>
    );
}




