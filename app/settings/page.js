'use client';
import { useState } from 'react';
import { useApp } from '../../components/Providers';

export default function Settings() {
  const app = useApp();
  const pct = Math.round(app.scale * 100);
  const [support, setSupport] = useState('');

  return (
    <>
      <section className="stack">
        <h1>Make the app fit you</h1>
        <p className="muted">Set it once. Every screen, route and alert follows these choices, on this device.</p>
      </section>

      <section className="card stack">
        <h2>Text size</h2>
        <p role="status">Currently {pct}% of normal size.</p>
        <input type="range" min="1" max="1.6" step="0.05" value={app.scale}
          aria-label="Text size" style={{ width: '100%', minHeight: 48 }}
          onChange={(e) => app.set({ scale: Number(e.target.value) })} />
        <button className="btn ghost" onClick={() => app.set({ scale: 1 })}>Reset text size</button>
      </section>

      <section className="card stack">
        <h2>Seeing and reading</h2>
        <button className="chip" aria-pressed={app.contrast === 'high'}
          onClick={() => app.set({ contrast: app.contrast === 'high' ? 'normal' : 'high' })}>
          High contrast colours
        </button>
        <button className="chip" aria-pressed={app.motion === 'off'}
          onClick={() => app.set({ motion: app.motion === 'off' ? 'on' : 'off' })}>
          Stop things moving on the map
        </button>
        <button className="chip" aria-pressed={app.speak}
          onClick={() => app.set({ speak: !app.speak })}>
          Read journey updates out loud
        </button>
      </section>

      <section className="card stack">
        <h2>Simple mode</h2>
        <p>Hides prices, crowding and extra notes. You still get the route, the times and the live map.</p>
        <button className="chip" aria-pressed={app.simple === 'on'}
          onClick={() => app.set({ simple: app.simple === 'on' ? 'off' : 'on' })}>
          {app.simple === 'on' ? 'Simple mode is on' : 'Turn on simple mode'}
        </button>
      </section>

      <section className="card stack">
        <h2>Information density</h2>
        <p>Keep the route visible but collapse each travel leg to one line until you ask for more.</p>
        <button className="chip" aria-pressed={app.density === 'reduced'}
          onClick={() => app.set({ density: app.density === 'reduced' ? 'normal' : 'reduced' })}>
          {app.density === 'reduced' ? 'Reduced density is on' : 'Reduce information density'}
        </button>
      </section>

      <section className="card stack">
        <h2>Live signal demo</h2>
        <p>Turn this on to preview how Orbital behaves when a connection is weak.</p>
        <button className="chip" aria-pressed={app.weakSignal}
          onClick={() => app.set({ weakSignal: !app.weakSignal })}>
          {app.weakSignal ? 'Weak signal is on' : 'Simulate weak signal'}
        </button>
      </section>

      <section className="card stack">
        <h2>Travelling with support</h2>
        <p className="muted">Orbital uses this to pick routes, not to show badges. Step-free routes come up first when this is on.</p>
        <button className="chip" aria-pressed={support === 'mobility'} onClick={() => setSupport(support === 'mobility' ? '' : 'mobility')}>I use a wheelchair or walker</button>
        <button className="chip" aria-pressed={support === 'assistant'} onClick={() => setSupport(support === 'assistant' ? '' : 'assistant')}>I travel with an assistant</button>
        <button className="chip" aria-pressed={support === 'helper'} onClick={() => setSupport(support === 'helper' ? '' : 'helper')}>Tell a helper to meet me</button>
        {support && <p className="badge ok" role="status">Support preference selected for this session.</p>}
      </section>
    </>
  );
}
