import React from "react";
import { Text, View } from "react-native";
import Svgs from "src/constants/Svgs";
import { useTailwind } from "src/lib/tailwind/tailwind";

interface EmptyComponentProps {
  text: string;
}

const EmptyComponent = ({ text }: EmptyComponentProps) => {
  const { tw } = useTailwind();
  return (
    <View style={tw("items-center", "justify-center", "flex-1", "pt-48")}>
      <Svgs.EmptyBlock height={84} width={84} style={tw("mb-16")} />
      <Text style={tw("text-center", "text-#707070")}>{text}</Text>
    </View>
  );
};

export default EmptyComponent;
