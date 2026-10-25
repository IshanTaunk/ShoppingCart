import { useCart } from "@/hooks/useCart";
import { Message, useChat } from "@/providers/ChatProvider";
import Link from "next/link";
import { useRef, useState } from "react";
import { MdAutoAwesome, MdMinimize, MdRefresh, MdSend } from "react-icons/md";

/** Renders message content with [ID: xxx] patterns as clickable product links */
function MessageContent({ content }: { content: string }) {
  const parts = content.split(/(\[ID:\s*([a-zA-Z0-9-]+)\])/g);
  const elements = parts.map((part, i) => {
    if (i % 3 === 1 && parts[i + 1]) {
      const productId = parts[i + 1];
      return (
        <Link
          key={i}
          href={`/products/${productId}`}
          className="text-blue-600 underline hover:text-slate-800 font-medium">
          Visit product →
        </Link>
      );
    }
    if (i % 3 === 2) return null;
    return <span key={i}>{part}</span>;
  });
  return <>{elements.filter(Boolean)}</>;
}

const ChatWindow: React.FC = () => {
    const quickQuestions = [
    'What do you recommend?',
    'Show me dresses',
    'Help me find accessories',
  ];
    const { messages, isLoading, minimizeChat, clearMessages, sendMessage } = useChat();
    const { cartProducts } = useCart();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [input, setInput] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim() || isLoading) return;

      const cartItems = cartProducts?.map((p) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        price: p.price,
        quantity: p.quantity,
      }));
      setInput('');
      await sendMessage(input.trim(), cartItems || []);
    };

    const handleQuickQuestion = (question: string) => {
      const cartItems = cartProducts?.map((p) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        price: p.price,
        quantity: p.quantity,
      }));
      sendMessage(question, cartItems || []);
  };
    return (
    <div className="fixed bottom-24 right-6 z-40 w-80 max-w-[calc(100vw-3rem)] h-[500px] max-h-[calc(100dvh-7rem)] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">

      {/* Header */}
      <div className="shrink-0 bg-gradient-to-r from-slate-700 to-slate-800 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MdAutoAwesome size={20} />
          <div>
            <h3 className="font-semibold text-sm">
              ShopBot
            </h3>
            <p className="text-xs text-slate-300">
              AI Shopping Assistant
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={minimizeChat}
            className="p-1 hover:bg-slate-600 rounded-full transition-colors"
            title="Minimize chat"
            aria-label="Minimize chat">
            <MdMinimize size={18} />
          </button>
          <button
            onClick={clearMessages}
            className="p-1 hover:bg-slate-600 rounded-full transition-colors"
            title="Clear conversation"
            aria-label="Clear conversation">
            <MdRefresh size={18} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="min-h-0 flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message: Message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                message.role === 'user'
                  ? 'bg-slate-700 text-white rounded-br-sm'
                  : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-sm'
              }`}>
              <p className="text-sm whitespace-pre-wrap break-words">
                {message.role === 'assistant' ? (
                  <MessageContent
                    content={message.content}
                  />
                ) : (
                  message.content
                )}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-800 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm border border-gray-100">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                <span
                  className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                  style={{ animationDelay: '0.1s' }}></span>
                <span
                  className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                  style={{ animationDelay: '0.2s' }}></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Questions - show only at start */}
      {messages.length <= 1 && (
        <div className="shrink-0 max-h-[30%] overflow-y-auto px-4 py-2 border-t border-gray-100 bg-white">
          <p className="text-xs text-gray-500 mb-2">
            Quick questions:
          </p>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((question) => (
              <button
                key={question}
                onClick={() =>
                  handleQuickQuestion(question)
                }
                className="text-xs px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition-colors">
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="shrink-0 p-3 border-t border-gray-200 bg-white">
          <div className="flex items-center gap-2">
            <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            className="min-w-0 flex-1 px-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
            disabled={isLoading}
            />
            <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="shrink-0 p-2 bg-slate-700 text-white rounded-full hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            <MdSend size={18} />
          </button>
          </div>
      </form>
    </div>);
};
export default ChatWindow;