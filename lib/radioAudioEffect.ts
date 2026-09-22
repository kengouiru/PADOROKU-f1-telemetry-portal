'use client';

/**
 * lib/radioAudioEffect.ts
 * F1 Team Radio Audio Synthesizer & Speech Synthesis Utility.
 * Simulates pit-wall walkie-talkie communication with:
 * - Radio Key-Up (Beep-Chirp) tone on start
 * - Audio Bandpass Filter (350Hz - 3400Hz telecommunication bandwidth)
 * - Subtle ambient cockpit radio static noise
 * - Radio Squelch Click on transmission end
 * - Web Speech API (ja-JP) speech synthesis
 */

let audioCtx: AudioContext | null = null;
let staticNoiseNode: AudioNode | null = null;
let isSpeaking = false;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Resume AudioContext if suspended (call on user interaction like clicks/taps)
 */
export function ensureAudioContextResumed(): void {
  if (typeof window === 'undefined') return;
  const ctx = getAudioContext();
  if (ctx && ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }
}

/** Play short radio key-up chirp tone (F1 Team Radio start tone) */
export function playRadioKeyUpTone(): Promise<void> {
  return playF1IncomingRadioChirp();
}

/**
 * 🏎️ Official F1 Team Radio Key-Up Chime (FOM Broadcast "Pip-Pip" Beep)
 * Accurately synthesizes the world-famous F1 TV broadcast team radio graphic intro sound:
 * - Beep 1: Crisp high-frequency sine pulse (2150 Hz, 45ms)
 * - Inter-pulse gap (25ms)
 * - Beep 2: Ascending secondary pulse (2550 Hz, 52ms)
 * - Punchy broadcast audio gain (0.32) with clean attack/release envelope
 */
export function playF1IncomingRadioChirp(): Promise<void> {
  return new Promise((resolve) => {
    const ctx = getAudioContext();
    if (!ctx) return resolve();

    ensureAudioContextResumed();

    const now = ctx.currentTime;

    // Subtle RF mic unkey squelch burst (15ms)
    try {
      const burstSize = Math.floor(ctx.sampleRate * 0.015);
      const burstBuffer = ctx.createBuffer(1, burstSize, ctx.sampleRate);
      const burstData = burstBuffer.getChannelData(0);
      for (let i = 0; i < burstSize; i++) {
        burstData[i] = (Math.random() * 2 - 1) * 0.04;
      }
      const burstSource = ctx.createBufferSource();
      burstSource.buffer = burstBuffer;

      const burstFilter = ctx.createBiquadFilter();
      burstFilter.type = 'bandpass';
      burstFilter.frequency.setValueAtTime(2400, now);
      burstFilter.Q.setValueAtTime(3.0, now);

      const burstGain = ctx.createGain();
      burstGain.gain.setValueAtTime(0.04, now);
      burstGain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);

      burstSource.connect(burstFilter);
      burstFilter.connect(burstGain);
      burstGain.connect(ctx.destination);

      burstSource.start(now);
      burstSource.stop(now + 0.015);
    } catch {
      // Audio buffer creation fallback
    }

    // ── First Pulse: 2150 Hz for 45ms ("Pip") ──
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(2150, now);

    gain1.gain.setValueAtTime(0.001, now);
    gain1.gain.linearRampToValueAtTime(0.32, now + 0.003);
    gain1.gain.setValueAtTime(0.32, now + 0.040);
    gain1.gain.linearRampToValueAtTime(0.001, now + 0.045);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);

    osc1.start(now);
    osc1.stop(now + 0.046);

    // ── Second Pulse: 2550 Hz for 52ms ("Pip") after 24ms gap ──
    const pulse2Start = now + 0.068;
    const pulse2End = pulse2Start + 0.052;

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(2550, pulse2Start);

    gain2.gain.setValueAtTime(0.001, pulse2Start);
    gain2.gain.linearRampToValueAtTime(0.34, pulse2Start + 0.003);
    gain2.gain.setValueAtTime(0.34, pulse2End - 0.005);
    gain2.gain.linearRampToValueAtTime(0.001, pulse2End);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);

    osc2.start(pulse2Start);
    osc2.stop(pulse2End + 0.002);

    setTimeout(resolve, 140);
  });
}

/**
 * 🎙️ Pit Wall Outgoing Transmission Beep (Pit Wall to Driver)
 * Triggered when the user issues a command (Box Box, Push, Conserve, ERS, Engine Mode):
 * - Tactile PTT (Push-To-Talk) mic click + dual ascending confirmation tone (1200Hz -> 1600Hz)
 */
export function playF1OutgoingRadioBeep(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  ensureAudioContextResumed();

  const now = ctx.currentTime;

  // Short mic key click
  try {
    const clickSize = Math.floor(ctx.sampleRate * 0.015);
    const clickBuffer = ctx.createBuffer(1, clickSize, ctx.sampleRate);
    const clickData = clickBuffer.getChannelData(0);
    for (let i = 0; i < clickSize; i++) {
      clickData[i] = (Math.random() * 2 - 1) * 0.12;
    }
    const clickSource = ctx.createBufferSource();
    clickSource.buffer = clickBuffer;

    const clickFilter = ctx.createBiquadFilter();
    clickFilter.type = 'bandpass';
    clickFilter.frequency.setValueAtTime(2200, now);
    clickFilter.Q.setValueAtTime(3.0, now);

    const clickGain = ctx.createGain();
    clickGain.gain.setValueAtTime(0.08, now);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);

    clickSource.connect(clickFilter);
    clickFilter.connect(clickGain);
    clickGain.connect(ctx.destination);

    clickSource.start(now);
    clickSource.stop(now + 0.015);
  } catch {
    // Fallback
  }

  // Dual ascending confirmation pips (1200Hz -> 1600Hz)
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(1200, now + 0.01);
  osc.frequency.setValueAtTime(1600, now + 0.045);

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.setValueAtTime(0.10, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now + 0.01);
  osc.stop(now + 0.085);
}

/** Play radio key-down squelch / click (F1 Team Radio transmission cut) */
export function playRadioKeyDownTone(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const bufferSize = ctx.sampleRate * 0.08; // 80ms
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }

  const whiteNoise = ctx.createBufferSource();
  whiteNoise.buffer = noiseBuffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(1200, now);
  filter.Q.setValueAtTime(1.5, now);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.08, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

  whiteNoise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  whiteNoise.start(now);
  whiteNoise.stop(now + 0.08);
}

/**
 * Synthesize and speak text using race engineer radio voice style
 */
export async function playRadioSpeech(
  text: string,
  callbacks?: {
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (err: unknown) => void;
  }
): Promise<void> {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('SpeechSynthesis is not supported on this browser');
    return;
  }

  // Stop previous speech if any
  stopRadioSpeech();

  // Strip markdown formatting like **bold**, # titles, etc. for cleaner speech
  const cleanText = text
    .replace(/\*\*|\*|__|_/g, '')
    .replace(/#{1,6}\s+/g, '')
    .replace(/\[.*?\]\(.*?\)/g, '')
    .replace(/[🏁🏎️⚡🏆⏱️📊💡🚨]/g, '')
    .trim();

  if (!cleanText) return;

  isSpeaking = true;
  callbacks?.onStart?.();

  // Play Key-Up Chirp
  try {
    await playRadioKeyUpTone();
  } catch (e) {
    console.error('Radio key-up tone failed', e);
  }

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = 'ja-JP';
  utterance.rate = 1.08; // Crisp, slightly brisk race engineer pace
  utterance.pitch = 1.02;

  // Prefer a crisp Japanese voice if available
  const voices = window.speechSynthesis.getVoices();
  const jaVoice =
    voices.find((v) => v.lang.startsWith('ja') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Ichiro') || v.name.includes('Ayumi'))) ||
    voices.find((v) => v.lang.startsWith('ja'));
  if (jaVoice) {
    utterance.voice = jaVoice;
  }

  utterance.onend = () => {
    isSpeaking = false;
    playRadioKeyDownTone();
    callbacks?.onEnd?.();
  };

  utterance.onerror = (err) => {
    isSpeaking = false;
    playRadioKeyDownTone();
    callbacks?.onError?.(err);
  };

  window.speechSynthesis.speak(utterance);
}

/** Stop ongoing speech immediately */
export function stopRadioSpeech(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  isSpeaking = false;
}

export function isRadioSpeechActive(): boolean {
  return isSpeaking;
}

/**
 * Authentic F1 Pit-Wall "Box, Box, Box" Radio Call
 * Plays key-up chirp, speaks "Box, Box. Box this lap.", and plays key-down squelch.
 */
export async function playBoxBoxCall(callbacks?: { onStart?: () => void; onEnd?: () => void }): Promise<void> {
  if (typeof window === 'undefined') return;

  // Key-up chirp
  await playRadioKeyUpTone();

  if ('speechSynthesis' in window) {
    stopRadioSpeech();
    isSpeaking = true;
    callbacks?.onStart?.();

    const utterance = new SpeechSynthesisUtterance('Box, Box. Box this lap.');
    utterance.lang = 'en-US';
    utterance.rate = 1.15;
    utterance.pitch = 0.95;

    const voices = window.speechSynthesis.getVoices();
    const enVoice = voices.find(
      (v) => v.lang.startsWith('en') && (v.name.includes('David') || v.name.includes('George') || v.name.includes('Natural') || v.name.includes('Guy'))
    ) || voices.find((v) => v.lang.startsWith('en'));

    if (enVoice) {
      utterance.voice = enVoice;
    }

    utterance.onend = () => {
      isSpeaking = false;
      playRadioKeyDownTone();
      callbacks?.onEnd?.();
    };

    utterance.onerror = () => {
      isSpeaking = false;
      playRadioKeyDownTone();
      callbacks?.onEnd?.();
    };

    window.speechSynthesis.speak(utterance);
  } else {
    // If speech synthesis not supported, key-down tone after 1.2s
    setTimeout(() => {
      playRadioKeyDownTone();
      callbacks?.onEnd?.();
    }, 1200);
  }
}
