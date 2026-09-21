'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, VolumeX, Activity, Flame } from 'lucide-react';

interface PaddockLiveAtmosphereProps {
  teamName: string;
  driverCode: string;
  circuitName: string;
  startTyre: string;
  puMode: string;
}

// Pre-race garage preparation checklist dialogue (Zero in-race calls like "box")
const PRE_RACE_GARAGE_COMMUNICATIONS: string[] = [
  'Radio check, radio check. Loud and clear on pitwall.',
  'Blankets disconnected, tyre temperatures eighty-five degrees.',
  'Torque check verified on all four corners, ninety bar.',
  'Telemetry link verified, all channels green.',
  'Hydraulics and fuel pressures nominal, systems go.',
  'MGU-K state of charge ninety-eight percent, ready for launch.',
  'Steering sweep and brake pressure check complete.',
  'Three minutes to pit exit opening. Stand clear of exhaust.',
  'Starting tyre set confirmed, soft compound fitted.',
  'Fire extinguisher safety pin removed, car is live.',
  'Clutch bite-point learn procedure verified.',
  'Strategy confirmed, Plan A for the start.',
];

export const PaddockLiveAtmosphere: React.FC<PaddockLiveAtmosphereProps> = ({
  teamName,
  driverCode,
  circuitName,
  startTyre,
  puMode,
}) => {
  const [ambientAudioActive, setAmbientAudioActive] = useState<boolean>(false);
  const [hasCustomVideo, setHasCustomVideo] = useState<boolean>(false);
  const [videoLoadFailed, setVideoLoadFailed] = useState<boolean>(false);
  const [cctvTime, setCctvTime] = useState<string>('14:28:09:42');

  const volume = 0.75;

  // Audio references
  const audioContextRef = useRef<AudioContext | null>(null);
  const backgroundAudioRef = useRef<HTMLAudioElement | null>(null);
  const noiseIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const commIndexRef = useRef<number>(0);

  // Timecode animation (CCTV Live clock)
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      const ms = String(Math.floor(now.getMilliseconds() / 10)).padStart(2, '0');
      setCctvTime(`${h}:${m}:${s}:${ms}`);
    }, 40);
    return () => clearInterval(timer);
  }, []);

  // Audio Context getter
  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        audioContextRef.current = new AudioCtx();
      }
    }
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    return audioContextRef.current;
  }, []);

  // 1. Quindar Two-Tone Radio Beep ("BEEP-BEEP")
  const playQuindarBeep = useCallback((ctx: AudioContext, time: number, vol: number) => {
    try {
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(2475, time);
      gain1.gain.setValueAtTime(0.035 * vol, time);
      gain1.gain.linearRampToValueAtTime(0.001, time + 0.035);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(time);
      osc1.stop(time + 0.04);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(2525, time + 0.038);
      gain2.gain.setValueAtTime(0.035 * vol, time + 0.038);
      gain2.gain.linearRampToValueAtTime(0.001, time + 0.075);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(time + 0.038);
      osc2.stop(time + 0.08);
    } catch {}
  }, []);

  // 2. Realistic Paoli DP6000 Pneumatic Wheel Gun Synthesizer
  const triggerWheelGun = useCallback(() => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const strikeCount = 10;
      const interval = 0.025;

      // Air trigger rush
      const airLen = Math.floor(ctx.sampleRate * 0.035);
      const airBuf = ctx.createBuffer(1, airLen, ctx.sampleRate);
      const airData = airBuf.getChannelData(0);
      for (let i = 0; i < airLen; i++) {
        airData[i] = (Math.random() * 2 - 1) * (1 - i / airLen);
      }
      const airSource = ctx.createBufferSource();
      airSource.buffer = airBuf;
      const airFilter = ctx.createBiquadFilter();
      airFilter.type = 'bandpass';
      airFilter.frequency.setValueAtTime(3200, now);
      airFilter.Q.setValueAtTime(2.0, now);
      const airGain = ctx.createGain();
      airGain.gain.setValueAtTime(0.1 * volume, now);
      airGain.gain.linearRampToValueAtTime(0.001, now + 0.035);
      airSource.connect(airFilter);
      airFilter.connect(airGain);
      airGain.connect(ctx.destination);
      airSource.start(now);

      // Multi-hammer mechanical strikes
      for (let s = 0; s < strikeCount; s++) {
        const strikeTime = now + 0.025 + s * interval;
        const strikeLen = Math.floor(ctx.sampleRate * 0.016);
        const buf = ctx.createBuffer(1, strikeLen, ctx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < strikeLen; i++) {
          const t = i / ctx.sampleRate;
          const env = Math.exp(-i / (ctx.sampleRate * 0.0022));
          const noise = (Math.random() * 2 - 1) * 0.5;
          const clunk = Math.sin(2 * Math.PI * 120.0 * t) * 0.45;
          data[i] = (noise + clunk) * env;
        }
        const strikeSource = ctx.createBufferSource();
        strikeSource.buffer = buf;
        const strikeGain = ctx.createGain();
        const strikeIntensity = (0.35 + (s % 3) * 0.04) * volume;
        strikeGain.gain.setValueAtTime(strikeIntensity, strikeTime);
        strikeSource.connect(strikeGain);
        strikeGain.connect(ctx.destination);
        strikeSource.start(strikeTime);
      }

      // Nitrogen exhaust dump ("TSSSHHH")
      const exhaustTime = now + 0.025 + strikeCount * interval;
      const exhaustLen = Math.floor(ctx.sampleRate * 0.35);
      const exhaustBuf = ctx.createBuffer(1, exhaustLen, ctx.sampleRate);
      const exData = exhaustBuf.getChannelData(0);
      for (let i = 0; i < exhaustLen; i++) {
        const env = Math.pow(1.0 - i / exhaustLen, 1.8);
        exData[i] = (Math.random() * 2 - 1) * env;
      }
      const exSource = ctx.createBufferSource();
      exSource.buffer = exhaustBuf;
      const exFilter = ctx.createBiquadFilter();
      exFilter.type = 'bandpass';
      exFilter.frequency.setValueAtTime(4200, exhaustTime);
      exFilter.Q.setValueAtTime(1.5, exhaustTime);
      const exGain = ctx.createGain();
      exGain.gain.setValueAtTime(0.15 * volume, exhaustTime);
      exGain.gain.exponentialRampToValueAtTime(0.001, exhaustTime + 0.35);
      exSource.connect(exFilter);
      exFilter.connect(exGain);
      exGain.connect(ctx.destination);
      exSource.start(exhaustTime);
    } catch (err) {
      console.warn('Wheel gun trigger error:', err);
    }
  }, [getAudioContext, volume]);

  // 3. Torque Wrench Double-Click ("CLICK-CLICK")
  const triggerTorqueClick = useCallback(() => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      [0.0, 0.11].forEach((offset) => {
        const clickTime = now + offset;
        const clickLen = Math.floor(ctx.sampleRate * 0.014);
        const buf = ctx.createBuffer(1, clickLen, ctx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < clickLen; i++) {
          const env = Math.exp(-i / (ctx.sampleRate * 0.0018));
          data[i] = (Math.random() * 2 - 1) * 0.45 * env;
        }
        const src = ctx.createBufferSource();
        src.buffer = buf;
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.22 * volume, clickTime);
        src.connect(gain);
        gain.connect(ctx.destination);
        src.start(clickTime);
      });
    } catch {}
  }, [getAudioContext, volume]);

  // 4. High-Pressure Air Line Snap / Jack Pressure Bleed ("T-TSCHK")
  const triggerAirPuff = useCallback(() => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const puffLen = Math.floor(ctx.sampleRate * 0.12);
      const buf = ctx.createBuffer(1, puffLen, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < puffLen; i++) {
        const env = Math.exp(-i / (ctx.sampleRate * 0.016));
        data[i] = (Math.random() * 2 - 1) * 0.65 * env;
      }
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(2600, now);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.2 * volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      src.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      src.start(now);
    } catch (err) {
      console.warn('Air puff trigger error:', err);
    }
  }, [getAudioContext, volume]);

  // 5. Pre-Race Garage Voice Chatter (Audio BGM only, NO subtitle popup)
  const triggerChatterTransmission = useCallback(() => {
    try {
      const ctx = getAudioContext();
      const now = ctx ? ctx.currentTime : 0;

      const phrase = PRE_RACE_GARAGE_COMMUNICATIONS[commIndexRef.current % PRE_RACE_GARAGE_COMMUNICATIONS.length];
      commIndexRef.current += 1;

      if (ctx) {
        playQuindarBeep(ctx, now, volume);
      }

      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(phrase);
        utter.rate = 1.05;
        utter.pitch = 0.95;
        utter.volume = Math.min(1.0, volume * 0.85);

        const voices = window.speechSynthesis.getVoices();
        const enVoice = voices.find(v => v.lang.startsWith('en')) || voices[0];
        if (enVoice) utter.voice = enVoice;

        window.speechSynthesis.speak(utter);
      }
    } catch (err) {
      console.warn('Chatter transmission error:', err);
    }
  }, [getAudioContext, volume, playQuindarBeep]);

  // Master Start/Stop Ambient Audio
  const startPaddockAmbientAudio = () => {
    try {
      getAudioContext();

      if (backgroundAudioRef.current) {
        backgroundAudioRef.current.pause();
        backgroundAudioRef.current = null;
      }

      const bgAudio = new Audio();
      bgAudio.loop = true;
      bgAudio.volume = volume;

      // Try /audio/garage_ambient.mp3 first, fallback to clean studio WAV
      bgAudio.src = '/audio/garage_ambient.mp3';
      bgAudio.onerror = () => {
        bgAudio.src = '/audio/garage_ambient.wav';
        bgAudio.play().catch((err) => {
          console.warn('Fallback WAV play error:', err);
        });
      };

      bgAudio.play().catch(() => {});
      backgroundAudioRef.current = bgAudio;

      // Dynamic Garage Life Loop (Work sounds & background chatter)
      if (noiseIntervalRef.current) {
        clearInterval(noiseIntervalRef.current);
      }

      noiseIntervalRef.current = setInterval(() => {
        const rand = Math.random();
        if (rand < 0.45) {
          triggerChatterTransmission();
        } else if (rand < 0.75) {
          triggerWheelGun();
        } else if (rand < 0.90) {
          triggerAirPuff();
        } else {
          triggerTorqueClick();
        }
      }, 7500);

      // Trigger initial pre-race radio check after 1.2s
      setTimeout(() => {
        triggerChatterTransmission();
      }, 1200);

      setAmbientAudioActive(true);
    } catch (err) {
      console.warn('Paddock ambient audio initialization error:', err);
    }
  };

  const stopPaddockAmbientAudio = () => {
    if (noiseIntervalRef.current) {
      clearInterval(noiseIntervalRef.current);
      noiseIntervalRef.current = null;
    }
    if (backgroundAudioRef.current) {
      backgroundAudioRef.current.pause();
      backgroundAudioRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setAmbientAudioActive(false);
  };

  const toggleAmbientAudio = () => {
    if (ambientAudioActive) {
      stopPaddockAmbientAudio();
    } else {
      startPaddockAmbientAudio();
    }
  };

  useEffect(() => {
    return () => {
      stopPaddockAmbientAudio();
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
        audioContextRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-slate-950 shadow-2xl group">
      {/* ── Visual Media Container: Custom Video OR Photorealistic Cinematic Image ── */}
      <div className="relative w-full h-[220px] sm:h-[260px] md:h-[300px] overflow-hidden bg-slate-950">
        {/* Custom Video Option: /videos/paddock_ambient.mp4 */}
        {!videoLoadFailed && (
          <video
            autoPlay
            loop
            muted
            playsInline
            onError={() => setVideoLoadFailed(true)}
            onLoadedData={() => setHasCustomVideo(true)}
            className="absolute inset-0 w-full h-full object-cover opacity-85 transition-opacity duration-1000 scale-105 group-hover:scale-100 transition-transform"
            src="/videos/paddock_ambient.mp4"
          />
        )}

        {/* Photorealistic Cinematic F1 Pit Garage Backdrop */}
        <div
          className={`absolute inset-0 bg-cover bg-center transition-all duration-700 ${
            hasCustomVideo ? 'opacity-0' : 'opacity-90'
          }`}
          style={{
            backgroundImage: "url('/images/f1_garage_briefing.jpg')",
            backgroundPosition: 'center 45%',
          }}
        />

        {/* Cinematic Vignette & Deep Shadows for HUD Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/60 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-slate-950/80 pointer-events-none" />

        {/* CRT Scanline & HUD Grid Lines Overlay */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/[0.03] to-transparent animate-pulse" />

        {/* ── Top CCTV HUD Layer ── */}
        <div className="absolute top-0 inset-x-0 p-3 sm:p-4 z-20 flex items-center justify-between gap-2">
          {/* Left: CCTV Feed Tag & Timecode */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-950/90 border border-red-500/60 text-[10px] sm:text-xs font-mono font-bold text-red-300 shadow-md">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span>LIVE CAM 01 // GARAGE BAY</span>
            </div>
            <div className="px-2 py-1 rounded bg-black/60 backdrop-blur-md border border-white/10 text-[10px] sm:text-xs font-mono text-slate-300">
              {cctvTime}
            </div>
            <span className="hidden md:inline-block text-xs font-racing font-bold text-white tracking-wider px-2 py-0.5 rounded bg-black/40 border border-white/10">
              {teamName.toUpperCase()} • #{driverCode}
            </span>
          </div>

          {/* Right: Clean Minimal Speaker Icon Button for Sound ON/OFF */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleAmbientAudio}
              className={`px-3 py-1.5 rounded-lg text-xs font-racing font-bold flex items-center gap-2 transition-all cursor-pointer shadow-lg backdrop-blur-md ${
                ambientAudioActive
                  ? 'bg-cyan-950/90 text-cyan-300 border border-cyan-400 shadow-cyan-950 ring-1 ring-cyan-400/40'
                  : 'bg-black/70 hover:bg-slate-900 text-slate-400 hover:text-white border border-white/20'
              }`}
              title={ambientAudioActive ? 'ガレージ環境音: ON (クリックでミュート)' : 'ガレージ環境音: OFF (クリックで再生)'}
            >
              {ambientAudioActive ? (
                <>
                  <Volume2 className="w-4 h-4 text-cyan-400 animate-pulse" />
                  <span className="text-[11px] tracking-wider">SOUND ON</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-slate-400" />
                  <span className="text-[11px] tracking-wider">SOUND OFF</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ── Bottom HUD Overlay: Telemetry Teleprinter & Machine Status ── */}
        <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4 z-20 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          {/* Left: Garage Atmosphere Description */}
          <div className="max-w-md space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-mono font-bold flex items-center gap-1">
                <Flame className="w-3 h-3 text-orange-400" /> PIT CREW PRE-GRID PREPARATION
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {circuitName}
              </span>
            </div>
            <p className="text-xs text-slate-200 font-medium leading-relaxed drop-shadow-md">
              メカニックたちがタイヤウォーマーを取り外し、最終トルクチェックと無線通信点検を実施中。戦略を決定しピットウォールへ着席してください。
            </p>
          </div>

          {/* Right: Live Diagnostics Telemetry Card (Glass HUD) */}
          <div className="shrink-0 p-2.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/20 font-mono text-[10px] space-y-1 text-slate-300 shadow-2xl">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-1">
              <span className="font-racing text-amber-300 font-bold flex items-center gap-1">
                <Activity className="w-3 h-3 text-cyan-400 animate-spin" /> GARAGE TELEMETRY
              </span>
              <span className="text-[9px] text-emerald-400 font-bold">CONNECTED</span>
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-[9.5px]">
              <div>
                <span className="text-slate-400">TYRE BLANKET: </span>
                <span className="text-orange-400 font-bold">85°C WARM</span>
              </div>
              <div>
                <span className="text-slate-400">MGU-K HYBRID: </span>
                <span className="text-cyan-300 font-bold">READY (350kW)</span>
              </div>
              <div>
                <span className="text-slate-400">START TYRE: </span>
                <span className="text-emerald-400 font-bold">{startTyre}</span>
              </div>
              <div>
                <span className="text-slate-400">INITIAL PU: </span>
                <span className="text-purple-300 font-bold uppercase">{puMode}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
