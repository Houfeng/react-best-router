export type RouterHistoryState = { pathname: string };

export type RouterStack = {
  stack: () => Readonly<RouterHistoryState[]>;
  cursor: () => number;
  current: () => RouterHistoryState;
  replace: (state: RouterHistoryState) => void;
  push: (state: RouterHistoryState) => void;
  go: (step: number) => RouterHistoryState;
  back: () => RouterHistoryState | false;
  forward: () => RouterHistoryState | false;
};

export function createRouterStack(): RouterStack {
  let stack: RouterHistoryState[] = [];
  let cursor = 0;
  return {
    stack: () => stack,
    cursor: () => cursor,
    current: () => stack[cursor],
    replace: (state: RouterHistoryState) => {
      stack = stack.slice(0, cursor + 1);
      stack[cursor] = state;
      cursor = stack.length - 1;
    },
    push: (state: RouterHistoryState) => {
      stack = stack.slice(0, cursor + 1);
      stack.push(state);
      cursor = stack.length - 1;
    },
    go: (step: number) => {
      cursor += step;
      if (cursor < 0) cursor = 0;
      if (cursor > stack.length - 1) cursor = stack.length;
      return stack[cursor];
    },
    back: () => cursor > 0 && stack[cursor--],
    forward: () => cursor < stack.length - 1 && stack[cursor++],
  };
}
