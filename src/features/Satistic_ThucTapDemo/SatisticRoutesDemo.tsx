import React from "react";
import { NoHeader } from "src/navigation/screenConfigs";
import Statistic_Demo from "./SatisticDemo";
import { createStackNavigator } from "@react-navigation/stack";

const prefix = "Satistic_Demo";
export const statistic_DemoRoutes = {
  STATISTIC_DEMO: `${prefix}/Statistic_Demo`,
} as const;

export type Statistic_DemoStack_ParamList = {
  [statistic_DemoRoutes.STATISTIC_DEMO]: {};
};

export const statistic_DemoRouter = prefix;
const Statistic_DemoStack = createStackNavigator();
export const Statistic_DemoNavigator = () => {
  return (
    <Statistic_DemoStack.Navigator>
      <Statistic_DemoStack.Screen
        name={statistic_DemoRoutes.STATISTIC_DEMO}
        component={Statistic_Demo}
        options={NoHeader}
      />
    </Statistic_DemoStack.Navigator>
  );
};
