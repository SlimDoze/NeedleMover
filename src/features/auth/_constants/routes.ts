import { RelativePathString } from "expo-router";

export const AUTH_ROUTES: {LOGIN: RelativePathString; RESET_PASSWORD: RelativePathString} = {
    LOGIN: "../screens/login",
    RESET_PASSWORD: "../screens/reset",
  };
  

  
  export const TEAM_ROUTES: { SELECTION: RelativePathString } = {
    SELECTION: "../../teams/screens/selection",
  };
  export default function DummyComponent() { return null; }