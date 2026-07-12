import React from 'react';
import { motion } from 'motion/react';
import { Award, GraduationCap, Calendar, ShieldCheck, Heart, Radio, Disc, Music, Youtube, Instagram, Headphones, Apple } from 'lucide-react';
import { kianourProfile, achievements } from '../data';
import { useLanguage } from '../lib/LanguageContext';

const DEFAULT_EQUIPMENT = {
  titleFa: "تجهیزات استودیویی و اجرای زنده",
  titleEn: "Studio & Live Equipment",
  items: [
    {
      categoryFa: "میکروفون‌ها",
      categoryEn: "Microphones",
      listFa: ["Shure SM57", "sE Electronics sE2200", "Rode NT1 Signature Series", "Neumann U47"],
      listEn: ["Shure SM57", "sE Electronics sE2200", "Rode NT1 Signature Series", "Neumann U47"]
    },
    {
      categoryFa: "پردازنده‌های چند افکت",
      categoryEn: "Multi-Effects Processors",
      listFa: ["BOSS GT-100", "DigiTech RP1000"],
      listEn: ["BOSS GT-100", "DigiTech RP1000"]
    },
    {
      categoryFa: "پدال‌بورد",
      categoryEn: "Pedalboard",
      listFa: ["پدال‌بورد حرفه‌ای سفارشی (Custom Professional Pedalboard)"],
      listEn: ["Custom Professional Pedalboard"]
    },
    {
      categoryFa: "گیتارهای الکتریک",
      categoryEn: "Electric Guitars",
      listFa: [
        "Fender American Standard Stratocaster (HSS/HSH Configuration) – Alnico II Pickups",
        "PRS USA (HH) – Alnico II Pickups",
        "Fender Stratocaster Japan (SSS) – Lace Sensor Pickups",
        "Ibanez JS Series (HH) – Alnico II Pickups"
      ],
      listEn: [
        "Fender American Standard Stratocaster (HSS/HSH Configuration) – Alnico II Pickups",
        "PRS USA (HH) – Alnico II Pickups",
        "Fender Stratocaster Japan (SSS) – Lace Sensor Pickups",
        "Ibanez JS Series (HH) – Alnico II Pickups"
      ]
    },
    {
      categoryFa: "گیتارهای آکوستیک و کلاسیک",
      categoryEn: "Acoustic & Classical Guitars",
      listFa: [
        "Compus Japan Acoustic Guitar",
        "Handmade Cutaway Nylon-String Guitar",
        "Cuenca Classical Guitar"
      ],
      listEn: [
        "Compus Japan Acoustic Guitar",
        "Handmade Cutaway Nylon-String Guitar",
        "Cuenca Classical Guitar"
      ]
    },
    {
      categoryFa: "کیبوردها",
      categoryEn: "Keyboards",
      listFa: [
        "Korg TR Music Workstation",
        "Casio Vintage Keyboard"
      ],
      listEn: [
        "Korg TR Music Workstation",
        "Casio Vintage Keyboard"
      ]
    },
    {
      categoryFa: "کامپیوتر و ایستگاه کاری",
      categoryEn: "Computer & Workstation",
      listFa: [
        "Apple Mac Studio (M2 Max)"
      ],
      listEn: [
        "Apple Mac Studio (M2 Max)"
      ]
    }
  ]
};

interface AboutProps {
  siteContent?: any;
}

export default function About({ siteContent }: AboutProps) {
  const { language, isRtl, t } = useLanguage();

  const equipmentData = siteContent?.equipment || DEFAULT_EQUIPMENT;

  const bioP1 = language === 'fa' 
    ? (siteContent?.translations?.aboutBioP1 || t('aboutBioP1'))
    : (siteContent?.translations?.aboutBioP1En || t('aboutBioP1En') || t('aboutBioP1'));

  const bioP11 = language === 'fa' 
    ? (siteContent?.translations?.aboutBioP11 || t('aboutBioP11'))
    : (siteContent?.translations?.aboutBioP11En || t('aboutBioP11En') || t('aboutBioP11'));

  const bioP2 = language === 'fa' 
    ? (siteContent?.translations?.aboutBioP2 || t('aboutBioP2'))
    : (siteContent?.translations?.aboutBioP2En || t('aboutBioP2En') || t('aboutBioP2'));

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
            {bioP11 && (
              <p className="text-gray-300 font-sans leading-relaxed text-sm">
                {bioP11}
              </p>
            )}
            <p className="text-gray-300 font-sans leading-relaxed text-sm">
              {bioP2}
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

                {/* Apple Music */}
                <a 
                  href="https://music.apple.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black/60 border border-gold-400/20 text-gold-300 hover:text-black hover:bg-gold-400 hover:border-gold-400 transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] cursor-pointer"
                >
                  <Apple className="w-4 h-4 transition-transform group-hover:-rotate-12 duration-300" />
                  <span className="text-xs font-mono font-bold tracking-wider uppercase">Apple Music</span>
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

      {/* Studio & Live Equipment Section */}
      <div className="mt-20 space-y-8">
        <div className={`text-center ${isRtl ? 'md:text-right' : 'md:text-left'} space-y-2`}>
          <h3 className={`text-2xl md:text-3xl font-display text-gold-400 gold-glow flex items-center justify-center ${isRtl ? 'md:justify-start' : 'md:justify-end'} gap-3`}>
            <Radio className="w-6 h-6 text-gold-400 animate-pulse" />
            <span>{language === 'fa' ? equipmentData.titleFa : equipmentData.titleEn}</span>
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed font-sans">
            {language === 'fa' 
              ? 'فهرست تجهیزات تخصصی استودیوی شخصی و اجراهای زنده استاد کیانور پرتوی' 
              : 'List of professional gear used in personal studio recording and live concerts'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {equipmentData.items.map((cat: any, idx: number) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05, duration: 0.5 }}
              className="bg-site-surface border border-gold-400/10 hover:border-gold-400/30 rounded-2xl p-5 relative overflow-hidden transition-all duration-300 group box-glow flex flex-col justify-between"
              style={{ backgroundColor: 'var(--site-surface)' }}
            >
              <div className="absolute top-0 left-0 w-24 h-24 bg-gold-400/2 rounded-full blur-2xl pointer-events-none group-hover:bg-gold-400/4 transition-all" />
              <div>
                <h4 className="text-sm font-sans font-bold text-gold-400 border-b border-gold-400/10 pb-2 mb-3.5 flex items-center justify-between">
                  <span>{language === 'fa' ? cat.categoryFa : cat.categoryEn}</span>
                  <span className="text-[10px] font-mono text-gray-500">{(idx + 1).toString().padStart(2, '0')}</span>
                </h4>
                <ul className="space-y-2">
                  {(language === 'fa' ? cat.listFa : cat.listEn).map((item: string, iIndex: number) => (
                    <li key={iIndex} className="text-xs text-gray-300 flex items-start gap-2 leading-relaxed font-sans">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-400/40 mt-1.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Custom Dynamic Cards */}
      {siteContent?.customCards && siteContent.customCards.length > 0 && (
        <div className="mt-16 space-y-6">
          <div className="h-px bg-gradient-to-r from-transparent via-gold-400/15 to-transparent w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
            {siteContent.customCards.map((card: any, idx: number) => (
              <motion.div
                key={card.id || idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-site-surface border border-gold-400/10 hover:border-gold-400/30 rounded-2xl p-6 relative overflow-hidden transition-all duration-300 group box-glow"
                style={{ backgroundColor: 'var(--site-surface)' }}
              >
                <div className="absolute top-0 left-0 w-24 h-24 bg-gold-400/2 rounded-full blur-2xl pointer-events-none" />
                <h4 className="text-md font-sans font-bold text-gold-400 border-b border-gold-400/10 pb-2.5 mb-4">
                  {language === 'fa' ? card.titleFa : card.titleEn}
                </h4>
                <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-line font-sans">
                  {language === 'fa' ? card.contentFa : card.contentEn}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

    </section>
  );
}
