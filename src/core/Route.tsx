import { createElement, useMemo, Fragment, ReactNode, Children } from "react";
import { useRouterContext } from "./RouterContext";
import {
  MatcherContext,
  RouterMatcher,
  createRouterMatcher,
  useParentMatcher,
} from "./RouterMatcher";
import { NavigatorForwarder } from "./RouterNavigator";
import { RouteFallback } from "./RouteFallback";
import { RouteProps } from "./RouteProps";

function takeFallbackProps(elements: ReactNode) {
  return Children.toArray(elements)
    .map((it: any) => it.type === Route && it.props)
    .filter((it) => !!it);
}

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
  if (!matcher.match(state.pathname).state) return <Fragment />;
  // normalize children
  const elements = render ? render(children) : children;
  return (
    <MatcherContext.Provider value={matcher}>
      {navigator && <NavigatorForwarder ref={navigator} />}
      {elements}
      {fallback && (
        <RouteFallback
          pathname={state.pathname}
          parentMatcher={parentMatcher}
          targets={takeFallbackProps(elements)}
        >
          {fallback}
        </RouteFallback>
      )}
    </MatcherContext.Provider>
  );
}
