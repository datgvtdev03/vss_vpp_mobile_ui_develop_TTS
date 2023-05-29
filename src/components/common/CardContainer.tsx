import React, { useEffect, useState } from "react";
import { LayoutAnimation, Text, TouchableOpacity, View } from "react-native";
import Svgs from "src/constants/Svgs";
import { useTailwind } from "src/lib/tailwind/tailwind";

interface CardContainerProps {
  children: React.ReactNode;
  titleCard: string;
  icon?: React.ReactElement;
  action?: () => void;
  isDisableAction?: boolean;
  titleAction?: string;
  isOpen?: boolean;
  isExpand?: boolean;
}

const CardContainer = ({
  children,
  titleCard,
  icon,
  action,
  isDisableAction,
  titleAction,
  isOpen,
  isExpand = true,
}: CardContainerProps) => {
  const { tw } = useTailwind();
  const [expand, setExpand] = useState(false);

  useEffect(() => {
    isOpen ? setExpand(true) : setExpand(false);
  }, [isOpen]);

  return (
    <View style={tw("bg-white", "mx-16", "rounded-10", "shadow-5")}>
      <View
        style={[
          tw("flex-row", "px-8", "py-12", "border-b", "border-#E3E3E4"),
          !expand && tw("border-b-0"),
        ]}
      >
        <View style={tw("flex-row", "flex-2", "items-center")}>
          {icon ? <View style={tw("px-4")}>{icon}</View> : null}

          <Text style={tw("uppercase")}>{titleCard}</Text>
        </View>

        <View style={tw("flex-1")}>
          <View style={tw("items-center", "flex-row", "justify-end")}>
            {action ? (
              <TouchableOpacity
                style={tw("px-12", "py-8")}
                onPress={action}
                disabled={isDisableAction}
              >
                <Text style={tw("text-#EE0033")}>
                  {titleAction ? titleAction : ""}
                </Text>
              </TouchableOpacity>
            ) : null}
            {children ? (
              isExpand ? (
                <TouchableOpacity
                  style={tw("px-10", "py-12")}
                  onPress={() => {
                    LayoutAnimation.configureNext({
                      duration: 200,
                      create: {
                        type: LayoutAnimation.Types.easeInEaseOut,
                        property: LayoutAnimation.Properties.opacity,
                      },
                      update: {
                        type: LayoutAnimation.Types.easeInEaseOut,
                      },
                    });
                    setExpand(!expand);
                  }}
                >
                  {expand ? (
                    <Svgs.ArrowUp fill={"#000000"} />
                  ) : (
                    <Svgs.ArrowDown fill={"#000000"} />
                  )}
                </TouchableOpacity>
              ) : null
            ) : null}
          </View>
        </View>
      </View>

      {expand ? <View style={tw("p-16")}>{children}</View> : null}
    </View>
  );
};

export default CardContainer;
