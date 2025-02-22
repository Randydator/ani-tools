import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import 'bootstrap/dist/css/bootstrap.min.css'
import './theme.css'
import './main.css';

import Header from "./components/Header/Header";

import Home from "./components/Home/Home";
import AniLike from "./components/AniLike/AniLike";
import NotFoundPage from "./components/NotFoundPage/NotFoundPage";
import ActivitySearch from './components/ActivitySearch/ActivitySearch'
import OauthCallback from './components/oauthCallback/OauthCallback'


const queryClient = new QueryClient();

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Header />}>
      <Route index element={<Home />} />
      <Route path="AniLike" element={<AniLike />} />
      <Route path="*" element={<NotFoundPage />} />
      <Route path="ActivitySearch" element={<ActivitySearch />} />
      <Route path="oauthCallback" element={<OauthCallback />} />
    </Route>
  )
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools />
    </QueryClientProvider>
  </StrictMode>,
)