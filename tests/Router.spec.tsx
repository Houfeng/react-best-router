import "./MockBrowser";
import { createElement } from "react";
import { strictEqual } from "assert";
import { describe, it } from "node:test";
import { Route, Router, createBrowserDriver } from "../src";
import { createRoot } from "react-dom/client";
import { useEffect } from "react";

const driver = createBrowserDriver();

function TestApp({ onReady }: { onReady: () => void }) {
  useEffect(() => onReady(), [onReady]);
  return (
    <Router driver={driver}>
      <Route pattern="/a">
        <span>a</span>
      </Route>
      <Route pattern="/b">
        <span>b</span>
      </Route>
    </Router>
  );
}

describe("Router", () => {
  it('render', async () => {
    location.href = "/a";
    await new Promise<void>((resolve) => {
      const root = createRoot(document.getElementById("root")!);
      root.render(<TestApp onReady={resolve} />);
    });
    strictEqual(document.body.textContent?.trim(), "a");
  })
});
