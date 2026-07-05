import React from 'react';
import { motion } from 'motion/react';
import { Award, GraduationCap, Calendar, ShieldCheck, Heart, Radio, Disc, Music, Youtube, Instagram, Headphones } from 'lucide-react';
import { kianourProfile, achievements } from '../data';

export default function About() {
  return (
    <section id="about" className="py-12 md:py-20 px-4 md:px-8 max-w-7xl mx-auto" dir="rtl">
      
      {/* Section Header */}
      <div className="text-center space-y-3 mb-16">
        <h2 className="text-3xl md:text-5xl font-display text-gold-400 gold-glow">
          درباره من و مدارج علمی
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gold-400 to-transparent mx-auto" />
        <p className="text-gray-400 font-sans text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
          مروری بر دو دهه فعالیت تخصصی در عرصه نوازندگی، رهبری ارکستر، آهنگسازی و مهندسی صدای آنالوگ.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Side: Editorial Bio & Education Timeline (7 Cols) */}
        <div className="lg:col-span-7 space-y-10 text-right">
          
          {/* Philosophy Card */}
          <div className="space-y-4">
            <h3 className="text-xl md:text-2xl font-display text-white border-b border-gold-400/20 pb-2.5">
              بیست سال نواختن و نوشتن نت‌ها...
            </h3>
            <p className="text-gray-300 font-sans leading-relaxed text-sm">
              موسیقی جاز و سبک‌های مشتق از آن مانند اسموت جاز، ریتم اند بلوز و فانک به من آموخته‌اند که چطور در بستر قوانین محکم هارمونی، رهایی عمیق را تجربه کنم. من در آهنگسازی‌های خودم همواره تلاش می‌کنم میان فضای ارکسترال کلاسیک و ساختار مدرن پاپ پل بزنم تا صدایی خلق کنم که هم ذهن‌های کنجکاو را راضی نگه دارد و هم مستقیماً بر قلب‌ها بنشیند.
            </p>
            <p className="text-gray-300 font-sans leading-relaxed text-sm">
              به عنوان یک مهندس صدا و صدابردار، معتقدم اصالت صدای آنالوگ - با تمام خش‌خش‌ها و گرماهای دلنشینش - جادویی دارد که هرگز در دنیای سرد دیجیتال تکرار نخواهد شد. به همین دلیل در استودیو شخصی‌ام همواره تلاش می‌کنم این امضا و اصالت صوتی را در آثارم حفظ کنم.
            </p>
          </div>

          {/* Social Links Panel */}
          <div className="bg-[#110f0c] border border-gold-400/15 p-6 rounded-2xl relative overflow-hidden box-glow">
            <div className="absolute top-0 left-0 w-24 h-24 bg-gold-400/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-right space-y-1">
                <h4 className="text-md font-sans font-bold text-gold-400 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
                  <span>درگاه‌های رسمی پخش و شبکه‌های اجتماعی</span>
                </h4>
                <p className="text-xs text-gray-400 leading-relaxed font-sans">
                  برای شنیدن جدیدترین آثار، تماشای اجراهای زنده و دنبال کردن فعالیت‌های هنری من در پلتفرم‌های جهانی همراه باشید.
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
              <span>تحصیلات آکادمیک و مدارج علمی</span>
            </h3>

            <div className="relative border-r border-gold-400/20 mr-4 space-y-8 pr-6">
              {kianourProfile.education.map((edu, i) => (
                <div key={i} className="relative">
                  {/* Timeline dot */}
                  <span className="absolute -right-[31px] top-1.5 w-4 h-4 rounded-full bg-[#0d0c0a] border-2 border-gold-400 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                  </span>
                  
                  <div className="bg-[#12100e] border border-gold-400/10 p-4 rounded-xl box-glow">
                    <div className="flex justify-between items-start gap-4">
                      <h4 className="text-sm font-bold text-white font-sans">{edu.degree}</h4>
                      <span className="text-[10px] font-mono bg-gold-400/10 text-gold-300 px-2 py-0.5 rounded">
                        {edu.year}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1.5 font-sans">{edu.school}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Visual achievements & styles (5 Cols) */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Side-by-Side Art Frames (About Images 4 and 5) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative group rounded-xl overflow-hidden border-2 border-gold-400/20 aspect-[4/5] bg-black shadow-[0_10px_25px_rgba(0,0,0,0.5)]">
              <img 
                src="/src/assets/images/about_image_1_1783213310316.jpg" 
                alt="تجهیزات و سازها" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 contrast-[1.1] transition-all duration-700 hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />
              <span className="absolute bottom-2.5 right-3 text-[9px] sm:text-[10px] text-gold-300 bg-black/85 px-2 py-0.5 rounded border border-gold-400/20 font-sans">آهنگسازی و سازها</span>
            </div>

            <div className="relative group rounded-xl overflow-hidden border-2 border-gold-400/20 aspect-[4/5] bg-black shadow-[0_10px_25px_rgba(0,0,0,0.5)]">
              <img 
                src="/src/assets/images/about_image_2_1783213319351.jpg" 
                alt="کارگاه ضبط آنالوگ" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 contrast-[1.15] transition-all duration-700 hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />
              <span className="absolute bottom-2.5 right-3 text-[9px] sm:text-[10px] text-gold-300 bg-black/85 px-2 py-0.5 rounded border border-gold-400/20 font-sans">کارگاه ضبط آنالوگ</span>
            </div>
          </div>

          {/* Musical Styles Showcase */}
          <div className="bg-[#110f0c] border border-gold-400/15 p-6 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-20 h-20 bg-gold-500/5 rounded-full blur-2xl pointer-events-none" />
            <h3 className="text-md font-sans font-bold text-gold-400 mb-5 flex items-center gap-2">
              <Disc className="w-5 h-5 text-gold-400 animate-spin-slow" />
              <span>سبک‌های تحت پوشش و امضای هنری</span>
            </h3>

            <div className="space-y-4 font-sans text-right">
              {kianourProfile.styles.map((style, i) => (
                <div key={i} className="border-b border-gold-400/5 pb-3 last:border-b-0 last:pb-0">
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                    <span dir="ltr">{style.name}</span>
                  </h4>
                  <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                    {style.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Golden Milestones List */}
          <div className="space-y-4 text-right">
            <h3 className="text-lg font-sans font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-gold-400" />
              <span>افتخارات و دستاوردها</span>
            </h3>

            <div className="space-y-3 font-sans">
              {achievements.map((item, i) => (
                <div 
                  key={i} 
                  className="p-4 rounded-xl border border-gold-400/10 bg-[#12100e] hover:border-gold-400/35 transition-all flex gap-3"
                >
                  <div className="w-10 h-10 rounded-lg bg-gold-400/10 border border-gold-400/25 flex items-center justify-center text-gold-400 flex-shrink-0">
                    <Music className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-xs font-bold text-gold-300">{item.title}</h4>
                      <span className="text-[9px] font-mono bg-gold-400/15 text-gold-200 px-1.5 py-0.5 rounded">
                        {item.year}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                      {item.description}
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
