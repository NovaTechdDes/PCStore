import { createBrowserRouter } from 'react-router-dom';
import { RootLayout } from '../layouts';
import { NotFound, Productos, Marcas, Categoria, Proveedor, Ventas } from '../pages/index';

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
        path: 'productos',
        element: <Productos />,
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
