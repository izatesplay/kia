import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Disc, Music, Sliders, Volume2, VolumeX, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Track } from '../types';
import { useLanguage } from '../lib/LanguageContext';

interface CassettePlayerProps {
  currentTrack: Track;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

export default function CassettePlayer({
  currentTrack,
  isPlaying,
  onPlayPause,
  onNext,
  onPrev,
  audioRef
}: CassettePlayerProps) {
  const { language, isRtl, t } = useLanguage();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [vuLevels, setVuLevels] = useState<number[]>([10, 10, 10, 10, 10, 10, 10, 10]);

  // Handle duration and progress updates
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleDurationChange = () => {
      setDuration(audio.duration || 0);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
    };
  }, [audioRef, currentTrack]);

  // Adjust volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted, audioRef]);

  // Bouncing VU meter simulation when playing
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setVuLevels(
          Array.from({ length: 8 }, () => Math.floor(Math.random() * 85) + 15)
        );
      }, 100);
    } else {
      setVuLevels([10, 10, 10, 10, 10, 10, 10, 10]);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const formatTime = (time: number) => {
    if (isNaN(time)) return '00:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-[#14120f] border-4 border-gold-400 rounded-2xl p-6 shadow-[0_15px_40px_rgba(0,0,0,0.8),0_0_30px_rgba(211,166,85,0.15)] select-none" dir="ltr">
      {/* Cassette Tape Housing */}
      <div className="relative aspect-[1.6/1] w-full bg-[#1c1914] rounded-xl border-2 border-gold-600/40 p-4 shadow-[inset_0_4px_12px_rgba(0,0,0,0.9)] overflow-hidden">
        
        {/* Tape background texture and subtle lighting */}
        <div className="absolute inset-0 cassette-label opacity-40 rounded-lg pointer-events-none" />
        <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

        {/* Cassette top title block */}
        <div className="relative flex justify-between items-center bg-[#28241d] border border-gold-400/20 px-3 py-1.5 rounded text-[11px] text-gold-300 font-mono tracking-widest uppercase">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-red-500 font-sans">A</span>
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          </div>
          <span className="max-w-[180px] truncate text-center font-sans font-medium text-gold-200">
            {language === 'fa' ? currentTrack.title : currentTrack.titleEn} ({currentTrack.genre})
          </span>
          <span>NOISE REDUCTION [ON]</span>
        </div>

        {/* The Window of Cassette */}
        <div className="relative mt-5 mx-6 h-1/2 bg-[#0d0c0a] rounded-lg border-2 border-gold-400/30 shadow-[inset_0_4px_10px_rgba(0,0,0,0.9)] flex items-center justify-between px-10 overflow-hidden">
          
          {/* Left Reel */}
          <div className="relative flex items-center justify-center">
            {/* Spinning Tape Base */}
            <motion.div 
              animate={isPlaying ? { rotate: 360 } : {}}
              transition={isPlaying ? { repeat: Infinity, duration: 12, ease: "linear" } : {}}
              className="w-16 h-16 rounded-full border-4 border-dashed border-gold-500/20 flex items-center justify-center bg-[#151310] shadow-md"
            >
              {/* Inner Gear teeth */}
              <div className="w-8 h-8 rounded-full border-2 border-gold-400/40 bg-black flex items-center justify-center">
                <div className="w-4 h-4 rounded-full border border-gold-300/20 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                </div>
              </div>
            </motion.div>
            {/* Remaining magnetic tape wrap visualization */}
            <div 
              className="absolute -z-10 rounded-full bg-[#3e3424] opacity-80"
              style={{
                width: `${64 + (1 - currentTime / (duration || 300)) * 20}px`,
                height: `${64 + (1 - currentTime / (duration || 300)) * 20}px`,
                transition: 'width 1s, height 1s'
              }}
            />
          </div>

          {/* Tape window details (scale / guide) */}
          <div className="flex flex-col items-center gap-1 opacity-60">
            <div className="flex gap-1.5">
              <div className="w-0.5 h-2.5 bg-gold-500/50" />
              <div className="w-0.5 h-3.5 bg-gold-400" />
              <div className="w-0.5 h-2.5 bg-gold-500/50" />
            </div>
            <div className="font-mono text-[8px] text-gold-400/60 tracking-wider">C-60</div>
          </div>

          {/* Right Reel */}
          <div className="relative flex items-center justify-center">
            {/* Spinning Tape Base */}
            <motion.div 
              animate={isPlaying ? { rotate: 360 } : {}}
              transition={isPlaying ? { repeat: Infinity, duration: 12, ease: "linear" } : {}}
              className="w-16 h-16 rounded-full border-4 border-dashed border-gold-500/20 flex items-center justify-center bg-[#151310] shadow-md"
            >
              {/* Inner Gear teeth */}
              <div className="w-8 h-8 rounded-full border-2 border-gold-400/40 bg-black flex items-center justify-center">
                <div className="w-4 h-4 rounded-full border border-gold-300/20 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                </div>
              </div>
            </motion.div>
            {/* Accumulating magnetic tape wrap visualization */}
            <div 
              className="absolute -z-10 rounded-full bg-[#3e3424] opacity-80"
              style={{
                width: `${64 + (currentTime / (duration || 300)) * 20}px`,
                height: `${64 + (currentTime / (duration || 300)) * 20}px`,
                transition: 'width 1s, height 1s'
              }}
            />
          </div>

          {/* Vintage Gloss Highlight Overlay */}
          <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
          <div className="absolute -left-12 -top-12 w-24 h-48 bg-white/2 rotate-[35deg] pointer-events-none" />
        </div>

        {/* Bottom screw holes & detail marks */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex items-center gap-12 text-gold-500/20">
          <span className="text-[7px] tracking-widest font-mono">ANALOG PHONICS SYSTEM</span>
        </div>
      </div>

      {/* Track Details Sub-Display */}
      <div className="mt-4 bg-[#0a0907] border border-gold-500/20 rounded-lg p-3 flex flex-col sm:flex-row items-center justify-between gap-3 font-sans" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className={`${isRtl ? 'text-right' : 'text-left'} w-full sm:w-auto`}>
          <h3 className="text-gold-400 font-bold text-sm font-sans">
            {language === 'fa' ? currentTrack.title : currentTrack.titleEn}
          </h3>
          <p className="text-[11px] text-gray-400 mt-0.5">
            {language === 'fa' ? currentTrack.instrument : (currentTrack.instrumentEn || currentTrack.instrument)}
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono text-gold-300" dir="ltr">
          <span className="bg-[#1a1712] px-2 py-1 rounded border border-gold-400/10">
            {formatTime(currentTime)}
          </span>
          <span className="text-gold-500">/</span>
          <span className="bg-[#1a1712] px-2 py-1 rounded border border-gold-400/10">
            {formatTime(duration || 312)}
          </span>
        </div>
      </div>

      {/* Progress slider (Seek) */}
      <div className="mt-4 flex items-center gap-2" dir="ltr">
        <span className="text-[10px] font-mono text-gold-500">0:00</span>
        <input
          type="range"
          min="0"
          max={duration || 100}
          value={currentTime}
          onChange={handleSeek}
          className="flex-1 accent-gold-400 bg-gold-950/40 h-1.5 rounded-lg appearance-none cursor-pointer border border-gold-600/20"
        />
        <span className="text-[10px] font-mono text-gold-500">{formatTime(duration)}</span>
      </div>

      {/* VU LED Lights Output */}
      <div className="mt-4 flex items-center justify-between bg-[#0a0907] border border-gold-500/10 rounded-lg px-3 py-2" dir="ltr">
        <span className="text-[9px] font-mono text-gold-500/70 tracking-widest uppercase">VU LEVELS</span>
        <div className="flex gap-1.5 h-3 items-end">
          {vuLevels.map((level, i) => {
            const isRed = i >= 6;
            const isYellow = i >= 4 && i < 6;
            const activeColor = isRed 
              ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' 
              : isYellow 
                ? 'bg-amber-400 shadow-[0_0_8px_#fbbf24]' 
                : 'bg-emerald-500 shadow-[0_0_8px_#10b981]';
            return (
              <div key={i} className="flex flex-col gap-0.5 w-2 h-full justify-end bg-black/40 rounded-sm overflow-hidden">
                <div 
                  className={`w-full transition-all duration-100 rounded-sm ${activeColor}`}
                  style={{ height: `${level}%` }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Player Action Buttons (Tape Deck Controls) */}
      <div className="mt-5 flex items-center justify-between gap-2 border-t border-gold-400/10 pt-4" dir="ltr">
        {/* Previous Button */}
        <button
          onClick={onPrev}
          className="p-2.5 rounded-lg border border-gold-500/30 bg-[#1e1a14] text-gold-400 hover:text-gold-300 hover:border-gold-400 hover:bg-[#28231b] active:scale-95 transition-all cursor-pointer"
          title={t('prevTrack')}
        >
          <SkipBack className="w-5 h-5" />
        </button>

        {/* Play / Pause button */}
        <button
          onClick={onPlayPause}
          className="flex-1 py-2.5 max-w-[200px] rounded-lg border-2 border-gold-400 bg-gold-400 text-black font-sans font-bold flex items-center justify-center gap-2 hover:bg-gold-300 hover:border-gold-300 active:scale-95 transition-all shadow-[0_4px_15px_rgba(194,135,50,0.3)] cursor-pointer"
          title={isPlaying ? t('pauseTrack') : t('playTrack')}
        >
          {isPlaying ? (
            <>
              <Pause className="w-4.5 h-4.5 fill-black" />
              <span className="text-xs uppercase tracking-wider font-mono">PAUSE</span>
            </>
          ) : (
            <>
              <Play className="w-4.5 h-4.5 fill-black" />
              <span className="text-xs uppercase tracking-wider font-mono">PLAY</span>
            </>
          )}
        </button>

        {/* Next Button */}
        <button
          onClick={onNext}
          className="p-2.5 rounded-lg border border-gold-500/30 bg-[#1e1a14] text-gold-400 hover:text-gold-300 hover:border-gold-400 hover:bg-[#28231b] active:scale-95 transition-all cursor-pointer"
          title={t('nextTrack')}
        >
          <SkipForward className="w-5 h-5" />
        </button>

        {/* Volume Controls */}
        <div className="flex items-center gap-1.5 bg-[#171410] border border-gold-500/10 rounded-lg px-2 py-1">
          <button onClick={toggleMute} className="text-gold-400 hover:text-gold-300 transition-colors">
            {isMuted || volume === 0 ? <VolumeX className="w-4.5 h-4.5" /> : <Volume2 className="w-4.5 h-4.5" />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              setIsMuted(false);
            }}
            className="w-16 accent-gold-400 bg-gold-950/20 h-1 rounded-sm appearance-none cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
