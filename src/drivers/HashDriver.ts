import { useMemo } from "react";
import { RouterDriver, RouterState } from "../core";

export function createHashDriver(): RouterDriver {
  const current = (): RouterState => {
    const { pathname } = location;
    return { pathname };
  };
  const push = (state: RouterState) => {
    history.pushState(state, state.pathname, state.pathname);
    const event = new PopStateEvent("popstate", { state });
    window.dispatchEvent(event);
  };
  const replace = (state: RouterState) => {
    history.replaceState(state, state.pathname, state.pathname);
    const event = new PopStateEvent("popstate", { state });
    window.dispatchEvent(event);
  };
  const go = (step: number) => history.go(step);
  const back = () => history.back();
  const forward = () => history.forward();
  const subscribe: RouterDriver["subscribe"] = (handler) => {
    const popstateHandler = (event: PopStateEvent) => {
      handler(event.state);
    };
    window.addEventListener("popstate", popstateHandler);
    return () => window.removeEventListener("popstate", popstateHandler);
  };
  return { current, push, replace, go, back, forward, subscribe };
}

export function useHashDriver() {
  return useMemo(() => createHashDriver(), []);
}
