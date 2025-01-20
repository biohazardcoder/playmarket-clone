import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../components/Header/Header'
import { Sidebar } from '../components/Sidebar/Sidebar'

const RootLayout: React.FC = () => {
    return (
        <div className='w-screen h-screen overflow-hidden grid grid-cols-12 grid-rows-12'>
            <Header />
            <Sidebar />
            <Outlet />
        </div>
    )
}

export default RootLayout