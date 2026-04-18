'use client';

import { useStore } from '@/store/useStore';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function MyBets() {
  const { bets, matches, markets, currentUser } = useStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!currentUser) router.push('/login');
  }, [currentUser, router]);

  if (!mounted || !currentUser) return null;

  const userBets = bets.filter(b => b.userId === currentUser.id).reverse();
  const openBets = userBets.filter(b => b.status === 'open');
  const settledBets = userBets.filter(b => b.status !== 'open');

  const totalWon = settledBets.filter(b => b.status === 'won').reduce((acc, b) => acc + (b.pnl || 0), 0);
  const totalLost = settledBets.filter(b => b.status === 'lost').reduce((acc, b) => acc + (b.pnl || 0), 0);
  const totalPnl = totalWon - totalLost;

  // Mock data for graph
  const pnlData = [
    { name: 'Mon', PnL: 4000 },
    { name: 'Tue', PnL: -1500 },
    { name: 'Wed', PnL: 2000 },
    { name: 'Thu', PnL: 8000 },
    { name: 'Fri', PnL: -3000 },
    { name: 'Sat', PnL: totalPnl },
  ];

  return (
    <div className="container px-4 py-8 max-w-5xl mx-auto space-y-6">
      <h1 className="font-heading text-4xl mb-6">My Bets</h1>

      <Tabs defaultValue="open" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-[#161616] border border-[#2A2A2A] rounded-none p-0 h-12">
          <TabsTrigger value="open" className="rounded-none data-[state=active]:bg-[#2A2A2A] data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-primary uppercase tracking-widest text-xs">Open Bets</TabsTrigger>
          <TabsTrigger value="settled" className="rounded-none data-[state=active]:bg-[#2A2A2A] data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-primary uppercase tracking-widest text-xs">Settled Bets</TabsTrigger>
          <TabsTrigger value="pnl" className="rounded-none data-[state=active]:bg-[#2A2A2A] data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-primary uppercase tracking-widest text-xs">P&L Report</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="open">
            <Card className="bg-[#161616] border-[#2A2A2A] rounded-sm">
              <div className="overflow-x-auto w-full">
                <table className="w-full text-sm text-left text-gray-400">
                  <thead className="text-[10px] text-gray-500 uppercase bg-[#0D0D0D] border-b border-[#2A2A2A]">
                    <tr>
                      <th className="px-4 py-3 font-medium">Market</th>
                      <th className="px-4 py-3 font-medium">Selection</th>
                      <th className="px-4 py-3 font-medium">Type</th>
                      <th className="px-4 py-3 font-medium text-right">Odds</th>
                      <th className="px-4 py-3 font-medium text-right">Stake</th>
                      <th className="px-4 py-3 font-medium text-right">Liability</th>
                      <th className="px-4 py-3 font-medium text-right">Profit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {openBets.length === 0 ? (
                      <tr><td colSpan={7} className="text-center py-8">No open bets.</td></tr>
                    ) : openBets.map(bet => {
                      const match = matches.find(m => m.id === bet.matchId);
                      const market = markets.find(m => m.id === bet.marketId);
                      const selection = market?.selections.find(s => s.id === bet.selectionId);
                      const profit = bet.type === 'back' ? ((bet.odds - 1) * bet.stake) : bet.stake;
                      
                      return (
                        <tr key={bet.id} className="border-b border-[#2A2A2A] hover:bg-white/5">
                          <td className="px-4 py-3">
                            <div className="font-bold text-white mb-0.5 whitespace-nowrap">{match?.teamA} v {match?.teamB}</div>
                            <div className="text-[10px] uppercase">{market?.name}</div>
                          </td>
                          <td className="px-4 py-3 font-bold text-white whitespace-nowrap">{selection?.name}</td>
                          <td className="px-4 py-3 font-bold uppercase tracking-wider text-[10px]"><span className={`px-2 py-1 rounded-sm ${bet.type === 'back' ? 'bg-back/20 text-back' : 'bg-lay/20 text-lay'}`}>{bet.type}</span></td>
                          <td className="px-4 py-3 text-right font-bold text-white">{bet.odds.toFixed(2)}</td>
                          <td className="px-4 py-3 text-right">₹{bet.stake.toFixed(2)}</td>
                          <td className="px-4 py-3 text-right text-red-400">₹{bet.liability.toFixed(2)}</td>
                          <td className="px-4 py-3 text-right text-green-400">₹{profit.toFixed(2)}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="settled">
            <Card className="bg-[#161616] border-[#2A2A2A] rounded-sm">
               <div className="p-12 text-center text-gray-500">
                 No settled bets available currently.
               </div>
            </Card>
          </TabsContent>

          <TabsContent value="pnl">
            <Card className="bg-[#161616] border-[#2A2A2A] rounded-sm mb-6">
              <CardContent className="p-6">
                <h3 className="text-xl font-heading font-bold mb-6 tracking-wide">WEEKLY P&L</h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={pnlData}>
                      <XAxis dataKey="name" stroke="#555" tick={{fill: '#888', fontSize: 12}} />
                      <YAxis stroke="#555" tick={{fill: '#888', fontSize: 12}} />
                      <Tooltip 
                        contentStyle={{backgroundColor: '#161616', borderColor: '#2A2A2A', color: '#fff'}}
                        formatter={(value) => [`₹${value}`, "PnL"]}
                      />
                      <Bar dataKey="PnL" shape={(props: any) => {
                        const { x, y, width, height, payload } = props;
                        return <rect x={x} y={payload.PnL >= 0 ? y : y - height} width={width} height={height} fill={payload.PnL >= 0 ? '#00E676' : '#FF4B6E'} rx={2} />
                      }} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#161616] border border-[#2A2A2A] p-4 text-center rounded-sm">
                <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Total Bets</div>
                <div className="text-2xl font-bold font-sans">156</div>
              </div>
              <div className="bg-[#161616] border border-[#2A2A2A] p-4 text-center rounded-sm">
                <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Won</div>
                <div className="text-2xl font-bold font-sans text-green-400">89</div>
              </div>
              <div className="bg-[#161616] border border-[#2A2A2A] p-4 text-center rounded-sm">
                <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Total P&L</div>
                <div className="text-2xl font-bold font-sans text-primary">+₹12,450</div>
              </div>
              <div className="bg-[#161616] border border-[#2A2A2A] p-4 text-center rounded-sm">
                <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Commission</div>
                <div className="text-2xl font-bold font-sans text-red-400">-₹249</div>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
