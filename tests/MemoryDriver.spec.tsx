import "./MockBrowser";
import { strictEqual } from "assert";
import { describe, it } from "node:test";
import { createMemoryDriver } from "../src";

const driver = createMemoryDriver();

describe('MemoryDriver', () => {
  it("push & back & forward", () => {
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
})

