import React, { Fragment } from "react";
import { createRoot } from "react-dom/client";
import {
  Router,
  useBrowserDriver,
  Route,
  useNavigator,
  useNavigatorRef,
} from "../src";
import "./index.css";

function Page() {
  const { params } = useNavigator<{ id: string }>();
  return <div>Page {params.id}</div>;
}

function App() {
  const driver = useBrowserDriver();
  const nav = useNavigatorRef();
  return (
    <Fragment>
      <Router driver={driver} navigator={nav}>
        <ul>
          <li>
            <button
              className="btn"
              onClick={() => nav.current?.push("/page/1")}
            >
              page1
            </button>
          </li>
          <li>
            <button
              className="btn"
              onClick={() => nav.current?.push("/page/2")}
            >
              page2
            </button>
          </li>
        </ul>
        <Route pattern="/page/:id/(.*)?">
          <Page />
        </Route>
      </Router>
    </Fragment>
  );
}

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
