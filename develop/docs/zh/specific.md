# RBR 路由特性

## 1. 特性概述

RBR 本质上是「根据 patten 控制 React 应用组件树中的某个节点是否渲染」, Ta 是组件树的一部分，
可放在任意位置、任意嵌套、可被异步载入。
React 应用固有的特性，在 RBR 中都是不必特殊处理、也没有专门 API，就像普通 React 组件一样的被支持。

Route 的 pattern 总是完整匹配，**没有 exact 选项，也没不会按 Route 出现的顺序匹配**，
在整个组件树中与当前 URL 匹配的路由组件都会被渲染，
**平级的 Route 出现的位置并不会影响路由的匹配**，而只影响组件的渲染位置，
你不必为了匹配而花心思想应该放在哪，**需要显示在哪儿就放在哪儿**。

你将可以很方便的组织应用的页面布局，无论集中在一起或是分散在不同位置不同层级的组件中

```tsx
function YourApp(){
  return (
    <Router driver={deriver}>
      ...
      <header>
        {/* 下方的 pattern 匹配所有路径 */}
        <Route pattern="/(.*)"><NavBar/></Route>
      </header>
      <main>
        {/* 下方的 pattern 匹配所有路径 */}
        <Route pattern="/(.*)"><SideBar/></Route>
        {/* 下方的 pattern 匹配 posts 指定的 id */}
        <Route pattern="/posts/:id"><Content/></Route>
      </main>
      ...
    </Router>
  )
}
```

在上述的示例中，当访问 **/** 时，NavBar 和 SideBar 都将渲染，而 Content 不会渲染。
当访问 **/posts/1** 时 NavBar、SideBar、Content 都会被渲染。

## 2. 默认路由

如上节讲述，RBR 总是完整匹配、也不会按顺序逐一匹配，所以 RBR 并没有默认路由的概念。
可通过 **直接配置 / 的路由目标**，可放到任意位置，无需依赖顺序、无需最后配置通配路由。

```tsx
function App(){
  return (
    <Router driver={driver}>
      {/* 
        可显式且准确的配置 / 路由到哪个页面，
        可以是 PageA/PageB/PageC 或其他 Page
      */}
      <Route pattern="/"><PageA></Route>
      <Route pattern="/b"><PageB></Route>
      <Route pattern="/b"><PageC></Route>
    </Router>
  );
}
```

还可以通过 **修饰符** 声明 **可选路径** 的方式实现默认路由的效果。

```tsx
function App(){
  return (
    <Router driver={driver}>
      {/* 
        下方的 pattern 将 a 声明为了可选，可匹配 /a 和 /
        在访问 / 或 /a 时，都将会渲染 PageA 
      */}
      <Route pattern="/(a)?"><PageA></Route>
      <Route pattern="/b"><PageB></Route>
      <Route pattern="/c"><PageA></Route>
    </Router>
  );
}
```

## 3. 兜底渲染

有时可能需要在路由没有匹配时，显示为指定的内容，比如一个 NotFound 页面。
由于 RBR 不会逐一按顺序匹配，也便无法在最后位置配置一个通配路由作为 NotFound 页面。

但 RBR 提供了 Route 的 fallback 机制可更支持类似的需求，fallback 可用于 Router 或 Route。

```tsx
function App(){
  return (
    <Router driver={driver}>
      {/* 
        在指定 fallback 时，可省略 route 的 pattern（有需要时也可声明）
        在 Route 自身及所有直接子级 Route 都无法匹配当前 url 时，将渲染 fallback
      */}
      <Route fallback={<div>Not Found</div>}>
        <Route pattern="/b"><PageA></Route>
        <Route pattern="/c"><PageA></Route>
      </Route>
    </Router>
  );
}

```

一个 Route 或 Router 指定了 fallback 后，**当其自身及所有直接子级 Route 都无法匹配时，将渲染 fallback 内容**。所以，除了可实现 NotFound 页，也可用 fallback 的方式实现默认路由。

## 4. 嵌套路由

通常父路由为「前缀匹配」时，才有「添加子路由」的意义，因为，如果父路由是严格匹配，虽然也能添加子路由，但是子路由并没有极会被匹配到。

下方是父子级嵌套路由的示例，这个示例比较简单，只有两层路径

```tsx
<Route pattern="/foo/:bar">
  ...
  {/* 也可在 children 中直接批定子路由 */}
  <Route pattern="/:child_bar">
  ...
   {/* 可直接通过 children 来指定渲染的目标组件 */}
   {/* Content 组件定义在 Content.tsx 中 */}
  <Content />  
</Route>
```

除了在 Route 的直接 children 中添加子路由，也可在**任意层级**的子组件中添加子路由。

```tsx
// Content.tsx，也可在子组件中添加 Route
function Content() {
  return (
    <div>
    ...
     <Route pattern="/:child_bar">...</Route>
    ...
    </div>
  );
}
```

**怎么确定子路由的完整 pattern**？

> 由「父路由 pattern 最长的确切部分作为前缀」，加上「子路由自身的 pattern」， 最终组合成子路由的「完整 pattern」。

以上文示例中定义的 pattern 为示例

```zsh
👉 父路由，如果 pattern 为 /foo/:bar
    那么，最长的确切部分为 /foo/

👉 子路由，如果 pattern 为：/:child_bar
    那么，子路由的完整 pattern 为：/foo/:child_bar
```

一个有多个变量，更复杂一些的示例

```zsh
👉 父路由，如果 pattern 为 /foo/:bar/abc/(.*)
    那么，最长的确切部分为 /foo/:bar/abc/

👉 子路由，如果 pattern 为：/posts/:id
    那么，子路由的完整 pattern 为：/foo/:bar/abc/posts/:id
```
