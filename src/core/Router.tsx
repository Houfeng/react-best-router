import { createElement, useState, useMemo, useLayoutEffect } from "react";
import { RouterDriver } from "./RouterDriver";
import { RouterContext, RouterContextValue } from "./RouterContext";
import { Route } from "./Route";
import { RouteProps } from "./RouteProps";

export type RouterProps = {
  base?: string;
  driver: RouterDriver;
} & Omit<RouteProps, "pattern" | "prefix">;

export function Router(props: RouterProps) {
  const { driver, base = "/", navigator, children, render } = props;
  // initial state
  const [state, setState] = useState(() => driver.current());
  // create context
  const context = useMemo<RouterContextValue>(
    () => ({ base, state, driver }),
    [base, state, driver],
  );
  // bind to driver
  useLayoutEffect(
    () => driver.subscribe((state) => setState(state)),
    [driver, state],
  );
  return (
    <RouterContext.Provider value={context}>
      <Route
        pattern={`${base}/(.*)`}
        prefix={base}
        render={render}
        navigator={navigator}
      >
        {children}
      </Route>
    </RouterContext.Provider>
  );
}
