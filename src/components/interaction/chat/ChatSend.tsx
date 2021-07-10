import React, { KeyboardEvent } from "react";
import { Emojis } from ".";
import { ApiHelper, ChatHelper, ChatRoomInterface, ConfigHelper, MessageInterface } from "../../../helpers"

interface Props { room: ChatRoomInterface }

export const ChatSend: React.FC<Props> = (props) => {
  const [message, setMessage] = React.useState("");
  const [showEmojis, setShowEmojis] = React.useState(false);

  const handleSendMessage = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setMessage("");
      return;
    }
    sendMessage();
  }

  const sendMessage = () => {
    const { firstName, lastName } = ChatHelper.current.user;
    const msg: MessageInterface = { churchId: ConfigHelper.current.churchId, content: message.trim(), conversationId: props.room.conversation.id, displayName: `${firstName} ${lastName}`, messageType: "message" }
    ApiHelper.postAnonymous("/messages/send", [msg], "MessagingApi");
    setMessage("");
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e);
    setMessage(e.currentTarget.value);
  }
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => { if (e.keyCode === 13) sendMessage(); }
  const toggleEmojis = (e: React.MouseEvent) => { e.preventDefault(); setShowEmojis(!showEmojis); }
  const insertEmoji = (emoji: string) => { setMessage(message + emoji); }

  let emojiContent = (showEmojis) ? <Emojis selectedFunction={insertEmoji} /> : null;

  return (
    <div id="chatSend">
      {emojiContent}
      <div className="input-group" id="sendPublic">
        <div className="input-group-prepend">
          <a href="about:blank" onClick={toggleEmojis} data-field="sendText" className="btn btn-outline-secondary emojiButton"><span role="img" aria-label="emoji">😀</span></a>
        </div>
        <input type="text" className="form-control" id="sendChatText" value={message} onChange={handleChange} onKeyDown={handleKeyDown} autoComplete="off" />
        <div className="input-group-append">
          <a id="sendMessageButton" className="btn btn-primary" href="about:blank" onClick={handleSendMessage}>Send</a>
        </div>
      </div>
    </div>
  );
}

