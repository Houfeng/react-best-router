import { Fragment, createElement, useMemo } from "react";
import { useRouterContext } from "./RouterContext";
import { normalizePath, resolvePath } from "./RouterUtil";
import { RouteParams, useParentMatcher } from "./RouteMatcher";

export type RouterNavigator<P extends RouteParams> = {
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

function toParsedPath(base: string, path: string) {
  return normalizePath(`/${path.slice(base.length)}`).split("?")[0];
}

type PickKeyOfType<T, E> = {
  [K in keyof T as T[K] extends E ? K : never]: T[K];
};

type ParamsParser<K extends string, R = unknown> = Record<K, (v: string) => R>;
type ParamsParseResult<T extends ParamsParser<string>> = PickKeyOfType<
  {
    [K in keyof T]: ReturnType<T[K]>;
  },
  string | number | boolean | object | Function
>;

export function useNavigator<
  TKey extends string = never,
  TParser extends ParamsParser<TKey> = ParamsParser<TKey, string>,
  TResult extends ParamsParseResult<TParser> = ParamsParseResult<TParser>,
>(paramsParser?: TParser): Readonly<RouterNavigator<Readonly<TResult>>> {
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
    const path = toParsedPath(base, state.path);
    const { params, query } = matcher.result;
    // Parse params
    if (paramsParser && params) {
      Object.entries(params).forEach(([key, value]) => {
        const parse = (paramsParser as ParamsParser<string>)[key];
        params[key] = parse ? parse(String(value)) : value;
      });
    }
    // return the instance
    return { path, params, query, push, back, forward, go, replace };
  }, [state, matcher, driver]);
}

/** @internal */
type NavigatorForwarderProps = { navRef?: RouterNavigatorRef };

/** @internal */
export function NavigatorForwarder({ navRef }: NavigatorForwarderProps) {
  const { parser } = navRef || {};
  const nav = useNavigator(parser);
  useMemo(() => navRef && (navRef.current = nav), [nav, navRef]);
  return createElement(Fragment);
}

export type RouterNavigatorRef<
  T extends RouteParams = RouteParams,
  P extends ParamsParser<string> = ParamsParser<string>,
> = {
  current?: RouterNavigator<T>;
  parser?: P;
};

export function useNavigatorRef<
  TKey extends string = never,
  TParser extends ParamsParser<TKey> = ParamsParser<TKey, string>,
  TResult extends ParamsParseResult<TParser> = ParamsParseResult<TParser>,
>(paramsParser?: TParser) {
  return useMemo(() => {
    return createNavigatorRef<TKey, TParser, TResult>(paramsParser);
  }, [paramsParser]);
}

export function createNavigatorRef<
  TKey extends string = never,
  TParser extends ParamsParser<TKey> = ParamsParser<TKey, string>,
  TResult extends ParamsParseResult<TParser> = ParamsParseResult<TParser>,
>(paramsParser?: TParser): RouterNavigatorRef<TResult, TParser> {
  return { parser: paramsParser, current: void 0 };
}
