'use client';

import { useEventsStore } from '@/store/useEventsStore';
import { Trophy, Activity, Lock, Unlock, Settings2, Edit3, X, Save } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function AdminMatches() {
  const { events, setEvents } = useEventsStore();
  const [editingScore, setEditingScore] = useState<string | null>(null);
  const [scoreData, setScoreData] = useState({ runs: '0', wickets: '0', overs: '0.0' });

  const handleToggleInPlay = (matchId: string) => {
    setEvents(events.map(e => e._id === matchId ? { ...e, oddsData: { ...e.oddsData, inPlay: !e.oddsData.inPlay } } : e));
    toast.success('InPlay updated');
  };

  const handleToggleSuspend = (matchId: string) => {
    setEvents(events.map(e => e._id === matchId ? { ...e, oddsData: { ...e.oddsData, status: e.oddsData.status === 'OPEN' ? 'SUSPENDED' : 'OPEN' } } : e));
    toast.success('Market suspended/opened');
  };

  const openScoreModal = (match: any) => {
    setEditingScore(match._id);
    // Note: in a real app we'd fetch current score. here we default.
    setScoreData({ runs: '156', wickets: '3', overs: '14.2' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
         <h2 className="font-bold text-lg uppercase tracking-widest text-[#223869]">Match Operations</h2>
         <span className="bg-orange-500 text-black px-2 py-0.5 rounded-[2px] text-[10px] font-black uppercase">STRIKER ADMIN</span>
      </div>

      <div className="overflow-x-auto bg-white border border-gray-100 shadow-sm rounded-sm">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
              <th className="px-5 py-4 text-left">Match Event</th>
              <th className="px-5 py-4 text-left">Market</th>
              <th className="px-5 py-4 text-left">InPlay</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-[13px] font-bold">
            {events.map((e) => (
              <tr key={e._id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex flex-col">
                    <span className="text-black uppercase tracking-tight">{e.eventName}</span>
                    <span className="text-[10px] text-gray-400 uppercase font-bold">{e.tournamentName}</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                   <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${e.oddsData.status === 'OPEN' ? 'bg-match-inplay' : 'bg-red-600 animate-pulse'}`} />
                      <span className={`text-[11px] font-black uppercase ${e.oddsData.status === 'OPEN' ? 'text-match-inplay' : 'text-red-600'}`}>
                         {e.oddsData.status}
                      </span>
                   </div>
                </td>
                <td className="px-5 py-4">
                   <button 
                     onClick={() => handleToggleInPlay(e._id)}
                     className={`px-3 py-1 rounded-[2px] text-[10px] font-black uppercase tracking-widest transition-all ${e.oddsData.inPlay ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}
                   >
                     {e.oddsData.inPlay ? 'YES' : 'NO'}
                   </button>
                </td>
                <td className="px-5 py-4 text-right">
                   <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleToggleSuspend(e._id)}
                        className={`p-2 rounded-sm transition-all border ${e.oddsData.status === 'OPEN' ? 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100' : 'bg-green-50 text-green-600 border-green-100 hover:bg-green-100'}`}
                        title={e.oddsData.status === 'OPEN' ? 'Suspend Markets' : 'Open Markets'}
                      >
                         {e.oddsData.status === 'OPEN' ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                      </button>
                      <button onClick={() => openScoreModal(e)} className="p-2 bg-blue-50 text-match-name border border-blue-100 hover:bg-blue-100 rounded-sm">
                         <Edit3 className="w-4 h-4" />
                      </button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingScore && (
        <div className="fixed inset-0 z-[1100] bg-black/70 flex items-center justify-center p-4">
           <div className="bg-white rounded-sm w-full max-w-[340px] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
              <div className="bg-[#243a48] p-4 text-white flex items-center justify-between">
                 <h3 className="font-bold text-[14px] uppercase tracking-widest flex items-center gap-2">
                    Edit Live Score
                 </h3>
                 <button onClick={() => setEditingScore(null)}><X className="w-5 h-5"/></button>
              </div>
              <div className="p-6 space-y-4">
                 <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                       <label className="text-[10px] font-bold text-gray-400 uppercase">Runs</label>
                       <input type="text" value={scoreData.runs} onChange={e => setScoreData({...scoreData, runs: e.target.value})} className="w-full bg-gray-50 border border-gray-200 p-2 text-center font-black" />
                    </div>
                    <div className="space-y-1">
                       <label className="text-[10px] font-bold text-gray-400 uppercase">Wkts</label>
                       <input type="text" value={scoreData.wickets} onChange={e => setScoreData({...scoreData, wickets: e.target.value})} className="w-full bg-gray-50 border border-gray-200 p-2 text-center font-black" />
                    </div>
                    <div className="space-y-1">
                       <label className="text-[10px] font-bold text-gray-400 uppercase">Overs</label>
                       <input type="text" value={scoreData.overs} onChange={e => setScoreData({...scoreData, overs: e.target.value})} className="w-full bg-gray-50 border border-gray-200 p-2 text-center font-black" />
                    </div>
                 </div>
                 <button onClick={() => { toast.success('Score Updated'); setEditingScore(null); }} className="w-full sports-gradient text-black font-black py-3 uppercase text-[12px] rounded-sm flex items-center justify-center gap-2">
                    <Save className="w-4 h-4" /> Save Score
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}

import { LayoutDashboard } from 'lucide-react';
