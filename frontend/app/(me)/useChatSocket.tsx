import { useEffect, useState } from 'react';
import { createSocket } from '../lib/socket';
import { Socket } from 'socket.io-client';
import api from '../utils/api';

interface Message {
  _id: string;
  chatId: string;
  senderId: string;
  message: string;
  createdAt: string;
}

export const useChatSocket = (token:string, listingId:string, receiverId:string, onNewMessage: (msg: Message) => void) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [chatId, setChatId] = useState<string | null>(null);

  useEffect(() => {
    const newSocket = createSocket(token);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      newSocket.emit('joinChat', { listingId, receiverId });
      newSocket.on('chatJoined', ({ chatId }) => {
        setChatId(chatId);
      });
  
      newSocket.on('newMessage', (msg: Message) => {
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
