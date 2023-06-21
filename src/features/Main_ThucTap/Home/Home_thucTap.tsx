import { StackScreenProps } from "@react-navigation/stack";
import { View, Text } from "react-native";
import {
  RootStackParamList,
  navigationRoutes,
} from "src/navigation/StackNavigator";
import { ReactChild, useMemo } from "react";
import Svgs from "src/constants/Svgs";
import navigationService from "src/navigation/navigationService";
import { useTailwind } from "src/lib/tailwind/tailwind";
import React from "react";
// type Props = StackScreenProps<RootStackParamList, "Main_Thuctap">;
// interface ItemData {
//   title: string;
//   icon?: React.ReactElement;
//   onPress?: () => void;
//   onPressSubAction?: () => void;
//   opacity?: number;
//   disable?: boolean;
//   subIcon?: boolean;
// }
// enum MenuType {
//   Consult = "0",
//   Sale = "1",
//   Product = "2",
//   Customer = "3",
//   ProductionStatus = "4",
// }

// const Item =({
// title,
// icon,
// OnPress,

// }:ItemData)
const Home_thucTap = (): React.ReactElement => {
  const { tw } = useTailwind();
  //   const menus = useMemo(
  //     () => [
  //       {
  //         id: MenuType.ProductionStatus,
  //         title: "Production_Status",
  //         icon: <Svgs.Statistic />,
  //         disable: false,
  //         action: () =>
  //           navigationService.navigate(navigationRoutes.ADD_PROSTATUS),
  //         subIcon: true,
  //         onPressSubAction: () =>
  //           navigationService.navigate(navigationRoutes.ADDPROSTATUSSCREEN),
  //       },
  //     ],
  //     []
  //   );
  //   return <View style={tw("flex-1")}>
  // {menus?.map((item)=>{
  //   return (
  //     <Item
  //     />
  //   )
  // })}
  //   </View>;
  return (
    <View style={[tw("flex-1"), { backgroundColor: "red" }]}>
      <Text>color red</Text>
    </View>
  );
};
export default Home_thucTap;
