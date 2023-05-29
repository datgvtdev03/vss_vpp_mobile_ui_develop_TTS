import React, { useState } from "react";
import { Text, View } from "react-native";
import Button from "src/components/base/Button";
import { RadioButtonGroup } from "src/components/base/RadioButton";
import RadioButton from "src/components/base/RadioButton/RadioButton";
import { ModalPortal } from "src/components/common/Modal";
import { StatisticType } from "src/features/statistic/constants";
import { useTailwind } from "src/lib/tailwind/tailwind";
import { navigationRoutes } from "src/navigation/StackNavigator";
import navigationService from "src/navigation/navigationService";

const ChooseStatisticType = () => {
  const [statisticType, setStatisticType] = useState<number>(2);
  const { tw } = useTailwind();

  return (
    <View style={tw("p-32")}>
      <View style={tw("items-center")}>
        <Text style={tw("text-#707070")}>{`Chọn đối tượng nhập liệu`}</Text>
      </View>
      <View>
        <RadioButtonGroup
          onValueChange={(value) => {
            setStatisticType(Number(value));
          }}
          value={statisticType}
        >
          <View style={tw("flex-row", "pt-16", "justify-around")}>
            <RadioButton
              text="Nhập theo nhóm"
              textStyle={tw("text-#707070")}
              value={StatisticType.Group}
            />
            <RadioButton
              text="Nhập cá nhân"
              textStyle={tw("text-#707070")}
              value={StatisticType.Personal}
            />
          </View>
        </RadioButtonGroup>
      </View>
      <View style={tw("flex-row", "justify-around", "pt-16")}>
        <Button
          children={"Hủy"}
          rounded
          outlined
          color="#EE0033"
          minWidth
          onPressIn={() => ModalPortal.dismissAll()}
        />
        <Button
          children={"Tiếp tục"}
          rounded
          outlined
          color="white"
          minWidth
          style={tw("bg-#EE0033")}
          onPressIn={() => {
            navigationService.navigate(navigationRoutes.STATISTIC, {
              statisticType: statisticType,
            });
            ModalPortal.dismissAll();
          }}
        />
      </View>
    </View>
  );
};

export default ChooseStatisticType;
