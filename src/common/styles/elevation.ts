import { Animated, Platform } from "react-native";

type keys =
  | "elevation_0"
  | "elevation_1"
  | "elevation_2"
  | "elevation_3"
  | "elevation_4"
  | "elevation_5"
  | "elevation_6"
  | "elevation_7"
  | "elevation_8"
  | "elevation_9"
  | "elevation_10";

type ElevationStyle = {
  shadowColor: string;
  shadowOffset: {
    width: number;
    height: number;
  };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
  zIndex: number;
  overflow?: "visible" | "hidden" | "scroll";
};

const levels: Record<keys, ElevationStyle> = {
  elevation_0: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
    zIndex: Platform.OS === "ios" ? 1 : 0,
  },
  elevation_1: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1,
    elevation: 1,
    zIndex: Platform.OS === "ios" ? 1 : 0,
  },
  elevation_2: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    zIndex: Platform.OS === "ios" ? 1 : 0,
  },
  elevation_3: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    zIndex: Platform.OS === "ios" ? 1 : 0,
  },
  elevation_4: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    zIndex: Platform.OS === "ios" ? 1 : 0,
  },
  elevation_5: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: Platform.OS === "ios" ? 1 : 0,
  },
  elevation_6: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    zIndex: Platform.OS === "ios" ? 1 : 0,
  },
  elevation_7: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
    zIndex: Platform.OS === "ios" ? 1 : 0,
  },
  elevation_8: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    zIndex: Platform.OS === "ios" ? 1 : 0,
  },
  elevation_9: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9,
    zIndex: Platform.OS === "ios" ? 1 : 0,
  },
  elevation_10: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
    zIndex: Platform.OS === "ios" ? 1 : 0,
  },
};

export default levels;

export function customElevation(level = 0, color = "#000000"): ElevationStyle {
  return {
    ...levels[`elevation_${level}`],
    shadowColor: color,
  };
}

const webDepth = {
  umbra: [
    "0px 0px 0px 0px",
    "0px 2px 1px -1px",
    "0px 3px 1px -2px",
    "0px 3px 3px -2px",
    "0px 2px 4px -1px",
    "0px 3px 5px -1px",
    "0px 3px 5px -1px",
    "0px 4px 5px -2px",
    "0px 5px 5px -3px",
    "0px 5px 6px -3px",
    "0px 6px 6px -3px",
    "0px 6px 7px -4px",
    "0px 7px 8px -4px",
    "0px 7px 8px -4px",
    "0px 7px 9px -4px",
    "0px 8px 9px -5px",
    "0px 8px 10px -5px",
    "0px 8px 11px -5px",
    "0px 9px 11px -5px",
    "0px 9px 12px -6px",
    "0px 10px 13px -6px",
    "0px 10px 13px -6px",
    "0px 10px 14px -6px",
    "0px 11px 14px -7px",
    "0px 11px 15px -7px",
  ],
  penumbra: [
    "0px 0px 0px 0px",
    "0px 1px 1px 0px",
    "0px 2px 2px 0px",
    "0px 3px 4px 0px",
    "0px 4px 5px 0px",
    "0px 5px 8px 0px",
    "0px 6px 10px 0px",
    "0px 7px 10px 1px",
    "0px 8px 10px 1px",
    "0px 9px 12px 1px",
    "0px 10px 14px 1px",
    "0px 11px 15px 1px",
    "0px 12px 17px 2px",
    "0px 13px 19px 2px",
    "0px 14px 21px 2px",
    "0px 15px 22px 2px",
    "0px 16px 24px 2px",
    "0px 17px 26px 2px",
    "0px 18px 28px 2px",
    "0px 19px 29px 2px",
    "0px 20px 31px 3px",
    "0px 21px 33px 3px",
    "0px 22px 35px 3px",
    "0px 23px 36px 3px",
    "0px 24px 38px 3px",
  ],
  ambient: [
    "0px 0px 0px 0px",
    "0px 1px 3px 0px",
    "0px 1px 5px 0px",
    "0px 1px 8px 0px",
    "0px 1px 10px 0px",
    "0px 1px 14px 0px",
    "0px 1px 18px 0px",
    "0px 2px 16px 1px",
    "0px 3px 14px 2px",
    "0px 3px 16px 2px",
    "0px 4px 18px 3px",
    "0px 4px 20px 3px",
    "0px 5px 22px 4px",
    "0px 5px 24px 4px",
    "0px 5px 26px 4px",
    "0px 6px 28px 5px",
    "0px 6px 30px 5px",
    "0px 6px 32px 5px",
    "0px 7px 34px 6px",
    "0px 7px 36px 6px",
    "0px 8px 38px 7px",
    "0px 8px 40px 7px",
    "0px 8px 42px 7px",
    "0px 9px 44px 8px",
    "0px 9px 46px 8px",
  ],
};

const derive = (
  i: number,
  a: number,
  b: number,
  a2: number,
  b2: number
): number => {
  return ((i - a) * (b2 - a2)) / (b - a) + a2;
};

const parseShadow = (
  raw: string
): { x: number; y: number; blur: number; spread: number } => {
  const values = raw.split(" ").map((val) => +val.replace("px", ""));
  return {
    x: values[0],
    y: values[1],
    blur: values[2],
    spread: values[3],
  };
};

const maxElevation = 24;

const generateElevationStyle = (depth = 0): ElevationStyle => {
  const s = parseShadow(webDepth.penumbra[depth]);
  const y = s.y === 1 ? 1 : Math.floor(s.y * 0.5);
  return {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: y,
    },
    shadowOpacity:
      depth <= 0 ? 0 : Number(derive(depth - 1, 1, 24, 0.2, 0.6).toFixed(2)),
    shadowRadius: Number(derive(s.blur, 1, 38, 1, 16).toFixed(2)),
    elevation: depth,
    zIndex: 1,
    overflow: "visible",
  };
};

const elevations: ElevationStyle[] = new Array(maxElevation + 1)
  .fill(undefined)
  .map((x, index) => generateElevationStyle(index));

type ElevationAnimatedStyle = {
  shadowColor: string;
  shadowOffset: {
    width: number;
    height: Animated.AnimatedInterpolation;
  };
  shadowOpacity: Animated.AnimatedInterpolation;
  shadowRadius: Animated.AnimatedInterpolation;
  elevation: Animated.AnimatedInterpolation;
  zIndex: number;
  overflow?: "visible" | "hidden" | "scroll";
};
const interpolateElevation = (
  anim: Animated.Value,
  { inputRange, outputRange, ...opts }: Animated.InterpolationConfigType
): ElevationAnimatedStyle => {
  const output: {
    height: number[];
    shadowOpacity: number[];
    shadowRadius: number[];
  } = { height: [], shadowOpacity: [], shadowRadius: [] };
  outputRange.forEach((depth) => {
    const s = parseShadow(webDepth.penumbra[depth]);
    const y = s.y === 1 ? 1 : Math.floor(s.y * 0.5);
    output.height.push(y);
    output.shadowOpacity.push(
      depth <= 0 ? 0 : Number(derive(depth - 1, 1, 24, 0.2, 0.6).toFixed(2))
    );
    output.shadowRadius.push(Number(derive(s.blur, 1, 38, 1, 16).toFixed(2)));
  });
  return {
    elevation: anim.interpolate({ inputRange, outputRange, ...opts }),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: anim.interpolate({
        inputRange,
        outputRange: output.height,
        ...opts,
      }),
    },
    shadowOpacity: anim.interpolate({
      inputRange,
      outputRange: output.shadowOpacity,
      ...opts,
    }),
    shadowRadius: anim.interpolate({
      inputRange,
      outputRange: output.shadowRadius,
      ...opts,
    }),
    zIndex: 1,
  };
};

export { elevations, interpolateElevation };
