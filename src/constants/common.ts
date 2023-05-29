import { Position, Staff } from "src/features/statistic/models/statistic";
import { Token } from "src/models/login";

export const DEFAULT_LANGUAGE = "vi";
const REQUEST_TIMEOUT = 5000 * 1000;

enum UserRole {
  Dummy = -1,
  StoreManager = 1, // GDST, TC
  StoreStaff = 2, // NVST
}

interface GlobalData {
  userToken: Token;
  userRole: UserRole;
  userRoleCode: string;
  userInfo: Staff;
  userPosition: Position;

  // erp
  keycloakToken: string;
  keycloakRefreshToken: string;
}
const globalData: GlobalData = {
  userToken: {} as Token,
  userRole: UserRole.Dummy,
  userRoleCode: "",
  userInfo: {} as Staff,
  userPosition: {} as Position,

  // erp
  keycloakToken: "",
  keycloakRefreshToken: "",
};
const clearGlobalData = (): void => {
  globalData.userToken = {} as Token;
  globalData.userRole = UserRole.Dummy;
  globalData.userInfo = {} as Staff;
  globalData.userPosition = {} as Position;

  // erp
  globalData.keycloakToken = "";
  globalData.keycloakRefreshToken = "";
};

export { clearGlobalData, globalData, REQUEST_TIMEOUT, UserRole };
