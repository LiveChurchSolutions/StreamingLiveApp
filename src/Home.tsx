import React from "react";
import { ServicesHelper, ConversationInterface, TabInterface, ApiHelper, UserHelper, EnvironmentHelper, ConfigHelper, ConfigurationInterface, ServiceInterface, Header, VideoContainer, InteractionContainer, ChatStateInterface } from "./components";
import { ChatHelper } from "./helpers/ChatHelper";

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
      ApiHelper.getAnon("/conversations/current/" + d.churchId + "/streamingLive/chat", "MessagingApi").then((conversation: ConversationInterface) => {
        ChatHelper.setMainConversationId(conversation.id);
      });

      checkHost(d);
      setConfig(d);
      //if (firstLoad) initChat();
    });

  }, []);

  const checkHost = (d: ConfigurationInterface) => {
    if (UserHelper.isHost) {
      var tab: TabInterface = { type: "hostchat", text: "Host Chat", icon: "fas fa-users", data: "", url: "" }
      d.tabs.push(tab);
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
    /*
    var u = { ...chatUser };
    u.displayName = displayName;
    setChatUser(u);
    ChatHelper.setName(displayName);*/
  }

  const handleLoginChange = () => {
    /*
    setChatUser(ChatHelper.user);
    loadConfig(false);*/
  }

  /*
  ChatHelper.socketConnected = false;

  const chatUser = ChatHelper.getUser();
  if (ApiHelper.isAuthenticated) {
    chatUser.displayName = UserHelper.user?.displayName || "Anonymous";
    chatUser.isHost = true;
    ChatHelper.user = chatUser;
  }
  setChatUser(ChatHelper.user);*/
  React.useEffect(() => {
    ChatHelper.onChange = () => { setChatState(ChatHelper.current) }
    ServicesHelper.initTimer((cs) => { setCurrentService(cs) });
    loadConfig(true);
    setCurrentService(ServicesHelper.currentService);
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
