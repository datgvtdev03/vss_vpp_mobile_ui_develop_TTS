/* eslint class-methods-use-this: ["error", { "exceptMethods": ["in", "out", "getAnimations"] }] */
/* eslint no-unused-vars: ["error", { "argsIgnorePattern": "onFinished" }] */

import { Animated } from "react-native";

export type AnimationConfig = {
  initialValue?: number;
  useNativeDriver?: boolean;
};

// Base Animation class
export default class Animation {
  useNativeDriver: boolean;
  animate: Animated.Value;

  constructor({
    initialValue = 0,
    useNativeDriver = true,
  }: AnimationConfig = {}) {
    this.animate = new Animated.Value(initialValue);
    this.useNativeDriver = useNativeDriver;
  }

  in(onFinished: () => void): void {
    throw Error("not implemented yet" + onFinished);
  }

  out(onFinished: () => void): void {
    throw Error("not implemented yet" + onFinished);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getAnimations(): any {
    throw Error("not implemented yet");
  }
}
