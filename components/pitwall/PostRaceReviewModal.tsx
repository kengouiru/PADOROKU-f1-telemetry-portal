import React, { useState, useEffect, useMemo } from 'react';
import { X, PlayCircle, Loader2, RadioReceiver, Volume2, ShieldAlert } from 'lucide-react';
import { fetchSessions, fetchTeamRadio, fetchDrivers, type SessionResultRow, fetchSessionResult } from '@/lib/openf1Api';
import type { TeamRadio, Driver, Session, RaceControlMessage } from '@/lib/types';
import { fetchRaceControl } from '@/lib/openf1Api';
import { constructorColour } from '@/lib/jolpicaRaceSummary';

export function PostRaceReviewModal({
  round,
  onClose
}: {
  round: number;
  onClose: () => void;
}) {
  const [session, setSession] = useState<Session | null>(null);
  const [radios, setRadios] = useState<TeamRadio[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [raceControl, setRaceControl] = useState<RaceControlMessage[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const year = 2024; // Mocking 2026 using 2024 OpenF1 data
        const sessions = await fetchSessions(year);
        
        // Find the race session for this round
        const sortedSessions = sessions.sort((a, b) => new Date(a.date_start).getTime() - new Date(b.date_start).getTime());
        const meetings = new Map<number, typeof sessions>();
        for (const s of sortedSessions) {
          if (!meetings.has(s.meeting_key)) meetings.set(s.meeting_key, []);
          meetings.get(s.meeting_key)!.push(s);
        }
        
        const meetingKeys = Array.from(meetings.keys());
        const meetingKey = meetingKeys[round - 1]; 
        if (!meetingKey) throw new Error('Meeting not found');
        
        const weekendSessions = meetings.get(meetingKey)!;
        const raceSession = weekendSessions.find(s => s.session_name === 'Race');
        if (!raceSession) throw new Error('Race session not found');
        
        if (!active) return;
        setSession(raceSession);
        
        // Fetch Drivers, Radios and Race Control
        const [drv, rdo, rc] = await Promise.all([
          fetchDrivers(raceSession.session_key),
          fetchTeamRadio(raceSession.session_key), // We made driverNumber optional
          fetchRaceControl(raceSession.session_key)
        ]);
        
        if (!active) return;
        setDrivers(drv);
        setRadios(rdo);
        setRaceControl(rc);
        
      } catch (e) {
        console.error(e);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, [round]);

  const driverMap = useMemo(() => new Map(drivers.map(d => [d.driver_number, d])), [drivers]);
  
  // Combine Team Radios and Race Control Messages into a single timeline
  const timeline = useMemo(() => {
    type TimelineItem = 
      | { type: 'radio'; time: number; date: Date; data: TeamRadio }
      | { type: 'race_control'; time: number; date: Date; data: RaceControlMessage };
      
    const items: TimelineItem[] = [];
    
    for (const r of radios) {
      items.push({ type: 'radio', time: new Date(r.date).getTime(), date: new Date(r.date), data: r });
    }
    for (const rc of raceControl) {
      items.push({ type: 'race_control', time: new Date(rc.date).getTime(), date: new Date(rc.date), data: rc });
    }
    
    return items.sort((a, b) => a.time - b.time);
  }, [radios, raceControl]);

  // Audio Playback
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-full flex flex-col bg-slate-950 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-900/50">
          <div>
            <h2 className="text-lg font-bold text-white font-racing">POST-RACE REVIEW</h2>
            <p className="text-xs text-slate-400 mt-0.5">{session?.meeting_name || 'Loading...'} - Timeline & Team Radios</p>
          </div>
          <button onClick={onClose} className="p-2 -mr-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/10">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin mb-4 text-emerald-500" />
              <p>通信記録を復号中...</p>
            </div>
          ) : timeline.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500">
              <p>このレースの通信記録はまだ利用できません。</p>
            </div>
          ) : (
            <div className="relative border-l-2 border-white/5 ml-4 pl-6 space-y-6">
              {timeline.map((item, idx) => {
                if (item.type === 'radio') {
                  const driver = driverMap.get(item.data.driver_number);
                  const isPlaying = playingAudio === item.data.recording_url;
                  return (
                    <div key={`radio-${idx}`} className="relative">
                      <div className="absolute -left-[35px] top-1.5 w-6 h-6 rounded-full bg-slate-800 border-2 border-slate-950 flex items-center justify-center">
                        <RadioReceiver className="w-3 h-3 text-slate-400" />
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="flex-1 rounded-xl bg-slate-900/80 border border-white/5 p-4 relative overflow-hidden group">
                          {/* Accent Color */}
                          <div 
                            className="absolute left-0 top-0 bottom-0 w-1" 
                            style={{ backgroundColor: constructorColour(driver?.team_name?.toLowerCase().replace(/ /g, '_') || '') }} 
                          />
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-white">{driver?.name_acronym || `#${item.data.driver_number}`}</span>
                              <span className="text-xs text-slate-500">{driver?.team_name}</span>
                            </div>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {item.date.toLocaleTimeString('ja-JP', { hour12: false, timeZone: 'UTC' })} UTC
                            </span>
                          </div>
                          
                          <div className="mt-3 flex items-center justify-between">
                            <button
                              onClick={() => {
                                if (isPlaying) {
                                  setPlayingAudio(null); // Pause audio logic would go here
                                } else {
                                  setPlayingAudio(item.data.recording_url);
                                  const audio = new Audio(item.data.recording_url);
                                  audio.play();
                                  audio.onended = () => setPlayingAudio(null);
                                }
                              }}
                              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                                isPlaying ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                              }`}
                            >
                              {isPlaying ? <Volume2 className="w-4 h-4 animate-pulse" /> : <PlayCircle className="w-4 h-4" />}
                              {isPlaying ? '再生中...' : '無線を再生'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div key={`rc-${idx}`} className="relative">
                      <div className="absolute -left-[35px] top-1.5 w-6 h-6 rounded-full bg-amber-500/20 border-2 border-slate-950 flex items-center justify-center">
                        <ShieldAlert className="w-3 h-3 text-amber-500" />
                      </div>
                      <div className="flex items-start gap-4 opacity-80">
                        <div className="flex-1 rounded-xl bg-amber-950/30 border border-amber-500/20 p-4">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-amber-500 font-racing">RACE CONTROL</span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {item.date.toLocaleTimeString('ja-JP', { hour12: false, timeZone: 'UTC' })} UTC
                            </span>
                          </div>
                          <p className="text-sm text-slate-300 uppercase tracking-wide">{item.data.message}</p>
                        </div>
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
