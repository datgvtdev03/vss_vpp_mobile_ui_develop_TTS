import { clearGlobalData } from "src/constants/common";
import { clearLoginInfo } from "./persist";
import messaging from "@react-native-firebase/messaging";

export const logout = async () => {
  clearLoginInfo();
  messaging().deleteToken();
  // const res = await CategoryApi.postDeleteCacheUser().run();
  // res && clearGlobalData();
};
