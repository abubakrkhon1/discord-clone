'use client'
import React, { useEffect } from 'react'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import ActionTooltip from '../action-tooltip'

interface NavigationItemProps {
    id: string;
    imageUrl: string;
    name: string;
}

const NavigationItem = ({ id, imageUrl, name }: NavigationItemProps) => {

    const params = useParams();
    const router = useRouter();

    useEffect(() => {
        // Prefetch the server page data
        console.log('Prefetching server page');
        router.prefetch(`/servers/${id}`);
    }, [router, id]);

    const onClick = () => {
        router.replace(`/servers/${id}`);
    }

    return (
        <ActionTooltip side='right' align='center' label={name}>
            <button
                onClick={onClick}
                className='group relative flex items-center'
            >
                <div className={cn(
                    "absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
                    params?.serverId !== id && "group-hover:h-[20px]",
                    params?.serverId === id ? "h-[36px]" : "h-[8px]",
                )}/>
                <div className={cn(
                    "relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden",
                    params?.serverId === id && "bg-primary/10 text-primary rounded-[16px]"
                )}>
                    <Image
                        fill
                        src={imageUrl}
                        alt="Channel"
                        sizes='48px 48px'
                    />
                </div>
            </button>
        </ActionTooltip>
    )
}

export default NavigationItem