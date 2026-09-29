import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Message, UserProfile } from '../types';
import { FirestoreService } from '../services/firestoreService';
import { NotificationService } from '../services/notificationService';
import { useAuth } from './AuthContext';

interface ChatContextType {
  messages: { [conversationId: string]: Message[] };
  isTyping: { [conversationId: string]: boolean };
  loadConversationMessages: (conversationId: string) => Promise<void>;
  sendMessage: (conversationId: string, receiverId: string, text: string, mediaUrl?: string) => Promise<void>;
  markAsRead: (conversationId: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<{ [conversationId: string]: Message[] }>({});
  const [isTyping, setIsTyping] = useState<{ [conversationId: string]: boolean }>({});

  const loadConversationMessages = async (conversationId: string) => {
    if (messages[conversationId]) return;
    try {
      const msgs = await FirestoreService.getMessages(conversationId);
      setMessages((prev) => ({ ...prev, [conversationId]: msgs }));
    } catch (e) {
      console.error('Error loading conversation:', e);
    }
  };

  const markAsRead = (conversationId: string) => {
    setMessages((prev) => {
      const list = prev[conversationId];
      if (!list) return prev;
      return {
        ...prev,
        [conversationId]: list.map((m) => (m.receiverId === user?.id ? { ...m, isRead: true } : m)),
      };
    });
  };

  const sendMessage = async (
    conversationId: string,
    receiverId: string,
    text: string,
    mediaUrl?: string
  ) => {
    if (!user || (!text.trim() && !mediaUrl)) return;

    const newMessage = await FirestoreService.sendMessage({
      conversationId,
      senderId: user.id,
      receiverId,
      text: text.trim(),
      mediaUrl,
      mediaType: mediaUrl ? 'image' : undefined,
      isRead: false,
    });

    setMessages((prev) => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMessage],
    }));

    // Simulate smart Indori reply after 2.5 seconds for interactive experience
    setTimeout(() => {
      setIsTyping((prev) => ({ ...prev, [conversationId]: true }));

      setTimeout(() => {
        setIsTyping((prev) => ({ ...prev, [conversationId]: false }));

        const replies = [
          'Sahi hai! We definitely need to meet at Chappan Dukan this weekend 🥨',
          'Haha totally agree! Indore vibes are unmatched ✨',
          'That sounds amazing! Are you free for coffee in Vijay Nagar tomorrow evening?',
          'Bhutte ka kees is the real deal! Let’s plan it soon 🌸',
        ];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];

        const replyMessage: Message = {
          id: `msg_reply_${Date.now()}`,
          conversationId,
          senderId: receiverId,
          receiverId: user.id,
          text: randomReply,
          timestamp: new Date().toISOString(),
          isRead: false,
          isDelivered: true,
        };

        setMessages((prev) => ({
          ...prev,
          [conversationId]: [...(prev[conversationId] || []), replyMessage],
        }));

        NotificationService.notify({
          userId: user.id,
          type: 'message',
          title: 'New Message 💬',
          body: randomReply,
          data: { conversationId },
        });
      }, 2000);
    }, 1000);
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        isTyping,
        loadConversationMessages,
        sendMessage,
        markAsRead,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
