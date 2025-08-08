import { createElement, useState, useMemo, useLayoutEffect } from "react";
import { RouterDriver } from "./RouterDriver";
import { RouterContext, RouterContextValue } from "./RouterContext";
import { Route, RouteNormalProps } from "./Route";
import { RouterState } from "./RouterState";
import { normalizePath } from "./RouterUtil";

export type RouterProps = {
  base?: string;
  driver: RouterDriver;
} & Omit<RouteNormalProps, "pattern" | "prefix">;

export function Router(props: RouterProps) {
  const { driver, base = "/", navigator, children, render, fallback } = props;
  // initial state
  const [state, setState] = useState<RouterState>(() => {
    const current = driver.current();
    return { ...current, path: normalizePath(current.path) };
  });
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
        pattern={`${base}/(.*)?`}
        prefix={base}
        render={render}
        navigator={navigator}
        fallback={fallback}
      >
        {children}
      </Route>
    </RouterContext.Provider>
  );
}
