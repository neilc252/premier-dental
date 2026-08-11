import React, { useState } from 'react';
import { Sparkles, X, Send, Bot, User, Loader2 } from 'lucide-react';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    {
      sender: 'ai',
      text: 'Hello Dr. Chen! I am your Premier AI Clinical Assistant. How can I help you today? Ask me about CDT code coverage, clinical SOAP drafting, antibiotic prophylaxis guidelines, or restorative protocols.',
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;

    const userText = inputQuery;
    setInputQuery('');
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/gemini/clinical-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userText }),
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: data.answer || 'No response available.' },
      ]);
    } catch (err) {
      console.error('Clinical assist error:', err);
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: 'Error contacting AI Clinical Assistant.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl flex flex-col h-[600px] overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-cyan-300">Premier AI Clinical Copilot</h3>
              <p className="text-[10px] text-slate-400">Powered by Gemini 3.6 Flash</p>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 text-xs">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'ai' && (
                <div className="h-7 w-7 rounded-lg bg-slate-900 text-cyan-400 flex items-center justify-center shrink-0">
                  <Bot className="h-4 w-4" />
                </div>
              )}

              <div
                className={`max-w-[80%] p-3 rounded-2xl leading-relaxed whitespace-pre-line ${
                  m.sender === 'user'
                    ? 'bg-slate-900 text-white rounded-br-none'
                    : 'bg-white border border-slate-200 text-slate-800 shadow-xs rounded-bl-none font-sans'
                }`}
              >
                {m.text}
              </div>

              {m.sender === 'user' && (
                <div className="h-7 w-7 rounded-lg bg-cyan-600 text-white flex items-center justify-center shrink-0 font-bold text-[10px]">
                  DR
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-slate-400 text-xs italic">
              <Loader2 className="h-4 w-4 animate-spin text-cyan-600" />
              <span>Analyzing clinical database...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask about CDT codes, medical alerts, or treatment protocols..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            className="flex-1 text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={isLoading || !inputQuery.trim()}
            className="p-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 disabled:opacity-50 transition-all cursor-pointer"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
