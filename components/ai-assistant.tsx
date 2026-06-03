'use client';

import { useState, useRef, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Loader2 } from 'lucide-react';

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  });
  const isLoading = status === 'streaming' || status === 'submitted';
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input.trim() });
    setInput('');
  };

  // Auto scroll to bottom of chat
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  return (
    <>
      {/* Floating Action Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-on-primary rounded-full shadow-lg flex items-center justify-center z-50 hover:bg-primary-container hover:text-on-primary-container transition-colors"
          >
            <MessageSquare size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 w-[380px] h-[550px] bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-primary px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-on-primary">
                <Bot size={20} />
                <span className="font-semibold text-sm">Support AI Assistant</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-on-primary/80 hover:text-on-primary hover:bg-white/10 p-1.5 rounded-full transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar bg-surface-container-lowest">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-on-surface-variant opacity-70">
                  <Bot size={48} className="mb-4 opacity-50" />
                  <p className="text-sm font-medium">How can I help you today?</p>
                  <p className="text-xs mt-1">I can draft emails, summarize tickets, or answer questions.</p>
                </div>
              ) : (
                messages.map((m) => (
                  <div 
                    key={m.id} 
                    className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} w-full`}
                  >
                    <div 
                      className={`flex gap-2 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${m.role === 'user' ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface'}`}>
                        {m.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                      </div>
                      <div 
                        className={`px-3 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                          m.role === 'user' 
                            ? 'bg-primary text-on-primary rounded-tr-sm' 
                            : 'bg-surface-container text-on-surface rounded-tl-sm'
                        }`}
                      >
                        {m.parts.map((part, index) => {
                          if (part.type === 'text') {
                            return <span key={index}>{part.text}</span>;
                          }
                          if (part.type === 'reasoning') {
                            return (
                              <div key={index} className="text-xs text-on-surface-variant/60 italic border-l-2 border-outline pl-2 mb-1.5 font-sans">
                                {part.text}
                              </div>
                            );
                          }
                          return null;
                        })}
                      </div>
                    </div>
                  </div>
                ))
              )}
              {isLoading && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
                <div className="flex justify-start w-full">
                  <div className="flex gap-2 max-w-[85%] flex-row">
                    <div className="w-7 h-7 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center flex-shrink-0">
                      <Bot size={14} />
                    </div>
                    <div className="px-4 py-3 rounded-2xl bg-surface-container text-on-surface rounded-tl-sm flex items-center justify-center">
                      <Loader2 size={16} className="animate-spin text-primary" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-surface-container-lowest border-t border-outline-variant">
              <form 
                ref={formRef}
                onSubmit={handleFormSubmit}
                className="flex items-end gap-2 bg-surface-container px-3 py-2 rounded-xl border border-outline-variant focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all"
              >
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask the AI Assistant..."
                  className="w-full bg-transparent border-none focus:outline-none resize-none max-h-32 text-sm text-on-surface placeholder:text-on-surface-variant py-1.5 custom-scrollbar"
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      if (input.trim() && !isLoading) {
                        sendMessage({ text: input.trim() });
                        setInput('');
                      }
                    }
                  }}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="bg-primary text-on-primary p-2 rounded-lg mb-0.5 hover:bg-primary-container hover:text-on-primary-container transition-colors disabled:opacity-50 disabled:hover:bg-primary flex-shrink-0"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
