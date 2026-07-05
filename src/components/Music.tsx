import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, Music as MusicIcon, Disc, Star, Calendar, Sliders, RefreshCw, Volume2 } from 'lucide-react';
import { Track } from '../types';
import { tracks as defaultTracks } from '../data';
import CassettePlayer from './CassettePlayer';

interface MusicProps {
  ambientSound: boolean;
  allTracks: Track[];
}

export default function Music({ ambientSound, allTracks }: MusicProps) {
  const [currentTrack, setCurrentTrack] = useState<Track>(() => allTracks[0] || defaultTracks[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<string>('همه');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ambientAudioRef = useRef<HTMLAudioElement | null>(null);

  const genres = ['همه', 'Smooth Jazz', 'Soul & RnB', 'Jazz Fusion', 'Funk & Groove'];

  const filteredTracks = selectedGenre === 'همه' 
    ? allTracks 
    : allTracks.filter(t => t.genre === selectedGenre);

  // If currentTrack is not in the allTracks list (e.g. deleted), select the first one
  useEffect(() => {
    if (allTracks.length > 0 && !allTracks.some(t => t.id === currentTrack.id)) {
      setCurrentTrack(allTracks[0]);
    }
  }, [allTracks, currentTrack.id]);

  // Handle play/pause toggle
  const handlePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.log("Audio play error, user interaction required:", err);
      });
    }
  };

  // Select another track and autoplay it
  const selectTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(false);
    
    // Allow React state to update the audio src first, then load & play
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.load();
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(err => {
          console.log("Autoplay failed, waiting for user play trigger:", err);
        });
      }
    }, 100);
  };

  // Next Track
  const handleNext = () => {
    if (allTracks.length === 0) return;
    const currentIndex = allTracks.findIndex(t => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % allTracks.length;
    selectTrack(allTracks[nextIndex]);
  };

  // Prev Track
  const handlePrev = () => {
    if (allTracks.length === 0) return;
    const currentIndex = allTracks.findIndex(t => t.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + allTracks.length) % allTracks.length;
    selectTrack(allTracks[prevIndex]);
  };

  // Control vinyl crackle ambient noise (simulated old records)
  useEffect(() => {
    if (!ambientAudioRef.current) {
      // Create element dynamically if it doesn't exist
      const audio = document.createElement('audio');
      audio.src = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3'; // We'll loop a low background or standard soundhelix
      audio.loop = true;
      audio.volume = 0.05; // very subtle
      ambientAudioRef.current = audio;
    }

    if (ambientSound && isPlaying) {
      ambientAudioRef.current.play().catch(e => console.log("Ambient audio blocked:", e));
    } else {
      ambientAudioRef.current.pause();
    }
  }, [ambientSound, isPlaying]);

  // Clean up ambient audio on unmount
  useEffect(() => {
    return () => {
      if (ambientAudioRef.current) {
        ambientAudioRef.current.pause();
      }
    };
  }, []);

  return (
    <section id="music" className="py-12 md:py-20 px-4 md:px-8 max-w-7xl mx-auto" dir="rtl">
      
      {/* Title */}
      <div className="text-center space-y-3 mb-12">
        <h2 className="text-3xl md:text-5xl font-display text-gold-400 gold-glow">
          شنیدن آثار و آلبوم‌ها
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gold-400 to-transparent mx-auto" />
        <p className="text-gray-400 font-sans text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
          گلچینی از برترین تکنوازی‌ها، ترانه‌ها، بداهه‌نوازی‌های جاز و پروژه‌های تنظیمی کیانور پرتوی در سبک‌های جاز، سول و فانک.
        </p>
      </div>

      {/* Hidden Audio elements */}
      <audio 
        ref={audioRef} 
        src={currentTrack.audioUrl} 
        onEnded={handleNext}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Side: Retro Cassette Tape Player (6 Cols) */}
        <div className="lg:col-span-6 flex flex-col items-center space-y-6">
          <div className="w-full">
            <h3 className="text-white font-sans font-bold text-base mb-4 text-right flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-gold-400" />
              <span>پخش‌کننده نوار کاست آنالوگ (تعاملی)</span>
            </h3>
            
            <CassettePlayer
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              onPlayPause={handlePlayPause}
              onNext={handleNext}
              onPrev={handlePrev}
              audioRef={audioRef}
            />
          </div>

          {/* Style Bio Notes under player */}
          <div className="w-full bg-[#110f0c] border border-gold-400/10 rounded-xl p-5 text-right font-sans">
            <h4 className="text-gold-300 font-bold text-sm mb-2 flex items-center gap-1.5 justify-start">
              <Star className="w-4 h-4 text-gold-400" />
              <span>درباره اثر در حال پخش:</span>
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              {currentTrack.description}
            </p>
            <div className="border-t border-gold-400/10 mt-3 pt-3 grid grid-cols-2 gap-4 text-[11px] text-gray-500">
              <div>
                <span className="text-gold-400 font-medium">سازهای محوری:</span> {currentTrack.instrument}
              </div>
              <div className="text-left" dir="ltr">
                <span className="text-gold-400 font-medium font-sans">Year:</span> {currentTrack.year}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Track List & Filter Widget (6 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Genre Filters */}
          <div className="flex flex-wrap gap-2 justify-start font-sans">
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`text-xs px-3.5 py-1.5 rounded-full border transition-all cursor-pointer ${
                  selectedGenre === genre
                    ? 'bg-gold-400 border-gold-400 text-black font-bold'
                    : 'bg-[#14120f] border-gold-400/20 text-gray-400 hover:border-gold-400/60 hover:text-gold-300'
                }`}
              >
                {genre === 'همه' ? 'همه سبک‌ها' : genre}
              </button>
            ))}
          </div>

          {/* Track List Grid */}
          <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-1">
            <AnimatePresence mode="popLayout">
              {filteredTracks.map((track) => {
                const isCurrent = track.id === currentTrack.id;
                return (
                  <motion.div
                    key={track.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onClick={() => selectTrack(track)}
                    className={`group relative p-4 rounded-xl border transition-all duration-300 flex items-center justify-between gap-4 cursor-pointer select-none ${
                      isCurrent 
                        ? 'bg-[#1f1911] border-gold-400 shadow-[0_5px_15px_rgba(194,135,50,0.1)]' 
                        : 'bg-[#12100e]/80 border-gold-400/10 hover:border-gold-400/30 hover:bg-[#181512]'
                    }`}
                  >
                    {/* Hover gold glowing left bar */}
                    <div className={`absolute top-0 right-0 h-full w-1 rounded-l-md transition-all ${
                      isCurrent ? 'bg-gold-400' : 'bg-transparent group-hover:bg-gold-500/40'
                    }`} />

                    <div className="flex items-center gap-3">
                      {/* CD/Cover Art thumbnail */}
                      <div className="relative w-12 h-12 rounded-lg bg-black border border-gold-400/20 overflow-hidden flex items-center justify-center">
                        <img 
                          src={track.coverUrl} 
                          alt={track.title} 
                          className={`w-full h-full object-cover grayscale opacity-80 ${isCurrent ? 'grayscale-0 rotate-12 scale-110' : ''}`}
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          {isCurrent && isPlaying ? (
                            <div className="flex items-center gap-0.5 h-4">
                              <span className="w-0.5 h-3 bg-gold-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                              <span className="w-0.5 h-4 bg-gold-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                              <span className="w-0.5 h-2 bg-gold-400 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />
                            </div>
                          ) : (
                            <Play className="w-4 h-4 text-gold-300" />
                          )}
                        </div>
                      </div>

                      {/* Titles & info */}
                      <div className="text-right font-sans">
                        <h4 className={`text-sm font-bold transition-colors ${isCurrent ? 'text-gold-400' : 'text-white'}`}>
                          {track.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] bg-gold-400/10 text-gold-300 px-1.5 py-0.5 rounded font-medium">
                            {track.genre}
                          </span>
                          <span className="text-[10px] text-gray-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-gold-500/40" />
                            {track.year}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Left: Duration and Play Indicators */}
                    <div className="flex items-center gap-4 text-xs font-mono text-gray-400">
                      <span className="hidden md:inline text-[10px] text-gray-500 font-sans max-w-[120px] truncate text-left" dir="ltr">
                        {track.instrument}
                      </span>
                      <span className="bg-[#171410] px-2 py-1 rounded border border-gold-400/5 text-[11px]">
                        {track.duration}
                      </span>
                    </div>

                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Analog aesthetic footer tag */}
          <div className="flex items-center justify-between p-3.5 bg-[#14120f]/60 rounded-xl border border-gold-400/5 text-[10px] font-mono text-gold-400/40" dir="ltr">
            <span>SOUND DESIGN BY KIANOUR PARTOVI</span>
            <span>HIGH-FIDELITY 192KBPS DOLBY</span>
          </div>
        </div>

      </div>
    </section>
  );
}
