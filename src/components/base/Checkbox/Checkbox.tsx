import * as React from "react";
import {
  StyleProp,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
  StyleSheet,
} from "react-native";
import { Text } from "src/components/base/Typography";
import defaultStyles from "src/common/styles";
import IconChecked from "./svgs/ic_checked.svg";
import IconUnchecked from "./svgs/ic_unchecked.svg";

interface CheckboxProps {
  checked?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  color?: string;
  style?: StyleProp<ViewStyle>;
  text?: string;
  textStyle?: StyleProp<TextStyle>;
}

const Checkbox = ({
  checked = false,
  disabled = false,
  onPress = () => null,
  color = "#EE0033",
  style,
  text,
  textStyle,
}: CheckboxProps) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      style={[defaultStyles.row, defaultStyles.py_1, style]}
      onPressIn={onPress}
    >
      {checked ? (
        <IconChecked onPress={onPress} fill={color} />
      ) : (
        <IconUnchecked onPress={onPress} />
      )}
      {text && <Text style={[styles.textStyle, textStyle]}>{text}</Text>}
    </TouchableOpacity>
  );
};

export default Checkbox;

const styles = StyleSheet.create({
  textStyle: {
    marginLeft: 12,
    color: "#707070",
  },
});
