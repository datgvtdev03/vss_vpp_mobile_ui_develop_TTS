import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, Animated } from "react-native";
import { BackdropProps } from "../type";

export default class Backdrop extends Component<BackdropProps> {
  static defaultProps = {
    backgroundColor: "#f00",
    opacity: 0,
    animationDuration: 2000,
    visible: false,
    useNativeDriver: true,
    onPress: () => null,
  };

  componentDidUpdate(prevProps: BackdropProps) {
    const {
      visible,
      useNativeDriver,
      opacity,
      animationDuration: duration,
    } = this.props;
    if (prevProps.visible !== visible) {
      const toValue = visible ? opacity : 0;
      Animated.timing(this.opacity, {
        toValue,
        duration,
        useNativeDriver: useNativeDriver || true,
      }).start();
    }
  }

  setOpacity = (value) => {
    this.opacity.setValue(value);
  };

  opacity = new Animated.Value(0);

  render() {
    const { onPress, pointerEvents, backgroundColor } = this.props;
    const { opacity } = this;
    return (
      <Animated.View
        pointerEvents={pointerEvents || "auto"}
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor,
            opacity,
          },
        ]}
      >
        <TouchableOpacity onPressIn={onPress} style={StyleSheet.absoluteFill} />
      </Animated.View>
    );
  }
}
