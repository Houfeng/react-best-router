import React from "react";
import { createRoot } from "react-dom/client";
import {
  Router,
  useMemoryDriver,
  Route,
  useNavigator,
  useNavigatorRef,
} from "../src";

function Page() {
  const { params } = useNavigator<{ id: string }>();
  return <div>Page {params.id}</div>;
}

function NotFound() {
  return <div>404</div>;
}

function App() {
  const driver = useMemoryDriver();
  const nav = useNavigatorRef();
  return (
    <div>
      <Router driver={driver} navigator={nav}>
        <ul>
          <li>
            <button onClick={() => nav.current?.push("/page/1")}>page1</button>
          </li>
          <li>
            <button onClick={() => nav.current?.push("/page/2")}>page2</button>
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
