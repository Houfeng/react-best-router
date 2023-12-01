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
