'use client'
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSocket } from "@/components/providers/socket-provider";
import { Member, Message, Profile } from "@prisma/client";

type ChatSocketProps = {
  addKey: string; // Event name for new messages
  updateKey: string; // Event name for message updates
  queryKey: string; // Query key used for caching chat data
};

type MessageWithMemberWithProfile = Message & {
  member: Member & {
    profile: Profile;
  };
};

export const useChatSocket = ({
  addKey,
  updateKey,
  queryKey,
}: ChatSocketProps) => {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) {
      console.error("Socket is not initialized.");
      return;
    }

    // Handle new messages
    socket.on(addKey, (newMessage: MessageWithMemberWithProfile) => {
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          // If no data exists, initialize it with the new message
          return {
            pages: [
              {
                items: [newMessage],
              },
            ],
          };
        }

        // Add the new message to the first page
        const updatedData = [...oldData.pages];
        updatedData[0] = {
          ...updatedData[0],
          items: [newMessage, ...updatedData[0].items],
        };

        return {
          ...oldData,
          pages: updatedData,
        };
      });
    });

    // Handle updated messages
    socket.on(updateKey, (updatedMessage: MessageWithMemberWithProfile) => {
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          console.warn("No data found for queryKey:", queryKey);
          return oldData;
        }

        const updatedPages = oldData.pages.map((page: any) => {
          return {
            ...page,
            items: page.items.map((item: MessageWithMemberWithProfile) =>
              item.id === updatedMessage.id ? updatedMessage : item
            ),
          };
        });

        return {
          ...oldData,
          pages: updatedPages,
        };
      });
    });

    // Cleanup listeners on unmount
    return () => {
      socket.off(addKey);
      socket.off(updateKey);
    };
  }, [socket, addKey, updateKey, queryKey, queryClient]);
};