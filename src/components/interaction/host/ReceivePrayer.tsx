import React from "react";
//import { ChatSend, ChatReceive } from "./"
import { ChatStateInterface, ConfigHelper, ChatHelper } from "../../../helpers";

interface Props { chatState: ChatStateInterface | undefined, visible: boolean }


export const ReceivePrayer: React.FC<Props> = (props) => {
    return <></>;
    /*
    const [prayerGuid, setPrayerGuid] = React.useState("");
    const [prayerName, setPrayerName] = React.useState("");

    const viewPrayer = (e: React.MouseEvent) => {
        e.preventDefault();
        var guid = e.currentTarget.getAttribute("data-guid");
        var name = e.currentTarget.getAttribute("data-name");
        if (guid !== undefined && guid !== null) setPrayerGuid(guid);
        if (name !== null) setPrayerName(name);
    }

    const getRequests = () => {
        var links = [];
        if (props.chatState !== undefined) {
            for (let i = 0; i < props.chatState.prayerRequests.length; i++) {
                var pr = props.chatState.prayerRequests[i];
                links.push(<div style={{ flex: "1 0 0" }}><a href="about:blank" data-guid={pr.userGuid} data-name={pr.name} onClick={viewPrayer}>{pr.name}</a></div>)
            }
        }
        if (links.length > 0) return (<div style={{ padding: 10 }}>{links}</div>);
        else return (<div style={{ padding: 10 }}><i>There are not any prayer requests at this time.</i></div>);
    }

    const getChat = () => {
        if (prayerGuid !== "") return (<>
            <div style={{ flex: "0 0 0 25px", backgroundColor: "#eee", paddingLeft: 10 }}>Chatting with {prayerName}</div>
            <div className="chatContainer" style={(props.visible) ? {} : { display: "none" }}>
                <ChatReceive room={ChatHelper.getOrCreateRoom(props.chatState, "church_" + ConfigHelper.current.churchId + "_" + prayerGuid)} />
                <ChatSend room={"church_" + ConfigHelper.current.churchId + "_" + prayerGuid} />
            </div>
        </>);
        else return null;
    }



    return <div id="receivePrayerContainer" style={(props.visible) ? {} : { display: "none" }}>
        {getRequests()}
        {getChat()}
    </div>
*/
}





