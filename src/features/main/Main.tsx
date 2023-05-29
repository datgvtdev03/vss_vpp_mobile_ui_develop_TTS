import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import React from "react";
import { Platform } from "react-native";
import Svgs from "src/constants/Svgs";
import Quantity from "../statistic/Quantity";
import Home from "./Home/Home";

const Tab = createBottomTabNavigator();
const customTabBarStyle: BottomTabNavigationOptions = {
  tabBarActiveTintColor: "#EE0033",
  tabBarInactiveTintColor: "gray",
  tabBarStyle: { backgroundColor: "white" },
  headerShown: false,
};
type TabBarIconProps = {
  focused: boolean;
  color: string;
  size: number;
};

const Main = (): React.ReactElement => {
  return (
    <Tab.Navigator initialRouteName="Home" screenOptions={customTabBarStyle}>
      <Tab.Screen
        name="Home"
        options={{
          tabBarLabel: "Trang chủ",
          tabBarStyle: { height: Platform.OS === "ios" ? 86 : 56 },
          tabBarLabelStyle: {
            fontSize: 12,
            paddingBottom: 2,
          },
          tabBarIcon: ({ focused }: TabBarIconProps) =>
            focused ? <Svgs.ActiveIconHome /> : <Svgs.IconHome />,
        }}
        component={Home}
      />
      {/* <Tab.Screen
        name="Order"
        options={{
          tabBarLabel: "Đơn hàng",
          tabBarStyle: { height: Platform.OS === "ios" ? 86 : 56 },
          tabBarLabelStyle: {
            fontSize: 12,
            paddingBottom: 2,
          },
          tabBarIcon: ({ focused }: TabBarIconProps) =>
            focused ? <Svgs.ActiveIconHome /> : <Svgs.IconHome />,
        }}
        component={HomeNavigator}
        // listeners={{
        //   tabPress: (e) => {
        //     e.preventDefault();
        //     navigationService.navigate(navigationRoutes.ORDER_MANAGER);
        //   },
        // }}
      />
      <Tab.Screen
        name="Customer"
        options={{
          tabBarLabel: "Khách hàng",
          tabBarStyle: { height: Platform.OS === "ios" ? 86 : 56 },
          tabBarLabelStyle: { fontSize: 12, paddingBottom: 2, paddingTop: 2 },
          tabBarIcon: ({ focused }: TabBarIconProps) =>
            focused ? <Svgs.ActiveIconHome /> : <Svgs.IconHome />,
        }}
        component={HomeNavigator}
        // listeners={{
        //   tabPress: (e) => {
        //     e.preventDefault();
        //     navigationService.navigate(navigationRoutes.SCAN_BARCODE, {
        //       fromScreen: "Main",
        //     });
        //   },
        // }}
      />
      <Tab.Screen
        name="Notification"
        options={{
          tabBarLabel: "Thông báo",
          tabBarStyle: { height: Platform.OS === "ios" ? 86 : 56 },
          tabBarLabelStyle: { fontSize: 12, paddingBottom: 2, paddingTop: 2 },
          tabBarIcon: ({ focused }: TabBarIconProps) =>
            focused ? <Svgs.ActiveIconHome /> : <Svgs.IconHome />,
        }}
        component={HomeNavigator}
        // listeners={{
        //   tabPress: (e) => {
        //     e.preventDefault();
        //   },
        // }}
      /> */}
      <Tab.Screen
        name="History"
        options={{
          tabBarLabel: "Sản lượng",
          tabBarStyle: { height: Platform.OS === "ios" ? 86 : 56 },
          tabBarLabelStyle: { fontSize: 12, paddingBottom: 2, paddingTop: 2 },
          tabBarIcon: ({ focused }: TabBarIconProps) =>
            focused ? <Svgs.ItemActive /> : <Svgs.Item />,
        }}
        component={Quantity}
      />
    </Tab.Navigator>
  );
};

export default Main;
