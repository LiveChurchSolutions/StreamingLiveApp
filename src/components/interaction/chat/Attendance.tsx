import React from "react";
import { AttendanceInterface } from "../../../helpers";

interface Props {
    attendance: AttendanceInterface;
}

export const Attendance: React.FC<Props> = (props) => {
    const [showList, setShowList] = React.useState(false);

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

    const getPeopleCondensed = () => {
        var people = [];
        const combinedPeople = getCombinedPeople();

        for (let i = 0; i < combinedPeople.length; i++) {
            var v = combinedPeople[i];
            var countSpan = (v.count > 1) ? <span>({v.count})</span> : null;
            people.push(<div key={i}><i className="fas fa-user-alt"></i>{v.displayName} {countSpan}</div>);
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




