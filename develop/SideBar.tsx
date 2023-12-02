import React from "react";
import { useNavigator } from "../src";

export function SideBar() {
  const nav = useNavigator();
  return (
    <ul className="menu p-3 w-60 bg-base-200 bg-opacity-75 glass h-full pt-16 text-base-content">
      <li className="text-sm">
        <a onClick={() => nav.push("/index")}>🚀 快速上手 RBR</a>
      </li>
      <li className="text-sm">
        <a onClick={() => nav.push("/api")}>🗼 仅有几个 API</a>
      </li>
      <li className="text-sm">
        <a onClick={() => nav.push("/pattern")}>🚏 详解路径匹配</a>
      </li>
      <li className="text-sm">
        <a onClick={() => nav.push("/examples")}>🛣 常见用法示例</a>
      </li>
    </ul>
  );
}
