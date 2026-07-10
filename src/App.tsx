import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, Music as MusicIcon, Disc, Star, ExternalLink, Mail, ArrowUp, Globe } from 'lucide-react';
import Header from './components/Header';
import Hero from './components/Hero';
import Music from './components/Music';
import About from './components/About';
import Contact from './components/Contact';
import AdminPanel from './components/AdminPanel';
import { ContactMessage, Track } from './types';
import { kianourProfile, tracks as defaultTracks } from './data';
import { apiFetch } from './apiHelper';
import { useLanguage } from './lib/LanguageContext';

const defaultMessages: ContactMessage[] = [
  {
    id: 'msg-1',
    name: 'سهراب احمدی',
    email: 'sohrab.ah@theater.ir',
    subject: 'درخواست موسیقی متن تئاتر پیانو نوازی',
    message: 'جناب استاد پرتوی عزیز، سلام. ما در حال برنامه‌ریزی برای اجرای یک تئاتر دراماتیک در تماشاخانه ایرانشهر هستیم و برای موسیقی پس‌زمینه به قطعات جاز مدرن با سولوی گیتار شما نیاز مبرم داریم. آیا امکان همکاری وجود دارد؟ مایل هستیم جلسه‌ای حضوری در استودیو نوستالژی خدمتتان برسیم.',
    createdAt: '۱۴۰۲/۱۲/۱۵ ۱۸:۳۰'
  },
  {
    id: 'msg-2',
    name: 'رعنا صادقی',
    email: 'rana.s@fusion-music.com',
    subject: 'همکاری در تک‌آهنگ تلفیقی جدید',
    message: 'سلام جناب آقای پرتوی، من خواننده سبک سول و آلترناتیو هستم و کارهای ارکسترال جاز شما را همیشه دنبال می‌کنم. پروژه‌ای در دست تولید دارم که فکر می‌کنم حضور یک نوازنده چیره دست گیتار الکتریک جاز مثل شما، سطح کار را فوق‌العاده بالا خواهد برد. فایل دمو را چطور می‌توانم ارسال کنم؟ با تشکر.',
    createdAt: '۱۴۰۳/۰۱/۱۰ ۱۰:۱۵'
  }
];

export default function App() {
  const { language, toggleLanguage, isRtl, t } = useLanguage();
  const [activeSection, setActiveSection] = useState<string>('home');
  const [showAdminPanel, setShowAdminPanel] = useState<boolean>(false);
  const [ambientSound, setAmbientSound] = useState<boolean>(true);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  
  // Loaded state for messages from server
  const [messages, setMessages] = useState<ContactMessage[]>(defaultMessages);

  // Loaded bio content from server
  const [bioContent, setBioContent] = useState<string>(kianourProfile.bio);

  // Loaded tracks from server
  const [allTracks, setAllTracks] = useState<Track[]>(defaultTracks);

  // Loaded custom colors settings from server
  const [siteColors, setSiteColors] = useState<Record<string, string>>({});

  const applyColors = (colors: Record<string, string>) => {
    const root = document.documentElement;
    const mappings: Record<string, string> = {
      bg: '--site-bg',
      surface: '--site-surface',
      navbar: '--site-navbar',
      textPrimary: '--site-text-primary',
      textSecondary: '--site-text-secondary',
      textMuted: '--site-text-muted',
      accent: '--site-accent',
      accentHover: '--site-accent-hover',
      border: '--site-border',
      success: '--site-success',
      error: '--site-error'
    };

    Object.entries(mappings).forEach(([key, variableName]) => {
      if (colors && colors[key]) {
        root.style.setProperty(variableName, colors[key]);
      } else {
        root.style.removeProperty(variableName);
      }
    });
  };

  useEffect(() => {
    // 1. Fetch tracks
    apiFetch('/api/tracks')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setAllTracks(data);
        }
      })
      .catch(err => console.error("Error loading tracks from server:", err));

    // 2. Fetch bio
    apiFetch('/api/bio')
      .then(res => res.json())
      .then(data => {
        if (data && typeof data.bio === 'string') {
          setBioContent(data.bio);
          kianourProfile.bio = data.bio;
        }
      })
      .catch(err => console.error("Error loading bio from server:", err));

    // 3. Fetch messages
    apiFetch('/api/messages')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setMessages(data);
        }
      })
      .catch(err => console.error("Error loading messages from server:", err));

    // 4. Fetch settings (colors)
    apiFetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data && data.colors) {
          setSiteColors(data.colors);
          applyColors(data.colors);
        }
      })
      .catch(err => console.error("Error loading settings from server:", err));
  }, []);

  const handleUpdateColors = async (newColors: Record<string, string>) => {
    setSiteColors(newColors);
    applyColors(newColors);
    try {
      await apiFetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ colors: newColors })
      });
    } catch (err) {
      console.error("Error saving settings to server:", err);
    }
  };

  const handleAddTrack = async (newTrack: Track) => {
    try {
      const res = await apiFetch('/api/tracks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTrack)
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.tracks)) {
        setAllTracks(data.tracks);
      }
    } catch (err) {
      console.error("Error adding track to server:", err);
      alert(language === 'fa' ? "خطا در بارگذاری موزیک روی سرور" : "Error uploading music to server");
    }
  };

  const handleDeleteTrack = async (id: string) => {
    try {
      const res = await apiFetch(`/api/tracks/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.tracks)) {
        setAllTracks(data.tracks);
      }
    } catch (err) {
      console.error("Error deleting track from server:", err);
      alert(language === 'fa' ? "خطا در حذف موزیک از سرور" : "Error deleting music from server");
    }
  };

  // Monitor scroll for top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAddMessage = async (newMessage: ContactMessage) => {
    try {
      const res = await apiFetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: newMessage.name,
          email: newMessage.email,
          subject: newMessage.subject,
          message: newMessage.message
        })
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.messages)) {
        setMessages(data.messages);
      }
    } catch (err) {
      console.error("Error sending message to server:", err);
      setMessages((prev) => [newMessage, ...prev]);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    try {
      const res = await apiFetch(`/api/messages/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.messages)) {
        setMessages(data.messages);
      }
    } catch (err) {
      console.error("Error deleting message from server:", err);
      setMessages((prev) => prev.filter((m) => m.id !== id));
    }
  };

  const handleUpdateBio = async (newBio: string) => {
    setBioContent(newBio);
    kianourProfile.bio = newBio;
    try {
      await apiFetch('/api/bio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ bio: newBio })
      });
    } catch (err) {
      console.error("Error saving bio to server:", err);
    }
  };

  const handleNavigateToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col bg-site-bg text-site-text-secondary font-sans grainy-bg overflow-hidden relative"
      style={{ backgroundColor: 'var(--site-bg)', color: 'var(--site-text-secondary)' }}
    >
      
      {/* Absolute Decorative Ambient Lights - Elegant Dark Theme */}
      <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-[#c9a050] rounded-full blur-[120px] opacity-10 pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[500px] h-[500px] bg-[#2b1b0a] rounded-full blur-[150px] opacity-25 pointer-events-none" />

      {/* Main Header / Navigation */}
      <Header 
        activeSection={activeSection}
        setActiveSection={handleNavigateToSection}
        showAdminPanel={showAdminPanel}
        setShowAdminPanel={setShowAdminPanel}
        ambientSound={ambientSound}
        setAmbientSound={setAmbientSound}
      />

      {/* Master Main Container */}
      <main className="flex-grow z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            {activeSection === 'home' && (
              <Hero onNavigateToSection={handleNavigateToSection} />
            )}
            {activeSection === 'music' && (
              <Music ambientSound={ambientSound} allTracks={allTracks} />
            )}
            {activeSection === 'about' && (
              <About />
            )}
            {activeSection === 'contact' && (
              <Contact onAddMessage={handleAddMessage} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Retro Footnote / Footer */}
      <footer className="border-t border-gold-400/10 bg-[#070605] py-10 px-4 mt-12 font-sans" dir={isRtl ? "rtl" : "ltr"}>
        <div className={`max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-center ${isRtl ? 'text-right' : 'text-left'} text-center`}>
          
          {/* Logo & Slogan */}
          <div className="space-y-2 flex flex-col items-center md:items-start">
            <img 
              src="./assets/images/kianour_signature_1783217105489.jpg" 
              alt="امضای استاد کیانور پرتوی" 
              className="h-12 w-auto object-contain brightness-110 contrast-125 mix-blend-screen"
              referrerPolicy="no-referrer"
            />
            <p className="text-[11px] text-gray-500">{t('footerDesc')}</p>
          </div>

          {/* Copyrights */}
          <div className="text-center text-xs text-gray-500 font-sans space-y-1">
            <p>{t('footerCopyright')}</p>
            <p className="text-[10px] text-gray-600">{t('footerSubCopyright')}</p>
          </div>

          {/* Social Links & Easter Eggs */}
          <div className={`flex justify-center md:justify-end gap-4 text-xs font-sans`}>
            <button 
              onClick={() => handleNavigateToSection('contact')}
              className="text-gray-400 hover:text-gold-400 transition-colors cursor-pointer flex items-center gap-1"
            >
              <Mail className="w-4 h-4" />
              <span>{t('footerOrder')}</span>
            </button>
            <span className="text-gray-700">|</span>
            <button 
              onClick={() => setShowAdminPanel(true)}
              className="text-gold-400 hover:text-gold-300 transition-all font-bold cursor-pointer"
            >
              {t('adminPanelLink')}
            </button>
          </div>

        </div>
      </footer>

      {/* Floating Indicator badge on bottom left if admin panel is closed */}
      {!showAdminPanel && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => setShowAdminPanel(true)}
          className="fixed bottom-6 left-6 z-40 bg-gradient-to-r from-[#1d2327] to-[#2c3338] hover:from-[#2c3338] hover:to-[#1d2327] text-gold-400 hover:text-gold-300 border border-gold-400/30 w-12 h-12 rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.5)] flex items-center justify-center cursor-pointer transition-all active:scale-95 group"
          title={t('adminPanelLink')}
        >
          <div className="relative">
            <Disc className="w-5 h-5 text-gold-400 animate-spin-slow group-hover:text-gold-300" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-black animate-pulse" />
          </div>
        </motion.button>
      )}

      {/* Floating Language Switcher button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={toggleLanguage}
        className="fixed bottom-20 right-6 md:bottom-6 md:right-20 z-40 bg-gradient-to-r from-[#1d2327] to-[#2c3338] hover:from-[#2c3338] hover:to-[#1d2327] text-gold-400 hover:text-gold-300 border border-gold-400/30 w-10 h-10 md:w-12 md:h-12 rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.5)] flex items-center justify-center cursor-pointer transition-all active:scale-95 group font-sans text-xs font-bold"
        title={language === 'fa' ? 'Switch to English' : 'تغییر به زبان فارسی'}
      >
        <div className="flex flex-col items-center justify-center leading-none">
          <Globe className="w-3.5 h-3.5 md:w-4 md:h-4 mb-0.5 text-gold-400 group-hover:text-gold-300" />
          <span className="text-[8px] md:text-[9px] uppercase tracking-wider">{language === 'fa' ? 'EN' : 'FA'}</span>
        </div>
      </motion.button>

      {/* Back to Top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 z-40 bg-gold-400 text-black w-10 h-10 rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-gold-300 active:scale-95 transition-all"
            title={language === 'fa' ? 'بازگشت به ابتدای صفحه' : 'Back to Top'}
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Sliding Admin Dashboard Panel */}
      <AnimatePresence>
        {showAdminPanel && (
          <AdminPanel
            isOpen={showAdminPanel}
            onClose={() => setShowAdminPanel(false)}
            messages={messages}
            onDeleteMessage={handleDeleteMessage}
            bioContent={bioContent}
            onUpdateBio={handleUpdateBio}
            ambientSound={ambientSound}
            setAmbientSound={setAmbientSound}
            allTracks={allTracks}
            onAddTrack={handleAddTrack}
            onDeleteTrack={handleDeleteTrack}
            siteColors={siteColors}
            onUpdateColors={handleUpdateColors}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
