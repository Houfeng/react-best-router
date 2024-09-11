import "./index.css";
import { createElement } from "react";
import { createRoot } from "react-dom/client";
import { Route, Router, useBrowserDriver, useHashDriver, useNavigator } from "../src";
// import { Layout } from "./Layout";
// import { SideBar } from "./SideBar";
// import { Header } from "./Header";
// import { Footer } from "./Footer";
// import { Content } from "./Content";
// import { Examples } from "./Examples";
import { getLocalTheme } from "./LocalStore";

document.documentElement.setAttribute("data-theme", getLocalTheme());

function Channel() {
  const nav = useNavigator<{ id: number }>();
  return <div>
    Channel: {nav.params.id}
    <button type="button" onClick={() => nav.push('./materials/1')}>[ Go ]</button>
  </div>
}

function Material() {
  const nav = useNavigator<{ mid: number }>();
  return <div>
    material: {nav.params.mid}
    <button type="button" onClick={() => nav.back()}>[ Back ]</button>
  </div>
}

function RBRDocsAPP() {
  const driver = useBrowserDriver();
  return (
    <Router driver={driver}>
      {/* <Layout header={<Header />} footer={<Footer />} sideBar={<SideBar />}>
        <Route pattern="/:name?">
          <Content />
        </Route>
        <Route pattern="/examples/(.*)">
          <Examples />
        </Route> */}
      <Route pattern="/channels/:id/:rest*">
        <Channel />
        <Route pattern="/materials/:mid">
          <Material />
        </Route>
      </Route>
      {/* </Layout> */}
    </Router>
  );
}

const root = createRoot(document.getElementById("root")!);
root.render(<RBRDocsAPP />);
