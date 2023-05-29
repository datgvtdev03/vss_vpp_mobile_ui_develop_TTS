import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";
import defaultStyles from "src/common/styles";
import { elevations } from "src/common/styles/elevation";
import { NoHeader } from "src/navigation/screenConfigs";
import Home from "./Home";
import HomeDetail from "./HomeDetail";

export const homeRoutes = {
  HOME: `Home`,
  HOME_DETAIL: `HomeDetail`,
} as const;

export type HomeStackParamList = {
  [homeRoutes.HOME]: undefined;
  [homeRoutes.HOME_DETAIL]: undefined;
};

const HomeStack = createNativeStackNavigator();
const HomeNavigator = (): React.ReactElement => {
  return (
    <View style={[defaultStyles.flex_1, elevations[5]]}>
      <Animated.View
        style={StyleSheet.flatten([
          Platform.OS === "android" && elevations[5],
          styles.stack,
        ])}
      >
        <HomeStack.Navigator
          screenOptions={{
            animationTypeForReplace: "push",
            animation: "slide_from_right",
            // transitionSpec: {
            //   open: TransitionSpecs.TransitionIOSSpec,
            //   close: TransitionSpecs.TransitionIOSSpec,
            // },
            gestureEnabled: false,
          }}
          initialRouteName={"HomeDetail"}
        >
          <HomeStack.Screen
            name={homeRoutes.HOME}
            component={Home}
            options={NoHeader}
          />

          <HomeStack.Screen
            name={homeRoutes.HOME_DETAIL}
            component={HomeDetail}
            options={NoHeader}
          />
        </HomeStack.Navigator>
      </Animated.View>
    </View>
  );
};
export default HomeNavigator;
const styles = StyleSheet.create({
  stack: {
    flex: 1,
    overflow: "hidden",
  },
});
