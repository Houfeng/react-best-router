# RBR 路由特性

## 1. 特性概述

RBR 本质上是「根据 patten 控制 React 应用组件树中的某个节点是否渲染」, Ta 是组件树的一部分，
可放在任意位置、任意嵌套、可被异步载入。
React 应用固有的特性，在 RBR 中都是不必特殊处理、也没有专门 API，就像普通 React 组件一样的被支持。

Route 的 pattern 总是完整匹配，并没有 exact 之类的选项，在整个组件树中与当前 URL 匹配的
路由组件都会被渲染，**平级的 Route 出现的位置并不会影响路由的匹配**，而只影响组件的渲染位置，
你不必为了匹配而花心思想应该放在哪，**需要显示在哪儿就放在哪儿**。

```tsx
function YourApp(){
  return (
    <Router driver={deriver}>
      ...
      <header>
        <Route pattern="/(.*)"><NavBar/></Route>
      </header>
      <main>
        <Route pattern="/(.*)"><SideBar/></Route>
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
