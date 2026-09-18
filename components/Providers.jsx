'use client';
import { createContext, useContext, useEffect, useState } from 'react';

const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);

const PLACE_MIGRATIONS = {
  'Harbour Terrace': 'Colombo Port City Terminal',
  'Skyport North': 'Katunayake Skyport',
  'Meridian Hospital': 'National Hospital Interchange',
  'Meridian Interchange': 'National Hospital Interchange',
  'Old Town Plaza': 'Pettah Central',
  'Lagoon Gardens': 'Bolgoda Lagoon Gardens',
  'Cloudline Tower': 'Lotus Tower Hub',
  'University Ring': 'Moratuwa University Ring'
};

const migratePlaces = (value) => PLACE_MIGRATIONS[value] || value;

const DEFAULTS = {
  scale: 1, contrast: 'normal', motion: 'on', simple: 'off', density: 'normal', speak: false,
  from: 'Colombo Port City Terminal', to: 'Ratmalana Sky Hub', routeId: 'calm', when: 'now', journeyStarted: false,
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
      if (journey) {
        const savedJourney = JSON.parse(journey);
        setState((s) => ({ ...s, ...savedJourney, from: migratePlaces(savedJourney.from), to: migratePlaces(savedJourney.to) }));
      }
      if (profile) {
        const savedProfile = JSON.parse(profile);
        setState((s) => ({ ...s, ...savedProfile, homeStop: migratePlaces(savedProfile.homeStop), frequentDestination: migratePlaces(savedProfile.frequentDestination) }));
      }
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
