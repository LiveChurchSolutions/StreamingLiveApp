import React from "react";
import { TabInterface, Chat, HostChat, RequestPrayer, ReceivePrayer } from "..";
import { ChatStateInterface } from "../../helpers";


interface Props {
    tabs: TabInterface[],
    chatState: ChatStateInterface
}

export const InteractionContainer: React.FC<Props> = (props) => {
    const [selectedTab, setSelectedTab] = React.useState(0);


    /*
        const initChat = () => {
            setTimeout(function () {
                ChatHelper.init((state: ChatStateInterface) => { setChatState(state); setConfig(ConfigHelper.current); });
                setChatState(ChatHelper.state);
            }, 500);
        }
    */


    const selectTab = (index: number) => { setSelectedTab(index); }

    const getAltTabs = () => {
        var result = [];
        if (props.tabs != null) {
            for (let i = 0; i < props.tabs.length; i++) {
                let t = props.tabs[i];
                result.push(<td key={i}><a href="about:blank" onClick={(e: React.MouseEvent) => { e.preventDefault(); selectTab(i); }} className="altTab"><i className={t.icon}></i></a></td>);
            }
        }
        return result;
    }

    const getFlashing = (visible: boolean, t: TabInterface) => {
        var result = false;
        if (!visible) result = t.updated === true;
        else t.updated = false;
        return result;
    }

    const getIframe = (tab: TabInterface, i: number, visible: boolean) => {
        return (<div key={i} id={"frame" + i.toString()} className="frame" style={(!visible) ? { display: "none" } : {}}><iframe src={tab.url} frameBorder="0" title={"frame" + i.toString()}></iframe></div>)
    }

    /*
    const getMainConversation = () => {
        if (props.chatState.rooms.length > 0) return props.chatState.rooms[0].conversationId;
        else return "";
    }*/

    const getChat = () => {
        const room = (props.chatState.rooms.length > 0) ? props.chatState.rooms[0] : null;
        if (room === null) return <></>
        else return <Chat key={room.conversationId} room={room} user={props.chatState.user} visible={true} />;
    }


    const getItems = () => {
        var result = [];
        if (props.tabs != null) {
            for (let i = 0; i < props.tabs.length; i++) {
                let t = props.tabs[i];
                var visible = i === selectedTab;
                var className = getFlashing(visible, t) ? "tab flashing" : "tab";

                result.push(<a key={"anchor" + i.toString()} href="about:blank" onClick={(e: React.MouseEvent) => { e.preventDefault(); selectTab(i); }} className={className}>
                    <i className={t.icon}></i>{t.text}
                </a>);

                switch (t.type) {
                    case "chat":
                        result.push(getChat());
                        break;
                    case "hostchat":
                        result.push(<HostChat key={i} chatState={props.chatState} visible={visible} />);
                        break;
                    case "prayer":
                        if (props.chatState.user.isHost) result.push(<ReceivePrayer key={i} chatState={props.chatState} visible={visible} />);
                        else result.push(<RequestPrayer key={i} chatState={props.chatState} visible={visible} />);
                        break;
                    case "page":
                        //if (EnvironmentHelper.RequirePublish) ... else
                        result.push(getIframe(t, i, visible));
                        break;
                    default:
                        result.push(getIframe(t, i, visible));
                        break;
                }
            }
        }



        return result;
    }

    return (
        <div id="interactionContainer">
            <table id="altTabs">
                <tbody>
                    <tr>{getAltTabs()}</tr>
                </tbody>
            </table>
            {getItems()}
        </div>
    );
}






