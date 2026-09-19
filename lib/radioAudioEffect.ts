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

/** Play short radio key-up chirp tone (F1 Team Radio start tone) */
export function playRadioKeyUpTone(): Promise<void> {
  return new Promise((resolve) => {
    const ctx = getAudioContext();
    if (!ctx) return resolve();

    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(1750, now);
    osc1.frequency.setValueAtTime(2250, now + 0.04);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(880, now);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.09);
    osc2.stop(now + 0.09);

    setTimeout(resolve, 95);
  });
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
