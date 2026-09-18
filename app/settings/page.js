'use client';
import { useEffect, useState } from 'react';
import { useApp } from '../../components/Providers';
import { PLACES } from '../../lib/data';

export default function Settings() {
  const app = useApp();
  const pct = Math.round(app.scale * 100);
  const [profile, setProfile] = useState({ name: '', home: '', destination: '', mobility: false, assistant: false });
  const [profileMessage, setProfileMessage] = useState('');

  useEffect(() => {
    if (!app.ready) return;
    setProfile({ name: app.profileName, home: app.homeStop, destination: app.frequentDestination, mobility: app.usesMobilitySupport, assistant: app.travelsWithAssistant });
  }, [app.ready]);

  const saveProfile = () => {
    app.set({ profileName: profile.name.trim(), homeStop: profile.home, frequentDestination: profile.destination, usesMobilitySupport: profile.mobility, travelsWithAssistant: profile.assistant });
    setProfileMessage('Profile saved');
  };

  const clearProfile = () => {
    app.clearProfile();
    setProfile({ name: '', home: '', destination: '', mobility: false, assistant: false });
    setProfileMessage('Profile cleared');
  };

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

      <section className="card stack" aria-labelledby="profile-h">
        <h2 id="profile-h">My profile</h2>
        <p className="muted">Personal travel preferences only. Saved only on this device. Nothing is sent anywhere.</p>
        <div className="field"><label htmlFor="profile-name">Name or nickname</label><input id="profile-name" value={profile.name} placeholder="Priya" onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))} /></div>
        <div className="field"><label htmlFor="profile-home">Home stop</label><input id="profile-home" list="profile-places" value={profile.home} placeholder="Choose a home stop" onChange={(e) => setProfile((p) => ({ ...p, home: e.target.value }))} /></div>
        <div className="field"><label htmlFor="profile-destination">Work or frequent destination</label><input id="profile-destination" list="profile-places" value={profile.destination} placeholder="Choose a frequent destination" onChange={(e) => setProfile((p) => ({ ...p, destination: e.target.value }))} /></div>
        <datalist id="profile-places">{PLACES.map((place) => <option key={place} value={place} />)}</datalist>
        <button className="chip" aria-pressed={profile.mobility} onClick={() => setProfile((p) => ({ ...p, mobility: !p.mobility }))}>I use a wheelchair or walker</button>
        <button className="chip" aria-pressed={profile.assistant} onClick={() => setProfile((p) => ({ ...p, assistant: !p.assistant }))}>I travel with an assistant</button>
        <button className="btn primary" onClick={saveProfile}>Save my profile</button>
        <button className="btn ghost" onClick={clearProfile}>Clear my profile</button>
        {profileMessage && <p className="badge ok" role="status">{profileMessage}</p>}
      </section>
    </>
  );
}
