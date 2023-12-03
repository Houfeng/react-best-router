# 🗼 仅有 4 个 API

RBR 专注于解决「React 应用路由处理」这一个问题，它是一个极简的路由库，总共有 **4 个核心 API**。

## 1. Router

Router 以一个 React 组件的形式提供，通常一个应用只需要一个 Router 作为容器在最外层，
当然，根据你的需求也可以使用多个 Router。

```tsx
type RouterProps = {
  // 指定 Router 的路径前缀，默认值为 `/`，
  // 当应用运行在一个子路径下时，这非常有用。
  base?: string;

  // 为当前 Router 指定驱动类型
  driver: RouterDriver;

  // 这是一个 Ref，当你需要 Router 组件子树外访问 navigator 时，它非常有用
  navigator?: RouterNavigatorRef<any>;

  // 可以是任意合法的 ReactNode，在任意深度的层级中都可使用 route
  children?: ReactNode;
};
```

Router 使用示例

```tsx
function YourApp() {
  const driver = useBrowserDriver(); 
  return (
    <Router driver={driver} navigator={navRef}>
      <Route pattern="/"><Index/></Route>
      <Route pattern="/posts"><Posts/></Route>
    </Router>
  );
}
```

## 2. Route

Route 是在用 RBR 时被使有最多的 API 之一，所有具体的路由都使用它来定义，Route 以 React 组件
的形式提供。

```tsx
type RouteProps = {
  // 路由的「路径匹配模式」
  pattern: RouterPattern;

  // 传递给子路由的「前缀匹配模式」，默认由 pattern 自动计算，但也可手动指定
  prefix?: RouterPattern;

  // 这是一个 Ref，当你需要 Route 组件子树外访问 navigator 时，它非常有用
  navigator?: RouterNavigatorRef<any>;

  // 可以是任意合法的 ReactNode，在任意深度的层级中都可添加子 route
  children?: ReactNode;
};
```

Route 使用示例

```tsx
// 通过 pattern 定义 path 的匹配模式（在《详解路径匹配》中有详细说明）
<Route pattern="/foo/:bar">
  {/* 可直接通过 children 来指定渲染的目标组件 */}
  <Content />
  {/* 也可在 children 中直接指定子路由 */}
  <Route pattern="/:child_bar">
</Route>
```

## 3. Navigator

Navigator 是在用 RBR 时被使有最多的 API 之二，通过它在各页面之导航，
Navigator 以 React Hooks 和 factory function 的形式提供。

```tsx
type RouterNavigator<P extends object> = {
  // 应用当前的 pathname
  pathname: string;
  // 路由参数
  params: MatchResult<P>["params"];
  // 跳转到指定的路径
  push: (path: string) => void;
  // 返回上一个路径
  back: () => void;
  // 当前返回后，还可前进到下一个路径
  forward: () => void;
  // 返回或前进指定的步数，<0 为返回，>0 为前进
  go: (step: number) => void;
  // 替换当前路径，不影响历史记录
  replace: (path: string) => void;
};
```

Navigator 使用示例

```tsx
// 使用方式一
function YourComponent() {
  // 通过 useNavigator 获取最近的 router/route 对应的 navigator 对象
  const nav = useNavigator();
  return (
    <button onClick={()=>nav.push(`/foo/${nav.params.bar}`)}>
      Click me
    </button>
  );
}

// 使用方式二
function YourApp() {
  const navRef = useNavigatorRef();
  return (
    <Router driver={driver} navigator={navRef}>
      {...}
    </Router>
  );
}

// 使用方式三
const navRef = createNavigatorRef();
function YourApp() {
  return (
    <Router driver={driver} navigator={navRef}>
      {...}
    </Router>
  );
}
```

## 4. Driver

在不同的场景下，我们需要有不同的 Driver 来和运行环境关联并区动整个 Router 运行，
比如，在浏览器中我们需要的 URL 关联，也可能仅和 Hash 关联，也可能仅是运行于内存中的逻辑。

### BrowserDriver

基于浏览器 History API 的驱动，主流的浏览器都已支持，大多数 Web 应用都可以使用它

```ts
// 使用方法一，当在一个组件中创建 driver 时，请使用这个 Hook
const driver = useBrowserDriver();

// 使用方法二，当在组件外部创建 driver 时，请使用如下的方法
const driver = createBrowserDriver();
```

### HashDriver

在一些旧浏览器，或者你的服务器程序无法面向前端命名用 HistoryFallback 时，可以用 HashDriver

```ts
// 使用方法一，当在一个组件中创建 driver 时，请使用这个 Hook
const driver = useHashDriver();

// 使用方法二，当在组件外部创建 driver 时，请使用如下的方法
const driver = createHashDriver();
```

### MemoryDriver

当你在非浏览器环境使用 RBR 时，或不想在 URL 中反映你的页面路径，可以使用 MemoryDriver

```ts
// 使用方法一，当在一个组件中创建 driver 时，请使用这个 Hook
const driver = useMemoryDriver(/* 可选选项 */);

// 使用方法二，当在组件外部创建 driver 时，请使用如下的方法
const driver = createMemoryDriver(/* 可选选项 */);

// 选项类型定义如下，选项的默认值为 { pathname: "/" }
type MemoryDriverInitialState {
  // 因为内存 Driver 并没有现有的路径可关联，需要通过初始状态的 pathname 指定
  pathname: string; 
}
```
