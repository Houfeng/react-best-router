import { useMemo } from "react";
import { RouterDriver, RouterState } from "../core";

export function createBrowserDriver(): RouterDriver {
  const current = (): RouterState => {
    const { pathname, search } = location;
    return { path: `${pathname}${search}` };
  };
  const push = (state: RouterState) => {
    history.pushState(state, state.path, state.path);
    const event = new PopStateEvent("popstate", { state });
    window.dispatchEvent(event);
  };
  const replace = (state: RouterState) => {
    history.replaceState(state, state.path, state.path);
    const event = new PopStateEvent("popstate", { state });
    window.dispatchEvent(event);
  };
  const go = (step: number) => history.go(step);
  const back = () => history.back();
  const forward = () => history.forward();
  const subscribe: RouterDriver["subscribe"] = (handler) => {
    const popstateHandler = (event: PopStateEvent) => {
      handler(event.state || current());
    };
    window.addEventListener("popstate", popstateHandler);
    return () => window.removeEventListener("popstate", popstateHandler);
  };
  return { current, push, replace, go, back, forward, subscribe };
}

export function useBrowserDriver() {
  return useMemo(() => createBrowserDriver(), []);
}
