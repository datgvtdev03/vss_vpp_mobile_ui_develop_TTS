import { default as React, useEffect, useLayoutEffect, useRef } from "react";
import {
  AppState,
  BackHandler,
  NativeModules,
  Text,
  TextInput,
  UIManager,
} from "react-native";
import CodePushContainer from "src/CodePushContainer";
import GrandLoadingPortal from "src/components/base/GrandLoadingPortal";
import LoadingPortal from "src/components/base/LoadingPortal";
import ModalPortal from "src/components/common/Modal/ModalPortal";
import NetworkStatus from "src/components/common/NetworkStatus";
import { globalData } from "src/constants/common";
import navigationService from "src/navigation/navigationService";
import { navigationRoutes } from "src/navigation/StackNavigator";
import { logout } from "src/utils/auth";
import Navigation from "./src/navigation/Navigation";

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

interface TextDefaultProps extends Text {
  defaultProps?: { allowFontScaling?: boolean };
}
// Disable scale font size
(Text as unknown as TextDefaultProps).defaultProps =
  (Text as unknown as TextDefaultProps).defaultProps || {};
(TextInput as unknown as TextDefaultProps).defaultProps =
  (TextInput as unknown as TextDefaultProps).defaultProps || {};

// eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
(Text as unknown as TextDefaultProps).defaultProps!.allowFontScaling = false;
// eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
(TextInput as unknown as TextDefaultProps).defaultProps!.allowFontScaling =
  false;

const App = (): React.ReactElement => {
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    let checkAble = false;
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        if (
          globalData.switchUserName !== "" &&
          globalData.userName !== "" &&
          globalData.switchUserName !== globalData.userName
        ) {
          logout();
          navigationService.reset(navigationRoutes.LOGIN);
        } else if (
          globalData.pathSwitchScreen !== "" &&
          globalData.keycloakToken
        ) {
          navigationService.navigate(navigationRoutes.MAIN);
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
  }, []);

  useLayoutEffect(() => {
    NativeModules.SplashScreen.hide();
  }, []);

  // disable hardware back
  useEffect(() => {
    const backAction = () => {
      navigationService.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CodePushContainer>
      <Navigation />
      <NetworkStatus />
      <ModalPortal />
      <LoadingPortal />
      <GrandLoadingPortal />
    </CodePushContainer>
  );
};

export default App;
