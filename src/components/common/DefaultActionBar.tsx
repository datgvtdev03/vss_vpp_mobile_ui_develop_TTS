import React from "react";
import {
  StyleSheet,
  SafeAreaView,
  StatusBar,
  View,
  TextStyle,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import dimens from "src/constants/dimens";
import Svgs from "src/constants/Svgs";
import navigationService from "src/navigation/navigationService";
import { Text } from "src/components/base/Typography";
import fonts from "src/constants/fonts";
import { useTailwind } from "src/lib/tailwind/tailwind";

const DefaultActionBar = ({
  title,
  iconType = "back",
  rightIconType,
  rightText = "",
  rightTextStyle,
  onPressLeft,
  onPressRight,
  disabled,
}: {
  title?: string;
  iconType?: "close" | "back" | "none";
  rightIconType?: "search";
  rightText?: string;
  rightTextStyle?: TextStyle;
  onPressLeft?: () => void;
  onPressRight?: () => void;
  disabled?: boolean;
}): React.ReactElement => {
  const { tw } = useTailwind();
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <View style={styles.titleContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {title || ""}
        </Text>
      </View>
      <View style={styles.backContainer}>
        <TouchableOpacity
          onPressIn={() => {
            onPressLeft ? onPressLeft() : navigationService.goBack();
          }}
          style={styles.backButton}
          disabled={iconType === "none"}
        >
          {iconType === "back" && <Svgs.BackHeader width={20} height={20} />}
          {iconType === "close" && <Svgs.Close fill={"#000000"} />}
          {iconType === "none" && <View style={styles.size20} />}
        </TouchableOpacity>
      </View>
      <View style={styles.rightContainer}>
        {rightIconType === undefined ? (
          <TouchableOpacity
            disabled={disabled}
            onPressIn={() => onPressRight && onPressRight()}
            style={tw("py-16")}
          >
            <Text
              style={[
                styles.txtDone,
                rightTextStyle,
                disabled && styles.txtDisabled,
              ]}
            >
              {rightText}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            disabled={disabled}
            onPress={() => onPressRight && onPressRight()}
            style={styles.search}
          >
            {rightIconType === "search" && (
              <Svgs.SearchIcon width={20} height={20} fill={"#000000"} />
            )}
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EE0033",
    justifyContent: "space-between",
    paddingTop: dimens.avoidStatusBarDistance,
    height: 80,
  },
  backContainer: {
    position: "absolute",
    left: 0,
    bottom: 0,
  },
  rightContainer: {
    position: "absolute",
    right: 0,
    bottom: 0,
  },
  backButton: {
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: "#FFFFFF",
    textAlign: "center",
    flex: 1,
    alignItems: "stretch",
  },
  titleContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingVertical: 16,
    paddingHorizontal: 48,
  },
  search: {
    padding: 12,
  },
  txtDone: {
    marginRight: 20,
    fontSize: 16,
    fontFamily: fonts.bold,
    color: "#FFFFFF",
    textAlign: "center",
    alignSelf: "flex-end",
  },
  size20: {
    width: 20,
    height: 20,
  },
  txtDisabled: {
    opacity: 0.5,
  },
});

export default DefaultActionBar;
