'use client'
import React, { useState } from 'react'

import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import qs from "query-string"
import { useModal } from "@/hooks/use-modal-store"
import { Button } from '../ui/button'
import axios from 'axios'
import { DialogDescription } from '@radix-ui/react-dialog'
import { useRouter } from 'next/navigation'

export const DeleteChannelModal = () => {

    const { isOpen, onClose, type, data } = useModal();

    const router = useRouter();

    const isModalOpen = isOpen && type === "deleteChannel";
    const { server, channel } = data;

    const [isLoading, setIsLoading] = useState(false);

    const onClick = async () => {
        try {
            setIsLoading(true);
            const url = qs.stringifyUrl({
                url: `/api/channels/${channel?.id}`,
                query: {
                    serverId: server?.id
                }
            })

            await axios.delete(url);

            router.push(`/servers/${server?.id}`);
            router.refresh();
            onClose();
        } catch (error) {
            console.log(error);

        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className='bg-white text-black p-0 overflow-hidden'>
                <DialogHeader className='pt-8 px-6'>
                    <DialogTitle className='text-center text-2xl font-bold'>
                        Delete Channel
                    </DialogTitle>
                    <DialogDescription className='text-center text-zinc-500'>
                        Are you sure you want to do this? <br />
                        <span className='text-lg font-semibold text-rose-500'>#{channel?.name && channel.name.length >= 16 ? `${channel.name.substring(0, 15)}...` : channel?.name} will be permanently deleted</span>
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className='bg-gray-100 px-6 py-4'>
                    <div className='flex items-center justify-between w-full'>
                        <Button
                            disabled={isLoading}
                            onClick={onClose}
                            variant="ghost"
                        >
                            Cancel
                        </Button>
                        <Button
                            disabled={isLoading}
                            onClick={onClick}
                            variant="delete"
                        >
                            Confirm
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
