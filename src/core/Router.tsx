import React, {
  ReactNode,
  useState,
  useMemo,
  useLayoutEffect,
  Fragment,
} from "react";
import { RouterDriver } from "./RouterDriver";
import { RouterContext, RouterContextValue } from "./RouterContext";
import { RouterMatcher, createRouterMatcher } from "./RouterMatcher";
import { NavigatorForwarder, RouterNavigatorRef } from "./RouterNavigator";

export type RouterProps = {
  base?: string;
  children?: ReactNode;
  fallback?: ReactNode;
  render?: (children: ReactNode) => ReactNode;
  navigator?: RouterNavigatorRef<any>;
  driver: RouterDriver;
};

export function Router(props: RouterProps) {
  const { children, driver, render, navigator, base = "/", fallback } = props;
  // initial state
  const [state, setState] = useState(() => driver?.current());
  // create matcher
  const matcher = useMemo<RouterMatcher>(
    () => createRouterMatcher(`${base}/(.*)`, base),
    [base],
  );
  // create context
  const context = useMemo<RouterContextValue>(
    () => ({ base, state, driver, matcher }),
    [base, state, driver, matcher],
  );
  // bind to driver
  useLayoutEffect(
    () => driver?.subscribe((state) => setState(state)),
    [driver, state],
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
