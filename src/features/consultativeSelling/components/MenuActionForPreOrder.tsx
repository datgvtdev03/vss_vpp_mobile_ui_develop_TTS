import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Text } from "src/components/base/Typography";
import { useTailwind } from "src/lib/tailwind/tailwind";

type Menu = {
  id: number;
  value: string;
  icon: React.ReactElement;
  action?: () => void;
  disabled?: boolean;
};

const MenuActions = ({ types, width }: { types: Menu[]; width: number }) => {
  const { tw } = useTailwind();
  const numberPerLine = 4;
  const lines = Math.ceil(types.length / numberPerLine);
  const arrayLines: number[] = [];
  for (let line = 1; line <= lines; line++) {
    arrayLines.push(line);
  }

  return (
    <>
      {arrayLines.map((line, index) => {
        return (
          <View
            key={`${index}`}
            style={tw(
              "flex-row",
              types.length <= 3 ? "justify-between" : "justify-start"
            )}
          >
            {types
              .slice(
                (line - 1) * numberPerLine,
                (line - 1) * numberPerLine + numberPerLine
              )
              .map((type) => (
                <TouchableOpacity
                  onPress={type.action}
                  disabled={type.disabled}
                  style={[
                    tw(
                      "pt-24",
                      "rounded-16",
                      "shadow-3",
                      "border",
                      "border-white",
                      "bg-white",
                      "items-center",
                      types.length <= 3 ? "mr-0" : "mr-10",
                      "mb-24",
                      "ratio-1",
                      type.disabled ? "opacity-50" : "opacity-100"
                    ),
                    { width },
                  ]}
                  key={type.id}
                >
                  {type.icon}
                  <Text
                    style={tw("text-10", "text-#353535", "mt-8", "text-center")}
                  >
                    {type.value}
                  </Text>
                </TouchableOpacity>
              ))}
          </View>
        );
      })}
    </>
  );
};

export default MenuActions;
