import React from "react";
import { createRoot } from "react-dom/client";
import { Router } from "./Router";
import { useBrowserDriver } from "./BrowserDriver";
import { Route } from "./Route";

function App() {
  const driver = useBrowserDriver();
  return (
    <div>
      <Router driver={driver}>
        <div>test</div>
        <Route pattern="/a/(.*)">
          <div>ha ha</div>
        </Route>
      </Router>
    </div>
  )
}

const root = createRoot(document.getElementById("root")!);
root.render(<App />)
