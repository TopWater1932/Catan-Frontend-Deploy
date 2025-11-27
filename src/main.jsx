import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './styles/index.css'
import Game from './Game.jsx'
import LandingPage from './LandingPage.jsx'
import OptionsPage from './OptionsPage.jsx'

const router = createBrowserRouter([
  {path:"/",element:<LandingPage />},
  {path:"/setup",element:<OptionsPage />},
  {path:"/game",element:<Game />}
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>
)
