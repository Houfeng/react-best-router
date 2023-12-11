import "./env/MockBrowser";
import { RefObject, createElement } from "react";
import { strictEqual } from "assert";
import { describe, it } from "node:test";
import { Route, Router, useMemoryDriver, createNavigatorRef, RouterNavigator } from "../src";
import { createRoot } from "react-dom/client";
import { useEffect } from "react";
import { sleep } from "./env/TestHelper";

const mountNode = document.getElementById("root")!;
const root = createRoot(mountNode);

type TestAppProps = {
  onReady?: () => void;
  pattern: string;
  content?: string;
  fallback?: string;
  navigator?: RefObject<RouterNavigator<any>>
}

function TestApp(props: TestAppProps) {
  const { onReady, pattern, content, fallback, navigator } = props;
  const driver = useMemoryDriver();
  useEffect(() => onReady?.(), [onReady]);
  return (
    <Router driver={driver}>
      <Route
        pattern={pattern}
        navigator={navigator}
        fallback={<span>{fallback}</span>}
      >
        <span>{content}</span>
      </Route>
    </Router>
  );
}

async function renderTestApp(props: TestAppProps) {
  const nav = createNavigatorRef<any>();
  await new Promise<void>((resolve) => {
    root.render(<TestApp {...props} onReady={resolve} navigator={nav} />);
  });
  return nav;
}

describe("Pattern", () => {

  it("Named params: get param value", async () => {
    const nav = await renderTestApp({
      pattern: "/foo/:bar",
      content: "f1",
      fallback: "f0",
    });
    nav.current?.push('/foo/abc');
    await sleep(100);
    strictEqual(mountNode.textContent?.trim(), "f1");
    strictEqual(nav.current?.params?.bar, "abc");
  });

  it("Named params: ?", async () => {
    const nav = await renderTestApp({
      pattern: "/foo/:bar?",
      content: "f1",
      fallback: "f0",
    });
    nav.current?.push('/foo/abc');
    await sleep(100);
    strictEqual(mountNode.textContent?.trim(), "f1");
    strictEqual(nav.current?.params?.bar, "abc");
    nav.current?.push('/foo');
    await sleep(100);
    strictEqual(mountNode.textContent?.trim(), "f1");
    strictEqual(nav.current?.params?.bar, "");
  });

  it("Named params: *", async () => {
    const nav = await renderTestApp({
      pattern: "/foo/:bar*",
      content: "f1",
      fallback: "f0",
    });
    nav.current?.push('/foo/abc');
    await sleep(100);
    strictEqual(mountNode.textContent?.trim(), "f1");
    strictEqual(nav.current?.params?.bar, "/abc");
    nav.current?.push('/foo');
    await sleep(100);
    strictEqual(mountNode.textContent?.trim(), "f1");
    strictEqual(nav.current?.params?.bar, "");
    nav.current?.push('/foo/abc/123');
    await sleep(100);
    strictEqual(mountNode.textContent?.trim(), "f1");
    strictEqual(nav.current?.params?.bar, "/abc/123");
  });

  it("Named params: +", async () => {
    const nav = await renderTestApp({
      pattern: "/foo/:bar+",
      content: "f1",
      fallback: "f0",
    });
    nav.current?.push('/foo/abc');
    await sleep(100);
    strictEqual(mountNode.textContent?.trim(), "f1");
    strictEqual(nav.current?.params?.bar, "/abc");
    nav.current?.push('/foo');
    await sleep(100);
    strictEqual(mountNode.textContent?.trim(), "f0");
    strictEqual(nav.current?.params?.bar, undefined);
    nav.current?.push('/foo/abc/123');
    await sleep(100);
    strictEqual(mountNode.textContent?.trim(), "f1");
    strictEqual(nav.current?.params?.bar, "/abc/123");
  });

  it("Named params: fallback", async () => {
    const nav = await renderTestApp({
      pattern: "/foo/:bar",
      content: "f1",
      fallback: "f0",
    });
    nav.current?.push('/foo');
    await sleep(100);
    strictEqual(mountNode.textContent?.trim(), "f0");
    nav.current?.push('/foo/bar/abc');
    await sleep(100);
    strictEqual(mountNode.textContent?.trim(), "f0");
  });

  //-----------------------------------------------------------------------

  it("Anonymous params: get param value", async () => {
    const nav = await renderTestApp({
      pattern: "/foo/(.*)",
      content: "f1",
      fallback: "f0",
    });
    nav.current?.push('/foo/abc');
    await sleep(100);
    strictEqual(mountNode.textContent?.trim(), "f1");
    strictEqual(nav.current?.params?.$1, "abc");
  });

  it("Anonymous params: ?", async () => {
    const nav = await renderTestApp({
      pattern: "/foo/(.*)?",
      content: "f1",
      fallback: "f0",
    });
    nav.current?.push('/foo/abc');
    await sleep(100);
    strictEqual(mountNode.textContent?.trim(), "f1");
    strictEqual(nav.current?.params?.$1, "abc");
    nav.current?.push('/foo');
    await sleep(100);
    strictEqual(mountNode.textContent?.trim(), "f1");
    strictEqual(nav.current?.params?.$1, "");
  });

  it("Anonymous params: *", async () => {
    const nav = await renderTestApp({
      pattern: "/foo/(.*)*",
      content: "f1",
      fallback: "f0",
    });
    nav.current?.push('/foo/abc');
    await sleep(100);
    strictEqual(mountNode.textContent?.trim(), "f1");
    strictEqual(nav.current?.params?.$1, "/abc");
    nav.current?.push('/foo');
    await sleep(100);
    strictEqual(mountNode.textContent?.trim(), "f1");
    strictEqual(nav.current?.params?.$1, "");
    nav.current?.push('/foo/abc/123');
    await sleep(100);
    strictEqual(mountNode.textContent?.trim(), "f1");
    strictEqual(nav.current?.params?.$1, "/abc/123");
  });

  it("Anonymous params: +", async () => {
    const nav = await renderTestApp({
      pattern: "/foo/(.*)+",
      content: "f1",
      fallback: "f0",
    });
    nav.current?.push('/foo/abc');
    await sleep(100);
    strictEqual(mountNode.textContent?.trim(), "f1");
    strictEqual(nav.current?.params?.$1, "/abc");
    //nav.current?.push('/foo');
    // await sleep(100);
    // strictEqual(mountNode.textContent?.trim(), "f0");
    // strictEqual(nav.current?.params?.$1, undefined);
    nav.current?.push('/foo/abc/123');
    await sleep(100);
    strictEqual(mountNode.textContent?.trim(), "f1");
    strictEqual(nav.current?.params?.$1, "/abc/123");
  });

});
