import { createElement, Fragment, useEffect } from "react";
import { useNavigator } from "./RouterNavigator";

export type RouteRedirectProps = {
  to: string;
};

export function RouteRedirect(props: RouteRedirectProps) {
  const nav = useNavigator();
  const { to } = props;
  useEffect(() => nav.push(to), [nav, to]);
  return <Fragment />;
}
