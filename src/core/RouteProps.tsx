import { ReactNode } from "react";
import { RouterPattern } from "./RouterMatcher";
import { RouterNavigatorRef } from "./RouterNavigator";

export type RouteProps = {
  pattern: RouterPattern;
  children?: ReactNode;
  render?: (children: ReactNode) => ReactNode;
  prefix?: RouterPattern;
  navigator?: RouterNavigatorRef<any>;
  fallback?: ReactNode;
};
