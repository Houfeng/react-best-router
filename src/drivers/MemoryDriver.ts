import { useMemo } from "react";
import { RouterDriver, RouterStateChangeHandler, RouterState } from "../core";

export function createMemoryDriver(
  initialState: RouterState = { pathname: "/" },
): RouterDriver {
  let handler: RouterStateChangeHandler | undefined;
  let stack: RouterState[] = [initialState];
  let cursor = 0;
  const setCursor = (index: number, force = false) => {
    if (index === cursor && !force) return;
    if (index < 0) index = 0;
    if (index > stack.length - 1) index = stack.length;
    cursor = index;
    handler?.(stack[cursor] || initialState);
  };
  return {
    subscribe: (callback) => {
      handler = callback;
      return () => (handler = undefined);
    },
    current: () => stack[cursor] || initialState,
    replace: (state: RouterState) => {
      stack = stack.slice(0, cursor + 1);
      stack[cursor] = state;
      setCursor(stack.length - 1, true);
    },
    push: (state: RouterState) => {
      stack = stack.slice(0, cursor + 1);
      stack.push(state);
      setCursor(stack.length - 1);
    },
    go: (step: number) => setCursor(cursor + step),
    back: () => cursor > 0 && setCursor(cursor - 1),
    forward: () => cursor < stack.length - 1 && setCursor(cursor + 1),
  };
}

export function useMemoryDriver(initialState: RouterState = { pathname: "/" }) {
  return useMemo(() => createMemoryDriver(initialState), [initialState]);
}
