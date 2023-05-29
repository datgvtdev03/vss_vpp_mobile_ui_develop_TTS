import * as React from "react";
import {
  Animated,
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  StyleProp,
  TextStyle,
} from "react-native";
import color from "color";
import { Text } from "../Typography";
import { RadioButtonContext, RadioButtonContextType } from "./RadioButtonGroup";
import { handlePress } from "./utils";
import TextMarquee from "../TextMarquee";

type Props = TouchableOpacityProps & {
  value?: number | string | null;
  status?: "checked" | "unchecked";
  disabled?: boolean;
  onPress?: (param?: unknown) => void;
  uncheckedColor?: string;
  color?: string;
  text?: string;
  textStyle?: StyleProp<TextStyle>;
  marquee?: boolean;
  disabledColor?: string | null;
};

const BORDER_WIDTH = 2;

const RadioButton = ({
  disabled,
  onPress,
  value = "",
  status,
  text,
  textStyle,
  marquee = false,
  disabledColor,
  ...rest
}: Props): React.ReactElement => {
  const { current: borderAnim } = React.useRef<Animated.Value>(
    new Animated.Value(BORDER_WIDTH)
  );

  const { current: radioAnim } = React.useRef<Animated.Value>(
    new Animated.Value(1)
  );

  const isFirstRendering = React.useRef<boolean>(true);

  React.useEffect(() => {
    // Do not run animation on very first rendering
    if (isFirstRendering.current) {
      isFirstRendering.current = false;
      return;
    }

    if (status === "checked") {
      radioAnim.setValue(1.2);

      Animated.timing(radioAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    } else {
      borderAnim.setValue(10);

      Animated.timing(borderAnim, {
        toValue: BORDER_WIDTH,
        duration: 150,
        useNativeDriver: false,
      }).start();
    }
  }, [status, borderAnim, radioAnim]);

  const checkedColor = rest.color || "#4353FA";
  const uncheckedColor =
    rest.uncheckedColor || color("#000").alpha(0.54).rgb().string();

  let radioColor: string;

  return (
    <RadioButtonContext.Consumer>
      {(context?: RadioButtonContextType) => {
        const checked = context?.value === value || status === "checked";

        if (disabled) {
          radioColor = disabledColor
            ? disabledColor
            : color("#000").alpha(0.26).rgb().string();
        } else {
          radioColor = checked ? checkedColor : uncheckedColor;
        }

        return (
          <TouchableOpacity
            {...rest}
            onPress={
              disabled
                ? undefined
                : () => {
                    handlePress({
                      onPress,
                      onValueChange: context?.onValueChange,
                      value,
                    });
                  }
            }
            style={styles.container}
            disabled={disabled}
          >
            <View style={styles.contentContainer}>
              <Animated.View
                style={[
                  styles.radio,
                  {
                    borderColor: radioColor,
                    borderWidth: borderAnim,
                  },
                ]}
              >
                {checked ? (
                  <View
                    style={[StyleSheet.absoluteFill, styles.radioContainer]}
                  >
                    <Animated.View
                      style={[
                        styles.dot,
                        {
                          backgroundColor: radioColor,
                          transform: [{ scale: radioAnim }],
                        },
                      ]}
                    />
                  </View>
                ) : null}
              </Animated.View>
              {marquee ? (
                <TextMarquee
                  style={[disabled && styles.disabledTxt, textStyle]}
                >
                  {text || ""}
                </TextMarquee>
              ) : (
                <Text style={[disabled && styles.disabledTxt, textStyle]}>
                  {text || ""}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        );
      }}
    </RadioButtonContext.Consumer>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 18,
  },
  radioContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  radio: {
    height: 20,
    width: 20,
    borderRadius: 10,
    margin: 8,
  },
  dot: {
    height: 10,
    width: 10,
    borderRadius: 5,
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  disabledTxt: {
    opacity: 0.5,
  },
});

export default RadioButton;
