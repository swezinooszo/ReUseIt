import { useEffect, useState } from 'react';
import { createSocket } from '../lib/socket';
import { Socket } from 'socket.io-client';
import { markAsRead } from '../utils/chatUtils';

interface Message {
  _id: string;
  chatId: string;
  senderId: string;
  message: string;
  createdAt: string;
}

export const useChatSocket = (token:string, listingId:string, receiverId:string, currentUserId: string, onNewMessage: (msg: Message) => void) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [chatId, setChatId] = useState<string | null>(null);

  // console.log('useChatSocket',` ** token=> ${token}  listingId=> ${listingId}  receiverId=> ${receiverId }  currentUserId => ${currentUserId} **`)
  console.log('useChatSocket')
  useEffect(() => {
    const newSocket = createSocket(token);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log(`useChatSocket`,`connect`)

      newSocket.emit('joinChat', { listingId, receiverId });

      newSocket.on('chatJoined', ({ chatId }) => {
        console.log(`useChatSocket`, `chatJoined ${chatId}`)
        setChatId(chatId);
      });
  
      newSocket.on('newMessage', async (msg: Message) => {
          console.log(`chatId ${msg.chatId} msg.senderId ${msg.senderId}`)
          // 👇 Call markAsRead after receiving a new message
          if (msg.chatId && currentUserId) {
            try {
              const success = await markAsRead(msg.chatId, currentUserId);
              if (!success) console.log('Failed to mark message as read');
            } catch (err) {
              console.log('Error in markAsRead:', err);
            }
          }
           onNewMessage(msg); 
      });
    });

    newSocket.on('connect_error', (err) => {
      console.log('Connection error:', err.message); // This is critical!
    });

    newSocket.on('error', (err) => {
      console.log('Socket error:', err.message);
    });

    return () => {
        newSocket.disconnect();
    }
  }, [token]);

  return { socket, chatId };
};
