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
import { normalizePath, resolvePath } from "./RouterUtil";
import { useParentMatcher } from "./RouteMatcher";

export type RouterNavigator<P extends object> = {
  path: string;
  params: P;
  query: URLSearchParams;
  push: (path: string) => void;
  back: () => void;
  forward: () => void;
  go: (step: number) => void;
  replace: (path: string) => void;
};

function toPathName(path: string) {
  const { pathname } = new URL(path, location.origin);
  return pathname;
}

function toFullPath(base: string, from: string, to: string) {
  return to.startsWith("/")
    ? normalizePath(`${toPathName(base)}/${to}`)
    : resolvePath(toPathName(from), to);
}

function toScopedPath(base: string, path: string) {
  return normalizePath(`/${path.slice(base.length)}`);
}

export function useNavigator<P extends object>(): Readonly<RouterNavigator<P>> {
  const { base, state, driver } = useRouterContext();
  const matcher = useParentMatcher()!;
  return useMemo<RouterNavigator<any>>(() => {
    if (!matcher?.result) throw "Invalid call outside of Route";
    // Go to the specified path
    const push = (to: string) =>
      driver.push({ path: toFullPath(base, state.path, to) });
    // Go to the specified path it doesn't affect history
    const replace = (to: string) =>
      driver.replace({ path: toFullPath(base, state.path, to) });
    // Back to the prev path
    const back = () => driver.back();
    // Forward to the next path
    const forward = () => driver.forward();
    // Forward or backward specified number of steps
    const go = (step: number) => driver.go(step);
    // Generate some parameters
    const path = toScopedPath(base, state.path);
    const { params, query } = matcher.result;
    // return the instance
    return { path, params, query, push, back, forward, go, replace };
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
