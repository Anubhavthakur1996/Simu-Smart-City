import { createBrowserRouter } from "react-router";

import Splash from "../views/splash";
import Home from "../views/home";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Splash,
  },
  {
    path: "/home",
    Component: Home,
  },
]);

export default router;
