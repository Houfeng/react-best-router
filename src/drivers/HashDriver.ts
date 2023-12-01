import { useMemo } from "react";
import { RouterDriver, RouterState } from "../core";

export function createHashDriver(): RouterDriver {
  const current = (): RouterState => {
    return { pathname: location.hash.slice(1) || "/" };
  };
  const push = (state: RouterState) => {
    location.hash = state.pathname;
  };
  const replace = (state: RouterState) => {
    location.hash = state.pathname;
  };
  const go = (step: number) => history.go(step);
  const back = () => history.back();
  const forward = () => history.forward();
  const subscribe: RouterDriver["subscribe"] = (handler) => {
    const hashChangeHandler = () => handler(current());
    window.addEventListener("hashchange", hashChangeHandler);
    return () => window.removeEventListener("hashchange", hashChangeHandler);
  };
  return { current, push, replace, go, back, forward, subscribe };
}

export function useHashDriver() {
  return useMemo(() => createHashDriver(), []);
}
