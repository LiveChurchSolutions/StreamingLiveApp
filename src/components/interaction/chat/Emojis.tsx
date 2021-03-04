import React from "react";

interface Props { selectedFunction: (emoji: string) => void }

export const Emojis: React.FC<Props> = (props) => {
    const getOptions = () => {
        var result = [];
        var emojis = ["😀", "😁", "🤣", "😉", "😊", "😇", "😍", "😜", "🤫", "🤨", "🙄", "😬", "😔", "😷", "🤯", "😎", "😲", "❤", "👋", "✋", "🤞", "👍", "👊", "👏", "🙌", "🙏"];
        for (let i = 0; i < emojis.length; i++) {
            result.push(<div key={i} className="col-2"><a href="about:blank" onClick={(e: React.MouseEvent) => { e.preventDefault(); props.selectedFunction(emojis[i]) }} >{emojis[i]}</a></div>)
        }
        return result;
    }

    return (<div id="emojiContent">
        <div className="row">
            {getOptions()}
        </div>
    </div>);
}




