import React from "react";
import { Theme, ConfigurationInterface, EnvironmentHelper, ConfigHelper } from "./components";
import { RouteComponentProps } from "react-router-dom";


type TParams = { churchId: string, id: string };

export const Page = ({ match }: RouteComponentProps<TParams>) => {

    const [config, setConfig] = React.useState<ConfigurationInterface>({} as ConfigurationInterface);
    const [content, setContent] = React.useState("");

    const init = () => {
        const keyName = window.location.hostname.split(".")[0];
        const localThemeConfig = localStorage.getItem(`theme_${keyName}`);
        setConfig(JSON.parse(localThemeConfig) || {});
        const path = `${EnvironmentHelper.ContentRoot}/${match.params.churchId}/pages/${match.params.id}.html`;
        fetch(path)
            .then(response => response.text())
            .then(c => { setContent(c) });
    }


    React.useEffect(() => {
        init()
    }, []);

    return (
        <>
            <Theme config={config} />
            <div dangerouslySetInnerHTML={{ __html: content }} style={{ padding: 5 }} />
        </>);
}
