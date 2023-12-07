# RBR Router Features

## 1. Feature Overview

RBR essentially controls whether a specific node in the React application component tree is rendered based on the pattern. It is a part of the component tree, can be placed anywhere, nested arbitrarily, and can be loaded asynchronously. The inherent features of a React application are supported in RBR without special handling or dedicated APIs, just like ordinary React components.

The Route pattern always matches completely, there is no exact option, and routes are not matched in the order they appear. All route components that match the current URL in the entire component tree will be rendered. The positions of the routes at the same level do not affect the route matching but only affect the rendering position of the components. You don't have to think about where to place it just for matching; put it where it needs to be displayed.

You can easily organize the layout of the application, whether centralized or dispersed in different positions and different levels of components.

```tsx
function YourApp(){
  return (
    <Router driver={deriver}>
      ...
      <header>
        {/* The pattern below matches all paths */}
        <Route pattern="/(.*)"><NavBar/></Route>
      </header>
      <main>
        {/* The pattern below matches all paths */}
        <Route pattern="/(.*)"><SideBar/></Route>
        {/* The pattern below matches the id specified in posts */}
        <Route pattern="/posts/:id"><Content/></Route>
      </main>
      ...
    </Router>
  )
}
```

In the above example, when visiting /, NavBar and SideBar will both be rendered, and Content will not be rendered. When visiting /posts/1, NavBar, SideBar, and Content will all be rendered.

## 2. Default Route

As mentioned in the previous section, RBR always matches completely and does not match one by one in order. Therefore, RBR does not have the concept of a default route. You can directly configure the route target of /, and it can be placed anywhere without relying on order or needing to configure a wildcard route last.

```tsx
function App(){
  return (
    <Router driver={driver}>
      {/* 
        Explicitly and accurately configure which page the / route goes to,
        can be PageA/PageB/PageC or other Pages
      */}
      <Route pattern="/"><PageA></Route>
      <Route pattern="/b"><PageB></Route>
      <Route pattern="/b"><PageC></Route>
    </Router>
  );
}
```

You can also achieve the effect of a default route by declaring optional paths using modifiers.

```tsx
function App(){
  return (
    <Router driver={driver}>
      {/* 
        The pattern below declares 'a' as optional, matching /a and /
        When accessing / or /a, PageA will be rendered 
      */}
      <Route pattern="/(a)?"><PageA></Route>
      <Route pattern="/b"><PageB></Route>
      <Route pattern="/c"><PageA></Route>
    </Router>
  );
}
```

## 3. Fallback Rendering

Sometimes, it may be necessary to display specific content when no route matches, such as a NotFound page. Since RBR does not match one by one in order, it is not possible to configure a wildcard route as a NotFound page at the last position.

However, RBR provides a fallback mechanism for both Router and Route, which can support similar requirements. Fallback can be used for Router or Route.

```tsx
function App(){
  return (
    <Router driver={driver}>
      {/* 
        When specifying fallback, you can omit the pattern of the route (you can declare it when needed)
        When neither Route itself nor all directly child Route can match the current URL, the fallback will be rendered
      */}
      <Route fallback={<div>Not Found</div>}>
        <Route pattern="/b"><PageA></Route>
        <Route pattern="/c"><PageA></Route>
      </Route>
    </Router>
  );
}
```

Once a Route or Router specifies a fallback, when neither itself nor all directly child Route can match the current URL, the fallback content will be rendered. So, besides implementing a NotFound page, you can also use the fallback approach to achieve a default route.

## 4. Nested Routes

Usually, it only makes sense to add "child routes" when the parent route is a "prefix match" because if the parent route is a strict match, although child routes can be added, they will not be matched.

Here is an example of nested parent-child routes with only two layers of paths:

```tsx
<Route pattern="/foo/:bar">
  ...
  {/* Child routes can also be specified directly in children */}
  <Route pattern="/:child_bar">
  ...
   {/* You can directly specify the target component to be rendered through children */}
   {/* The Content component is defined in Content.tsx */}
  <Content />  
</Route>
```

In addition to adding child routes directly in the direct children of the Route, child routes can also be added in any level of child components.

```tsx
// Content.tsx, child routes can also be added in child components
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

**How to determine the complete pattern of the child route?**

> The "exact part of the parent route pattern with the longest length as the prefix" is combined with the "pattern of the child route itself" to form the "complete pattern" of the child route.

In the example pattern defined above:

```zsh
👉 Parent route, if the pattern is /foo/:bar
    Then, the longest exact part is /foo/

👉 Child route, if the pattern is /:child_bar
    Then, the complete pattern of the child route is: /foo/:child_bar
```

A more complex example with multiple variables:

```zsh
👉 Parent route, if the pattern is /foo/:bar/abc/(.*)
    Then, the longest exact part is /foo/:bar/abc/

👉 Child route, if the pattern is /posts/:id
    Then, the complete pattern of the child route is: /foo/:bar/abc/posts/:id
```
