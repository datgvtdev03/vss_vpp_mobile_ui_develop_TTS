import React from "react";
import LoadingPortal from "src/components/base/LoadingPortal";

const useShowLoading = (...deps: boolean[]) => {
  const show = deps.reduce((showLoading, dep) => showLoading || dep, false);
  React.useEffect(() => {
    if (show) LoadingPortal.show();
    else LoadingPortal.hide();
  }, [show]);
};

export default useShowLoading;
