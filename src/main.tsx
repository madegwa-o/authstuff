import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

// Update your router configuration to include the login and register routes

import { createBrowserRouter, RouterProvider} from 'react-router-dom';
import BaseLayout from "./BaseLayout.tsx";
import HomePage from "./pages/home/homePage.tsx";
import Settings from "./pages/settings.tsx";
import Maps from "./pages/mockMap/Maps.tsx";
import Login from "./pages/login/login.tsx";
import Register from "./pages/register/register.tsx";
import {AuthenticationProvider} from "./hooks/AuthenticationContext.tsx";

// Create router with layout wrappers for each route
const router = createBrowserRouter([
    {
        path: '/',
        element: <BaseLayout />,
        children: [
            {
                path: '/',
                element: <HomePage />,
            },
            {
                path: '/communities/:communityName',
                element: <HomePage />,
            },
            {
                path: '/settings',
                element: <Settings />,
            },
            {
                path: '/maps/',
                element: <Maps />,
            },
        ]
    },
    // Login and Register routes outside of the BaseLayout
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/register',
        element: <Register />,
    },
]);



createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <AuthenticationProvider>
          <RouterProvider router={router} />
      </AuthenticationProvider>
  </StrictMode>,
)
