import { createContext, useContext } from "react";
import { normalizePath, patternToRegExp } from "./RouterUtil";

type MatchResult<P extends object> = {
  state: boolean;
  params: P;
  query: URLSearchParams;
};

type MatchFunction<P extends object> = (path: string) => MatchResult<P>;

export type RoutePattern = string & {};

export type RouteMatcher<P extends object = object> = {
  pattern: RoutePattern;
  prefix: RoutePattern;
  match: MatchFunction<P>;
  result?: MatchResult<P>;
  parent?: RouteMatcher;
};

function patternToPrefix(pattern: RoutePattern) {
  const expr = /[.*()[\]?+:]/;
  const segments = pattern.split("/");
  const lastIndex = segments
    .slice(0)
    .reverse()
    .findIndex((it) => !expr.test(it));
  return (lastIndex > 0 ? segments.slice(0, -lastIndex) : segments).join("/");
}

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

function patternToMatch<P extends object = object>(pattern: string) {
  const regexp = patternToRegExp(pattern);
  return (path: string) => {
    const { pathname, searchParams } = new URL(path, location.origin);
    const info = regexp?.exec(decodeURIComponent(pathname));
    return {
      state: !!info,
      params: info?.groups || {},
      query: searchParams,
    } as MatchResult<P>;
  };
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
  matcher.match = (path: string) => {
    matcher.result = match(path);
    return matcher.result;
  };
  return matcher;
}

export const MatcherContext = createContext<RouteMatcher>(null!);

export function useParentMatcher(): RouteMatcher | undefined {
  return useContext(MatcherContext);
}
