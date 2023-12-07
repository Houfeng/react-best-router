import "./index.css";
import { createElement } from "react";
import { createRoot } from "react-dom/client";
import { Route, Router, useHashDriver } from "../src";
import { Layout } from "./Layout";
import { SideBar } from "./SideBar";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Content } from "./Content";
import { Examples } from "./Examples";
import { getLocalTheme } from "./LocalStore";

document.documentElement.setAttribute("data-theme", getLocalTheme());

function RBRDocsAPP() {
  const driver = useHashDriver();
  return (
    <Router driver={driver}>
      <Layout header={<Header />} footer={<Footer />} sideBar={<SideBar />}>
        <Route pattern="/:name?">
          <Content />
        </Route>
        <Route pattern="/examples/(.*)">
          <Examples />
        </Route>
      </Layout>
    </Router>
  );
}

const root = createRoot(document.getElementById("root")!);
root.render(<RBRDocsAPP />);
