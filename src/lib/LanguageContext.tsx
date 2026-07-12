import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'fa' | 'en';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  isRtl: boolean;
  t: (key: keyof typeof translations) => string;
  customTranslations: Record<string, string>;
  setCustomTranslations: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

const translations = {
  // Navigation / Header
  home: 'صفحه اصلی',
  homeEn: 'Home',
  music: 'موزیک‌های من',
  musicEn: 'My Music',
  about: 'درباره من',
  aboutEn: 'About Me',
  gallery: 'گالری تصاویر',
  galleryEn: 'Gallery',
  contact: 'تماس با من',
  contactEn: 'Contact Me',
  artistName: 'کیانور پرتوی',
  artistNameEn: 'Kianour Partovi',
  artistSubtitle: 'موزیک پرودیوسر، گیتاریست (سشن - تورینگ)، خواننده، مهندس صدا',
  artistSubtitleEn: 'Music Producer, Guitarist (Session - Touring), Singer & Songwriter, Sound Engineer.',
  collabBtn: 'همکاری و سفارش پروژه',
  collabBtnEn: 'Collab & Book Project',
  muteGramophone: 'قطع صدای شبیه‌ساز گرامافون',
  muteGramophoneEn: 'Mute Gramophone Crackle',
  playGramophone: 'پخش صدای خش‌خش گرامافون قدیمی',
  playGramophoneEn: 'Play Vintage Vinyl Crackle',
  gramophoneActive: 'افکت صدای گرامافون: فعال',
  gramophoneActiveEn: 'Gramophone Sound: Active',
  gramophoneMuted: 'افکت صدای گرامافون: غیرفعال',
  gramophoneMutedEn: 'Gramophone Sound: Muted',
  
  // Footer
  footerDesc: '',
  footerDescEn: 'Creator of everlasting jazz, soul melodies & applied composition in Iran',
  footerCopyright: '© تمام حقوق معنوی و هنری متعلق به کیانور پرتوی می‌باشد.',
  footerCopyrightEn: '© All intellectual and artistic rights belong to Kianour Partovi.',
  footerSubCopyright: 'وب‌سایت رسمی و هنری کیانور پرتوی -توسعه یافته توسط محمد رضا فتح آبادی',
  footerSubCopyrightEn: 'Official Website of Kianour Partovi - Developed with React & Tailwind',
  footerOrder: 'ارسال سفارش پروژه',
  footerOrderEn: 'Book a Project',
  adminPanelLink: 'پنل مدیریت',
  adminPanelLinkEn: 'Artist Admin Panel',
  adminBadgeTitle: 'پنل مدیریت',
  adminBadgeTitleEn: 'Admin Panel',

  // Hero Section
  heroSubtitle: 'بیش از ۲۰ سال سابقه حرفه‌ای',
  heroSubtitleEn: 'Over 20 years of professional experience',
  heroTitlePrimary: 'نوازنده، آهنگساز، تنظیم‌کننده و تهیه‌کننده موسیقی',
  heroTitlePrimaryEn: 'Guitarist, Composer, Arranger & Music Producer',
  heroTitleSecondary: 'خالق نواهای ماندگار و نوستالژیک',
  heroTitleSecondaryEn: 'Creator of Memorable & Nostalgic Melodies',
  heroPhilosophyTitle: 'فلسفه هنری من:',
  heroPhilosophyTitleEn: 'My Artistic Philosophy:',
  heroListenBtn: 'شنیدن قطعات موسیقی',
  heroListenBtnEn: 'Listen to Tracks',
  heroAboutBtn: 'درباره من و مدارج علمی',
  heroAboutBtnEn: 'About Me & Credentials',
  
  // Hero Info Badges
  badgeLocationTitle: 'موقعیت هنری',
  badgeLocationTitleEn: 'Artistic Location',
  badgeLocationValue: 'تهران، ایران',
  badgeLocationValueEn: 'Tehran, Iran',
  badgeExpTitle: 'سابقه فعالیت در موسیقی',
  badgeExpTitleEn: 'Composition History',
  badgeExpValue: 'از سال ۱۳۸۲',
  badgeExpValueEn: 'Since 2003',
  badgeEduTitle: 'مدارک تحصیلی',
  badgeEduTitleEn: 'Education',
  badgeEduValue: 'کارشناسی ارشد موسیقی',
  badgeEduValueEn: 'Master of Music',

  // Hero Carousel Labels
  cap1: 'پرتره هنری استودیویی',
  cap1En: 'Studio Artistic Portrait',
  sub1: 'آهنگساز و نوازنده گیتار الکتریک جز',
  sub1En: 'Composer & Jazz Electric Guitarist',
  cap2: 'نمای نزدیک از نوازنده نوستالژیک',
  cap2En: 'Close-up of the Nostalgic Musician',
  sub2: 'تهیه‌کننده و مهندس صدای آنالوگ',
  sub2En: 'Analog Sound Engineer & Producer',
  cap3: 'استایل خیابانی در فضای باز',
  cap3En: 'Outdoor Street Style',
  sub3: 'رهبر ارکستر بزرگ جاز-پاپ تهران',
  sub3En: 'Conductor of Tehran Jazz-Pop Orchestra',

  // About Section
  aboutTitle: 'درباره من و مدارج علمی',
  aboutTitleEn: 'About Me & Credentials',
  aboutDesc: 'مروری بر دو دهه فعالیت تخصصی در حوزه‌های نوازندگی، رهبری ارکستر، آهنگسازی و صدابرداری آنالوگ.',
  aboutDescEn: 'A look back at two decades of professional work in guitar performance, conducting, composition, and analog sound engineering.',
  aboutHeaderEditorial: 'بیست سال نواختن و نوشتن نت‌ها...',
  aboutHeaderEditorialEn: 'Twenty years of playing and writing notes...',
  aboutBioP1: 'موسیقی جاز و ژانرهای مشتق شده از آن مانند جاز نرم، فانک، سول، آر اند بی به من آموخته‌اند که چگونه آزادی عمیقی را در ساختاری بسیار مهندسی شده و مبتنی بر قوانین پیچیده هارمونی تجربه کنم.در آهنگسازی‌هایم، همیشه تلاش می‌کنم تا پلی بین فضای ارکستر کلاسیک و ساختارهای پاپ مدرن ایجاد کنم تا صدایی خلق کنم که هم از نظر فکری غنی و هم از نظر احساسی تأثیرگذار باشد.',
  aboutBioP11: 'درود، من کیانور پرتوی هستم؛ گیتاریست، موزیک پرودیوسر، خواننده، آهنگساز، تنظیم‌کننده، مهندس صدا و رهبر ارکستر با بیش از ۲۰ سال تجربه حرفه‌ای در صنعت موسیقی، تمرکز اصلی من بر خلق، اجرا و تولید موسیقی است. در طول سال‌ها با هنرمندان مختلف در پروژه‌های استودیویی، اجراهای زنده و تولید آثار موسیقی همکاری کرده‌ام و همواره تلاش کرده‌ام کیفیت هنری و فنی را در بالاترین سطح ارائه دهم.',
  aboutBioP1En: 'Jazz and its derivative genres like Smooth Jazz, Funk, Soul, R&B have taught me how to experience deep freedom within a highly engineered structure based on complex rules of harmoony. In my compositions, I always strive to bridge the classical orchestral space and modern pop structures to create a sound that is both intellectually rich and emotionally touching.',
  aboutBioP11En: 'Hello, I am Kianour Partovi; a guitarist, music producer, singer, composer, arranger, sound engineer and conductor with over 20 years of professional experience in the music industry. My main focus is on creating, performing and producing music. Over the years, I have collaborated with various artists on studio projects, live performances and musical productions, and I have always strived to provide the highest level of artistic and technical quality.',
  aboutBioP2: 'موسیقی برای من تنها یک حرفه نیست؛ بلکه راهی برای خلق احساس، روایت داستان و برقراری ارتباطی ماندگار با مخاطب است.',
  aboutBioP2En: 'As a sound engineer, I believe that the authenticity of analog sound—with all its delightful crackles and unique warmth—has a magic that can never be replicated in the cold digital world. That is why in my personal studio, I always try to preserve this signature sound and nostalgic organic texture in my works.',
  socialTitle: 'درگاه‌های رسمی پخش و شبکه‌های اجتماعی',
  socialTitleEn: 'Official Streaming Outlets & Social Media',
  socialDesc: 'برای شنیدن جدیدترین آثار، دیدن ویدیوهای نوازندگی زنده و آگاهی از رویدادها، من را در پلتفرم‌های جهانی دنبال کنید.',
  socialDescEn: 'To hear the latest releases, watch live performances, and follow my events, stay tuned on international platforms.',
  academicSubtitle: 'تحصیلات آکادمیک و مدارج علمی',
  academicSubtitleEn: 'Academic Education & Credentials',
  stylesShowcaseTitle: 'سبک‌های تحت پوشش و امضای هنری',
  stylesShowcaseTitleEn: 'Musical Styles & Artistic Signature',
  honorsTitle: 'افتخارات و دستاوردها',
  honorsTitleEn: 'Honors & Achievements',
  photoCapComp: 'آهنگسازی و سازها',
  photoCapCompEn: 'Composition & Instruments',
  photoCapAnalog: 'کارگاه ضبط آنالوگ',
  photoCapAnalogEn: 'Analog Recording Workshop',

  // Music Section
  musicTitle: 'شنیدن آثار و آلبوم‌ها',
  musicTitleEn: 'Listen to My Music',
  musicDesc: 'می توانید آثار من را در ۱۵ ثانیه به عنوان نمونه اثر در این صفحه به وسیله این پلیر گوش دهید و برای شنیدن کامل آن به لینک های سایت های پخش بین المللی موسیقی که در قسمت درباره من گذاشته شده است مراجعه کنید.',
  musicDescEn: 'You can listen to my works in 15 seconds as a sample of the work on this page using this player, and to listen to it in full, refer to the links to international music streaming sites that are posted in the About Me section.',
  cassetteTitle: 'پخش‌کننده نوار کاست آنالوگ',
  cassetteTitleEn: 'Analog Cassette Tape Player',
  aboutTrackTitle: 'درباره اثر در حال پخش:',
  aboutTrackTitleEn: 'About Current Track:',
  trackInstruments: 'سازهای محوری:',
  trackInstrumentsEn: 'Core Instruments:',
  trackYear: 'سال تولید:',
  trackYearEn: 'Year:',
  allGenres: 'همه سبک‌ها',
  allGenresEn: 'All Genres',
  soundDesignCredit: 'SOUND DESIGN BY KIANOUR PARTOVI',
  soundDesignCreditEn: 'SOUND DESIGN BY KIANOUR PARTOVI',
  soundQualityLabel: 'HIGH-FIDELITY 192KBPS DOLBY',
  soundQualityLabelEn: 'HIGH-FIDELITY 192KBPS DOLBY',
  prevTrack: 'ترک قبلی',
  prevTrackEn: 'Previous Track',
  nextTrack: 'ترک بعدی',
  nextTrackEn: 'Next Track',
  playTrack: 'شروع پخش',
  playTrackEn: 'Play Track',
  pauseTrack: 'توقف پخش',
  pauseTrackEn: 'Pause Track',

  // Contact Section
  contactTitle: 'ارتباط مستقیم و سفارش پروژه',
  contactTitleEn: 'Direct Contact & Project Booking',
  contactDesc: 'جهت سفارش ساخت موسیقی متن، تنظیم قطعات، نوازندگی گیتار، ضبط آنالوگ یا برگزاری مسترکلاس‌های تخصصی پیام بگذارید.',
  contactDescEn: 'Leave a message for soundtrack composition, track arranging, guitar performance, analog recording, or specialized masterclasses.',
  contactCardTitle: 'راه‌های ارتباطی مستقیم با استودیو',
  contactCardTitleEn: 'Direct Contacts with Studio',
  contactCardDesc: 'علاقه‌مندان، تهیه‌کنندگان و هنرمندان عزیز می‌توانند علاوه بر فرم پیام، از طریق راه‌های ارتباطی زیر مستقیماً با من در تماس باشند:',
  contactCardDescEn: 'Dear fans, producers, and fellow artists can reach me directly via the following contact channels in addition to the message form:',
  officeAddress: 'تهران، قیطریه، پارک قیطریه، خیابان کتابی، جنب پارک قیطریه.',
  officeAddressEn: 'Ketabi Street, Adjacent to Qeytarieh Park, Qeytarieh District, Tehran, Iran',
  addressLabel: 'آدرس دفتر هنری:',
  addressLabelEn: 'Art Office Address:',
  phoneLabel: 'شماره تماس مستقیم:',
  phoneLabelEn: 'Direct Phone:',
  emailLabel: 'پست الکترونیکی:',
  emailLabelEn: 'Email Address:',
  workHoursLabel: 'ساعات کاری و پاسخگویی:',
  workHoursLabelEn: 'Working Hours:',
  workHoursValue: 'شنبه تا جمعه - ساعت ۱۱ الی ۱۷',
  workHoursValueEn: 'Sat to Fri - 11:00 AM to 5:00 PM ',
  formTitle: 'ارسال پیام و شرح سفارش پروژه',
  formTitleEn: 'Send Message & Project Details',
  inputName: 'نام و نام خانوادگی شما',
  inputNameEn: 'Your Full Name',
  inputEmail: 'آدرس ایمیل شما',
  inputEmailEn: 'Your Email Address',
  inputSubject: 'موضوع پیام (مانند: سفارش تنظیم، نوازندگی گیتار الکتریک)',
  inputSubjectEn: 'Subject (e.g., Arranging order, Guitar session)',
  inputMessage: 'متن پیام یا شرح دقیق سفارش پروژه موسیقی شما...',
  inputMessageEn: 'Your message or detailed description of your music project...',
  submitBtn: 'ارسال اطلاعات پیام هنری',
  submitBtnEn: 'Submit Artistic Message',
  sendingBtn: 'در حال ارسال پیام...',
  sendingBtnEn: 'Sending Message...',
  successMsg: 'پیام شما با موفقیت ارسال شد. در اسرع وقت پاسخگوی شما خواهم بود.',
  successMsgEn: 'Your message has been sent successfully. I will get back to you as soon as possible.',
  errorMsg: 'خطا در ارسال پیام. لطفاً ارتباط خود با سرور را بررسی کرده و مجدداً تلاش کنید.',
  errorMsgEn: 'Error sending message. Please check your connection and try again.',

  // Admin Panel
  adminTitle: 'پنل مدیریت اختصاصی استاد کیانور پرتوی',
  adminTitleEn: 'Exclusive Admin Panel - Kianour Partovi',
  closePanel: 'بستن پنل',
  closePanelEn: 'Close Panel',
  tracksTab: 'مدیریت قطعات موسیقی',
  tracksTabEn: 'Manage Music Tracks',
  messagesTab: 'پیام‌های دریافتی کاربران',
  messagesTabEn: 'User Messages Received',
  bioTab: 'ویرایش بیوگرافی استاد',
  bioTabEn: 'Edit Artist Bio',
  addTrackBtn: 'افزودن قطعه جدید',
  addTrackBtnEn: 'Add New Track',
  trackNameFa: 'نام قطعه (فارسی):',
  trackNameFaEn: 'Track Name (Farsi):',
  trackNameEnLabel: 'نام قطعه (انگلیسی - انگلیسی):',
  trackNameEnLabelEn: 'Track Name (English):',
  genreLabel: 'سبک موسیقی:',
  genreLabelEn: 'Genre of Music:',
  yearLabel: 'سال تولید (مثلاً ۱۴۰۲ یا 2023):',
  yearLabelEn: 'Production Year (e.g. 1402 or 2023):',
  instrumentLabel: 'سازهای برجسته (فارسی):',
  instrumentLabelEn: 'Key Instruments (Farsi):',
  instrumentEnLabel: 'سازهای برجسته (انگلیسی):',
  instrumentEnLabelEn: 'Key Instruments (English):',
  descFaLabel: 'توضیحات کوتاه اثر (فارسی):',
  descFaLabelEn: 'Short Description (Farsi):',
  descEnLabel: 'توضیحات کوتاه اثر (انگلیسی):',
  descEnLabelEn: 'Short Description (English):',
  coverFileLabel: 'فایل کاور تصویر آلبوم (JPEG/PNG):',
  coverFileLabelEn: 'Album Cover Art File (JPEG/PNG):',
  audioFileLabel: 'فایل صوتی قطعه (MP3):',
  audioFileLabelEn: 'Audio Track File (MP3):',
  uploadProgress: 'در حال بارگذاری فایل‌ها روی سرور... لطفا شکیبا باشید.',
  uploadProgressEn: 'Uploading files to server... Please wait.',
  submitTrack: 'ثبت و ذخیره قطعه جدید در دیتابیس',
  submitTrackEn: 'Save New Track to Database',
  savingTrack: 'در حال ذخیره‌سازی...',
  savingTrackEn: 'Saving Track...',
  noMessages: 'هیچ پیام دریافتی یافت نشد.',
  noMessagesEn: 'No messages received yet.',
  messageFrom: 'فرستنده:',
  messageFromEn: 'Sender:',
  messageSubject: 'موضوع:',
  messageSubjectEn: 'Subject:',
  messageDate: 'تاریخ:',
  messageDateEn: 'Date:',
  deleteConfirm: 'آیا از حذف این مورد اطمینان دارید؟',
  deleteConfirmEn: 'Are you sure you want to delete this item?',
  deleteBtn: 'حذف',
  deleteBtnEn: 'Delete',
  saveBioBtn: 'بروزرسانی متن بیوگرافی',
  saveBioBtnEn: 'Update Biography Text',
  bioSaving: 'در حال ثبت بیوگرافی جدید...',
  bioSavingEn: 'Saving biography changes...',
  bioSuccess: 'متن بیوگرافی با موفقیت در سرور آپدیت شد.',
  bioSuccessEn: 'Biography updated successfully on the server.',
  addTrackSuccess: 'موزیک جدید با موفقیت اضافه شد.',
  addTrackSuccessEn: 'New track added successfully.',
  deleteTrackSuccess: 'موزیک با موفقیت حذف شد.',
  deleteTrackSuccessEn: 'Track deleted successfully.',
  fillAllFields: 'لطفاً تمامی فیلدهای فرم را به همراه فایل صوتی و کاور بارگذاری کنید.',
  fillAllFieldsEn: 'Please fill in all form fields and upload both audio and cover files.'
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('kianour_language');
    return (saved as Language) || 'fa';
  });

  const [customTranslations, setCustomTranslations] = useState<Record<string, string>>({});

  useEffect(() => {
    // Fetch custom translations from settings
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data && data.content && data.content.translations) {
          setCustomTranslations(data.content.translations);
        }
      })
      .catch(err => console.error("Error loading custom translations:", err));
  }, []);

  const toggleLanguage = () => {
    setLanguage((prev) => {
      const next = prev === 'fa' ? 'en' : 'fa';
      localStorage.setItem('kianour_language', next);
      return next;
    });
  };

  const isRtl = language === 'fa';

  useEffect(() => {
    const root = document.documentElement;
    root.dir = isRtl ? 'rtl' : 'ltr';
    root.lang = language;
    
    // Add font styles or custom direction classes to body if needed
    if (isRtl) {
      root.classList.add('rtl-layout');
      root.classList.remove('ltr-layout');
    } else {
      root.classList.add('ltr-layout');
      root.classList.remove('rtl-layout');
    }
  }, [language, isRtl]);

  const t = (key: keyof typeof translations): string => {
    if (language === 'en') {
      const enKey = `${key}En`;
      if (customTranslations && customTranslations[enKey]) {
        return customTranslations[enKey];
      }
      const enKeyCast = enKey as keyof typeof translations;
      if (enKeyCast in translations) {
        return translations[enKeyCast];
      }
    } else {
      if (customTranslations && customTranslations[key]) {
        return customTranslations[key];
      }
    }
    return translations[key];
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, isRtl, t, customTranslations, setCustomTranslations }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
