import React, { useState } from 'react';
import { Music, User, Mail, Home, Settings, Eye, ChevronDown, Award, Volume2, VolumeX, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  showAdminPanel: boolean;
  setShowAdminPanel: (show: boolean) => void;
  ambientSound: boolean;
  setAmbientSound: (sound: boolean) => void;
}

export default function Header({
  activeSection,
  setActiveSection,
  showAdminPanel,
  setShowAdminPanel,
  ambientSound,
  setAmbientSound
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isWpMenuOpen, setIsWpMenuOpen] = useState(false);

  const menuItems = [
    { id: 'home', label: 'صفحه اصلی', icon: Home },
    { id: 'music', label: 'موزیک‌های من', icon: Music },
    { id: 'about', label: 'درباره من', icon: User },
    { id: 'contact', label: 'تماس با من', icon: Mail },
  ];

  return (
    <header className="sticky top-0 z-50 w-full" id="site-header" dir="rtl">
      {/* WordPress-inspired Admin Bar Easter Egg */}
      <div className="bg-[#1d2327] text-[#f0f0f1] text-xs h-8 flex items-center justify-between px-4 border-b border-[#2c3338] select-none font-sans">
        <div className="flex items-center gap-4">
          <div className="relative">
            <button 
              onClick={() => setIsWpMenuOpen(!isWpMenuOpen)}
              className="flex items-center gap-1.5 hover:bg-[#2c3338] hover:text-[#72aee6] px-3 py-2 h-8 cursor-pointer transition-colors"
            >
              <Terminal className="w-3.5 h-3.5 text-gold-400" />
              <span className="font-bold">پیشخوان وردپرس کیانور</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            
            <AnimatePresence>
              {isWpMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsWpMenuOpen(false)} />
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute right-0 top-8 z-20 w-56 bg-[#1d2327] border border-[#2c3338] shadow-2xl py-1 text-right text-gray-300 rounded-b"
                  >
                    <button 
                      onClick={() => {
                        setShowAdminPanel(!showAdminPanel);
                        setIsWpMenuOpen(false);
                      }}
                      className="w-full text-right px-4 py-2 hover:bg-[#2c3338] hover:text-[#72aee6] flex items-center justify-between"
                    >
                      <span>{showAdminPanel ? 'بستن پیشخوان مدیریت' : 'ورود به پنل مدیریت وردپرس'}</span>
                      <Settings className="w-3.5 h-3.5 text-gold-400" />
                    </button>
                    <div className="border-t border-[#2c3338] my-1" />
                    <div className="px-4 py-1.5 text-[10px] text-gray-500">پوسته فعال: نوستالژی طلایی جاز</div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <button 
            onClick={() => setShowAdminPanel(!showAdminPanel)}
            className="hidden md:flex items-center gap-1.5 hover:bg-[#2c3338] hover:text-[#72aee6] px-3 py-2 h-8 cursor-pointer transition-colors"
          >
            <Settings className="w-3.5 h-3.5 text-gray-400" />
            <span>مدیریت پوسته</span>
          </button>

          <a 
            href="#music"
            onClick={(e) => {
              e.preventDefault();
              setActiveSection('music');
            }}
            className="hidden md:flex items-center gap-1.5 hover:bg-[#2c3338] hover:text-[#72aee6] px-3 py-2 h-8 cursor-pointer transition-colors"
          >
            <Music className="w-3.5 h-3.5 text-gray-400" />
            <span>پخش موسیقی</span>
          </a>
        </div>

        <div className="flex items-center gap-4">
          {/* Ambient Sound Effects Toggle */}
          <button
            onClick={() => setAmbientSound(!ambientSound)}
            className="flex items-center gap-1.5 hover:bg-[#2c3338] px-3 py-2 h-8 text-gold-400 font-medium cursor-pointer transition-colors"
            title={ambientSound ? "قطع صدای شبیه‌ساز گرامافون" : "پخش صدای خش‌خش گرامافون قدیمی"}
          >
            {ambientSound ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-gold-400 animate-pulse" />
                <span className="hidden sm:inline text-gold-300">افکت گرامافون فعال</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-gray-500" />
                <span className="hidden sm:inline text-gray-400">افکت گرامافون غیرفعال</span>
              </>
            )}
          </button>

          <div className="hidden sm:flex items-center gap-1.5 text-[#a7aaad]">
            <span>سلام، استاد کیانور پرتوی</span>
            <div className="w-5 h-5 rounded-full bg-gold-600 border border-gold-400 flex items-center justify-center text-[10px] font-bold text-black font-sans">ک</div>
          </div>
        </div>
      </div>

      {/* Main Public Header */}
      <nav className="bg-[#0f0e0c]/95 backdrop-blur-md border-b-2 border-gold-400/20 shadow-lg px-4 py-3 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo / Title */}
          <div 
            onClick={() => setActiveSection('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative h-11 md:h-12 flex items-center">
              <img 
                src="./assets/images/kianour_signature_1783217105489.jpg" 
                alt="لوگوی امضای استاد کیانور پرتوی" 
                className="h-10 md:h-12 w-auto object-contain brightness-125 contrast-125 mix-blend-screen transition-all duration-300 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="hidden sm:flex flex-col border-r border-gold-400/20 pr-3">
              <h1 className="font-sans text-xs font-extrabold text-gold-400 tracking-wide gold-glow">
                کیانور پرتوی
              </h1>
              <span className="text-[8px] text-gold-200/50 font-medium tracking-wider font-sans uppercase">
                Guitarist, Composer & Producer
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`relative px-4 py-2 rounded-md font-sans text-sm font-medium transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                    isActive 
                      ? 'text-gold-400 bg-gold-400/10 border-b border-gold-400 shadow-[inset_0_-2px_0_rgba(211,166,85,0.4)]' 
                      : 'text-gray-400 hover:text-gold-300 hover:bg-gold-500/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-gold-400' : 'text-gray-400'}`} />
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.span 
                      layoutId="activeGlow"
                      className="absolute inset-0 rounded-md border border-gold-400/20 pointer-events-none"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Social Icons & Call To Action */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={() => setActiveSection('contact')}
              className="bg-gradient-to-r from-gold-600 to-gold-400 hover:from-gold-500 hover:to-gold-300 text-black font-sans font-bold text-xs px-5 py-2 rounded-full border border-gold-300 shadow-[0_4px_12px_rgba(194,135,50,0.2)] hover:shadow-[0_4px_16px_rgba(194,135,50,0.4)] active:scale-95 transition-all cursor-pointer"
            >
              همکاری و سفارش پروژه
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-gold-400 hover:text-gold-300 hover:bg-[#1c1a16] focus:outline-none transition-colors"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0f0e0c] border-b-2 border-gold-400/30 overflow-hidden font-sans shadow-xl"
          >
            <div className="px-4 py-3 space-y-2 flex flex-col">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-gold-500/10 text-gold-400 border-r-4 border-gold-400' 
                        : 'text-gray-400 hover:bg-[#1a1814] hover:text-gold-300'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
              <div className="border-t border-gold-400/10 pt-2 mt-2">
                <button
                  onClick={() => {
                    setActiveSection('contact');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-center bg-gold-500 hover:bg-gold-400 text-black font-bold py-2.5 rounded-lg text-sm transition-all shadow-md cursor-pointer"
                >
                  همکاری و سفارش پروژه
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
