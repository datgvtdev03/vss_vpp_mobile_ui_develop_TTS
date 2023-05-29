import { useDrawerStatus } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import { Platform, StatusBar, StyleSheet, View, ViewStyle } from "react-native";
import Animated from "react-native-reanimated";
import defaultStyles from "src/common/styles";
import { elevations } from "src/common/styles/elevation";
import Login from "src/features/auth/Login";
import Main from "src/features/main/Main";
import {
  StatisticNavigator,
  StatisticStackParamList,
  statisticRouter,
  statisticRoutes,
} from "src/features/statistic/statisticRoutes";
import { NoHeader, ScreenProps } from "./screenConfigs";

const Stack = createNativeStackNavigator();

const defaultNavigationRoutes = {
  MAIN: "Main",
  LOGIN: "Login",
} as const;
interface DefaultNavigationRoutes {
  [defaultNavigationRoutes.MAIN]: undefined;
  [defaultNavigationRoutes.LOGIN]: undefined;
}

export type RootStackParamList = DefaultNavigationRoutes &
  StatisticStackParamList;

export const navigationRoutes = {
  ...defaultNavigationRoutes,
  ...statisticRoutes,
} as const;

const StackNavigator = ({
  style,
}: {
  style: ViewStyle;
}): React.ReactElement => {
  const drawerStatus = useDrawerStatus();
  useEffect(() => {
    if (drawerStatus === "open") {
      StatusBar.setBarStyle("dark-content");
    } else {
      StatusBar.setBarStyle("light-content");
    }
  }, [drawerStatus]);

  const mapScreens = (screens: ScreenProps) => {
    return Object.entries(screens).map(([key, value]) => (
      <Stack.Screen
        key={key}
        name={key}
        component={value.component}
        options={value.options}
      />
    ));
  };
  return (
    <>
      <View style={[defaultStyles.flex_1, elevations[5]]}>
        <Animated.View
          style={StyleSheet.flatten([
            Platform.OS === "android" && elevations[5],
            styles.stack,
            style,
          ])}
        >
          <Stack.Navigator
            screenOptions={{
              animationTypeForReplace: "push",
              animation: "slide_from_right",
              // transitionSpec: {
              //   open: TransitionSpecs.TransitionIOSSpec,
              //   close: TransitionSpecs.TransitionIOSSpec,
              // },
              gestureEnabled: false,
            }}
            initialRouteName={navigationRoutes.LOGIN}
          >
            <Stack.Screen
              name={navigationRoutes.LOGIN}
              component={Login}
              options={NoHeader}
            />

            <Stack.Screen
              name={navigationRoutes.MAIN}
              component={Main}
              options={NoHeader}
            />

            <Stack.Screen
              name={statisticRouter}
              component={StatisticNavigator}
              options={NoHeader}
            />

            {/* {mapScreens({
              ...preSaleScreens,
            })} */}
          </Stack.Navigator>
        </Animated.View>
      </View>
    </>
  );
};
export default StackNavigator;

const styles = StyleSheet.create({
  stack: {
    flex: 1,
    overflow: "hidden",
  },
});
