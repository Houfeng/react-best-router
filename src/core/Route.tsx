import { createElement, useMemo, Fragment, ReactNode } from "react";
import { useRouterContext } from "./RouterContext";
import {
  MatcherContext,
  RouteMatcher,
  RoutePattern,
  createMatcher,
  useParentMatcher,
} from "./RouteMatcher";
import { NavigatorForwarder, RouterNavigatorRef } from "./RouterNavigator";
import { RouteFallback } from "./RouteFallback";
import { RouteRedirect } from "./RouteRedirect";

export type RouteNormalProps = {
  children?: ReactNode;
  render?: (children: ReactNode) => ReactNode;
  prefix?: RoutePattern;
  navigator?: RouterNavigatorRef<any>;
} & (
  | {
      pattern: RoutePattern;
      fallback?: ReactNode;
    }
  | {
      pattern?: RoutePattern;
      fallback: ReactNode;
    }
);

export type RouteRedirectProps = {
  pattern?: RoutePattern;
  redirect: string;
  navigator?: RouterNavigatorRef<any>;
  children?: never;
  render?: never;
  fallback?: never;
};

export type RouteProps = RouteNormalProps | RouteRedirectProps;

type RouteMergedProps = RouteNormalProps & Pick<RouteRedirectProps, "redirect">;

export function Route(props: RouteProps) {
  const { pattern = "/(.*)?", prefix, navigator } = props as RouteMergedProps;
  const { render, children, fallback, redirect } = props as RouteMergedProps;
  const { state } = useRouterContext();
  const parentMatcher = useParentMatcher();
  // create matcher
  const matcher = useMemo<RouteMatcher>(
    () => createMatcher(pattern, prefix, parentMatcher),
    [pattern, prefix, parentMatcher],
  );
  // match current path
  const matched = matcher.match(state.path).state;
  if (!matched && !fallback) return <Fragment />;
  // if redirect
  if (matched && redirect) return <RouteRedirect to={redirect} />;
  // normalize children
  const elements = render ? render(children) : children;
  return (
    <MatcherContext.Provider value={matcher}>
      {navigator && <NavigatorForwarder navRef={navigator} />}
      {matched ? elements : fallback}
      {matched && fallback && (
        <RouteFallback side={[Route, elements]}>{fallback}</RouteFallback>
      )}
    </MatcherContext.Provider>
  );
}
