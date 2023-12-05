import "./MockBrowser";
import { createElement } from "react";
import { strictEqual } from "assert";
import { before, describe, it } from "node:test";
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
  const mountNode = document.getElementById("root")!;

  before(() => {
    location.href = "/a";
    return new Promise<void>((resolve) => {
      const root = createRoot(mountNode);
      root.render(<TestApp onReady={resolve} />);
    });
  });

  it("render", async () => {
    strictEqual(mountNode.textContent?.trim(), "a");
  });
});
