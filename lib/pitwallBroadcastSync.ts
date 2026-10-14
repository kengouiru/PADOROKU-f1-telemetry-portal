/**
 * lib/pitwallBroadcastSync.ts
 * Multi-Window Pitwall Broadcast Sync Engine (BroadcastChannel API)
 *
 * WHY: Enables real-time 2-screen synchronization between the Main Portal window
 * and detached Pop-out windows (/popout/telemetry, /pitwall, etc.).
 * Implements an initial REQUEST_STATE -> SYNC_STATE handshake plus initial URL query
 * parameters so a newly opened Pop-out window is immediately populated (zero blank flash).
 */

export const PITWALL_SYNC_CHANNEL = 'padoroku_pitwall_sync';

export interface PitwallSyncState {
  seasonYear: string;
  round: number;
  gpName?: string;
  circuitId: string;
  driver1Code: string;
  driver2Code: string;
  driver1?: string;
  driver2?: string;
  sessionName?: string;
  notes?: string;
  lapNumber?: number;
  sessionKey?: number | null;
  updatedAt: number;
}

export type PitwallSyncInput = {
  seasonYear?: string;
  round?: number;
  gpName?: string;
  circuitId: string;
  driver1Code?: string;
  driver2Code?: string;
  driver1?: string;
  driver2?: string;
  sessionName?: string;
  notes?: string;
  lapNumber?: number;
  sessionKey?: number | null;
  updatedAt?: number;
};

export function normalizePitwallState(input: PitwallSyncInput): PitwallSyncState {
  const d1 = input.driver1Code || input.driver1 || 'VER';
  const d2 = input.driver2Code || input.driver2 || 'NOR';
  return {
    seasonYear: input.seasonYear || '2026',
    round: input.round ?? 1,
    gpName: input.gpName,
    circuitId: input.circuitId,
    driver1Code: d1,
    driver2Code: d2,
    driver1: d1,
    driver2: d2,
    sessionName: input.sessionName,
    notes: input.notes,
    lapNumber: input.lapNumber,
    sessionKey: input.sessionKey,
    updatedAt: input.updatedAt ?? Date.now(),
  };
}

export type PitwallSyncMessage =
  | { type: 'REQUEST_STATE'; senderId: string }
  | { type: 'SYNC_STATE'; senderId: string; payload: PitwallSyncState };

/**
 * Opens a dedicated multi-monitor Pop-out window with initial URL query parameters
 * and BroadcastChannel support. Accepts either a URL string or a PitwallSyncInput object.
 */
export function openPitwallPopoutWindow(
  pathOrInput: string | PitwallSyncInput,
  windowName: string = 'padoroku_popout_telemetry',
  width: number = 1360,
  height: number = 860
): Window | null {
  if (typeof window === 'undefined') return null;
  let pathWithQuery: string;
  if (typeof pathOrInput === 'string') {
    pathWithQuery = pathOrInput;
  } else {
    const norm = normalizePitwallState(pathOrInput);
    const params = new URLSearchParams();
    params.set('circuit', norm.circuitId);
    params.set('d1', norm.driver1Code);
    params.set('d2', norm.driver2Code);
    if (norm.notes) params.set('notes', norm.notes);
    pathWithQuery = `/popout/telemetry?${params.toString()}`;
  }
  const left = Math.max(0, Math.round((window.screen.availWidth - width) / 2));
  const top = Math.max(0, Math.round((window.screen.availHeight - height) / 2));
  const features = `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes,status=no,toolbar=no,menubar=no,location=no`;
  const win = window.open(pathWithQuery, windowName, features);
  if (win) {
    win.focus();
  }
  return win;
}

/**
 * Broadcasts current Pitwall state to all open Pop-out windows.
 */
export function broadcastPitwallState(state: PitwallSyncInput, senderId: string = 'main'): void {
  if (typeof window === 'undefined' || typeof BroadcastChannel === 'undefined') return;
  try {
    const channel = new BroadcastChannel(PITWALL_SYNC_CHANNEL);
    const msg: PitwallSyncMessage = {
      type: 'SYNC_STATE',
      senderId,
      payload: normalizePitwallState(state),
    };
    channel.postMessage(msg);
    channel.close();
  } catch {
    // Ignore if BroadcastChannel is blocked in restricted iframe/browser context
  }
}

/**
 * Subscribes to Pitwall BroadcastChannel events and performs initial handshake.
 * - If role === 'popout', immediately sends REQUEST_STATE on mount so the parent responds with live state.
 * - If role === 'parent', responds to any REQUEST_STATE with `getCurrentState()`.
 */
export function subscribePitwallSync(options: {
  role: 'parent' | 'popout';
  getCurrentState?: () => PitwallSyncInput | null;
  onReceiveState?: (state: PitwallSyncState) => void;
}): () => void {
  if (typeof window === 'undefined' || typeof BroadcastChannel === 'undefined') {
    return () => {};
  }

  const senderId = `${options.role}_${Math.random().toString(36).slice(2, 8)}`;
  let channel: BroadcastChannel | null = null;

  try {
    channel = new BroadcastChannel(PITWALL_SYNC_CHANNEL);
    channel.onmessage = (event: MessageEvent<PitwallSyncMessage>) => {
      const data = event.data;
      if (!data || data.senderId === senderId) return;

      if (data.type === 'REQUEST_STATE' && options.role === 'parent' && options.getCurrentState) {
        const current = options.getCurrentState();
        if (current && channel) {
          channel.postMessage({
            type: 'SYNC_STATE',
            senderId,
            payload: normalizePitwallState(current),
          } satisfies PitwallSyncMessage);
        }
      } else if (data.type === 'SYNC_STATE' && options.onReceiveState) {
        options.onReceiveState(data.payload);
      }
    };

    if (options.role === 'popout') {
      channel.postMessage({
        type: 'REQUEST_STATE',
        senderId,
      } satisfies PitwallSyncMessage);
    }
  } catch {
    // Ignore channel errors
  }

  return () => {
    if (channel) {
      channel.close();
      channel = null;
    }
  };
}
