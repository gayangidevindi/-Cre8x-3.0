'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
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
  const [swapping, setSwapping] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [destinationFocused, setDestinationFocused] = useState(false);

  useEffect(() => {
    if (app.motion === 'off') {
      setMounted(true);
      return undefined;
    }
    const timer = window.setTimeout(() => setMounted(true), 60);
    return () => window.clearTimeout(timer);
  }, [app.motion]);

  useEffect(() => {
    if (!app.ready) return;
    const patch = {};
    if (app.homeStop) patch.from = app.homeStop;
    if (app.frequentDestination) patch.to = app.frequentDestination;
    if (Object.keys(patch).length) app.set(patch);
    // Apply profile stops once when Home opens; both fields remain editable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [app.ready]);

  const toggleMode = (id) =>
    setModes((m) => (m.includes(id) ? m.filter((x) => x !== id) : [...m, id]));

  const suggestions = destinationFocused && app.to.trim()
    ? PLACES.filter((place) => place.toLowerCase().includes(app.to.toLowerCase())).slice(0, 5)
    : [];

  const swapPlaces = () => {
    setSwapping(true);
    window.setTimeout(() => {
      app.set({ from: app.to, to: app.from });
      setSwapping(false);
    }, 180);
  };

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
      setHint('Type a place name, like "Pettah" or "Lotus Tower", and it will fill the box for you.');
    }
  };

  return (
    <>
      <section className="stack">
        <h1>{app.profileName ? `Where are you going, ${app.profileName}?` : 'Where are you going today?'}</h1>
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
          <input id="to" list="places" value={app.to} onFocus={() => setDestinationFocused(true)} onBlur={() => window.setTimeout(() => setDestinationFocused(false), 120)} onChange={(e) => app.set({ to: e.target.value })} aria-expanded={suggestions.length > 0} aria-controls="destination-suggestions" />
        </div>
        {suggestions.length > 0 && <div className="suggestions" id="destination-suggestions" role="listbox" aria-label="Matching destinations">
          {suggestions.map((place) => <button key={place} className="suggestion" role="option" onClick={() => app.set({ to: place })}>{place}<span aria-hidden="true">↗</span></button>)}
        </div>}
        {(app.homeStop || app.frequentDestination) && <p className="muted">Your profile filled these in. You can change either place for this search.</p>}
        <datalist id="places">{PLACES.map((p) => <option key={p} value={p} />)}</datalist>
        <button className={`btn ghost ${swapping ? 'swap-active' : ''}`} onClick={swapPlaces}>
          Swap start and destination
        </button>
        {app.from.trim() && app.to.trim() && <p className="route-preview" role="status"><TransitIcon name="route" size={15} /> 3 routes found for this trip</p>}
        {error && <p className="badge warn" role="alert"><TransitIcon name="alert" size={15} /> {error}</p>}
        {loading ? <Skeleton lines={2} /> : <button className="btn primary" onClick={() => plan('calm')}>Find my routes</button>}
      </section>

      <section className="card stack complex" aria-labelledby="ask-h">
        <h2 id="ask-h">Or just say it</h2>
        <p className="muted">Write it the way you would say it. Orbital fills the boxes for you.</p>
        <div className="field">
          <label htmlFor="ask">Tell Orbital your trip</label>
          <input id="ask" placeholder="Take me to Lotus Tower Hub before 10" value={ask}
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
        <p className="muted mode-count" role="status">{modes.length} of {MODES.length} modes selected</p>
        {modes.length === 0 && <div className="card stack empty-state" role="status"><TransitIcon name="info" size={22} /><strong>No travel modes selected</strong><p className="muted">Turn on a pod, bus, train, or sky shuttle to see routes.</p></div>}
      </section>

      <section className="stack" aria-labelledby="quick-h">
        <h2 id="quick-h">Saved trips</h2>
        <a className="btn ghost" href="/network"><TransitIcon name="route" size={18} /> View full network</a>
        {ROUTES.map((r, index) => (
          <button key={r.id} className={`card stack saved-trip ${mounted ? 'is-mounted' : ''}`} style={{ textAlign: 'left', width: '100%', '--stagger': `${index * 60}ms` }} onClick={() => plan(r.id)}>
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
