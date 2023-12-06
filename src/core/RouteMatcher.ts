import { createContext, useContext } from "react";
import {
  MatchResult,
  MatchFunction,
  normalizePath,
  patternToMatch,
  patternToPrefix,
} from "./RouterUtil";

export type RoutePattern = string & {};

export type RouteMatcher<P extends object = object> = {
  pattern: RoutePattern;
  prefix: RoutePattern;
  match: MatchFunction<P>;
  result?: MatchResult<P>;
  parent?: RouteMatcher;
};

function getMatcherFullPrefix(matcher: RouteMatcher | undefined) {
  let current: RouteMatcher | undefined = matcher;
  let fullPrefix: RoutePattern = "";
  while (current) {
    fullPrefix = `${current.prefix}/${fullPrefix}`;
    current = current.parent;
  }
  return fullPrefix;
}

function normalizePattern(pattern: string) {
  return normalizePath(
    pattern.length > 1 && pattern.at(-1) === "/"
      ? pattern.slice(0, -1)
      : pattern,
  );
}

export function createMatcher(
  pattern: RoutePattern,
  prefix?: RoutePattern,
  parent?: RouteMatcher,
): RouteMatcher {
  prefix = prefix || patternToPrefix(pattern);
  const fullPattern = `/${getMatcherFullPrefix(parent)}/${pattern}`;
  const match = patternToMatch(normalizePattern(fullPattern));
  const matcher: RouteMatcher = { parent, pattern, prefix, match };
  matcher.match = (pathname: string) => {
    matcher.result = match(pathname);
    return matcher.result;
  };
  return matcher;
}

export const MatcherContext = createContext<RouteMatcher>(null!);

export function useParentMatcher() {
  return useContext(MatcherContext);
}
