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

type SideType = FC<{ pattern: RoutePattern }>;

export type RouteFallbackProps = {
  side: [SideType, ReactNode];
  children: ReactNode;
};

function takeSidePatterns(type: SideType, elements: ReactNode) {
  const items = Children.toArray(elements).filter(
    (it: any) => !!it && it?.type !== Fragment,
  );
  const validItems = items.filter((it: any) => it.type === type);
  return items.length === validItems.length
    ? validItems.map((it: any) => it.props?.pattern)
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
