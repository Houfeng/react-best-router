import { createElement, ReactNode, useMemo, Fragment } from "react";
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
import { isValidElements } from "./RouterUtil";

export type RouteProps = {
  children?: ReactNode;
  render?: (children: ReactNode) => ReactNode;
  prefix?: RouterPattern;
  navigator?: RouterNavigatorRef<any>;
} & (
  | {
      pattern: RouterPattern;
      fallback?: ReactNode;
    }
  | {
      pattern?: RouterPattern;
      fallback: ReactNode;
    }
);

export function Route(props: RouteProps) {
  const { pattern = "/(.*)", prefix, navigator } = props;
  const { render, children, fallback = <Fragment /> } = props;
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
  if (!matcher.match(state.pathname).state) return fallback;
  // check children
  const elements = render ? render(children) : children;
  if (!isValidElements(elements)) return fallback;
  return (
    <RouterContext.Provider value={context}>
      {navigator && <NavigatorForwarder ref={navigator} />}
      {elements}
    </RouterContext.Provider>
  );
}
