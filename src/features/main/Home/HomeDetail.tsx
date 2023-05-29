import React from "react";
import { StatusBar, Text, View } from "react-native";

const HomeDetail = () => {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle={"light-content"} translucent />
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "lightblue",
        }}
      >
        <Text style={{ fontWeight: "bold", fontSize: 18 }}>Detail Screen</Text>
      </View>
    </View>
  );
};

export default HomeDetail;
