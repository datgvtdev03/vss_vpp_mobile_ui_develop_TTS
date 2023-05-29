import React from "react";
import { StyleProp, View, ViewStyle, TextStyle } from "react-native";
import tw from "src/lib/tailwind/tailwind";
import { Text } from "../../components/base/Typography";

export type LabelProps = {
  label: string;
  required?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
};

function withLabel<P>(component: React.ComponentType<P>) {
  return (props: LabelProps & P) => {
    return (
      <View style={props.containerStyle}>
        <Text style={[tw("text-#707070", "mb-8"), props.labelStyle]}>
          {props.label}
          {props.required && <Text style={tw("text-error")}> *</Text>}
        </Text>
        {React.createElement<P>(component, props)}
      </View>
    );
  };
}

export default withLabel;
