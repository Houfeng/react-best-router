# 快速上手 RBR

## 1. 简述

在稍大些的 React 应用中，通常需要使用 Router 处理页面间的关系，以及在页面之间导航。
你在用其他 Router 库吗？是否遇到过不太好用的地方？比如，定义嵌套路由时比较麻烦或有问题、
或者不够简洁包含了一些和路由无关的功能、或者不同版本间常常不兼容...

在一个周末，我尝试写了这个更简单易用的路由包，专注于 React 应用的路由处理，我给这个包命名为 **react-best-router**，并简称为 **RBR**。

## 2. 安装

```zsh
$ npm install react-best-router 
```

## 3. 使用

```tsx
import { Router, useBrowserDriver } from "react-best-router";

// 示例应用入口组件
function YourApp() {
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
function YourApp() {
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