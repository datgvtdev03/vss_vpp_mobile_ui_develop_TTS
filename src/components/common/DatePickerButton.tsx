import dayjs from "dayjs";
import React, { useState } from "react";
import Svgs from "src/constants/Svgs";
import { useTailwind } from "src/lib/tailwind/tailwind";
import DatePicker from "../base/DatePicker";
import withLabel from "../../common/hoc/withLabel";
import InputContainer from "../base/Input/InputContainer";
import { TextInput } from "../base/Input";
import { TouchableOpacity } from "react-native";

const DatePickerButton = ({
  value,
  onChange,
  disabled,
  mode,
  minDate,
  maxDate,
  fromYear,
  format = "DD/MM/YYYY",
  error,
  titlePlaceholder,
  onlyTime,
}: {
  value?: Date;
  onChange?: (d: Date) => void;
  disabled?: boolean;
  mode?: "date" | "time" | "datetime";
  minDate?: Date;
  maxDate?: Date;
  fromYear?: number;
  format?: string;
  error?: string;
  titlePlaceholder?: string;
  onlyTime?: boolean;
}) => {
  const { tw } = useTailwind();
  const [show, setShow] = React.useState(false);
  const [dateInput, setDateInput] = useState<Date>();
  const [dateView, setDateView] = useState<string | undefined>();
  // value && dayjs(value).format(format)

  const convertDate = (date: string) => {
    const dateArray2 = date.split(" ");
    const dateArray = dateArray2[0].split("/");
    const newDate = dateArray[2] + "/" + dateArray[1] + "/" + dateArray[0];
    return newDate;
  };
  const regDate =
    /^(?:(?:31(\/)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{4})$|^(?:29(\/|-|\.)(?:0?2|(?:Feb))\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/)(?:(?:0?[1-9])|(?:1[0-2]))\4((19|20)\d{2})$/;

  const checkValidDate = (date: string) => {
    if (date) {
      return dayjs(convertDate(date)).add(7, "hour").toDate();
    } else {
      return undefined;
    }
  };

  return (
    <DatePicker
      fromYear={fromYear}
      minDate={minDate}
      maxDate={maxDate}
      mode={mode}
      value={value}
      onChange={onChange}
      imperativeState={show ? "show" : "hide"}
      onClose={() => setShow(false)}
      dateInput={dateInput}
      onlyTime={onlyTime}
    >
      <>
        <InputContainer style={tw("px-0")} error={error}>
          <TextInput
            name={"input"}
            style={tw(
              "flex-1",
              "border-0",
              error ? "bg-#FDE8EC" : disabled ? "bg-#F5F5F5" : "bg-white"
            )}
            maxLength={10}
            disabled={disabled || onlyTime}
            keyboardType="numbers-and-punctuation"
            defaultValue={
              onlyTime
                ? value
                  ? dayjs(value).format(format)
                  : undefined
                : dayjs(value).format(format) === dateView
                ? dateView
                : dayjs(value).format(format)
            }
            onChangeText={(text) => setDateView(text)}
            onEndEditing={(value) => {
              const timeCheck = regDate.test(value.nativeEvent.text);
              if (timeCheck) {
                const date = checkValidDate(value.nativeEvent.text);
                setDateInput(date);
                return;
              }
              setDateView(dayjs(new Date()).format("DD/MM/YYYY"));
              setDateInput(new Date());
            }}
            placeholder={titlePlaceholder ? titlePlaceholder : "DD/MM/YYYY"}
            placeholderTextColor={"#AAAAAA"}
            appendIcon={
              <TouchableOpacity
                disabled={disabled}
                style={tw(
                  "border-0",
                  error ? "bg-#FDE8EC" : disabled ? "bg-#F5F5F5" : "bg-white",
                  "flex-1",
                  "justify-center",
                  "items-end",
                  "w-24"
                )}
                onPress={() => setShow(true)}
              >
                {disabled ? (
                  <Svgs.SearchCalendar
                    width={16}
                    height={16}
                    style={{ opacity: disabled ? 0.5 : 1 }}
                  />
                ) : (
                  <Svgs.SearchCalendarActive
                    width={16}
                    height={16}
                    style={{ opacity: disabled ? 0.5 : 1 }}
                  />
                )}
              </TouchableOpacity>
            }
          />
        </InputContainer>
      </>
    </DatePicker>
  );
};

export default DatePickerButton;
export const DatePickerButtonWithLabel = withLabel(DatePickerButton);
