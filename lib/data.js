export const PLACES = [
  'Harbour Terrace', 'Skyport North', 'Meridian Hospital', 'Old Town Plaza',
  'Lagoon Gardens', 'Cloudline Tower', 'University Ring', 'Ratmalana Sky Hub'
];

export const MODES = [
  { id: 'pod',   label: 'Smart road pod', icon: 'pod', note: 'Self-driving pod on the smart road' },
  { id: 'bus',   label: 'Auto bus',       icon: 'bus', note: 'Driverless street bus' },
  { id: 'train', label: 'Maglev line',    icon: 'train', note: 'Magnetic train, runs every 90 seconds' },
  { id: 'air',   label: 'Sky shuttle',    icon: 'air', note: 'Short flight between sky hubs' }
];

export const modeOf = (id) => MODES.find((m) => m.id === id) || MODES[0];

export const ROUTES = [
  {
    id: 'calm',
    name: 'Calmest way',
    plain: 'Fewest changes. Good if you want an easy trip.',
    minutes: 34, walk: 120, changes: 1, seats: 'Seats free', crowd: 'Quiet',
    price: 'Cr 4.20', confidence: 96, status: 'ok', statusText: 'Running on time',
    legs: [
      { mode: 'pod', from: 'Harbour Terrace', to: 'Meridian Interchange', depart: '09:04', arrive: '09:16', detail: 'Pod 22 picks you up at the door', access: 'Step-free, ramp folds out' },
      { mode: 'train', from: 'Meridian Interchange', to: 'Ratmalana Sky Hub', depart: '09:22', arrive: '09:38', detail: 'Maglev Line 2, car 3 is quietest', access: 'Level boarding, priority seats' }
    ]
  },
  {
    id: 'fast',
    name: 'Fastest way',
    plain: 'Quickest, but you change three times.',
    minutes: 21, walk: 340, changes: 2, seats: 'Standing likely', crowd: 'Busy',
    price: 'Cr 7.80', confidence: 78, status: 'warn', statusText: 'Sky shuttle delayed 6 min',
    legs: [
      { mode: 'bus', from: 'Harbour Terrace', to: 'Cloudline Tower', depart: '09:02', arrive: '09:09', detail: 'Auto bus 14, arrives in 3 min', access: 'Ramp on request' },
      { mode: 'air', from: 'Cloudline Tower', to: 'Skyport North', depart: '09:14', arrive: '09:19', detail: 'Sky shuttle SH-7 · delayed 6 min', access: 'Lift to deck 4' },
      { mode: 'pod', from: 'Skyport North', to: 'Ratmalana Sky Hub', depart: '09:27', arrive: '09:33', detail: 'Pod waits for your shuttle', access: 'Step-free' }
    ]
  },
  {
    id: 'flat',
    name: 'Step-free way',
    plain: 'No stairs, no rush. Lifts and ramps the whole way.',
    minutes: 41, walk: 60, changes: 1, seats: 'Seats reserved', crowd: 'Quiet',
    price: 'Cr 4.20', confidence: 93, status: 'ok', statusText: 'All lifts working',
    legs: [
      { mode: 'pod', from: 'Harbour Terrace', to: 'Lagoon Gardens', depart: '09:06', arrive: '09:21', detail: 'Pod 08, extra space for a wheelchair', access: 'Ramp, no transfer walk' },
      { mode: 'train', from: 'Lagoon Gardens', to: 'Ratmalana Sky Hub', depart: '09:28', arrive: '09:47', detail: 'Maglev Line 5, door 1 is nearest the lift', access: 'Lift at both ends' }
    ]
  }
];

export const findRoute = (id) => ROUTES.find((r) => r.id === id) || ROUTES[0];

// Path points for the live map (viewBox 0 0 320 380)
export const MAP_PATH = [
  [40, 340], [70, 300], [96, 262], [130, 240], [168, 226],
  [196, 194], [214, 156], [242, 124], [262, 88], [280, 54]
];

export const STOPS = [
  { at: 0, name: 'Harbour Terrace' },
  { at: 3, name: 'Meridian Interchange' },
  { at: 6, name: 'Lagoon Gardens' },
  { at: 9, name: 'Ratmalana Sky Hub' }
];
