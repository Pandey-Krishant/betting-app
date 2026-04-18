'use client';

import { useStore } from '@/store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminContests() {
  const { contests, matches } = useStore();

  const handleToggleVisibility = (contestId: string) => {
    toast.success('Contest visibility toggled');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-heading text-2xl">Contest Management</h2>
        <Button className="bg-primary text-black hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" /> New Contest
        </Button>
      </div>

      <Card className="bg-[#111116] border-white/10 overflow-hidden">
        <Table>
          <TableHeader className="bg-[#1a1a22]">
            <TableRow className="border-white/10 hover:bg-[#1a1a22]">
              <TableHead className="text-gray-400">Match</TableHead>
              <TableHead className="text-gray-400">Contest Name</TableHead>
              <TableHead className="text-gray-400">Entry</TableHead>
              <TableHead className="text-gray-400">Status</TableHead>
              <TableHead className="text-right text-gray-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contests.map((contest: any) => {
              const match = matches.find(m => m.id === contest.matchId);
              return (
                <TableRow key={contest.id} className="border-white/10 hover:bg-white/5">
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm font-medium">
                      {match?.teamA} <span className="text-gray-500 text-xs text-[10px]">vs</span> {match?.teamB}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{contest.name}</span>
                    <p className="text-xs text-gray-500">Prize: ₹{contest.prizePool.toLocaleString()}</p>
                  </TableCell>
                  <TableCell>
                    {contest.entryFee === 0 ? (
                      <Badge variant="secondary" className="bg-gray-800 text-white">Free</Badge>
                    ) : (
                      <span className="font-bold">₹{contest.entryFee}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={contest.isVisible ? "border-green-500/50 text-green-500 bg-green-500/10" : "border-gray-500 text-gray-400"}>
                      {contest.isVisible ? 'Visible' : 'Hidden'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleToggleVisibility(contest.id)}
                      className="border-white/20 text-white hover:bg-white/5"
                    >
                      {contest.isVisible ? 'Hide' : 'Show'}
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
