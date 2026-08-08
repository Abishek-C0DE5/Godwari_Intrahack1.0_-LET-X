import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, Send } from 'lucide-react';

export default function Chat() {
  const { profile } = useAuth();
  const role = profile?.role || 'tourist';
  
  // Conditionally generate mock conversations based on who is logged in
  const getMockConversations = () => {
    if (role === 'guide') {
      return [
        { id: 10, name: 'Prakash Sharma', type: 'tourist', lastMessage: 'Looking forward to the trek!', time: '10:30 AM', avatar: 'https://ui-avatars.com/api/?name=Prakash+Sharma&background=random&size=150' },
        { id: 11, name: 'Anna Smith', type: 'tourist', lastMessage: 'Can we start earlier on day 2?', time: 'Yesterday', avatar: 'https://ui-avatars.com/api/?name=Anna+Smith&background=random&size=150' },
        { id: 12, name: 'John Doe', type: 'tourist', lastMessage: 'Thanks for the amazing tour!', time: 'Mon', avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=random&size=150' },
        { id: 13, name: 'Maya Rai', type: 'tourist', lastMessage: 'Do you provide sleeping bags?', time: 'Sun', avatar: 'https://ui-avatars.com/api/?name=Maya+Rai&background=random&size=150' },
        { id: 14, name: 'Bikash Tamang', type: 'tourist', lastMessage: 'I need to reschedule our trip.', time: 'Last Week', avatar: 'https://ui-avatars.com/api/?name=Bikash+Tamang&background=random&size=150' },
        { id: 15, name: 'Sarah Chen', type: 'tourist', lastMessage: 'How difficult is the EBC trek?', time: 'Last Week', avatar: 'https://ui-avatars.com/api/?name=Sarah+Chen&background=random&size=150' },
        { id: 16, name: 'David Miller', type: 'tourist', lastMessage: 'We are a group of 5.', time: '2 weeks ago', avatar: 'https://ui-avatars.com/api/?name=David+Miller&background=random&size=150' },
        { id: 17, name: 'Nima Sherpa', type: 'tourist', lastMessage: 'Perfect, see you at 8 AM.', time: '1 month ago', avatar: 'https://ui-avatars.com/api/?name=Nima+Sherpa&background=random&size=150' },
      ];
    }
    if (role === 'hotel') {
      return [
        { id: 20, name: 'David Miller', type: 'tourist', lastMessage: 'Do you offer airport pickup?', time: '09:15 AM', avatar: 'https://ui-avatars.com/api/?name=David+Miller&background=random&size=150' },
        { id: 21, name: 'Sarah Chen', type: 'tourist', lastMessage: 'Thanks, booking confirmed.', time: 'Yesterday', avatar: 'https://ui-avatars.com/api/?name=Sarah+Chen&background=random&size=150' },
        { id: 22, name: 'Prakash Sharma', type: 'tourist', lastMessage: 'Is breakfast included?', time: 'Mon', avatar: 'https://ui-avatars.com/api/?name=Prakash+Sharma&background=random&size=150' },
        { id: 23, name: 'Anna Smith', type: 'tourist', lastMessage: 'We will arrive around 9 PM.', time: 'Sun', avatar: 'https://ui-avatars.com/api/?name=Anna+Smith&background=random&size=150' },
        { id: 24, name: 'John Doe', type: 'tourist', lastMessage: 'Can we get an extra bed?', time: 'Last Week', avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=random&size=150' },
        { id: 25, name: 'Maya Rai', type: 'tourist', lastMessage: 'We loved our stay, thank you!', time: 'Last Week', avatar: 'https://ui-avatars.com/api/?name=Maya+Rai&background=random&size=150' },
        { id: 26, name: 'Bikash Tamang', type: 'tourist', lastMessage: 'Do you have parking space?', time: '2 weeks ago', avatar: 'https://ui-avatars.com/api/?name=Bikash+Tamang&background=random&size=150' },
        { id: 27, name: 'Nima Sherpa', type: 'tourist', lastMessage: 'I need to cancel my reservation.', time: '1 month ago', avatar: 'https://ui-avatars.com/api/?name=Nima+Sherpa&background=random&size=150' },
      ];
    }
    // Default: Tourist
    return [
      { id: 1, name: 'Ram Gurung', type: 'guide', lastMessage: 'I can take you to the peace pagoda.', time: '10:30 AM', avatar: 'https://ui-avatars.com/api/?name=Ram+Gurung&background=random&size=150' },
      { id: 2, name: 'Hotel Himalayan', type: 'hotel', lastMessage: 'Yes, we have a deluxe room available.', time: 'Yesterday', avatar: 'https://picsum.photos/seed/HotelHimalayan/150/150' },
      { id: 3, name: 'Sita Thapa', type: 'guide', lastMessage: 'The cultural tour starts at 9 AM.', time: 'Mon', avatar: 'https://ui-avatars.com/api/?name=Sita+Thapa&background=random&size=150' },
      { id: 4, name: 'Kathmandu Heritage Resort', type: 'hotel', lastMessage: 'Your room is ready.', time: 'Sun', avatar: 'https://picsum.photos/seed/KtmResort/150/150' },
      { id: 5, name: 'Pasang Sherpa', type: 'guide', lastMessage: 'Bring warm clothes for the trek.', time: 'Last Week', avatar: 'https://ui-avatars.com/api/?name=Pasang+Sherpa&background=random&size=150' },
      { id: 6, name: 'Chitwan Jungle Lodge', type: 'hotel', lastMessage: 'The safari jeep leaves at 6 AM.', time: 'Last Week', avatar: 'https://picsum.photos/seed/ChitwanLodge/150/150' },
      { id: 7, name: 'Bishal Karki', type: 'guide', lastMessage: 'I have attached the itinerary PDF.', time: '2 weeks ago', avatar: 'https://ui-avatars.com/api/?name=Bishal+Karki&background=random&size=150' },
      { id: 8, name: 'Pokhara Lakeside Inn', type: 'hotel', lastMessage: 'Thank you for your review!', time: '1 month ago', avatar: 'https://picsum.photos/seed/LakesideInn/150/150' },
    ];
  };

  const getInitialMessages = () => {
    // We just return a generic set of messages for each ID to avoid writing 24 different message arrays
    const genericMessages = {
      me: 'Hi, I had a question regarding the booking.',
      them: 'Hello! How can I help you today?'
    };

    const messages = {};
    const convos = getMockConversations();
    
    convos.forEach(convo => {
      messages[convo.id] = [
        { id: Date.now() + Math.random(), text: genericMessages.me, sender: 'me', time: 'Yesterday' },
        { id: Date.now() + Math.random(), text: genericMessages.them, sender: 'them', time: 'Yesterday' },
        { id: Date.now() + Math.random(), text: convo.lastMessage, sender: convo.id < 100 ? 'them' : 'me', time: convo.time },
      ];
    });

    // Override the first one for a more natural feel
    if (role === 'guide') {
      messages[10] = [
        { id: 1001, text: 'Hi! I saw your profile and would love to book a 3-day trek.', sender: 'them', time: '10:00 AM' },
        { id: 1002, text: 'Great! I am available. I will send you the itinerary.', sender: 'me', time: '10:15 AM' },
        { id: 1003, text: 'Looking forward to the trek!', sender: 'them', time: '10:30 AM' },
      ];
    } else if (role === 'hotel') {
      messages[20] = [
        { id: 2001, text: 'Hi, I booked a room for next week. Do you offer airport pickup?', sender: 'them', time: '09:15 AM' },
      ];
    } else {
      messages[1] = [
        { id: 101, text: 'Hi Ram! Are you available for a hike to the Peace Pagoda this Saturday?', sender: 'me', time: '10:00 AM' },
        { id: 102, text: 'Hello! Yes, I am available. I can take you to the peace pagoda.', sender: 'them', time: '10:30 AM' },
      ];
    }
    return messages;
  };

  const [mockConversations, setMockConversations] = useState(getMockConversations());
  const [messagesData, setMessagesData] = useState(getInitialMessages());
  const [activeChat, setActiveChat] = useState(mockConversations[0]);
  const [message, setMessage] = useState('');
  const [activeMessages, setActiveMessages] = useState([]);

  useEffect(() => {
    const newConvos = getMockConversations();
    setMockConversations(newConvos);
    setMessagesData(getInitialMessages());
    if (newConvos.length > 0) {
      setActiveChat(newConvos[0]);
    }
  }, [role]);

  useEffect(() => {
    if (activeChat) {
      setActiveMessages(messagesData[activeChat.id] || []);
    }
  }, [activeChat, messagesData]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim() || !activeChat) return;
    
    const newMsg = { id: Date.now(), text: message, sender: 'me', time: 'Just now' };
    
    setMessagesData(prev => ({
      ...prev,
      [activeChat.id]: [...(prev[activeChat.id] || []), newMsg]
    }));
    
    setMessage('');
    
    setTimeout(() => {
      let replyText = 'Thank you for your message!';
      
      if (role === 'tourist') {
        replyText = activeChat.type === 'guide' 
          ? 'Sounds like a great plan! I will prepare the itinerary.' 
          : 'Thank you for your message. We will check availability.';
      } else if (role === 'guide') {
        replyText = 'Okay, I will review the itinerary and let you know.';
      } else if (role === 'hotel') {
        replyText = 'Thanks, we will confirm our arrival time soon.';
      }
        
      const replyMsg = { id: Date.now(), text: replyText, sender: 'them', time: 'Just now' };
      
      setMessagesData(prev => ({
        ...prev,
        [activeChat.id]: [...(prev[activeChat.id] || []), replyMsg]
      }));
    }, 1500);
  };

  if (!activeChat) return <div className="p-10 text-center">Loading chats...</div>;

  return (
    <div className="max-w-7xl mx-auto w-full px-6 py-8 h-[calc(100vh-80px)] flex gap-6 font-sans">
      
      <div className="w-1/3 bg-white/80 backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 rounded-3xl shadow-sm border border-white/10 flex flex-col overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Messages</h2>
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              className="w-full pl-10 pr-4 py-2.5 bg-transparent border-none rounded-xl focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {mockConversations.map((chat) => (
            <div 
              key={chat.id}
              onClick={() => setActiveChat(chat)}
              className={`p-4 border-b border-gray-50 flex items-center gap-4 cursor-pointer hover:bg-transparent transition-colors ${activeChat.id === chat.id ? 'bg-blue-50/50' : ''}`}
            >
              <div className="relative">
                <img src={chat.avatar} alt={chat.name} className="w-12 h-12 rounded-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-0.5">
                  <h3 className="font-semibold text-slate-900 truncate">{chat.name}</h3>
                  <span className="text-xs text-slate-600">{chat.time}</span>
                </div>
                <p className="text-sm text-slate-500 truncate">{chat.lastMessage}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 bg-white/80 backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 rounded-3xl shadow-sm border border-white/10 flex flex-col overflow-hidden">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={activeChat.avatar} alt={activeChat.name} className="w-10 h-10 rounded-full object-cover" />
            <div>
              <h2 className="font-bold text-slate-900 flex items-center gap-2">
                {activeChat.name}
                <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold ${
                  activeChat.type === 'guide' ? 'bg-blue-50 text-blue-700' :
                  activeChat.type === 'hotel' ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'
                }`}>
                  {activeChat.type}
                </span>
              </h2>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-transparent/50">
          {activeMessages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] rounded-2xl px-5 py-3 ${
                msg.sender === 'me' 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 rounded-br-sm' 
                  : 'bg-white/80 backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 border border-white/10 text-slate-900 rounded-bl-sm shadow-sm'
              }`}>
                <p className="text-[15px]">{msg.text}</p>
                <span className={`text-[10px] mt-1 block ${msg.sender === 'me' ? 'text-slate-600' : 'text-slate-600'}`}>
                  {msg.time}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-white/80 backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 border-t border-white/10">
          <form onSubmit={handleSend} className="flex gap-2">
            <input 
              type="text" 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..." 
              className="flex-1 bg-transparent border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500"
            />
            <button 
              type="submit"
              className="bg-blue-600 hover:bg-blue-100 text-slate-900 p-3 rounded-xl transition-colors flex items-center justify-center"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>

    </div>
  );
}
