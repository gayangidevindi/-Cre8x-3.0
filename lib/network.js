export const NETWORK_STATUS = [
  { id: 'maglev-2', mode: 'train', line: 'Maglev Line 2', status: 'ok', note: 'on time' },
  { id: 'sky', mode: 'air', line: 'Sky shuttles', status: 'warn', note: '1 delay' },
  { id: 'roads', mode: 'pod', line: 'Smart roads', status: 'ok', note: 'clear' },
  { id: 'bus-14', mode: 'bus', line: 'Auto bus 14', status: 'ok', note: 'on time' },
  { id: 'maglev-5', mode: 'train', line: 'Maglev Line 5', status: 'ok', note: 'quiet service' }
];

export const NETWORK_LINES = [
  { id: 'pod-line', mode: 'pod', name: 'Pod loop', color: '#FF7A00', points: '34,270 90,220 146,246 208,170 274,196', stops: ['Harbour Terrace', 'Meridian Interchange', 'Cloudline Tower'] },
  { id: 'bus-line', mode: 'bus', name: 'Auto bus 14', color: '#E8432E', points: '38,104 96,150 150,112 218,128 282,84', stops: ['Old Town Plaza', 'University Ring', 'Cloudline Tower'] },
  { id: 'maglev-line', mode: 'train', name: 'Maglev Line 2', color: '#FFA24D', points: '32,330 92,278 154,292 214,238 286,262', stops: ['Harbour Terrace', 'Lagoon Gardens', 'Ratmalana Sky Hub'] },
  { id: 'sky-line', mode: 'air', name: 'Sky shuttle', color: '#FFC078', points: '70,66 142,92 208,58 278,110', stops: ['Skyport North', 'Cloudline Tower', 'Ratmalana Sky Hub'] }
];

export const statusForLine = (line, mode) => NETWORK_STATUS.find((item) =>
  item.mode === mode || item.line.toLowerCase().includes(line.toLowerCase().split(' ')[0])
) || NETWORK_STATUS[0];
