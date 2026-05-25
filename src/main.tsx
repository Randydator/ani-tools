//import { StrictMode } from 'react'
import { lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import 'bootstrap/dist/css/bootstrap.min.css'
import './theme.css'
import './main.css';

import Header from "./components/Header/Header";

const Home = lazy(() => import("./components/Home/Home"));
const AniLike = lazy(() => import("./components/AniLike/AniLike"));
const NotFoundPage = lazy(() => import("./components/NotFoundPage/NotFoundPage"));
const ActivitySearch = lazy(() => import('./components/ActivitySearch/ActivitySearch'));
const OauthCallback = lazy(() => import('./components/oauthCallback/OauthCallback'));
const ActivityCreator = lazy(() => import('./components/ActivityCreator/ActivityCreator'));


const queryClient = new QueryClient();

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Header />}>
      <Route index element={<Home />} />
      <Route path="AniLike" element={<AniLike />} />
      <Route path="ActivitySearch" element={<ActivitySearch />} />
      <Route path="oauthCallback" element={<OauthCallback />} />
      <Route path="ActivityCreator" element={<ActivityCreator />} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  )
)

createRoot(document.getElementById('root')!).render(
  //<StrictMode>
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
    <ReactQueryDevtools />
  </QueryClientProvider>
  //</StrictMode>,
)