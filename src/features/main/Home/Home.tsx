import React, { useMemo } from "react";
import {
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
import ChooseStatisticType from "./components/ChooseStatisticType";

export type DataContent = {
  id: string;
  title: string;
  icon: string;
};

interface ItemData {
  title: string;
  icon?: React.ReactElement;
  onPress?: () => void;
  valueAlert?: number;
  opacity?: number;
  disable?: boolean;
}

enum MenuType {
  Consult = "0",
  Sale = "1",
  Product = "2",
  Customer = "3",
}

const HEIGHT_STATUS_BAR =
  Platform.OS === "ios" ? getStatusBarHeight() + 20 : 20;

const Item = ({
  title,
  icon,
  onPress,
  valueAlert,
  opacity = 1,
  disable,
}: ItemData) => {
  return (
    <TouchableOpacity onPress={onPress} disabled={disable} style={styles.item}>
      <View style={{ opacity }}>
        {valueAlert && valueAlert > 0 ? (
          <TouchableOpacity
            style={styles.notiView}
            onPress={() => DialogAlert.showCustomView(<ChooseStatisticType />)}
          >
            <Svgs.BadgeAdd />
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

const Home = (): React.ReactElement => {
  const menus = useMemo(
    () => [
      {
        id: MenuType.Consult,
        title: "Thống kê",
        icon: <Svgs.Statistic />,
        badge: 15,
        disable: false,
        action: () =>
          navigationService.navigate(navigationRoutes.STATISTIC_MANAGEMENT),
      },
      {
        id: MenuType.Product,
        title: "Menu 2",
        icon: <Svgs.Order />,
        badge: 15,
        disable: false,
        action: () =>
          navigationService.navigate(navigationRoutes.STATISTIC_ADD_SCREEN),
      },
      {
        id: MenuType.Customer,
        title: "Menu 3",
        icon: <Svgs.Salary />,
        badge: 0,
        disable: false,
        action: () => alert("Clicked"),
      },
      {
        id: MenuType.Sale,
        title: "Menu 4",
        icon: <Svgs.Utilities />,
        badge: 15,
        disable: false,
        action: () => alert("Clicked"),
      },
    ],
    []
  );

  // useCheckAppVersionUpdate();
  // useCheckAppState();

  return (
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
              <Svgs.ViettelStore />
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
                  {globalData.userInfo.hoTen}
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
                  valueAlert={item.badge}
                  onPress={item.action}
                />
              );
            })}
          </View>
        </ScrollView>
      </View>
    </Animated.View>
  );
};

export default Home;
