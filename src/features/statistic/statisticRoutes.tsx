import { TransitionSpecs, createStackNavigator } from "@react-navigation/stack";
import React from "react";
import Statistic from "./Statistic";
import { NoHeader } from "src/navigation/screenConfigs";
import Quantity from "./Quantity";
import { StatisticProvider } from "./store/useStatisticStore";
import StatisticAddStaff from "./StatisticAddStaff";
import StatisticAddQuantity from "./StatisticAddQuantity";
import StatisticManagement from "./StatisticManagement";
import StatisticDetail from "./StatisticDetail";
import SearchAdvance from "./SearchAdvance";
import { StaffList } from "./models/statistic";
import AddScreen from "../ThucTapSinhDeMo/AddScreen";

const prefix = "Statistic";
export const statisticRoutes = {
  STATISTIC: `${prefix}/Statistic`,
  QUANTITY: `${prefix}/Quantity`,
  STATISTIC_ADD_STAFF: `${prefix}/StatisticAddStaff`,
  STATISTIC_ADD_QUANTITY: `${prefix}/StatisticAddQuantity`,
  STATISTIC_MANAGEMENT: `${prefix}/StatisticManagement`,
  STATISTIC_DETAIL: `${prefix}/StatisticDetail`,
  STATISTIC_SEARCH_ADVANCE: `${prefix}/SearchAdvance`,
  STATISTIC_ADD_SCREEN: `${prefix}/AddScreen`,
} as const;

export type StatisticStackParamList = {
  [statisticRoutes.STATISTIC]: {
    statisticType?: number;
    fromManagement?: boolean;
    dataManagement?: any;
    managementAction?: number;
  };
  [statisticRoutes.QUANTITY]: undefined;
  [statisticRoutes.STATISTIC_ADD_STAFF]: {
    item?: StaffList;
  };
  [statisticRoutes.STATISTIC_ADD_QUANTITY]: {
    action: number;
    item?: any;
    fromManagement?: boolean;
  };
  [statisticRoutes.STATISTIC_MANAGEMENT]: undefined;
  [statisticRoutes.STATISTIC_DETAIL]: {
    idStatistic: number;
  };
  [statisticRoutes.STATISTIC_SEARCH_ADVANCE]: undefined;
};

export const statisticRouter = prefix;
const StatisticStack = createStackNavigator();

export const StatisticNavigator = () => {
  return (
    <StatisticProvider>
      <StatisticStack.Navigator
        screenOptions={{
          animationTypeForReplace: "push",
          // animation: "slide_from_right",
          transitionSpec: {
            open: TransitionSpecs.TransitionIOSSpec,
            close: TransitionSpecs.TransitionIOSSpec,
          },
          gestureEnabled: false,
        }}
      >
        <StatisticStack.Screen
          name={statisticRoutes.STATISTIC}
          component={Statistic}
          options={NoHeader}
        />

        <StatisticStack.Screen
          name={statisticRoutes.QUANTITY}
          component={Quantity}
          options={NoHeader}
        />

        <StatisticStack.Screen
          name={statisticRoutes.STATISTIC_ADD_STAFF}
          component={StatisticAddStaff}
          options={NoHeader}
        />

        <StatisticStack.Screen
          name={statisticRoutes.STATISTIC_ADD_QUANTITY}
          component={StatisticAddQuantity}
          options={NoHeader}
        />

        <StatisticStack.Screen
          name={statisticRoutes.STATISTIC_MANAGEMENT}
          component={StatisticManagement}
          options={NoHeader}
        />

        <StatisticStack.Screen
          name={statisticRoutes.STATISTIC_DETAIL}
          component={StatisticDetail}
          options={NoHeader}
        />

        <StatisticStack.Screen
          name={statisticRoutes.STATISTIC_SEARCH_ADVANCE}
          component={SearchAdvance}
          options={NoHeader}
        />
         <StatisticStack.Screen
          name={statisticRoutes.STATISTIC_ADD_SCREEN}
          component={AddScreen}
          options={NoHeader}
        />
      </StatisticStack.Navigator>
    </StatisticProvider>
  );
};
