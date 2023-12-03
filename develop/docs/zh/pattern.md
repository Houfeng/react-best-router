# 详解路径匹配

## 简述

长期以来，我总在使用 react-router，但它有一些不太好用的地方，比如「嵌套路由」等。它不够简洁，包含了一些和路由无关的功能。同时，新版本常常无法兼容。

一个周末，我决定写一个更简单易用的包，专注于处理 react 项目中的 router 工作。 我给这个包命名为 **react-best-router**，也可简称为 **RBR**。




Route 的 pattern 总是完整匹配，并没有 exact 之类的选项，
如果你想只前缀匹配，需要通过 pattern 来声明，通常父路由为「前缀匹配」时，才有「添加子路由」的意义，
因为，如果父路由是严格匹配，虽然也能添加子路由，但是子路由并没不有极会被匹配到。

下方量个父级嵌套路由的示例，这个示例比较简单，只有两层路径

```tsx
<Route pattern="/foo/:bar">
  ...
  {/* 也可在 children 中直接批定子路由 */}
  <Route pattern="/:child_bar">
  ...
   {/* 可直接通过 children 来指定渲染的目标组件 */}
  <Content />
</Route>
```

除了在 Route 的直接 children 中添加子路由，也可可在深层子组件中添加子路由

```tsx
// Content.tsx，也可在子组件中添加 Route
function Content() {
  return (
    <div>
    ...
     <Route pattern="/:child_bar">
    ...
    </div>
  );
}
```

怎么确定**子路由的完整 pattern**？

**重要提示** ：由「父路由 pattern 最长的确切部分作为前缀」，
加上「子路由自身的 pattern」， 最终组合成子路由的「完整 pattern」。

以上边的示例为例

1. 父路由的 pattern 为：**/foo/:bar**，最长的确切部分为：**/foo/**
2. 子路由的 pattern 为：**/:child_bar**
3. 那么，子路由的完整 pattern 为：**/foo/:child_bar**

