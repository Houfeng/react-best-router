import { useMemo } from "react";
import { useRouterContext } from "./RouterContext";
import { resolve } from "path-browserify";
import { MatchResult } from "path-to-regexp";

export type RouterNavigator<P extends object> = {
  path: string;
  params: MatchResult<P>["params"];
  push: (path: string) => void;
  back: () => void;
  forward: () => void;
  go: (step: number) => void;
  replace: (path: string) => void;
};

export function useNavigator<P extends object>(): Readonly<RouterNavigator<P>> {
  const { stack, state, driver } = useRouterContext();
  return useMemo<RouterNavigator<P>>(() => {
    const { path, result = {} } = state;
    const { params = {} } = (result || {}) as MatchResult<any>;
    const push = (path: string) => {
      path = resolve(state.path, path);
      const historyState = { path };
      driver.push(historyState);
      stack.push(historyState);
    };
    const replace = (path: string) => {
      path = resolve(state.path, path);
      const historyState = { path };
      driver.replace(historyState);
      stack.replace(historyState);
    };
    const back = () => {
      const state = stack.back();
      if (state) driver.push(state);
    };
    const forward = () => {
      const state = stack.forward();
      if (state) driver.push(state);
    };
    const go = (step: number) => driver.push(stack.go(step));
    return { path, params, push, back, forward, go, replace };
  }, [driver, state, stack]);
}
