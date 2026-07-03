/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { ChatMessage } from '@/lib/types';

const AIChat: React.FC = () => {
  const t = useTranslations('aiChat');
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([{ role: 'model', text: t('initialMessage') }]);
  }, [locale, t]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      const { scrollHeight, clientHeight } = chatContainerRef.current;
      chatContainerRef.current.scrollTo({ top: scrollHeight - clientHeight, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);
    setTimeout(scrollToBottom, 100);

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ message: currentInput, history: messages, locale }),
    });
    const dataJson = await res.json().catch(() => ({ text: t('connectionError') }));
    const responseText: string = dataJson.text ?? dataJson.error ?? t('connectionError');

    setMessages((prev) => [...prev, { role: 'model', text: responseText }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 flex flex-col items-end pointer-events-auto">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="mb-4 w-[90vw] md:w-96 bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-[#B19073]/20"
          >
            <div className="bg-gradient-to-r from-[#2A241C]/50 to-[#B19073]/20 p-4 flex justify-between items-center border-b border-white/10">
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-bold text-white tracking-wider text-sm">YOLY AI</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white" data-hover="true">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div ref={chatContainerRef} className="h-64 md:h-80 overflow-y-auto p-4 space-y-3 scroll-smooth">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] p-3 rounded-lg text-sm ${
                      msg.role === 'user'
                        ? 'bg-[#B19073] text-black font-medium rounded-tr-none'
                        : 'bg-white/10 text-gray-200 rounded-tl-none border border-white/5'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/10 p-3 rounded-lg rounded-tl-none flex gap-1">
                    <span className="w-1.5 h-1.5 bg-[#EDE5DA] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-[#EDE5DA] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-[#EDE5DA] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
            </div>

            <div className="p-3 border-t border-white/10 bg-black/40">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder={t('placeholder')}
                  className="flex-1 bg-transparent text-white placeholder-white/30 text-sm focus:outline-none"
                />
                <button onClick={handleSend} disabled={isLoading || !input.trim()} className="bg-[#B19073] p-2 rounded-lg hover:bg-[#EDE5DA] transition-colors disabled:opacity-50" data-hover="true">
                  <Send className="w-4 h-4 text-black" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-tr from-[#B19073] to-[#B19073] flex items-center justify-center shadow-lg shadow-[#B19073]/40 border border-white/20 z-50 group"
        data-hover="true"
      >
        {isOpen ? <X className="w-5 h-5 md:w-6 md:h-6 text-white" /> : <MessageCircle className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:animate-bounce" />}
      </motion.button>
    </div>
  );
};

export default AIChat;
