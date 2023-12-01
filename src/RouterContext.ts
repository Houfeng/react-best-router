import { createContext, useContext } from "react";
import { RouterDriver } from "./RouterDriver";
import { RouterStack } from "./RouterStack";
import { MatchFunction, MatchResult } from "path-to-regexp";

export type RouterPattern = string & {};

export type RouterState = {
  path: string;
  prefix: RouterPattern;
  fullPrefix: RouterPattern;
  pattern: RouterPattern;
  match: MatchFunction<object>;
  result?: MatchResult;
};

export type RouterDispatch = (state: RouterState) => void;

export type RouterContextValue = {
  driver: RouterDriver;
  state: RouterState;
  stack: RouterStack;
};

export const RouterContext = createContext<RouterContextValue>(null!);

export function useRouterContext() {
  return useContext(RouterContext);
}
