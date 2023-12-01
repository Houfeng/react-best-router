import { useMemo } from "react";
import { RouterDriver } from "./RouterDriver";
import { RouterHistoryState } from "./RouterStack";

export function createBrowserDriver(): RouterDriver {
  const state = (): RouterHistoryState => {
    const { pathname } = location;
    return { pathname };
  };
  const push = (state: RouterHistoryState) =>
    history.pushState(state, state.pathname, state.pathname);
  const replace = (state: RouterHistoryState) =>
    history.replaceState(state, state.pathname, state.pathname);
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
