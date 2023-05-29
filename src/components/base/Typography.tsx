import React, { PropsWithChildren } from "react";
import { Text as RnText, TextProps } from "react-native";
import { useTailwind } from "src/lib/tailwind/tailwind";

type Props = PropsWithChildren<TextProps>;

const Text = React.memo(({ style, ...props }: Props): React.ReactElement => {
  const { tw } = useTailwind();
  return (
    <RnText
      ellipsizeMode={"tail"}
      style={[
        tw("font-regular", "text-black" /*, "dark:text-white"*/, "text-14"),
        style,
      ]}
      {...props}
    />
  );
});

export { Text };
