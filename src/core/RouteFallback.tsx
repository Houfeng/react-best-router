import {
  Children,
  FC,
  Fragment,
  ReactNode,
  createElement,
  useMemo,
} from "react";
import {
  RouteMatcher,
  RoutePattern,
  createMatcher,
  useParentMatcher,
} from "./RouteMatcher";
import { useRouterContext } from "./RouterContext";

type RouteLike = FC<{ pattern: RoutePattern }>;

export type RouteFallbackProps = {
  side: [RouteLike, ReactNode];
  children: ReactNode;
};

function takeSidePatterns(type: RouteLike, elements: ReactNode) {
  const validItems = Children.toArray(elements).filter((it) => !!it);
  const routeItems = validItems.filter((it: any) => it.type === type);
  return validItems.length === routeItems.length
    ? routeItems.map((it: any) => it.props?.pattern)
    : [];
}

export function RouteFallback(props: RouteFallbackProps) {
  const { side, children } = props;
  const patterns = takeSidePatterns(...side);
  const {
    state: { pathname },
  } = useRouterContext();
  const parentMatcher = useParentMatcher();
  const matchers = useMemo<RouteMatcher[]>(
    () => patterns.map((it) => createMatcher(it, "", parentMatcher)),
    [patterns.join(":"), pathname, parentMatcher],
  );
  return !matchers[0] || matchers.some((it) => it.match(pathname).state) ? (
    <Fragment />
  ) : (
    children
  );
}
