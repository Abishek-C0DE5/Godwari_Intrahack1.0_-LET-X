import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, Send } from 'lucide-react';

export default function Chat() {
  const { profile } = useAuth();
  
  // Mock conversations
  const mockConversations = [
    {
      id: 1,
      name: 'Ram Gurung',
      type: 'guide',
      lastMessage: 'I can take you to the peace pagoda.',
      time: '10:30 AM',
      avatar: 'https://ui-avatars.com/api/?name=Ram+Gurung&background=random&size=150'
    },
    {
      id: 2,
      name: 'Hotel Himalayan',
      type: 'hotel',
      lastMessage: 'Yes, we have a deluxe room available for those dates.',
      time: 'Yesterday',
      unread: 0,
      avatar: 'https://picsum.photos/seed/HotelHimalayan/150/150'
    }
  ];

  // Store messages by conversation ID
  const [messagesData, setMessagesData] = useState({
    1: [
      { id: 101, text: 'Hi Ram! Are you available for a hike to the Peace Pagoda this Saturday?', sender: 'me', time: '10:00 AM' },
      { id: 102, text: 'Hello! Yes, I am available. I can take you to the peace pagoda.', sender: 'them', time: '10:30 AM' },
    ],
    2: [
      { id: 201, text: 'Do you have a room available for two people from August 12 to August 15?', sender: 'me', time: 'Yesterday, 14:00' },
      { id: 202, text: 'Yes, we have a deluxe room available for those dates.', sender: 'them', time: 'Yesterday, 14:30' },
    ]
  });

  const [activeChat, setActiveChat] = useState(mockConversations[1]);
  const [message, setMessage] = useState('');
  const [activeMessages, setActiveMessages] = useState([]);

  // When active chat changes, update the visible messages
  useEffect(() => {
    setActiveMessages(messagesData[activeChat.id] || []);
  }, [activeChat, messagesData]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    const newMsg = { id: Date.now(), text: message, sender: 'me', time: 'Just now' };
    
    // Update global message store
    setMessagesData(prev => ({
      ...prev,
      [activeChat.id]: [...(prev[activeChat.id] || []), newMsg]
    }));
    
    setMessage('');
    
    // Fake response depending on type
    setTimeout(() => {
      const replyText = activeChat.type === 'guide' 
        ? 'Sounds like a great plan! I will prepare the itinerary.' 
        : 'Thank you for your message. Your booking is confirmed.';
        
      const replyMsg = { id: Date.now(), text: replyText, sender: 'them', time: 'Just now' };
      
      setMessagesData(prev => ({
        ...prev,
        [activeChat.id]: [...(prev[activeChat.id] || []), replyMsg]
      }));
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-6 py-8 h-[calc(100vh-80px)] flex gap-6">
      
      {/* Sidebar - Conversations */}
      <div className="w-1/3 bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Messages</h2>
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-indigo-500"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {mockConversations.map((chat) => (
            <div 
              key={chat.id}
              onClick={() => setActiveChat(chat)}
              className={`p-4 border-b border-gray-50 flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition-colors ${activeChat.id === chat.id ? 'bg-indigo-50/50' : ''}`}
            >
              <div className="relative">
                <img src={chat.avatar} alt={chat.name} className="w-12 h-12 rounded-full object-cover" />
                {chat.unread > 0 && (
                  <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                    {chat.unread}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-0.5">
                  <h3 className="font-semibold text-gray-900 truncate">{chat.name}</h3>
                  <span className="text-xs text-gray-400">{chat.time}</span>
                </div>
                <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
        {/* Chat Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={activeChat.avatar} alt={activeChat.name} className="w-10 h-10 rounded-full object-cover" />
            <div>
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                {activeChat.name}
                {activeChat.type === 'guide' ? (
                  <span className="bg-indigo-50 text-indigo-700 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold">Guide</span>
                ) : (
                  <span className="bg-blue-50 text-blue-700 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold">Hotel</span>
                )}
              </h2>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
          {activeMessages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] rounded-2xl px-5 py-3 ${
                msg.sender === 'me' 
                  ? 'bg-indigo-600 text-white rounded-br-sm' 
                  : 'bg-white border border-gray-100 text-gray-900 rounded-bl-sm shadow-sm'
              }`}>
                <p className="text-[15px]">{msg.text}</p>
                <span className={`text-[10px] mt-1 block ${msg.sender === 'me' ? 'text-indigo-200' : 'text-gray-400'}`}>
                  {msg.time}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-100">
          <form onSubmit={handleSend} className="flex gap-2">
            <input 
              type="text" 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..." 
              className="flex-1 bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500"
            />
            <button 
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-xl transition-colors flex items-center justify-center"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>

    </div>
  );
}
