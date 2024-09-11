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

export function patternToRegExp(pattern: string) {
  // S->Separator, N->Name, R->Regexp, M->Modifier
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
        ? `(?<$${++index}>${R}${M})`
        : `${S}${M}(?<$${++index}>${R}${M})`;
    const key = `{{${id++}}}`;
    table.push([key, value]);
    return key;
  });
  text = text
    .replace(/\?/g, "\\?")
    .replace(/\*/g, "\\*")
    .replace(/\+/g, "\\+")
    .replace(/\./g, "\\.")
    .replace(/\//g, "\\/");
  table.forEach(([key, value]) => (text = text.replace(key, value)));
  try {
    return new RegExp(`^${text}$`, "i");
  } catch {
    throw `Invalid pattern: ${pattern}`;
  }
}
