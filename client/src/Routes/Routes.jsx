import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/Main";

import NotFound from "../Pages/Errorpage/NotFound";
import SignUp from "../Pages/signup/SignUp";
import Login from "../Pages/login/login";
import Home from "../Pages/Home/Home";


export const router = createBrowserRouter([
    {
      path: "/",
      element: <Main/>,
      errorElement: <NotFound/>,
      children: [
        {
          path: "/",
          element: <Home/>,
        },
        {
          path: "/about",
          element: <div>About</div>,
        },
        {
          path: "/signup",
          element: <SignUp/>,
        },
        {
          path: "/login",
          element: <Login/>,
        },
      ],
    },
  ]);