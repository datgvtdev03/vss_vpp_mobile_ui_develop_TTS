import React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from "react-native";
import defaultStyles from "src/common/styles";
import colors from "src/constants/colors";
import fonts from "src/constants/fonts";
import Svgs from "src/constants/Svgs";
import Modal, { Animation } from "./Modal";
import ModalPortal from "./Modal/ModalPortal";

const widthScreen = Dimensions.get("window").width;
const height = 0.9 * widthScreen;

interface Button {
  text?: string;
  onPress?: () => void;
  irremovable?: boolean;
}

interface Options {
  children?: React.ReactNode;
  onDismiss?: () => void;
  cancelable?: boolean;
}

export enum AlertType {
  Error = 1,
  Success = 2,
  Warning = 3,
  Info = 4,
  Noti = 5,
  FACEID = 6,
}

export type AnimationConfig = {
  initialValue?: number;
  useNativeDriver?: boolean;
  animationDuration?: number;
};

class DialogAnimation extends Animation {
  useNativeDriver: boolean;
  animate: Animated.Value;
  animationDuration: number;

  constructor({
    initialValue = 0,
    useNativeDriver = true,
    animationDuration = 200,
  }: AnimationConfig = {}) {
    super();
    this.animate = new Animated.Value(initialValue);
    this.useNativeDriver = useNativeDriver;
    this.animationDuration = animationDuration;
  }

  in(onFinished?: () => void): void {
    Animated.timing(this.animate, {
      toValue: 1,
      duration: this.animationDuration,
      useNativeDriver: this.useNativeDriver,
    }).start(onFinished);
  }

  out(onFinished?: () => void): void {
    Animated.timing(this.animate, {
      toValue: 0,
      duration: this.animationDuration,
      useNativeDriver: this.useNativeDriver,
    }).start(onFinished);
  }

  getAnimations(): unknown {
    return {
      opacity: this.animate,
      transform: [
        {
          scale: this.animate.interpolate({
            inputRange: [0, 1],
            outputRange: [0.8, 1],
          }),
        },
      ],
    };
  }
}

export default class DialogAlert {
  static show(
    alertType: AlertType,
    title = "",
    message = "",
    buttons: Button[] = [],
    options: Options = {},
    logo?: React.ReactElement
  ): void {
    if (ModalPortal.size > 0) return;
    const { children } = options;
    const idObj = { current: -1 };

    function onPressActionButton(button: Button) {
      let onPress: () => void = () => null;
      if (button && button.onPress && typeof button.onPress === "function") {
        onPress = button.onPress;
      }
      if (button.irremovable) {
        if (typeof button.onPress === "function") {
          button.onPress();
        }
      } else {
        dismissDialog(onPress);
      }
    }

    function dismissDialog(callback: () => void = () => null) {
      // ModalPortal.dismissAll();
      ModalPortal.dismiss(idObj.current);
      if (typeof callback === "function") {
        callback();
      }
    }

    function onDismiss() {
      if (
        options &&
        options.onDismiss &&
        typeof options.onDismiss === "function"
      ) {
        options.onDismiss();
      }
    }

    // function onTouchOutside() {
    //   if (
    //     options &&
    //     (options.cancelable === true || options.cancelable === undefined)
    //   ) {
    //     dismissDialog();
    //   }
    // }

    // function onHardwareBackPress() {
    //   if (
    //     options &&
    //     (options.cancelable === true || options.cancelable === undefined)
    //   ) {
    //     dismissDialog();
    //   }
    //   return true;
    // }

    if (ModalPortal.size === 0) {
      // restrict 1 modal shown at a time
      idObj.current = ModalPortal.show(
        <Modal
          useNativeDriver
          visible={true}
          width={0.9}
          onDismiss={onDismiss}
          // onTouchOutside={() => onTouchOutside()}
          // onHardwareBackPress={() => onHardwareBackPress()}
          onTouchOutside={() => null}
          modalStyle={styles.bgTransparent}
          onHardwareBackPress={() => true}
          // modalAnimation={dialogAnimation}
          // modalAnimation={new ScaleAnimation()}
          modalAnimation={new DialogAnimation()}
        >
          <KeyboardAvoidingView
            style={styles.keyboardAvoidingView}
            behavior="padding"
            enabled={Platform.OS === "ios"}
          >
            <View style={styles.keyboardAvoidingContentView}>
              <View style={styles.container}>
                {title ? (
                  <View style={styles.titleContainer}>
                    {logo ? (
                      logo
                    ) : (
                      <>
                        {alertType === AlertType.Error && <Svgs.AlertError />}
                        {alertType === AlertType.Success && (
                          <Svgs.AlertSuccess />
                        )}
                        {alertType === AlertType.Warning && (
                          <Svgs.AlertWarning />
                        )}
                        {alertType === AlertType.Info && <Svgs.AlertInfo />}
                        {alertType === AlertType.Noti && <Svgs.AlertNoti />}
                      </>
                    )}
                    <Text style={styles.title}>{title}</Text>
                  </View>
                ) : null}
                {message ? <Text style={styles.message}>{message}</Text> : null}
                {Boolean(children) && children}
                {buttons && buttons.length === 1 && (
                  <TouchableOpacity
                    onPressIn={() => onPressActionButton(buttons[0])}
                    style={[
                      styles.button,
                      styles.halfWidth,
                      alertType === AlertType.Error
                        ? styles.buttonFailed
                        : alertType === AlertType.Warning
                        ? styles.buttonWarning
                        : alertType === AlertType.Info
                        ? styles.buttonInfo
                        : alertType === AlertType.Success
                        ? styles.buttonSuccess
                        : alertType === AlertType.Noti
                        ? styles.buttonNoti
                        : null,
                    ]}
                  >
                    <Text style={styles.buttonText}>{buttons[0].text}</Text>
                  </TouchableOpacity>
                )}
                {buttons && buttons.length === 2 && (
                  <View style={defaultStyles.row}>
                    <TouchableOpacity
                      onPressIn={() => onPressActionButton(buttons[0])}
                      style={[
                        styles.button,
                        defaultStyles.flex_1,
                        defaultStyles.mr_1,
                        alertType === AlertType.Error
                          ? styles.buttonOutlinedFailed
                          : alertType === AlertType.Warning
                          ? styles.buttonOutlinedWarning
                          : alertType === AlertType.Info
                          ? styles.buttonOutlinedInfo
                          : alertType === AlertType.Success
                          ? styles.buttonOutlinedSuccess
                          : alertType === AlertType.Noti
                          ? styles.buttonOutlinedNoti
                          : null,
                      ]}
                    >
                      <Text
                        style={[
                          styles.buttonText,
                          alertType === AlertType.Error && {
                            color: colors.color_error,
                          },
                          alertType === AlertType.Warning && {
                            color: colors.color_warning,
                          },
                          alertType === AlertType.Info && {
                            color: colors.color_info,
                          },
                          alertType === AlertType.Success && {
                            color: colors.color_success,
                          },
                          alertType === AlertType.Noti && {
                            color: colors.color_noti,
                          },
                        ]}
                      >
                        {buttons[0].text}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPressIn={() => onPressActionButton(buttons[1])}
                      style={[
                        styles.button,
                        defaultStyles.flex_1,
                        defaultStyles.ml_1,
                        alertType === AlertType.Error
                          ? styles.buttonFailed
                          : alertType === AlertType.Warning
                          ? styles.buttonWarning
                          : alertType === AlertType.Info
                          ? styles.buttonInfo
                          : alertType === AlertType.Success
                          ? styles.buttonSuccess
                          : alertType === AlertType.Noti
                          ? styles.buttonNoti
                          : null,
                      ]}
                    >
                      <Text style={styles.buttonText}>{buttons[1].text}</Text>
                    </TouchableOpacity>
                  </View>
                )}
                {!buttons ||
                  (buttons && buttons.length === 0 && (
                    <TouchableOpacity
                      onPressIn={() => dismissDialog()}
                      style={[
                        styles.button,
                        styles.halfWidth,
                        alertType === AlertType.Error
                          ? styles.buttonFailed
                          : alertType === AlertType.Warning
                          ? styles.buttonWarning
                          : alertType === AlertType.Info
                          ? styles.buttonInfo
                          : alertType === AlertType.Success
                          ? styles.buttonSuccess
                          : alertType === AlertType.Noti
                          ? styles.buttonNoti
                          : null,
                      ]}
                    >
                      <Text style={styles.buttonText}>{`Đóng`}</Text>
                    </TouchableOpacity>
                  ))}
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      );
    }
  }

  static showSuccess(
    title = "",
    message = "",
    buttons: Button[] = [],
    options: Options = {},
    logo?: React.ReactElement
  ): void {
    DialogAlert.show(AlertType.Success, title, message, buttons, options, logo);
  }

  static showInfo(
    title = "",
    message = "",
    buttons: Button[] = [],
    options: Options = {},
    logo?: React.ReactElement
  ): void {
    DialogAlert.show(AlertType.Info, title, message, buttons, options, logo);
  }

  static showError(
    title = "",
    message = "",
    buttons: Button[] = [],
    options: Options = {},
    logo?: React.ReactElement
  ): void {
    DialogAlert.show(AlertType.Error, title, message, buttons, options, logo);
  }

  static showWarning(
    title = "",
    message = "",
    buttons: Button[] = [],
    options: Options = {},
    logo?: React.ReactElement
  ): void {
    DialogAlert.show(AlertType.Warning, title, message, buttons, options, logo);
  }

  static showNoti(
    title = "",
    message = "",
    buttons: Button[] = [],
    options: Options = {},
    logo?: React.ReactElement
  ): void {
    DialogAlert.show(AlertType.Noti, title, message, buttons, options, logo);
  }
  static showFaceId(
    title = "",
    message = "",
    buttons: Button[] = [],
    options: Options = {},
    logo?: React.ReactElement
  ): void {
    DialogAlert.show(AlertType.FACEID, title, message, buttons, options, logo);
  }

  static showCustomView(children: React.ReactElement): void {
    ModalPortal.show(
      <Modal
        useNativeDriver
        visible={true}
        width={0.9}
        // onTouchOutside={ModalPortal.dismissAll}
        // onHardwareBackPress={() => {
        //   ModalPortal.dismissAll();
        //   return true;
        // }}
        onTouchOutside={() => null}
        onHardwareBackPress={() => true}
        modalStyle={styles.bgTransparent}
        // modalAnimation={new ScaleAnimation()}
        modalAnimation={new DialogAnimation()}
      >
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior="padding"
          enabled={Platform.OS === "ios"}
        >
          <View style={styles.keyboardAvoidingContentView}>{children}</View>
        </KeyboardAvoidingView>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 16,
  },
  image: {
    width: "100%",
    height: height / 2,
  },
  title: {
    fontSize: 16,
    fontFamily: fonts.medium,
    color: colors.black,
    marginTop: 25,
    marginHorizontal: 15,
  },
  message: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.color_707070,
    marginTop: 10,
    textAlign: "center",
  },
  negative: {
    fontSize: 16,
    color: colors.color_0A0A12,
  },
  positive: {
    fontSize: 16,
    color: colors.color_0A0A12,
  },
  titleContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },
  button: {
    paddingVertical: 8,
    marginTop: 16,
    borderWidth: 1,
    borderRadius: 32,
    borderColor: "transparent",
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonSuccess: {
    borderColor: colors.color_success,
    backgroundColor: colors.color_success,
  },
  buttonFailed: {
    borderColor: colors.color_error,
    backgroundColor: colors.color_error,
  },
  buttonWarning: {
    borderColor: colors.color_warning,
    backgroundColor: colors.color_warning,
  },
  buttonInfo: {
    borderColor: colors.color_info,
    backgroundColor: colors.color_info,
  },
  buttonNoti: {
    borderColor: colors.color_noti,
    backgroundColor: colors.color_noti,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 16,
    fontFamily: fonts.medium,
  },
  buttonOutlinedSuccess: {
    borderColor: colors.color_success,
    backgroundColor: colors.white,
  },
  buttonOutlinedFailed: {
    borderColor: colors.color_error,
    backgroundColor: colors.white,
  },
  buttonOutlinedWarning: {
    borderColor: colors.color_warning,
    backgroundColor: colors.white,
  },
  buttonOutlinedInfo: {
    borderColor: colors.color_info,
    backgroundColor: colors.white,
  },
  buttonOutlinedNoti: {
    borderColor: colors.color_noti,
    backgroundColor: colors.white,
  },
  halfWidth: {
    width: "50%",
  },
  keyboardAvoidingView: {
    height: "100%",
    justifyContent: "center",
  },
  keyboardAvoidingContentView: {
    backgroundColor: "white",
    borderRadius: 8,
    overflow: "hidden",
  },
  bgTransparent: {
    backgroundColor: "transparent",
  },
});
