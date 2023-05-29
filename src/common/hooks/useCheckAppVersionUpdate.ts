import axios from "axios";
import { useCallback, useEffect } from "react";
import { Linking, Platform } from "react-native";
import DeviceInfo from "react-native-device-info";
import DialogAlert from "src/components/common/DialogAlert";
import semver from "semver";
import { logout } from "src/utils/auth";
import { navigationRoutes } from "src/navigation/StackNavigator";
import navigationService from "src/navigation/navigationService";

export const APP_CENTER_RELEASES =
  "https://api.appcenter.ms/v0.1/apps/my.viettel.store.2-gmail.com/MVS-2.0-Android-Release/distribution_groups/release/releases";

const useCheckAppVersionUpdate = () => {
  const checkVersion = useCallback(
    (
      appVersion: string,
      latestVersion: string,
      latestDisableVersion: string,
      action: () => void
    ) => {
      if (
        appVersion &&
        latestVersion &&
        (semver.lt(appVersion, latestVersion) ||
          (semver.lt(latestVersion, latestDisableVersion) &&
            semver.cmp(appVersion, "===", latestDisableVersion)))
      ) {
        DialogAlert.showNoti(
          "Thông báo",
          "Đã có bản cập nhật mới",
          [
            {
              text: "Cài đặt",
              onPress: () => {
                action();
                logout();
                navigationService.reset(navigationRoutes.LOGIN);
              },
            },
          ],
          { cancelable: false }
        );
      }
    },
    []
  );

  useEffect(() => {
    const appVersion = DeviceInfo.getVersion();
    if (Platform.OS === "ios") {
      // nếu app đã lên app store
      // axios
      //   .get(
      //     "http://itunes.apple.com/lookup?bundleId=com.viettel.app.myviettelstore&country=vn"
      //   )
      //   .then((versionInfo) => {
      //     const iosLink =
      //       "https://apps.apple.com/vn/app/my-viettelstore/id1261361819?ls=1";
      //     const latestVersion = semver.coerce(
      //       versionInfo.data.results[0].version
      //     );
      //     checkVersion(appVersion, latestVersion, () =>
      //       Linking.openURL(iosLink)
      //     );
      //   });

      // testflight ko support check version => check bằng version Android => khi build phải sửa cả 2 version android vs ios giống nhau
      axios
        .get(APP_CENTER_RELEASES, {
          headers: {
            "X-API-Token": "a0bde326841b5fa842af08b435c437ac689c7f39",
          },
        })
        .then((versionInfo) => {
          if (versionInfo.data.length > 0) {
            const currentBuildInfo = versionInfo.data
              .sort(
                (a, b) =>
                  new Date(b.uploaded_at).getTime() -
                  new Date(a.uploaded_at).getTime()
              )
              .filter((item) => item.enabled);
            const currentDisable = versionInfo.data
              .sort(
                (a, b) =>
                  new Date(b.uploaded_at).getTime() -
                  new Date(a.uploaded_at).getTime()
              )
              .filter((item) => !item.enabled);
            if (currentBuildInfo.length > 0 && currentDisable.length > 0) {
              const iosLink = "https://testflight.apple.com/join/lyLWTCOh";
              checkVersion(
                appVersion,
                currentBuildInfo[0].short_version,
                currentDisable[0].short_version,
                () => Linking.openURL(iosLink)
              );
            }
          }
        });
    } else if (Platform.OS === "android") {
      axios
        .get(APP_CENTER_RELEASES, {
          headers: {
            "X-API-Token": "a0bde326841b5fa842af08b435c437ac689c7f39",
          },
        })
        .then((versionInfo) => {
          if (versionInfo.data.length > 0) {
            const currentBuildInfo = versionInfo.data
              .sort(
                (a, b) =>
                  new Date(b.uploaded_at).getTime() -
                  new Date(a.uploaded_at).getTime()
              )
              .filter((item) => item.enabled);
            const currentDisable = versionInfo.data
              .sort(
                (a, b) =>
                  new Date(b.uploaded_at).getTime() -
                  new Date(a.uploaded_at).getTime()
              )
              .filter((item) => !item.enabled);
            if (currentBuildInfo.length > 0 && currentDisable.length > 0) {
              const androidLink =
                "https://install.appcenter.ms/users/my.viettel.store.2-gmail.com/apps/vpp-2.0-android-release/distribution_groups/release";
              checkVersion(
                appVersion,
                currentBuildInfo[0].short_version,
                currentDisable[0].short_version,
                () => Linking.openURL(androidLink)
              );
            }
          }
        });
    }
  }, [checkVersion]);
};

export default useCheckAppVersionUpdate;
