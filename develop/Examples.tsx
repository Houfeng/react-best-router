import { Fragment, createElement } from "react";
import { Route } from "../src";

function A() {
  return <Fragment />;
}

function B() {
  return <Fragment />;
}

export function Examples() {
  return (
    <div>
      <Route pattern="/a">a</Route>
      <Route pattern="/b">b</Route>
      <A />
      <B />
    </div>
  );
}
