import { createElement, useMemo, Fragment, ReactNode } from "react";
import { useRouterContext } from "./RouterContext";
import {
  MatcherContext,
  RouterMatcher,
  RouterPattern,
  createRouterMatcher,
  useParentMatcher,
} from "./RouterMatcher";
import { NavigatorForwarder, RouterNavigatorRef } from "./RouterNavigator";
import { RouteFallback } from "./RouteFallback";

export type RouteProps = {
  pattern: RouterPattern;
  children?: ReactNode;
  render?: (children: ReactNode) => ReactNode;
  prefix?: RouterPattern;
  navigator?: RouterNavigatorRef<any>;
  fallback?: ReactNode;
};

export function Route(props: RouteProps) {
  const { pattern, prefix, navigator, render, children, fallback } = props;
  const { state } = useRouterContext();
  const parentMatcher = useParentMatcher();
  // create matcher
  const matcher = useMemo<RouterMatcher>(
    () => createRouterMatcher(pattern, prefix, parentMatcher),
    [pattern, prefix, parentMatcher],
  );
  // match current pathname
  if (!matcher.match(state.pathname).state) return fallback || <Fragment />;
  // normalize children
  const elements = render ? render(children) : children;
  return (
    <MatcherContext.Provider value={matcher}>
      {navigator && <NavigatorForwarder ref={navigator} />}
      {elements}
      {fallback && (
        <RouteFallback side={[Route, elements]}> {fallback}</RouteFallback>
      )}
    </MatcherContext.Provider>
  );
}
