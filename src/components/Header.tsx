import React from "react";
import { Link } from "react-router-dom"
import { NavItems, UserInterface, ChatName, UserHelper, EnvironmentHelper, ApiHelper, ChatHelper, ConfigHelper } from "."
import { AppearanceHelper } from "../appBase/helpers/AppearanceHelper";

interface Props {
  user: UserInterface,
  nameUpdateFunction: (displayName: string) => void
}

export const Header: React.FC<Props> = (props) => {
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const [promptName, setPromptName] = React.useState(false);

  const toggleUserMenu = (e: React.MouseEvent) => { e.preventDefault(); setShowUserMenu(!showUserMenu); }

  const updateName = (displayName: string) => {
    setShowUserMenu(false);
    props.nameUpdateFunction(displayName);
  }

  const getLoginLink = () => {
    if (!ApiHelper.isAuthenticated) return (<Link to="/login" className="nav-link">Login</Link>);
    else return (<Link to="/logout" className="nav-link">Logout</Link>);
  }

  const getProfileLink = () => {
    if (!ApiHelper.isAuthenticated) return (<li className="nav-item"><ChatName user={props.user} updateFunction={updateName} promptName={promptName} /></li>);
    else {
      const jwt = ApiHelper.getConfig("AccessApi").jwt;
      const profileUrl = `${EnvironmentHelper.AccountsApp}/login?jwt=${jwt}&returnUrl=/profile`;
      return (<li className="nav-item"><a href={profileUrl} target="_blank" rel="noopener noreferrer" className="nav-link">Profile</a></li>);
    }
  }
  const getSettingLink = () => {
    if (UserHelper.isHost) return (
      <li className="nav-item"><Link to="/admin/settings" className="nav-link">Admin Dashboard</Link></li>
    );
  }

  const getUserMenu = () => {
    if (showUserMenu) return (
      <div id="userMenu">
        <div>
          <ul className="nav flex-column d-xl-none">
            <NavItems />
          </ul>
          <ul className="nav flex-column">
            {getSettingLink()}
            {getProfileLink()}
            <li className="nav-item">{getLoginLink()}</li>
          </ul>
        </div>
      </div>)
    else return null;
  }

  /*
    var imgSrc = "/images/logo-header.png";
    if (props.logoUrl !== undefined) {
        if (props.logoUrl.startsWith("data:")) imgSrc = props.logoUrl;
        else imgSrc = EnvironmentHelper.ContentRoot + "/" + props.logoUrl;
    }*/
  let imgSrc = AppearanceHelper.getLogo(ConfigHelper.current?.appearance, "/images/logo.png", ConfigHelper.current?.appearance?.primaryColor || "#FFF");

  setTimeout(() => {
    try {
      const displayName = ChatHelper.current.user.displayName;
      if (displayName === "" || displayName === "Anonymous") {
        if (!promptName) {
          setShowUserMenu(true);
          setPromptName(true);
        }
      }
    } catch { }
  }, 30000);

  return (
    <>
      <div id="header">
        <div id="logo"><img src={imgSrc} alt="logo" /></div>
        <div id="liveButtons" className="d-none d-xl-flex">
          <div>
            <ul className="nav nav-fill">
              <NavItems />
            </ul>
          </div>
        </div>
        <div id="userLink"><div><a href="about:blank" onClick={toggleUserMenu}>{props.user?.displayName || "Loading"} <i className="fas fa-chevron-down"></i></a></div></div>
      </div>
      {getUserMenu()}
    </>
  );
}

