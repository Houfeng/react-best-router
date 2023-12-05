import "./env/MockBrowser";
import { createElement } from "react";
import { strictEqual } from "assert";
import { beforeEach, describe, it } from "node:test";
import { Route, Router, useMemoryDriver, createNavigatorRef } from "../src";
import { createRoot } from "react-dom/client";
import { useEffect } from "react";
import { sleep } from "./env/TestHelper";

const nav = createNavigatorRef();

function TestApp({ onReady }: { onReady: () => void }) {
  const driver = useMemoryDriver();
  useEffect(() => onReady(), [onReady]);
  return (
    <Router driver={driver} navigator={nav}>
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
  const root = createRoot(mountNode);

  beforeEach(() => {
    mountNode.innerHTML = "";
    return new Promise<void>((resolve) => {
      root.render(<TestApp onReady={resolve} />);
    });
  });

  it("render", async () => {
    strictEqual(mountNode.textContent?.trim(), "");
  });

  it("push & back & forward", async () => {
    nav.current?.push("/a");
    await sleep(300);
    strictEqual(mountNode.textContent?.trim(), "a");
    nav.current?.push("/b");
    await sleep(300);
    strictEqual(mountNode.textContent?.trim(), "b");
    nav.current?.back();
    await sleep(300);
    strictEqual(mountNode.textContent?.trim(), "a");
    nav.current?.forward();
    await sleep(300);
    strictEqual(mountNode.textContent?.trim(), "b");
  });
});
