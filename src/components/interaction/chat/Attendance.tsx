import React from "react";
import { AttendanceInterface, UserHelper, ChatHelper, ConversationInterface, ChatRoomInterface, ApiHelper, ConfigHelper, ServicesHelper } from "../../../helpers";
import { Menu, Item, useContextMenu } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.css';
import { SocketHelper } from "../../../helpers/SocketHelper";

interface Props {
    attendance: AttendanceInterface;
}

export const Attendance: React.FC<Props> = (props) => {
    const [showList, setShowList] = React.useState(false);
    const [showName, setShowName] = React.useState("");
    const [selectedConnectionId, setSelectedConnectionId] = React.useState("");


    const toggleAttendance = (e: React.MouseEvent) => {
        e.preventDefault();
        setShowList(!showList);
    }

    const getViewerCount = () => {
        var totalViewers = 0;
        if (props.attendance.viewers !== undefined) totalViewers = props.attendance.viewers.length;
        if (totalViewers === 1) return "1 attendee";
        else return totalViewers.toString() + " attendees";
    }

    const getChevron = () => {
        if (showList) return <i className="fas fa-chevron-up"></i>
        else return <i className="fas fa-chevron-down"></i>
    }

    const getNameChevron = (name: string) => {
        if (name === showName) return <a href="about:blank" onClick={(e) => { e.preventDefault(); setShowName(""); }}><i className="fas fa-chevron-up"></i></a>;
        else return <a href="about:blank" onClick={(e) => { e.preventDefault(); setShowName(name); }}><i className="fas fa-chevron-down"></i></a>;
    }

    const getPeople = () => {
        var result = null;
        if (showList && props.attendance.viewers !== undefined) {
            const people = getPeopleCondensed();
            result = <div id="attendance">{people}</div>
        }
        return result;
    }

    const getIndividuals = (name: string) => {
        var people = [];
        for (let i = 0; i < props.attendance.viewers.length; i++) {
            const v = props.attendance.viewers[i];
            if (v.displayName === name) people.push(<div key={i} onContextMenu={(e) => handleAttendeeContext(e, v.id)} className="attendanceExpanded"><i className="fas fa-user-alt"></i>{v.displayName} <span className="id">{v.id}</span>{getPMIcon(v.id)}</div>);
        }
        return people;
    }

    const getRoomForConnection = (connectionId: string) => {
        var privateRoom: ChatRoomInterface = null;
        ChatHelper.current.privateRooms.forEach(pr => {
            if (pr.conversation.contentType === "privateMessage" && pr.conversation.contentId === connectionId) privateRoom = pr;
        });
        return privateRoom;
    }

    const getPMIcon = (connectionId: string) => {
        var result: JSX.Element = null;
        if (UserHelper.isHost) {
            var privateRoom: ChatRoomInterface = getRoomForConnection(connectionId);
            if (privateRoom !== null) {
                if (privateRoom.joined) result = <i className="fas fa-comments private-active" style={{ marginLeft: 10 }} ></i>
                else result = <i className="far fa-comments" style={{ marginLeft: 10 }} ></i>

            }
        }
        return result;
    }

    const getPeopleCondensed = () => {
        var people = [];
        const combinedPeople = getCombinedPeople();

        for (let i = 0; i < combinedPeople.length; i++) {
            var children: any[] = [];
            var v = combinedPeople[i];
            var countSpan = null;
            if (v.count > 1) {
                if (!UserHelper.isHost) countSpan = <span>({v.count})</span>;
                else {
                    countSpan = <span>({v.count}) {getNameChevron(v.displayName)} </span>;
                    if (v.displayName === showName) children = getIndividuals(v.displayName);
                }
            }

            if (!UserHelper.isHost || v.count > 1) people.push(<div key={i}><i className="fas fa-user-alt"></i>{v.displayName} {countSpan}</div>);
            else {
                for (let i = 0; i < props.attendance.viewers.length; i++) {
                    const c = props.attendance.viewers[i];
                    if (c.displayName === v.displayName) people.push(<div key={i} onContextMenu={(e) => handleAttendeeContext(e, c.id)}><i className="fas fa-user-alt"></i>{v.displayName}{getPMIcon(c.id)}</div>);
                }
            }

            if (children !== []) people.push(children);
        }
        return people;
    }

    const getCombinedPeople = () => {
        var lastName = null;
        const result: any[] = [];
        for (let i = 0; i < props.attendance.viewers.length; i++) {
            const v = props.attendance.viewers[i];
            if (v.displayName === lastName) result[result.length - 1].count++;
            else result.push({ displayName: v.displayName, count: 1 });
            lastName = v.displayName;
        }
        return result;
    }




    const handlePMClick = async (privateRoom: ChatRoomInterface) => {

        if (privateRoom === null) {
            var title = "Private chat";
            props.attendance.viewers.forEach(v => {
                if (v.id === selectedConnectionId) title = "Private chat with " + v.displayName;
            });
            const conversation: ConversationInterface = await ApiHelper.get("/conversations/privateMessage/" + selectedConnectionId, "MessagingApi");
            const pr = ChatHelper.getOrCreatePrivateRoom(conversation);

            pr.conversation.title = title;
            pr.conversation.contentId = selectedConnectionId; //may not be needed
            pr.joined = true;
            ConfigHelper.current.switchToConversationId = pr.conversation.id;
            ChatHelper.onChange();
            ChatHelper.joinRoom(conversation.id, conversation.churchId);
        }
        else {
            privateRoom.joined = true;
            ConfigHelper.current.switchToConversationId = privateRoom.conversation.id;
            ChatHelper.onChange();
            ChatHelper.joinRoom(privateRoom.conversation.id, privateRoom.conversation.churchId);
        }
    }

    const handleVideoChat = async () => {
        await ApiHelper.get("/conversations/videoChat/" + selectedConnectionId, "MessagingApi");

        ConfigHelper.current.services.forEach(s => {
            if (s.localStartTime.getTime() === ServicesHelper.currentService.localStartTime.getTime()) {
                s.provider = "jitsi";
                s.videoUrl = "StreamingLiveTestRoom" //SocketHelper.socketId;
            }
        });
    }


    const contextMenu = useContextMenu({ id: "attendeeMenu" });

    function handleAttendeeContext(e: React.MouseEvent, connectionId: string) {
        e.preventDefault();
        setSelectedConnectionId(connectionId);

        contextMenu.show(e);
        //The component has a bug.  It captures keyboard input to allow keyboard navigation and doesn't give it back.
        window.addEventListener('keydown', function (event) { event.stopPropagation(); }, true);

    }

    const getContextMenuItems = () => {
        const privateRoom: ChatRoomInterface = getRoomForConnection(selectedConnectionId);
        const result: JSX.Element[] = []

        if (privateRoom === null) result.push(<Item onClick={() => handlePMClick(null)}>Private Message</Item>);
        else result.push(<Item onClick={() => handlePMClick(privateRoom)}>Join Private Conversation</Item>);

        result.push(<Item onClick={() => handleVideoChat()}>Invite to Video Chat</Item>);

        return result;
    }

    return (
        <>
            {getPeople()}
            <a id="attendanceCount" href="about:blank" onClick={toggleAttendance}>{getViewerCount()} {getChevron()}</a>
            <Menu id={"attendeeMenu"}>
                {getContextMenuItems()}

            </Menu>
        </>
    );
}




