import React, { useMemo, useRef } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import BottomSheet from "../base/BottomSheet";
import {
  ActionId,
  BottomSheetActionProps,
  BottomSheetActions,
} from "../../features/statistic/constants";
import { useTailwind } from "src/lib/tailwind/tailwind";

interface MultipleChoiceActionProps {
  height?: number;
  actionList?: number[];
  children: React.ReactElement;
  action: (actionItem: BottomSheetActionProps) => void;
}

const MultipleChoiceAction = ({
  actionList = [ActionId.Edit, ActionId.Copy, ActionId.Delete, ActionId.Click],
  height = 400,
  children,
  action,
}: MultipleChoiceActionProps) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { tw } = useTailwind();

  const _actionList = useMemo(() => {
    const filterAction = BottomSheetActions.filter((item) => {
      return actionList?.includes(item.actionId) && item;
    });
    return filterAction;
  }, [actionList]);

  return (
    <>
      {children &&
        React.cloneElement(children, {
          onPress: () => {
            bottomSheetRef?.current?.show();
          },
        })}
      <BottomSheet ref={bottomSheetRef} height={height}>
        <View style={tw("p-12", "items-center")}>
          <Text style={tw("font-semi-bold", "text-16")}>{`Thực hiện`}</Text>
        </View>
        {_actionList.map((item, index) => (
          <TouchableOpacity
            style={[
              tw(
                "p-16",
                "border-t",
                "border-#E3E3E4",
                "flex-row",
                "items-center"
              ),
              index === 0 && tw("border-t-0"),
            ]}
            onPress={() => {
              action(item);
              bottomSheetRef?.current?.hide();
            }}
            key={index}
          >
            <View style={tw("px-8", "py-6")}>{item.icon}</View>
            <Text style={tw("text-center", "items-center")}>
              {item.actionName}
            </Text>
          </TouchableOpacity>
        ))}
      </BottomSheet>
    </>
  );
};

export default MultipleChoiceAction;
