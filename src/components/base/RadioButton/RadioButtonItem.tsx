import * as React from "react";
import {
  Text,
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from "react-native";
import { RadioButtonContext, RadioButtonContextType } from "./RadioButtonGroup";
import { handlePress } from "./utils";
import BaseRadioButton from "./RadioButton";

export type Props = {
  value: string;
  label: string;
  disabled?: boolean;
  onPress?: () => void;
  accessibilityLabel?: string;
  uncheckedColor?: string;
  color?: string;
  status?: "checked" | "unchecked";
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  testID?: string;
  mode?: "android" | "ios";
  position?: "leading" | "trailing";
};

const RadioButtonItem = ({
  value,
  label,
  style,
  labelStyle,
  onPress,
  disabled,
  color,
  uncheckedColor,
  status,
  accessibilityLabel,
  testID,
  position = "trailing",
}: Props): React.ReactElement => {
  const radioButtonProps = { value, disabled, status, color, uncheckedColor };
  const isLeading = position === "leading";

  const radioButton = <BaseRadioButton {...radioButtonProps} />;

  return (
    <RadioButtonContext.Consumer>
      {(context?: RadioButtonContextType) => {
        return (
          <TouchableOpacity
            onPress={
              disabled
                ? undefined
                : () =>
                    handlePress({
                      onPress: onPress,
                      onValueChange: context?.onValueChange,
                      value,
                    })
            }
            accessibilityLabel={accessibilityLabel}
            testID={testID}
          >
            <View style={[styles.container, style]} pointerEvents="none">
              {isLeading && radioButton}
              <Text
                style={[
                  styles.label,
                  isLeading ? styles.textAlignRight : styles.textAlignLeft,
                  labelStyle,
                ]}
              >
                {label}
              </Text>
              {!isLeading && radioButton}
            </View>
          </TouchableOpacity>
        );
      }}
    </RadioButtonContext.Consumer>
  );
};

export default RadioButtonItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  label: {
    fontSize: 16,
    flexShrink: 1,
    flexGrow: 1,
    color: "#000",
  },
  textAlignLeft: {
    textAlign: "left",
  },
  textAlignRight: {
    textAlign: "right",
  },
});
