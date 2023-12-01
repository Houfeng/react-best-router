import {
  Fragment,
  createElement,
  createRef,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  RefObject,
} from "react";
import { useRouterContext } from "./RouterContext";
import { resolve } from "path-browserify";
import { MatchResult } from "path-to-regexp";

export type RouterNavigator<P extends object> = {
  pathname: string;
  params: MatchResult<P>["params"];
  push: (path: string) => void;
  back: () => void;
  forward: () => void;
  go: (step: number) => void;
  replace: (path: string) => void;
};

export function useNavigator<P extends object>(): Readonly<RouterNavigator<P>> {
  const { state, matcher, driver } = useRouterContext();
  return useMemo<RouterNavigator<P>>(() => {
    const push = (pathname: string) =>
      driver.push({ pathname: resolve(state.pathname, pathname) });
    const replace = (pathname: string) =>
      driver.replace({ pathname: resolve(state.pathname, pathname) });
    const back = () => driver.back();
    const forward = () => driver.forward();
    const go = (step: number) => driver.go(step);
    const { pathname } = state;
    const { params } = matcher.result || {};
    return { pathname, params, push, back, forward, go, replace };
  }, [state, matcher, driver]);
}

/**
 * @internal
 */
export const RouterNavigatorForwarder = forwardRef<
  RouterNavigator<any> | undefined
>((_, ref) => {
  const navigator = useNavigator();
  useImperativeHandle(ref, () => navigator);
  return createElement(Fragment);
});

export type RouterNavigatorRef<P extends object = object> = RefObject<
  RouterNavigator<P> | undefined
>;

export function useNavigatorRef<P extends object = object>() {
  return useRef<RouterNavigator<P>>();
}

export function createNavigatorRef<P extends object = object>() {
  return createRef<RouterNavigator<P>>();
}
