import React, { MutableRefObject } from "react";
import {
  StyleProp,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import Svgs from "src/constants/Svgs";
import { useTailwind } from "src/lib/tailwind/tailwind";
import { Text } from "../Typography";

type Props = {
  rounded?: boolean;
  disabled?: boolean;
  focused?: boolean;
  success?: boolean;
  error?: string;

  prependIcon?: React.ReactElement;
  appendIcon?: React.ReactElement;
  onAppendIcon?: () => void;

  clearTextIcon?: boolean;
  onClearText?: () => void;
  forwardedRef?: MutableRefObject<TextInput>;

  style?: StyleProp<ViewStyle>;
  errorStyle?: StyleProp<TextStyle>;
  children?: React.ReactNode;
  labelTextView?: boolean;

  borderColorNotError?: boolean;
  useTextMarquee?: boolean;
  inputMask?: string;
};

export type InputContainerProps = Omit<
  Props,
  "children" | "focused" | "success"
>;

const InputContainer = (props: Props) => {
  const { tw } = useTailwind();

  return (
    <>
      <View
        style={[
          tw(
            "rounded-8",
            "border",
            "border-#AAAAAA",
            "px-16",
            "bg-white",
            /*"dark:bg-#16191D",*/
            "flex-row",
            "items-center",
            "self-stretch"
          ),
          props.rounded && tw("rounded-full"),
          props.disabled && tw("bg-#F5F5F5"),
          props.success && tw("border-#FF342A"),
          props.focused && tw("border-#3B49F9"),
          Boolean(props.error) &&
            (props.borderColorNotError
              ? tw("border-#AAAAAA")
              : tw("border-#FF342A")),
          Boolean(props.error) && !props.focused && tw("bg-#FDE8EC"),
          !props.error && tw("border-#AAAAAA"),
          props.style,
        ]}
      >
        {Boolean(props.prependIcon) && (
          <View style={props.rounded ? tw("ml-8", "mr-12") : tw("mr-12")}>
            {props.prependIcon}
          </View>
        )}
        {Boolean(props.children) && props.children}

        {Boolean(props.clearTextIcon) && Boolean(props.forwardedRef) && (
          <TouchableOpacity onPress={props.onClearText}>
            <View style={tw("p-6")}>
              <Svgs.SearchClose stroke="#000000" width={13} height={13} />
            </View>
          </TouchableOpacity>
        )}
        {Boolean(props.appendIcon) && (
          <TouchableOpacity
            onPress={props.onAppendIcon}
            style={props.rounded ? tw("mr-8", "ml-12") : tw("ml-12")}
          >
            {props.appendIcon}
          </TouchableOpacity>
        )}
      </View>
      {Boolean(props.error) && (
        <Text
          style={[
            props.borderColorNotError
              ? tw("text-#000000", "font-bold", "mt-8", "pl-4", "self-start")
              : tw("text-#EE0033", "mt-8", "pl-4", "self-start"),
            props.errorStyle,
          ]}
        >
          {props.error}
        </Text>
      )}
    </>
  );
};

export default InputContainer;
