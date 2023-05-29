import React from "react";
import { TextStyle, TouchableOpacity } from "react-native";
import { ViewStyle } from "react-native";

import { ColorValue, Platform, StyleSheet, Text, View } from "react-native";

interface Props {
  text?: string;
  Icon?: React.ReactElement | null;
  disabled?: boolean;
  disabledTextColor?: ColorValue;
  ellipsizeMode?: "clip" | "tail";
  onPress: (() => void) | undefined;
  style?: ViewStyle | null;
  textStyle?: TextStyle;
}

const MenuItem = React.memo(
  ({
    text,
    Icon,
    disabled = false,
    disabledTextColor = "#bdbdbd",
    ellipsizeMode = Platform.OS === "ios" ? "clip" : "tail",
    onPress,
    style,
    textStyle,
  }: Props): React.ReactElement => {
    return (
      <TouchableOpacity disabled={disabled} onPress={onPress}>
        <View style={[styles.container, style]}>
          <Text
            ellipsizeMode={ellipsizeMode}
            style={[
              styles.title,
              disabled && { color: disabledTextColor },
              textStyle,
            ]}
          >
            {text}
          </Text>
          {Boolean(Icon) && <View style={styles.px_16}>{Icon}</View>}
        </View>
      </TouchableOpacity>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    padding: 12,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#C8C8CA",
  },
  title: {
    fontSize: 14,
    fontWeight: "400",
    paddingHorizontal: 16,
    textAlign: "left",
  },
  px_16: {
    paddingHorizontal: 16,
  },
});

export default MenuItem;
