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
import { MatchResult } from "path-to-regexp";
import { normalizePath, resolvePath } from "./RouterUtil";

type RouterNavigator<P extends object> = {
  pathname: string;
  params: MatchResult<P>["params"];
  push: (path: string) => void;
  back: () => void;
  forward: () => void;
  go: (step: number) => void;
  replace: (path: string) => void;
};

function toFullPath(base: string, from: string, to: string) {
  return to.startsWith("/")
    ? normalizePath(`${base}/${to}`)
    : resolvePath(from, to);
}

function toScopedPath(base: string, pathname: string) {
  return normalizePath(`/${pathname.slice(base.length)}`);
}

export function useNavigator<P extends object>(): Readonly<RouterNavigator<P>> {
  const { base, state, matcher, driver } = useRouterContext();
  return useMemo<RouterNavigator<P>>(() => {
    // Go to the specified pathname
    const push = (to: string) =>
      driver.push({ pathname: toFullPath(base, state.pathname, to) });
    // Go to the specified pathname，But it doesn't affect history
    const replace = (to: string) =>
      driver.replace({ pathname: toFullPath(base, state.pathname, to) });
    // Back to the prev pathname
    const back = () => driver.back();
    // Forward to the next pathname
    const forward = () => driver.forward();
    // Forward or backward specified number of steps
    const go = (step: number) => driver.go(step);
    // Generate some parameters
    const pathname = toScopedPath(base, state.pathname);
    const { params } = matcher.result || {};
    // return the instance
    return { pathname, params, push, back, forward, go, replace };
  }, [state, matcher, driver]);
}

/**
 * @internal
 */
export const NavigatorForwarder = forwardRef<RouterNavigator<any> | undefined>(
  function NavigatorForwarder(_, ref) {
    const navigator = useNavigator();
    useImperativeHandle(ref, () => navigator);
    return createElement(Fragment);
  },
);

export type RouterNavigatorRef<P extends object = object> = RefObject<
  RouterNavigator<P> | undefined
>;

export function useNavigatorRef<P extends object = object>() {
  return useRef<RouterNavigator<P>>();
}

export function createNavigatorRef<P extends object = object>() {
  return createRef<RouterNavigator<P>>();
}
