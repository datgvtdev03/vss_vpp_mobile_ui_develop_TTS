import { useEffect, useState } from "react";
import { Dimensions } from "react-native";

export default function useScreenSize(): { width: number; height: number } {
  const [windowSize, setWindowSize] = useState({
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  });

  useEffect(() => {
    function handleChange({ window }) {
      setWindowSize({
        width: window.width,
        height: window.height,
      });
    }

    const sub = Dimensions.addEventListener("change", handleChange);

    return () => sub.remove();
  }, []);

  return windowSize;
}
