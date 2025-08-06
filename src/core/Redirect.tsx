import { createElement, Fragment, useEffect } from "react";
import { Route, RouteProps } from "./Route";
import { useNavigator } from "./RouterNavigator";

export type RedirectProps = Pick<RouteProps, "pattern"> & {
  to: string;
};

function RedirectInner(props: RedirectProps) {
  const nav = useNavigator();
  const { to } = props;
  useEffect(() => nav.push(to));
  return <Fragment />;
}

export function Redirect(props: RedirectProps) {
  const { pattern = "/(.*)?" } = props;
  return (
    <Route pattern={pattern}>
      <RedirectInner {...props} />
    </Route>
  );
}
