import React from "react";
import { StyleSheet, View } from "react-native";
import colors from "src/constants/colors";

interface Props {
  background?: string;
  color?: string;
  paddingMainAxis?: number | [number, number]; // Array is either [left, right] (for horizontal) or [top, bottom] for vertical
  paddingCrossAxis?: number | [number, number]; // Array is either [top, bottom] (for horizontal) or [left, right] for vertical
  vertical?: boolean;
  lineSize?: number;
  size?: number;
  stretch?: boolean;
  borderRadius?: number;
}

export default ({
  background = colors.white,
  color = colors.black,
  paddingMainAxis = 0,
  paddingCrossAxis = 0,
  vertical = false,
  lineSize = 1,
  stretch = false,
  size,
  borderRadius,
}: Props): React.ReactElement => {
  const styles = StyleSheet.create({
    wrapper: {
      backgroundColor: background,
      alignSelf: stretch ? "stretch" : "center",
    },
    divider: {
      backgroundColor: color,
      ...(vertical
        ? {
            ...(typeof paddingMainAxis === "number"
              ? {
                  marginHorizontal: paddingMainAxis,
                }
              : {
                  marginLeft: paddingMainAxis[0],
                  marginRight: paddingMainAxis[1],
                }),
            ...(typeof paddingCrossAxis === "number"
              ? {
                  marginVertical: paddingCrossAxis,
                }
              : {
                  marginTop: paddingCrossAxis[0],
                  marginBottom: paddingCrossAxis[1],
                }),
            width: lineSize,
            ...(size && { height: size }),
          }
        : {
            ...(typeof paddingMainAxis === "number"
              ? {
                  marginVertical: paddingMainAxis,
                }
              : {
                  marginTop: paddingMainAxis[0],
                  marginBottom: paddingMainAxis[1],
                }),
            ...(typeof paddingCrossAxis === "number"
              ? {
                  marginHorizontal: paddingCrossAxis,
                }
              : {
                  marginLeft: paddingCrossAxis[0],
                  marginRight: paddingCrossAxis[1],
                }),
            height: lineSize,
            ...(size && { width: size }),
          }),
      borderRadius: borderRadius,
    },
  });

  return (
    <View style={styles.wrapper}>
      <View style={styles.divider} />
    </View>
  );
};
