import { useMemo } from "react";

export const useCustomCallbackMemo = (result, deps) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const callbackWrapper = useMemo(() => result, deps);

  return callbackWrapper;
};
