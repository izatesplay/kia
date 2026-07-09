import { Track, Achievement } from './types';

export const kianourProfile = {
  name: 'کیانور پرتوی',
  nameEn: 'Kianour Partovi',
  title: 'نوازنده، آهنگساز، تنظیم‌کننده و تهیه‌کننده موسیقی',
  titleEn: 'Guitarist, Composer, Arranger & Music Producer',
  experience: 'بیش از ۲۰ سال سابقه حرفه‌ای',
  experienceEn: 'Over 20 years of professional experience',
  bio: 'من کیانور پرتوی هستم؛ نوازنده گیتار، خواننده، آهنگساز، تنظیم‌کننده و تهیه‌کننده موسیقی با بیش از ۲۰ سال سابقه حرفه‌ای. در طول فعالیتم، بین دنیای ارکستر و فضای مدرن موسیقی پاپ و جز پل زده‌ام تا آثاری خلق کنم که هم از نظر فنی غنی باشند و هم از نظر احساسی تأثیرگذار. دارای مدرک کارشناسی موسیقی از دانشگاه موسیقی کنسرواتوار تهران و کارشناسی ارشد آهنگسازی کاربردی از دانشکده موسیقی تهران هستم و همچنین به عنوان مهندس صدا فعالیت می‌کنم.',
  bioEn: 'I am Kianour Partovi; guitarist, singer, composer, arranger, and music producer with over 20 years of professional experience. Throughout my career, I have bridged the orchestral world and modern pop/jazz, creating works that are both technically rich and emotionally touching. I hold a Bachelor of Music degree from Tehran Conservatory of Music, a Master of Music degree in Applied Composition from Tehran Faculty of Music, and work as a professional sound engineer.',
  philosophy: 'نگاه من خلق آثار ماندگار است. موسیقی برای من صرفاً صدایی برای شنیدن نیست، بلکه روایتی عمیق از تجربه‌های انسانی، احساسات گم‌شده و نوستالژی‌های شیرین است که در کالبد نت‌ها جان می‌گیرد.',
  philosophyEn: 'My vision is to create everlasting works. For me, music is not just sound to hear, but a deep narrative of human experiences, lost emotions, and sweet nostalgia coming alive within the notes.',
  styles: [
    { 
      name: 'Jazz & Smooth Jazz', 
      nameEn: 'Jazz & Smooth Jazz',
      desc: 'تلفیق هارمونی‌های غنی جز با ریتم‌های آرامش‌بخش و تکنیک‌های بداهه‌نوازی روی گیتار الکتریک و آکوستیک.',
      descEn: 'Blending rich jazz harmonies with soothing rhythms and improvisational guitar techniques on electric and acoustic guitars.'
    },
    { 
      name: 'Soul & RnB', 
      nameEn: 'Soul & RnB',
      desc: 'احساسات عمیق، ریتم‌های گیرا و ملودی‌های آوازی که مستقیماً با روح شنونده ارتباط برقرار می‌کنند.',
      descEn: 'Deep emotions, catchy rhythms, and vocal melodies that connect directly with the listener\'s soul.'
    },
    { 
      name: 'Funk & Groove', 
      nameEn: 'Funk & Groove',
      desc: 'بیس‌لاین‌های پرانرژی، ریتم‌های مقطع گیتار و جادوی ریتم که هر شنونده‌ای را به حرکت وامی‌دارد.',
      descEn: 'Energetic basslines, syncopated guitar grooves, and rhythm magic that moves every listener.'
    },
    { 
      name: 'Pop Fusion', 
      nameEn: 'Pop Fusion',
      desc: 'نگاه ویژه به موسیقی پاپ اصیل و مدرن با تنظیم‌های ارکسترال و استفاده از المان‌های نوستالژیک موسیقی ایران.',
      descEn: 'A dedicated approach to authentic and modern pop with orchestral arrangements and elements of nostalgic Persian music.'
    }
  ],
  education: [
    { 
      degree: 'کارشناسی ارشد آهنگسازی کاربردی', 
      degreeEn: 'Master of Music in Applied Composition',
      school: 'دانشکده موسیقی تهران', 
      schoolEn: 'Tehran Faculty of Music',
      year: '۱۳۹۲',
      yearEn: '2013'
    },
    { 
      degree: 'کارشناسی نوازندگی موسیقی جهانی', 
      degreeEn: 'Bachelor of Music in Global Instruments',
      school: 'کنسرواتوار موسیقی تهران', 
      schoolEn: 'Tehran Conservatory of Music',
      year: '۱۳۸۸',
      yearEn: '2009'
    },
    { 
      degree: 'دوره تخصصی مهندسی صدا و میکس و مسترینگ', 
      degreeEn: 'Specialized Sound Engineering & Mix/Mastering',
      school: 'آکادمی صدابرداری تهران', 
      schoolEn: 'Tehran Sound Recording Academy',
      year: '۱۳۹۰',
      yearEn: '2011'
    }
  ],
  avatar: './assets/images/kianour_profile_1783212521304.jpg',
  cover: './assets/images/album_cover_jazz_1783212533166.jpg'
};

export const tracks: Track[] = [
  {
    id: '1',
    title: 'باران پاییز',
    titleEn: 'Autumn Rain',
    genre: 'Smooth Jazz',
    duration: '05:12',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    coverUrl: './assets/images/album_cover_jazz_1783212533166.jpg',
    description: 'تلفیقی رویایی از صدای باران، گیتار جاز لید و پدهای مخملی که حس و حال شب‌های پایانی پاییز تهران را تداعی می‌کند.',
    descriptionEn: 'A dreamy fusion of falling rain, lead jazz guitar, and velvety pads, evoking the atmosphere of late autumn nights in Tehran.',
    year: '۱۴۰۲',
    instrument: 'گیتار الکتریک جاز و سینث‌سایزر',
    instrumentEn: 'Jazz Electric Guitar & Synthesizer'
  },
  {
    id: '2',
    title: 'خیال تهران',
    titleEn: 'Tehran Dream',
    genre: 'Soul & RnB',
    duration: '07:05',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    coverUrl: './assets/images/album_cover_jazz_1783212533166.jpg',
    description: 'ملودی آوازی بسیار عمیق همراه با بیس سنگین و آکوردهای نوستالژیک که پلی بین خاطرات گذشته و شلوغی‌های امروز تهران است.',
    descriptionEn: 'A deep vocal melody accompanied by heavy bass and nostalgic chords, creating a bridge between past memories and the bustle of today\'s Tehran.',
    year: '۱۴۰۱',
    instrument: 'آواز، گیتار نایلون و ارکستر زهی',
    instrumentEn: 'Vocals, Nylon Guitar & String Orchestra'
  },
  {
    id: '3',
    title: 'غروب کوچه باغ',
    titleEn: 'Alley Sunset',
    genre: 'Jazz Fusion',
    duration: '05:44',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    coverUrl: './assets/images/album_cover_jazz_1783212533166.jpg',
    description: 'قطعه‌ای ریتمیک و جذاب با الهام از ملودی‌های فولکلور ایرانی در بستر جاز و فانک، اثری غنی از سازهای بادی و سولوی شنیدنی گیتار.',
    descriptionEn: 'A rhythmic and catchy piece inspired by Iranian folk melodies in a jazz and funk context, rich in wind instruments and beautiful guitar solo.',
    year: '۱۳۹۹',
    instrument: 'گیتار الکتریک، ترومپت و ساکسیفون',
    instrumentEn: 'Electric Guitar, Trumpet & Saxophone'
  },
  {
    id: '4',
    title: 'شوق پرواز',
    titleEn: 'Flight of Desire',
    genre: 'Funk & Groove',
    duration: '05:02',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    coverUrl: './assets/images/album_cover_jazz_1783212533166.jpg',
    description: 'قطعه‌ای سرشار از ریتم، انرژی بالا و ریتم‌های مقطع گیتار الکتریک که حس رهایی و شور و هیجان نوازندگی زنده را منتقل می‌کند.',
    descriptionEn: 'A piece full of rhythm, high energy, and syncopated electric guitar riffs that transmit the feeling of freedom and excitement of live playing.',
    year: '۱۴۰۰',
    instrument: 'گیتار الکتریک فندر استراتوکستر، درامز و بیس',
    instrumentEn: 'Fender Stratocaster Electric Guitar, Drums & Bass'
  }
];

export const achievements: Achievement[] = [
  {
    year: '۱۴۰۲',
    yearEn: '2023',
    title: 'کنسرت بزرگ ارکسترال جاز-پاپ تهران',
    titleEn: 'Grand Tehran Jazz-Pop Orchestral Concert',
    description: 'رهبری ارکستر، نوازندگی گیتار لید و آهنگسازی رپرتوار ارکسترال جاز پاپ با حضور بیش از ۳۰ نوازنده در تالار وحدت.',
    descriptionEn: 'Orchestra conducting, lead guitar performance, and composing an orchestral jazz-pop repertoire with over 30 musicians at Vahdat Hall.'
  },
  {
    year: '۱۳۹۹',
    yearEn: '2020',
    title: 'تندیس بهترین آلبوم موسیقی تلفیقی سال',
    titleEn: 'Best Fusion Music Album of the Year Statue',
    description: 'دریافت جایزه معتبر موسیقی کشور برای آلبوم «طنین باران پاییزی» به عنوان بهترین آهنگسازی و صدابرداری سال.',
    descriptionEn: 'Receiving the country\'s prestigious music award for the album "Autumn Rain Echoes" for best composition and audio engineering.'
  },
  {
    year: '۱۳۹۷',
    yearEn: '2018',
    title: 'تأسیس استودیو صدابرداری نوستالژیا',
    titleEn: 'Establishment of Nostalgia Recording Studio',
    description: 'راه‌اندازی یکی از مجهزترین استودیوهای آنالوگ برای ضبط آثار جاز و پاپ با رویکرد حفظ اصالت صداهای نوستالژیک دهه ۷۰ و ۸۰.',
    descriptionEn: 'Setting up one of the best-equipped analog studios for jazz and pop recording, with an approach to preserve the sound authenticity of the 70s and 80s.'
  },
  {
    year: '۱۳۹۴',
    yearEn: '2015',
    title: 'همکاری‌های خلاقانه بین‌المللی',
    titleEn: 'Creative International Collaborations',
    description: 'تولید و تنظیم بیش از ۵۰ تک‌آهنگ با هنرمندان سبک‌های مختلف در کشورهای خاورمیانه و اروپا با رویکرد فیوژن جاز-ایرانی.',
    descriptionEn: 'Producing and arranging over 50 singles with artists from different styles across Europe and the Middle East, with a focus on Persian-Jazz Fusion.'
  }
];
