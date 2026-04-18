import { create } from 'zustand';
import { Event } from '@/types/betting';

interface EventsState {
  events: Event[];
  lastPrices: Record<string, number>; 
  setEvents: (eventMap: Record<string, Event[]>) => void;
  updateOdds: () => void;
}

const mockEvents: Event[] = [
  {
    _id: "c1",
    marketId: "1.001",
    marketName: "Match Odds",
    eventName: "Mumbai Indians v Chennai Super Kings",
    sportId: "4",
    sportName: "Cricket",
    eventTime: new Date().toISOString(),
    tournamentName: "IPL 2026",
    isFancy: true,
    isBookmakers: true,
    isSportsbook: true,
    popular: true,
    runnersData: { "1": "Mumbai Indians", "2": "Chennai Super Kings" },
    oddsData: {
      inPlay: true,
      totalMatched: 24500000,
      status: "OPEN",
      runners: [
        { selectionId: 1, status: "ACTIVE", price: { back: [{price: 1.85, size: 4500}, {price: 1.84, size: 12000}, {price: 1.83, size: 25000}], lay: [{price: 1.86, size: 8500}, {price: 1.87, size: 15000}, {price: 1.88, size: 30000}] } },
        { selectionId: 2, status: "ACTIVE", price: { back: [{price: 2.12, size: 3200}, {price: 2.10, size: 11000}, {price: 2.08, size: 22000}], lay: [{price: 2.14, size: 9000}, {price: 2.16, size: 14000}, {price: 2.18, size: 28000}] } }
      ]
    }
  }
];

export const useEventsStore = create<EventsState>((set, get) => ({
  events: mockEvents,
  lastPrices: {},
  setEvents: (eventMap) => {
    const sportMap: Record<string, string> = {
      "4": "Cricket", "1": "Football", "2": "Tennis", "7": "Horse Racing", "4339": "Greyhounds",
      "7522": "Basketball", "1477": "Kabaddi", "3503": "Darts", "5": "Rugby", "23789": "Politics"
    };

    const allEvents = Object.entries(eventMap).flatMap(([id, events]) => {
      return (events || []).map(event => ({
        ...event,
        sportName: sportMap[id] || event.sportName || "Other"
      }));
    });
    
    set({ events: allEvents });
  },
  updateOdds: () => {
    const { events } = get();
    const updatedEvents = events.map(event => {
      if (!event.oddsData.inPlay) return event;
      
      const updatedRunners = event.oddsData.runners.map(runner => {
        const back = runner.price.back.map(p => ({
          ...p,
          price: p.price > 0 ? Number((p.price + (Math.random() * 0.04 - 0.02)).toFixed(2)) : 0
        }));
        const lay = runner.price.lay.map(p => ({
          ...p,
          price: p.price > 0 ? Number((p.price + (Math.random() * 0.04 - 0.02)).toFixed(2)) : 0
        }));
        return { ...runner, price: { back, lay } };
      });

      return {
        ...event,
        oddsData: { ...event.oddsData, runners: updatedRunners }
      };
    });

    set({ events: updatedEvents });
  }
}));
