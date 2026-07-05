import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Inbox, Settings, Check, Trash2, Save, 
  Disc, FileText, Terminal, RefreshCw, Star, 
  Upload, Music, PlusCircle, Lock, User, AlertCircle
} from 'lucide-react';
import { ContactMessage, Track } from '../types';

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
}

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
  onDeleteTrack
}: AdminPanelProps) {
  // Tabs: inbox, edit-bio, upload-music, settings
  const [activeTab, setActiveTab] = useState<'inbox' | 'edit-bio' | 'upload-music' | 'settings'>('inbox');
  const [editedBio, setEditedBio] = useState(bioContent);
  const [isSaved, setIsSaved] = useState(false);

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
      setAuthError('نام کاربری یا رمز عبور اشتباه است.');
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
    
    if (!trackTitle.trim()) {
      alert('لطفاً عنوان اثر را وارد کنید.');
      return;
    }
    if (!audioFileInput) {
      alert('لطفاً فایل صوتی موزیک را انتخاب کنید.');
      return;
    }

    setIsUploading(true);

    try {
      // Read audio file into base64 string
      const reader = new FileReader();
      reader.onloadend = () => {
        const audioDataUrl = reader.result as string;

        const newTrack: Track = {
          id: `custom-${Date.now()}`,
          title: trackTitle.trim(),
          titleEn: trackTitleEn.trim() || 'Custom Track',
          genre: trackGenre,
          duration: trackDuration,
          audioUrl: audioDataUrl,
          coverUrl: coverDataUrl,
          description: trackDescription.trim() || 'قطعه اختصاصی آپلود شده توسط مدیر سایت',
          year: trackYear.trim() || '۱۴۰۳',
          instrument: trackInstrument.trim() || 'گیتار و سازهای سینث‌سایزر'
        };

        onAddTrack(newTrack);
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
      };

      reader.readAsDataURL(audioFileInput);
    } catch (err) {
      console.error(err);
      alert('خطا در بارگذاری فایل صوتی. لطفاً فایل کوچک‌تری را امتحان کنید.');
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end font-sans select-none" dir="rtl">
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
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative w-full max-w-2xl h-full bg-[#111111] border-l-2 border-gold-400/30 text-gray-200 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col z-50"
      >
        {/* Absolute floating controls (No top bar) */}
        <div className="absolute top-4 left-4 z-50 flex items-center gap-2" dir="ltr">
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#2c3338] transition-colors cursor-pointer bg-black/40 border border-[#2c3338] backdrop-blur-sm shadow-md"
            title="بستن"
          >
            <X className="w-5 h-5" />
          </button>
          {isAuthenticated && (
            <button 
              onClick={handleLogout}
              className="text-[10px] text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/50 px-2.5 py-1.5 rounded-lg bg-red-500/5 hover:bg-red-500/10 transition-all cursor-pointer font-sans shadow-md"
            >
              خروج از سیستم
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
                <h3 className="text-lg font-bold text-white font-sans">ورود به پنل مدیریت استاد</h3>
                <p className="text-xs text-gray-400 leading-relaxed max-w-sm mx-auto">
                  لطفاً نام کاربری و رمز عبور پیشخوان مدیریت را وارد کنید.
                </p>
              </div>

              {authError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-xs flex items-center gap-2 justify-start font-sans">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4 text-right">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 flex items-center gap-1.5 justify-start">
                    <User className="w-3.5 h-3.5 text-gold-400" />
                    <span>نام کاربری</span>
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
                    <span>رمز عبور</span>
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
                  <span>تایید و ورود به پیشخوان</span>
                </button>
              </form>

              {/* Login Hints */}
              <div className="border-t border-gold-400/10 pt-4 text-center">
                <p className="text-[10px] text-gold-400/40">
                  راهنمای ورود برای تست دمو: <br />
                  نام کاربری: <span className="font-mono font-bold text-gold-400/70">kianour</span> و رمز عبور: <span className="font-mono font-bold text-gold-400/70">partovi</span> <br />
                  یا نام کاربری: <span className="font-mono font-bold text-gold-400/70">admin</span> و رمز عبور: <span className="font-mono font-bold text-gold-400/70">1234</span>
                </p>
              </div>
            </motion.div>
          </div>
        ) : (
          <>
            {/* Tab Navigation */}
            <div className="bg-[#181818] border-b border-[#2c3338] px-4 pl-36 flex items-center gap-1 overflow-x-auto whitespace-nowrap scrollbar-thin flex-shrink-0">
              <button
                onClick={() => setActiveTab('inbox')}
                className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
                  activeTab === 'inbox' 
                    ? 'border-gold-400 text-gold-400 bg-[#2c3338]/40' 
                    : 'border-transparent text-gray-400 hover:text-gold-400'
                }`}
              >
                <Inbox className="w-4 h-4" />
                <span>صندوق پیام‌ها ({messages.length})</span>
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
                <span>ویرایش بیوگرافی</span>
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
                <span>مدیریت موزیک‌ها ({allTracks.length})</span>
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
                <span>تنظیمات پوسته</span>
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
                      <h3 className="text-sm font-bold text-[#f0f0f1]">صندوق نامه‌های دریافتی همکاری</h3>
                      <span className="text-[10px] text-gray-500">مجموع دریافتی: {messages.length} پیام</span>
                    </div>

                    {messages.length === 0 ? (
                      <div className="border border-dashed border-[#2c3338] rounded-xl p-10 text-center text-gray-500 space-y-2">
                        <Inbox className="w-10 h-10 text-gray-600 mx-auto" />
                        <p className="text-xs font-bold">هیچ پیامی در صندوق ورودی یافت نشد.</p>
                        <p className="text-[10px] text-gray-600">از طریق فرم تماس با من، پیام تستی ارسال کنید تا اینجا ظاهر شود.</p>
                      </div>
                    ) : (
                      <div className="space-y-3.5">
                        {messages.map((msg) => (
                          <div 
                            key={msg.id}
                            className="bg-[#2c3338]/20 border border-[#2c3338] rounded-xl p-4.5 space-y-3 relative hover:border-[#354046] transition-all"
                          >
                            <div className="flex justify-between items-start gap-3">
                              <div>
                                <h4 className="text-xs font-bold text-white font-sans">{msg.name}</h4>
                                <span className="text-[10px] text-[#72aee6] font-mono block mt-0.5" dir="ltr">{msg.email}</span>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <span className="text-[9px] text-gray-500 font-mono">{msg.createdAt}</span>
                                <button
                                  onClick={() => onDeleteMessage(msg.id)}
                                  className="p-1 rounded text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors cursor-pointer"
                                  title="حذف پیام"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            <div className="bg-[#111111] p-3 rounded-lg border border-[#2c3338]/60 text-right">
                              <span className="text-[10px] text-gold-400 font-bold block mb-1">موضوع: {msg.subject}</span>
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
                      <h3 className="text-sm font-bold text-[#f0f0f1]">ویرایش بیوگرافی استاد کیانور پرتوی</h3>
                      <span className="text-[10px] text-gray-500">ذخیره خودکار در مرورگر</span>
                    </div>

                    <div className="space-y-4 font-sans text-right">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-400">متن اصلی زندگی‌نامه و دستاوردها</label>
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
                          <span>تغییرات بیوگرافی با موفقیت ذخیره و در صفحه اصلی اعمال شد!</span>
                        </div>
                      )}

                      <button
                        onClick={handleSaveBio}
                        className="w-full py-3 bg-gold-500 hover:bg-gold-400 text-black font-bold text-xs rounded-lg flex items-center justify-center gap-2 shadow cursor-pointer transition-colors"
                      >
                        <Save className="w-4 h-4 text-black" />
                        <span>بروزرسانی نهایی محتوا</span>
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
                      <h3 className="text-sm font-bold text-[#f0f0f1]">مدیریت و آپلود موسیقی‌های من</h3>
                      <span className="text-[10px] text-gray-500">مجموع قطعات قابل پخش: {allTracks.length} اثر</span>
                    </div>

                    {/* Form Block */}
                    <form onSubmit={handleTrackUpload} className="bg-[#181818] border border-gold-400/10 rounded-2xl p-5 space-y-4 text-right font-sans">
                      <div className="flex items-center gap-2 pb-2 border-b border-gold-400/10">
                        <PlusCircle className="w-4 h-4 text-gold-400" />
                        <span className="text-xs font-bold text-white">آپلود قطعه صوتی جدید</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-gray-400">عنوان قطعه موسیقی (فارسی)</label>
                          <input
                            type="text"
                            required
                            value={trackTitle}
                            onChange={(e) => setTrackTitle(e.target.value)}
                            placeholder="مانند: باران پاییزی"
                            className="w-full bg-[#111111] border border-[#2c3338] rounded-xl p-2.5 text-xs text-gray-200 focus:outline-none focus:border-gold-400 font-sans"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-gray-400">عنوان انگلیسی (English Title)</label>
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
                          <label className="text-[11px] font-bold text-gray-400">ژانر / سبک</label>
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
                          <label className="text-[11px] font-bold text-gray-400">سال تولید</label>
                          <input
                            type="text"
                            value={trackYear}
                            onChange={(e) => setTrackYear(e.target.value)}
                            placeholder="مثلا: ۱۴۰۳"
                            className="w-full bg-[#111111] border border-[#2c3338] rounded-xl p-2.5 text-xs text-gray-200 focus:outline-none focus:border-gold-400 font-sans"
                          />
                        </div>

                        <div className="space-y-1.5 md:col-span-2">
                          <label className="text-[11px] font-bold text-gray-400">سازهای محوری و نوازندگان</label>
                          <input
                            type="text"
                            value={trackInstrument}
                            onChange={(e) => setTrackInstrument(e.target.value)}
                            placeholder="مثلا: گیتار الکتریک جاز لید، ارکستر زهی و آکوردیون"
                            className="w-full bg-[#111111] border border-[#2c3338] rounded-xl p-2.5 text-xs text-gray-200 focus:outline-none focus:border-gold-400 font-sans"
                          />
                        </div>

                        <div className="space-y-1.5 md:col-span-2">
                          <label className="text-[11px] font-bold text-gray-400">توضیحات کوتاه اثر</label>
                          <textarea
                            rows={2}
                            value={trackDescription}
                            onChange={(e) => setTrackDescription(e.target.value)}
                            placeholder="توضیحاتی پیرامون حس و حال اثر و الهام صوتی..."
                            className="w-full bg-[#111111] border border-[#2c3338] rounded-xl p-2.5 text-xs text-gray-200 focus:outline-none focus:border-gold-400 font-sans resize-none"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-gray-400 flex items-center gap-1.5">
                            <Music className="w-3.5 h-3.5 text-gold-400" />
                            <span>انتخاب فایل موسیقی (صوتی MP3/WAV)*</span>
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
                            <span>تصویر کاور آلبوم (اختیاری)</span>
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
                          <span>قطعه موسیقی با موفقیت بارگذاری، ذخیره و در بخش «آثار من» آماده پخش است!</span>
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
                            <span>در حال ذخیره‌سازی صوتی در بانک مرورگر...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 text-black" />
                            <span>آپلود و ذخیره نهایی قطعه صوتی</span>
                          </>
                        )}
                      </button>
                    </form>

                    {/* Uploaded List Block */}
                    <div className="space-y-3 font-sans text-right">
                      <span className="text-xs font-bold text-gray-400 block">لیست تمام آثار موسیقی (پیش‌فرض و سفارشی):</span>
                      
                      {allTracks.length === 0 ? (
                        <div className="border border-dashed border-[#2c3338] rounded-xl p-6 text-center text-gray-500 text-xs">
                          هیچ قطعه موسیقی در حال حاضر وجود ندارد. با استفاده از فرم بالا می‌توانید اثر جدیدی اضافه کنید.
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
                                  <div className="text-right">
                                    <div className="flex items-center gap-2">
                                      <h4 className="text-xs font-bold text-white">{track.title}</h4>
                                      {isDefault ? (
                                        <span className="text-[8px] bg-blue-500/10 text-blue-300 border border-blue-500/20 px-1 py-0.2 rounded">پیش‌فرض</span>
                                      ) : (
                                        <span className="text-[8px] bg-gold-400/10 text-gold-300 border border-gold-400/20 px-1 py-0.2 rounded">کاربر</span>
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
                                    title="حذف موسیقی"
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
                      <h3 className="text-sm font-bold text-[#f0f0f1]">تنظیمات عمومی پوسته نوستالژی</h3>
                      <span className="text-[10px] text-gray-500">ویژگی‌های تعاملی قالب وردپرس</span>
                    </div>

                    <div className="space-y-4 font-sans">
                      
                      {/* Gramophone option */}
                      <div className="bg-[#2c3338]/20 border border-[#2c3338] rounded-xl p-4.5 flex items-center justify-between gap-4">
                        <div className="text-right">
                          <span className="text-xs font-bold text-white block">شبیه‌ساز افکت آنالوگ (Gramophone Noise)</span>
                          <span className="text-[10px] text-gray-400 block mt-0.5">افزودن صدای ملایم خش‌خش گرامافون قدیمی در زمان پخش موسیقی.</span>
                        </div>
                        <button
                          onClick={() => setAmbientSound(!ambientSound)}
                          className={`w-12 h-6 rounded-full p-1 transition-all flex items-center cursor-pointer ${
                            ambientSound ? 'bg-gold-500' : 'bg-gray-700'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-full bg-black transition-all ${
                            ambientSound ? '-translate-x-6' : 'translate-x-0'
                          }`} />
                        </button>
                      </div>

                      {/* Tech layout credits */}
                      <div className="bg-[#2c3338]/20 border border-[#2c3338] rounded-xl p-4.5 space-y-3 text-right">
                        <span className="text-xs font-bold text-white block">محیط یکپارچه و بهینه‌سازی</span>
                        <p className="text-[10px] text-gray-400 leading-relaxed">
                          این وب‌سایت کاملاً واکنش‌گرا و بهینه‌سازی شده بر بستر سرورهای ابری است. المان‌های طراحی شده نظیر نوار کاست و صفحه‌گرامافون به صورت لحظه‌ای با نرخ نوسازی ۶۰ فریم بر ثانیه برای تجربه کاربری غنی رندر می‌شوند.
                        </p>
                      </div>

                      {/* Reset default settings */}
                      <button
                        onClick={() => {
                          setEditedBio(bioContent);
                          setAmbientSound(true);
                          alert('تمامی تنظیمات و محتوا به حالت اولیه بازگردانی شد.');
                        }}
                        className="w-full py-2.5 bg-transparent hover:bg-white/5 text-gray-400 hover:text-white border border-[#2c3338] rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>بازنشانی پیش‌فرض‌های وردپرس</span>
                      </button>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

            {/* Panel Footer */}
            <div className="bg-[#181818] border-t border-[#2c3338] px-6 py-4.5 flex items-center justify-between text-[11px] text-[#a7aaad] font-sans">
              <span>نسخه وردپرس سفارشی: ۶.۴.۲ - طنین طلایی</span>
              <div className="flex items-center gap-1 text-gold-400">
                <Star className="w-3 h-3 fill-gold-400" />
                <span>طراحی نوستالژیک خلاقانه</span>
              </div>
            </div>
          </>
        )}

      </motion.div>
    </div>
  );
}
