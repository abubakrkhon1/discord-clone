import NavigationSidebar from '@/components/navigation/navigation-sidebar'
import React from 'react'

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='h-full'>
            <div className='xs:hidden md:flex h-screen w-[72px] z-30 flex-col fixed inset-y-0'>
                <NavigationSidebar/>
            </div>
            <main className='md:pl-[72px] h-screen'>
                {children}
            </main>
        </div>
    )
}

export default MainLayout