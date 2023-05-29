import React from "react";
import { StyleProp, TextStyle, ViewStyle } from "react-native";
import Animation from "./animations/Animation";

export type SwipeDirection = "up" | "down" | "left" | "right";

export type DragEvent = {
  axis: {
    x: number;
    y: number;
  };
  layout: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  swipeDirection: string | null;
};

export type ModalProps = {
  visible?: boolean;
  children?: React.ReactNode;
  width?: number;
  height?: number;
  rounded?: boolean;
  hasOverlay?: boolean;
  overlayPointerEvents?: "auto" | "none";
  overlayBackgroundColor?: string;
  overlayOpacity?: number;
  modalTitle?: React.ReactNode;
  modalAnimation?: Animation;
  modalStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  animationDuration?: number;
  onTouchOutside?: () => void;
  onHardwareBackPress?: () => boolean;
  onShow?: () => void;
  onDismiss?: () => void;
  footer?: Node;
  onMove?: (event: DragEvent) => void;
  onSwiping?: (event: DragEvent) => void;
  onSwipeRelease?: (event: DragEvent) => void;
  onSwipingOut?: (event: DragEvent) => void;
  onSwipeOut?: (event: DragEvent) => void;
  swipeDirection?: SwipeDirection | Array<SwipeDirection>;
  swipeThreshold?: number;
  useNativeDriver?: boolean;
  resetStackDismiss?: boolean;
};

export type ModalFooterProps = {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  bordered?: boolean;
};

export type ModalButtonProps = {
  text: string;
  onPress?: () => void;
  align?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
  activeOpacity?: number;
  bordered?: boolean;
};

export type ModalTitleProps = {
  title: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  align?: string;
  hasTitleBar?: boolean;
};

export type ModalContentProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export type BackdropProps = {
  visible: boolean;
  opacity: number;
  onPress?: () => void;
  backgroundColor?: string;
  animationDuration?: number;
  pointerEvents?: "box-none" | "none" | "box-only" | "auto" | undefined;
  useNativeDriver?: boolean;
};
