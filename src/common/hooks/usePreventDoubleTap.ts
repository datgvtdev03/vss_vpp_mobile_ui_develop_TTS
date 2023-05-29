import { useRef } from "react";

export const DEBOUNCE_TIME = 5000;
export const usePreventDoubleTap = () => {
  const busy = useRef(false);

  // eslint-disable-next-line @typescript-eslint/ban-types
  const preventDoubleTap = async (callback: Function) => {
    setTimeout(() => {
      busy.current = false;
    }, DEBOUNCE_TIME);

    if (!busy.current) {
      busy.current = true;
      callback();
    }
  };

  return {
    preventDoubleTap,
  };
};
