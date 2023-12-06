import { RoutePattern } from "./RouteMatcher";

export function patternToPrefix(pattern: RoutePattern) {
  const expr = /[.*()[\]:]/;
  const segments = pattern.split("/");
  const lastIndex = segments
    .slice(0)
    .reverse()
    .findIndex((it) => !expr.test(it));
  return (lastIndex > 0 ? segments.slice(0, -lastIndex) : segments).join("/");
}

export function normalizePath(path: string) {
  const segments = path.split("/").map((it) => (it || "").trim());
  const len = segments.length;
  return segments
    .reduce<string[]>((result, it, i) => {
      if (it === "." || (it === "" && i !== 0 && i !== len - 1)) return result;
      return it === ".." ? result.slice(0, -1) : [...result, it];
    }, [])
    .join("/");
}

export function resolvePath(from: string, to: string) {
  return normalizePath(`${from}/${to}`);
}

function patternToRegExp(pattern: string) {
  const table: Array<[string, string]> = [];
  let id = 0;
  let text = pattern;
  // named
  const named = /(?<S>\/)?:(?<N>[a-z0-9_]+)(?<R>\(.+?\))?(?<M>[*?+])?/gi;
  text = text.replace(named, function (_, S = "", N = "", R = "", M = "") {
    const value =
      M === "*" || M === "+"
        ? `(?<${N}>${R || `(${S}[a-z0-9_-]+)`}${M})`
        : `${S}${M}(?<${N}>${R || "([a-z0-9_-]+)"}${M})`;
    const key = `{{${id++}}}`;
    table.push([key, value]);
    return key;
  });
  // anonymous
  const anonymous = /(?<S>\/)?(?<R>\(.+?\))(?<M>[*?+])?/gi;
  let index = 0;
  text = text.replace(anonymous, function (_, S = "", R = "", M = "") {
    const value =
      M === "*" || M === "+"
        ? `(?<$${index++}>${R || `(${S}[a-z0-9_-]+)`}${M})`
        : `${S}${M}(?<$${index++}>${R || "([a-z0-9_-]+)"}${M})`;
    const key = `{{${id++}}}`;
    table.push([key, value]);
    return key;
  });
  table.forEach(([key, value]) => (text = text.replace(key, value)));
  text = text.replace(/\//g, "\\/");
  try {
    return new RegExp(`^${text}$`, "i");
  } catch {
    // eslint-disable-next-line
    console.error("Invalid pattern:", pattern);
  }
}

export type MatchResult<P extends object> = {
  state: boolean;
  params: P | undefined;
};

export type MatchFunction<P extends object> = (
  pathname: string,
) => MatchResult<P>;

export function patternToMatch<P extends object = object>(pattern: string) {
  const regexp = patternToRegExp(pattern);
  return (pathname: string) => {
    const info = regexp?.exec(pathname);
    return { state: !!info, params: info?.groups || {} } as MatchResult<P>;
  };
}
