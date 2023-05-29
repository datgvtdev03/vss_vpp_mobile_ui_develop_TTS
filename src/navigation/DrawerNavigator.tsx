import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
  useDrawerProgress,
} from "@react-navigation/drawer";
import React, { useEffect, useState } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import deviceInfoModule from "react-native-device-info";
import Animated from "react-native-reanimated";
import defaultStyles from "src/common/styles";
import { Text } from "src/components/base/Typography";
import { globalData } from "src/constants/common";
import Svgs from "src/constants/Svgs";
import { Gender } from "src/models/login";
import Expandable, { ItemData } from "./components/Expandable";
import navigationService from "./navigationService";
import StackNavigator, { navigationRoutes } from "./StackNavigator";
import { logout } from "src/utils/auth";

const SIDEBAR_LEFT_MENU: ItemData[] = [
  {
    id: 0,
    isDisable: false,
    title: "Quay về trang chủ",
    icon: <Svgs.ActiveIconHome />,
    subcategory: [],
    action: () => navigationService.toggleDrawer(),
  },
  {
    id: 1,
    isDisable: false,
    title: "Thống kê",
    icon: <Svgs.ItemActive />,
    subcategory: [],
    action: () => navigationService.navigate(navigationRoutes.STATISTIC),
  },
  // {
  //   id: 1,
  //   isDisable: false,
  //   title: "Danh mục",
  //   icon: <Svgs.ActiveIconHome />,
  //   subcategory: [
  //     {
  //       id: 1,
  //       title: "Danh mục đặt trước",
  //       action: () => alert("Clicked"),
  //     },
  //     {
  //       id: 2,
  //       title: "Danh mục thông thường",
  //       action: () => alert("Clicked"),
  //     },
  //   ],
  //   action: () => alert("Clicked"),
  // },
  // {
  //   id: 2,
  //   isDisable: true,
  //   title: "Báo cáo",
  //   icon: <Svgs.ActiveIconHome />,
  //   subcategory: [],
  //   action: () => alert("Clicked"),
  // },
  // {
  //   id: 3,
  //   isDisable: false,
  //   title: "Quản trị",
  //   icon: <Svgs.ActiveIconHome />,
  //   subcategory: [],
  //   action: () => alert("Clicked"),
  // },
  {
    id: 99,
    title: "Đăng xuất",
    isDisable: false,
    icon: <Svgs.Logout />,
    subcategory: [],
    action: () => {
      logout();
      navigationService.toggleDrawer();
      navigationService.reset(navigationRoutes.LOGIN);
    },
  },
];

const Drawer = createDrawerNavigator();
const DrawerContent = (props) => {
  return (
    <DrawerContentScrollView showsVerticalScrollIndicator={false} {...props}>
      <View style={styles.userInfoContainer}>
        {/* {globalData.gender === Gender.Female ? (
          <Svgs.FemaleAvatar width={72} height={72} />
        ) : (
          <Svgs.MaleAvatar width={72} height={72} />
        )} */}
        <Svgs.MaleAvatar width={72} height={72} />
        <Text
          style={styles.usernameText}
        >{`${globalData.userInfo.hoTen} - ${globalData.userInfo.maNhanVien}`}</Text>

        <Text style={styles.usernameTextStore}>{`${
          globalData.userInfo.maNhanVienBD || ""
        } - ${globalData.userInfo.tenChucDanh}`}</Text>
      </View>
      {SIDEBAR_LEFT_MENU?.map((item) => (
        <Expandable key={item.id} {...item} />
      ))}
      <View style={[defaultStyles.py_2, defaultStyles.alignItemsCenter]}>
        <Text style={[defaultStyles.fwBold]}>
          {`Version ${deviceInfoModule.getVersion()}`}
        </Text>
      </View>
    </DrawerContentScrollView>
  );
};

export default (): React.ReactElement => {
  const [currentRouteName, setCurrentRouteName] = useState<string>();
  useEffect(() => {
    setCurrentRouteName(navigationService.getCurrentRouteName());
    return navigationService.onStateChanged(() => {
      setCurrentRouteName(navigationService.getCurrentRouteName());
    });
  }, []);
  return (
    <Drawer.Navigator
      initialRouteName="Stack"
      useLegacyImplementation
      screenOptions={{
        headerShown: false,
        swipeEnabled: currentRouteName !== navigationRoutes.LOGIN,
        drawerActiveBackgroundColor: "transparent",
        drawerActiveTintColor: "white",
        drawerInactiveTintColor: "white",
        drawerType: "slide",
        overlayColor: "transparent",
        drawerStyle: styles.drawerStyles,
        sceneContainerStyle: styles.bgTransparent,
      }}
      drawerContent={(props: DrawerContentComponentProps) => (
        <DrawerContent {...props} />
      )}
    >
      <Drawer.Screen name="Stack">
        {(props) => {
          const progress = useDrawerProgress();
          const scale = Animated.interpolateNode(
            progress as Animated.Value<number>,
            {
              inputRange: [0, 1],
              outputRange: [1, 0.8],
            }
          );
          const borderRadiusTop = Animated.interpolateNode(
            progress as Animated.Value<number>,
            {
              inputRange: [0, 1],
              outputRange: [0, 32],
            }
          );
          return (
            <StackNavigator
              {...props}
              style={
                {
                  borderRadius: borderRadiusTop,
                  transform: [{ scale }],
                } as unknown as ViewStyle
              }
            />
          );
        }}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  drawerStyles: { flex: 1, width: "70%", backgroundColor: "transparent" },
  bgTransparent: {
    backgroundColor: "transparent",
  },
  disabledText: {
    color: "rgba(0,0,0,0.5)",
  },
  enabledText: {
    color: "#000",
  },
  logoutText: {
    color: "#EE0033",
  },
  mx_12: {
    marginHorizontal: 12,
  },
  userInfoContainer: {
    alignItems: "center",
    borderBottomColor: "#C8C8CA",
    borderBottomWidth: 0.4,
  },
  usernameText: {
    marginTop: 5,
    marginBottom: 10,
    fontWeight: "bold",
    fontSize: 16,
  },
  usernameTextStore: {
    fontSize: 14,
    // width: "80%",
    paddingBottom: 4,
    fontWeight: "600",
  },
  menuItemButton: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 16,
    height: 52,
  },
  menuItemContainer: {
    flexDirection: "row",
    flex: 1,
    height: "100%",
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
    marginRight: 15,
    alignItems: "center",
  },
});
