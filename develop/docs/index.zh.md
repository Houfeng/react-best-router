# 快速上手 RBR

## 简述

长期以来，我总在使用 react-router，但它有一些不太好用的地方，比如「嵌套路由」等。它不够简洁，包含了一些和路由无关的功能。同时，新版本常常无法兼容。

一个周末，我决定写一个更简单易用的包，专注于处理 react 项目中的 router 工作。 我给这个包命名为 `react-best-router`，也可简称为 `RBR`。

## 安装

```
npm install react-best-router --save
```

## 使用

```tsx
import { Router } from "react-best-router";

function App() {
  return (
    <Router>

    </Router>
  );
}
```