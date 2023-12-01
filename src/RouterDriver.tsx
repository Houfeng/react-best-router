import { RouterHistoryState } from "./RouterStack";

export type RouterDriverChangeHandler = (state: RouterHistoryState) => void;

export type RouterDriver = {
  subscribe: (handler: RouterDriverChangeHandler) => () => void;
  state: () => RouterHistoryState;
  push: (state: RouterHistoryState) => void;
  replace: (state: RouterHistoryState) => void;
};
