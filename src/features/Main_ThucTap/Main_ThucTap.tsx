import React, { useMemo, useState } from "react";
import {
  Alert,
  Animated,
  Platform,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  View,
} from "react-native";
import { getStatusBarHeight } from "react-native-iphone-x-helper";
import defaultStyles from "src/common/styles";
import { Text } from "src/components/base/Typography";
import DialogAlert from "src/components/common/DialogAlert";
import Svgs from "src/constants/Svgs";
import colors from "src/constants/colors";
import { globalData } from "src/constants/common";
import styles from "src/features/main/Home/styles";
import { navigationRoutes } from "src/navigation/StackNavigator";
import navigationService from "src/navigation/navigationService";
import ChooseStatisticType from "../main/Home/components/ChooseStatisticType";
import { useTailwind } from "src/lib/tailwind/tailwind";
import Button from "src/components/base/Button";
import { StatisticApi } from "src/features/statistic/api/StatisticApi";
import deviceInfoModule from "react-native-device-info";
import Config from "react-native-config";
import axios from "axios";
import { use } from "i18next";
import { Provider } from "react-redux";
import store from "src/redux/store";
export type DataContent = {
  id: string;
  title: string;
  icon: string;
};

interface ItemData {
  title: string;
  icon?: React.ReactElement;
  onPress?: () => void;
  onPressSubAction?: () => void;
  opacity?: number;
  disable?: boolean;
  subIcon?: boolean;
}

enum MenuType {
  Consult = "0",
  Sale = "1",
  Product = "2",
  Customer = "3",
  ProductionStatus = "4",
}

const HEIGHT_STATUS_BAR =
  Platform.OS === "ios" ? getStatusBarHeight() + 20 : 20;

const Item = ({
  title,
  icon,
  onPress,
  opacity = 1,
  disable,
  onPressSubAction,
  subIcon = false,
}: ItemData) => {
  return (
    <TouchableOpacity onPress={onPress} disabled={disable} style={styles.item}>
      <View style={{ opacity }}>
        {subIcon ? (
          <TouchableOpacity style={styles.notiView} onPress={onPressSubAction}>
            <Svgs.BadgeAdd width={30} height={30} />
          </TouchableOpacity>
        ) : (
          <View />
        )}
        <View style={styles.itemView}>{icon}</View>
        <View style={styles.textView}>
          <Text
            style={
              disable
                ? [styles.itemText, { color: colors.color_C1C1C3 }]
                : styles.itemText
            }
          >
            {title}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const Main_Thuctap = (): React.ReactElement => {
  const { tw } = useTailwind();
  const menus = useMemo(
    () => [
      {
        id: MenuType.Consult,
        title: "Thống kê",
        icon: <Svgs.Statistic />,
        disable: false,
        action: () =>
          navigationService.navigate(navigationRoutes.STATISTIC_BOTTOM_TAB),
        subIcon: true,
        onPressSubAction: () =>
          DialogAlert.showCustomView(<ChooseStatisticType />),
      },
    ],
    []
  );

  // useCheckAppVersionUpdate();
  // useCheckAppState();c
  const [textValue, setTextVale] = useState();
  const idHoatDongThongKe = 9934;
  return (
    <Provider store={store}>
      <Animated.View style={styles.stack}>
        {Platform.OS === "ios" ? (
          <View
            style={{
              backgroundColor: colors.color_EE0033,
              paddingTop: HEIGHT_STATUS_BAR,
            }}
          />
        ) : (
          <StatusBar
            barStyle="light-content"
            backgroundColor={colors.color_EE0033}
          />
        )}
        <View style={[defaultStyles.flex_1]}>
          <View style={[styles.ViewLeftMenu, styles.paddingStatusHeight]}>
            <View style={styles.ViewLeftMenuContent}>
              <View style={styles.ViewLeftMenuItem}>
                <TouchableOpacity onPress={navigationService.toggleDrawer}>
                  <Svgs.IconMenu />
                </TouchableOpacity>
                {/* <Svgs.ViettelStore /> */}
                <Text style={tw("text-white", "text-20", "font-bold")}>
                  Viettel Printing & Packaging
                </Text>
                <TouchableOpacity onPress={() => null}>
                  {/* <Svgs.IconSearch /> */}
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.ViewHead}>
              {/* {globalData.userInfo.gioiTinh === Gender.Female ? (
              <Svgs.FemaleAvatar width={40} height={40} />
            ) : (
              <Svgs.MaleAvatar width={40} height={40} />
            )} */}
              <Svgs.MaleAvatar width={40} height={40} />
              <View style={styles.viewHearLeft}>
                <View style={styles.viewHearLeftContent}>
                  <Text style={styles.TextTop}>{`Xin chào, `}</Text>
                  <Text style={styles.TextCenter}>
                    {`${globalData.userInfo.hoTen} - ${globalData.databaseType}`}
                  </Text>
                </View>
                <Text style={styles.TextBot}>
                  {`Chúc bạn một ngày làm việc tốt lành!`}
                </Text>
              </View>
            </View>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
              {menus?.map((item) => {
                return (
                  <Item
                    disable={item.disable}
                    key={item.id}
                    title={item.title}
                    icon={item.icon}
                    onPress={item.action}
                    onPressSubAction={item.onPressSubAction}
                    subIcon={item.subIcon}
                  />
                );
              })}
            </View>
          </ScrollView>
        </View>
        <View>
          <Text>{textValue}</Text>
        </View>
      </Animated.View>
    </Provider>
  );
};

export default Main_Thuctap;
