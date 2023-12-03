import React from "react";
import { useNavigator } from "../src";

export function Header() {
  const nav = useNavigator();
  return (
    <div className="navbar bg-base-100 bg-opacity-75 shadow sticky top-0 backdrop-blur">
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
            <li>
              <input
                type="radio"
                name="theme-dropdown"
                className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                aria-label="Dark"
                value="night"
              />
            </li>
            <li>
              <input
                type="radio"
                name="theme-dropdown"
                className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                aria-label="Light"
                value="winter"
              />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
