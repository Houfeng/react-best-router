import { normalizePath } from "./RouterUtil";

export type RouterState = { path: string };
export type RouterStateChangeHandler = (state: RouterState) => void;

export function normalizeState(state: RouterState): RouterState {
  return { ...state, path: normalizePath(state.path) };
}
