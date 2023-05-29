import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import DrawerNavigator from "./DrawerNavigator";
import { setNavigator } from "./navigationService";

export default (): React.ReactElement => {
  return (
    <NavigationContainer ref={setNavigator}>
      <DrawerNavigator />
    </NavigationContainer>
  );
};
