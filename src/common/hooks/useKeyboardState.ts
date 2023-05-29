import { useCallback, useEffect, useRef, useState } from "react";
import { Keyboard, KeyboardEvent, LayoutAnimation } from "react-native";

export default function useKeyboardState(): {
  keyboardHeight: number;
  keyboardShown: boolean;
} {
  const [keyboardShown, setKeyboardShown] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState<number>(0);
  const mounted = useRef(false);

  const onKeyboardShown = useCallback((e: KeyboardEvent) => {
    if (mounted.current) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setKeyboardShown(true);
      setKeyboardHeight(e.endCoordinates.height);
    }
  }, []);
  const onKeyboardHidden = useCallback(() => {
    if (mounted.current) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setKeyboardShown(false);
      setKeyboardHeight(0);
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    const disposable = [
      Keyboard.addListener("keyboardWillShow", onKeyboardShown),
      Keyboard.addListener("keyboardWillHide", onKeyboardHidden),
      Keyboard.addListener("keyboardDidShow", onKeyboardShown),
      Keyboard.addListener("keyboardDidHide", onKeyboardHidden),
    ];

    //errors: attempted to remove more rctkeyboardobserver listeners than added

    return () => {
      disposable.forEach(
        (unsub) =>
          Keyboard &&
          typeof Keyboard.removeSubscription === "function" &&
          Keyboard.removeSubscription(unsub)
      );
    };
  }, [onKeyboardHidden, onKeyboardShown]);

  return { keyboardHeight, keyboardShown };
}
