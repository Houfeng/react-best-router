import { Fragment, ReactNode, createElement, useMemo } from "react";
import { RouteProps } from "./RouteProps";
import { RouterMatcher, createRouterMatcher } from "./RouterMatcher";

export type RouteFallbackProps = {
  pathname: string;
  parentMatcher: RouterMatcher;
  targets: RouteProps[];
  children: ReactNode;
};

export function RouteFallback(props: RouteFallbackProps) {
  const { pathname, parentMatcher, targets, children } = props;
  const matchers = useMemo<RouterMatcher[]>(
    () =>
      targets?.map((it) => {
        const { pattern, prefix } = it;
        return createRouterMatcher(pattern, prefix, parentMatcher);
      }),
    [targets.map((it) => `${it.pattern}::${it.prefix}`), parentMatcher],
  );
  if (!matchers.some((it) => it.match(pathname).state)) return <Fragment />;
  return children;
}
