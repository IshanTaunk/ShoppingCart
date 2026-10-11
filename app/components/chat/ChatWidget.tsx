'use client';

import { useChat } from "@/providers/ChatProvider";
import { MdChat, MdClose } from "react-icons/md";
import ChatWindow from "./ChatWindow";

const ChatWidget: React.FC = () => {
    const { isOpen, isMinimized, toggleChat, expandChat } = useChat();

    return (
    <>
      {/* Full Chat Window - only when open and not minimized */}
      {isOpen && !isMinimized && <ChatWindow />}

      {/* Minimized pill - click to expand */}
      {isOpen && isMinimized && (
        <button
          onClick={expandChat}
          className="fixed bottom-24 right-6 z-40 flex items-center gap-2 px-4 py-3 bg-slate-700 text-white rounded-full shadow-lg hover:bg-slate-600 transition-colors"
          aria-label="Open chat">
          <MdChat size={20} />
          <span className="text-sm font-medium">Chat</span>
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full"></span>
        </button>
      )}

      {/* Floating Action Button with Tooltip */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center group">
        {!isOpen && (
          <div className="absolute right-16 bottom-0 bg-white shadow-lg rounded-lg px-3 py-2 text-sm text-slate-700 hidden md:block opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            Need help? Chat with ShopBot!
          </div>
        )}
        <button
          onClick={toggleChat}
          className="relative w-14 h-14 bg-slate-700 text-white rounded-full shadow-lg hover:bg-slate-800 transition-all duration-300 flex items-center justify-center"
          aria-label={isOpen && !isMinimized ? 'Close chat' : isMinimized ? 'Open chat' : 'Open chat'}>
          {isOpen && !isMinimized ? (
            <MdClose size={24} />
          ) : (
            <>
              <MdChat size={24} />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
            </>
          )}
        </button>
      </div>
    </>
  );

};

export default ChatWidget;