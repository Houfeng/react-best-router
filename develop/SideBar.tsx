import React from "react";
import { useNavigator } from "../src";

export function SideBar() {
  const nav = useNavigator();
  return (
    <ul className="menu p-4 w-60 bg-base-200 bg-opacity-75 glass h-full pt-16 text-base-content">
      <li>
        <a onClick={() => nav.push("/index")}>🚀 快速上手 RBR</a>
      </li>
      <li>
        <a onClick={() => nav.push("/router")}>2. 详解路由使用</a>
      </li>
      <li>
        <a>3. 详解路径匹配</a>
      </li>
      <li>
        <a>4. 使用嵌套路由</a>
      </li>
      <li>
        <a>5. 了解路由驱动</a>
      </li>
    </ul>
  );
}
