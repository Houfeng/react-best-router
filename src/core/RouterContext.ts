import { createContext, useContext } from "react";
import { RouterDriver } from "./RouterDriver";
import { RouterState } from "./RouterState";

export type RouterContextValue = {
  base: string;
  state: RouterState;
  driver: RouterDriver;
};

export const RouterContext = createContext<RouterContextValue>(null!);

export function useRouterContext(): RouterContextValue {
  const value = useContext(RouterContext);
  if (!value) throw "Invalid call outside of Router";
  return value;
}
