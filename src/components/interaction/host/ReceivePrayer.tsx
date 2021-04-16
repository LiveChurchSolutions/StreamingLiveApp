import React from "react";
import { Chat } from "../"
import { ChatStateInterface, ChatHelper, ConversationInterface, ChatRoomInterface } from "../../../helpers";

interface Props { chatState: ChatStateInterface | undefined, visible: boolean }


export const ReceivePrayer: React.FC<Props> = (props) => {

    //const [conversation, setConversation] = React.useState<ConversationInterface>(null)
    const [selectedConversation, setSelectedConversation] = React.useState("");

    const viewPrayer = (e: React.MouseEvent) => {
        e.preventDefault();
        const idx = parseInt(e.currentTarget.getAttribute("data-idx"), 0);
        const conv = props.chatState.hostRoom.prayerRequests[idx];
        const prayerRoom = ChatHelper.createRoom(conv.id);
        ChatHelper.current.privateRooms.push(prayerRoom);
        selectConversation(conv.id);
        props.chatState.hostRoom.prayerRequests.splice(idx, 1);
        ChatHelper.onChange();
        ChatHelper.joinRoom(conv.id, conv.churchId);
        //setConversation(conv);
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
        else return (<div style={{ padding: 10 }}><i>There are no pending prayer requests at this time.</i></div>);
    }

    /*
    const getChat = () => {
        if (conversation !== null) return (<>
            <div style={{ flex: "0 0 0 25px", backgroundColor: "#eee", paddingLeft: 10 }}>{conversation.title}</div>
            <Chat room={props.chatState.privateRooms[0]} user={props.chatState.user} visible={props.visible} enableAttendance={true} />
        </>);
        else return null;
    }*/

    const selectConversation = (conversationId: string) => { setSelectedConversation(conversationId); }

    const getRooms = () => {
        var result: JSX.Element[] = [];
        props.chatState.privateRooms.forEach(r => {
            //var className = getFlashing(visible, t) ? "tab flashing" : "tab";
            var className = "tab childTab";
            var visible = selectedConversation === r.conversationId;
            result.push(<a key={"anchor_" + r.conversationId.toString()} href="about:blank" onClick={(e: React.MouseEvent) => { e.preventDefault(); selectConversation(r.conversationId); }} className={className}>
                <i className="fas fa-chat"></i>Private Chat
            </a>);
            result.push(<Chat key={r.conversationId} room={r} user={props.chatState.user} visible={visible} enableAttendance={true} enableCallout={false} />);

        });
        return result;
    }



    return <div id="receivePrayerContainer" style={(props.visible) ? {} : { display: "none" }}>
        {getRequests()}
        {getRooms()}
    </div>

}





