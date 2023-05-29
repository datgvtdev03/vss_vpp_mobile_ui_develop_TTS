import { useEffect, useRef } from "react";
import { AppState, DeviceEventEmitter } from "react-native";
import DialogAlert from "src/components/common/DialogAlert";
import navigationService from "src/navigation/navigationService";
import { navigationRoutes } from "src/navigation/StackNavigator";

const useCheckAppState = () => {
  const sessionRef = useRef(null);
  const startTimer = () => {
    sessionRef.current = setTimeout(() => {
      DialogAlert.showWarning("Thông báo", "Phiên đăng nhập đã hết hiệu lực!", [
        {
          text: "Đồng ý",
          onPress: () => {
            navigationService.reset(navigationRoutes.LOGIN);
          },
        },
      ]);
    }, 10 * 60 * 1000);
  };

  const clearTimer = () => {
    // Handle an undefined timer rather than null
    sessionRef.current ? clearTimeout(sessionRef.current) : null;
  };

  useEffect(() => {
    DeviceEventEmitter.addListener("timer", clearTimer);
  }, []);

  const _handleAppStateChange = (nextAppState) => {
    if (nextAppState === "active") {
      clearTimer();
    }

    if (nextAppState === "background") {
      startTimer();
    }
  };

  useEffect(() => {
    const event = AppState.addEventListener("change", _handleAppStateChange);
    return () => {
      event.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useCheckAppState;
