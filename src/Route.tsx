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
import {
  RouterNavigatorForwarder,
  RouterNavigatorRef,
} from "./RouterNavigator";

export type RouteProps = {
  pattern: RouterPattern;
  render?: (children: ReactNode) => ReactNode;
  prefix?: RouterPattern;
  children?: ReactNode;
  navigator?: RouterNavigatorRef<any>;
};

export function Route(props: RouteProps) {
  const { pattern = "/", prefix, render, children, navigator } = props;
  const { stack, state, driver, matcher: parentMatcher } = useRouterContext();
  // create matcher
  const matcher = useMemo<RouterMatcher>(
    () => createRouterMatcher(pattern, prefix, parentMatcher),
    [pattern, prefix, parentMatcher],
  );
  // create context
  const context = useMemo<RouterContextValue>(
    () => ({ stack, state, driver, matcher }),
    [state, driver, stack, matcher],
  );
  // match current pathname
  if (!matcher.match(state.pathname)) return <Fragment />;
  return (
    <RouterContext.Provider value={context}>
      {navigator && <RouterNavigatorForwarder ref={navigator} />}
      {render ? render(children) : children}
    </RouterContext.Provider>
  );
}
