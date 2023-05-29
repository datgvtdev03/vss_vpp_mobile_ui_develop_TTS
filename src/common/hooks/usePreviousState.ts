import React from "react";

const usePreviousState = <V extends unknown>(value: V) => {
  const ref = React.useRef<V>();
  React.useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
};

export default usePreviousState;
