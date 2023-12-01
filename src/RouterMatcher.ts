import { MatchFunction, MatchResult } from "path-to-regexp";
import { match as compileToMatcher } from "path-to-regexp";
import { normalize } from "path-browserify";
import { patternToPrefix } from "./RouterUtil";

export type RouterPattern = string & {};

export type RouterMatcher = {
  pattern: RouterPattern;
  prefix: RouterPattern;
  match: MatchFunction<any>;
  result?: MatchResult<any> | false;
  parent?: RouterMatcher;
};

function getMatcherFullPrefix(matcher: RouterMatcher | undefined) {
  let current: RouterMatcher | undefined = matcher;
  let fullPrefix: RouterPattern = "";
  while (current) {
    fullPrefix = `${current.prefix}/${fullPrefix}`;
    current = current.parent;
  }
  return fullPrefix;
}

export function createRouterMatcher(
  pattern: RouterPattern,
  prefix?: RouterPattern,
  parent?: RouterMatcher,
): RouterMatcher {
  prefix = prefix || patternToPrefix(pattern);
  const fullPattern = `/${getMatcherFullPrefix(parent)}/${pattern}`;
  const match = compileToMatcher(normalize(fullPattern));
  const matcher: RouterMatcher = { parent, pattern, prefix, match };
  matcher.match = (pathname: string) => {
    matcher.result = match(pathname);
    return matcher.result;
  };
  return matcher;
}
