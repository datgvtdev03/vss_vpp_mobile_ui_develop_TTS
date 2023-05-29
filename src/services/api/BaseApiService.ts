import axios from "axios";
import Config from "react-native-config";
import deviceInfoModule from "react-native-device-info";
import { APP_CENTER_RELEASES } from "src/common/hooks/useCheckAppVersionUpdate";
import DialogAlert from "src/components/common/DialogAlert";
import { globalData } from "src/constants/common";
import { navigationRoutes } from "src/navigation/StackNavigator";
import navigationService from "src/navigation/navigationService";
import { getEndpointUrl } from "src/utils/helpers";
import { formatObjectTemplate, formatStringTemplate } from "src/utils/string";
import { generateApiService } from "./ApiService";
import erpErrorMessages from "./erpErrorMessages.json";
import { LoginApi } from "./login/LoginApi";
import endpoints from "./login/endpoints";

export type ResponseWrapper = {
  success: boolean;
  errorCode: string;
  content: any; // eslint-disable-line @typescript-eslint/no-explicit-any
};

class BaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BaseError";
  }
}

const BaseApiService = generateApiService({
  baseUrl: Config.BASE_API_URL,
  fromService: "BaseApiService",
  defaultHeader: () => ({
    Accept: "application/json",
    "Content-Type": "application/json",
  }),
  onSuccess: (data: ResponseWrapper, uiConfig) => {
    if (data.success) {
      return data.content;
    } else {
      const message =
        formatStringTemplate(
          erpErrorMessages[data.errorCode],
          uiConfig.formatValues || data.content
        ) ||
        `Lỗi, vui lòng thử lại!!! \n Version: ${deviceInfoModule.getVersion()} - ${
          globalData.userInfo?.maNhanVien
        }`;
      setTimeout(() => {
        DialogAlert.showError(
          "Thông báo",
          `${message} \n Version: ${deviceInfoModule.getVersion()} - ${
            globalData.userInfo?.maNhanVien
          }`
        );
      }, 500);
    }
  },
  onError: (error, uiConfig) => {
    console.log(JSON.stringify(error, null, 2));
    if (uiConfig.popup) {
      if (error instanceof BaseError) {
        DialogAlert.showError(
          "Thất bại",
          (error.message || "Gửi yêu cầu thất bại!") +
            ` \n Version: ${deviceInfoModule.getVersion()} - ${
              globalData.userInfo?.maNhanVien
            }`
        );
      } else if (error.response) {
        if (error.response.status === 401) {
          // token expired
          DialogAlert.showInfo(
            "Thông báo",
            `Phiên đăng nhập hết hạn \n Version: ${deviceInfoModule.getVersion()} - ${
              globalData.userInfo?.maNhanVien
            }`
          );
          navigationService.reset(navigationRoutes.LOGIN);
        } else if (
          error.response.status >= 500 &&
          error.response.status <= 599
        ) {
          setTimeout(() => {
            DialogAlert.showError(
              "Thất bại",
              `Lỗi hệ thống \n Version: ${deviceInfoModule.getVersion()} - ${
                globalData.userInfo?.maNhanVien
              }`
            );
          }, 300);
        } else {
          const data = error.response.data;
          let message: string;
          if (data.errorCode === "01") {
            message = "";
            setTimeout(() => {
              DialogAlert.showError(
                "Thất bại",
                `Lỗi, vui lòng thử lại! \n Version: ${deviceInfoModule.getVersion()} - ${
                  globalData.userInfo?.maNhanVien
                }`
              );
            }, 500);
            return { data };
          } else if (
            data.errorCode === null &&
            typeof data.content === "object"
          ) {
            message = formatObjectTemplate(data.content);
            console.log("====>>>>>>>");
            console.log("error", error.response.data);
            console.log("uiConfig", uiConfig);
            console.log("message", message);
            console.log("===>>>>>>>>");
            setTimeout(() => {
              DialogAlert.showError(
                "Thất bại",
                `${message} \n Url:  ${getEndpointUrl(
                  error?.config?.url
                )} \n Version: ${deviceInfoModule.getVersion()} - ${
                  globalData.userInfo?.maNhanVien
                }`
              );
              // DialogAlert.showError("Thất bại", "Lỗi dữ liệu!");
            }, 500);
            return { data };
          } else {
            message =
              formatStringTemplate(
                erpErrorMessages[data.errorCode],
                Array.isArray(data.content)
                  ? data.content.includes(null)
                    ? uiConfig.formatValues
                    : data.content
                  : data.content
                  ? [data.content]
                  : uiConfig.formatValues
              ) ||
              uiConfig.popupContent?.message ||
              data?.content ||
              "Gửi yêu cầu thất bại!!";
          }
          console.log("====>>>>>>>");
          console.log("error", error.response.data);
          console.log("uiConfig", uiConfig);
          console.log("message", message);
          console.log("===>>>>>>>>");
          setTimeout(() => {
            DialogAlert.showError(
              uiConfig.popupContent?.title || "Thất bại",
              `${message} \n Mã lỗi: ${
                error?.response?.data?.errorCode
              } \n Url: ${getEndpointUrl(
                error?.config?.url
              )} \n Version: ${deviceInfoModule.getVersion()} - ${
                globalData.userInfo?.maNhanVien
              }`,
              typeof uiConfig.popupContent?.action === "function"
                ? [
                    {
                      text: "Đóng",
                      onPress: () => {
                        // @ts-ignore
                        uiConfig.popupContent?.action(data.errorCode);
                      },
                    },
                  ]
                : []
            );
          }, 500);
          return { data };
        }
      } else {
        DialogAlert.showError(
          uiConfig.popupContent?.title || "Thất bại",
          (error?.message || "Gửi yêu cầu thất bại!!!") +
            `\n Version: ${deviceInfoModule.getVersion()} - ${
              globalData.userInfo?.maNhanVien
            }`
        );
      }
    }
    const response = error.response;
    const request = error.request;
    return { ...error, response, request };
  },
  onInterceptorApi: {
    request: {
      onFulfilled: (config) => {
        if (
          config.url === Config.KEYCLOAK_API_URL + endpoints.v1.refreshToken ||
          config.url === Config.KEYCLOAK_API_URL + endpoints.v1.keycloakAuth ||
          config.url === APP_CENTER_RELEASES
        ) {
          return config;
        } else {
          if (globalData.keycloakToken) {
            config.headers.Authorization = "Bearer " + globalData.keycloakToken;
          }
          return config;
        }
      },
      onRejected: (err) => {
        return Promise.reject(err);
      },
    },
    response: {
      onFulfilled: (res) => {
        return res;
      },
      onRejected: async (err) => {
        const originalConfig = err.config;
        if (err.response?.status === 401 && !originalConfig?._retry) {
          originalConfig._retry = true;
          try {
            const rs = await LoginApi.refreshToken(
              globalData.keycloakRefreshToken
            )
              .popup(false)
              .run();
            globalData.keycloakToken = rs.access_token;
            globalData.keycloakRefreshToken = rs.refresh_token;

            return await axios.request(originalConfig);
          } catch (_error) {
            return Promise.reject(_error);
          }
        } else {
          return Promise.reject(err);
        }
      },
    },
  },
});

export default BaseApiService;
