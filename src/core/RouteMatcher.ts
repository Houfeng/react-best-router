import { createContext, useContext } from "react";
import { normalizePath, patternToRegExp } from "./RouterUtil";

export type RouteParams = Record<string, unknown>;

type MatchResult<P extends RouteParams> = {
  state: boolean;
  params: P;
  query: URLSearchParams;
};

type MatchFunction<P extends RouteParams> = (path: string) => MatchResult<P>;

export type RoutePattern = string & {};

export type RouteMatcher<P extends RouteParams = RouteParams> = {
  pattern: RoutePattern;
  prefix: RoutePattern;
  match: MatchFunction<P>;
  result?: MatchResult<P>;
  parent?: RouteMatcher;
};

function patternToPrefix(pattern: RoutePattern) {
  const expr = /[.*()[\]?+]/;
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

function normalizePattern(normalizedPattern: string) {
  normalizedPattern = normalizePath(normalizedPattern);
  return normalizedPattern.length > 1 && normalizedPattern.at(-1) === "/"
    ? normalizedPattern.slice(0, -1)
    : normalizedPattern;
}

function patternToMatch<P extends RouteParams = RouteParams>(pattern: string) {
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
  if (parent && parent.prefix === parent.pattern) {
    const err = `Invalid nesting '${parent.pattern} -> ${pattern}'`;
    throw new Error(err);
  }
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
