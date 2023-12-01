import React, { type ReactNode, useMemo, Fragment } from "react";
import {
  RouterContext,
  RouterContextValue,
  RouterPattern,
  useRouterContext,
} from "./RouterContext";
import { match as compileToMatcher } from "path-to-regexp";
import { normalize } from "path-browserify";
import { patternToPrefix } from "./RouterUtil";

export type RouteProps = {
  pattern: RouterPattern;
  render?: (children: ReactNode) => ReactNode;
  prefix?: RouterPattern;
  children?: ReactNode;
};

export function Route(props: RouteProps) {
  const { render, children } = props;
  const { pattern = "/", prefix = patternToPrefix(pattern) } = props;
  const { stack, state: parentState, driver } = useRouterContext();
  const context = useMemo<RouterContextValue>(() => {
    const fullPrefix = normalize(`${parentState.fullPrefix}/${prefix}`);
    const match = compileToMatcher(`${fullPrefix}/${pattern}`);
    const state = { ...parentState, match, prefix, fullPrefix };
    return { stack, state, driver };
  }, [parentState, driver, stack, prefix]);
  // match current url
  const { state } = context;
  const matchResult = state.match?.(state.path);
  if (!matchResult) return <Fragment />;
  state.result = matchResult;
  return (
    <RouterContext.Provider value={context}>
      {render ? render(children) : children}
    </RouterContext.Provider>
  );
}
