import React from "react";
import { ApiHelper, ChatHelper, ChatRoomInterface, ChatUserInterface, MessageInterface, ConfigHelper } from "../../../helpers";


interface Props { room: ChatRoomInterface, user: ChatUserInterface }

export const Callout: React.FC<Props> = (props) => {

    const [edit, setEdit] = React.useState(false);
    const [message, setMessage] = React.useState("");

    const editMode = (e: React.MouseEvent) => { e.preventDefault(); setEdit(true); }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { setMessage(e.currentTarget.value); }

    const handleUpdate = (e: React.MouseEvent) => {
        e.preventDefault();
        const msg: MessageInterface = { churchId: ConfigHelper.current.churchId, content: message, conversationId: props.room.conversationId, displayName: ChatHelper.current.user.displayName, messageType: "callout" }
        ApiHelper.post("/messages/setCallout", msg, "MessagingApi");
        //ChatHelper.setCallout(props.roomName, message);
        setEdit(false);
    }

    const getEditSection = () => {
        return (<div className="input-group input-group-sm mb-3">
            <input id="nameText" type="text" className="form-control form-control-sm" placeholder="Callout message" value={message} onChange={handleChange} />
            <div className="input-group-append input-group-append-sm">
                <button id="setNameButton" className="btn btn-primary btn-sm" onClick={handleUpdate}>Update</button>
            </div>
        </div>)
    }


    if (props.user?.isHost) {
        if (edit) return getEditSection();
        else {
            if (props.room.callout?.content === "") return <div id="callout"><a href="about:blank" onClick={editMode}>Set Callout</a></div>;
            else return (<div id="callout"><span style={{ float: "right" }}><a href="about:blank" onClick={editMode}><i className="fas fa-pencil-alt"></i></a></span>{ChatHelper.insertLinks(props.room.callout?.content || "")}</div>);
        }
    } else {
        if (props.room.callout?.content === "") return null;
        else return (<div id="callout">{ChatHelper.insertLinks(props.room.callout.content)}</div>);
    }
}




