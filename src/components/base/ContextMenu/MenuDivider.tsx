import React from "react";

import { ColorValue, StyleSheet, View } from "react-native";

const MenuDivider = React.memo(
  ({ color = "rgba(0,0,0,0.12)" }: { color?: ColorValue }) => {
    return <View style={[styles.divider, { borderBottomColor: color }]} />;
  }
);

const styles = StyleSheet.create({
  divider: {
    flex: 1,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});

export default MenuDivider;
