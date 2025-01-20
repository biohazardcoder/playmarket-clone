import React from 'react'
const Header: React.FC = () => {
    return (
        <div className={`row-span-1 col-span-12 flex items-center justify-between px-4 bg-primary `}>
            <div className='flex items-center gap-2'>
                <img src="https://www.svgrepo.com/show/223032/playstore.svg" className='w-5' />
                <h1 className='font-semibold text-mainly'>
                    Play Market
                </h1>
            </div>
        </div>
    )
}

export default Header