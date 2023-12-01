import React, {
  useState,
  type ReactNode,
  useMemo,
  useLayoutEffect,
  Fragment,
  useCallback,
} from "react";
import { RouterDriver } from "./RouterDriver";
import {
  RouterContext,
  RouterContextValue,
  RouterPattern,
  RouterState,
} from "./RouterContext";
import { createRouterStack } from "./RouterStack";
import { match as compileToMatcher } from "path-to-regexp";
import { patternToPrefix } from "./RouterUtil";

export type RouterProps = {
  pattern?: RouterPattern;
  prefix?: RouterPattern;
  children?: ReactNode;
  driver: RouterDriver;
  render?: (children: ReactNode) => ReactNode;
};

export function Router(props: RouterProps) {
  const { children, driver, render } = props;
  const { pattern = "/", prefix = patternToPrefix(pattern) } = props;
  // create state function
  const createState = useCallback(
    (path: string): RouterState => {
      const match = compileToMatcher(pattern);
      return { path, prefix, fullPrefix: prefix, pattern, match };
    },
    [prefix, pattern],
  );
  // initial state
  const [state, dispatch] = useState(() =>
    createState(driver?.state()?.path || "/"),
  );
  // initial stack
  const stack = useMemo(() => createRouterStack(), []);
  // router context
  const context = useMemo<RouterContextValue>(() => {
    return { state, driver, stack };
  }, [state, driver, stack]);
  // bind to driver
  useLayoutEffect(() => {
    return driver?.subscribe(({ path }) => dispatch(createState(path)));
  }, [driver, dispatch, createState]);
  // match current url
  const matchResult = state.match(state.path);
  if (!matchResult) return <Fragment />;
  state.result = matchResult;
  return (
    <RouterContext.Provider value={context}>
      {render ? render(children) : children}
    </RouterContext.Provider>
  );
}
