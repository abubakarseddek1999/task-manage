import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/Main";
import { Home } from "../Pages";
import NotFound from "../Pages/Errorpage/NotFound";


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
      ],
    },
  ]);