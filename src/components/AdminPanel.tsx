import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Inbox, Settings, Check, Trash2, Save, 
  Disc, FileText, Terminal, RefreshCw, Star, 
  Upload, Music, PlusCircle, Lock, User, AlertCircle
} from 'lucide-react';
import { ContactMessage, Track } from '../types';
import { apiFetch } from '../apiHelper';
import { useLanguage } from '../lib/LanguageContext';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ContactMessage[];
  onDeleteMessage: (id: string) => void;
  bioContent: string;
  onUpdateBio: (text: string) => void;
  ambientSound: boolean;
  setAmbientSound: (sound: boolean) => void;
  allTracks: Track[];
  onAddTrack: (track: Track) => void;
  onDeleteTrack: (id: string) => void;
  siteColors?: Record<string, string>;
  onUpdateColors?: (colors: Record<string, string>) => void;
}

const DEFAULT_PALETTE: Record<string, string> = {
  bg: '#0a0a0a',
  surface: '#14120f',
  navbar: '#0f0e0c',
  textPrimary: '#ffffff',
  textSecondary: '#e0e0e0',
  textMuted: '#888888',
  accent: '#c9a050',
  accentHover: '#d8bf93',
  border: 'rgba(201, 160, 80, 0.2)',
  success: '#10b981',
  error: '#ef4444'
};

export default function AdminPanel({
  isOpen,
  onClose,
  messages,
  onDeleteMessage,
  bioContent,
  onUpdateBio,
  ambientSound,
  setAmbientSound,
  allTracks,
  onAddTrack,
  onDeleteTrack,
  siteColors = {},
  onUpdateColors
}: AdminPanelProps) {
  const { language, isRtl, t } = useLanguage();

  // Tabs: inbox, edit-bio, upload-music, settings
  const [activeTab, setActiveTab] = useState<'inbox' | 'edit-bio' | 'upload-music' | 'settings'>('inbox');
  const [editedBio, setEditedBio] = useState(bioContent);
  const [isSaved, setIsSaved] = useState(false);

  // Dynamic colors customization state
  const [colorsInput, setColorsInput] = useState<Record<string, string>>({
    bg: siteColors.bg || DEFAULT_PALETTE.bg,
    surface: siteColors.surface || DEFAULT_PALETTE.surface,
    navbar: siteColors.navbar || DEFAULT_PALETTE.navbar,
    textPrimary: siteColors.textPrimary || DEFAULT_PALETTE.textPrimary,
    textSecondary: siteColors.textSecondary || DEFAULT_PALETTE.textSecondary,
    textMuted: siteColors.textMuted || DEFAULT_PALETTE.textMuted,
    accent: siteColors.accent || DEFAULT_PALETTE.accent,
    accentHover: siteColors.accentHover || DEFAULT_PALETTE.accentHover,
    border: siteColors.border || DEFAULT_PALETTE.border,
    success: siteColors.success || DEFAULT_PALETTE.success,
    error: siteColors.error || DEFAULT_PALETTE.error
  });

  const [isColorsSaved, setIsColorsSaved] = useState(false);

  // Sync colors inputs state with props when loaded
  React.useEffect(() => {
    setColorsInput({
      bg: siteColors.bg || DEFAULT_PALETTE.bg,
      surface: siteColors.surface || DEFAULT_PALETTE.surface,
      navbar: siteColors.navbar || DEFAULT_PALETTE.navbar,
      textPrimary: siteColors.textPrimary || DEFAULT_PALETTE.textPrimary,
      textSecondary: siteColors.textSecondary || DEFAULT_PALETTE.textSecondary,
      textMuted: siteColors.textMuted || DEFAULT_PALETTE.textMuted,
      accent: siteColors.accent || DEFAULT_PALETTE.accent,
      accentHover: siteColors.accentHover || DEFAULT_PALETTE.accentHover,
      border: siteColors.border || DEFAULT_PALETTE.border,
      success: siteColors.success || DEFAULT_PALETTE.success,
      error: siteColors.error || DEFAULT_PALETTE.error
    });
  }, [siteColors]);

  const handleColorChange = (key: string, value: string) => {
    setColorsInput(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveColors = () => {
    if (onUpdateColors) {
      onUpdateColors(colorsInput);
      setIsColorsSaved(true);
      setTimeout(() => setIsColorsSaved(false), 3000);
    }
  };

  const handleResetColors = () => {
    setColorsInput({ ...DEFAULT_PALETTE });
    if (onUpdateColors) {
      onUpdateColors(DEFAULT_PALETTE);
      setIsColorsSaved(true);
      setTimeout(() => setIsColorsSaved(false), 3000);
    }
  };

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('kianour_admin_auth') === 'true';
  });
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Music Upload States
  const [trackTitle, setTrackTitle] = useState('');
  const [trackTitleEn, setTrackTitleEn] = useState('');
  const [trackGenre, setTrackGenre] = useState('Smooth Jazz');
  const [trackYear, setTrackYear] = useState('۱۴۰۳');
  const [trackInstrument, setTrackInstrument] = useState('');
  const [trackDescription, setTrackDescription] = useState('');
  const [trackDuration, setTrackDuration] = useState('03:00');
  const [coverDataUrl, setCoverDataUrl] = useState<string>('./assets/images/album_cover_jazz_1783212533166.jpg'); // default cover
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // File Input Refs
  const audioInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleSaveBio = () => {
    onUpdateBio(editedBio);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const u = usernameInput.trim().toLowerCase();
    const p = passwordInput.trim();

    if ((u === 'admin' && p === '1234') || (u === 'kianour' && p === 'partovi')) {
      setIsAuthenticated(true);
      sessionStorage.setItem('kianour_admin_auth', 'true');
      setAuthError(null);
    } else {
      setAuthError(language === 'fa' ? 'نام کاربری یا رمز عبور اشتباه است.' : 'Incorrect username or password.');
    }
  };

  // Logout handler
  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('kianour_admin_auth');
    setUsernameInput('');
    setPasswordInput('');
  };

  // Read audio file duration and load metadata
  const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const audio = document.createElement('audio');
      audio.src = URL.createObjectURL(file);
      audio.onloadedmetadata = () => {
        const minutes = Math.floor(audio.duration / 60);
        const seconds = Math.floor(audio.duration % 60);
        const formatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        setTrackDuration(formatted);
      };
    }
  };

  // Read cover image file to base64 DataURL
  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverDataUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Track upload submission handler
  const handleTrackUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    const audioFileInput = audioInputRef.current?.files?.[0];
    const coverFileInput = coverInputRef.current?.files?.[0];
    
    if (!trackTitle.trim()) {
      alert(language === 'fa' ? 'لطفاً عنوان اثر را وارد کنید.' : 'Please enter the track title.');
      return;
    }
    if (!audioFileInput) {
      alert(language === 'fa' ? 'لطفاً فایل صوتی موزیک را انتخاب کنید.' : 'Please select the audio file.');
      return;
    }

    setIsUploading(true);

    try {
      // 1. Upload audio file via standard FormData stream
      const audioFormData = new FormData();
      audioFormData.append('file', audioFileInput);
      
      const audioUploadRes = await apiFetch('/api/upload', {
        method: 'POST',
        body: audioFormData
      });
      
      if (!audioUploadRes.ok) {
        throw new Error('Failed to upload audio file');
      }
      
      const audioUploadData = await audioUploadRes.json();
      if (!audioUploadData.success || !audioUploadData.url) {
        throw new Error('Invalid audio upload response');
      }
      
      const finalAudioUrl = audioUploadData.url;

      // 2. Upload cover image via standard FormData stream if exists
      let finalCoverUrl = './assets/images/album_cover_jazz_1783212533166.jpg';
      if (coverFileInput) {
        const coverFormData = new FormData();
        coverFormData.append('file', coverFileInput);
        
        const coverUploadRes = await apiFetch('/api/upload', {
          method: 'POST',
          body: coverFormData
        });
        
        if (coverUploadRes.ok) {
          const coverUploadData = await coverUploadRes.json();
          if (coverUploadData.success && coverUploadData.url) {
            finalCoverUrl = coverUploadData.url;
          }
        }
      }

      // 3. Construct clean metadata and invoke onAddTrack to save it permanently
      const newTrack: Track = {
        id: `custom-${Date.now()}`,
        title: trackTitle.trim(),
        titleEn: trackTitleEn.trim() || trackTitle.trim(),
        genre: trackGenre,
        duration: trackDuration,
        audioUrl: finalAudioUrl,
        coverUrl: finalCoverUrl,
        description: trackDescription.trim() || 'قطعه اختصاصی آپلود شده توسط مدیر سایت',
        year: trackYear.trim() || '۱۴۰۳',
        instrument: trackInstrument.trim() || 'گیتار و سازهای سینث‌سایزر'
      };

      await onAddTrack(newTrack);
      setIsUploading(false);
      setUploadSuccess(true);
      
      // Reset Form
      setTrackTitle('');
      setTrackTitleEn('');
      setTrackInstrument('');
      setTrackDescription('');
      setTrackDuration('03:00');
      setCoverDataUrl('./assets/images/album_cover_jazz_1783212533166.jpg');
      if (audioInputRef.current) audioInputRef.current.value = '';
      if (coverInputRef.current) coverInputRef.current.value = '';

      setTimeout(() => setUploadSuccess(false), 4000);
    } catch (err) {
      console.error(err);
      alert(language === 'fa' 
        ? 'خطا در بارگذاری فایل‌های صوتی یا تصویر روی سرور. لطفاً مجدداً تلاش کنید یا فایل کوچک‌تری انتخاب کنید.' 
        : 'Error uploading audio or image files to server. Please try again or select smaller files.'
      );
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end font-sans select-none" dir={isRtl ? "rtl" : "ltr"}>
      {/* Dimmed backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Slide-out Panel */}
      <motion.div 
        initial={{ x: isRtl ? '100%' : '-100%' }}
        animate={{ x: 0 }}
        exit={{ x: isRtl ? '100%' : '-100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={`relative w-full max-w-2xl h-full bg-[#111111] ${isRtl ? 'border-l-2 border-l-gold-400/30' : 'border-r-2 border-r-gold-400/30'} text-gray-200 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col z-50`}
      >
        {/* Absolute floating controls */}
        <div className={`absolute top-4 ${isRtl ? 'left-4' : 'right-4'} z-50 flex items-center gap-2`} dir={isRtl ? 'ltr' : 'rtl'}>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#2c3338] transition-colors cursor-pointer bg-black/40 border border-[#2c3338] backdrop-blur-sm shadow-md"
            title={language === 'fa' ? 'بستن' : 'Close'}
          >
            <X className="w-5 h-5" />
          </button>
          {isAuthenticated && (
            <button 
              onClick={handleLogout}
              className="text-[10px] text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/50 px-2.5 py-1.5 rounded-lg bg-red-500/5 hover:bg-red-500/10 transition-all cursor-pointer font-sans shadow-md"
            >
              {language === 'fa' ? 'خروج از سیستم' : 'Logout'}
            </button>
          )}
        </div>

        {/* Conditional Rendering: Login vs Admin Dashboard */}
        {!isAuthenticated ? (
          <div className="flex-1 overflow-y-auto p-8 flex flex-col justify-center items-center font-sans">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-md bg-[#181818] border border-gold-400/20 rounded-2xl p-6.5 shadow-[0_15px_35px_rgba(0,0,0,0.6)] space-y-6"
            >
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-full bg-gold-400/10 border border-gold-400/30 flex items-center justify-center mx-auto text-gold-400">
                  <Lock className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white font-sans">{language === 'fa' ? 'ورود به پنل مدیریت استاد' : 'Artist Admin Login'}</h3>
                <p className="text-xs text-gray-400 leading-relaxed max-w-sm mx-auto">
                  {language === 'fa' ? 'لطفاً نام کاربری و رمز عبور پیشخوان مدیریت را وارد کنید.' : 'Please enter the username and password for the admin dashboard.'}
                </p>
              </div>

              {authError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-xs flex items-center gap-2 justify-start font-sans">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className={`space-y-4 ${isRtl ? 'text-right' : 'text-left'}`}>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 flex items-center gap-1.5 justify-start">
                    <User className="w-3.5 h-3.5 text-gold-400" />
                    <span>{language === 'fa' ? 'نام کاربری' : 'Username'}</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder="kianour"
                    className="w-full bg-[#111111] border border-gold-400/10 rounded-xl p-3 text-xs leading-relaxed text-gray-200 focus:outline-none focus:border-gold-400 text-left font-mono"
                    dir="ltr"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 flex items-center gap-1.5 justify-start">
                    <Lock className="w-3.5 h-3.5 text-gold-400" />
                    <span>{language === 'fa' ? 'رمز عبور' : 'Password'}</span>
                  </label>
                  <input
                    type="password"
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#111111] border border-gold-400/10 rounded-xl p-3 text-xs leading-relaxed text-gray-200 focus:outline-none focus:border-gold-400 text-left font-mono"
                    dir="ltr"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-gold-600 to-gold-400 text-black font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer hover:shadow-[0_4px_15px_rgba(194,135,50,0.2)] active:scale-95 transition-all mt-6"
                >
                  <Lock className="w-4 h-4" />
                  <span>{language === 'fa' ? 'تایید و ورود به پیشخوان' : 'Confirm & Login'}</span>
                </button>
              </form>

              {/* Login Hints */}
              <div className="border-t border-gold-400/10 pt-4 text-center">
                <p className="text-[10px] text-gold-400/40 leading-relaxed">
                  {language === 'fa' ? (
                    <>
                      راهنمای ورود برای تست دمو: <br />
                      نام کاربری: <span className="font-mono font-bold text-gold-400/70">kianour</span> و رمز عبور: <span className="font-mono font-bold text-gold-400/70">partovi</span>
                    </>
                  ) : (
                    <>
                      Demo Credentials: <br />
                      Username: <span className="font-mono font-bold text-gold-400/70">kianour</span> / Password: <span className="font-mono font-bold text-gold-400/70">partovi</span>
                    </>
                  )}
                </p>
              </div>
            </motion.div>
          </div>
        ) : (
          <>
            {/* Tab Navigation */}
            <div className={`bg-[#181818] border-b border-[#2c3338] px-4 ${isRtl ? 'pl-36' : 'pr-36'} flex items-center gap-1 overflow-x-auto whitespace-nowrap scrollbar-thin flex-shrink-0`}>
              <button
                onClick={() => setActiveTab('inbox')}
                className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
                  activeTab === 'inbox' 
                    ? 'border-gold-400 text-gold-400 bg-[#2c3338]/40' 
                    : 'border-transparent text-gray-400 hover:text-gold-400'
                }`}
              >
                <Inbox className="w-4 h-4" />
                <span>{language === 'fa' ? `صندوق پیام‌ها (${messages.length})` : `Inbox (${messages.length})`}</span>
              </button>

              <button
                onClick={() => setActiveTab('edit-bio')}
                className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
                  activeTab === 'edit-bio' 
                    ? 'border-gold-400 text-gold-400 bg-[#2c3338]/40' 
                    : 'border-transparent text-gray-400 hover:text-gold-400'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>{language === 'fa' ? 'ویرایش بیوگرافی' : 'Edit Biography'}</span>
              </button>

              <button
                onClick={() => setActiveTab('upload-music')}
                className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
                  activeTab === 'upload-music' 
                    ? 'border-gold-400 text-gold-400 bg-[#2c3338]/40' 
                    : 'border-transparent text-gray-400 hover:text-gold-400'
                }`}
              >
                <Music className="w-4 h-4" />
                <span>{language === 'fa' ? `مدیریت موزیک‌ها (${allTracks.length})` : `Tracks (${allTracks.length})`}</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
                  activeTab === 'settings' 
                    ? 'border-gold-400 text-gold-400 bg-[#2c3338]/40' 
                    : 'border-transparent text-gray-400 hover:text-gold-400'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>{language === 'fa' ? 'تنظیمات پوسته' : 'System Settings'}</span>
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <AnimatePresence mode="wait">
                
                {/* TAB 1: INBOX */}
                {activeTab === 'inbox' && (
                  <motion.div
                    key="inbox-tab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-[#f0f0f1]">{language === 'fa' ? 'صندوق نامه‌های دریافتی همکاری' : 'Project & Collaboration Messages'}</h3>
                      <span className="text-[10px] text-gray-500">{language === 'fa' ? `مجموع دریافتی: ${messages.length} پیام` : `Total: ${messages.length} messages`}</span>
                    </div>

                    {messages.length === 0 ? (
                      <div className="border border-dashed border-[#2c3338] rounded-xl p-10 text-center text-gray-500 space-y-2">
                        <Inbox className="w-10 h-10 text-gray-600 mx-auto" />
                        <p className="text-xs font-bold">{language === 'fa' ? 'هیچ پیامی در صندوق ورودی یافت نشد.' : 'No messages found in your inbox.'}</p>
                      </div>
                    ) : (
                      <div className="space-y-3.5">
                        {messages.map((msg) => (
                          <div 
                            key={msg.id}
                            className="bg-[#2c3338]/20 border border-[#2c3338] rounded-xl p-4.5 space-y-3 relative hover:border-[#354046] transition-all"
                          >
                            <div className="flex justify-between items-start gap-3">
                              <div className={isRtl ? 'text-right' : 'text-left'}>
                                <h4 className="text-xs font-bold text-white font-sans">{msg.name}</h4>
                                <span className="text-[10px] text-[#72aee6] font-mono block mt-0.5" dir="ltr">{msg.email}</span>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <span className="text-[9px] text-gray-500 font-mono">{msg.createdAt}</span>
                                <button
                                  onClick={() => onDeleteMessage(msg.id)}
                                  className="p-1 rounded text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors cursor-pointer"
                                  title={language === 'fa' ? 'حذف پیام' : 'Delete Message'}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            <div className={`bg-[#111111] p-3 rounded-lg border border-[#2c3338]/60 ${isRtl ? 'text-right' : 'text-left'}`}>
                              <span className="text-[10px] text-gold-400 font-bold block mb-1">
                                {language === 'fa' ? `موضوع: ${msg.subject}` : `Subject: ${msg.subject}`}
                              </span>
                              <p className="text-xs text-gray-300 leading-relaxed font-sans">{msg.message}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* TAB 2: EDIT BIO */}
                {activeTab === 'edit-bio' && (
                  <motion.div
                    key="bio-tab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-[#f0f0f1]">{language === 'fa' ? 'ویرایش بیوگرافی استاد کیانور پرتوی' : 'Edit Biography Text'}</h3>
                      <span className="text-[10px] text-gray-500">{language === 'fa' ? 'ذخیره در سرور' : 'Sync with Server'}</span>
                    </div>

                    <div className={`space-y-4 font-sans ${isRtl ? 'text-right' : 'text-left'}`}>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-400">
                          {language === 'fa' ? 'متن اصلی زندگی‌نامه و دستاوردها' : 'Main Artist Biography / Profile info'}
                        </label>
                        <textarea
                          rows={8}
                          value={editedBio}
                          onChange={(e) => setEditedBio(e.target.value)}
                          className="w-full bg-[#111111] border border-[#2c3338] rounded-xl p-4 text-xs leading-relaxed text-gray-200 focus:outline-none focus:border-gold-400 resize-none font-sans"
                        />
                      </div>

                      {isSaved && (
                        <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2 justify-start font-sans">
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span>{language === 'fa' ? 'تغییرات بیوگرافی با موفقیت ذخیره و در صفحه اصلی اعمال شد!' : 'Biography updated and synced with server successfully!'}</span>
                        </div>
                      )}

                      <button
                        onClick={handleSaveBio}
                        className="w-full py-3 bg-gold-500 hover:bg-gold-400 text-black font-bold text-xs rounded-lg flex items-center justify-center gap-2 shadow cursor-pointer transition-colors"
                      >
                        <Save className="w-4 h-4 text-black" />
                        <span>{language === 'fa' ? 'بروزرسانی نهایی محتوا' : 'Update Content Permanently'}</span>
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* TAB 3: UPLOAD MUSIC */}
                {activeTab === 'upload-music' && (
                  <motion.div
                    key="upload-music-tab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-[#f0f0f1]">{language === 'fa' ? 'مدیریت و آپلود موسیقی‌های من' : 'Track List & Music Uploads'}</h3>
                      <span className="text-[10px] text-gray-500">{language === 'fa' ? `مجموع قطعات قابل پخش: ${allTracks.length} اثر` : `Total tracks available: ${allTracks.length}`}</span>
                    </div>

                    {/* Form Block */}
                    <form onSubmit={handleTrackUpload} className={`bg-[#181818] border border-gold-400/10 rounded-2xl p-5 space-y-4 ${isRtl ? 'text-right' : 'text-left'} font-sans`}>
                      <div className="flex items-center gap-2 pb-2 border-b border-gold-400/10">
                        <PlusCircle className="w-4 h-4 text-gold-400" />
                        <span className="text-xs font-bold text-white">{language === 'fa' ? 'آپلود قطعه صوتی جدید' : 'Upload New Audio Track'}</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-gray-400">{language === 'fa' ? 'عنوان قطعه موسیقی (فارسی)' : 'Track Title (Persian)'}</label>
                          <input
                            type="text"
                            required
                            value={trackTitle}
                            onChange={(e) => setTrackTitle(e.target.value)}
                            placeholder={language === 'fa' ? 'مانند: باران پاییزی' : 'e.g. Baran-e Paeizi'}
                            className="w-full bg-[#111111] border border-[#2c3338] rounded-xl p-2.5 text-xs text-gray-200 focus:outline-none focus:border-gold-400 font-sans"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-gray-400">{language === 'fa' ? 'عنوان انگلیسی (English Title)' : 'Track Title (English)'}</label>
                          <input
                            type="text"
                            value={trackTitleEn}
                            onChange={(e) => setTrackTitleEn(e.target.value)}
                            placeholder="e.g. Autumn Rain"
                            className="w-full bg-[#111111] border border-[#2c3338] rounded-xl p-2.5 text-xs text-gray-200 focus:outline-none focus:border-gold-400 font-sans text-left"
                            dir="ltr"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-gray-400">{language === 'fa' ? 'ژانر / سبک' : 'Genre / Style'}</label>
                          <select
                            value={trackGenre}
                            onChange={(e) => setTrackGenre(e.target.value)}
                            className="w-full bg-[#111111] border border-[#2c3338] rounded-xl p-2.5 text-xs text-gray-200 focus:outline-none focus:border-gold-400 font-sans"
                          >
                            <option value="Smooth Jazz">Smooth Jazz</option>
                            <option value="Soul & RnB">Soul & RnB</option>
                            <option value="Jazz Fusion">Jazz Fusion</option>
                            <option value="Funk & Groove">Funk & Groove</option>
                            <option value="Pop Fusion">Pop Fusion</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-gray-400">{language === 'fa' ? 'سال تولید' : 'Release Year'}</label>
                          <input
                            type="text"
                            value={trackYear}
                            onChange={(e) => setTrackYear(e.target.value)}
                            placeholder="e.g. 2024"
                            className="w-full bg-[#111111] border border-[#2c3338] rounded-xl p-2.5 text-xs text-gray-200 focus:outline-none focus:border-gold-400 font-sans"
                          />
                        </div>

                        <div className="space-y-1.5 md:col-span-2">
                          <label className="text-[11px] font-bold text-gray-400">{language === 'fa' ? 'سازهای محوری' : 'Featured Instruments'}</label>
                          <input
                            type="text"
                            value={trackInstrument}
                            onChange={(e) => setTrackInstrument(e.target.value)}
                            placeholder={language === 'fa' ? 'مثلا: گیتار الکتریک جاز لید، ارکستر زهی' : 'e.g. Electric Jazz Guitar, Rhodes Piano'}
                            className="w-full bg-[#111111] border border-[#2c3338] rounded-xl p-2.5 text-xs text-gray-200 focus:outline-none focus:border-gold-400 font-sans"
                          />
                        </div>

                        <div className="space-y-1.5 md:col-span-2">
                          <label className="text-[11px] font-bold text-gray-400">{language === 'fa' ? 'توضیحات کوتاه اثر' : 'Brief Description'}</label>
                          <textarea
                            rows={2}
                            value={trackDescription}
                            onChange={(e) => setTrackDescription(e.target.value)}
                            placeholder={language === 'fa' ? 'توضیحاتی پیرامون حس و حال اثر...' : 'Atmospheric vibes & inspirations behind the piece...'}
                            className="w-full bg-[#111111] border border-[#2c3338] rounded-xl p-2.5 text-xs text-gray-200 focus:outline-none focus:border-gold-400 font-sans resize-none"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-gray-400 flex items-center gap-1.5">
                            <Music className="w-3.5 h-3.5 text-gold-400" />
                            <span>{language === 'fa' ? 'انتخاب فایل موسیقی (صوتی MP3/WAV)*' : 'Select Audio File (MP3/WAV)*'}</span>
                          </label>
                          <input
                            type="file"
                            required
                            ref={audioInputRef}
                            onChange={handleAudioFileChange}
                            accept="audio/mp3,audio/wav,audio/*"
                            className="w-full bg-[#111111] border border-[#2c3338] rounded-xl p-1.5 text-xs text-gray-400 file:bg-gold-500 file:text-black file:border-0 file:py-1 file:px-2.5 file:rounded-md file:text-[10px] file:font-bold file:cursor-pointer"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-gray-400 flex items-center gap-1.5">
                            <Upload className="w-3.5 h-3.5 text-gold-400" />
                            <span>{language === 'fa' ? 'تصویر کاور آلبوم (اختیاری)' : 'Album Artwork (Optional)'}</span>
                          </label>
                          <input
                            type="file"
                            ref={coverInputRef}
                            onChange={handleCoverFileChange}
                            accept="image/*"
                            className="w-full bg-[#111111] border border-[#2c3338] rounded-xl p-1.5 text-xs text-gray-400 file:bg-gold-500 file:text-black file:border-0 file:py-1 file:px-2.5 file:rounded-md file:text-[10px] file:font-bold file:cursor-pointer"
                          />
                        </div>
                      </div>

                      {uploadSuccess && (
                        <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2 justify-start font-sans">
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span>{language === 'fa' ? 'قطعه موسیقی با موفقیت بارگذاری، ذخیره و در بخش «آثار من» آماده پخش است!' : 'Track uploaded successfully! Ready to play on the main player.'}</span>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isUploading}
                        className={`w-full py-3 bg-gold-500 hover:bg-gold-400 disabled:bg-gray-700 text-black font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow cursor-pointer transition-colors`}
                      >
                        {isUploading ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin text-black" />
                            <span>{language === 'fa' ? 'در حال ذخیره‌سازی صوتی روی سرور...' : 'Uploading audio file to server...'}</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 text-black" />
                            <span>{language === 'fa' ? 'آپلود و ذخیره نهایی قطعه صوتی' : 'Upload & Save Audio Track'}</span>
                          </>
                        )}
                      </button>
                    </form>

                    {/* Uploaded List Block */}
                    <div className={`space-y-3 font-sans ${isRtl ? 'text-right' : 'text-left'}`}>
                      <span className="text-xs font-bold text-gray-400 block">
                        {language === 'fa' ? 'لیست تمام آثار موسیقی (پیش‌فرض و سفارشی):' : 'All Tracks (Default & User Uploaded):'}
                      </span>
                      
                      {allTracks.length === 0 ? (
                        <div className="border border-dashed border-[#2c3338] rounded-xl p-6 text-center text-gray-500 text-xs">
                          {language === 'fa' ? 'هیچ قطعه موسیقی یافت نشد.' : 'No tracks found.'}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {allTracks.map((track) => {
                            const isDefault = !track.id.toString().startsWith('custom-');
                            return (
                              <div 
                                key={track.id}
                                className="bg-[#2c3338]/10 border border-[#2c3338] rounded-xl p-3 flex items-center justify-between gap-4 hover:border-gold-400/25 transition-all"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded bg-black border border-gold-400/10 overflow-hidden flex-shrink-0">
                                    <img 
                                      src={track.coverUrl} 
                                      alt={track.title} 
                                      className="w-full h-full object-cover" 
                                      referrerPolicy="no-referrer"
                                    />
                                  </div>
                                  <div className={isRtl ? 'text-right' : 'text-left'}>
                                    <div className="flex items-center gap-2">
                                      <h4 className="text-xs font-bold text-white">{language === 'fa' ? track.title : (track.titleEn || track.title)}</h4>
                                      {isDefault ? (
                                        <span className="text-[8px] bg-blue-500/10 text-blue-300 border border-blue-500/20 px-1 py-0.2 rounded">
                                          {language === 'fa' ? 'پیش‌فرض' : 'Default'}
                                        </span>
                                      ) : (
                                        <span className="text-[8px] bg-gold-400/10 text-gold-300 border border-gold-400/20 px-1 py-0.2 rounded">
                                          {language === 'fa' ? 'سفارشی' : 'Custom'}
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-1.5 mt-1">
                                      <span className="text-[9px] bg-[#2c3338] text-gray-400 px-1.5 py-0.2 rounded">{track.genre}</span>
                                      <span className="text-[9px] text-gray-500">{track.year}</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-3">
                                  <span className="text-[10px] font-mono text-gray-500">{track.duration}</span>
                                  <button
                                    onClick={() => onDeleteTrack(track.id)}
                                    className="p-1.5 rounded text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors cursor-pointer"
                                    title={language === 'fa' ? 'حذف موسیقی' : 'Delete Track'}
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* TAB 4: SETTINGS */}
                {activeTab === 'settings' && (
                  <motion.div
                    key="settings-tab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-5"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-[#f0f0f1]">{language === 'fa' ? 'تنظیمات عمومی سایت' : 'Portfolio General Settings'}</h3>
                      <span className="text-[10px] text-gray-500">{language === 'fa' ? 'ویژگی‌های تعاملی پورتفولیو' : 'Interactive Details'}</span>
                    </div>

                    <div className="space-y-4 font-sans">
                      
                      {/* Gramophone option */}
                      <div className="bg-[#2c3338]/20 border border-[#2c3338] rounded-xl p-4.5 flex items-center justify-between gap-4">
                        <div className={isRtl ? 'text-right' : 'text-left'}>
                          <span className="text-xs font-bold text-white block">{language === 'fa' ? 'شبیه‌ساز افکت آنالوگ (Gramophone Noise)' : 'Analog Noise Simulation (Vintage Gramophone)'}</span>
                          <span className="text-[10px] text-gray-400 block mt-0.5">
                            {language === 'fa' ? 'افزودن صدای ملایم خش‌خش گرامافون قدیمی در زمان پخش موسیقی.' : 'Inject vintage warm crackle vinyl noise in the background during playback.'}
                          </span>
                        </div>
                        <button
                          onClick={() => setAmbientSound(!ambientSound)}
                          className={`w-12 h-6 rounded-full p-1 transition-all flex items-center cursor-pointer ${
                            ambientSound ? 'bg-gold-500' : 'bg-gray-700'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-full bg-black transition-all ${
                            ambientSound ? (isRtl ? '-translate-x-6' : 'translate-x-6') : 'translate-x-0'
                          }`} />
                        </button>
                      </div>

                      {/* Tech layout credits */}
                      <div className={`bg-[#2c3338]/20 border border-[#2c3338] rounded-xl p-4.5 space-y-3 ${isRtl ? 'text-right' : 'text-left'}`}>
                        <span className="text-xs font-bold text-white block">{language === 'fa' ? 'محیط یکپارچه و بهینه‌سازی' : 'Hardware Acceleration & Frame Rate'}</span>
                        <p className="text-[10px] text-gray-400 leading-relaxed">
                          {language === 'fa' 
                            ? 'این وب‌سایت کاملاً واکنش‌گرا و بهینه‌سازی شده بر بستر سرورهای ابری است. المان‌های طراحی شده نظیر نوار کاست و صفحه‌گرامافون به صورت لحظه‌ای با نرخ نوسازی ۶۰ فریم بر ثانیه برای تجربه کاربری غنی رندر می‌شوند.'
                            : 'This digital portfolio uses CSS GPU hardware-accelerated animations for smooth transitions. The cassette deck is rendered at 60 FPS in real-time to preserve the organic analog look.'
                          }
                        </p>
                      </div>

                      {/* Color Palette Customizer */}
                      <div className="border-t border-[#2c3338] pt-5 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white block">{language === 'fa' ? 'سفارشی‌سازی رنگ‌های پوسته' : 'Theme Colors Customization'}</span>
                          {isColorsSaved && (
                            <span className="text-[10px] text-green-400 font-sans animate-pulse">
                              {language === 'fa' ? '✓ ذخیره شد' : '✓ Saved'}
                            </span>
                          )}
                        </div>

                        <p className="text-[10px] text-gray-400 leading-relaxed">
                          {language === 'fa' 
                            ? 'کدهای رنگی دلخواه خود را برای هر یک از بخش‌های پورتفولیو وارد کنید یا از دایره رنگی استفاده کنید. برای اعمال تغییرات بر روی کلید ذخیره کلیک کنید.'
                            : 'Specify custom color hex codes or click the color circles to adjust palette settings. Click Save to apply changes globally.'}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                          {Object.keys(DEFAULT_PALETTE).map((key) => {
                            const label = language === 'fa' ? {
                              bg: 'رنگ پس‌زمینه (Background)',
                              surface: 'رنگ کارت‌ها و سطوح (Surface)',
                              navbar: 'رنگ نوار ناوبری (Navbar)',
                              textPrimary: 'رنگ متن اصلی (Primary Text)',
                              textSecondary: 'رنگ متن فرعی (Secondary Text)',
                              textMuted: 'رنگ متن کم‌رنگ (Muted Text)',
                              accent: 'رنگ آکورد اصلی (Primary Accent)',
                              accentHover: 'رنگ هاور آکورد (Hover Accent)',
                              border: 'رنگ مرزها و خطوط (Border)',
                              success: 'رنگ پیام موفقیت (Success)',
                              error: 'رنگ پیام خطا (Error)'
                            }[key] : {
                              bg: 'Background Color',
                              surface: 'Surface Area Color',
                              navbar: 'Navigation Bar Color',
                              textPrimary: 'Primary Text Color',
                              textSecondary: 'Secondary Text Color',
                              textMuted: 'Muted Text Color',
                              accent: 'Primary Accent Theme',
                              accentHover: 'Accent Hover State',
                              border: 'Border & Lines Color',
                              success: 'Success Message Highlight',
                              error: 'Error / Alert Highlight'
                            }[key];

                            // Safe Hex helper for strictly formatted type="color" inputs
                            const getSafeHex = (val: string) => {
                              if (val && val.startsWith('#') && (val.length === 7 || val.length === 4)) {
                                return val;
                              }
                              // fallback
                              return '#c9a050';
                            };

                            return (
                              <div key={key} className="flex flex-col gap-1 bg-black/30 border border-[#2c3338]/40 rounded-lg p-2.5">
                                <span className="text-[10px] text-gray-400 font-bold block">{label}</span>
                                <div className="flex items-center gap-2 mt-1">
                                  {/* Visual Color Input circle */}
                                  <div className="relative w-7 h-7 rounded-md overflow-hidden border border-white/10 flex-shrink-0 cursor-pointer">
                                    <input 
                                      type="color"
                                      value={getSafeHex(colorsInput[key])}
                                      onChange={(e) => handleColorChange(key, e.target.value)}
                                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full scale-150"
                                    />
                                    <div className="w-full h-full" style={{ backgroundColor: colorsInput[key] || DEFAULT_PALETTE[key] }} />
                                  </div>
                                  
                                  {/* Text Code input */}
                                  <input 
                                    type="text"
                                    value={colorsInput[key]}
                                    onChange={(e) => handleColorChange(key, e.target.value)}
                                    placeholder={DEFAULT_PALETTE[key]}
                                    className="flex-1 min-w-0 bg-[#111111] border border-gold-400/10 rounded px-2 py-1 text-[11px] leading-relaxed text-gray-200 focus:outline-none focus:border-gold-400/50 font-mono text-left"
                                    dir="ltr"
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2.5 pt-3">
                          <button
                            onClick={handleSaveColors}
                            className="flex-1 py-2 bg-gold-500 hover:bg-gold-400 text-black font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>{language === 'fa' ? 'ذخیره تغییرات رنگ' : 'Save Custom Colors'}</span>
                          </button>
                          
                          <button
                            onClick={handleResetColors}
                            className="py-2 px-4 bg-transparent hover:bg-white/5 border border-[#2c3338] text-gray-400 hover:text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                            title={language === 'fa' ? 'بازنشانی به رنگ‌های پیش‌فرض' : 'Reset to original theme'}
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>{language === 'fa' ? 'رنگ پیش‌فرض' : 'Default Colors'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Reset default settings */}
                      <button
                        onClick={() => {
                          setEditedBio(bioContent);
                          setAmbientSound(true);
                          handleResetColors();
                          alert(language === 'fa' ? 'تمامی تنظیمات و محتوا به حالت اولیه بازگردانی شد.' : 'All system options and parameters reset to default values.');
                        }}
                        className="w-full py-2.5 bg-transparent hover:bg-white/5 text-gray-400 hover:text-white border border-[#2c3338] rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>{language === 'fa' ? 'بازنشانی پیش‌فرض‌های سیستم' : 'Reset System Defaults'}</span>
                      </button>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

            {/* Panel Footer */}
            <div className={`bg-[#181818] border-t border-[#2c3338] px-6 py-4.5 flex items-center justify-between text-[11px] text-[#a7aaad] font-sans`}>
              <span>{language === 'fa' ? 'نسخه سامانه مدیریت: ۱.۴.۰ - طنین طلایی' : 'Admin Panel version: 1.4.0'}</span>
              <div className="flex items-center gap-1 text-gold-400">
                <Star className="w-3 h-3 fill-gold-400" />
                <span>{language === 'fa' ? 'طراحی پورتفولیو خلاقانه' : 'Creative Artist Portfolio'}</span>
              </div>
            </div>
          </>
        )}

      </motion.div>
    </div>
  );
}
