import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Home from './pages/Home'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import Friends from './pages/Friends'
import Profile from './pages/Profile'
import Navbar from './components/Navbar'
import PostPage from './pages/PostPage'
import AboutPage from './pages/AboutPage'
import FriendsPage from './pages/FriendsPage'
import PhotosPage from './pages/PhotosPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoute><Layout /></ProtectedRoute>,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: 'friends',
        element: <><Navbar/><Friends /></>
      },
    ]
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <Signup />
  },
  {
    path: '/profile/:id',
    element: <ProtectedRoute>
      <Navbar />
      <Profile />
    </ProtectedRoute>,
    children:[
      {
        path:'post',
        element: <PostPage/>
      },
      {
        path:'about',
        element: <AboutPage/>
      },
      {
        path:'friends',
        element: <FriendsPage/>
      },
      {
        path:'photos',
        element: <PhotosPage/>
      },
    ]
  },

])

const App = () => {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  )
}

export default App
