import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { elevations } from "src/common/styles/elevation";
import { PixGrow } from "src/components/base/Pix";
import Svgs from "src/constants/Svgs";
import { useTailwind } from "src/lib/tailwind/tailwind";

interface Props {
  children: React.ReactElement;
  title: string;
}

const InfoCard = (props: Props) => {
  const { tw } = useTailwind();
  const [expand, setExpand] = useState(true);

  return (
    <View style={styles.mainView}>
      <TouchableOpacity
        onPress={() => setExpand(!expand)}
        style={tw("flex-row", "items-center", "pl-16", "py-12")}
      >
        {/* <Svgs.InfoUser width={24} height={24} /> */}
        <View style={tw("flex-row", "py-0")}>
          <Text style={tw("ml-8", "font-semi-bold", "uppercase")}>
            {props.title}
          </Text>
        </View>
        <PixGrow />
        {expand ? (
          <Svgs.ArrowDown style={tw("mr-16")} fill="#AAAAAA" />
        ) : (
          <Svgs.RightArrow style={tw("mr-16")} fill="#AAAAAA" />
        )}
      </TouchableOpacity>
      {expand ? (
        <>
          <View style={styles.line} />
          {props.children}
        </>
      ) : null}
    </View>
  );
};
export default InfoCard;

const styles = StyleSheet.create({
  mainView: {
    backgroundColor: "white",
    marginBottom: 16,
    borderRadius: 8,
    ...elevations[5],
  },
  line: {
    height: 1,
    backgroundColor: "#DFDFE0",
  },
});
