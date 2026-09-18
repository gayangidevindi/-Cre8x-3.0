'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useApp } from '../../components/Providers';
import { ROUTES, findRoute, modeOf } from '../../lib/data';
import TransitIcon from '../../components/TransitIcon';
import Skeleton from '../../components/Skeleton';
import { useLiveClock } from '../../lib/useLiveClock';
import { haptic } from '../../lib/feedback';

const isStepFree = (route) => route.legs.every((leg) => /step-free|level boarding|lift|ramp/i.test(leg.access));
const hasSeating = (route) => route.seats !== 'Standing likely';

export default function Journey() {
  const app = useApp();
  const router = useRouter();
  const route = findRoute(app.routeId);
  const [rebooked, setRebooked] = useState(false);
  const [rebooking, setRebooking] = useState(false);
  const [copilot, setCopilot] = useState('');
  const [ranked, setRanked] = useState(ROUTES);
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(true);
  const updated = useLiveClock(`${app.routeId}-${rebooked}`);

  const rankRoutes = (value) => {
    const text = value.toLowerCase();
    return [...ROUTES].sort((a, b) => {
      const score = (route) => (text.includes('late') ? (route.status === 'ok' ? 4 : -3) : 0)
        + (text.includes('crowd') || text.includes('quiet') ? (route.crowd === 'Quiet' ? 5 : -3) : 0)
        + (text.includes('step') || text.includes('wheel') ? (route.id === 'flat' ? 6 : 0) : 0)
        + (app.usesMobilitySupport && isStepFree(route) ? 10 : 0)
        + (app.travelsWithAssistant && hasSeating(route) ? 5 : 0);
      return score(b) - score(a);
    });
  };

  useEffect(() => {
    setLoading(true);
    const timer = window.setTimeout(() => setLoading(false), 700);
    return () => window.clearTimeout(timer);
  }, [app.routeId]);

  useEffect(() => { setRanked(rankRoutes(copilot)); }, [app.usesMobilitySupport, app.travelsWithAssistant]);

  const askCopilot = (value) => {
    setCopilot(value);
    const text = value.toLowerCase();
    const ordered = rankRoutes(value);
    setRanked(ordered);
    if (value.trim()) app.set({ routeId: ordered[0].id });
  };

  const explanation = copilot.toLowerCase().includes('late')
    ? 'I moved the on-time route first so a delay will not cost you a connection.'
    : copilot.toLowerCase().match(/crowd|quiet/)
      ? 'I moved the quietest route first because fewer people makes this trip easier.'
      : copilot.toLowerCase().match(/step|wheel/)
        ? 'I moved the step-free route first because it keeps every transfer level.'
        : 'Tell me what matters right now and I will reorder the routes.';

  const holdPod = () => {
    haptic();
    setRebooking(true);
    window.setTimeout(() => { setRebooking(false); setRebooked(true); }, 1500);
  };

  useEffect(() => {
    app.say(`${route.name}. ${route.minutes} minutes. ${route.statusText}.`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [app.routeId]);

  if (loading) return <section className="card"><Skeleton lines={route.legs.length + 1} /></section>;

  return (
    <>
      <section className="stack reveal">
        <p className="muted">{app.from} to {app.to}</p>
        <h1>Leave at {route.legs[0].depart}, arrive {route.legs[route.legs.length - 1].arrive}</h1>
        <p>{route.plain}</p>
        <div className="row" style={{ flexWrap: 'wrap' }}>
          <span className={`badge ${route.status === 'warn' ? 'warn' : 'ok'}`}><TransitIcon name={route.status === 'warn' ? 'alert' : 'check'} size={14} /> {route.statusText}</span><span className="muted">{updated}</span>
          {((app.usesMobilitySupport && isStepFree(route)) || (app.travelsWithAssistant && hasSeating(route))) && <span className="badge ok"><TransitIcon name="check" size={14} /> Shown first because of your profile</span>}
          <span className="badge complex">{route.crowd}</span>
          <span className="badge complex">{route.seats}</span>
          <span className="badge complex">{route.price}</span>
        </div>
      </section>

      <section className="card stack reveal reveal-2" aria-labelledby="copilot-h">
        <div className="between">
          <div className="row"><TransitIcon name="route" size={22} /><h2 id="copilot-h">Tell Orbital what matters</h2></div>
          <span className="badge ok"><TransitIcon name="check" size={14} /> instant</span>
        </div>
        <p className="muted">Describe what changed. I will reorder these three routes.</p>
        <input value={copilot} onChange={(e) => askCopilot(e.target.value)} aria-label="Tell Orbital what matters for your route"
          placeholder="I'm running late or avoid crowds" />
        <p className="copilot-note" role="status"><TransitIcon name="info" size={16} /> {explanation}</p>
      </section>

      {route.status === 'warn' && (
        <section className="card stack" style={{ borderColor: 'var(--coral)' }} role="alert">
          <div className="row"><TransitIcon name="alert" size={24} /><h2>Your sky shuttle is 6 minutes late</h2></div>
          <p>You would miss the pod at Skyport North. Orbital has held a later pod for you, at no extra cost.</p>
          {rebooking ? <div className="rebook-status" role="status"><span>Reassigning your pod</span><span className="progress"><i /></span></div>
            : rebooked
            ? <p className="badge ok" style={{ padding: 12 }}>Pod held until 09:33. Nothing else to do.</p>
            : <button className="btn" onClick={holdPod}>Hold the later pod</button>}
          <button className="btn ghost" onClick={() => { app.set({ routeId: 'calm' }); }}>
            Show me a route with no delay instead
          </button>
        </section>
      )}

      <section className="card stack route-switch" key={route.id} aria-labelledby="steps-h">
        <h2 id="steps-h">Your journey, step by step</h2>
        {route.legs.map((leg, i) => {
          const m = modeOf(leg.mode);
          return (
            <div className="leg" key={i}>
              <div className="glyph" aria-hidden="true"><TransitIcon name={m.icon} size={22} /></div>
              <div className="stack" style={{ gap: 6 }}>
                <h3>{i + 1}. {m.label} to {leg.to}</h3>
                <p>{leg.depart} from {leg.from} · arrives {leg.arrive}</p>
                <p className="muted leg-detail complex">{leg.detail}</p>
                <p className="badge ok leg-detail complex"><TransitIcon name="check" size={14} /> {leg.access}</p>
              </div>
            </div>
          );
        })}
        <button className="btn ghost" onClick={() => app.say(`${route.name}. ${route.plain} ${route.legs.map((leg) => `${modeOf(leg.mode).label} to ${leg.to}. ${leg.access}`).join(' ')}`)}>
          <TransitIcon name="live" size={18} /> Explain this route
        </button>
        <p className="muted">Orbital is watching every step. If anything changes, you will be told here first.</p>
      </section>

      <button className="btn primary" onClick={() => { haptic(); app.set({ journeyStarted: true }); router.push('/track'); }}>Start this journey</button>

      <section className="stack complex" aria-labelledby="alt-h">
        <h2 id="alt-h">Other ways to get there</h2>
        {ranked.filter((r) => r.id !== route.id).map((r) => (
          <button key={`${r.id}-${ranked.indexOf(r)}`} className="card between route-option" style={{ width: '100%', textAlign: 'left' }}
            onClick={() => app.set({ routeId: r.id })}>
            <span className="stack" style={{ gap: 4 }}>
              <h3>{r.name}</h3>
              <span className="muted">{r.plain}</span>
              {((app.usesMobilitySupport && isStepFree(r)) || (app.travelsWithAssistant && hasSeating(r))) && <span className="badge ok"><TransitIcon name="check" size={14} /> Shown first because of your profile</span>}
              <span className="muted">{expanded === r.id ? `${r.legs.length} legs. ${r.legs.map((leg) => `${modeOf(leg.mode).label} to ${leg.to}`).join(', ')}.` : 'Select to see full route details.'}</span>
            </span>
            <span className="badge">{r.minutes} min</span>
          </button>
        ))}
        <button className="chip" onClick={() => setExpanded(expanded ? null : ranked.find((r) => r.id !== route.id)?.id)}>
          {expanded ? 'Hide route detail' : 'Expand route detail'}
        </button>
      </section>
    </>
  );
}
