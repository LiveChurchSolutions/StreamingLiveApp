import React from "react";
import { AttendanceInterface, UserHelper } from "../../../helpers";

interface Props {
    attendance: AttendanceInterface;
}

export const Attendance: React.FC<Props> = (props) => {
    const [showList, setShowList] = React.useState(false);
    const [showName, setShowName] = React.useState("");

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
            /*
            var people = [];
            for (let i = 0; i < props.attendance.viewers.length; i++) {
                var v = props.attendance.viewers[i];
                //var countSpan = (v.count > 1) ? <span>({v.count})</span> : null;
                var countSpan = null;
                people.push(<div key={i}><i className="fas fa-user-alt"></i>{v.displayName} {countSpan}</div>);
            }*/
            const people = getPeopleCondensed();
            result = <div id="attendance">{people}</div>
        }
        return result;
    }

    const getIndividuals = (name: string) => {
        var people = [];
        for (let i = 0; i < props.attendance.viewers.length; i++) {
            var v = props.attendance.viewers[i];
            if (v.displayName === name) people.push(<div key={i} className="attendanceExpanded"><i className="fas fa-user-alt"></i>{v.displayName} <span className="id">{v.id}</span></div>);
        }
        return people;
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
            people.push(<div key={i}><i className="fas fa-user-alt"></i>{v.displayName} {countSpan}</div>);
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

    return (
        <>
            {getPeople()}
            <a id="attendanceCount" href="about:blank" onClick={toggleAttendance}>{getViewerCount()} {getChevron()}</a>
        </>
    );
}




