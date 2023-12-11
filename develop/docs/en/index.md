# Get Started

## 1. Overview

In a slightly larger React application, it's common to use a router to handle relationships between pages and navigation between them. Have you ever encountered difficulties with other router libraries? For instance, defining nested and dynamic routes might be cumbersome or problematic, or the API might not be concise. It could also include unrelated content, or compatibility issues might arise between different versions...

One weekend, I decided to create a simpler and more user-friendly routing package, focusing on handling routes in React applications. I named this package react-best-router and abbreviated it as RBR.

RBR has a small footprint, with a minified size of **5kb** and a GZip size of **2kb**. Its API is also concise, consisting of only **4** core groups of APIs, including (Router, Driver, Route, Navigator).

[![github](https://img.shields.io/badge/Repo-Github-blue)](https://github.com/houfeng/react-best-router)
[![npm](https://img.shields.io/npm/l/react-best-router.svg)](https://github.com/houfeng/react-best-router)
[![npm version](https://img.shields.io/npm/v/react-best-router.svg)](https://www.npmjs.com/package/react-best-router)
[![npm download](https://img.shields.io/npm/dt/react-best-router.svg)](https://www.npmjs.com/package/react-best-router)
[![minify](https://img.shields.io/badge/Minify-5kb-green)](https://github.com/houfeng/react-best-router)
[![minify](https://img.shields.io/badge/GZip-2kb-green)](https://github.com/houfeng/react-best-router)
[![unit](https://img.shields.io/badge/Tests-88%25-green)](https://github.com/houfeng/react-best-router)

## 2. Installation

Option 1: NPM Package

```zsh
# NPM Package
$ npm install react-best-router 
```

Option 2: Using CDN, pay attention to the version number

```html
<!-- CDN -->
<script 
src="https://cdn.jsdelivr.net/npm/react-best-router@latest/dist/react-best-router-iife.min.js">
</script>
```

## 3. Usage

```tsx
import { Router, useBrowserDriver } from "react-best-router";

// Example application entry component
function YourApp() {
  // Specify a driver (don't worry too much about it now, the documentation will explain what a driver is in the following sections)
  const driver = useBrowserDriver(); 
  return (
    <Router driver={driver}>
      <Route pattern="/"><Index/></Route>
      <Route pattern="/posts"><Posts/></Route>
    </Router>
  );
}
```

Taking the example of a local development server at http://localhost:8080, you can now access the index page in the browser and also visit the Posts page through http://localhost:8080/posts. RBR is already at work.

Next, let's add a "navigation menu" to this example. We can use the useNavigator hook to get the "Router navigator instance" and use it for navigation between different pages.

```tsx
import { 
  Router, 
  useBrowserDriver, 
  useNavigator 
} from "react-best-router";

// Navigation menu component
function NavMenus(){
  const nav = useNavigator();
  return (
    <ul>
      <li><a onClick={nav.push('/index')}>Index</a></li>
      <li><a onClick={nav.push('/posts')}>Posts</a></li>
    </ul>
  );
}

// Example application entry component
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

Now, you have a basic understanding of how to use RBR. Later on, we will introduce some other features, but they are equally simple.
