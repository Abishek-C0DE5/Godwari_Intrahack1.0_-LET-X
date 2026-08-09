import { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hello! I am your YatraVerse AI Assistant. How can I help you plan your journey today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setIsTyping(true);

    try {
      // Send to our backend endpoint (works via proxy locally, and serverless function on Vercel)
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });
      
      const data = await response.json();
      
      if (data.reply) {
        setMessages(prev => [...prev, { role: 'ai', text: data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: 'ai', text: "Sorry, I couldn't process that right now. Please check the backend connection." }]);
      }
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'ai', text: "Sorry, I'm having trouble connecting to my brain right now! Make sure the backend server is running." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="bg-black/20 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 flex flex-col h-[280px] w-full">
      {/* Header */}
      <div className="px-4 py-3 bg-blue-700/80 text-white flex items-center gap-2 rounded-t-2xl border-b border-white/10">
        <Sparkles className="w-4 h-4 text-blue-200" />
        <span className="font-bold text-sm tracking-wide">AI Travel Assistant</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-transparent">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm font-medium leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-br-sm shadow-md' 
                : 'bg-white/10 border border-white/20 text-white rounded-bl-sm shadow-sm'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white/10 border border-white/20 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex gap-1">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-white/10 bg-black/20 rounded-b-2xl">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about Nepal tourism..." 
            className="flex-1 bg-black/40 border border-white/20 rounded-xl px-4 py-2.5 text-sm font-medium text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
          <button 
            type="submit"
            disabled={isTyping}
            className="bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400/50 text-white px-4 py-2.5 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
