/* eslint-disable no-unused-vars */
import React from 'react';
import Layout from './Layout';
import Products from './Products';
import Clients from './Clients';
import OrderForm from './OrderForm';
import Orders from './Orders';
import OrderDetails from './OrderDetails';
import HomePage from './HomePage';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/produkty',
        element: <Products />,
      },
      {
        path: '/klienci',
        element: <Clients />,
      },
      {
        path: '/formularz',
        element: <OrderForm />,
      },
      {
        path: '/zamówienia',
        element: <Orders />,
      },
      {
        path: '/zamówienie/:id',
        element: <OrderDetails />,
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
