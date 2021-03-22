import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { ProfilePage } from "./components";
import { Home } from "./Home"
import { Logout } from "./Logout";
import { SettingsPage } from './admin/settings/SettingsPage'
import { Page } from "./Page"

interface Props { location: any }

export const Authenticated: React.FC<Props> = (props) => {
    return (
        <Switch>
            <Route path="/admin/settings"><SettingsPage /></Route>
            <Route path="/profile"><ProfilePage /></Route>
            <Route path="/login"><Redirect to="/" /></Route>
            <Route path="/forgot"  ><Redirect to="/" /></Route>
            <Route path="/logout"><Logout /></Route>
            <Route path="/pages/:churchId/:id" component={Page} ></Route>
            <Route path="/"><Home /></Route>

        </Switch>
    );
}

