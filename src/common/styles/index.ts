import atomicStyles from "./atomicUtils";
import elevationStyles from "./elevation";
import gridStyles from "./grids";
import { StyleSheet } from "react-native";

const defaultStyles = StyleSheet.create({
  ...atomicStyles,
  ...elevationStyles,
  ...gridStyles,
});
export default defaultStyles;

export const grid = StyleSheet.create(gridStyles);
export const atomic = StyleSheet.create(atomicStyles);
export const elevation = StyleSheet.create(elevationStyles);
