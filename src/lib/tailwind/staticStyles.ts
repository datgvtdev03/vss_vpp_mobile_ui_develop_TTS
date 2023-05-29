import { Platform } from "react-native";
import fonts from "src/constants/fonts";

export default {
  // font family
  "font-black": {
    fontFamily: fonts.black,
  },
  "font-heavy": {
    fontFamily: fonts.heavy,
  },
  "font-bold": {
    fontFamily: fonts.bold,
  },
  "font-semi-bold": {
    fontFamily: fonts.semiBold,
  },
  "font-medium": {
    fontFamily: fonts.medium,
  },
  "font-regular": {
    fontFamily: fonts.regular,
  },
  "font-light": {
    fontFamily: fonts.light,
  },
  "font-thin": {
    fontFamily: fonts.thin,
  },
  "font-ultra-light": {
    fontFamily: fonts.ultraLight,
  },
  // elevation
  shadow: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1,
    elevation: 1,
    zIndex: Platform.OS === "ios" ? 1 : 0,
  },
  "shadow-2": {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    zIndex: Platform.OS === "ios" ? 1 : 0,
  },
  "shadow-3": {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    zIndex: Platform.OS === "ios" ? 1 : 0,
  },
  "shadow-4": {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    zIndex: Platform.OS === "ios" ? 1 : 0,
  },
  "shadow-5": {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: Platform.OS === "ios" ? 1 : 0,
  },
  "shadow-6": {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    zIndex: Platform.OS === "ios" ? 1 : 0,
  },
  "shadow-7": {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
    zIndex: Platform.OS === "ios" ? 1 : 0,
  },
  "shadow-8": {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    zIndex: Platform.OS === "ios" ? 1 : 0,
  },
  "shadow-9": {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9,
    zIndex: Platform.OS === "ios" ? 1 : 0,
  },
  "shadow-10": {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
    zIndex: Platform.OS === "ios" ? 1 : 0,
  },
  "outline-none": {
    outlineStyle: "none",
  },
  "flex-2": {
    flex: 2,
  },
  "ratio-1": {
    aspectRatio: 1,
  },
  "h-163": {
    height: 163,
  },
  "h-325": {
    height: 325,
  },
  "h-500": {
    height: 500,
  },
  "line-height-38": {
    lineHeight: 38,
  },
  "text-vertical-center": {
    textAlignVertical: "center",
  },
};
