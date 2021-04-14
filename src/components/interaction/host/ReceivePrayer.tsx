import React from "react";
import { Chat } from "../"
import { ChatStateInterface, ChatHelper, ConversationInterface, ChatRoomInterface } from "../../../helpers";

interface Props { chatState: ChatStateInterface | undefined, visible: boolean }


export const ReceivePrayer: React.FC<Props> = (props) => {

    const [conversation, setConversation] = React.useState<ConversationInterface>(null)

    const viewPrayer = (e: React.MouseEvent) => {
        e.preventDefault();
        const idx = parseInt(e.currentTarget.getAttribute("data-idx"), 0);
        const conv = props.chatState.hostRoom.prayerRequests[idx];
        const prayerRoom: ChatRoomInterface = {
            messages: [],
            attendance: { conversationId: conv.id, totalViewers: 0, viewers: [] },
            callout: { content: "" },
            conversationId: conv.id
        };
        ChatHelper.current.privateRooms = [prayerRoom];
        ChatHelper.onChange();
        ChatHelper.joinRoom(conv.id, conv.churchId);
        setConversation(conv);
    }

    const getRequests = () => {
        var links = [];
        const requests = props.chatState?.hostRoom?.prayerRequests;
        if (requests !== undefined) {
            for (let i = 0; i < requests.length; i++) {
                var pr = requests[i];
                links.push(<div style={{ flex: "1 0 0" }}><a href="about:blank" data-idx={i} onClick={viewPrayer}>{pr.title}</a></div>)
            }
        }
        if (links.length > 0) return (<div style={{ padding: 10 }}>{links}</div>);
        else return (<div style={{ padding: 10 }}><i>There are not any prayer requests at this time.</i></div>);
    }

    const getChat = () => {
        if (conversation !== null) return (<>
            <div style={{ flex: "0 0 0 25px", backgroundColor: "#eee", paddingLeft: 10 }}>{conversation.title}</div>
            <Chat room={props.chatState.privateRooms[0]} user={props.chatState.user} visible={props.visible} enableAttendance={true} />
        </>);
        else return null;
    }



    return <div id="receivePrayerContainer" style={(props.visible) ? {} : { display: "none" }}>
        {getRequests()}
        {getChat()}
    </div>

}





