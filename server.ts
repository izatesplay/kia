import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import multer from 'multer';

// ESM path helpers
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(process.cwd(), 'public/uploads');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.mp3';
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 150 * 1024 * 1024 } // 150MB limit
});

// Default tracks matching src/data.ts exactly
const DEFAULT_TRACKS = [
  {
    id: '1',
    title: 'باران پاییز',
    titleEn: 'Autumn Rain',
    genre: 'Smooth Jazz',
    duration: '05:12',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    coverUrl: './assets/images/album_cover_jazz_1783212533166.jpg',
    description: 'تلفیقی رویایی از صدای باران، گیتار جاز لید و پدهای مخملی که حس و حال شب‌های پایانی پاییز تهران را تداعی می‌کند.',
    year: '۱۴۰۲',
    instrument: 'گیتار الکتریک جاز و سینث‌سایزر'
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
    year: '۱۴۰۱',
    instrument: 'آواز، گیتار نایلون و ارکستر زهی'
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
    year: '۱۴۰۳',
    instrument: 'گیتار الکتریک، ترومپت و ساکسیفون'
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
    year: '۱۴۰۰',
    instrument: 'گیتار الکتریک فندر استراتوکستر، درامز و بیس'
  }
];

const DEFAULT_MESSAGES = [
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

const DEFAULT_BIO = 'من کیانور پرتوی هستم؛ نوازنده گیتار، خواننده، آهنگساز، تنظیم‌کننده و تهیه‌کننده موسیقی با بیش از ۲۰ سال سابقه حرفه‌ای. در طول فعالیتم، بین دنیای ارکستر و فضای مدرن موسیقی پاپ و جز پل زده‌ام تا آثاری خلق کنم که هم از نظر فنی غنی باشند و هم از نظر احساسی تأثیرگذار. دارای مدرک کارشناسی موسیقی از دانشگاه موسیقی کنسرواتوار تهران و کارشناسی ارشد آهنگسازی کاربردی از دانشکده موسیقی تهران هستم و همچنین به عنوان مهندس صدا فعالیت می‌کنم.';

// Helper to save base64 data to file
function saveBase64File(base64DataUrl: string, prefix: string, extension: string): string | null {
  const matches = base64DataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    return null;
  }
  const buffer = Buffer.from(matches[2], 'base64');
  const filename = `${prefix}-${Date.now()}.${extension}`;
  const filepath = path.join(process.cwd(), 'public/uploads', filename);
  
  // Ensure uploads directory exists
  const uploadsDir = path.join(process.cwd(), 'public/uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  
  fs.writeFileSync(filepath, buffer);
  return `/uploads/${filename}`;
}

async function startServer() {
  const app = express();

  // Parse large JSON payloads for base64 uploads
  app.use(express.json({ limit: '100mb' }));
  app.use(express.urlencoded({ limit: '100mb', extended: true }));

  // Ensure directories exist
  const uploadsDir = path.join(process.cwd(), 'public/uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const tracksFile = path.join(uploadsDir, 'tracks.json');
  const messagesFile = path.join(uploadsDir, 'messages.json');
  const bioFile = path.join(uploadsDir, 'bio.txt');

  // Initialize files with default data if not existing
  if (!fs.existsSync(tracksFile)) {
    fs.writeFileSync(tracksFile, JSON.stringify(DEFAULT_TRACKS, null, 2), 'utf8');
  }
  if (!fs.existsSync(messagesFile)) {
    fs.writeFileSync(messagesFile, JSON.stringify(DEFAULT_MESSAGES, null, 2), 'utf8');
  }
  if (!fs.existsSync(bioFile)) {
    fs.writeFileSync(bioFile, DEFAULT_BIO, 'utf8');
  }

  // Serve static uploaded files in both dev and prod
  app.use('/uploads', express.static(uploadsDir));

  // --- API Routes ---

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Kianour Music Server is healthy' });
  });

  // POST upload file
  app.post('/api/upload', upload.single('file'), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      const publicUrl = `/uploads/${req.file.filename}`;
      res.json({ success: true, url: publicUrl });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: 'Failed to upload file' });
    }
  });

  // GET tracks
  app.get('/api/tracks', (req, res) => {
    try {
      if (fs.existsSync(tracksFile)) {
        const data = fs.readFileSync(tracksFile, 'utf8');
        return res.json(JSON.parse(data));
      }
      res.json(DEFAULT_TRACKS);
    } catch (e) {
      console.error(e);
      res.json(DEFAULT_TRACKS);
    }
  });

  // POST tracks (Add)
  app.post('/api/tracks', (req, res) => {
    try {
      const { title, titleEn, genre, duration, description, year, instrument, audioUrl, coverUrl } = req.body;

      if (!title || !audioUrl) {
        return res.status(400).json({ error: 'Title and audio are required' });
      }

      let savedAudioUrl = audioUrl;
      if (audioUrl.startsWith('data:')) {
        const saved = saveBase64File(audioUrl, 'track', 'mp3');
        if (saved) savedAudioUrl = saved;
      }

      let savedCoverUrl = coverUrl || './assets/images/album_cover_jazz_1783212533166.jpg';
      if (coverUrl && coverUrl.startsWith('data:')) {
        const saved = saveBase64File(coverUrl, 'cover', 'jpg');
        if (saved) savedCoverUrl = saved;
      }

      const newTrack = {
        id: `custom-${Date.now()}`,
        title: title.trim(),
        titleEn: titleEn ? titleEn.trim() : 'Custom Track',
        genre: genre || 'Smooth Jazz',
        duration: duration || '03:00',
        audioUrl: savedAudioUrl,
        coverUrl: savedCoverUrl,
        description: description ? description.trim() : 'قطعه اختصاصی آپلود شده توسط مدیر سایت',
        year: year ? year.trim() : '۱۴۰۳',
        instrument: instrument ? instrument.trim() : 'گیتار و سازهای سینث‌سایزر'
      };

      let tracks = [];
      if (fs.existsSync(tracksFile)) {
        tracks = JSON.parse(fs.readFileSync(tracksFile, 'utf8'));
      } else {
        tracks = [...DEFAULT_TRACKS];
      }

      tracks.push(newTrack);
      fs.writeFileSync(tracksFile, JSON.stringify(tracks, null, 2), 'utf8');
      res.json({ success: true, tracks });
    } catch (error) {
      console.error('Error adding track:', error);
      res.status(500).json({ error: 'Failed to add track' });
    }
  });

  // DELETE tracks
  app.delete('/api/tracks/:id', (req, res) => {
    try {
      const { id } = req.params;
      let tracks = [];
      if (fs.existsSync(tracksFile)) {
        tracks = JSON.parse(fs.readFileSync(tracksFile, 'utf8'));
      } else {
        tracks = [...DEFAULT_TRACKS];
      }

      const trackToDelete = tracks.find((t: any) => t.id === id);
      if (trackToDelete) {
        if (trackToDelete.audioUrl.startsWith('/uploads/')) {
          const audioPath = path.join(process.cwd(), 'public', trackToDelete.audioUrl);
          if (fs.existsSync(audioPath)) {
            try { fs.unlinkSync(audioPath); } catch (e) { console.error(e); }
          }
        }
        if (trackToDelete.coverUrl.startsWith('/uploads/')) {
          const coverPath = path.join(process.cwd(), 'public', trackToDelete.coverUrl);
          if (fs.existsSync(coverPath)) {
            try { fs.unlinkSync(coverPath); } catch (e) { console.error(e); }
          }
        }
      }

      tracks = tracks.filter((t: any) => t.id !== id);
      fs.writeFileSync(tracksFile, JSON.stringify(tracks, null, 2), 'utf8');
      res.json({ success: true, tracks });
    } catch (error) {
      console.error('Error deleting track:', error);
      res.status(500).json({ error: 'Failed to delete track' });
    }
  });

  // GET bio
  app.get('/api/bio', (req, res) => {
    try {
      if (fs.existsSync(bioFile)) {
        const bio = fs.readFileSync(bioFile, 'utf8');
        return res.json({ bio });
      }
      res.json({ bio: DEFAULT_BIO });
    } catch (e) {
      res.json({ bio: DEFAULT_BIO });
    }
  });

  // POST bio
  app.post('/api/bio', (req, res) => {
    try {
      const { bio } = req.body;
      if (typeof bio !== 'string') {
        return res.status(400).json({ error: 'Bio must be a string' });
      }
      fs.writeFileSync(bioFile, bio, 'utf8');
      res.json({ success: true, bio });
    } catch (error) {
      res.status(500).json({ error: 'Failed to save bio' });
    }
  });

  // GET messages
  app.get('/api/messages', (req, res) => {
    try {
      if (fs.existsSync(messagesFile)) {
        const data = fs.readFileSync(messagesFile, 'utf8');
        return res.json(JSON.parse(data));
      }
      res.json(DEFAULT_MESSAGES);
    } catch (e) {
      res.json(DEFAULT_MESSAGES);
    }
  });

  // POST messages (Add)
  app.post('/api/messages', (req, res) => {
    try {
      const { name, email, subject, message } = req.body;
      if (!name || !email || !message) {
        return res.status(400).json({ error: 'Name, email, and message are required' });
      }

      const newMessage = {
        id: `msg-${Date.now()}`,
        name: name.trim(),
        email: email.trim(),
        subject: subject ? subject.trim() : 'بدون موضوع',
        message: message.trim(),
        createdAt: new Intl.DateTimeFormat('fa-IR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }).format(new Date())
      };

      let messages = [];
      if (fs.existsSync(messagesFile)) {
        messages = JSON.parse(fs.readFileSync(messagesFile, 'utf8'));
      } else {
        messages = [...DEFAULT_MESSAGES];
      }

      messages.unshift(newMessage);
      fs.writeFileSync(messagesFile, JSON.stringify(messages, null, 2), 'utf8');
      res.json({ success: true, messages });
    } catch (error) {
      res.status(500).json({ error: 'Failed to add message' });
    }
  });

  // DELETE messages
  app.delete('/api/messages/:id', (req, res) => {
    try {
      const { id } = req.params;
      let messages = [];
      if (fs.existsSync(messagesFile)) {
        messages = JSON.parse(fs.readFileSync(messagesFile, 'utf8'));
      } else {
        messages = [...DEFAULT_MESSAGES];
      }

      messages = messages.filter((m: any) => m.id !== id);
      fs.writeFileSync(messagesFile, JSON.stringify(messages, null, 2), 'utf8');
      res.json({ success: true, messages });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete message' });
    }
  });

  // Serving the app
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
