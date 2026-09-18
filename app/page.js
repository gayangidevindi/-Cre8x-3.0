'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useApp } from '../components/Providers';
import { PLACES, MODES, ROUTES } from '../lib/data';
import TransitIcon from '../components/TransitIcon';
import Skeleton from '../components/Skeleton';
import { haptic } from '../lib/feedback';

export default function Home() {
  const app = useApp();
  const router = useRouter();
  const [ask, setAsk] = useState('');
  const [hint, setHint] = useState('');
  const [error, setError] = useState('');
  const [modes, setModes] = useState(['pod', 'bus', 'train', 'air']);
  const [loading, setLoading] = useState(false);

  const toggleMode = (id) =>
    setModes((m) => (m.includes(id) ? m.filter((x) => x !== id) : [...m, id]));

  const plan = (routeId) => {
    if (!app.from.trim() || !app.to.trim()) {
      setError('Add both a start point and a destination before finding a route.');
      return;
    }
    if (app.from.trim().toLowerCase() === app.to.trim().toLowerCase()) {
      setError('Your start and destination are the same. Choose a different destination.');
      return;
    }
    if (modes.length === 0) {
      setError('Turn on at least one travel mode before finding a route.');
      return;
    }
    setError('');
    haptic();
    setLoading(true);
    app.set({ routeId });
    window.setTimeout(() => router.push('/journey'), 500);
  };

  const readAsk = () => {
    const text = ask.toLowerCase();
    const match = PLACES.find((p) => text.includes(p.toLowerCase().split(' ')[0]));
    if (match) {
      app.set({ to: match });
      setHint(`Set your destination to ${match}. Check the start point, then choose a route.`);
    } else if (text.trim()) {
      setHint('Type a place name, like "hospital" or "sky hub", and it will fill the box for you.');
    }
  };

  return (
    <>
      <section className="stack">
        <h1>Where are you going today?</h1>
        <p className="muted">One app for pods, buses, the maglev and sky shuttles. Pick your two points and Orbital handles the changes.</p>
      </section>

      <section className="card stack" aria-labelledby="plan-h">
        <h2 id="plan-h" className="sr">Plan a journey</h2>
        <div className="field">
          <label htmlFor="from">Start from</label>
          <input id="from" list="places" value={app.from} onChange={(e) => app.set({ from: e.target.value })} />
        </div>
        <div className="field">
          <label htmlFor="to">Going to</label>
          <input id="to" list="places" value={app.to} onChange={(e) => app.set({ to: e.target.value })} />
        </div>
        <datalist id="places">{PLACES.map((p) => <option key={p} value={p} />)}</datalist>
        <button className="btn ghost" onClick={() => app.set({ from: app.to, to: app.from })}>
          Swap start and destination
        </button>
        {error && <p className="badge warn" role="alert"><TransitIcon name="alert" size={15} /> {error}</p>}
        {loading ? <Skeleton lines={2} /> : <button className="btn primary" onClick={() => plan('calm')}>Find my routes</button>}
      </section>

      <section className="card stack complex" aria-labelledby="ask-h">
        <h2 id="ask-h">Or just say it</h2>
        <p className="muted">Write it the way you would say it. Orbital fills the boxes for you.</p>
        <div className="field">
          <label htmlFor="ask">Tell Orbital your trip</label>
          <input id="ask" placeholder="Take me to the hospital before 10" value={ask}
            onChange={(e) => setAsk(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && readAsk()} />
        </div>
        <button className="btn ghost" onClick={readAsk}>Fill the boxes for me</button>
        {hint && <p role="status" className="badge ok" style={{ padding: 12 }}>{hint}</p>}
      </section>

      <section className="stack complex" aria-labelledby="modes-h">
        <h2 id="modes-h">Ways to travel</h2>
        <p className="muted">Turn off anything you would rather not use.</p>
        <div className="row" style={{ flexWrap: 'wrap' }}>
          {MODES.map((m) => (
            <button key={m.id} className="chip" aria-pressed={modes.includes(m.id)} onClick={() => toggleMode(m.id)}>
              <TransitIcon name={m.icon} size={19} />{m.label}
            </button>
          ))}
        </div>
        {modes.length === 0 && <div className="card stack empty-state" role="status"><TransitIcon name="info" size={22} /><strong>No travel modes selected</strong><p className="muted">Turn on a pod, bus, train, or sky shuttle to see routes.</p></div>}
      </section>

      <section className="stack" aria-labelledby="quick-h">
        <h2 id="quick-h">Saved trips</h2>
        <a className="btn ghost" href="/network"><TransitIcon name="route" size={18} /> View full network</a>
        {ROUTES.map((r) => (
          <button key={r.id} className="card stack" style={{ textAlign: 'left', width: '100%' }} onClick={() => plan(r.id)}>
            <div className="between">
              <h3>{r.name}</h3>
              <span className={`badge ${r.status === 'warn' ? 'warn' : 'ok'}`}><TransitIcon name={r.status === 'warn' ? 'alert' : 'check'} size={14} /> {r.minutes} min</span>
            </div>
            <p>{r.plain}</p>
            <p className="muted complex">{r.changes} change{r.changes === 1 ? '' : 's'} · {r.walk} m of walking · {r.price}</p>
          </button>
        ))}
      </section>
    </>
  );
}
