import React from "react";
import { StyleSheet, StatusBar, View, SafeAreaView } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import dimens from "src/constants/dimens";
import Svgs from "src/constants/Svgs";
import navigationService from "src/navigation/navigationService";
import { Text } from "src/components/base/Typography";
import colors from "src/constants/colors";

const ConsultingActionBar = ({
  title,
  iconType = "back",
  onPressLeft,
  rightActions = [],
}: {
  title?: string;
  iconType?: "close" | "back";
  onPressLeft?: () => void;
  rightActions?: { icon: React.ReactElement | null; action: () => void }[];
}): React.ReactElement => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title || ""}</Text>
      </View>
      <View style={styles.backContainer}>
        <TouchableOpacity
          onPress={() =>
            onPressLeft ? onPressLeft() : navigationService.goBack()
          }
          style={styles.backButton}
        >
          {iconType === "back" && <Svgs.BackHeader width={20} height={20} />}
          {iconType === "close" && <Svgs.Close />}
        </TouchableOpacity>
      </View>
      <View style={styles.boxActionHeader}>
        {rightActions.map((action, idx) => (
          <TouchableOpacity
            key={String(idx)}
            onPress={action.action}
            style={styles.search}
          >
            {action.icon}
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor:colors.color_EE0033,
    justifyContent: "space-between",
    paddingTop: dimens.avoidStatusBarDistance,
    height: 80,
  },
  backContainer: {
    position: "absolute",
    left: 0,
    bottom: 0,
  },
  backButton: {
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
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
    padding: 16,
  },
  search: {
    paddingRight: 8,
    paddingTop: 2,
  },
  txtDone: {
    marginRight: 20,
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
  },
  boxActionHeader: {
    flexDirection: "row",
    position: "absolute",
    right: 0,
    bottom: 0,
    paddingBottom: 16,
  },
});

export default ConsultingActionBar;
