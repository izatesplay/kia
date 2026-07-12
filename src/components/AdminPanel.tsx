import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Inbox, Settings, Check, Trash2, Save, 
  Disc, FileText, Terminal, RefreshCw, Star, 
  Upload, Music, PlusCircle, Lock, User, AlertCircle,
  Image as ImageIcon
} from 'lucide-react';
import { ContactMessage, Track, GalleryItem } from '../types';
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
  galleryItems: GalleryItem[];
  onAddGalleryItem: (item: GalleryItem) => void;
  onDeleteGalleryItem: (id: string) => void;
  siteColors?: Record<string, string>;
  onUpdateColors?: (colors: Record<string, string>) => void;
  siteContent?: any;
  onUpdateContent?: (content: any) => void;
}

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
  galleryItems,
  onAddGalleryItem,
  onDeleteGalleryItem,
  siteColors = {},
  onUpdateColors,
  siteContent,
  onUpdateContent
}: AdminPanelProps) {
  const { language, isRtl, t } = useLanguage();

  // Tabs: inbox, edit-bio, content-cms, upload-music, settings, gallery-cms
  const [activeTab, setActiveTab] = useState<'inbox' | 'edit-bio' | 'content-cms' | 'upload-music' | 'gallery-cms' | 'settings'>('inbox');
  const [editedBio, setEditedBio] = useState(bioContent);
  const [isSaved, setIsSaved] = useState(false);

  // Bilingual bio states
  const [bioP1Fa, setBioP1Fa] = useState('');
  const [bioP11Fa, setBioP11Fa] = useState('');
  const [bioP1En, setBioP1En] = useState('');
  const [bioP11En, setBioP11En] = useState('');
  const [bioP2Fa, setBioP2Fa] = useState('');
  const [bioP2En, setBioP2En] = useState('');

  // Equipment category & list states
  const [equipmentInput, setEquipmentInput] = useState<any>(null);

  // Custom cards state
  const [customCardsInput, setCustomCardsInput] = useState<any[]>([]);

  // Action feed states
  const [isBioSaved, setIsBioSaved] = useState(false);
  const [isCmsSaved, setIsCmsSaved] = useState(false);

  // Sync siteContent values on load
  React.useEffect(() => {
    if (siteContent) {
      if (siteContent.translations) {
        setBioP1Fa(siteContent.translations.aboutBioP1 || '');
        setBioP11Fa(siteContent.translations.aboutBioP11 || '');
        setBioP1En(siteContent.translations.aboutBioP1En || '');
        setBioP11En(siteContent.translations.aboutBioP11En || '');
        setBioP2Fa(siteContent.translations.aboutBioP2 || '');
        setBioP2En(siteContent.translations.aboutBioP2En || '');
      } else {
        setBioP1Fa('موسیقی جاز و ژانرهای مشتق شده از آن مانند جاز نرم، فانک، سول، آر اند بی به من آموخته‌اند که چگونه آزادی عمیقی را در ساختاری بسیار مهندسی شده و مبتنی بر قوانین پیچیده هارمونی تجربه کنم.در آهنگسازی‌هایم، همیشه تلاش می‌کنم تا پلی بین فضای ارکستر کلاسیک و ساختارهای پاپ مدرن ایجاد کنم تا صدایی خلق کنم که هم از نظر فکری غنی و هم از نظر احساسی تأثیرگذار باشد.');
        setBioP11Fa('درود، من کیانور پرتوی هستم؛ گیتاریست، موزیک پرودیوسر، خواننده، آهنگساز، تنظیم‌کننده، مهندس صدا و رهبر ارکستر با بیش از ۲۰ سال تجربه حرفه‌ای در صنعت موسیقی، تمرکز اصلی من بر خلق، اجرا و تولید موسیقی است. در طول سال‌ها با هنرمندان مختلف در پروژه‌های استودیویی، اجراهای زنده و تولید آثار موسیقی همکاری کرده‌ام و همواره تلاش کرده‌ام کیفیت هنری و فنی را در بالاترین سطح ارائه دهم.');
        setBioP1En('Jazz and its derivative genres like Smooth Jazz, Funk, Soul, R&B have taught me how to experience deep freedom within a highly engineered structure based on complex rules of harmoony. In my compositions, I always strive to bridge the classical orchestral space and modern pop structures to create a sound that is both intellectually rich and emotionally touching.');
        setBioP11En('Hello, I am Kianour Partovi; a guitarist, music producer, singer, composer, arranger, sound engineer and conductor with over 20 years of professional experience in the music industry. My main focus is on creating, performing and producing music. Over the years, I have collaborated with various artists on studio projects, live performances and musical productions, and I have always strived to provide the highest level of artistic and technical quality.');
        setBioP2Fa('موسیقی برای من تنها یک حرفه نیست؛ بلکه راهی برای خلق احساس، روایت داستان و برقراری ارتباطی ماندگار با مخاطب است.');
        setBioP2En('Music is not just a profession for me; it is a way to create emotion, tell a story and establish a lasting connection with the audience.');
      }
      if (siteContent.equipment) {
        setEquipmentInput(JSON.parse(JSON.stringify(siteContent.equipment)));
      } else {
        setEquipmentInput(JSON.parse(JSON.stringify(DEFAULT_EQUIPMENT)));
      }
      if (siteContent.customCards) {
        setCustomCardsInput(JSON.parse(JSON.stringify(siteContent.customCards)));
      } else {
        setCustomCardsInput([]);
      }
    }
  }, [siteContent]);

  // Equipment mutation helpers
  const handleAddEquipmentCategory = () => {
    const newCategory = {
      categoryFa: 'دسته‌بندی جدید',
      categoryEn: 'New Category',
      listFa: [],
      listEn: []
    };
    setEquipmentInput((prev: any) => {
      const items = prev?.items ? [...prev.items] : [];
      return {
        ...prev,
        items: [...items, newCategory]
      };
    });
  };

  const handleUpdateCategoryTitle = (index: number, field: 'categoryFa' | 'categoryEn', value: string) => {
    setEquipmentInput((prev: any) => {
      const items = [...prev.items];
      items[index] = {
        ...items[index],
        [field]: value
      };
      return {
        ...prev,
        items
      };
    });
  };

  const handleUpdateCategoryItems = (index: number, lang: 'Fa' | 'En', textValue: string) => {
    const itemsList = textValue.split('\n').map(item => item.trim()).filter(Boolean);
    setEquipmentInput((prev: any) => {
      const items = [...prev.items];
      items[index] = {
        ...items[index],
        [`list${lang}`]: itemsList
      };
      return {
        ...prev,
        items
      };
    });
  };

  const handleDeleteCategory = (index: number) => {
    setEquipmentInput((prev: any) => {
      const items = prev.items.filter((_: any, i: number) => i !== index);
      return {
        ...prev,
        items
      };
    });
  };

  // Custom Cards mutation helpers
  const handleAddCustomCard = () => {
    const newCard = {
      id: `card-${Date.now()}`,
      titleFa: 'عنوان جدید',
      titleEn: 'New Card Title',
      contentFa: 'محتوای کارت جدید را اینجا بنویسید...',
      contentEn: 'Write the new card content here...'
    };
    setCustomCardsInput(prev => [...prev, newCard]);
  };

  const handleDeleteCustomCard = (id: string) => {
    setCustomCardsInput(prev => prev.filter(card => card.id !== id));
  };

  const handleUpdateCustomCardField = (id: string, field: string, value: string) => {
    setCustomCardsInput(prev => prev.map(card => {
      if (card.id === id) {
        return {
          ...card,
          [field]: value
        };
      }
      return card;
    }));
  };

  const handleSaveBio = async () => {
    if (onUpdateContent) {
      const currentTranslations = siteContent?.translations || {};
      const updatedTranslations = {
        ...currentTranslations,
        aboutBioP1: bioP1Fa,
        aboutBioP11: bioP11Fa,
        aboutBioP1En: bioP1En,
        aboutBioP11En: bioP11En,
        aboutBioP2: bioP2Fa,
        aboutBioP2En: bioP2En,
      };
      const updatedContent = {
        ...siteContent,
        translations: updatedTranslations
      };
      await onUpdateContent(updatedContent);
      setIsBioSaved(true);
      setTimeout(() => setIsBioSaved(false), 3000);
    }
    onUpdateBio(bioP1Fa); // compatibility fallback for old components
  };

  const handleSaveCms = async () => {
    if (onUpdateContent) {
      const updatedContent = {
        ...siteContent,
        equipment: equipmentInput,
        customCards: customCardsInput
      };
      await onUpdateContent(updatedContent);
      setIsCmsSaved(true);
      setTimeout(() => setIsCmsSaved(false), 3000);
    }
  };

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

  // Gallery Upload States
  const [galleryTitle, setGalleryTitle] = useState('');
  const [galleryTitleEn, setGalleryTitleEn] = useState('');
  const [galleryDesc, setGalleryDesc] = useState('');
  const [galleryDescEn, setGalleryDescEn] = useState('');
  const [isGalleryUploading, setIsGalleryUploading] = useState(false);
  const [galleryUploadSuccess, setGalleryUploadSuccess] = useState(false);
  const galleryImageInputRef = useRef<HTMLInputElement>(null);

  const handleGalleryUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    const imageFileInput = galleryImageInputRef.current?.files?.[0];

    if (!imageFileInput) {
      alert(language === 'fa' ? 'لطفاً یک تصویر برای گالری انتخاب کنید.' : 'Please select an image for the gallery.');
      return;
    }

    setIsGalleryUploading(true);

    try {
      // 1. Upload image file via standard FormData stream
      const imageFormData = new FormData();
      imageFormData.append('file', imageFileInput);

      const imageUploadRes = await apiFetch('/api/upload', {
        method: 'POST',
        body: imageFormData
      });

      if (!imageUploadRes.ok) {
        throw new Error('Failed to upload image file');
      }

      const imageUploadData = await imageUploadRes.json();
      if (!imageUploadData.success || !imageUploadData.url) {
        throw new Error('Invalid image upload response');
      }

      const finalImageUrl = imageUploadData.url;

      // 2. Construct clean metadata and invoke onAddGalleryItem to save it permanently
      const newGalleryItem: GalleryItem = {
        id: `g-custom-${Date.now()}`,
        title: galleryTitle.trim() || (language === 'fa' ? 'تصویر جدید' : 'New Image'),
        titleEn: galleryTitleEn.trim() || 'New Image',
        imageUrl: finalImageUrl,
        description: galleryDesc.trim(),
        descriptionEn: galleryDescEn.trim(),
        createdAt: new Intl.DateTimeFormat('fa-IR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        }).format(new Date())
      };

      await onAddGalleryItem(newGalleryItem);
      setIsGalleryUploading(false);
      setGalleryUploadSuccess(true);

      // Reset Form
      setGalleryTitle('');
      setGalleryTitleEn('');
      setGalleryDesc('');
      setGalleryDescEn('');
      if (galleryImageInputRef.current) galleryImageInputRef.current.value = '';

      setTimeout(() => setGalleryUploadSuccess(false), 4000);
    } catch (err) {
      console.error(err);
      alert(language === 'fa'
        ? 'خطا در بارگذاری تصویر روی سرور. لطفاً مجدداً تلاش کنید.'
        : 'Error uploading image to server. Please try again.'
      );
      setIsGalleryUploading(false);
    }
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

            </motion.div>
          </div>
        ) : (
          <>
            {/* Tab Navigation */}
            <div className={`bg-[#181818] border-b border-[#2c3338] px-4 ${isRtl ? 'pl-36' : 'pr-36'} flex items-center gap-1 overflow-x-auto whitespace-nowrap scrollbar-thin flex-shrink-0`}>
              <button
                onClick={() => setActiveTab('inbox')}
                className={`px-4 py-3 text-[11px] font-bold border-b-2 flex items-center gap-1.5 cursor-pointer transition-colors ${
                  activeTab === 'inbox' 
                    ? 'border-gold-400 text-gold-400 bg-[#2c3338]/40' 
                    : 'border-transparent text-gray-400 hover:text-gold-400'
                }`}
              >
                <Inbox className="w-3.5 h-3.5" />
                <span>{language === 'fa' ? `پیام‌ها (${messages.length})` : `Inbox (${messages.length})`}</span>
              </button>

              <button
                onClick={() => setActiveTab('edit-bio')}
                className={`px-4 py-3 text-[11px] font-bold border-b-2 flex items-center gap-1.5 cursor-pointer transition-colors ${
                  activeTab === 'edit-bio' 
                    ? 'border-gold-400 text-gold-400 bg-[#2c3338]/40' 
                    : 'border-transparent text-gray-400 hover:text-gold-400'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{language === 'fa' ? 'بیوگرافی دو زبانه' : 'Bilingual Bio'}</span>
              </button>

              <button
                onClick={() => setActiveTab('content-cms')}
                className={`px-4 py-3 text-[11px] font-bold border-b-2 flex items-center gap-1.5 cursor-pointer transition-colors ${
                  activeTab === 'content-cms' 
                    ? 'border-gold-400 text-gold-400 bg-[#2c3338]/40' 
                    : 'border-transparent text-gray-400 hover:text-gold-400'
                }`}
              >
                <Star className="w-3.5 h-3.5" />
                <span>{language === 'fa' ? 'تجهیزات و بخش‌ها' : 'Gear & Cards'}</span>
              </button>

              <button
                onClick={() => setActiveTab('upload-music')}
                className={`px-4 py-3 text-[11px] font-bold border-b-2 flex items-center gap-1.5 cursor-pointer transition-colors ${
                  activeTab === 'upload-music' 
                    ? 'border-gold-400 text-gold-400 bg-[#2c3338]/40' 
                    : 'border-transparent text-gray-400 hover:text-gold-400'
                }`}
              >
                <Music className="w-3.5 h-3.5" />
                <span>{language === 'fa' ? `آثار (${allTracks.length})` : `Tracks (${allTracks.length})`}</span>
              </button>

              <button
                onClick={() => setActiveTab('gallery-cms')}
                className={`px-4 py-3 text-[11px] font-bold border-b-2 flex items-center gap-1.5 cursor-pointer transition-colors ${
                  activeTab === 'gallery-cms' 
                    ? 'border-gold-400 text-gold-400 bg-[#2c3338]/40' 
                    : 'border-transparent text-gray-400 hover:text-gold-400'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>{language === 'fa' ? `گالری (${galleryItems?.length || 0})` : `Gallery (${galleryItems?.length || 0})`}</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`px-4 py-3 text-[11px] font-bold border-b-2 flex items-center gap-1.5 cursor-pointer transition-colors ${
                  activeTab === 'settings' 
                    ? 'border-gold-400 text-gold-400 bg-[#2c3338]/40' 
                    : 'border-transparent text-gray-400 hover:text-gold-400'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                <span>{language === 'fa' ? 'پوسته' : 'Theme'}</span>
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

                {/* TAB 2: EDIT BIO (BILINGUAL) */}
                {activeTab === 'edit-bio' && (
                  <motion.div
                    key="bio-tab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4 font-sans"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-[#f0f0f1]">{language === 'fa' ? 'ویرایش بیوگرافی دو زبانه استاد کیانور پرتوی' : 'Edit Bilingual Artist Biography'}</h3>
                      <span className="text-[10px] text-gray-500">{language === 'fa' ? 'محتوای صفحه درباره من' : 'About Page Content'}</span>
                    </div>

                    <div className={`space-y-5 ${isRtl ? 'text-right' : 'text-left'}`}>
                      {/* Paragraph 1 - Persian */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gold-400 flex items-center gap-1.5 justify-start">
                          <span className="w-2 h-2 rounded-full bg-gold-400" />
                          <span>{language === 'fa' ? 'پاراگراف اول بیوگرافی (فارسی)' : 'Biography Paragraph 1 (Persian)'}</span>
                        </label>
                        <textarea
                          rows={4}
                          value={bioP1Fa}
                          onChange={(e) => setBioP1Fa(e.target.value)}
                          className="w-full bg-[#111111] border border-[#2c3338] rounded-xl p-3.5 text-xs leading-relaxed text-gray-200 focus:outline-none focus:border-gold-400 resize-none font-sans"
                        />
                      </div>

                      {/* Paragraph 1 - English */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gold-400 flex items-center gap-1.5 justify-start">
                          <span className="w-2 h-2 rounded-full bg-gold-400" />
                          <span>{language === 'fa' ? 'پاراگراف اول بیوگرافی (انگلیسی)' : 'Biography Paragraph 1 (English)'}</span>
                        </label>
                        <textarea
                          rows={4}
                          value={bioP1En}
                          onChange={(e) => setBioP1En(e.target.value)}
                          className="w-full bg-[#111111] border border-[#2c3338] rounded-xl p-3.5 text-xs leading-relaxed text-gray-200 focus:outline-none focus:border-gold-400 resize-none font-sans text-left"
                          dir="ltr"
                        />
                      </div>

                      {/* Paragraph 1.1 - Persian */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gold-400 flex items-center gap-1.5 justify-start">
                          <span className="w-2 h-2 rounded-full bg-gold-400" />
                          <span>{language === 'fa' ? 'پاراگراف دوم بیوگرافی - معرفی تخصص‌ها (فارسی)' : 'Biography Paragraph 1.1 - Expertise Intro (Persian)'}</span>
                        </label>
                        <textarea
                          rows={4}
                          value={bioP11Fa}
                          onChange={(e) => setBioP11Fa(e.target.value)}
                          className="w-full bg-[#111111] border border-[#2c3338] rounded-xl p-3.5 text-xs leading-relaxed text-gray-200 focus:outline-none focus:border-gold-400 resize-none font-sans"
                        />
                      </div>

                      {/* Paragraph 1.1 - English */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gold-400 flex items-center gap-1.5 justify-start">
                          <span className="w-2 h-2 rounded-full bg-gold-400" />
                          <span>{language === 'fa' ? 'پاراگراف دوم بیوگرافی - معرفی تخصص‌ها (انگلیسی)' : 'Biography Paragraph 1.1 - Expertise Intro (English)'}</span>
                        </label>
                        <textarea
                          rows={4}
                          value={bioP11En}
                          onChange={(e) => setBioP11En(e.target.value)}
                          className="w-full bg-[#111111] border border-[#2c3338] rounded-xl p-3.5 text-xs leading-relaxed text-gray-200 focus:outline-none focus:border-gold-400 resize-none font-sans text-left"
                          dir="ltr"
                        />
                      </div>

                      {/* Paragraph 2 - Persian */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gold-400 flex items-center gap-1.5 justify-start">
                          <span className="w-2 h-2 rounded-full bg-gold-400" />
                          <span>{language === 'fa' ? 'پاراگراف پایانی بیوگرافی (فارسی)' : 'Biography Final Paragraph (Persian)'}</span>
                        </label>
                        <textarea
                          rows={4}
                          value={bioP2Fa}
                          onChange={(e) => setBioP2Fa(e.target.value)}
                          className="w-full bg-[#111111] border border-[#2c3338] rounded-xl p-3.5 text-xs leading-relaxed text-gray-200 focus:outline-none focus:border-gold-400 resize-none font-sans"
                        />
                      </div>

                      {/* Paragraph 2 - English */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gold-400 flex items-center gap-1.5 justify-start">
                          <span className="w-2 h-2 rounded-full bg-gold-400" />
                          <span>{language === 'fa' ? 'پاراگراف پایانی بیوگرافی (انگلیسی)' : 'Biography Final Paragraph (English)'}</span>
                        </label>
                        <textarea
                          rows={4}
                          value={bioP2En}
                          onChange={(e) => setBioP2En(e.target.value)}
                          className="w-full bg-[#111111] border border-[#2c3338] rounded-xl p-3.5 text-xs leading-relaxed text-gray-200 focus:outline-none focus:border-gold-400 resize-none font-sans text-left"
                          dir="ltr"
                        />
                      </div>

                      {isBioSaved && (
                        <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2 justify-start font-sans">
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span>{language === 'fa' ? 'بیوگرافی دو زبانه با موفقیت ذخیره و اعمال شد!' : 'Bilingual biography saved and synchronized successfully!'}</span>
                        </div>
                      )}

                      <button
                        onClick={handleSaveBio}
                        className="w-full py-3 bg-gold-500 hover:bg-gold-400 text-black font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow cursor-pointer transition-colors"
                      >
                        <Save className="w-4 h-4 text-black" />
                        <span>{language === 'fa' ? 'ذخیره بیوگرافی دو زبانه' : 'Save Bilingual Biography'}</span>
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* TAB 2.5: GENERAL SECTIONS CMS */}
                {activeTab === 'content-cms' && (
                  <motion.div
                    key="content-cms-tab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6 font-sans"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-[#f0f0f1]">{language === 'fa' ? 'مدیریت تجهیزات و کارت‌های سفارشی' : 'Manage Equipment & Custom Cards'}</h3>
                      <span className="text-[10px] text-gray-500">{language === 'fa' ? 'بخش‌های درباره من' : 'About Page Sections'}</span>
                    </div>

                    <div className={`space-y-6 ${isRtl ? 'text-right' : 'text-left'}`}>
                      
                      {/* EQUIPMENT ENGINE PANEL */}
                      <div className="bg-[#181818] border border-gold-400/10 rounded-2xl p-5 space-y-4">
                        <div className="flex items-center justify-between border-b border-gold-400/10 pb-3">
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-gold-400" />
                            <span className="text-xs font-bold text-white">{language === 'fa' ? 'فهرست تجهیزات استودیو و لایو' : 'Studio & Live Equipment List'}</span>
                          </div>
                          <button
                            onClick={handleAddEquipmentCategory}
                            className="text-[10px] bg-gold-500/10 hover:bg-gold-500/20 text-gold-400 border border-gold-400/20 px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1"
                          >
                            <PlusCircle className="w-3.5 h-3.5" />
                            <span>{language === 'fa' ? 'افزودن دسته‌بندی' : 'Add Category'}</span>
                          </button>
                        </div>

                        {/* Title Overrides */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                          <div className="space-y-1.5">
                            <label className="text-[10px] text-gray-400 font-bold">{language === 'fa' ? 'عنوان بخش تجهیزات (فارسی)' : 'Section Title (Persian)'}</label>
                            <input
                              type="text"
                              value={equipmentInput?.titleFa || ''}
                              onChange={(e) => setEquipmentInput((prev: any) => ({ ...prev, titleFa: e.target.value }))}
                              className="w-full bg-[#111111] border border-[#2c3338] rounded-xl p-2.5 text-xs text-gray-200 focus:outline-none focus:border-gold-400 font-sans"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] text-gray-400 font-bold">{language === 'fa' ? 'عنوان بخش تجهیزات (English)' : 'Section Title (English)'}</label>
                            <input
                              type="text"
                              value={equipmentInput?.titleEn || ''}
                              onChange={(e) => setEquipmentInput((prev: any) => ({ ...prev, titleEn: e.target.value }))}
                              className="w-full bg-[#111111] border border-[#2c3338] rounded-xl p-2.5 text-xs text-gray-200 focus:outline-none focus:border-gold-400 font-sans text-left"
                              dir="ltr"
                            />
                          </div>
                        </div>

                        {/* Categories List */}
                        <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1 scrollbar-thin">
                          {equipmentInput?.items?.map((cat: any, idx: number) => (
                            <div key={idx} className="bg-black/30 border border-[#2c3338] rounded-xl p-4 space-y-3 relative">
                              <button
                                onClick={() => handleDeleteCategory(idx)}
                                className="absolute top-3.5 left-3.5 text-red-400 hover:text-red-300 transition-colors p-1"
                                title={language === 'fa' ? 'حذف دسته‌بندی' : 'Delete Category'}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>

                              <span className="text-[10px] font-mono text-gold-400/50 block">#{idx + 1}</span>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="space-y-1">
                                  <label className="text-[9px] text-gray-400">{language === 'fa' ? 'نام دسته‌بندی (فارسی)' : 'Category Name (Fa)'}</label>
                                  <input
                                    type="text"
                                    value={cat.categoryFa}
                                    onChange={(e) => handleUpdateCategoryTitle(idx, 'categoryFa', e.target.value)}
                                    className="w-full bg-[#111111] border border-[#2c3338]/60 rounded-lg p-2 text-xs text-white focus:outline-none"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[9px] text-gray-400">{language === 'fa' ? 'نام دسته‌بندی (English)' : 'Category Name (En)'}</label>
                                  <input
                                    type="text"
                                    value={cat.categoryEn}
                                    onChange={(e) => handleUpdateCategoryTitle(idx, 'categoryEn', e.target.value)}
                                    className="w-full bg-[#111111] border border-[#2c3338]/60 rounded-lg p-2 text-xs text-white focus:outline-none text-left"
                                    dir="ltr"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="space-y-1">
                                  <label className="text-[9px] text-gray-400">{language === 'fa' ? 'آیتم‌ها (هر کدام در یک سطر جدید - فارسی)' : 'Items (one per line - Persian)'}</label>
                                  <textarea
                                    rows={3}
                                    value={cat.listFa?.join('\n') || ''}
                                    onChange={(e) => handleUpdateCategoryItems(idx, 'Fa', e.target.value)}
                                    placeholder="میکروفون ۱&#10;میکروفون ۲"
                                    className="w-full bg-[#111111] border border-[#2c3338]/60 rounded-lg p-2 text-[11px] leading-relaxed text-gray-300 focus:outline-none font-sans"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[9px] text-gray-400">{language === 'fa' ? 'آیتم‌ها (هر کدام در یک سطر جدید - انگلیسی)' : 'Items (one per line - English)'}</label>
                                  <textarea
                                    rows={3}
                                    value={cat.listEn?.join('\n') || ''}
                                    onChange={(e) => handleUpdateCategoryItems(idx, 'En', e.target.value)}
                                    placeholder="Mic 1&#10;Mic 2"
                                    className="w-full bg-[#111111] border border-[#2c3338]/60 rounded-lg p-2 text-[11px] leading-relaxed text-gray-300 focus:outline-none font-sans text-left"
                                    dir="ltr"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* CUSTOM CARDS PANEL */}
                      <div className="bg-[#181818] border border-gold-400/10 rounded-2xl p-5 space-y-4">
                        <div className="flex items-center justify-between border-b border-gold-400/10 pb-3">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gold-400" />
                            <span className="text-xs font-bold text-white">{language === 'fa' ? 'کارت‌های اطلاعاتی سفارشی' : 'Custom Info Cards'}</span>
                          </div>
                          <button
                            onClick={handleAddCustomCard}
                            className="text-[10px] bg-gold-500/10 hover:bg-gold-500/20 text-gold-400 border border-gold-400/20 px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1"
                          >
                            <PlusCircle className="w-3.5 h-3.5" />
                            <span>{language === 'fa' ? 'افزودن کارت سفارشی' : 'Add Info Card'}</span>
                          </button>
                        </div>

                        {customCardsInput.length === 0 ? (
                          <div className="text-center p-6 text-gray-500 text-xs border border-dashed border-[#2c3338] rounded-xl">
                            {language === 'fa' ? 'هیچ کارت اطلاعاتی سفارشی هنوز اضافه نشده است.' : 'No custom info cards added yet.'}
                          </div>
                        ) : (
                          <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1 scrollbar-thin">
                            {customCardsInput.map((card, idx) => (
                              <div key={card.id || idx} className="bg-black/30 border border-[#2c3338] rounded-xl p-4 space-y-3 relative">
                                <button
                                  onClick={() => handleDeleteCustomCard(card.id)}
                                  className="absolute top-3.5 left-3.5 text-red-400 hover:text-red-300 transition-colors p-1"
                                  title={language === 'fa' ? 'حذف کارت' : 'Delete Card'}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>

                                <span className="text-[10px] font-mono text-gold-400/50 block">#{idx + 1}</span>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <div className="space-y-1">
                                    <label className="text-[9px] text-gray-400">{language === 'fa' ? 'عنوان کارت (فارسی)' : 'Card Title (Persian)'}</label>
                                    <input
                                      type="text"
                                      value={card.titleFa}
                                      onChange={(e) => handleUpdateCustomCardField(card.id, 'titleFa', e.target.value)}
                                      className="w-full bg-[#111111] border border-[#2c3338]/60 rounded-lg p-2 text-xs text-white focus:outline-none"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[9px] text-gray-400">{language === 'fa' ? 'عنوان کارت (English)' : 'Card Title (English)'}</label>
                                    <input
                                      type="text"
                                      value={card.titleEn}
                                      onChange={(e) => handleUpdateCustomCardField(card.id, 'titleEn', e.target.value)}
                                      className="w-full bg-[#111111] border border-[#2c3338]/60 rounded-lg p-2 text-xs text-white focus:outline-none text-left"
                                      dir="ltr"
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <div className="space-y-1">
                                    <label className="text-[9px] text-gray-400">{language === 'fa' ? 'محتوای کارت (فارسی)' : 'Card Content (Persian)'}</label>
                                    <textarea
                                      rows={3}
                                      value={card.contentFa}
                                      onChange={(e) => handleUpdateCustomCardField(card.id, 'contentFa', e.target.value)}
                                      className="w-full bg-[#111111] border border-[#2c3338]/60 rounded-lg p-2 text-[11px] leading-relaxed text-gray-300 focus:outline-none font-sans"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[9px] text-gray-400">{language === 'fa' ? 'محتوای کارت (English)' : 'Card Content (English)'}</label>
                                    <textarea
                                      rows={3}
                                      value={card.contentEn}
                                      onChange={(e) => handleUpdateCustomCardField(card.id, 'contentEn', e.target.value)}
                                      className="w-full bg-[#111111] border border-[#2c3338]/60 rounded-lg p-2 text-[11px] leading-relaxed text-gray-300 focus:outline-none font-sans text-left"
                                      dir="ltr"
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {isCmsSaved && (
                        <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2 justify-start font-sans">
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span>{language === 'fa' ? 'تجهیزات و کارت‌های سفارشی با موفقیت ذخیره و اعمال شدند!' : 'Equipment list and custom cards saved successfully!'}</span>
                        </div>
                      )}

                      <button
                        onClick={handleSaveCms}
                        className="w-full py-3 bg-gold-500 hover:bg-gold-400 text-black font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow cursor-pointer transition-colors"
                      >
                        <Save className="w-4 h-4 text-black" />
                        <span>{language === 'fa' ? 'ذخیره تغییرات تجهیزات و بخش‌ها' : 'Save Section Content Changes'}</span>
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

                {/* TAB 6: GALLERY CMS */}
                {activeTab === 'gallery-cms' && (
                  <motion.div
                    key="gallery-cms-tab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-[#f0f0f1]">{language === 'fa' ? 'مدیریت و آپلود تصاویر گالری' : 'Gallery List & Image Uploads'}</h3>
                      <span className="text-[10px] text-gray-500">{language === 'fa' ? `مجموع تصاویر گالری: ${galleryItems?.length || 0} عکس` : `Total gallery images: ${galleryItems?.length || 0}`}</span>
                    </div>

                    {/* Form Block */}
                    <form onSubmit={handleGalleryUpload} className={`bg-[#181818] border border-gold-400/10 rounded-2xl p-5 space-y-4 ${isRtl ? 'text-right' : 'text-left'} font-sans`}>
                      <div className="flex items-center gap-2 pb-2 border-b border-gold-400/10">
                        <PlusCircle className="w-4 h-4 text-gold-400" />
                        <span className="text-xs font-bold text-white">{language === 'fa' ? 'آپلود تصویر جدید به گالری' : 'Upload New Gallery Image'}</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-gray-400">{language === 'fa' ? 'عنوان تصویر (فارسی)' : 'Image Title (Persian)'}</label>
                          <input
                            type="text"
                            required
                            value={galleryTitle}
                            onChange={(e) => setGalleryTitle(e.target.value)}
                            placeholder={language === 'fa' ? 'مانند: پشت صحنه کنسرت تهران' : 'e.g. Backstage Concert Tehran'}
                            className="w-full bg-[#111111] border border-[#2c3338] rounded-xl p-2.5 text-xs text-gray-200 focus:outline-none focus:border-gold-400 font-sans"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-gray-400">{language === 'fa' ? 'عنوان انگلیسی (English Title)' : 'Image Title (English)'}</label>
                          <input
                            type="text"
                            required
                            value={galleryTitleEn}
                            onChange={(e) => setGalleryTitleEn(e.target.value)}
                            placeholder="e.g. Tehran Backstage Concert"
                            className="w-full bg-[#111111] border border-[#2c3338] rounded-xl p-2.5 text-xs text-gray-200 focus:outline-none focus:border-gold-400 font-sans text-left"
                            dir="ltr"
                          />
                        </div>

                        <div className="space-y-1.5 md:col-span-2">
                          <label className="text-[11px] font-bold text-gray-400">{language === 'fa' ? 'توضیحات کوتاه تصویر (فارسی)' : 'Image Description (Persian)'}</label>
                          <textarea
                            rows={2}
                            value={galleryDesc}
                            onChange={(e) => setGalleryDesc(e.target.value)}
                            placeholder={language === 'fa' ? 'توضیحاتی کوتاه در مورد این تصویر...' : 'Brief story or details about this shot...'}
                            className="w-full bg-[#111111] border border-[#2c3338] rounded-xl p-2.5 text-xs text-gray-200 focus:outline-none focus:border-gold-400 font-sans resize-none"
                          />
                        </div>

                        <div className="space-y-1.5 md:col-span-2">
                          <label className="text-[11px] font-bold text-gray-400">{language === 'fa' ? 'توضیحات انگلیسی (English Description)' : 'Image Description (English)'}</label>
                          <textarea
                            rows={2}
                            value={galleryDescEn}
                            onChange={(e) => setGalleryDescEn(e.target.value)}
                            placeholder="e.g. Captured during the soundcheck session..."
                            className="w-full bg-[#111111] border border-[#2c3338] rounded-xl p-2.5 text-xs text-gray-200 focus:outline-none focus:border-gold-400 font-sans resize-none text-left"
                            dir="ltr"
                          />
                        </div>

                        <div className="space-y-1.5 md:col-span-2">
                          <label className="text-[11px] font-bold text-gray-400 flex items-center gap-1.5">
                            <Upload className="w-3.5 h-3.5 text-gold-400" />
                            <span>{language === 'fa' ? 'انتخاب تصویر (حداکثر حجم ۵ مگابایت)*' : 'Select Gallery Image (Max 5MB)*'}</span>
                          </label>
                          <input
                            type="file"
                            required
                            ref={galleryImageInputRef}
                            accept="image/*"
                            className="w-full bg-[#111111] border border-[#2c3338] rounded-xl p-1.5 text-xs text-gray-400 file:bg-gold-500 file:text-black file:border-0 file:py-1 file:px-2.5 file:rounded-md file:text-[10px] file:font-bold file:cursor-pointer"
                          />
                        </div>
                      </div>

                      {galleryUploadSuccess && (
                        <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2 justify-start font-sans">
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span>{language === 'fa' ? 'تصویر جدید با موفقیت بارگذاری، ذخیره و در بخش «گالری» قرار گرفت!' : 'Image uploaded successfully! Added to the gallery screen.'}</span>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isGalleryUploading}
                        className={`w-full py-3 bg-gold-500 hover:bg-gold-400 disabled:bg-gray-700 text-black font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow cursor-pointer transition-colors`}
                      >
                        {isGalleryUploading ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin text-black" />
                            <span>{language === 'fa' ? 'در حال ذخیره‌سازی تصویر روی سرور...' : 'Uploading image file to server...'}</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 text-black" />
                            <span>{language === 'fa' ? 'آپلود و ذخیره نهایی تصویر گالری' : 'Upload & Save Gallery Image'}</span>
                          </>
                        )}
                      </button>
                    </form>

                    {/* Uploaded List Block */}
                    <div className={`space-y-3 font-sans ${isRtl ? 'text-right' : 'text-left'}`}>
                      <span className="text-xs font-bold text-gray-400 block">
                        {language === 'fa' ? 'لیست تمام تصاویر گالری (پیش‌فرض و سفارشی):' : 'All Images (Default & User Uploaded):'}
                      </span>
                      
                      {!galleryItems || galleryItems.length === 0 ? (
                        <div className="border border-dashed border-[#2c3338] rounded-xl p-6 text-center text-gray-500 text-xs">
                          {language === 'fa' ? 'هیچ تصویری در گالری یافت نشد.' : 'No images found.'}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {galleryItems.map((item) => {
                            const isDefault = !item.id.toString().startsWith('g-custom-');
                            return (
                              <div 
                                key={item.id}
                                className="bg-[#2c3338]/10 border border-[#2c3338] rounded-xl p-3 flex items-center justify-between gap-4 hover:border-gold-400/25 transition-all"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 rounded bg-black border border-gold-400/10 overflow-hidden flex-shrink-0">
                                    <img 
                                      src={item.imageUrl} 
                                      alt={item.title} 
                                      className="w-full h-full object-cover" 
                                      referrerPolicy="no-referrer"
                                    />
                                  </div>
                                  <div className={isRtl ? 'text-right' : 'text-left'}>
                                    <div className="flex items-center gap-2">
                                      <h4 className="text-xs font-bold text-white">{language === 'fa' ? item.title : (item.titleEn || item.title)}</h4>
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
                                    <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-1">
                                      {language === 'fa' ? item.description : (item.descriptionEn || item.description)}
                                    </p>
                                    <span className="text-[8px] text-gray-500 mt-0.5 block">{item.createdAt}</span>
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => onDeleteGalleryItem(item.id)}
                                  className="p-1.5 rounded text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors cursor-pointer flex-shrink-0"
                                  title={language === 'fa' ? 'حذف تصویر' : 'Delete Image'}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
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
