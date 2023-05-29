import React, { useMemo, useState } from "react";
import { LayoutAnimation, Text, TouchableOpacity, View } from "react-native";
import Svgs from "src/constants/Svgs";
import { useTailwind } from "src/lib/tailwind/tailwind";

interface Subcategory {
  id: number;
  title: string;
  action?: () => void;
}

export interface ItemData {
  id: number;
  isDisable: boolean;
  title: string;
  icon?: React.ReactElement;
  subcategory: Subcategory[];
  action: () => void;
}

//Custom Component for the Expandable List
const Expandable = ({
  isDisable,
  title,
  subcategory,
  icon,
  action,
}: ItemData) => {
  const { tw } = useTailwind();
  const [isExpand, setExpand] = useState(false);
  const isSubCategory = useMemo(() => {
    return subcategory.length > 0 ? true : false;
  }, [subcategory]);

  return (
    <View>
      {/*Header of the Expandable List Item*/}
      <TouchableOpacity
        activeOpacity={0.8}
        disabled={isDisable}
        onPress={() => {
          if (isSubCategory) {
            LayoutAnimation.configureNext(
              LayoutAnimation.Presets.easeInEaseOut
            );
            setExpand(!isExpand);
          } else {
            action();
          }
        }}
        style={tw("flex-row")}
      >
        <View>
          <View style={tw("flex-row")}>
            <View style={tw("items-center", "justify-center", "w-40")}>
              {icon}
            </View>
            <Text
              style={[tw("w-3/4", "my-12"), isDisable && tw("text-#AAAAAA")]}
            >
              {title}
            </Text>
            <View style={tw("mt-12", "ml-20", "flex-row", "justify-end")}>
              {isExpand ? (
                <Svgs.ArrowDown fill="#000000" />
              ) : (
                <Svgs.ArrowRight fill={isDisable ? "#AAAAAA" : "#000000"} />
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
      {isExpand ? (
        <View>
          {/*Content under the header of the Expandable List Item*/}
          {subcategory.map((item, key) => (
            <TouchableOpacity
              key={key}
              style={tw("pl-48", "pr-15")}
              onPress={item.action}
            >
              <Text style={tw("pb-16", "pt-8")}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View />
      )}
    </View>
  );
};

export default Expandable;
