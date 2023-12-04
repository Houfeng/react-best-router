function pathToRegexp(path) {
  const table = [];
  let tableId = 0;
  let newPath = path;
  // 具名匹配
  const namedExpr = /(?<S>\/)?:(?<N>[a-z0-9_]+)(?<R>\(.+?\))?(?<M>[\*\?\+])?/gi;
  newPath = newPath.replace(namedExpr, function (_match, S, N, R, M) {
    // console.log('named::', { _match, N, R, M });
    const value = M === '*' || M === '+'
      ? `(?<${N}>${R || `(${S || ''}[a-z0-9_-]+)`}${M || ''})`
      : `${S || ''}${M || ''}(?<${N}>${R || `([a-z0-9_-]+)`}${M || ''})`;
    const key = `{${tableId++}}`;
    table.push([key, value]);
    return key;
  });
  // 匿名匹配
  let index = 0;
  const anonymousExpr = /(?<S>\/)?(?<R>\(.+?\))(?<M>[\*\?\+])?/gi;
  newPath = newPath.replace(anonymousExpr, function (_match, S, R, M) {
    // console.log('anonymous::', { _match, R, M });
    const value = M === '*' || M === '+'
      ? `(?<$${index++}>${R || `(${S || ''}[a-z0-9_-]+)`}${M || ''})`
      : `${S || ''}${M || ''}(?<$${index++}>${R || `([a-z0-9_-]+)`}${M || ''})`;
    const key = `{${tableId++}}`;
    table.push([key, value]);
    return key;
  });
  table.forEach(([key, value]) =>
    newPath = newPath.replace(key, value));
  return newPath.replace(/\//g, '\\\/');
}

const exprText = pathToRegexp("/foo/:bar/(.*)");

console.log('exprText::', exprText);

const expr = new RegExp(`^${exprText}$`, 'i');


console.log('test::', expr.exec('/foo/abc/123'));



// console.log('=========================================================')

// const regexp = new RegExp('^\/foo\/(?<bar>([a-z0-9_-]+))$','i');
// console.log('+++',regexp.exec('/foo/aaadsafdsaf_dsafdss-saf')?.groups)