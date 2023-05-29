import React, { Component } from "react";
import {
  Animated,
  Easing,
  KeyboardAvoidingView,
  Modal,
  StyleSheet,
  Text,
  ViewStyle,
} from "react-native";
import Divider from "./Divider";

interface Props {
  height?: number;
  showDuration?: number;
  onOpen?: () => void;
  onClose?: () => void;
  style?: ViewStyle;
  cancelable?: boolean;
}

interface State {
  visible: boolean;
  sheetAnim: Animated.Value;
}

class BottomSheet extends Component<Props, State> {
  static defaultProps = {
    height: 200,
    showDuration: 200,
  };

  translateY = 0;
  constructor(props: Props) {
    super(props);
    this.translateY = props.height || 200;
    this.state = {
      visible: false,
      sheetAnim: new Animated.Value(this.translateY),
    };
  }

  show = (): void => {
    this.setState({ visible: true }, () => {
      this.showSheet();
      this.props?.onOpen?.();
    });
  };

  hide = (): void => {
    this.hideSheet(() => {
      this.setState({ visible: false });
      this.props?.onClose?.();
    });
  };

  showSheet(callback: () => void = () => null): void {
    Animated.timing(this.state.sheetAnim, {
      toValue: 0,
      duration: this.props.showDuration,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start(callback);
  }

  hideSheet(callback: () => void = () => null): void {
    Animated.timing(this.state.sheetAnim, {
      toValue: this.translateY,
      duration: 200,
      useNativeDriver: true,
    }).start(callback);
  }

  onRequestClose = (): void => {
    this.hide();
  };

  onTouchOutside = (): void => {
    if (this.props.cancelable === true || this.props.cancelable === undefined) {
      this.hide();
    }
  };

  render(): React.ReactElement {
    const { visible, sheetAnim } = this.state;

    return (
      <Modal
        statusBarTranslucent
        visible={visible}
        animationType={"none"}
        transparent
        onRequestClose={this.onRequestClose}
      >
        <KeyboardAvoidingView behavior="padding" style={[styles.wrapper]}>
          <>
            <Text style={styles.overlay} onPress={this.onTouchOutside} />
            <Animated.View
              style={[
                styles.body,
                {
                  height: this.translateY,
                  transform: [{ translateY: sheetAnim }],
                },
              ]}
            >
              <Divider
                lineSize={5}
                size={56}
                paddingMainAxis={[12, 16]}
                color={"#C8C8CA"}
              />
              {Boolean(this.props.children) && this.props.children}
            </Animated.View>
          </>
        </KeyboardAvoidingView>
      </Modal>
    );
  }
}
export default BottomSheet;
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: "row",
  },
  overlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    opacity: 0.5,
    backgroundColor: "black",
  },
  body: {
    flex: 1,
    alignSelf: "flex-end",
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
});
