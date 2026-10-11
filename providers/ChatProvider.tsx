'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

type ChatContextType = {
  messages: Message[];
  isOpen: boolean;
  isMinimized: boolean;
  isLoading: boolean;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
  minimizeChat: () => void;
  expandChat: () => void;
  sendMessage: (content:string, cartItems:Array<{
      id: string;
      name: string;
      category: string;
      price: number;
      quantity: number;
    }>) => Promise<void>;
  clearMessages: () => void;
};

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
    const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        "Hi! I'm ShopBot, your shopping assistant. I can help you find products, answer questions, and give recommendations. How can I help you today?",
      timestamp: new Date(),
    },
  ]);

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const openChat = useCallback(() => {
    setIsOpen(true);
    setIsMinimized(false);
  }, []);

  const closeChat = useCallback(() => {
    setIsOpen(false);
    setIsMinimized(false);
  }, []);

  const toggleChat = useCallback(() => {
    if (isOpen && isMinimized) {
      setIsMinimized(false);
      return;
    }
    setIsOpen((prev) => !prev);
  }, [isOpen, isMinimized]);

  const minimizeChat = useCallback(() => setIsMinimized(true), []);
  const expandChat = useCallback(() => setIsMinimized(false), []);

  const sendMessage = useCallback(async(
    content: string,
    cartItems?: Array<{
        id: string;
        name: string;
        category: string;
        price: number;
        quantity: number;
      }>,
  )=>{
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: 'user',
        content,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      try{
        // Prepare messages for API (exclude welcome message, just get conversation)
        const conversationMessages = [...messages, userMessage]
          .filter((m) => m.id !== 'welcome')
          .map((m) => ({
            role: m.role,
            content: m.content,
          }));

        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: conversationMessages,
            cartItems: cartItems || [],
          }),
        });

        const data = await response.json().catch(() => ({}));

        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: (data as { message?: string })?.message ?? "I'm sorry, I couldn't generate a response.",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
      }catch(error){
        console.error('Error sending message:', error);
      }finally{
        setIsLoading(false);
      }

    },[messages]);

  const clearMessages = useCallback(() => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content:
          "Hi! I'm ShopBot, your shopping assistant. I can help you find products, answer questions, and give recommendations. How can I help you today?",
        timestamp: new Date(),
      },
    ]);
  }, []);

  const value: ChatContextType = {
    messages,
    isOpen,
    isMinimized,
    isLoading,
    openChat,
    closeChat,
    toggleChat,
    minimizeChat,
    expandChat,
    sendMessage,
    clearMessages
  };
  
    return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}