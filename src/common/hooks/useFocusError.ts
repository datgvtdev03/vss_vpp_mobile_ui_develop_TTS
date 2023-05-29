import { useEffect } from "react";

const useFocusError = (errors, setFocus) => {
  useEffect(() => {
    const keys = Object.keys(errors);
    const len = keys.length;
    for (let i = 0; i < len; i++) {
      if (errors[keys[i]]?.message) {
        // @ts-ignore
        setFocus(keys[i]);
        break;
      }
    }
  }, [errors, setFocus]);
};

export default useFocusError;
