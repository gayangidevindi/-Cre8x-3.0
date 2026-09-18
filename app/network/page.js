'use client';

import { useEffect, useState } from 'react';
import TransitIcon from '../../components/TransitIcon';
import { NETWORK_LINES, statusForLine } from '../../lib/network';
import { useLiveClock } from '../../lib/useLiveClock';

export default function Network() {
  const [selected, setSelected] = useState(NETWORK_LINES[2]);
  const [selectedStop, setSelectedStop] = useState('');
  const updated = useLiveClock(selected.id);
  const status = statusForLine(selected.name, selected.mode);

  useEffect(() => {
    const lineId = new URLSearchParams(window.location.search).get('line');
    const line = NETWORK_LINES.find((item) => item.id === lineId);
    if (line) setSelected(line);
  }, []);

  return (
    <>
      <section className="stack reveal">
        <p className="eyebrow">Orbital network</p>
        <h1>Every line, one view.</h1>
        <p className="muted">Tap a line or stop to see what is moving across the city right now.</p>
      </section>
      <section className="card network-card" aria-labelledby="network-map-h">
        <h2 id="network-map-h" className="sr">City network map</h2>
        <svg className="network-map" viewBox="0 0 320 380" role="img" aria-label="Orbital city network map">
          <rect width="320" height="380" rx="16" fill="var(--surface-2)" />
          {[70, 145, 220, 295].map((y) => <line key={y} x1="0" y1={y} x2="320" y2={y} stroke="var(--line)" strokeWidth="1" opacity=".5" />)}
          {NETWORK_LINES.map((line) => (
            <g key={line.id} role="button" tabIndex="0" aria-label={`Show ${line.name} status`} onClick={() => setSelected(line)} onKeyDown={(event) => event.key === 'Enter' && setSelected(line)}>
              <polyline points={line.points} fill="none" stroke={line.color} strokeWidth={selected.id === line.id ? 8 : 5} strokeLinecap="round" opacity={selected.id === line.id ? 1 : .72} />
              {line.stops.map((stop, index) => {
                const [x, y] = line.points.split(' ')[index].split(',');
                return <circle key={`${line.id}-${stop}`} role="button" tabIndex="0" aria-label={`Show ${stop} on ${line.name}`} onClick={(event) => { event.stopPropagation(); setSelected(line); setSelectedStop(stop); }} onKeyDown={(event) => { if (event.key === 'Enter') { event.stopPropagation(); setSelected(line); setSelectedStop(stop); } }} cx={x} cy={y} r={selectedStop === stop && selected.id === line.id ? 9 : selected.id === line.id ? 7 : 5} fill="var(--night)" stroke={line.color} strokeWidth="3" />;
              })}
            </g>
          ))}
        </svg>
        <div className="network-legend">
          {NETWORK_LINES.map((line) => <button className="chip" key={line.id} onClick={() => setSelected(line)}><span className="legend-line" style={{ background: line.color }} />{line.name}</button>)}
        </div>
      </section>
      <section className="card stack route-switch" key={selected.id} aria-live="polite">
        <div className="between"><div className="row"><TransitIcon name={selected.mode} size={21} /><h2>{selected.name}</h2></div><span className={`badge ${status.status === 'warn' ? 'warn' : 'ok'}`}><span className={`status-dot ${status.status}`} aria-hidden="true"><span /></span>{status.status === 'warn' ? 'Attention' : 'Clear'}</span></div>
        <p>{selectedStop ? `${selectedStop} is served by ${selected.name}. ` : ''}{status.line} is {status.note}. Stops include {selected.stops.join(', ')}.</p>
        <p className="muted">{updated}</p>
      </section>
    </>
  );
}