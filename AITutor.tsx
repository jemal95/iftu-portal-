
import React, { useState, useRef, useEffect } from 'react';
import { askTutor } from '../services/geminiService';

const AITutor: React.FC = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: 'Salam! I am IFTU AI. How can I assist with your Ethiopian National Curriculum studies today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);
    const response = await askTutor(userMsg);
    setMessages(prev => [...prev, { role: 'ai', text: response || 'Failed to connect.' }]);
    setIsLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto h-[700px] flex flex-col bg-white rounded-[4rem] border-8 border-black shadow-[24px_24px_0px_0px_rgba(59,130,246,1)] overflow-hidden animate-fadeIn">
      <div className="p-8 md:p-12 bg-blue-600 text-white border-b-8 border-black flex justify-between items-center">
         <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white/20 rounded-[1.5rem] border-4 border-black flex items-center justify-center text-4xl shadow-lg">⚡</div>
            <div>
              <h3 className="text-3xl font-black uppercase tracking-tighter">IFTU AI Lab</h3>
              <p className="text-xs font-black uppercase tracking-widest opacity-80">2024 Curriculum Core</p>
            </div>
         </div>
         <div className="hidden sm:block text-right">
            <p className="text-xs font-black uppercase tracking-widest opacity-60">Status</p>
            <p className="text-xl font-black uppercase tracking-tighter">Optimized</p>
         </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-8 bg-gray-50">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-8 rounded-[3rem] border-4 border-black shadow-xl font-black text-xl leading-relaxed ${m.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-gray-900 rounded-bl-none'}`}>
              {m.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="bg-white p-6 rounded-3xl border-4 border-black flex gap-2 shadow-lg">
                <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce"></div>
                <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce [animation-delay:0.4s]"></div>
             </div>
          </div>
        )}
      </div>

      <div className="p-8 md:p-12 bg-white border-t-8 border-black">
        <div className="flex gap-6">
          <input 
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Type your academic query..."
            className="flex-1 bg-gray-50 border-4 border-black rounded-[2rem] px-10 py-6 font-black text-2xl outline-none focus:bg-white transition-all shadow-inner"
          />
          <button onClick={handleSend} disabled={isLoading} className="bg-blue-600 text-white w-24 h-24 md:w-32 md:h-24 rounded-[2rem] border-4 border-black flex items-center justify-center text-5xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-y-2 active:shadow-none transition-all disabled:opacity-50">
            ➤
          </button>
        </div>
      </div>
    </div>
  );
};

export default AITutor;
