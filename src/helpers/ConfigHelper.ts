import { ServicesHelper, EnvironmentHelper } from '.'
import { ApiHelper, UniqueIdHelper } from '../components';
export interface ColorsInterface { primary: string, contrast: string, header: string }
export interface LogoInterface { url: string, image: string }
export interface ButtonInterface { text: string, url: string }
export interface TabInterface { text: string, url: string, icon: string, type: string, data: string, updated?: boolean }
export interface ServiceInterface { videoUrl: string, serviceTime: string, duration: string, earlyStart: string, chatBefore: string, chatAfter: string, provider: string, providerKey: string, localCountdownTime?: Date, localStartTime?: Date, localEndTime?: Date, localChatStart?: Date, localChatEnd?: Date, label: string }
export interface ConfigurationInterface { keyName?: string, churchId?: string, primaryColor?: string, primaryContrast?: string, secondaryColor?: string, secondaryContrast?: string, logoSquare?: string, logoHeader?: string, buttons?: ButtonInterface[], tabs?: TabInterface[], services?: ServiceInterface[] }


export class ConfigHelper {
    static current: ConfigurationInterface;

    static async load(keyName: string) {
        var result: ConfigurationInterface = await fetch(`${EnvironmentHelper.StreamingLiveApi}/preview/data/${keyName}`).then(response => response.json());
        
        // fetch theme colors and logo
        const churchId = await ConfigHelper.loadChurchId(keyName);
        const appearanceConfigs: ConfigurationInterface = await ApiHelper.getAnonymous("/settings/public/" + churchId, "AccessApi");
        result = { ...result, ...appearanceConfigs };

        delete appearanceConfigs.logoHeader;
        delete appearanceConfigs.logoSquare;
        localStorage.setItem(`theme_${keyName}`, JSON.stringify(appearanceConfigs));

        ServicesHelper.updateServiceTimes(result);
        result.keyName = keyName;
        ConfigHelper.current = result;
        return result;
    }

    static async loadChurchId(keyName: string) {
        const lsKey = "keyName_" + keyName;
        var churchId = localStorage.getItem(lsKey) || "";
        if (churchId === "") {
            const church = await ApiHelper.getAnonymous("/churches/lookup/?subDomain=" + keyName, "AccessApi")
            churchId = church.id;
            if (!UniqueIdHelper.isMissing(churchId)) localStorage.setItem(lsKey, churchId);
        }
        return churchId;
    }

    static setTabUpdated(tabType: string) {
        for (let i = 0; i < ConfigHelper.current.tabs.length; i++) {
            var t = ConfigHelper.current.tabs[i];
            if (t.type === tabType) t.updated = true;
        }
    }


}

