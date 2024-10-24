import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import RootLayout from "./components/RootLayout";
import Register from "./pages/Register";
import Forum from "./pages/Forum";
import EditCourseForm from "./components/EditCourseForm";

// Define routes
const routes = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "courses",
        element: <Courses />,
      },
      {
        path: "/courses/:id",
        element: <EditCourseForm />,
      },
      {
        path: "forum",
        element: <Forum />,
      },

      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "register",
    element: <Register />,
  },
]);

export default routes;
