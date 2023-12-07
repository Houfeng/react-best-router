import { createElement } from "react";
import { useNavigator } from "../src";
import { contents } from "./docs";

function scrollToTop() {
  document.documentElement.scrollTop = 0;
}

export function SideBar() {
  const nav = useNavigator();
  return (
    <ul
      onClick={() => document.getElementById("drawer-switch")?.click()}
      className="menu p-3 w-60 bg-base-200 bg-opacity-75 glass h-full pt-16 text-base-content"
    >
      {contents.map((it) => (
        <li key={it.name} className="text-sm">
          <a
            className="p-3"
            onClick={() => [nav.push(`/${it.name}`), scrollToTop()]}
          >
            {it.title}
          </a>
        </li>
      ))}
    </ul>
  );
}
