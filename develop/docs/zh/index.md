# 🚀 快速上手 RBR

## 1. 简述

长期以来，我总在使用 react-router，但它有一些不太好用的地方，比如「嵌套路由」等，它也不够简洁，包含了一些和路由无关的功能，同时它新版本常常无法兼容。

一个周末，我决定写一个更简单易用的包，专注于处理 React 项目中的 Router 工作。 我给这个包命名为 **react-best-router**，也可简称为 **RBR**。

## 2. 安装

```zsh
$ npm install react-best-router 
```

## 3. 使用

```tsx
import { Router, useBrowserDriver } from "react-best-router";

// 示例应用入口组件
function App() {
  // 需要指定一个 driver （先不用太关心它，后续的文档中会介绍什么是 driver）
  const driver = useBrowserDriver(); 
  return (
    <Router driver={driver}>
      <Route pattern="/"><Index/></Route>
      <Route pattern="/posts"><Posts/></Route>
    </Router>
  );
}
```

以本地开发服务 *http://localhost:8080* 为例，现在就可浏览器中访问到 **index** 页面了，
也可以通过 *http://localhost:8080/posts* 访问 **Posts** 页面，**RBR** 已经在工作了。
  

接下来，我们为这个示例增加一个「导航菜单」，我们通过 **useNavigator**  Hook 可以获得
「Router navigator 实例」，用它在不同页面间导航。

```tsx
import { 
  Router, 
  useBrowserDriver, 
  useNavigator 
} from "react-best-router";

// 导航菜单组件
function NavMenus(){
  const nav = useNavigator();
  return (
    <ul>
      <li><a onClick={nav.push('/index')}>Index</a></li>
      <li><a onClick={nav.push('/posts')}>Posts</a></li>
    </ul>
  );
}

// 示例应用入口组件
function App() {
  const driver = useBrowserDriver(); 
  return (
    <Router driver={driver}>
      <NavMenus/>
      <main>
        <Route pattern="/"><Index/></Route>
        <Route pattern="/posts"><Posts/></Route>
      </main>
    </Router>
  );
}
```

现在，你已经学会 RBR 的基本使用了，后边还将会介绍一些其他内容，但同样都是非常简单的。