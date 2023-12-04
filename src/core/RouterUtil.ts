import { RouterPattern } from "./RouterMatcher";

// eslint-disable-next-line
const MatchmakerExpr = /[\.\*\(\)\[\]\:]/;

export function patternToPrefix(pattern: RouterPattern) {
  const segments = pattern.split("/");
  const lastIndex = segments
    .slice(0)
    .reverse()
    .findIndex((it) => !MatchmakerExpr.test(it));
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
