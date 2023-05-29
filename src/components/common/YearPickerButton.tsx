import React from "react";
import Svgs from "src/constants/Svgs";
import { useTailwind } from "src/lib/tailwind/tailwind";
import Button from "../base/Button";
import withLabel from "../../common/hoc/withLabel";
import { Text } from "../base/Typography";
import InputContainer from "../base/Input/InputContainer";
import YearPicker from "../base/YearPicker";

const YearPickerButton = ({
  value,
  onChange,
  disabled,
  minYear,
  maxYear,
  error,
}: {
  value?: number;
  onChange?: (y: number) => void;
  disabled?: boolean;
  minYear?: number;
  maxYear?: number;
  fromYear?: number;
  toYear?: number;
  error?: string;
}) => {
  const { tw } = useTailwind();
  const [show, setShow] = React.useState(false);

  return (
    <YearPicker
      minYear={minYear}
      maxYear={maxYear}
      initYear={value ? value : 1970}
      onChange={onChange}
      imperativeState={show ? "show" : "hide"}
      onClose={() => setShow(false)}
    >
      <InputContainer style={tw("px-0")} error={error}>
        <Button
          justify="space-between"
          outlined
          disabled={disabled}
          color="#AAAAAA"
          icon={
            disabled ? (
              <Svgs.SearchCalendar width={15} height={15} />
            ) : (
              <Svgs.SearchCalendarActive width={15} height={15} />
            )
          }
          style={tw(
            "border-0",
            error ? "bg-#FDE8EC" : disabled ? "bg-#F5F5F5" : "bg-white",
            "flex-1"
          )}
          iconRight
          onPress={() => setShow(true)}
        >
          {value ? (
            <Text style={tw("pl-8")}>{value}</Text>
          ) : (
            <Text style={tw("pl-8", "text-#AAAAAA")}>-Chọn-</Text>
          )}
        </Button>
      </InputContainer>
    </YearPicker>
  );
};

export default YearPickerButton;
export const YearPickerButtonWithLabel = withLabel(YearPickerButton);
