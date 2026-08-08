import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Briefcase, MapPin, Calendar, Clock, DollarSign, Send, Filter, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function GuideJobs() {
  const { profile } = useAuth();
  const [filter, setFilter] = useState('All');

  // Mock public job board data
  const jobs = [
    { id: 1, tourist: 'Anna Smith', location: 'Everest Base Camp', dates: 'Oct 12 - Oct 25', type: 'Trekking', budget: 'NPR 3000/day', details: 'Looking for an experienced English-speaking guide for EBC. Must have first-aid training.', status: 'open' },
    { id: 2, tourist: 'David Miller', location: 'Kathmandu Valley', dates: 'Sep 05 - Sep 06', type: 'Cultural Heritage', budget: 'NPR 2500/day', details: 'Need a local guide to show us the 3 Durbar Squares and local food spots.', status: 'open' },
    { id: 3, tourist: 'Maya Rai', location: 'Chitwan National Park', dates: 'Nov 01 - Nov 04', type: 'Wildlife Safari', budget: 'Negotiable', details: 'Looking for a guide specialized in bird watching.', status: 'open' },
    { id: 4, tourist: 'Prakash Sharma', location: 'Annapurna Circuit', dates: 'Aug 20 - Sep 05', type: 'Trekking', budget: 'NPR 3500/day', details: 'Group of 4 looking for an energetic guide.', status: 'closed' },
  ];

  const filteredJobs = filter === 'All' ? jobs : jobs.filter(j => j.type === filter);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
              <Briefcase className="w-8 h-8 text-indigo-600" />
              Public Job Board
            </h1>
            <p className="text-gray-500 mt-2">Browse open requests from tourists looking for a guide like you.</p>
          </div>
          <div className="flex gap-2">
            {['All', 'Trekking', 'Cultural Heritage', 'Wildlife Safari'].map(t => (
              <button 
                key={t}
                onClick={() => setFilter(t)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filter === t ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8 flex gap-4 items-center">
          <Search className="w-5 h-5 text-gray-400 ml-2" />
          <input type="text" placeholder="Search by location, keyword, or tourist name..." className="flex-1 bg-transparent border-none focus:ring-0 text-gray-900 placeholder-gray-400" />
          <button className="bg-gray-100 p-2 rounded-xl text-gray-600 hover:bg-gray-200 transition-colors"><Filter className="w-5 h-5" /></button>
        </div>

        {/* Job Listings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredJobs.map(job => (
            <div key={job.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 ${job.status === 'open' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {job.status === 'open' ? 'Open Request' : 'Position Filled'}
                  </span>
                  <h2 className="text-xl font-bold text-gray-900">{job.location}</h2>
                  <p className="text-sm font-medium text-indigo-600">{job.type}</p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Budget</div>
                  <div className="text-lg font-bold text-gray-900">{job.budget}</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-1.5 w-full md:w-auto"><Calendar className="w-4 h-4 text-gray-400"/> {job.dates}</div>
                <div className="flex items-center gap-1.5 w-full md:w-auto"><UserIcon className="w-4 h-4 text-gray-400"/> {job.tourist}</div>
                <div className="flex items-center gap-1.5 w-full md:w-auto"><Clock className="w-4 h-4 text-gray-400"/> Posted 2 days ago</div>
              </div>

              <p className="text-gray-600 text-sm leading-relaxed flex-1 mb-6">
                "{job.details}"
              </p>

              <div className="pt-4 border-t border-gray-100 mt-auto flex gap-3">
                <button 
                  disabled={job.status !== 'open'} 
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold transition-colors ${job.status === 'open' ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                >
                  <Send className="w-4 h-4" /> Express Interest
                </button>
                <Link to="/chat" className={`px-4 py-3 rounded-xl font-bold border transition-colors flex items-center justify-center ${job.status === 'open' ? 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50' : 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed pointer-events-none'}`}>
                  Message
                </Link>
              </div>
            </div>
          ))}
        </div>
        
      </main>
    </div>
  );
}

// Simple internal icon since I didn't import User from lucide-react at the top to avoid conflicts if I copy/pasted
function UserIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );
}
