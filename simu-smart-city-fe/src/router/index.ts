import React from "react";
import { createBrowserRouter } from "react-router";

import Splash from "../views/splash";
import Home from "../views/home";
import ErrorBoundary from "../views/Error/ErrorBoundary";

const router = createBrowserRouter([
  {
    path: "/",
    element: React.createElement(ErrorBoundary, {
      children: React.createElement(Splash),
    }),
  },
  {
    path: "/home",
    // Component: Home,
    element: React.createElement(ErrorBoundary, {
      children: React.createElement(Home),
    }),
  },
]);

export default router;
