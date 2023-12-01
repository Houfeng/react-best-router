import React from "react";
import { createRoot } from "react-dom/client";
import { Router } from "./Router";
import { useBrowserDriver } from "./BrowserDriver";
import { Route } from "./Route";
import { useNavigator, useNavigatorRef } from "./RouterNavigator";

function Page() {
  const { params } = useNavigator<{ id: string }>();
  return <div>Page {params.id}</div>;
}

function NotFound() {
  return <div>404</div>;
}

function App() {
  const driver = useBrowserDriver();
  const nav = useNavigatorRef();
  return (
    <div>
      <Router driver={driver} navigator={nav}>
        <ul>
          <li>
            <a onClick={() => nav.current?.push("/page/1")}>page1</a>
          </li>
          <li>
            <a onClick={() => nav.current?.push("/page/2")}>page2</a>
          </li>
        </ul>
        <Route pattern="/page/:id">
          <Page />
        </Route>
        <Route pattern="/(.*)">
          <NotFound />
        </Route>
      </Router>
    </div>
  );
}

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
