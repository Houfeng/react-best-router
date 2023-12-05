import "./MockBrowser";
import { strictEqual } from "assert";
import { test } from "node:test";
import { createMemoryDriver } from "../src";

const driver = createMemoryDriver();

test("MemoryDriver", () => {
  strictEqual(driver.current().pathname, "/");
  driver.push({ pathname: "/foo" });
  strictEqual(driver.current().pathname, "/foo");
  driver.push({ pathname: "/bar" });
  strictEqual(driver.current().pathname, "/bar");
  driver.back();
  strictEqual(driver.current().pathname, "/foo");
  driver.forward();
  strictEqual(driver.current().pathname, "/bar");
  driver.push({ pathname: "/abc" });
  driver.forward();
  strictEqual(driver.current().pathname, "/abc");
  driver.back();
  strictEqual(driver.current().pathname, "/bar");
});
