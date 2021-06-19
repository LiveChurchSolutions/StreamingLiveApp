import { Permissions as PermissionsBase } from "../appBase/interfaces/Permissions";

export class Permissions extends PermissionsBase {
    static streamingLiveApi = {
      links: {
        edit: { api: "StreamingLiveApi", contentType: "Links", action: "Edit" }
      },
      pages: {
        edit: { api: "StreamingLiveApi", contentType: "Pages", action: "Edit" }
      },
      services: {
        edit: { api: "StreamingLiveApi", contentType: "Services", action: "Edit" }
      },
      tabs: {
        edit: { api: "StreamingLiveApi", contentType: "Tabs", action: "Edit" }
      },
      settings: {
        edit: { api: "StreamingLiveApi", contentType: "Settings", action: "Edit" }
      }
    };

    static messagingApi = {
      chat: {
        host: { api: "MessagingApi", contentType: "Chat", action: "Host" }
      }
    }
}
