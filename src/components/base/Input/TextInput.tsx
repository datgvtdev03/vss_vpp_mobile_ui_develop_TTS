import React, { forwardRef, MutableRefObject, useMemo, useState } from "react";
import { Control, Controller } from "react-hook-form";
import {
  NativeSyntheticEvent,
  Platform,
  StyleProp,
  TextInput as RnTextInput,
  TextInputFocusEventData,
  TextInputProps,
  TextStyle,
  View,
  Text,
} from "react-native";
import usePreviousState from "src/common/hooks/usePreviousState";
import { useTailwind } from "src/lib/tailwind/tailwind";
import InputContainer, { InputContainerProps } from "./InputContainer";
import withLabel from "../../../common/hoc/withLabel";
import TextMarquee from "../TextMarquee";
import TextInputMask from "react-native-text-input-mask";

interface Props extends InputContainerProps, Omit<TextInputProps, "style"> {
  name: string;
  control?: Control<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  inputStyle?: StyleProp<TextStyle>;
  forwardedRef?: MutableRefObject<RnTextInput>;
  onClearText?: () => void;
  onAppendIcon?: () => void;
}

const FormController = ({
  children,
}: {
  children: React.ReactElement<Props>;
}) => {
  return (
    <Controller
      control={children.props.control}
      name={children.props.name}
      render={({
        field: { onChange, onBlur, value, ref },
        fieldState: { error },
      }) => {
        return (
          <>
            {React.cloneElement(children, {
              ...children.props,
              forwardedRef: ref as unknown as MutableRefObject<RnTextInput>,
              onBlur: (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
                onBlur();
                children.props.onBlur && children.props.onBlur(e);
              },
              onChangeText: (text: string) => {
                onChange(text);
                children.props.onChangeText &&
                  children.props.onChangeText(text);
              },
              value,
              error: children.props.error || error?.message,
            })}
          </>
        );
      }}
    />
  );
};

const TextInputCore = ({
  style,
  errorStyle,
  disabled,
  rounded,
  error,
  prependIcon,
  appendIcon,
  onAppendIcon,
  onBlur,
  onFocus,
  forwardedRef,
  onClearText,
  clearTextIcon,
  labelTextView,
  borderColorNotError,
  useTextMarquee,
  inputMask,
  ...props
}: Props) => {
  const { tw } = useTailwind();
  const [focused, setFocused] = useState<boolean>(false);
  const prevErrorProp = usePreviousState<typeof error>(error);
  const success = useMemo(() => {
    if (!error && prevErrorProp) return true;
    if (focused) return false;
    if (!focused) return false;
    return false;
  }, [error, focused, prevErrorProp]);

  return (
    <InputContainer
      style={style}
      errorStyle={errorStyle}
      disabled={disabled}
      rounded={rounded}
      error={error}
      success={success}
      prependIcon={prependIcon}
      appendIcon={appendIcon}
      onAppendIcon={onAppendIcon}
      focused={focused}
      onClearText={onClearText}
      clearTextIcon={clearTextIcon}
      forwardedRef={forwardedRef}
      borderColorNotError={borderColorNotError}
      useTextMarquee
    >
      {labelTextView && props.value ? (
        <View>
          {useTextMarquee ? (
            <View
              style={[
                tw("py-12", "flex-1", "h-44"),
                Platform.OS === "web" && tw("outline-none"),
                props.inputStyle,
                { width: "94%" },
              ]}
            >
              <TextMarquee style={tw("text-#AAAAAA")}>
                {props.value}
              </TextMarquee>
            </View>
          ) : (
            <Text numberOfLines={4}>{props.value}</Text>
          )}
        </View>
      ) : inputMask ? (
        <TextInputMask
          // onChangeText={(formatted, extracted) => {
          //   console.log(formatted);
          //   console.log(extracted);
          // }}
          placeholderTextColor="#AAAAAA"
          {...props}
          ref={forwardedRef}
          editable={!disabled}
          onFocus={(e) => {
            if (!disabled) {
              setFocused(true);
              onFocus && onFocus(e);
            }
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur && onBlur(e);
          }}
          style={[
            tw(
              "text-14",
              "font-regular",
              "text-black",
              /*"dark:text-white",*/
              "py-12",
              "flex-1",
              "h-44"
            ),
            Platform.OS === "web" && tw("outline-none"),
            props.inputStyle,
          ]}
          mask={inputMask}
        />
      ) : (
        <RnTextInput
          placeholderTextColor="#AAAAAA"
          {...props}
          ref={forwardedRef}
          editable={!disabled}
          onFocus={(e) => {
            if (!disabled) {
              setFocused(true);
              onFocus && onFocus(e);
            }
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur && onBlur(e);
          }}
          style={[
            tw(
              "text-14",
              "font-regular",
              "text-black",
              /*"dark:text-white",*/
              "py-12",
              "flex-1",
              "h-44"
            ),
            Platform.OS === "web" && tw("outline-none"),
            props.inputStyle,
          ]}
        />
      )}
    </InputContainer>
  );
};

const TextInput: React.ElementType<Props> = (props: Props) => (
  <>
    {props.control ? (
      <FormController>
        <TextInputCore {...props} />
      </FormController>
    ) : (
      <TextInputCore {...props} />
    )}
  </>
);

function forwardInputRef<
  P extends { forwardedRef?: MutableRefObject<RnTextInput> }
>(Component: React.ComponentType<P>) {
  return forwardRef<RnTextInput, P>((props, ref) => {
    return <Component {...props} forwardedRef={ref} />;
  });
}

export default forwardInputRef(TextInput);
export const TextInputWithLabel = forwardInputRef(withLabel<Props>(TextInput));
export type TextInputRef = RnTextInput;
