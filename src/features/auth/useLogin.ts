import { useCallback, useEffect, useState } from "react";
import { UseFormSetValue } from "react-hook-form";
import LoadingPortal from "src/components/base/LoadingPortal";
import DialogAlert from "src/components/common/DialogAlert";
import { globalData } from "src/constants/common";
import { LoginInfo } from "src/models/login";
import { navigationRoutes } from "src/navigation/StackNavigator";
import navigationService from "src/navigation/navigationService";
import { LoginApi } from "src/services/api/login/LoginApi";
import { logout } from "src/utils/auth";
import { isEmptyObj, isHasLength } from "src/utils/helpers";
import { getLoginInfo, setLoginInfo } from "src/utils/persist";
import { AssertsShape } from "yup/lib/object";
import { RequiredStringSchema } from "yup/lib/string";
import { StatisticApi } from "../statistic/api/StatisticApi";
import { Position } from "../statistic/models/statistic";

const useLogin = (
  setValue: UseFormSetValue<
    AssertsShape<{
      username: RequiredStringSchema<string | undefined>;
      password: RequiredStringSchema<string | undefined>;
    }>
  >
) => {
  const [savedLoginInfo, setSavedLoginInfo] = useState<LoginInfo>(
    {} as LoginInfo
  );

  useEffect(() => {
    getLoginInfo().then((loginInfo) => {
      if (loginInfo !== null) {
        setValue("username", loginInfo.username);
        setValue("password", loginInfo.password);
        setSavedLoginInfo(loginInfo);
        handleLogin(loginInfo);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setValue]);
  const removeLoginInfo = useCallback(() => {
    logout();
    setSavedLoginInfo({} as LoginInfo);
    setValue("username", "");
    setValue("password", "");
  }, [setValue]);

  const faceIDLogin = useCallback(() => {
    DialogAlert.showNoti(
      "Không nhận ra khuôn mặt",
      "Thử lại",
      [{ text: "Thủ lại FaceID", onPress: () => null }],
      { cancelable: false }
    );
  }, []);

  const handleLogin = useCallback(async (formData) => {
    LoadingPortal.show();
    const _username = formData.username;
    const _password = formData.password;
    try {
      const response = await LoginApi.login(_username, _password, 15)
        .loading(false)
        .run();

      if (response?.access_token) {
        globalData.keycloakToken = response.access_token;
        globalData.keycloakRefreshToken = response.refresh_token;
        globalData.userToken.access_token = response.access_token;
      }

      const staffInfo = await StatisticApi.getStaffInformation().run();
      const positions = await StatisticApi.getStaffsPosition().run();
      if (!isEmptyObj(staffInfo) && isHasLength(positions)) {
        const _position = positions.find(
          (item) => item.maChucDanh === staffInfo.idChucDanhNv
        );
        globalData.userPosition = _position ? _position : ({} as Position);
        globalData.userInfo = {
          ...staffInfo,
          displayName: `${staffInfo.maNhanVien} - ${staffInfo.hoTen}`,
        };
        setLoginInfo({
          username: _username,
          password: _password,
          name: staffInfo.hoTen,
          gender: parseInt(staffInfo.gioiTinh, 10),
          avatar: "",
        });

        navigationService.navigate(navigationRoutes.MAIN);
      }
    } finally {
      LoadingPortal.hide();
    }
  }, []);

  return {
    handleLogin,
    savedLoginInfo,
    removeLoginInfo,
    faceIDLogin,
  };
};

export default useLogin;
