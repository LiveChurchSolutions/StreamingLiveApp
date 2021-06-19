import { ApiHelper } from "../appBase/helpers/ApiHelper";

export class EnvironmentHelper {
    static AccountsApp = "";
    static AccessApi = "";
    static StreamingLiveApi = "";
    static MessagingApi = "";
    static MessagingSocket = "";
    static MembershipApi = "";
    static AdminUrl = "";
    static ContentRoot = "";
    static SubUrl = "";
    static churchAppsUrl = "";
    static GoogleAnalyticsTag = "";

    static init = () => {
      switch (process.env.REACT_APP_STAGE) {
        case "staging": EnvironmentHelper.initStaging(); break;
        case "prod": EnvironmentHelper.initProd(); break;
        default: EnvironmentHelper.initDev(); break;
      }

      ApiHelper.apiConfigs = [
        { keyName: "AccessApi", url: EnvironmentHelper.AccessApi, jwt: "", permisssions: [] },
        { keyName: "StreamingLiveApi", url: EnvironmentHelper.StreamingLiveApi, jwt: "", permisssions: [] },
        { keyName: "MessagingApi", url: EnvironmentHelper.MessagingApi, jwt: "", permisssions: [] },
        { keyName: "MembershipApi", url: EnvironmentHelper.MembershipApi, jwt: "", permisssions: [] }
      ];
    }

    static initDev = () => {
      EnvironmentHelper.AccountsApp = process.env.REACT_APP_ACCOUNTS_APP_URL || "";
      EnvironmentHelper.AccessApi = process.env.REACT_APP_ACCESS_API || "";
      EnvironmentHelper.StreamingLiveApi = process.env.REACT_APP_STREAMINGLIVE_API || "";
      EnvironmentHelper.MessagingApi = process.env.REACT_APP_MESSAGING_API || "";
      EnvironmentHelper.MessagingSocket = process.env.REACT_APP_MESSAGING_SOCKET || "";
      EnvironmentHelper.MembershipApi = process.env.REACT_APP_MEMBERSHIP_API || "";
      EnvironmentHelper.AdminUrl = process.env.REACT_APP_ADMIN_URL || "";
      EnvironmentHelper.ContentRoot = process.env.REACT_APP_CONTENT_ROOT || "";
      EnvironmentHelper.SubUrl = process.env.REACT_APP_SUB_URL || "";
      EnvironmentHelper.churchAppsUrl = process.env.REACT_APP_CHURCH_APPS_URL || "";
    }

    //NOTE: None of these values are secret.
    static initStaging = () => {
      EnvironmentHelper.AccountsApp = "https://accounts.staging.churchapps.org";
      EnvironmentHelper.AccessApi = "https://accessapi.staging.churchapps.org";
      EnvironmentHelper.StreamingLiveApi = "https://api.staging.streaminglive.church";
      EnvironmentHelper.MessagingApi = "https://messagingapi.staging.churchapps.org";
      EnvironmentHelper.MessagingSocket = "wss://socket.staging.churchapps.org";
      EnvironmentHelper.MembershipApi = "https://membershipapi.staging.churchapps.org";
      EnvironmentHelper.AdminUrl = "https://admin.staging.streaminglive.church";
      EnvironmentHelper.ContentRoot = "https://content.staging.churchapps.org";
      EnvironmentHelper.SubUrl = "https://{key}.staging.streaminglive.church";
      EnvironmentHelper.churchAppsUrl = "https://staging.churchapps.org";
    }

    //NOTE: None of these values are secret.
    static initProd = () => {
      EnvironmentHelper.AccountsApp = "https://accounts.churchapps.org";
      EnvironmentHelper.AccessApi = "https://accessapi.churchapps.org";
      EnvironmentHelper.StreamingLiveApi = "https://api.streaminglive.church";
      EnvironmentHelper.MessagingApi = "https://messagingapi.churchapps.org";
      EnvironmentHelper.MessagingSocket = "wss://socket.churchapps.org";
      EnvironmentHelper.MembershipApi = "https://membershipapi.churchapps.org"
      EnvironmentHelper.AdminUrl = "https://admin.streaminglive.church";
      EnvironmentHelper.ContentRoot = "https://content.churchapps.org";
      EnvironmentHelper.SubUrl = "https://{key}.streaminglive.church";
      EnvironmentHelper.GoogleAnalyticsTag = "UA-164774603-2";
      EnvironmentHelper.churchAppsUrl = "https://churchapps.org";
    }

}

