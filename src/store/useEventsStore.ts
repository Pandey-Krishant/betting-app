import { create } from 'zustand';

export interface Price {
  price: number;
  size: number;
}

export interface Runner {
  selectionId: string | number;
  status: string;
  price: {
    back: Price[];
    lay: Price[];
  };
}

export interface Event {
  _id: string;
  marketId: string;
  marketName: string;
  eventName: string;
  sportId: string;
  sportName: string;
  eventTime: string;
  tournamentName: string;
  isFancy: boolean;
  isBookmakers: boolean;
  isSportsbook: boolean;
  popular?: boolean;
  oddsData: {
    inPlay: boolean;
    totalMatched: number;
    status: string;
    runners: Runner[];
  };
  runnersData: Record<string, string>;
}

interface EventsState {
  events: Event[];
  lastPrices: Record<string, number>; // To track price movement for flashing
  setEvents: (eventMap: Record<string, Event[]>) => void;
  updateOdds: () => void;
}

const mockEvents: Event[] = [
  {
    _id: "1002026417153119379",
    marketId: "1.256688270",
    marketName: "Match Odds",
    eventName: "Wellington Phoenix v Western Sydney Wanderers",
    sportId: "1",
    sportName: "Soccer",
    eventTime: "2026-04-18T05:00:00.000Z",
    tournamentName: "Australian Soccer",
    isFancy: false,
    isBookmakers: false,
    isSportsbook: false,
    popular: true,
    oddsData: {
      inPlay: true,
      totalMatched: 85114,
      status: "OPEN",
      runners: [
        { 
          selectionId: 2469649, 
          status: "ACTIVE",
          price: {
            back: [{price: 1.11, size: 136.55}, {price: 1.1, size: 578.35}, {price: 1.09, size: 170.3}],
            lay: [{price: 1.13, size: 612.24}, {price: 1.14, size: 274.46}, {price: 1.15, size: 481.89}]
          }
        },
        { 
          selectionId: 6480414, 
          status: "ACTIVE",
          price: {
            back: [{price: 1.45, size: 100.69}, {price: 1.01, size: 4261.19}, {price: 0, size: 0}],
            lay: [{price: 0, size: 0}, {price: 0, size: 0}, {price: 0, size: 0}]
          }
        },
        { 
          selectionId: 58805, 
          status: "ACTIVE",
          price: {
            back: [{price: 8.6, size: 103.61}, {price: 7.6, size: 111.66}, {price: 1.01, size: 131.47}],
            lay: [{price: 18, size: 138.84}, {price: 24, size: 202.43}, {price: 1000, size: 18.38}]
          }
        }
      ]
    },
    runnersData: {
      "58805": "The Draw",
      "2469649": "Wellington Phoenix",
      "6480414": "Western Sydney Wanderers"
    }
  },
  {
    _id: "1002026417153117871",
    marketId: "1.256688165",
    marketName: "Match Odds",
    eventName: "Brisbane Roar v Melbourne City",
    sportId: "1",
    sportName: "Soccer",
    eventTime: "2026-04-18T07:00:00.000Z",
    tournamentName: "Australian Soccer",
    isFancy: false,
    isBookmakers: false,
    isSportsbook: false,
    popular: true,
    oddsData: {
      inPlay: false,
      totalMatched: 10713,
      status: "OPEN",
      runners: [
        { 
          selectionId: 3862627, 
          status: "ACTIVE",
          price: {
            back: [{price: 3.8, size: 372.36}, {price: 3.75, size: 527.71}, {price: 3.7, size: 462.59}],
            lay: [{price: 3.95, size: 666.71}, {price: 4, size: 376.93}, {price: 4.1, size: 1488.91}]
          }
        },
        { 
          selectionId: 8586946, 
          status: "ACTIVE",
          price: {
            back: [{price: 2.1, size: 788.84}, {price: 2.08, size: 2123.58}, {price: 2.06, size: 1672.45}],
            lay: [{price: 2.14, size: 695.48}, {price: 2.16, size: 194.77}, {price: 2.18, size: 2399.95}]
          }
        },
        { 
          selectionId: 58805, 
          status: "ACTIVE",
          price: {
            back: [{price: 3.65, size: 946.72}, {price: 3.6, size: 231.43}, {price: 3.55, size: 750.96}],
            lay: [{price: 3.75, size: 1344.97}, {price: 3.85, size: 1055.77}, {price: 3.9, size: 150.56}]
          }
        }
      ]
    },
    runnersData: {
      "58805": "The Draw",
      "3862627": "Brisbane Roar",
      "8586946": "Melbourne City"
    }
  },
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
    // Sport ID to Name mapping for UI tabs
    const sportMap: Record<string, string> = {
      "4": "Cricket",
      "1": "Football",
      "2": "Tennis",
      "7": "Horse Racing",
      "4339": "Greyhounds"
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
        oddsData: {
          ...event.oddsData,
          runners: updatedRunners
        }
      };
    });

    set({ events: updatedEvents });
  }
}));
