import React, {
  ReactNode,
  useState,
  useMemo,
  useLayoutEffect,
  Fragment,
} from "react";
import { RouterDriver } from "./RouterDriver";
import { RouterContext, RouterContextValue } from "./RouterContext";
import {
  RouterMatcher,
  RouterPattern,
  createRouterMatcher,
} from "./RouterMatcher";
import { NavigatorForwarder, RouterNavigatorRef } from "./RouterNavigator";

export type RouterProps = {
  pattern?: RouterPattern;
  prefix?: RouterPattern;
  children?: ReactNode;
  driver: RouterDriver;
  render?: (children: ReactNode) => ReactNode;
  navigator?: RouterNavigatorRef<any>;
};

export function Router(props: RouterProps) {
  const { children, driver, render, navigator } = props;
  const { pattern = "/(.*)", prefix } = props;
  // initial state
  const [state, setState] = useState(() => driver?.current());
  // create matcher
  const matcher = useMemo<RouterMatcher>(
    () => createRouterMatcher(pattern, prefix),
    [pattern, prefix],
  );
  // create context
  const context = useMemo<RouterContextValue>(
    () => ({ state, driver, matcher }),
    [state, driver, matcher],
  );
  // bind to driver
  useLayoutEffect(
    () => driver?.subscribe((state) => setState(state)),
    [driver, state],
  );
  // match current pathname
  if (!matcher.match(state.pathname)) return <Fragment />;
  return (
    <RouterContext.Provider value={context}>
      {navigator && <NavigatorForwarder ref={navigator} />}
      {render ? render(children) : children}
    </RouterContext.Provider>
  );
}
