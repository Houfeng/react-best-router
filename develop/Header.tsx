import { createElement } from "react";
import { useNavigator } from "../src";
import { setLocalLanguage, setLocalTheme } from "./LocalStore";

export function Header() {
  const nav = useNavigator();
  return (
    <div className="navbar bg-base-100 bg-opacity-75 shadow-sm sticky top-0 backdrop-blur">
      <div className="flex-none">
        <label
          htmlFor="drawer-switch"
          className="btn btn-square btn-ghost lg:hidden"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block w-5 h-5 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </label>
      </div>
      <div className="flex-1">
        <a
          className="btn btn-ghost text-xl font-bold"
          onClick={() => nav.push("/")}
        >
          RBR
        </a>
      </div>
      <div className="flex-none">
        <div className="dropdown dropdown-end">
          <button
            id="theme-button"
            tabIndex={0}
            className="btn btn-square btn-ghost"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block w-5 h-5 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
              ></path>
            </svg>
          </button>
          <ul
            onClick={() => (document.activeElement as HTMLElement)?.blur?.()}
            className="dropdown-content z-[1] menu p-2 shadow-lg bg-base-200 rounded-box w-52"
          >
            <li className="disabled pointer-events-none p-0 my-1 h-[auto]">
              <div className="divider m-0 p-0 ml-[-6px]">Language</div>
            </li>
            <li className="my-[2px]">
              <input
                type="radio"
                name="language-dropdown"
                className="btn btn-sm btn-block btn-ghost justify-start h-10 py-3"
                aria-label="English"
                value="en"
                onClick={() => setLocalLanguage("en")}
              />
            </li>
            <li className="my-[2px]">
              <input
                type="radio"
                name="language-dropdown"
                className="btn btn-sm btn-block btn-ghost justify-start h-10 py-3"
                aria-label="简体中文"
                value="zh"
                onClick={() => setLocalLanguage("zh")}
              />
            </li>
            <li className="disabled pointer-events-none p-0 my-1 h-[auto]">
              <div className="divider m-0 p-0 ml-[-6px]">Theme</div>
            </li>
            <li className="my-[2px]">
              <input
                type="radio"
                name="theme-dropdown"
                className="theme-controller btn btn-sm btn-block btn-ghost justify-start h-10 py-3"
                aria-label="Dark"
                value="night"
                onClick={() => setLocalTheme("night")}
              />
            </li>
            <li className="my-[2px]">
              <input
                type="radio"
                name="theme-dropdown"
                className="theme-controller btn btn-sm btn-block btn-ghost justify-start h-10 py-3"
                aria-label="Light"
                value="winter"
                onClick={() => setLocalTheme("winter")}
              />
            </li>
            <li className="my-[2px]">
              <input
                type="radio"
                name="theme-dropdown"
                className="theme-controller btn btn-sm btn-block btn-ghost justify-start h-10 py-3"
                aria-label="Coffee"
                value="coffee"
                onClick={() => setLocalTheme("coffee")}
              />
            </li>
            <li className="my-[2px]">
              <input
                type="radio"
                name="theme-dropdown"
                className="theme-controller btn btn-sm btn-block btn-ghost justify-start h-10 py-3"
                aria-label="Retro"
                value="retro"
                onClick={() => setLocalTheme("retro")}
              />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
