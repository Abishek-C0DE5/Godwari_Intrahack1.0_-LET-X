import { useState } from 'react';
import { BookOpen, Search, Filter, CheckCircle, Clock, XCircle, Calendar as CalendarIcon, User, BedDouble } from 'lucide-react';

export default function HotelLedger() {
  const [filter, setFilter] = useState('All');

  // Mock reservations data
  const reservations = [
    { id: 'RES-091', guest: 'Prakash Sharma', room: 'Standard Double', checkIn: 'Aug 12, 2026', checkOut: 'Aug 15, 2026', guests: 2, status: 'confirmed', amount: 'NPR 13,500' },
    { id: 'RES-092', guest: 'Sarah Chen', room: 'Deluxe Suite', checkIn: 'Aug 13, 2026', checkOut: 'Aug 16, 2026', guests: 2, status: 'arriving', amount: 'NPR 24,000' },
    { id: 'RES-093', guest: 'John Doe', room: 'Standard Double', checkIn: 'Aug 14, 2026', checkOut: 'Aug 18, 2026', guests: 1, status: 'pending', amount: 'NPR 18,000' },
    { id: 'RES-094', guest: 'Maya Rai', room: 'Single Room', checkIn: 'Aug 15, 2026', checkOut: 'Aug 16, 2026', guests: 1, status: 'pending', amount: 'NPR 2,500' },
    { id: 'RES-095', guest: 'David Miller', room: 'Deluxe Suite', checkIn: 'Aug 01, 2026', checkOut: 'Aug 05, 2026', guests: 4, status: 'completed', amount: 'NPR 32,000' },
    { id: 'RES-096', guest: 'Anna Smith', room: 'Standard Double', checkIn: 'Aug 20, 2026', checkOut: 'Aug 22, 2026', guests: 2, status: 'cancelled', amount: 'NPR 9,000' },
  ];

  const filteredReservations = filter === 'All' ? reservations : 
                               filter === 'Active' ? reservations.filter(r => ['confirmed', 'arriving', 'pending'].includes(r.status)) :
                               reservations.filter(r => r.status === filter.toLowerCase());

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed': return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200"><CheckCircle className="w-3.5 h-3.5"/> Confirmed</span>;
      case 'arriving': return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200"><Clock className="w-3.5 h-3.5"/> Arriving Today</span>;
      case 'pending': return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-yellow-50 text-yellow-700 border border-yellow-200"><Clock className="w-3.5 h-3.5"/> Pending</span>;
      case 'completed': return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700 border border-gray-300"><CheckCircle className="w-3.5 h-3.5"/> Completed</span>;
      case 'cancelled': return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200"><XCircle className="w-3.5 h-3.5"/> Cancelled</span>;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex flex-col font-sans">
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-blue-600" />
              Reservations Ledger
            </h1>
            <p className="text-slate-500 mt-2">Manage all your guest bookings, check-ins, and financial records.</p>
          </div>
          <div className="flex gap-2">
            <button className="bg-blue-600 text-white shadow-md shadow-blue-500/20 px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-blue-100 transition-colors">
              + New Walk-in Booking
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white/80 backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 p-4 rounded-2xl shadow-sm border border-white/10 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            {['All', 'Active', 'Pending', 'Completed', 'Cancelled'].map(t => (
              <button 
                key={t}
                onClick={() => setFilter(t)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${filter === t ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'bg-white/80 backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 text-slate-600 border border-white/10 hover:bg-transparent'}`}
              >
                {t}
              </button>
            ))}
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
              <input type="text" placeholder="Search ID or Guest Name..." className="w-full pl-10 pr-4 py-2 bg-transparent border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm" />
            </div>
            <button className="bg-transparent border border-white/10 p-2 rounded-xl text-slate-600 hover:bg-gray-100 transition-colors"><Filter className="w-5 h-5" /></button>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="bg-white/80 backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 rounded-3xl shadow-sm border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-transparent/50 border-b border-white/10">
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Booking ID</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Guest Details</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Stay Dates</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Total Amount</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredReservations.map((res, i) => (
                  <tr key={i} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="py-4 px-6">
                      <span className="font-bold text-slate-900 font-mono text-sm bg-gray-100 px-2 py-1 rounded">{res.id}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900 mb-1">{res.guest}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-2">
                        <span className="flex items-center gap-1"><BedDouble className="w-3 h-3"/> {res.room}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                        <span className="flex items-center gap-1"><User className="w-3 h-3"/> {res.guests}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm font-medium text-slate-900 flex items-center gap-2 mb-1">
                        <span className="text-green-600">IN:</span> {res.checkIn}
                      </div>
                      <div className="text-sm font-medium text-slate-900 flex items-center gap-2">
                        <span className="text-red-600">OUT:</span> {res.checkOut}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {getStatusBadge(res.status)}
                    </td>
                    <td className="py-4 px-6 text-right font-bold text-slate-900">
                      {res.amount}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button className="text-blue-600 font-bold text-sm hover:text-blue-800 transition-colors">
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 border-t border-white/10 bg-transparent/50 flex justify-between items-center text-sm">
            <span className="text-slate-500 font-medium">Showing {filteredReservations.length} reservations</span>
            <div className="flex gap-2">
              <button className="px-3 py-1 border border-white/10 rounded-md bg-white/80 backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 text-slate-600 hover:bg-transparent font-medium disabled:opacity-50">Previous</button>
              <button className="px-3 py-1 border border-white/10 rounded-md bg-white/80 backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 text-slate-600 hover:bg-transparent font-medium disabled:opacity-50">Next</button>
            </div>
          </div>
        </div>
        
      </main>
    </div>
  );
}
