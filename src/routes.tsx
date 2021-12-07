import React, { lazy, useEffect } from "react";
import { RouteConfig, RouteConfigComponentProps } from "react-router-config";
import withSuspense from "./helpers/hoc/withSuspence";
import { Redirect, useHistory } from "react-router-dom";
import { useAppSelector } from "./store";

const MainPage = withSuspense(lazy(() => import("./pages/Main")));
const AdminPage = withSuspense(lazy(() => import("./pages/Admin")));

const adminGuard =
  (Component: (props: RouteConfigComponentProps) => JSX.Element) =>
  (props: RouteConfigComponentProps) => {
    const isAdmin = useAppSelector((state) => state.race.isAdmin);
    const history = useHistory();
    useEffect(() => {
      if (!isAdmin) {
        history.push("/");
      }
    }, [isAdmin, history]);

    return <Component {...props} />;
  };

export const routes: RouteConfig[] = [
  {
    path: "/",
    exact: true,
    component: MainPage,
  },
  {
    path: "/admin",
    exact: true,
    component: adminGuard(AdminPage),
  },
  {
    component: (): React.ReactElement => <Redirect from="*" exact to="/" />,
  },
];
