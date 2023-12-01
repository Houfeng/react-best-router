import { RouterState } from "./RouterState";

export type RouterStateChangeHandler = (state: RouterState) => void;

export type RouterDriver = {
  subscribe: (handler: RouterStateChangeHandler) => () => void;
  current: () => RouterState;
  push: (state: RouterState) => void;
  replace: (state: RouterState) => void;
  go: (step: number) => void;
  back: () => void;
  forward: () => void;
};
