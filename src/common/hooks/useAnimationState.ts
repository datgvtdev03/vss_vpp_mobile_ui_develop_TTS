import { useCallback, useState } from "react";
import { LayoutAnimation, LayoutAnimationConfig } from "react-native";

const useAnimationState = <T>(
  initValue: T,
  animationConfig: LayoutAnimationConfig
) => {
  const [value, setValue] = useState<T>(initValue);
  const setValueWithAnimation = useCallback(
    (nextValue: ((prevValue: T) => T) | T) => {
      if (animationConfig) {
        LayoutAnimation.configureNext(animationConfig);
      } else {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      }
      setValue(nextValue);
    },
    [animationConfig]
  );

  return [value, setValueWithAnimation];
};

export default useAnimationState;
