import React from "react";
import { Header, Sidebar } from "components/Common";
import styles from "./Layout.module.scss";
import classNames from "classnames";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className={classNames(styles.layout, "u-screenHeightFull")}>
      <Header />
      {children}
      <Sidebar />
    </div>
  );
};

export default Layout;