import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Music, Calendar, MapPin, Award, ArrowLeft, Disc } from 'lucide-react';
import { kianourProfile } from '../data';

interface HeroProps {
  onNavigateToSection: (section: string) => void;
}

const heroImages = [
  {
    url: './assets/images/hero_image_1_1783213279475.jpg',
    caption: 'پرتره هنری استودیویی',
    sub: 'آهنگساز و نوازنده گیتار الکتریک جز'
  },
  {
    url: './assets/images/hero_image_2_1783213289225.jpg',
    caption: 'نمای نزدیک از نوازنده نوستالژیک',
    sub: 'تهیه‌کننده و مهندس صدای آنالوگ'
  },
  {
    url: './assets/images/hero_image_3_1783213299822.jpg',
    caption: 'استایل خیابانی در فضای باز',
    sub: 'رهبر ارکستر بزرگ جاز-پاپ تهران'
  }
];

export default function Hero({ onNavigateToSection }: HeroProps) {
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  // Auto-slide every 4.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveImgIndex((prev) => (prev + 1) % heroImages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);
  return (
    <section id="home" className="py-12 md:py-20 px-4 md:px-8 max-w-7xl mx-auto" dir="rtl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Biography & Titles Block (7 Cols on large screen) */}
        <div className="lg:col-span-7 space-y-6 text-right order-2 lg:order-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-gold-400/10 border border-gold-400/30 rounded-full text-gold-400 text-xs font-sans font-medium"
          >
            <span className="w-2 h-2 rounded-full bg-gold-400 animate-ping" />
            <span>{kianourProfile.experience}</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-2"
          >
            <h2 className="text-4xl md:text-6xl font-display text-white tracking-wide leading-tight">
              خالق نواهای <span className="text-transparent bg-clip-text bg-gradient-to-l from-gold-500 to-gold-300 gold-glow">ماندگار و نوستالژیک</span>
            </h2>
            <p className="text-lg text-gold-200/80 font-sans font-medium">
              {kianourProfile.title}
            </p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-400 text-base leading-relaxed max-w-2xl font-light"
          >
            {kianourProfile.bio}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="p-4 bg-[#14120f] border border-gold-400/10 rounded-xl relative overflow-hidden group box-glow"
          >
            <div className="absolute right-0 top-0 w-24 h-24 bg-gold-400/2 rounded-full blur-xl group-hover:bg-gold-400/5 transition-all" />
            <h4 className="text-gold-400 font-sans font-bold text-sm mb-1">فلسفه هنری من:</h4>
            <p className="text-xs text-gray-300 leading-relaxed italic font-light">
              «{kianourProfile.philosophy}»
            </p>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap gap-4 pt-4"
          >
            <button
              onClick={() => onNavigateToSection('music')}
              className="bg-gradient-to-r from-gold-600 to-gold-400 text-black font-bold font-sans px-8 py-3.5 rounded-lg text-sm border border-gold-300 shadow-[0_5px_15px_rgba(194,135,50,0.25)] hover:shadow-[0_5px_22px_rgba(194,135,50,0.45)] hover:from-gold-500 hover:to-gold-300 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Music className="w-4 h-4 text-black" />
              <span>شنیدن قطعات موسیقی</span>
            </button>
            
            <button
              onClick={() => onNavigateToSection('about')}
              className="border border-gold-400/40 hover:border-gold-400 text-gold-400 bg-gold-400/5 hover:bg-gold-400/10 font-bold font-sans px-8 py-3.5 rounded-lg text-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>درباره من و مدارج علمی</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </motion.div>

          {/* Core Info Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-gold-400/10 font-sans"
          >
            <div className="flex items-center gap-2.5 text-gray-400 text-xs">
              <div className="w-8 h-8 rounded-lg bg-[#14120f] border border-gold-400/20 flex items-center justify-center text-gold-400">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="flex flex-col text-right">
                <span className="text-gray-500 text-[10px]">موقعیت هنری</span>
                <span className="font-medium text-gray-300">تهران، ایران</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 text-gray-400 text-xs">
              <div className="w-8 h-8 rounded-lg bg-[#14120f] border border-gold-400/20 flex items-center justify-center text-gold-400">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="flex flex-col text-right">
                <span className="text-gray-500 text-[10px]">سابقه آهنگسازی</span>
                <span className="font-medium text-gray-300">از سال ۱۳۸۲</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 text-gray-400 text-xs col-span-2 sm:col-span-1">
              <div className="w-8 h-8 rounded-lg bg-[#14120f] border border-gold-400/20 flex items-center justify-center text-gold-400">
                <Award className="w-4 h-4" />
              </div>
              <div className="flex flex-col text-right">
                <span className="text-gray-500 text-[10px]">مدارک تحصیلی</span>
                <span className="font-medium text-gray-300">کارشناسی ارشد موسیقی</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Vintage Portrait / Artwork Side (5 Cols) */}
        <div className="lg:col-span-5 flex justify-center order-1 lg:order-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Background absolute spinning vinyl record behind photo */}
            <div className="absolute -left-12 -bottom-10 w-44 h-44 rounded-full bg-black border-4 border-[#1f1d19] shadow-[0_4px_25px_rgba(0,0,0,0.9)] flex items-center justify-center z-0 animate-spin-slow opacity-90 hidden sm:flex">
              <div className="w-40 h-40 rounded-full border-4 border-dashed border-[#2d2820] flex items-center justify-center bg-black">
                <div className="w-20 h-20 rounded-full bg-[#171410] border-2 border-gold-400/30 flex items-center justify-center">
                  <Disc className="w-10 h-10 text-gold-400/30" />
                </div>
              </div>
            </div>

            {/* Glowing gold backlighting */}
            <div className="absolute -inset-1.5 bg-gradient-to-tr from-gold-600 to-gold-400 rounded-2xl blur opacity-35 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 z-0" />

            {/* Portrait Frame with Slideshow */}
            <div className="relative z-10 w-[280px] sm:w-[340px] aspect-[3/4] bg-[#14120f] border-4 border-gold-400 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.9)] flex flex-col justify-end group">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImgIndex}
                  src={heroImages[activeImgIndex].url}
                  alt={heroImages[activeImgIndex].caption}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0 w-full h-full object-cover grayscale hover:grayscale-0 contrast-[1.15] hover:contrast-100 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
              </AnimatePresence>
              
              {/* Retro Film Grain overlay & dark ambient vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30 pointer-events-none z-10" />
              
              {/* Active Image Indicator & Captions Row */}
              <div className="absolute bottom-4 inset-x-4 bg-[#0a0907]/90 border border-gold-400/20 p-3 rounded-xl text-center backdrop-blur-sm z-20 flex flex-col items-center gap-2" dir="rtl">
                <div>
                  <h4 className="font-display text-base text-gold-400 tracking-wider font-bold">
                    {heroImages[activeImgIndex].caption}
                  </h4>
                  <p className="text-[10px] text-gray-300 font-sans mt-0.5">
                    {heroImages[activeImgIndex].sub}
                  </p>
                </div>
                
                {/* Dots to slide manually */}
                <div className="flex justify-center gap-1.5 mt-0.5">
                  {heroImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImgIndex(idx)}
                      className={`w-1.5 h-1.5 rounded-full cursor-pointer transition-all ${
                        idx === activeImgIndex ? 'bg-gold-400 w-3.5' : 'bg-gray-500/50 hover:bg-gold-400/50'
                      }`}
                      title={heroImages[idx].caption}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
