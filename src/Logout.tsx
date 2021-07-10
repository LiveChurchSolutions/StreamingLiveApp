import React from "react";
import UserContext from "./UserContext";
import { LogoutPage } from "./appBase/pageComponents";
//import { ChatHelper } from "./helpers/ChatHelper.old.txt";
import { UserHelper } from "./helpers/UserHelper";

export const Logout = () => {
  try {
    //ChatHelper.setName("Anonymous");
  } catch { }
  UserHelper.user.firstName = "Anonymous";
  UserHelper.user.lastName = "";
  UserHelper.isHost = false;

  const context = React.useContext(UserContext)
  return (<LogoutPage context={context} />);
}
