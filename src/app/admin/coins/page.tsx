'use client';

import { useStore } from '@/store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, InfinityIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AdminCoins() {
  const { currentUser, setUnlimitedBalance } = useStore();
  const [showModal, setShowModal] = useState(false);

  const handleToggleUnlimited = () => {
    if (!currentUser || !currentUser.id) return;
    const newState = !currentUser.isUnlimited;
    setUnlimitedBalance(currentUser.id, newState);
    setShowModal(false);
    
    if (newState) {
      toast.success('∞ Mode Activated', {
        description: 'Your balance is now infinity and will never decrease on bets.'
      });
    } else {
      toast.success('∞ Mode Deactivated', {
        description: 'Standard balance mode restored.'
      });
    }
  };

  return (
    <div className="space-y-6 pt-4">
      <div className="exchange-gradient p-3 rounded-sm text-white">
        <h2 className="font-bold text-lg uppercase tracking-widest">Admin Control Panel</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white border-gold/30 shadow-[0_4px_10px_rgba(0,0,0,0.05)] relative overflow-hidden group border-2">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 text-gold">
              <Shield className="w-6 h-6" />
              <CardTitle className="uppercase tracking-widest text-lg font-bold text-black">Unlimited God Mode</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-500 font-medium">
              Toggle <span className="text-gold font-bold">Unlimited Balance (∞)</span> mode. This allows you to place bets without any balance deduction. A gold icon will appear globally on your profile.
            </p>
            
            <Button 
               onClick={() => setShowModal(true)}
               className={`w-full h-12 transition-all font-bold tracking-widest uppercase flex gap-2 border-none rounded-sm shadow-md ${currentUser?.isUnlimited ? 'bg-gray-200 text-gray-800' : 'bg-gold text-black hover:bg-yellow-500'}`}
            >
              <InfinityIcon className="w-5 h-5" />
              {currentUser?.isUnlimited ? 'Disable ∞ Mode' : 'Activate ∞ Mode'}
            </Button>

            <Dialog open={showModal} onOpenChange={setShowModal}>
              <DialogContent className="bg-white border-2 border-gold shadow-2xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl text-black font-bold uppercase tracking-widest">
                    Confirm ∞ Access
                  </DialogTitle>
                  <DialogDescription className="text-gray-600 font-medium py-3">
                    {currentUser?.isUnlimited 
                      ? 'Are you sure you want to return to standard balance operations?'
                      : 'Activating Unlimited mode will lock your balance at ∞. You can place as many bets as you want without any wallet deductions.'
                    }
                  </DialogDescription>
                </DialogHeader>
                <div className="flex gap-3 mt-4">
                  <Button variant="outline" className="flex-1 border-gray-300 font-bold" onClick={() => setShowModal(false)}>Cancel</Button>
                  <Button className="flex-1 bg-gold text-black font-bold hover:bg-yellow-500 uppercase tracking-widest" onClick={handleToggleUnlimited}>Confirm</Button>
                </div>
              </DialogContent>
            </Dialog>

          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 shadow-sm border-2">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 text-exchange-from">
               <span className="text-lg font-bold uppercase text-black">Update Platform Settings</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
             <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-gray-400">Commission Rate (%)</label>
                <input type="number" defaultValue="2.0" className="w-full bg-gray-50 border border-gray-200 p-3 text-[14px] font-bold focus:outline-none" />
             </div>
             <Button className="w-full bg-exchange-from hover:bg-exchange-to text-white font-bold uppercase py-6 rounded-sm">Save Global Config</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
