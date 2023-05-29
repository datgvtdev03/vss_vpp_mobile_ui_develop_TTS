import React, { MutableRefObject } from "react";
import { TextInput } from "react-native";

const useAutoFocus = (autoFocus = true): MutableRefObject<TextInput | null> => {
  const inputRef = React.useRef<TextInput | null>(null);

  React.useEffect(() => {
    if (autoFocus && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 40);
    }
  }, [autoFocus, inputRef]);

  return inputRef;
};
export default useAutoFocus;
