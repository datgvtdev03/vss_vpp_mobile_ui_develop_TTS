import React from "react";
import { Text, TextStyle, View, StyleSheet } from "react-native";
import { ViewStyle } from "react-native";

interface Props {
  children?: React.ReactElement;
  text?: string;
  Icon?: React.ReactElement;
  size?: number;
  containerStyle?: ViewStyle;
  contentStyle?: TextStyle;
  accent?: boolean;
  bottom?: boolean;
  left?: boolean;
  dot?: boolean;
}

const getStyles = ({
  size = 0,
  containerStyle,
  contentStyle,
  accent,
  bottom,
  left,
  dot,
}: {
  size: number;
  containerStyle: ViewStyle;
  contentStyle: TextStyle;
  accent: boolean;
  bottom: boolean;
  left: boolean;
  dot: boolean;
}): {
  container: ViewStyle[];
  content: TextStyle[];
} => {
  const local: {
    container: ViewStyle;
  } = {
    container: {},
  };

  if (size) {
    local.container.width = size;
    local.container.height = size;
    local.container.borderRadius = size / 2;
  }

  if (dot) {
    local.container.width = 9;
    local.container.height = 9;
    local.container.borderRadius = 9 / 2;
  } else {
    local.container.minWidth = 20;
    local.container.height = 20;
    local.container.borderRadius = 20 / 2;
  }
  const offset = dot ? -5 : -10;

  if (bottom) {
    local.container.bottom = offset;
  } else {
    local.container.top = offset;
  }

  if (left) {
    local.container.left = offset;
  } else {
    local.container.right = offset;
  }

  if (accent) {
    local.container.backgroundColor = "#EE0033";
  }

  return {
    container: [staticStyles.container, local.container, containerStyle],
    content: [staticStyles.content, contentStyle],
  };
};

const Badge = ({
  children,
  text = "",
  Icon,
  size = 0,
  containerStyle = {},
  contentStyle = {},
  accent = false,
  bottom = false,
  left = false,
  dot = false,
}: Props) => {
  const renderContent = (contentStyles: {
    container: ViewStyle[];
    content: TextStyle[];
  }) => {
    let content: React.ReactElement;

    if (dot) {
      return <View style={contentStyles.container} />;
    } else {
      if (Icon) {
        content = Icon;
      } else {
        content = <Text style={contentStyles.content}>{text || ""}</Text>;
      }

      return <View style={contentStyles.container}>{content}</View>;
    }
  };

  const renderChildren = () => {
    if (!children) {
      return null;
    }

    return children;
  };

  const styles = getStyles({
    size,
    containerStyle,
    contentStyle,
    accent,
    bottom,
    left,
    dot,
  });

  return (
    <View style={[staticStyles.row, staticStyles.zIndex10]}>
      {renderChildren()}
      {renderContent(styles)}
    </View>
  );
};

export default Badge;

const staticStyles = StyleSheet.create({
  row: { flexDirection: "row" },
  zIndex10: { zIndex: 10 },
  container: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.87)",
  },
  content: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 12,
    paddingLeft: 6,
    paddingRight: 6,
    paddingTop: 4,
    paddingBottom: 4,
  },
});
