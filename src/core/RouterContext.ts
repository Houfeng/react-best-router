import { createContext, useContext } from "react";
import { RouterDriver } from "./RouterDriver";
import { RouterState } from "./RouterState";

export type RouterContextValue = {
  base: string;
  state: RouterState;
  driver: RouterDriver;
};

export const RouterContext = createContext<RouterContextValue>(null!);
export function useRouterContext() {
  return useContext(RouterContext);
}
