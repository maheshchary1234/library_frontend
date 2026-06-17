import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Sparkles } from 'lucide-react';
import { aiService } from '../../services/aiService';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

interface ChatBoxProps {
  documentId: number;
}

export const ChatBox: React.FC<ChatBoxProps> = ({ documentId }) => {
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: 'Hello! I am your LumenAi Tutor. Ask me anything about this document!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { sender: 'user', text: userMessage }]);
    setLoading(true);

    try {
      const response = await aiService.chat(documentId, userMessage);
      setMessages((prev) => [...prev, { sender: 'bot', text: response }]);
    } catch (err: any) {
      setMessages((prev) => [...prev, { sender: 'bot', text: 'Sorry, I encountered an error answering your question. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto h-[500px] bg-slate-800 border border-slate-700 rounded-2xl flex flex-col justify-between shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-slate-900 border-b border-slate-755 flex items-center gap-3">
        <div className="p-2 bg-teal-950 text-teal-400 rounded-xl">
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <h3 className="font-bold text-white text-md">AI Study Tutor</h3>
          <p className="text-xs text-slate-500">Conversing based on active document</p>
        </div>
      </div>

      {/* Message History */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3.5 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            {/* Avatar */}
            <div
              className={`p-2.5 rounded-xl flex-shrink-0 ${
                msg.sender === 'user'
                  ? 'bg-teal-500 text-slate-950'
                  : 'bg-slate-900 text-teal-400'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Bubble */}
            <div
              className={`p-4 rounded-2xl max-w-[75%] text-sm font-medium leading-relaxed whitespace-pre-wrap ${
                msg.sender === 'user'
                  ? 'bg-teal-600 text-white rounded-tr-none'
                  : 'bg-slate-900 text-slate-200 rounded-tl-none border border-slate-800'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 bg-slate-900 text-teal-400 rounded-xl flex-shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 bg-slate-900 text-slate-400 rounded-2xl rounded-tl-none border border-slate-800 text-sm flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-4 bg-slate-900 border-t border-slate-755 flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about the study material..."
          className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm transition-all"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="p-3 bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-slate-950 font-bold rounded-xl shadow-lg transition-all"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};
