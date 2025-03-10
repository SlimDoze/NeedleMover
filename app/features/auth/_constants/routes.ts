import { RelativePathString } from "expo-router";

export const Auth_Routes: {Login: RelativePathString; ResetPassword: RelativePathString} = {
    Login: "../screens/login",
    ResetPassword: "../screens/reset",
  };
  

  
  export const Team_Routes: { Selection: RelativePathString } = {
    Selection: "../../teams/screens/selection",
  };