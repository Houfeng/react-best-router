import { createContext, useContext } from "react";
import { RouterDriver } from "./RouterDriver";
import { RouterMatcher } from "./RouterMatcher";
import { RouterState } from "./RouterState";

export type RouterContextValue = {
  base: string;
  state: RouterState;
  driver: RouterDriver;
  matcher: RouterMatcher;
};

export const RouterContext = createContext<RouterContextValue>(null!);

export function useRouterContext() {
  return useContext(RouterContext);
}
