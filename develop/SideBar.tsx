import React from "react";

export function SideBar() {
  return (
    <ul className="menu p-4 w-60 bg-base-200 bg-opacity-75 glass h-full pt-16 text-base-content">
      <li>
        <a>一、快速安装使用</a>
      </li>
      <li>
        <a>一、路由基本使用</a>
      </li>
      <li>
        <a>二、详解路径匹配</a>
      </li>
      <li>
        <a>三、使用嵌套路由</a>
      </li>
      <li>
        <a>四、了解路由驱动</a>
      </li>
    </ul>
  );
}
