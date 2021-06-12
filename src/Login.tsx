import React from "react";
import { useCookies } from "react-cookie";
import { ApiHelper } from "./helpers"
import { Authenticated } from "./Authenticated";
import UserContext from "./UserContext";
import { useLocation } from "react-router-dom";
import { LoginPage } from "./appBase/pageComponents/LoginPage";
import { UserHelper, ConfigHelper, Permissions } from "./helpers";
import "./Login.css";
import { ChurchInterface, PersonInterface } from "./appBase/interfaces";
import { AppearanceHelper } from "./appBase/helpers/AppearanceHelper";

export const Login: React.FC = (props: any) => {
  const [cookies] = useCookies(["jwt"]);
  let { from } = (useLocation().state as any) || { from: { pathname: "/" } };
  const context = React.useContext(UserContext);

  const successCallback = () => {
    if (UserHelper.checkAccess(Permissions.messagingApi.chat.host)) {
      UserHelper.isHost = true;
    }
  }

  const performGuestLogin = async (churches: ChurchInterface[]) => {
    let person: PersonInterface;
    try {
      await UserHelper.loginAsGuest(churches, context);
      person = await ApiHelper.get(`/people/userid/${UserHelper.user.id}`, "MembershipApi");
      context.setUserName(person.name.display);
    } catch (err) {
      if (!person) {
        const { id, displayName, email } = UserHelper.user;
        const [first, last] = displayName.split(" ");
        const newPerson: PersonInterface = { userId: id, name: { first, last }, contactInfo: { email }, membershipStatus: "Guest" };
        await ApiHelper.post("/people", [newPerson], "MembershipApi");
      }
    }
  }

  if (context.userName === "" || !ApiHelper.isAuthenticated) {
    let search = new URLSearchParams(props.location.search);
    let jwt = search.get("jwt") || cookies.jwt;
    let auth = search.get("auth");
    if (!jwt) jwt = "";
    if (!auth) auth = "";

    return (
      <LoginPage
        auth={auth}
        context={context}
        requiredKeyName={true}
        jwt={jwt}
        successCallback={successCallback}
        logo={AppearanceHelper.getLogoLight(ConfigHelper.current?.appearance, null)}
        appName="StreamingLive"
        performGuestLogin={performGuestLogin}
      />
    );
  } else {
    let path = from.pathname === "/" ? "/people" : from.pathname;
    return <Authenticated location={path}></Authenticated>;
  }
};
