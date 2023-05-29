import * as React from "react";
import { useCallback, useState } from "react";
import { Control, Controller } from "react-hook-form";
import {
  GestureResponderEvent,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import defaultStyles from "src/common/styles";
import colors from "src/constants/colors";
import fonts from "src/constants/fonts";
import Svgs from "src/constants/Svgs";

interface BaseInputProps extends TextInputProps {
  inputRef?: React.MutableRefObject<TextInput>;
  type?: "input" | "button";
  containerStyle?: StyleProp<ViewStyle>;
  textInputContainerStyle?: StyleProp<ViewStyle>;
  textInputStyle?: StyleProp<TextStyle>;
  multiline?: boolean;
  captionError?: string;
  styleError?: ViewStyle;
  leftIconStyle?: ViewStyle;
  leftIcon?: React.ReactElement;
  rightIconStyle?: ViewStyle;
  rightIcon?: React.ReactElement;
  onClearText?: () => void;
  name: string;
  control?: Control;
  clearable?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
}

const DEFAULT_INPUT_HEIGHT = 45;
const BaseInput = React.memo(
  ({
    inputRef,
    containerStyle,
    textInputContainerStyle,
    textInputStyle,
    multiline,
    captionError,
    styleError,
    leftIconStyle,
    leftIcon,
    rightIconStyle,
    rightIcon,
    onClearText,
    clearable,
    name,
    control,
    ...props
  }: BaseInputProps) => {
    const [inputHeight, setInputHeight] =
      useState<number>(DEFAULT_INPUT_HEIGHT);
    const onContentSizeChange = useCallback(
      (e) =>
        multiline && setInputHeight(e.nativeEvent.contentSize.height.height),
      [multiline]
    );

    return (
      <>
        {control ? (
          <Controller
            name={name}
            control={control}
            shouldUnregister={true}
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <>
                <View
                  style={[
                    styles.container,
                    containerStyle,
                    (Boolean(error) || Boolean(captionError)) &&
                      styles.errorBorder,
                  ]}
                >
                  <View
                    style={[styles.inputContainer, textInputContainerStyle]}
                  >
                    <View
                      style={[multiline && defaultStyles.pt_1, leftIconStyle]}
                    >
                      {Boolean(leftIcon) && leftIcon}
                    </View>
                    <TextInput
                      ref={inputRef}
                      style={[
                        styles.input,
                        { height: inputHeight },
                        multiline && styles.paddingMultiline,
                        textInputStyle,
                      ]}
                      multiline={multiline}
                      placeholderTextColor={
                        StyleSheet.flatten(textInputStyle)?.color ||
                        styles.input.color
                      }
                      onContentSizeChange={onContentSizeChange}
                      {...props}
                      onChangeText={(text) => {
                        props.onChangeText?.(text);
                        onChange(text);
                      }}
                      value={props.value ? props.value : value}
                      onBlur={(e) => {
                        props.onBlur?.(e);
                        onBlur();
                      }}
                    />
                    <View
                      style={[multiline && defaultStyles.pt_1, rightIconStyle]}
                    >
                      {Boolean(rightIcon) && rightIcon}
                    </View>
                    {clearable && Boolean(props.value || value) && (
                      <TouchableOpacity
                        style={styles.clearButton}
                        onPress={() => {
                          props.onChangeText?.("");
                          onChange("");
                          onClearText && onClearText();
                        }}
                      >
                        <Svgs.SearchClose />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
                {(Boolean(error) || Boolean(captionError)) && (
                  <Text style={[styles.styleTextError, styleError]}>
                    {error ? error.message : captionError}
                  </Text>
                )}
              </>
            )}
          />
        ) : (
          <>
            <View
              style={[
                styles.container,
                containerStyle,
                Boolean(captionError) && styles.errorBorder,
              ]}
            >
              <View style={[styles.inputContainer, textInputContainerStyle]}>
                <View style={[multiline && defaultStyles.pt_1, leftIconStyle]}>
                  {Boolean(leftIcon) && leftIcon}
                </View>
                <TextInput
                  ref={inputRef}
                  style={[
                    styles.input,
                    {
                      height: inputHeight,
                    },
                    textInputStyle,
                  ]}
                  multiline={multiline}
                  placeholderTextColor={
                    StyleSheet.flatten(textInputStyle)?.color ||
                    styles.input.color
                  }
                  onContentSizeChange={onContentSizeChange}
                  {...props}
                  onChangeText={(text) => {
                    props.onChangeText?.(text);
                  }}
                  value={props.value}
                  onBlur={(e) => {
                    props.onBlur?.(e);
                  }}
                />
                <View style={[multiline && defaultStyles.pt_1, rightIconStyle]}>
                  {Boolean(rightIcon) && rightIcon}
                </View>
                {clearable && Boolean(props.value) && (
                  <TouchableOpacity
                    style={styles.clearButton}
                    onPress={() => {
                      props.onChangeText?.("");
                      onClearText && onClearText();
                    }}
                  >
                    <Svgs.SearchClose />
                  </TouchableOpacity>
                )}
              </View>
            </View>
            {Boolean(captionError) && (
              <Text style={[styles.styleTextError, styleError]}>
                {captionError}
              </Text>
            )}
          </>
        )}
      </>
    );
  }
);

export default BaseInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    borderRadius: 10,
    fontSize: 14,
    color: colors.black,
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 0,
    paddingBottom: 0,
  },
  styleTextError: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.color_EE0033,
    marginTop: 5,
  },
  clearButton: {
    marginRight: 16,
  },
  errorBorder: {
    borderColor: colors.color_EE0033,
  },
  paddingMultiline: { paddingTop: 14, paddingBottom: 14 },
});
