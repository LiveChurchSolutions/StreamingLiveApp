import React from "react";
import { ChatStateInterface, ChatSend, ConfigHelper, ChatHelper, Chat } from "..";
import { ApiHelper, ConversationInterface } from "../../helpers";

interface Props { chatState: ChatStateInterface | undefined, visible: boolean }

export const RequestPrayer: React.FC<Props> = (props) => {
    const requestPrayer = async (e: React.MouseEvent) => {
        e.preventDefault();


        const conversation: ConversationInterface = await ApiHelper.getAnonymous("/conversations/requestPrayer/" + ConfigHelper.current.churchId + "/" + ChatHelper.current.mainRoom.conversationId, "MessagingApi");
        ChatHelper.current.prayerRoom = {
            messages: [],
            attendance: { conversationId: conversation.id, totalViewers: 0, viewers: [] },
            callout: { content: "" },
            conversationId: conversation.id
        };
        ChatHelper.onChange();
        ChatHelper.joinRoom(conversation);
    }

    /*
<div className="chatContainer" style={(props.visible) ? {} : { display: "none" }}>
    <ChatReceive room={ChatHelper.getOrCreateRoom(props.chatState, "church_" + ConfigHelper.current.churchId + "_" + prayerGuid)} />
    <ChatSend room={"church_" + ConfigHelper.current.churchId + "_" + prayerGuid} />
</div>)
*/

    if (props.chatState.prayerRoom !== null) return (<Chat room={props.chatState.prayerRoom} user={props.chatState.user} visible={props.visible} enableAttendance={true} />)
    else return (<div id="prayerContainer" style={(props.visible) ? {} : { display: "none" }}>
        Need prayer?  Start a private chat session with one of our hosts.
        <button id="requestPrayerButton" className="btn btn-primary btn-block" onClick={requestPrayer}>Request Prayer</button>
    </div>);
}





