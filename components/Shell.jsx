'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useApp } from './Providers';
import TransitIcon from './TransitIcon';
import { NETWORK_STATUS } from '../lib/network';
import { useLiveClock } from '../lib/useLiveClock';
import { haptic } from '../lib/feedback';

const TABS = [
  { href: '/', label: 'Plan', icon: 'plan' },
  { href: '/journey', label: 'Route', icon: 'route' },
  { href: '/track', label: 'Live', icon: 'live' },
  { href: '/settings', label: 'Accessibility', icon: 'comfort' }
];

export default function Shell({ children }) {
  const path = usePathname();
  const router = useRouter();
  const app = useApp();
  const [open, setOpen] = useState(false);
  const updated = useLiveClock();
  const bigger = () => app.set({ scale: Math.min(1.6, +(app.scale + 0.15).toFixed(2)) });
  const smaller = () => app.set({ scale: Math.max(1, +(app.scale - 0.15).toFixed(2)) });
  const explainScreen = () => {
    const summaries = {
      '/': 'Plan a trip by entering where you start and where you are going, then choose Find my routes.',
      '/journey': 'This screen shows your selected route, its travel steps, delays, and other route choices.',
      '/track': 'This screen shows where you are on the route, your next stop, and the confidence forecast.',
      '/settings': 'This screen lets you change text size, contrast, motion, speech, and information density.'
    };
    app.say(summaries[path] || 'This screen shows your Orbital journey information.');
  };
  const tickerPills = (copy, duplicate = false) => copy.map((item, index) => (
    <button className="ticker-item" key={`${item.id}-${index}`} tabIndex={duplicate ? -1 : 0} onClick={() => router.push(`/network?line=${item.id}`)} aria-hidden={duplicate || undefined} aria-label={`View ${item.line} status`}>
      <span className={`status-dot ${item.status}`} aria-hidden="true"><span /></span>
      <strong>{item.line}</strong>
      <span className="ticker-status">{item.status === 'warn' ? 'delay' : item.note}</span>
    </button>
  ));

  return (
    <div className="shell">
      <header className="bar">
        <Link href="/" className="brand"><span className="dot" aria-hidden="true"><TransitIcon name="orbital" size={19} /></span>Orbital <span className="brand-year">2100</span></Link>
        <button className="chip" onClick={() => setOpen(true)} aria-haspopup="dialog">
          <span aria-hidden="true">Aa</span> Accessibility
        </button>
      </header>

      <div className="ticker" aria-label="Network status">
        <div className="ticker-track">
          <div className="ticker-set">{tickerPills(NETWORK_STATUS)}</div>
          <div className="ticker-set" aria-hidden="true">{tickerPills(NETWORK_STATUS, true)}</div>
        </div>
        <span className="ticker-meta"><span className="live-mark" aria-hidden="true" /> Live · {updated}</span>
      </div>

      <main className="main" id="main">{children}</main>

      {open && (
        <>
          <div className="backdrop" onClick={() => setOpen(false)} />
              <div className="sheet" role="dialog" aria-label="Accessibility settings">
            <div className="between" style={{ marginBottom: 14 }}>
              <h2>Make this easier</h2>
              <button className="chip" onClick={() => setOpen(false)}>Done</button>
            </div>
            <div className="stack">
              <button className="btn ghost" onClick={() => { haptic(); explainScreen(); }}><TransitIcon name="sparkle" size={18} /> Explain this screen</button>
              <div className="row">
                <button className="btn ghost" onClick={smaller}>Smaller text</button>
                <button className="btn" onClick={bigger}>Bigger text</button>
              </div>
              <button className="chip" aria-pressed={app.contrast === 'high'}
                onClick={() => app.set({ contrast: app.contrast === 'high' ? 'normal' : 'high' })}>
                High contrast colours
              </button>
              <button className="chip" aria-pressed={app.simple === 'on'}
                onClick={() => app.set({ simple: app.simple === 'on' ? 'off' : 'on' })}>
                Simple mode — hide extra detail
              </button>
              <button className="chip" aria-pressed={app.density === 'reduced'}
                onClick={() => app.set({ density: app.density === 'reduced' ? 'normal' : 'reduced' })}>
                Reduce information density
              </button>
              <button className="chip" aria-pressed={app.motion === 'off'}
                onClick={() => app.set({ motion: app.motion === 'off' ? 'on' : 'off' })}>
                Stop things moving
              </button>
              <button className="chip" aria-pressed={app.speak}
                onClick={() => app.set({ speak: !app.speak })}>
                Read updates out loud
              </button>
              <p className="muted">Your choices are remembered on this device. You can change them any time from this button.</p>
            </div>
          </div>
        </>
      )}

      <nav className="nav" aria-label="Main">
        {TABS.map((t) => (
          <Link key={t.href} href={t.href} aria-current={path === t.href || (t.href === '/' && path === '/network') ? 'page' : undefined}>
            <TransitIcon name={t.icon} size={21} />
            {t.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
