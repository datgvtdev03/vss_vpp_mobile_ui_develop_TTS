import React, { useMemo, useState } from "react";
import { Control, Controller } from "react-hook-form";
import {
  NativeSyntheticEvent,
  StyleProp,
  TextStyle,
  TargetedEvent,
  TouchableOpacityProps,
  TouchableOpacity,
  Platform,
  View,
} from "react-native";
import usePreviousState from "src/common/hooks/usePreviousState";
import { useTailwind } from "src/lib/tailwind/tailwind";
import { Text } from "../Typography";
import InputContainer, { InputContainerProps } from "./InputContainer";
import withLabel, { LabelProps } from "../../../common/hoc/withLabel";
import ArrowDown from "./svgs/ic_arrow_down.svg";
import SingleChoiceBottomSheet, {
  SingleChoiceProps,
} from "src/components/common/SingleChoiceBottomSheet";
import { isArray } from "lodash";
import { ALL_VALUE } from "src/components/common/MultipleChoiceBottomSheet";

interface Props<P>
  extends InputContainerProps,
    Omit<TouchableOpacityProps, "style" | "disabled">,
    SingleChoiceProps<P> {
  name: string;
  control?: Control;
  textStyle?: StyleProp<TextStyle>;
  noneInput?: boolean;
  textPlaceholder?: string;
  numberOfLines?: number;
  titlePlaceholder?: string;
  onLoadMore?: () => void;
  isLoadMore?: boolean;
  disableItems?: number[];
}

function FormController<P>({
  children,
}: {
  children: React.ReactElement<Props<P>>;
}) {
  return (
    <Controller
      control={children.props.control}
      name={children.props.name}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => (
        <>
          {React.cloneElement(children, {
            ...children.props,
            onBlur: (e: NativeSyntheticEvent<TargetedEvent>) => {
              onBlur();
              children.props.onBlur && children.props.onBlur(e);
            },
            onFinish: (value: P) => {
              onChange(value[children.props.itemValue]);
              children.props.onFinish && children.props.onFinish(value);
            },
            value,
            error: children.props.error || error?.message,
          })}
        </>
      )}
    />
  );
}

function PickerInputCore<P>({
  style,
  disabled,
  rounded,
  error,
  prependIcon,
  appendIcon,
  onFocus,
  onBlur,
  textStyle,
  data,
  itemText,
  itemValue,
  value,
  onFinish,
  onOpen,
  onClose,
  imperativeState,
  keepPosition = true,
  height,
  header = true,
  title,
  searchable,
  searchPlaceholder,
  showIcon,
  noneInput,
  textPlaceholder,
  numberOfLines,
  firstE,
  titlePlaceholder,
  onLoadMore,
  isLoadMore,
  multipleChoice,
  isSelectAll,
  isInventory,
  disableItems,
  ...props
}: Props<P>) {
  const { tw } = useTailwind();
  const [focused, setFocused] = useState<boolean>(false);
  const prevErrorProp = usePreviousState<typeof error>(error);
  const success = useMemo(() => {
    if (!error && prevErrorProp) return true;
    if (focused) return false;
    if (!focused) return false;
    return false;
  }, [error, focused, prevErrorProp]);

  const multipleValueText = useMemo(() => {
    if (isArray(value) && value.length > 0) {
      const valueText = value.reduce((text, item, index) => {
        if (multipleChoice && isSelectAll && item[itemValue] === ALL_VALUE) {
          return text;
        } else if (index === value.length - 1) {
          return (text += item[itemText]);
        } else {
          return (text += item[itemText] + ", ");
        }
      }, "");
      return valueText;
    } else {
      return "-Chọn-";
    }
  }, [itemText, value]);

  return (
    <SingleChoiceBottomSheet
      data={data}
      itemText={itemText}
      itemValue={itemValue}
      value={value}
      onFinish={onFinish}
      onOpen={onOpen}
      onClose={onClose}
      imperativeState={imperativeState}
      keepPosition={keepPosition}
      height={height}
      header={header}
      title={title}
      searchable={searchable}
      searchPlaceholder={searchPlaceholder}
      showIcon={showIcon}
      firstE={firstE}
      onLoadMore={onLoadMore}
      isLoadMore={isLoadMore}
      multipleChoice={multipleChoice}
      isSelectAll={isSelectAll}
      autoFinish={multipleChoice ? false : true}
      disableItems={disableItems}
    >
      <TouchableOpacity
        {...props}
        activeOpacity={disabled ? 1 : 0.6}
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
        disabled={disabled}
      >
        {!noneInput ? (
          <InputContainer
            style={style}
            disabled={disabled}
            rounded={rounded}
            error={error}
            success={success}
            prependIcon={prependIcon}
            appendIcon={
              appendIcon || (
                <ArrowDown
                  style={tw(disabled ? "opacity-50" : "opacity-100")}
                />
              )
            }
            focused={focused}
          >
            <Text
              style={[
                tw("py-12", "flex-1"),
                Platform.OS === "web" && tw("outline-none"),
                textStyle,
                isInventory ? null : !value?.[itemText] && tw("text-#AAAAAA"),
                disabled && tw("opacity-50"),
              ]}
              numberOfLines={multipleChoice ? 1 : numberOfLines}
            >
              {multipleChoice
                ? multipleValueText
                : value?.[itemText] || titlePlaceholder || "-Chọn-"}
            </Text>
          </InputContainer>
        ) : (
          <View
            style={tw(
              "flex-row",
              "items-center",
              disabled ? "opacity-50" : "opacity-100"
            )}
          >
            <Text
              style={tw("mr-10")}
              numberOfLines={multipleChoice ? 1 : numberOfLines}
            >
              {multipleChoice
                ? multipleValueText
                : value?.[itemText] || textPlaceholder}
            </Text>
            <ArrowDown />
          </View>
        )}
      </TouchableOpacity>
    </SingleChoiceBottomSheet>
  );
}

function PickerInput<P>(props: Props<P>): React.ReactElement<Props<P>> {
  return (
    <>
      {props.control ? (
        <FormController>
          <PickerInputCore {...props} />
        </FormController>
      ) : (
        <PickerInputCore {...props} />
      )}
    </>
  );
}

export default PickerInput;
export function PickerInputWithLabel<P>(props: Props<P> & LabelProps) {
  return React.createElement(withLabel<Props<P>>(PickerInput), props);
}
