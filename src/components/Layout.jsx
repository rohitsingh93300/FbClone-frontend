import React from 'react'
import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <div className='flex justify-between'>
      <Sidebar/>
      <div>
        <Outlet/>
      </div>
    </div>
  )
}

export default Layout
