import React, { Fragment, ReactNode } from "react";

export type LayoutProps = {
  children: ReactNode;
  header: ReactNode;
  footer: ReactNode;
  sideBar: ReactNode;
};

export function Layout({ children, sideBar, header, footer }: LayoutProps) {
  return (
    <Fragment>
      <div className="drawer lg:drawer-open">
        <input id="drawer-switch" type="checkbox" className="drawer-toggle" />
        <div className="drawer-side z-20">
          <label htmlFor="drawer-switch" className="drawer-overlay"></label>
          {sideBar}
        </div>
        <div className="drawer-content flex flex-col items-center justify-center">
          {header}
          <main className="min-h-screen">{children}</main>
          {footer}
        </div>
      </div>
    </Fragment>
  );
}
