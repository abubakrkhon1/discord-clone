import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db';

import { redirect } from 'next/navigation';
import React from 'react'

import NavigationAction from './navigation-action';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import NavigationItem from './navigation-item';
import { ModeToggle } from '../mode-toggle';
import { UserButton } from '@clerk/nextjs';

const NavigationSidebar = async () => {
    const profile = await currentProfile();
    if(!profile) return redirect("/");

    const servers = await db.server.findMany({
        where:{
            members:{
                some:{
                    profileId: profile.id
                }
            }
        }
    })

    return (
        <div className='flex flex-col h-full text-primary w-full bg-[#e3e5e8] dark:bg-[#201c24] py-3'>

            <div className="space-y-4 flex flex-col items-center">
                <NavigationAction />
                <Separator className='h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto' />
            </div>
            
            <ScrollArea className="flex-grow my-4">
                {servers.map((server) => (
                    <div key={server.id} className='mb-4'>
                        <NavigationItem
                            id={server.id}
                            name={server.name}
                            imageUrl={server.imageUrl}
                        />
                    </div>
                ))}
            </ScrollArea>
    
            <div className='flex flex-col items-center gap-y-4 pb-3 mt-auto'>
                <ModeToggle />
                <UserButton
                    afterSignOutUrl='/'
                    appearance={{
                        elements: {
                            avatarBox: "h-[48px] w-[48px]"
                        }
                    }}
                />
            </div>
        </div>
    )
    
}

export default NavigationSidebar