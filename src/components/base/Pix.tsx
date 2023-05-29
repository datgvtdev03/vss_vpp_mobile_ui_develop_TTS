import React from "react";
import { StyleSheet, View } from "react-native";

const Pix = ({ size }: { size: number }) => {
  return (
    <View
      style={{
        width: size,
        height: size,
      }}
    />
  );
};

const PixGrow = () => {
  return <View style={styles.flex1} />;
};

export default Pix;
export { PixGrow };

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
});
