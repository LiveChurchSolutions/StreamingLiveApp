import { ApiHelper } from "../appBase/helpers/ApiHelper";

export class EnvironmentHelper {
    static AccessApi = "";
    static StreamingLiveApi = "";
    static ChatApiUrl = "";
    static AdminUrl = "";
    static ContentRoot = "";
    static SubUrl = "";
    static RequirePublish = false;

    static init = () => {
        switch (process.env.REACT_APP_STAGE) {
            case "staging": EnvironmentHelper.initStaging(); break;
            case "prod": EnvironmentHelper.initProd(); break;
            default: EnvironmentHelper.initDev(); break;
        }

        ApiHelper.apiConfigs = [
            { keyName: "AccessApi", url: EnvironmentHelper.AccessApi, jwt: "", permisssions: [] },
            { keyName: "StreamingLiveApi", url: EnvironmentHelper.StreamingLiveApi, jwt: "", permisssions: [] },
        ];
        ApiHelper.defaultApi = "StreamingLiveApi";
    }

    static initDev = () => {
        EnvironmentHelper.AccessApi = process.env.REACT_APP_ACCESS_API || "";
        EnvironmentHelper.StreamingLiveApi = process.env.REACT_APP_STREAMINGLIVE_API || "";
        EnvironmentHelper.ChatApiUrl = process.env.REACT_APP_CHAT_API || "";
        EnvironmentHelper.AdminUrl = process.env.REACT_APP_ADMIN_URL || "";
        EnvironmentHelper.ContentRoot = process.env.REACT_APP_CONTENT_ROOT || "";
        EnvironmentHelper.SubUrl = process.env.REACT_APP_SUB_URL || "";
        EnvironmentHelper.RequirePublish = process.env.REACT_APP_REQUIRE_PUBLISH === "true";
    }

    //NOTE: None of these values are secret.
    static initStaging = () => {
        EnvironmentHelper.AccessApi = "https://accessapi.staging.churchapps.org";
        EnvironmentHelper.StreamingLiveApi = "https://api.staging.streaminglive.church";
        EnvironmentHelper.ChatApiUrl = "wss://chat.staging.streaminglive.church";
        EnvironmentHelper.AdminUrl = "https://admin.staging.streaminglive.church";
        EnvironmentHelper.ContentRoot = "";
        EnvironmentHelper.SubUrl = "https://{key}.staging.streaminglive.church";
        EnvironmentHelper.RequirePublish = true;
    }

    //NOTE: None of these values are secret.
    static initProd = () => {
        EnvironmentHelper.AccessApi = "https://accessapi.churchapps.org";
        EnvironmentHelper.StreamingLiveApi = "https://api.streaminglive.church";
        EnvironmentHelper.ChatApiUrl = "wss://chat.streaminglive.church";
        EnvironmentHelper.AdminUrl = "https://admin.streaminglive.church";
        EnvironmentHelper.ContentRoot = "";
        EnvironmentHelper.SubUrl = "https://{key}.streaminglive.church";
        EnvironmentHelper.RequirePublish = true;
    }

}

