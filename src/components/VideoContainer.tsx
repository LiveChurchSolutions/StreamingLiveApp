import React from "react";
import { ServiceInterface } from ".";
import { ChatHelper, ConfigHelper, UserInterface } from "../helpers";
import { Jutsu } from 'react-jutsu'

interface Props { currentService: ServiceInterface | null, jitsiRoom: string, user: UserInterface }

export const VideoContainer: React.FC<Props> = (props) => {

    const [currentTime, setCurrentTime] = React.useState(new Date().getTime());
    const [loadedTime, setLoadedTime] = React.useState(new Date().getTime());

    const getCountdownTime = (serviceTime: Date) => {
        var remainingSeconds = Math.floor((serviceTime.getTime() - currentTime) / 1000);
        if (remainingSeconds > 86400) return serviceTime.toDateString() + " - " + serviceTime.toLocaleString("en-US", { hour: "numeric", minute: "numeric", hour12: true })
        else {
            var hours = Math.floor(remainingSeconds / 3600);
            remainingSeconds = remainingSeconds - (hours * 3600);
            var minutes = Math.floor(remainingSeconds / 60);
            var seconds = remainingSeconds - (minutes * 60);
            return ("0" + hours).slice(-2) + ":" + ("0" + minutes).slice(-2) + ":" + ("0" + seconds).slice(-2);
        }
    }

    const leaveJitsi = () => {
        console.log("LEAVING")
        ConfigHelper.current.jitsiRoom = null;
        ChatHelper.onChange();
    }

    const getVideo = (cs: ServiceInterface) => {
        if (props.jitsiRoom) {
            return (
                <Jutsu
                    roomName={props.jitsiRoom}
                    displayName={props.user.displayName}
                    onMeetingEnd={() => { leaveJitsi() }}
                    loadingComponent={<p>loading ...</p>}
                    errorComponent={<p>Oops, something went wrong</p>}
                    containerStyles={{ width: '100%', height: '100%' }}
                />
            )
        } else {
            var videoUrl = cs.videoUrl;
            if (cs.localStartTime !== undefined) {
                var seconds = Math.floor((loadedTime - cs.localStartTime.getTime()) / 1000);
                if (seconds > 10) {
                    if (cs.provider === "youtube_watchparty") videoUrl += "&start=" + seconds.toString();
                    if (cs.provider === "vimeo_watchparty") videoUrl += "#t=" + seconds.toString() + "s";
                } else {
                    if (cs.provider === "youtube_watchparty") videoUrl += "&start=0";
                    if (cs.provider === "vimeo_watchparty") videoUrl += cs.videoUrl + "#t=0m0s";
                }
            }
            return (<iframe id="videoFrame" src={videoUrl} frameBorder={0} allow="autoplay; fullscreen" allowFullScreen title="Sermon Video" ></iframe>);
        }
    }

    const getCountdown = (cs: ServiceInterface) => {
        var displayTime = getCountdownTime(cs.localCountdownTime || new Date());
        return <div id="noVideoContent"><h2>Next Service Time</h2>{displayTime}</div>
    }

    const getContents = () => {
        var cs = props.currentService;
        if (cs === undefined || cs === null || cs.localEndTime === undefined) return <div id="noVideoContent"><h2>Check back for new services</h2></div>;
        else if (new Date() > cs.localEndTime) return <div id="noVideoContent"><h2>The current service has ended.</h2></div>;
        else {
            if (cs.localStartTime !== undefined && new Date() <= cs.localStartTime) return getCountdown(cs);
            else return getVideo(cs);
        }
    }
    const updateCurrentTime = () => { setCurrentTime(new Date().getTime()); }
    React.useEffect(() => {
        setLoadedTime(new Date().getTime());
        setInterval(updateCurrentTime, 1000);
    }, []);

    return (
        <div id="videoContainer">
            {getContents()}
        </div>
    );
}






