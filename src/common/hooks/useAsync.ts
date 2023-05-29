import { useEffect } from "react";

function useAsync<T>(asyncFn: () => Promise<T>, onSuccess: (T) => void): void {
  useEffect(() => {
    let isActive = true;
    asyncFn().then((data) => {
      if (isActive) onSuccess(data);
    });
    return () => {
      isActive = false;
    };
  }, [asyncFn, onSuccess]);
}

export default useAsync;
