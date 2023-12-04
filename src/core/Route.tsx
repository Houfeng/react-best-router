import React, { ReactNode, useMemo, Fragment } from "react";
import {
  RouterContext,
  RouterContextValue,
  useRouterContext,
} from "./RouterContext";
import {
  RouterMatcher,
  RouterPattern,
  createRouterMatcher,
} from "./RouterMatcher";
import { NavigatorForwarder, RouterNavigatorRef } from "./RouterNavigator";

export type RouteProps = {
  pattern: RouterPattern;
  children?: ReactNode;
  render?: (children: ReactNode) => ReactNode;
  prefix?: RouterPattern;
  navigator?: RouterNavigatorRef<any>;
  fallback?: ReactNode;
};

export function Route(props: RouteProps) {
  const { pattern = "/", prefix, navigator } = props;
  const { render, children, fallback } = props;
  const { base, state, driver, matcher: parentMatcher } = useRouterContext();
  // create matcher
  const matcher = useMemo<RouterMatcher>(
    () => createRouterMatcher(pattern, prefix, parentMatcher),
    [pattern, prefix, parentMatcher],
  );
  // create context
  const context = useMemo<RouterContextValue>(
    () => ({ base, state, driver, matcher }),
    [base, state, driver, matcher],
  );
  // match current pathname
  if (!matcher.match(state.pathname).state) return fallback || <Fragment />;
  return (
    <RouterContext.Provider value={context}>
      {navigator && <NavigatorForwarder ref={navigator} />}
      {render ? render(children) : children}
    </RouterContext.Provider>
  );
}
