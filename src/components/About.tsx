import React from 'react';
import { motion } from 'motion/react';
import { Award, GraduationCap, Calendar, ShieldCheck, Heart, Radio, Disc, Music, Youtube, Instagram, Headphones } from 'lucide-react';
import { kianourProfile, achievements } from '../data';
import { useLanguage } from '../lib/LanguageContext';

export default function About() {
  const { language, isRtl, t } = useLanguage();

  return (
    <section id="about" className="py-12 md:py-20 px-4 md:px-8 max-w-7xl mx-auto" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Section Header */}
      <div className="text-center space-y-3 mb-16">
        <h2 className="text-3xl md:text-5xl font-display text-gold-400 gold-glow">
          {t('aboutTitle')}
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gold-400 to-transparent mx-auto" />
        <p className="text-gray-400 font-sans text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
          {t('aboutDesc')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Side: Editorial Bio & Education Timeline (7 Cols) */}
        <div className={`lg:col-span-7 space-y-10 ${isRtl ? 'text-right' : 'text-left'}`}>
          
          {/* Philosophy Card */}
          <div className="space-y-4">
            <h3 className="text-xl md:text-2xl font-display text-white border-b border-gold-400/20 pb-2.5">
              {t('aboutHeaderEditorial')}
            </h3>
            <p className="text-gray-300 font-sans leading-relaxed text-sm">
              {t('aboutBioP1')}
            </p>
            <p className="text-gray-300 font-sans leading-relaxed text-sm">
              {t('aboutBioP2')}
            </p>
          </div>

          {/* Social Links Panel */}
          <div 
            className="bg-site-surface border border-gold-400/15 p-6 rounded-2xl relative overflow-hidden box-glow"
            style={{ backgroundColor: 'var(--site-surface)' }}
          >
            <div className="absolute top-0 left-0 w-24 h-24 bg-gold-400/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className={`${isRtl ? 'text-right' : 'text-left'} space-y-1`}>
                <h4 className="text-md font-sans font-bold text-gold-400 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
                  <span>{t('socialTitle')}</span>
                </h4>
                <p className="text-xs text-gray-400 leading-relaxed font-sans">
                  {t('socialDesc')}
                </p>
              </div>
              
              {/* Sleek Buttons Container */}
              <div className="flex flex-wrap items-center gap-3.5 justify-center md:justify-end" dir="ltr">
                
                {/* Spotify */}
                <a 
                  href="https://spotify.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black/60 border border-gold-400/20 text-gold-300 hover:text-black hover:bg-gold-400 hover:border-gold-400 transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] cursor-pointer"
                >
                  <Headphones className="w-4 h-4 transition-transform group-hover:rotate-12 duration-300" />
                  <span className="text-xs font-mono font-bold tracking-wider uppercase">Spotify</span>
                </a>

                {/* SoundCloud */}
                <a 
                  href="https://soundcloud.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black/60 border border-gold-400/20 text-gold-300 hover:text-black hover:bg-gold-400 hover:border-gold-400 transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] cursor-pointer"
                >
                  <Radio className="w-4 h-4 transition-transform group-hover:-rotate-12 duration-300" />
                  <span className="text-xs font-mono font-bold tracking-wider uppercase">SoundCloud</span>
                </a>

                {/* YouTube */}
                <a 
                  href="https://youtube.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black/60 border border-gold-400/20 text-gold-300 hover:text-black hover:bg-gold-400 hover:border-gold-400 transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] cursor-pointer"
                >
                  <Youtube className="w-4 h-4 transition-transform group-hover:scale-110 duration-300" />
                  <span className="text-xs font-mono font-bold tracking-wider uppercase">YouTube</span>
                </a>

                {/* Instagram */}
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black/60 border border-gold-400/20 text-gold-300 hover:text-black hover:bg-gold-400 hover:border-gold-400 transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] cursor-pointer"
                >
                  <Instagram className="w-4 h-4 transition-transform group-hover:rotate-12 duration-300" />
                  <span className="text-xs font-mono font-bold tracking-wider uppercase">Instagram</span>
                </a>

              </div>
            </div>
          </div>

          {/* Education timeline */}
          <div className="space-y-6">
            <h3 className="text-lg font-sans font-bold text-gold-400 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-gold-400" />
              <span>{t('academicSubtitle')}</span>
            </h3>

            <div className={`relative ${isRtl ? 'border-r mr-4 pr-6' : 'border-l ml-4 pl-6'} border-gold-400/20 space-y-8`}>
              {kianourProfile.education.map((edu, i) => (
                <div key={i} className="relative">
                  {/* Timeline dot */}
                  <span 
                    className={`absolute ${isRtl ? '-right-[31px]' : '-left-[31px]'} top-1.5 w-4 h-4 rounded-full bg-site-bg border-2 border-gold-400 flex items-center justify-center`}
                    style={{ backgroundColor: 'var(--site-bg)' }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                  </span>
                  
                  <div 
                    className="bg-site-surface border border-gold-400/10 p-4 rounded-xl box-glow"
                    style={{ backgroundColor: 'var(--site-surface)' }}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <h4 className="text-sm font-bold text-white font-sans">
                        {language === 'fa' ? edu.degree : edu.degreeEn}
                      </h4>
                      <span className="text-[10px] font-mono bg-gold-400/10 text-gold-300 px-2 py-0.5 rounded">
                        {language === 'fa' ? edu.year : edu.yearEn}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1.5 font-sans">
                      {language === 'fa' ? edu.school : edu.schoolEn}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Visual achievements & styles (5 Cols) */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Side-by-Side Art Frames */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative group rounded-xl overflow-hidden border-2 border-gold-400/20 aspect-[4/5] bg-black shadow-[0_10px_25px_rgba(0,0,0,0.5)]">
              <img 
                src="./assets/images/about_image_1_1783213310316.jpg" 
                alt={t('photoCapComp')} 
                className="w-full h-full object-cover grayscale hover:grayscale-0 contrast-[1.1] transition-all duration-700 hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />
              <span className={`absolute bottom-2.5 ${isRtl ? 'right-3' : 'left-3'} text-[9px] sm:text-[10px] text-gold-300 bg-black/85 px-2 py-0.5 rounded border border-gold-400/20 font-sans`}>
                {t('photoCapComp')}
              </span>
            </div>

            <div className="relative group rounded-xl overflow-hidden border-2 border-gold-400/20 aspect-[4/5] bg-black shadow-[0_10px_25px_rgba(0,0,0,0.5)]">
              <img 
                src="./assets/images/about_image_2_1783213319351.jpg" 
                alt={t('photoCapAnalog')} 
                className="w-full h-full object-cover grayscale hover:grayscale-0 contrast-[1.15] transition-all duration-700 hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />
              <span className={`absolute bottom-2.5 ${isRtl ? 'right-3' : 'left-3'} text-[9px] sm:text-[10px] text-gold-300 bg-black/85 px-2 py-0.5 rounded border border-gold-400/20 font-sans`}>
                {t('photoCapAnalog')}
              </span>
            </div>
          </div>

          {/* Musical Styles Showcase */}
          <div 
            className="bg-site-surface border border-gold-400/15 p-6 rounded-2xl relative overflow-hidden"
            style={{ backgroundColor: 'var(--site-surface)' }}
          >
            <div className="absolute top-0 left-0 w-20 h-20 bg-gold-500/5 rounded-full blur-2xl pointer-events-none" />
            <h3 className="text-md font-sans font-bold text-gold-400 mb-5 flex items-center gap-2">
              <Disc className="w-5 h-5 text-gold-400 animate-spin-slow" />
              <span>{t('stylesShowcaseTitle')}</span>
            </h3>

            <div className={`space-y-4 font-sans ${isRtl ? 'text-right' : 'text-left'}`}>
              {kianourProfile.styles.map((style, i) => (
                <div key={i} className="border-b border-gold-400/5 pb-3 last:border-b-0 last:pb-0">
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                    <span dir="ltr">{language === 'fa' ? style.name : style.nameEn}</span>
                  </h4>
                  <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                    {language === 'fa' ? style.desc : style.descEn}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Golden Milestones List */}
          <div className={`space-y-4 ${isRtl ? 'text-right' : 'text-left'}`}>
            <h3 className="text-lg font-sans font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-gold-400" />
              <span>{t('honorsTitle')}</span>
            </h3>

            <div className="space-y-3 font-sans">
              {achievements.map((item, i) => (
                <div 
                  key={i} 
                  className="p-4 rounded-xl border border-gold-400/10 bg-site-surface hover:border-gold-400/35 transition-all flex gap-3"
                  style={{ backgroundColor: 'var(--site-surface)' }}
                >
                  <div className="w-10 h-10 rounded-lg bg-gold-400/10 border border-gold-400/25 flex items-center justify-center text-gold-400 flex-shrink-0">
                    <Music className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-xs font-bold text-gold-300">
                        {language === 'fa' ? item.title : item.titleEn}
                      </h4>
                      <span className="text-[9px] font-mono bg-gold-400/15 text-gold-200 px-1.5 py-0.5 rounded">
                        {language === 'fa' ? item.year : item.yearEn}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                      {language === 'fa' ? item.description : item.descriptionEn}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
