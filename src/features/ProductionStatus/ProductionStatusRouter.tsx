import { TransitionSpecs, createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { Transition } from "react-native-reanimated";
import { NoHeader } from "src/navigation/screenConfigs";
import ProSatusManagement from "./ProSatusManagement";
import AddProStatusScreen from "./AddnewScreen/AddNewProStatus";
import ProductionSituationItem from "../statistic/productionLog/productionSituation/ProductionSituationItem";
import AddProStatus from "./AddnewScreen/UpdateProStatus";
import UpdateProStatus from "./AddnewScreen/UpdateProStatus";
const prefix = "ProductionStatus";
export const proStatusRoutes = {
  PROSTATUSMANAGEMENT: `${prefix}/ProSatusManagement`,
  ADDPROSTATUSSCREEN: `${prefix}/AddProStatusScreen`,
  PROSTATUSITEM: `${prefix}/ProductionSituationItem`,
  ADD_PROSTATUS: `${prefix}/AddProStatus`,
  UPDATE_PROSTATUS: `${prefix}/UpdateProStatus`,
} as const;

export type ProStatus_StackParamList = {
  [proStatusRoutes.PROSTATUSMANAGEMENT]: {};
  [proStatusRoutes.ADDPROSTATUSSCREEN]: {};
  [proStatusRoutes.PROSTATUSITEM]: {};
  [proStatusRoutes.ADD_PROSTATUS]: {
    idNhapThongKe?: number;
  };
  [proStatusRoutes.UPDATE_PROSTATUS]: {
    action?: number;
    item?: any;
    idNhapThongKe?: number;
  };
};
export const ProStatusRouter = prefix;
const ProStatusStack = createStackNavigator();

export const ProStatusNavigator = () => {
  return (
    <ProStatusStack.Navigator>
      <ProStatusStack.Screen
        name={proStatusRoutes.PROSTATUSMANAGEMENT}
        component={ProSatusManagement}
        options={NoHeader}
      />
      <ProStatusStack.Screen
        name={proStatusRoutes.ADDPROSTATUSSCREEN}
        component={AddProStatusScreen}
        options={NoHeader}
      />
      <ProStatusStack.Screen
        name={proStatusRoutes.PROSTATUSITEM}
        component={ProductionSituationItem}
        options={NoHeader}
      />
      <ProStatusStack.Screen
        name={proStatusRoutes.ADD_PROSTATUS}
        component={AddProStatus}
        options={NoHeader}
      />
      <ProStatusStack.Screen
        name={proStatusRoutes.UPDATE_PROSTATUS}
        component={UpdateProStatus}
        options={NoHeader}
      />
    </ProStatusStack.Navigator>
  );
};
