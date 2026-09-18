export const NETWORK_STATUS = [
  { id: 'galle-coastal', mode: 'train', line: 'Galle Coastal Maglev', status: 'ok', note: 'on time' },
  { id: 'katunayake', mode: 'air', line: 'Katunayake Shuttle', status: 'warn', note: '1 delay' },
  { id: 'southern-expressway', mode: 'pod', line: 'Southern Expressway Smart Corridor', status: 'ok', note: 'clear' },
  { id: 'bus-138', mode: 'bus', line: 'Auto Bus 138', status: 'ok', note: 'on time' },
  { id: 'kandy-hill', mode: 'train', line: 'Kandy Hill Line', status: 'ok', note: 'quiet service' }
];

export const NETWORK_LINES = [
  { id: 'pod-line', mode: 'pod', name: 'Southern Expressway Smart Corridor', color: '#FF7A00', points: '34,270 90,220 146,246 208,170 274,196', stops: ['Colombo Port City Terminal', 'Bolgoda Lagoon Gardens', 'Lotus Tower Hub'] },
  { id: 'bus-line', mode: 'bus', name: 'Auto Bus 138', color: '#E8432E', points: '38,104 96,150 150,112 218,128 282,84', stops: ['Pettah Central', 'Moratuwa University Ring', 'Lotus Tower Hub'] },
  { id: 'maglev-line', mode: 'train', name: 'Galle Coastal Maglev', color: '#FFA24D', points: '32,330 92,278 154,292 214,238 286,262', stops: ['Colombo Port City Terminal', 'Bolgoda Lagoon Gardens', 'Ratmalana Sky Hub'] },
  { id: 'sky-line', mode: 'air', name: 'Katunayake Shuttle', color: '#FFC078', points: '70,66 142,92 208,58 278,110', stops: ['Katunayake Skyport', 'Lotus Tower Hub', 'Ratmalana Sky Hub'] }
];

export const statusForLine = (line, mode) => {
  const words = line.toLowerCase().split(' ').filter((word) => word.length > 3);
  return NETWORK_STATUS.find((item) => words.some((word) => item.line.toLowerCase().includes(word)))
    || NETWORK_STATUS.find((item) => item.mode === mode)
    || NETWORK_STATUS[0];
};
