import { RouterPattern } from "./RouterContext";

// eslint-disable-next-line
const expr = /[\.\*\(\)\[\]\:]/;

export function patternToPrefix(pattern: RouterPattern) {
  const segments = pattern.split("/");
  const lastIndex = segments
    .slice(0)
    .reverse()
    .findIndex((it) => !expr.test(it));
  return (lastIndex > 0 ? segments.slice(0, -lastIndex) : segments).join("/");
}
