# Only 4 APIs

RBR focuses on solving the issue of "route handling in React applications." 
It is an extremely minimalist routing library, consisting of **4 core APIs**,
including (Router, Driver, Route, Navigator).

## 1. Router

Router is provided as a React component, and typically, 
an application needs only one Router as a container at the outermost level. Of course,
multiple Routers can be used based on requirements.

```tsx
type RouterProps = {
  // Specify the path prefix for the Router, default value is `/`.
  // Useful when the application runs under a subpath.
  base?: string;

  // Specify the driver type for the current Router.
  driver: RouterDriver;

  // This is a Ref, useful when the navigator needs to be accessed outside 
  // the Router component subtree.
  navigator?: RouterNavigatorRef<any>;

  // Can be any valid ReactNode, can be used at any depth to define routes.
  children?: ReactNode;
};
```

Router Usage Example

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

Route is one of the most used APIs when using RBR. 
It is used to define all specific routes, provided in the form of a React component.

```tsx
type RouteProps = {
  // Route's "path matching pattern."
  pattern: RouterPattern;

  // "Prefix matching pattern" passed to child routes, automatically calculated based on pattern by default but can be manually specified.
  prefix?: RouterPattern;

  // This is a Ref, useful when the navigator needs to be accessed outside the Route component subtree.
  navigator?: RouterNavigatorRef<any>;

  // Can be any valid ReactNode, allowing child routes to be added at any depth.
  children?: ReactNode;
};
```

Route Usage Example

```tsx
// Define the path matching pattern through pattern (detailed explanation in "Path Matching Explained").
<Route pattern="/foo/:bar*">
  {/* Directly specify the target component to render through children */}
  <Content />
  {/* Alternatively, directly specify child routes within children */}
  <Route pattern="/:child_bar">...</Route>
</Route>
```

## 3. Navigator

Navigator is the second most used API when using RBR, allowing navigation between pages. Navigator is provided in the form of React Hooks and a factory function.

```tsx
type RouterNavigator<P extends object> = {
  // Current application path, eg: /foo/bar?foo=bar
  path: string;
  // Route parameters.
  params: P;
  // query parameters 
  query: URLSearchParams;
  // Navigate to the specified path.
  push: (path: string) => void;
  // Go back to the previous path.
  back: () => void;
  // After going back, it's possible to move forward to the next path.
  forward: () => void;
  // Go back or forward by a specified number of steps, <0 for back, >0 for forward.
  go: (step: number) => void;
  // Replace the current path without affecting the navigation history.
  replace: (path: string) => void;
};
```

Navigator Usage Examples

```tsx
// Usage Method 1
function YourComponent() {
  // Use useNavigator to get the navigator object corresponding to the nearest router/route.
  const nav = useNavigator();
  return (
    <button onClick={()=>nav.push(`/foo/${nav.params.bar}`)}>
      Click me
    </button>
  );
}

// Usage Method 2
function YourApp() {
  const navRef = useNavigatorRef();
  return (
    <Router driver={driver} navigator={navRef}>
      {...}
    </Router>
  );
}

// Usage Method 3
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

In different scenarios, different Drivers are needed to associate with the runtime environment and control the entire Router operation. For example, in the browser, it's usually associated with the URL, or it might only be associated with the hash, or it could be a logical operation running only in memory.

### BrowserDriver

A driver based on the browser's History API, supported by most mainstream browsers, suitable for most web applications.

```ts
// Usage Method 1, when creating a driver within a component, use this hook.
const driver = useBrowserDriver();

// Usage Method 2, when creating a driver outside a component, use the following method.
const driver = createBrowserDriver();
```

### HashDriver

For older browsers or when a server program cannot enable History fallback for the frontend.
> Enabling History fallback refers to configuring the server-side route /your_app_path/* to point to the corresponding frontend page.

```ts
// Usage Method 1, when creating a driver within a component, use this hook.
const driver = useHashDriver();

// Usage Method 2, when creating a driver outside a component, use the following method.
const driver = createHashDriver();
```

### MemoryDriver

When using RBR in a non-browser environment or when you don't want to reflect page paths in the URL, you can use MemoryDriver.

```ts
// Usage Method 1, when creating a driver within a component, use this hook.
const driver = useMemoryDriver(/* Optional options */);

// Usage Method 2, when creating a driver outside a component, use the following method.
const driver = createMemoryDriver(/* Optional options */);

// Option type definition, default value for options is { pathname: "/" }
type MemoryDriverInitialState {
  // Since the Memory Driver doesn't have an existing path to associate with, the initial state's pathname needs to be specified.
  pathname: string; 
}
```
