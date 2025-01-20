import React, { useEffect, useMemo } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import RootLayout from './layouts/RootLayout'
import Dashboard from './pages/Dashboard/Dashboard'
import { useDispatch, useSelector } from 'react-redux'
import { getError, getPending, getUserInfo } from './toolkits/UserSlicer'
import Axios from "./Axios"
import { Error } from './pages/Error/Error'
import { Login } from './pages/Auth/Login'
import { Loading } from './pages/Loading/Loading'
import { Admins } from './pages/Admins/Admins'
import { CreateAdmin } from './pages/Admins/CreateAdmin'
import { Products } from './pages/Products/Products'
import { AddProduct } from './pages/Products/AddProduct'
const App: React.FC = () => {
  const dispatch = useDispatch();
  const { isPending, isAuth } = useSelector((state: { user: { isAuth: boolean, isPending: boolean } }) => state.user)
  useEffect(() => {
    async function getMyData() {
      try {
        dispatch(getPending());
        const response = (await Axios.get("admin/me")).data;

        if (response.data) {
          dispatch(getUserInfo(response.data));
        } else {
          dispatch(getError("No user data available"));
        }
      } catch (error: any) {
        dispatch(getError(error.response?.data || "Unknown Token"));
      }
    }
    getMyData();
  }, [dispatch]);

  const router = useMemo(() => {
    if (isPending) {
      return createBrowserRouter([
        {
          path: "/",
          element: <Loading />,
        },
      ]);
    }

    if (isAuth) {
      return createBrowserRouter([
        {
          path: "/",
          element: <RootLayout />,
          children: [
            {
              index: true,
              element: <Dashboard />,
            },
            {
              path: "/admins",
              element: <Admins />,
            },
            {
              path: "/games",
              element: <Products />,
            },
            {
              path: "/create-admin",
              element: <CreateAdmin />,
            },
            {
              path: "/create-product",
              element: <AddProduct />,
            },
            {
              path: "*",
              element: <Error />,
            },
          ],
        },
      ]);
    }

    return createBrowserRouter([
      {
        path: "/",
        element: <Login />,
      },
      {
        path: "*",
        element: <Error />,
      }
    ]);
  }, [isPending, isAuth]);
  return <RouterProvider router={router} />
}

export default App