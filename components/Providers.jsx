'use client';
import { createContext, useContext, useEffect, useState } from 'react';

const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);

const DEFAULTS = {
  scale: 1, contrast: 'normal', motion: 'on', simple: 'off', density: 'normal', speak: false,
  from: 'Harbour Terrace', to: 'Ratmalana Sky Hub', routeId: 'calm', when: 'now', journeyStarted: false,
  progress: 0, arrived: false, weakSignal: false, profileName: '', homeStop: '', frequentDestination: '',
  usesMobilitySupport: false, travelsWithAssistant: false
};

export default function Providers({ children }) {
  const [state, setState] = useState(DEFAULTS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const prefs = localStorage.getItem('orbital.prefs') || localStorage.getItem('oracle.prefs');
      const journey = localStorage.getItem('orbital.journey') || localStorage.getItem('oracle.journey');
      const profile = localStorage.getItem('orbital.profile');
      if (prefs) setState((s) => ({ ...s, ...JSON.parse(prefs) }));
      if (journey) setState((s) => ({ ...s, ...JSON.parse(journey) }));
      if (profile) setState((s) => ({ ...s, ...JSON.parse(profile) }));
    } catch (e) {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const r = document.documentElement;
    r.style.setProperty('--scale', String(state.scale));
    r.dataset.contrast = state.contrast;
    r.dataset.motion = state.motion;
    r.dataset.simple = state.simple;
    r.dataset.density = state.density;
    try {
      const { scale, contrast, motion, simple, density, speak, weakSignal } = state;
      localStorage.setItem('orbital.prefs', JSON.stringify({ scale, contrast, motion, simple, density, speak, weakSignal }));
      localStorage.setItem('orbital.journey', JSON.stringify({ from: state.from, to: state.to, routeId: state.routeId, when: state.when, journeyStarted: state.journeyStarted, progress: state.progress, arrived: state.arrived }));
      localStorage.setItem('orbital.profile', JSON.stringify({ profileName: state.profileName, homeStop: state.homeStop, frequentDestination: state.frequentDestination, usesMobilitySupport: state.usesMobilitySupport, travelsWithAssistant: state.travelsWithAssistant }));
    } catch (e) {}
  }, [state, ready]);

  const set = (patch) => setState((s) => ({ ...s, ...patch }));

  const clearProfile = () => {
    setState((s) => ({ ...s, profileName: '', homeStop: '', frequentDestination: '', usesMobilitySupport: false, travelsWithAssistant: false }));
    try { localStorage.removeItem('orbital.profile'); } catch (e) {}
  };

  const say = (text) => {
    if (!state.speak || typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
  };

  return <Ctx.Provider value={{ ...state, ready, set, clearProfile, say }}>{children}</Ctx.Provider>;
}
