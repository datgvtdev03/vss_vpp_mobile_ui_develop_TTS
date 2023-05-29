import * as React from "react";
import { View } from "react-native";

type Props = {
  onValueChange: (value: number | string | null) => void;
  value: number | string | null;
  children: React.ReactNode;
};

export type RadioButtonContextType = {
  value: number | string | null;
  onValueChange: ((value: number | string | null) => void) | null;
};

export const RadioButtonContext = React.createContext<RadioButtonContextType>({
  value: null,
  onValueChange: null,
});
const RadioButtonGroup = ({
  value,
  onValueChange,
  children,
  ...props
}: Props): React.ReactElement => (
  <RadioButtonContext.Provider value={{ value, onValueChange }}>
    <View accessible accessibilityRole="radiogroup" {...props}>
      {children}
    </View>
  </RadioButtonContext.Provider>
);

export default RadioButtonGroup;
