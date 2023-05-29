import Config from "react-native-config";
import DialogAlert from "src/components/common/DialogAlert";
import { generateApiService } from "./ApiService";
import deviceInfoModule from "react-native-device-info";
import { globalData } from "src/constants/common";
import { ResponseWrapper } from "./BaseApiService";

const KeycloakApiService = generateApiService({
  baseUrl: Config.KEYCLOAK_API_URL,
  fromService: "KeycloakApiService",
  defaultHeader: () => ({
    Accept: "*/*",
    "Content-Type": "application/json",
  }),
  onSuccess: (data: ResponseWrapper) => {
    if (data.success) {
      return data.content;
    }
  },
  onError: (error, uiConfig) => {
    console.log(JSON.stringify(error, null, 2));
    if (uiConfig.popup) {
      if (error?.response) {
        const data = error?.response?.data;
        if (error?.response?.status >= 500 && error?.response?.status <= 599) {
          setTimeout(() => {
            DialogAlert.showError(
              "Thất bại",
              `Lỗi hệ thống \n Version: ${deviceInfoModule.getVersion()} - ${
                globalData.userInfo.maNhanVien
              }`
            );
          }, 300);
        } else {
          if (typeof data.errorCode === "string") {
            setTimeout(() => {
              DialogAlert.showError(
                "Thất bại",
                `${
                  data.errorCode
                } \n Version: ${deviceInfoModule.getVersion()} - ${
                  globalData.userInfo.maNhanVien
                }`
              );
            }, 300);
          }
        }
      } else {
        DialogAlert.showError(
          uiConfig.popupContent?.title || "Thất bại",
          (error?.message || "Gửi yêu cầu thất bại.....") +
            `\n Version: ${deviceInfoModule.getVersion()} - ${
              globalData.userInfo.maNhanVien
            }`
        );
      }
    }

    const response = error.response;
    const request = error.request;
    return { ...error, response, request };
  },
});

export default KeycloakApiService;
