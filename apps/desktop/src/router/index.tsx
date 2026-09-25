import { createBrowserRouter } from 'react-router-dom';
import { RootLayout } from '../layouts';
import { NotFound, Productos, Marcas, Categoria, Proveedor, Ventas, Clientes, Cajas, Dolar } from '../pages/index';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Ventas />,
      },
      {
        path: 'ventas',
        element: <Ventas />,
      },
      {
        path: 'clientes',
        element: <Clientes />,
      },
      {
        path: 'productos',
        element: <Productos />,
      },
      {
        path: 'cajas',
        element: <Cajas />,
      },
      {
        path: 'dolar',
        element: <Dolar />,
      },
      {
        path: 'marcas',
        element: <Marcas />,
      },
      {
        path: 'categorias',
        element: <Categoria />,
      },
      {
        path: 'proveedores',
        element: <Proveedor />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);
