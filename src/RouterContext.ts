import { createContext, useContext } from "react";
import { RouterDriver } from "./RouterDriver";
import { RouterHistoryState, RouterStack } from "./RouterStack";
import { RouterMatcher } from "./RouterMatcher";

export type RouterContextValue = {
  state: RouterHistoryState;
  driver: RouterDriver;
  matcher: RouterMatcher;
  stack: RouterStack;
};

export const RouterContext = createContext<RouterContextValue>(null!);

export function useRouterContext() {
  return useContext(RouterContext);
}
