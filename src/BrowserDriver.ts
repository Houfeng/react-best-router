import { useMemo } from "react";
import { RouterDriver } from "./RouterDriver";
import { RouterHistoryState } from "./RouterStack";

export function createBrowserDriver(): RouterDriver {
  const state = (): RouterHistoryState => history.state;
  const push = (state: RouterHistoryState) =>
    history.pushState(state, state.path, state.path);
  const replace = () => history.state();
  const subscribe: RouterDriver["subscribe"] = (handler) => {
    const popstateHandler = (event: PopStateEvent) => handler(event.state);
    window.addEventListener("popstate", popstateHandler);
    return () => window.removeEventListener("popstate", popstateHandler);
  };
  return { state, push, replace, subscribe };
}

export function useBrowserDriver() {
  return useMemo(() => createBrowserDriver(), []);
}
