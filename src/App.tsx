import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, Music as MusicIcon, Disc, Star, ExternalLink, Mail, ArrowUp } from 'lucide-react';
import Header from './components/Header';
import Hero from './components/Hero';
import Music from './components/Music';
import About from './components/About';
import Contact from './components/Contact';
import AdminPanel from './components/AdminPanel';
import { ContactMessage, Track } from './types';
import { kianourProfile, tracks as defaultTracks } from './data';
import { getTracksFromDB, saveTrackToDB, deleteTrackFromDB } from './lib/db';

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
  const [activeSection, setActiveSection] = useState<string>('home');
  const [showAdminPanel, setShowAdminPanel] = useState<boolean>(false);
  const [ambientSound, setAmbientSound] = useState<boolean>(true);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  
  // Loaded state for messages from localStorage
  const [messages, setMessages] = useState<ContactMessage[]>(() => {
    const saved = localStorage.getItem('kianour_contact_messages');
    return saved ? JSON.parse(saved) : defaultMessages;
  });

  // Loaded bio content from localStorage
  const [bioContent, setBioContent] = useState<string>(() => {
    const saved = localStorage.getItem('kianour_bio_content');
    return saved || kianourProfile.bio;
  });

  // State for dynamic user-uploaded tracks from IndexedDB
  const [customTracks, setCustomTracks] = useState<Track[]>([]);

  // Track IDs of deleted default tracks
  const [deletedDefaultIds, setDeletedDefaultIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('kianour_deleted_default_tracks');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    getTracksFromDB()
      .then((data) => setCustomTracks(data))
      .catch((err) => console.error("Error loading custom tracks from IndexedDB", err));
  }, []);

  const handleAddTrack = async (newTrack: Track) => {
    await saveTrackToDB(newTrack);
    const updated = await getTracksFromDB();
    setCustomTracks(updated);
  };

  const handleDeleteTrack = async (id: string) => {
    // If it is a default track, add to deleted default IDs list
    if (defaultTracks.some(t => t.id === id)) {
      const updated = [...deletedDefaultIds, id];
      setDeletedDefaultIds(updated);
      localStorage.setItem('kianour_deleted_default_tracks', JSON.stringify(updated));
    } else {
      await deleteTrackFromDB(id);
      const updated = await getTracksFromDB();
      setCustomTracks(updated);
    }
  };

  const activeDefaultTracks = defaultTracks.filter(track => !deletedDefaultIds.includes(track.id));
  const allTracks = [...activeDefaultTracks, ...customTracks];

  // Sync messages to localStorage
  useEffect(() => {
    localStorage.setItem('kianour_contact_messages', JSON.stringify(messages));
  }, [messages]);

  // Sync bio content to localStorage
  useEffect(() => {
    localStorage.setItem('kianour_bio_content', bioContent);
    kianourProfile.bio = bioContent; // Sync back to the memory data structure
  }, [bioContent]);

  // Monitor scroll for top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAddMessage = (newMessage: ContactMessage) => {
    setMessages((prev) => [newMessage, ...prev]);
  };

  const handleDeleteMessage = (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  };

  const handleUpdateBio = (newBio: string) => {
    setBioContent(newBio);
  };

  const handleNavigateToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-[#e0e0e0] font-sans grainy-bg overflow-hidden relative">
      
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
      <footer className="border-t border-gold-400/10 bg-[#070605] py-10 px-4 mt-12 font-sans" dir="rtl">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center md:text-right">
          
          {/* Logo & Slogan */}
          <div className="space-y-2 flex flex-col items-center md:items-start">
            <img 
              src="./assets/images/kianour_signature_1783217105489.jpg" 
              alt="امضای استاد کیانور پرتوی" 
              className="h-12 w-auto object-contain brightness-110 contrast-125 mix-blend-screen"
              referrerPolicy="no-referrer"
            />
            <p className="text-[11px] text-gray-500">خالق طنین‌های ماندگار جاز، سول و آهنگسازی کاربردی در ایران</p>
          </div>

          {/* Copyrights */}
          <div className="text-center text-xs text-gray-500 font-sans space-y-1">
            <p>© تمام حقوق معنوی و هنری متعلق به استاد کیانور پرتوی می‌باشد.</p>
            <p className="text-[10px] text-gray-600">پوسته وردپرس نوستالژیک - طراحی شده با فریم‌ورک قدرتمند ری‌اکت و تیلوند</p>
          </div>

          {/* Social Links & Easter Eggs */}
          <div className="flex justify-center md:justify-end gap-4 text-xs font-sans">
            <button 
              onClick={() => handleNavigateToSection('contact')}
              className="text-gray-400 hover:text-gold-400 transition-colors cursor-pointer flex items-center gap-1"
            >
              <Mail className="w-4 h-4" />
              <span>ارسال سفارش پروژه</span>
            </button>
            <span className="text-gray-700">|</span>
            <button 
              onClick={() => setShowAdminPanel(true)}
              className="text-gold-400 hover:text-gold-300 transition-all font-bold cursor-pointer"
            >
              پیشخوان مدیریت
            </button>
          </div>

        </div>
      </footer>

      {/* Floating WordPress Indicator badge on bottom left if admin panel is closed */}
      {!showAdminPanel && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => setShowAdminPanel(true)}
          className="fixed bottom-6 left-6 z-40 bg-gradient-to-r from-[#1d2327] to-[#2c3338] hover:from-[#2c3338] hover:to-[#1d2327] text-gold-400 hover:text-gold-300 border border-gold-400/30 w-12 h-12 rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.5)] flex items-center justify-center cursor-pointer transition-all active:scale-95 group"
          title="ورود به بخش پیشخوان وردپرس"
        >
          <div className="relative">
            <Disc className="w-5 h-5 text-gold-400 animate-spin-slow group-hover:text-gold-300" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-black animate-pulse" />
          </div>
        </motion.button>
      )}

      {/* Back to Top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 z-40 bg-gold-400 text-black w-10 h-10 rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-gold-300 active:scale-95 transition-all"
            title="بازگشت به ابتدای صفحه"
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
          />
        )}
      </AnimatePresence>

    </div>
  );
}
