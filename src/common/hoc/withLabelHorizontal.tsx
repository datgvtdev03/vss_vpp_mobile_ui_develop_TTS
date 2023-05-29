import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import tw from "src/lib/tailwind/tailwind";
import { Text } from "../../components/base/Typography";

export type LabelProps = {
  label: string;
  required?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
};

function withLabelHorizontal<P>(component: React.ComponentType<P>) {
  return (props: LabelProps & P) => {
    return (
      <View style={tw("flex-row", "justify-around")}>
        <Text style={tw("text-#707070", "self-center", "px-10", "text-14")}>
          {props.label}
          {props.required && <Text style={tw("text-error")}> *</Text>}
        </Text>
        <View style={props.containerStyle}>
          {React.createElement<P>(component, props)}
        </View>
      </View>
    );
  };
}
export default withLabelHorizontal;
