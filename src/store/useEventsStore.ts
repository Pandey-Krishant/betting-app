import { create } from 'zustand';
import { Event } from '@/types/betting';

interface EventsState {
  events: Event[];
  lastPrices: Record<string, number>; 
  setEvents: (payload: unknown) => void;
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
  setEvents: (payload) => {
    const sportMap: Record<string, string> = {
      "4": "Cricket", "1": "Football", "2": "Tennis", "7": "Horse Racing", "4339": "Greyhounds",
      "7522": "Basketball", "1477": "Kabaddi", "3503": "Darts", "5": "Rugby",
      // Observed keys from `allEventsList`
      "66103": "Casino", "2378961": "Politics",
      // Legacy
      "23789": "Politics"
    };

    const normalizeSportName = (name: unknown) => {
      const raw = (typeof name === 'string' ? name : '').trim();
      if (!raw) return 'Other';

      const key = raw.toLowerCase().replace(/\s+/g, ' ');
      const aliases: Record<string, string> = {
        cricket: 'Cricket',
        football: 'Football',
        soccer: 'Football',
        tennis: 'Tennis',
        'horse racing': 'Horse Racing',
        horse: 'Horse Racing',
        greyhounds: 'Greyhounds',
        greyhound: 'Greyhounds',
        basketball: 'Basketball',
        kabaddi: 'Kabaddi',
        kabadi: 'Kabaddi',
        kabbadi: 'Kabaddi',
        politics: 'Politics',
        casino: 'Casino'
      };

      return aliases[key] || raw;
    };

    const unwrap = (value: any): any => {
      if (!value || typeof value !== 'object') return value;
      return value.data ?? value.result ?? value.events ?? value.allEventsList ?? value;
    };

    const normalized = unwrap(payload);

    const isRecordOfArrays = (value: any): value is Record<string, any[]> => {
      if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
      const values = Object.values(value);
      return values.length > 0 && values.every(v => Array.isArray(v));
    };

    let allEvents: Event[] = [];

    const normalizeOddsData = (event: any) => {
      const rawOdds = event?.oddsData ?? event?.odds ?? {};
      const statusUpper = typeof event?.status === 'string' ? event.status.toUpperCase() : '';
      const inPlayRaw =
        rawOdds?.inPlay ??
        event?.inPlay ??
        event?.inplay ??
        event?.isInPlay ??
        event?.in_play ??
        (statusUpper === 'INPLAY' || statusUpper === 'IN_PLAY' || statusUpper === 'IN-PLAY');

      const totalMatchedRaw = rawOdds?.totalMatched ?? event?.totalMatched ?? event?.matched ?? 0;
      const status = rawOdds?.status ?? event?.marketStatus ?? event?.status ?? 'OPEN';
      const runners = rawOdds?.runners ?? event?.runners ?? [];

      return {
        inPlay: !!inPlayRaw,
        totalMatched: Number(totalMatchedRaw) || 0,
        status: typeof status === 'string' ? status : 'OPEN',
        runners: Array.isArray(runners) ? runners : []
      };
    };

    if (Array.isArray(normalized)) {
      // Array of events coming directly from API
      allEvents = normalized.map((event: any) => ({
        ...event,
        sportName: normalizeSportName(sportMap[event?.sportId?.toString?.()] || event?.sportName),
        oddsData: normalizeOddsData(event)
      }));
    } else if (isRecordOfArrays(normalized)) {
      // Map keyed by sportId
      allEvents = Object.entries(normalized).flatMap(([id, events]) => {
        return (events || []).map((event: any) => ({
          ...event,
          sportId: event?.sportId ?? id,
          sportName: normalizeSportName(sportMap[id] || sportMap[event?.sportId?.toString?.()] || event?.sportName),
          oddsData: normalizeOddsData(event)
        }));
      });
    } else if (normalized && typeof normalized === 'object') {
      // Sometimes the payload is `{ <sportId>: { ...event } }` or other odd shapes.
      const values = Object.values(normalized as Record<string, any>);
      const flattened = values.flatMap(v => (Array.isArray(v) ? v : v ? [v] : []));
      allEvents = flattened.map((event: any) => ({
        ...event,
        sportName: normalizeSportName(sportMap[event?.sportId?.toString?.()] || event?.sportName),
        oddsData: normalizeOddsData(event)
      }));
    }
    
    set({ events: allEvents });
  },
  updateOdds: () => {
    const { events } = get();
    const updatedEvents = events.map(event => {
      if (!(event.oddsData?.inPlay ?? false)) return event;
      
      const updatedRunners = (event.oddsData?.runners ?? []).map(runner => {
        const back = (runner.price?.back ?? []).map(p => ({
          ...p,
          price: p.price > 0 ? Number((p.price + (Math.random() * 0.04 - 0.02)).toFixed(2)) : 0
        }));
        const lay = (runner.price?.lay ?? []).map(p => ({
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
