import React from "react";
import { ServicesHelper, ConversationInterface, TabInterface, ApiHelper, UserHelper, EnvironmentHelper, ConfigHelper, ConfigurationInterface, ServiceInterface, Header, VideoContainer, InteractionContainer, ChatStateInterface, ConnectionInterface, MessageInterface } from "./components";
import { ChatHelper } from "./helpers/ChatHelper";
import { SocketHelper } from "./helpers/SocketHelper";

export const Home: React.FC = () => {
  const [cssUrl, setCssUrl] = React.useState(undefined);
  const [config, setConfig] = React.useState<ConfigurationInterface>({} as ConfigurationInterface);
  const [currentService, setCurrentService] = React.useState<ServiceInterface | null>(null);
  const [chatState, setChatState] = React.useState<ChatStateInterface>(null);

  const loadConfig = React.useCallback(async (firstLoad: boolean) => {
    const keyName = window.location.hostname.split(".")[0];

    const preview = !EnvironmentHelper.RequirePublish || await ConfigHelper.getQs('preview') === '1';
    var cssUrl = (preview) ? EnvironmentHelper.StreamingLiveApi + "/preview/css/" + keyName : EnvironmentHelper.ContentRoot + "/data/" + keyName + "/data.css?nocache=" + (new Date()).getTime()
    setCssUrl(cssUrl);

    ConfigHelper.load(keyName).then(data => {
      var d: ConfigurationInterface = data;

      ChatHelper.initChat().then(() => {
        joinMainRoom(data.churchId);
      });


      checkHost(d);
      setConfig(d);
      //if (firstLoad) initChat();
    });

  }, []);


  const joinMainRoom = async (churchId: string) => {
    const conversation: ConversationInterface = await ApiHelper.getAnonymous("/conversations/current/" + churchId + "/streamingLive/chat", "MessagingApi");
    ChatHelper.current.mainRoom = {
      messages: [],
      attendance: { conversationId: conversation.id, totalViewers: 0, viewers: [] },
      callout: { content: "" },
      conversationId: conversation.id
    };
    setChatState(ChatHelper.current);
    ChatHelper.joinRoom(conversation);
  }


  const checkHost = async (d: ConfigurationInterface) => {
    if (UserHelper.isHost) {
      d.tabs.push({ type: "hostchat", text: "Host Chat", icon: "fas fa-users", data: "", url: "" });
      const conversation: ConversationInterface = await ApiHelper.get("/conversations/current/" + d.churchId + "/streamingLiveHost/chat", "MessagingApi");
      ChatHelper.current.hostRoom = {
        messages: [],
        attendance: { conversationId: conversation.id, totalViewers: 0, viewers: [] },
        callout: { content: "" },
        conversationId: conversation.id
      };
      setChatState(ChatHelper.current);
      ChatHelper.joinRoom(conversation);
    }
  }

  /*
  const initChat = () => {
    setTimeout(function () {
      ChatHelper.init((state: ChatStateInterface) => { setChatState(state); setConfig(ConfigHelper.current); });
      setChatState(ChatHelper.state);
    }, 500);
  }*/

  const handleNameUpdate = (displayName: string) => {
    const data = { socketId: SocketHelper.socketId, name: displayName };
    ApiHelper.postAnonymous("/connections/setName", data, "MessagingApi");
    ChatHelper.current.user.displayName = displayName;
    ChatHelper.onChange();
  }

  const handleLoginChange = () => {
    //setChatUser(ChatHelper.user);
    //loadConfig(false);
  }


  const initUser = () => {
    const chatUser = ChatHelper.getUser();
    if (ApiHelper.isAuthenticated) {
      chatUser.displayName = UserHelper.user?.displayName || "Anonymous";
      chatUser.isHost = true;
      ChatHelper.current.user = chatUser;
    }
  }


  //setChatUser(ChatHelper.user);*/

  React.useEffect(() => {
    ChatHelper.onChange = () => { setChatState({ ...ChatHelper.current }); }
    ServicesHelper.initTimer((cs) => { setCurrentService(cs) });
    loadConfig(true);
    setCurrentService(ServicesHelper.currentService);
    initUser();
  }, [loadConfig]);


  if (chatState === null) {
    return (<>Loading..</>);
  } else return (
    <>
      <link rel="stylesheet" href={cssUrl} />
      <div id="liveContainer">
        <Header homeUrl={config.logo?.url} logoUrl={config.logo?.image} buttons={config.buttons} user={chatState?.user} nameUpdateFunction={handleNameUpdate} loginChangeFunction={handleLoginChange} />
        <div id="body">
          <VideoContainer currentService={currentService} />
          <InteractionContainer tabs={config.tabs} chatState={chatState} />
        </div>
      </div>
    </>
  );
}
