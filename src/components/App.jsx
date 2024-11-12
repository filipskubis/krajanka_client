/* eslint-disable no-unused-vars */
import React from "react";
import Layout from "./Layout";
import Products from "./Products";
import Clients from "./Clients";
import OrderForm from "./OrderForm";
import Orders from "./Orders";
import OrderDetails from "./OrderDetails";
import HomePage from "./HomePage";
import LoginPage from "./LoginPage";
import ProtectedRoute from "./ProtectedRoute";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "../misc/AuthContext";
import Alerts from "./Alerts";
import UndefinedPage from "./UndefinedPage";
import Routes from "./Routes";
import RouteForm from "./RouteForm";
import RouteDetails from "./RouteDetails";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/produkty",
        element: <Products />,
      },
      {
        path: "/klienci",
        element: <Clients />,
      },
      {
        path: "/formularzZamówienia",
        element: <OrderForm />,
      },
      {
        path: "/zamówienia",
        element: <Orders />,
      },
      {
        path: "/zamówienie/:id",
        element: <OrderDetails />,
      },
      {
        path: "/trasy",
        element: <Routes />,
      },
      {
        path: "/trasa/:id",
        element: <RouteDetails />,
      },
      {
        path: "/formularzTrasy",
        element: <RouteForm />,
      },
    ],
  },
  { path: "*", element: <UndefinedPage /> },
]);

export default function App() {
  return (
    <AuthProvider>
      <Alerts />
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
