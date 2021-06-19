import React from "react";
import { Helmet } from "react-helmet"
import { ConfigHelper } from "../helpers";

export const Theme = () => {

  const defaultColors = {
    primaryColor: "#08A0CC",
    primaryContrast: "#FFFFFF",
    secondaryColor: "#FFBA1A",
    secondaryContrast: "#000000"
  }

  let css = null;
  if (ConfigHelper.current.keyName) {
    css = (<style type="text/css">{`
      :root { 
        --primaryColor: ${ConfigHelper.current.appearance?.primaryColor || defaultColors.primaryColor}; 
        --primaryContrast: ${ConfigHelper.current.appearance?.primaryContrast || defaultColors.primaryContrast}; 
        --secondaryColor: ${ConfigHelper.current.appearance?.secondaryColor || defaultColors.secondaryColor};
        --secondaryContrast: ${ConfigHelper.current.appearance?.secondaryContrast || defaultColors.secondaryContrast};
      }
      `}</style>);
  }

  return (<Helmet>{css}</Helmet>);
}

