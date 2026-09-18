'use client';
import { useEffect, useRef, useState } from 'react';
import { useApp } from '../../components/Providers';
import { findRoute, modeOf, MAP_PATH, STOPS } from '../../lib/data';
import TransitIcon from '../../components/TransitIcon';
import { useLiveClock } from '../../lib/useLiveClock';
import { haptic } from '../../lib/feedback';
import Skeleton from '../../components/Skeleton';

export default function Track() {
  const app = useApp();
  const route = findRoute(app.routeId);
  const [step, setStep] = useState(app.progress || 0);
  const [target, setTarget] = useState(app.progress || 0);
  const [view, setView] = useState('map');
  const [mapLoading, setMapLoading] = useState(true);
  const [signalDismissed, setSignalDismissed] = useState(false);
  const spoken = useRef(-1);
  const signalActive = app.weakSignal;
  const updated = useLiveClock(signalActive ? 'weak' : 'live');

  useEffect(() => {
    setMapLoading(true);
    const timer = window.setTimeout(() => setMapLoading(false), 500);
    return () => window.clearTimeout(timer);
  }, [app.routeId]);

  useEffect(() => {
    if (!app.weakSignal && Math.random() < 0.1) app.set({ weakSignal: true });
  // Simulate a brief connection drop for the demo.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!signalActive) return undefined;
    const timer = window.setTimeout(() => app.set({ weakSignal: false }), 6000);
    return () => window.clearTimeout(timer);
  }, [signalActive]);

  useEffect(() => {
    if (app.motion === 'off' || signalActive) return;
    const t = setInterval(() => setTarget((s) => (s < MAP_PATH.length - 1 ? s + 1 : s)), 2600);
    return () => clearInterval(t);
  }, [app.motion, signalActive]);

  useEffect(() => {
    let frame;
    const ease = () => {
      setStep((current) => {
        const next = current + (target - current) * 0.08;
        return Math.abs(target - next) < 0.01 ? target : next;
      });
      frame = requestAnimationFrame(ease);
    };
    if (app.motion === 'off') setStep(target);
    else frame = requestAnimationFrame(ease);
    return () => cancelAnimationFrame(frame);
  }, [target, app.motion]);

  useEffect(() => { app.set({ progress: target, journeyStarted: true }); }, [target]);

  const discreteStep = Math.floor(step);
  const stopIdx = STOPS.filter((s) => s.at <= discreteStep).length - 1;
  const current = STOPS[Math.max(0, stopIdx)];
  const next = STOPS[Math.min(STOPS.length - 1, stopIdx + 1)];
  const left = Math.max(0, Math.round(((MAP_PATH.length - 1 - step) / (MAP_PATH.length - 1)) * route.minutes));
  const confidence = Math.min(99, Math.round(route.confidence + step * .35));
  const plain = step >= MAP_PATH.length - 1
    ? `You have arrived at ${STOPS[STOPS.length - 1].name}.`
    : `You are moving. Next stop is ${next.name}, about ${left} minutes to the end.`;

  useEffect(() => {
    if (spoken.current !== stopIdx) { spoken.current = stopIdx; app.say(plain); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stopIdx]);

  const pathIndex = Math.min(MAP_PATH.length - 2, Math.floor(step));
  const fraction = step - pathIndex;
  const [ax, ay] = MAP_PATH[pathIndex];
  const [bx, by] = MAP_PATH[Math.min(MAP_PATH.length - 1, pathIndex + 1)];
  const x = ax + (bx - ax) * fraction;
  const y = ay + (by - ay) * fraction;
  const line = MAP_PATH.map((p) => p.join(',')).join(' ');
  const done = MAP_PATH.slice(0, pathIndex + 1).concat([[x, y]]).map((p) => p.join(',')).join(' ');

  if (app.arrived || step >= MAP_PATH.length - 1) {
    return (
      <section className="completion card stack reveal" aria-labelledby="arrived-h">
        <span className="completion-mark"><TransitIcon name="check" size={34} /></span>
        <p className="eyebrow">Journey complete</p>
        <h1 id="arrived-h">You made it to {app.to}.</h1>
        <p>Your route stayed on plan. Here is what this trip saved.</p>
        <div className="stat-grid">
          <div><strong>{route.minutes} min</strong><span>travel time</span></div>
          <div><strong>{route.walk} m</strong><span>walking</span></div>
          <div><strong>1.8 kg</strong><span>CO2 saved</span></div>
        </div>
        <button className="btn" onClick={() => { app.set({ arrived: false, journeyStarted: false, progress: 0 }); setStep(0); setTarget(0); }}>Plan another journey</button>
        <button className="btn ghost" onClick={() => app.say(`Journey complete. You travelled for ${route.minutes} minutes and saved 1.8 kilograms of carbon dioxide.`)}>Read summary out loud</button>
      </section>
    );
  }

  if (mapLoading) return <section className="card"><Skeleton lines={4} /></section>;

  return (
    <>
      <section className="card stack" role="status" aria-live="polite" style={{ borderColor: 'var(--teal)' }}>
        {signalActive && !signalDismissed && <div className="card signal-banner stack" role="alert"><div className="between"><div className="row"><TransitIcon name="alert" size={20} /><strong>Weak signal</strong></div><button className="chip" onClick={() => setSignalDismissed(true)}>Dismiss</button></div><p>Showing your last known position from 6 seconds ago.</p><button className="btn ghost" onClick={() => { haptic(); setSignalDismissed(false); app.set({ weakSignal: false }); }}>Signal restored</button></div>}
        <h1>{plain}</h1>
        <p>You are on the {modeOf(route.legs[0].mode).label.toLowerCase()}. Stay on until <strong>{next.name}</strong>.</p>
        <div className="row" style={{ flexWrap: 'wrap' }}>
          <span className="badge ok"><TransitIcon name="check" size={14} /> {left} min left</span>
          <span className="badge complex" style={{ opacity: signalActive ? .62 : 1 }}>Now passing {current.name}</span>
        </div>
        <div className="forecast"><div className="between"><strong>Confidence forecast</strong><strong>{confidence}%</strong></div><div className="confidence-bar"><i style={{ width: `${confidence}%` }} /></div><p className="muted">{confidence > 90 ? 'No obstructions ahead.' : 'A busy interchange may add a minute.'} · {updated}</p></div>
      </section>

      <div className="row">
        <button className="chip" aria-pressed={view === 'map'} onClick={() => setView('map')}>Show map</button>
        <button className="chip" aria-pressed={view === 'list'} onClick={() => setView('list')}>Show as a list</button>
      </div>

      {view === 'map' ? (
        <section className="card" aria-labelledby="map-h">
          <h2 id="map-h" className="sr">Map of your journey</h2>
          <svg viewBox="0 0 320 380" width="100%" height="auto" role="img"
            aria-label={`Map. You are between ${current.name} and ${next.name}.`}>
            <rect width="320" height="380" rx="14" fill="var(--surface-2)" />
            {[60, 140, 220, 300].map((g) => (
              <line key={g} x1="0" y1={g} x2="320" y2={g} stroke="var(--line)" strokeWidth="1" />
            ))}
            <polyline points={line} fill="none" stroke="var(--line)" strokeWidth="10" strokeLinecap="round" />
            <polyline points={done} fill="none" stroke="var(--teal)" strokeWidth="10" strokeLinecap="round" />
            {STOPS.map((s) => {
              const [sx, sy] = MAP_PATH[s.at];
              return (
                <g key={s.name}>
                  <circle cx={sx} cy={sy} r="9" fill="var(--night)" stroke="var(--ink)" strokeWidth="3" />
                  <text x={sx + 16} y={sy + 5} fill="var(--ink)" fontSize="13">{s.name}</text>
                </g>
              );
            })}
            <circle className="pulse" cx={x} cy={y} r="22" fill="var(--gold)" opacity=".3" />
            <circle cx={x} cy={y} r="12" fill="var(--gold)" stroke="var(--night)" strokeWidth="3" />
            <text x={x - 34} y={y - 24} fill="var(--gold)" fontSize="14" fontWeight="700">You</text>
          </svg>
          <p className="muted" style={{ marginTop: 10 }}>The gold dot is you. The green line is the part you have already travelled.</p>
        </section>
      ) : (
        <section className="card stack" aria-labelledby="list-h">
          <h2 id="list-h">Stops on this journey</h2>
          {STOPS.map((s, i) => (
            <div className="between" key={s.name} style={{ padding: '10px 0', borderBottom: '1px dashed var(--line)' }}>
              <span>{i + 1}. {s.name}</span>
              <span className={`badge ${i < stopIdx ? '' : i === stopIdx ? 'ok' : 'complex'}`}>
                {i < stopIdx ? <><TransitIcon name="check" size={14} /> Passed</> : i === stopIdx ? <><TransitIcon name="live" size={14} /> You are here</> : 'Coming up'}
              </span>
            </div>
          ))}
        </section>
      )}

      <section className="card stack">
        <h2>Need a hand?</h2>
        <button className="btn ghost" onClick={() => app.say(`${plain} Confidence is ${confidence} percent.`)}><TransitIcon name="live" size={18} /> Explain this screen</button>
        <button className="btn primary" onClick={() => { haptic(); app.set({ arrived: true, progress: MAP_PATH.length - 1, journeyStarted: false }); setStep(MAP_PATH.length - 1); setTarget(MAP_PATH.length - 1); }}>I have arrived</button>
        <p className="muted">A station helper can meet you at {next.name}. Ask at any door panel or press the round blue button on board.</p>
      </section>
    </>
  );
}
