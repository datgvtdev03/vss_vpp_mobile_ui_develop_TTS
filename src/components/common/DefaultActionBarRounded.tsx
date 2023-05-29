import React from "react";
import { StyleSheet, StatusBar, View } from "react-native";
import { Text } from "src/components/base/Typography";
import { TouchableOpacity } from "react-native-gesture-handler";
import dimens from "src/constants/dimens";
import Svgs from "src/constants/Svgs";
import navigationService from "src/navigation/navigationService";
import useWindowSize from "src/common/hooks/useScreenSize";

const DefaultActionBarRounded = ({
  title,
  iconType = "back",
  rightIconType,
  rightText = "",
  onPressRight = () => null,
}: {
  title?: string;
  iconType?: "close" | "back";
  rightIconType?: "search";
  rightText?: string;
  onPressRight?: () => void;
}): React.ReactElement => {
  const { width } = useWindowSize();
  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <View style={styles.content}>
        <Text style={styles.title}>{title || ""}</Text>
        <TouchableOpacity
          onPress={navigationService.goBack}
          style={styles.backButton}
        >
          {iconType === "back" && <Svgs.BackHeader />}
          {iconType === "close" && <Svgs.Close />}
        </TouchableOpacity>
        {rightIconType === undefined ? (
          <TouchableOpacity onPress={onPressRight}>
            <Text style={styles.txtDone}>{rightText}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={onPressRight} style={styles.search}>
            {rightIconType === "search" && (
              <Svgs.SearchIcon width={20} height={20} />
            )}
          </TouchableOpacity>
        )}
      </View>
      <Svgs.BackgroundHeader width={width} height={width * 0.463} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  content: {
    zIndex: 10,
    width: "100%",
    marginTop: 7 + (dimens.statusBarHeight || 0),
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    position: "absolute",
    left: 0,
    right: 0,
  },
  search: {
    paddingRight: 16,
    paddingTop: 2,
  },
  txtDone: {
    marginRight: 20,
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
  },
});

export default DefaultActionBarRounded;
