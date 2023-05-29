import { useEffect, useRef } from "react";
import { AppState } from "react-native";
import { globalData } from "src/constants/common";

import navigationService from "src/navigation/navigationService";
import { navigationRoutes } from "src/navigation/StackNavigator";

const useHome = () => {
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    let checkAble = false;
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        if (!globalData.keycloakToken) {
          navigationService.reset(navigationRoutes.LOGIN);
        } else {
          // switchAction();
        }
      }

      appState.current = nextAppState;
    });

    return () => {
      if (!checkAble) {
        subscription.remove();
        checkAble = true;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useHome;
