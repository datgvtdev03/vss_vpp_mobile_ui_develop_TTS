import React from "react";
import { Text } from "./Typography";
import {
  ActivityIndicator,
  GestureResponderEvent,
  StyleProp,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { useTailwind, getColor } from "src/lib/tailwind/tailwind";

interface Props {
  children?: React.ReactNode;
  icon?: React.ReactElement;
  iconRight?: boolean;
  tintColor?: boolean | string;
  rounded?: boolean;
  outlined?: boolean;
  busy?: boolean;
  disabled?: boolean;
  minWidth?: boolean;
  color?: string;
  justify?:
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-between"
    | "space-around"
    | "space-evenly";
  style?: StyleProp<ViewStyle>;
  // actions
  onPress?: (event: GestureResponderEvent) => void;
  onPressIn?: (event: GestureResponderEvent) => void;
  onPressOut?: (event: GestureResponderEvent) => void;
  onLongPress?: (event: GestureResponderEvent) => void;
}

const minWidth = 120;
const DEFAULT_COLOR = "#4353FA";
const DEFAULT_BG = "#FFFFFF";
const DEFAULT_BG_DARK = "#3A3F48";
const DISABLED_BG = "#AAAAAA";
const DISABLED_BORDER = "#F5F5F5";
const DISABLED_COLOR = "#F5F5F5";

const useGetColors = (props: Props) => {
  const { isDarkMode } = useTailwind();
  return React.useMemo(() => {
    const themeBackground = isDarkMode ? DEFAULT_BG_DARK : DEFAULT_BG;
    const highlightColor = props.color ? getColor(props.color) : DEFAULT_COLOR;

    // [text-color, border-color, background-color]
    if (props.disabled) {
      return [DISABLED_COLOR, DISABLED_BORDER, DISABLED_BG];
    } else if (props.outlined) {
      return [highlightColor, highlightColor, themeBackground];
    } else {
      return ["#FFFFFF", highlightColor, highlightColor];
    }
  }, [isDarkMode, props.color, props.disabled, props.outlined]);
};

const ButtonChildren = (props: Props) => {
  const { tw } = useTailwind();
  const [textColor] = useGetColors(props);
  const justify = props.justify ?? "center";

  let children: React.ReactNode;
  if (typeof props.children === "string") {
    children = (
      <Text style={[tw("text-16", "font-medium"), { color: textColor }]}>
        {props.children}
      </Text>
    );
  } else {
    children = props.children;
  }

  return (
    <View
      style={[
        tw(props.iconRight ? "flex-row-reverse" : "flex-row"),
        tw("p-12", "items-center"),
        { justifyContent: justify },
      ]}
    >
      {props.busy ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <>
          {Boolean(props.icon) && (
            <View style={tw(props.iconRight ? "ml-8" : "mr-8")}>
              {props.tintColor === false ? (
                props.icon
              ) : (
                <>
                  {React.cloneElement(props.icon as React.ReactElement, {
                    fill:
                      typeof props.tintColor === "string"
                        ? props.tintColor
                        : textColor,
                    style: [
                      (props.icon as React.ReactElement).props.style,
                      {
                        tintColor:
                          typeof props.tintColor === "string"
                            ? props.tintColor
                            : textColor,
                      },
                    ],
                  })}
                </>
              )}
            </View>
          )}
          {children}
        </>
      )}
    </View>
  );
};

const Button = ({ tintColor = false, ...props }: Props) => {
  const { tw } = useTailwind();
  const [, borderColor, backgroundColor] = useGetColors(props);

  return (
    <TouchableOpacity
      activeOpacity={props.disabled || props.busy ? 1 : 0.6}
      disabled={props.disabled || props.busy}
      onPress={props.onPress}
      onPressIn={props.onPressIn}
      onPressOut={props.onPressOut}
      onLongPress={props.onLongPress}
      style={[
        { borderColor, backgroundColor },
        tw("rounded-8", "overflow-hidden", "justify-center"),
        props.outlined && tw("border"),
        props.minWidth && { minWidth: minWidth },
        props.rounded && tw("rounded-full"),
        props.style,
      ]}
    >
      <ButtonChildren {...props} tintColor={tintColor} />
    </TouchableOpacity>
  );
};

export default Button;
