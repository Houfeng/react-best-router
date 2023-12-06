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
    <Router driver={driver} navigator={nav} fallback={<span>f</span>}>
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
    return new Promise<void>((resolve) => {
      root.render(<TestApp onReady={resolve} />);
    });
  });

  it("render", async () => {
    strictEqual(mountNode.textContent?.trim(), "f");
  });

  it("push & back & forward", async () => {
    nav.current?.push("/a");
    await sleep(100);
    strictEqual(mountNode.textContent?.trim(), "a");
    nav.current?.push("/b");
    await sleep(100);
    strictEqual(mountNode.textContent?.trim(), "b");
    nav.current?.back();
    await sleep(100);
    strictEqual(mountNode.textContent?.trim(), "a");
    nav.current?.forward();
    await sleep(100);
    strictEqual(mountNode.textContent?.trim(), "b");
    nav.current?.go(-1);
    await sleep(100);
    strictEqual(mountNode.textContent?.trim(), "a");
    nav.current?.replace("../b");
    await sleep(100);
    strictEqual(mountNode.textContent?.trim(), "b");
  });

  it("fallback", async () => {
    nav.current?.push("/none");
    await sleep(100);
    strictEqual(mountNode.textContent?.trim(), "f");
  });
});
