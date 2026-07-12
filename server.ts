import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import multer from 'multer';
import mysql from 'mysql2/promise';

// ESM path helpers
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;

// Setup MySQL Connection Pool with graceful fallback
let dbPool: mysql.Pool | null = null;

if (process.env.DB_HOST && process.env.DB_NAME) {
  try {
    dbPool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: Number(process.env.DB_PORT || 3306),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 10000 // 10 seconds timeout
    });
    console.log('MySQL Connection Pool initialized.');
  } catch (err) {
    console.error('MySQL Connection Pool initialization failed:', err);
    dbPool = null;
  }
}

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

const DEFAULT_GALLERY = [
  {
    id: 'g-1',
    title: 'نوازندگی در استودیو نوستالژیا',
    titleEn: 'Playing at Nostalgia Studio',
    imageUrl: './assets/images/about_image_1_1783213310316.jpg',
    description: 'تمرین و صدابرداری قطعات جدید جاز در استودیوی شخصی با تجهیزات آنالوگ قدیمی.',
    descriptionEn: 'Rehearsing and recording new jazz tracks in the personal studio with vintage analog gear.',
    createdAt: '۱۴۰۲/۱۰/۱۲'
  },
  {
    id: 'g-2',
    title: 'اجرای زنده تور تهران',
    titleEn: 'Live Performance Tehran Tour',
    imageUrl: './assets/images/about_image_2_1783213319351.jpg',
    description: 'کنسرت دونوازی گیتار با همراهی ارکستر زهی در تالار وحدت تهران.',
    descriptionEn: 'Guitar duet concert accompanied by the string orchestra at Vahdat Hall, Tehran.',
    createdAt: '۱۴۰۲/۱۱/۰۵'
  },
  {
    id: 'g-3',
    title: 'تنظیم قطعه باران پاییز',
    titleEn: 'Arranging Autumn Rain',
    imageUrl: './assets/images/hero_image_1_1783213279475.jpg',
    description: 'پشت صحنه تولید و تنظیم قطعه باران پاییز با استفاده از سازهای آکوستیک و الکترونیک.',
    descriptionEn: 'Behind the scenes of producing and arranging Autumn Rain using acoustic and electronic instruments.',
    createdAt: '۱۴۰۲/۱۲/۰۲'
  }
];

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

  // Initialize MySQL tables if connection is available
  if (dbPool) {
    try {
      console.log('Testing MySQL database connection...');
      const connection = await dbPool.getConnection();
      console.log('Successfully connected to MySQL database!');
      
      // Create tables if not exist
      await connection.query(`
        CREATE TABLE IF NOT EXISTS tracks (
          id VARCHAR(100) PRIMARY KEY,
          title VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
          titleEn VARCHAR(255) NOT NULL,
          genre VARCHAR(100),
          duration VARCHAR(50),
          audioUrl VARCHAR(500) NOT NULL,
          coverUrl VARCHAR(500),
          description TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
          year VARCHAR(50),
          instrument VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      await connection.query(`
        CREATE TABLE IF NOT EXISTS messages (
          id VARCHAR(100) PRIMARY KEY,
          name VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
          email VARCHAR(255) NOT NULL,
          subject VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
          message TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
          createdAt VARCHAR(100)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      await connection.query(`
        CREATE TABLE IF NOT EXISTS bio (
          id INT PRIMARY KEY AUTO_INCREMENT,
          content TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      await connection.query(`
        CREATE TABLE IF NOT EXISTS settings (
          name VARCHAR(100) PRIMARY KEY,
          value TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      await connection.query(`
        CREATE TABLE IF NOT EXISTS gallery (
          id VARCHAR(100) PRIMARY KEY,
          title VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
          titleEn VARCHAR(255),
          imageUrl VARCHAR(500) NOT NULL,
          description TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
          descriptionEn TEXT,
          createdAt VARCHAR(100)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      // Seed default tracks if empty
      const [existingTracks]: any = await connection.query('SELECT COUNT(*) as count FROM tracks');
      if (existingTracks[0].count === 0) {
        for (const track of DEFAULT_TRACKS) {
          await connection.query(
            'INSERT INTO tracks (id, title, titleEn, genre, duration, audioUrl, coverUrl, description, year, instrument) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [track.id, track.title, track.titleEn, track.genre, track.duration, track.audioUrl, track.coverUrl, track.description, track.year, track.instrument]
          );
        }
        console.log('Default tracks seeded to MySQL.');
      }

      // Seed default messages if empty
      const [existingMessages]: any = await connection.query('SELECT COUNT(*) as count FROM messages');
      if (existingMessages[0].count === 0) {
        for (const msg of DEFAULT_MESSAGES) {
          await connection.query(
            'INSERT INTO messages (id, name, email, subject, message, createdAt) VALUES (?, ?, ?, ?, ?, ?)',
            [msg.id, msg.name, msg.email, msg.subject, msg.message, msg.createdAt]
          );
        }
        console.log('Default messages seeded to MySQL.');
      }

      // Seed default bio if empty
      const [existingBio]: any = await connection.query('SELECT COUNT(*) as count FROM bio');
      if (existingBio[0].count === 0) {
        await connection.query('INSERT INTO bio (content) VALUES (?)', [DEFAULT_BIO]);
        console.log('Default bio seeded to MySQL.');
      }

      // Seed default settings if empty
      const [existingSettings]: any = await connection.query('SELECT COUNT(*) as count FROM settings WHERE name = ?', ['colors']);
      if (existingSettings[0].count === 0) {
        await connection.query('INSERT INTO settings (name, value) VALUES (?, ?)', ['colors', '{}']);
        console.log('Default settings seeded to MySQL.');
      }

      // Seed default gallery if empty
      const [existingGallery]: any = await connection.query('SELECT COUNT(*) as count FROM gallery');
      if (existingGallery[0].count === 0) {
        for (const item of DEFAULT_GALLERY) {
          await connection.query(
            'INSERT INTO gallery (id, title, titleEn, imageUrl, description, descriptionEn, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [item.id, item.title, item.titleEn, item.imageUrl, item.description, item.descriptionEn, item.createdAt]
          );
        }
        console.log('Default gallery seeded to MySQL.');
      }

      connection.release();
    } catch (err) {
      console.error('MySQL database initialization failed, falling back to local JSON files:', err);
      dbPool = null; // Mark as null to fallback
    }
  }

  // Ensure directories exist
  const uploadsDir = path.join(process.cwd(), 'public/uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const tracksFile = path.join(uploadsDir, 'tracks.json');
  const messagesFile = path.join(uploadsDir, 'messages.json');
  const bioFile = path.join(uploadsDir, 'bio.txt');
  const settingsFile = path.join(uploadsDir, 'settings.json');
  const galleryFile = path.join(uploadsDir, 'gallery.json');

  // Initialize files with default data if not existing
  if (!fs.existsSync(tracksFile)) {
    fs.writeFileSync(tracksFile, JSON.stringify(DEFAULT_TRACKS, null, 2), 'utf8');
  }
  if (!fs.existsSync(galleryFile)) {
    fs.writeFileSync(galleryFile, JSON.stringify(DEFAULT_GALLERY, null, 2), 'utf8');
  }
  if (!fs.existsSync(messagesFile)) {
    fs.writeFileSync(messagesFile, JSON.stringify(DEFAULT_MESSAGES, null, 2), 'utf8');
  }
  if (!fs.existsSync(bioFile)) {
    fs.writeFileSync(bioFile, DEFAULT_BIO, 'utf8');
  }
  if (!fs.existsSync(settingsFile)) {
    fs.writeFileSync(settingsFile, '{}', 'utf8');
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
  app.get('/api/tracks', async (req, res) => {
    try {
      if (dbPool) {
        try {
          const [rows]: any = await dbPool.query('SELECT * FROM tracks');
          return res.json(rows);
        } catch (dbErr) {
          console.warn('MySQL GET tracks failed, falling back to local JSON:', dbErr);
        }
      }
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
  app.post('/api/tracks', async (req, res) => {
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

      if (dbPool) {
        try {
          await dbPool.query(
            'INSERT INTO tracks (id, title, titleEn, genre, duration, audioUrl, coverUrl, description, year, instrument) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [newTrack.id, newTrack.title, newTrack.titleEn, newTrack.genre, newTrack.duration, newTrack.audioUrl, newTrack.coverUrl, newTrack.description, newTrack.year, newTrack.instrument]
          );
          const [rows]: any = await dbPool.query('SELECT * FROM tracks');
          return res.json({ success: true, tracks: rows });
        } catch (dbErr) {
          console.warn('MySQL INSERT track failed, falling back to local JSON:', dbErr);
        }
      }

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
  app.delete('/api/tracks/:id', async (req, res) => {
    try {
      const { id } = req.params;
      let audioUrlToDelete = '';
      let coverUrlToDelete = '';

      if (dbPool) {
        try {
          const [rows]: any = await dbPool.query('SELECT audioUrl, coverUrl FROM tracks WHERE id = ?', [id]);
          if (rows.length > 0) {
            audioUrlToDelete = rows[0].audioUrl;
            coverUrlToDelete = rows[0].coverUrl;
          }
        } catch (dbErr) {
          console.warn('MySQL SELECT before delete failed, falling back to local JSON:', dbErr);
        }
      }
      
      if (!audioUrlToDelete && !coverUrlToDelete) {
        let tracks = [];
        if (fs.existsSync(tracksFile)) {
          tracks = JSON.parse(fs.readFileSync(tracksFile, 'utf8'));
        } else {
          tracks = [...DEFAULT_TRACKS];
        }
        const trackToDelete = tracks.find((t: any) => t.id === id);
        if (trackToDelete) {
          audioUrlToDelete = trackToDelete.audioUrl;
          coverUrlToDelete = trackToDelete.coverUrl;
        }
      }

      if (audioUrlToDelete && audioUrlToDelete.startsWith('/uploads/')) {
        const audioPath = path.join(process.cwd(), 'public', audioUrlToDelete);
        if (fs.existsSync(audioPath)) {
          try { fs.unlinkSync(audioPath); } catch (e) { console.error(e); }
        }
      }
      if (coverUrlToDelete && coverUrlToDelete.startsWith('/uploads/')) {
        const coverPath = path.join(process.cwd(), 'public', coverUrlToDelete);
        if (fs.existsSync(coverPath)) {
          try { fs.unlinkSync(coverPath); } catch (e) { console.error(e); }
        }
      }

      if (dbPool) {
        try {
          await dbPool.query('DELETE FROM tracks WHERE id = ?', [id]);
          const [rows]: any = await dbPool.query('SELECT * FROM tracks');
          return res.json({ success: true, tracks: rows });
        } catch (dbErr) {
          console.warn('MySQL DELETE track failed, falling back to local JSON:', dbErr);
        }
      }

      let tracks = [];
      if (fs.existsSync(tracksFile)) {
        tracks = JSON.parse(fs.readFileSync(tracksFile, 'utf8'));
      } else {
        tracks = [...DEFAULT_TRACKS];
      }

      tracks = tracks.filter((t: any) => t.id !== id);
      fs.writeFileSync(tracksFile, JSON.stringify(tracks, null, 2), 'utf8');
      res.json({ success: true, tracks });
    } catch (error) {
      console.error('Error deleting track:', error);
      res.status(500).json({ error: 'Failed to delete track' });
    }
  });

  // GET gallery
  app.get('/api/gallery', async (req, res) => {
    try {
      if (dbPool) {
        try {
          const [rows]: any = await dbPool.query('SELECT * FROM gallery');
          return res.json(rows);
        } catch (dbErr) {
          console.warn('MySQL GET gallery failed, falling back to local JSON:', dbErr);
        }
      }
      if (fs.existsSync(galleryFile)) {
        const data = fs.readFileSync(galleryFile, 'utf8');
        return res.json(JSON.parse(data));
      }
      res.json(DEFAULT_GALLERY);
    } catch (e) {
      console.error(e);
      res.json(DEFAULT_GALLERY);
    }
  });

  // POST gallery (Add)
  app.post('/api/gallery', async (req, res) => {
    try {
      const { title, titleEn, imageUrl, description, descriptionEn } = req.body;

      if (!imageUrl) {
        return res.status(400).json({ error: 'Image is required' });
      }

      let savedImageUrl = imageUrl;
      if (imageUrl.startsWith('data:')) {
        const saved = saveBase64File(imageUrl, 'gallery_item', 'jpg');
        if (saved) savedImageUrl = saved;
      }

      const newGalleryItem = {
        id: `g-custom-${Date.now()}`,
        title: title ? title.trim() : 'تصویر جدید',
        titleEn: titleEn ? titleEn.trim() : 'New Image',
        imageUrl: savedImageUrl,
        description: description ? description.trim() : '',
        descriptionEn: descriptionEn ? descriptionEn.trim() : '',
        createdAt: new Intl.DateTimeFormat('fa-IR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        }).format(new Date())
      };

      if (dbPool) {
        try {
          await dbPool.query(
            'INSERT INTO gallery (id, title, titleEn, imageUrl, description, descriptionEn, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [newGalleryItem.id, newGalleryItem.title, newGalleryItem.titleEn, newGalleryItem.imageUrl, newGalleryItem.description, newGalleryItem.descriptionEn, newGalleryItem.createdAt]
          );
          const [rows]: any = await dbPool.query('SELECT * FROM gallery');
          return res.json({ success: true, gallery: rows });
        } catch (dbErr) {
          console.warn('MySQL INSERT gallery failed, falling back to local JSON:', dbErr);
        }
      }

      let gallery = [];
      if (fs.existsSync(galleryFile)) {
        gallery = JSON.parse(fs.readFileSync(galleryFile, 'utf8'));
      } else {
        gallery = [...DEFAULT_GALLERY];
      }

      gallery.push(newGalleryItem);
      fs.writeFileSync(galleryFile, JSON.stringify(gallery, null, 2), 'utf8');
      res.json({ success: true, gallery });
    } catch (error) {
      console.error('Error adding gallery item:', error);
      res.status(500).json({ error: 'Failed to add gallery item' });
    }
  });

  // DELETE gallery
  app.delete('/api/gallery/:id', async (req, res) => {
    try {
      const { id } = req.params;
      let imageUrlToDelete = '';

      if (dbPool) {
        try {
          const [rows]: any = await dbPool.query('SELECT imageUrl FROM gallery WHERE id = ?', [id]);
          if (rows.length > 0) {
            imageUrlToDelete = rows[0].imageUrl;
          }
        } catch (dbErr) {
          console.warn('MySQL SELECT before delete failed, falling back to local JSON:', dbErr);
        }
      }
      
      if (!imageUrlToDelete) {
        let gallery = [];
        if (fs.existsSync(galleryFile)) {
          gallery = JSON.parse(fs.readFileSync(galleryFile, 'utf8'));
        } else {
          gallery = [...DEFAULT_GALLERY];
        }
        const itemToDelete = gallery.find((g: any) => g.id === id);
        if (itemToDelete) {
          imageUrlToDelete = itemToDelete.imageUrl;
        }
      }

      if (imageUrlToDelete && imageUrlToDelete.startsWith('/uploads/')) {
        const imagePath = path.join(process.cwd(), 'public', imageUrlToDelete);
        if (fs.existsSync(imagePath)) {
          try { fs.unlinkSync(imagePath); } catch (e) { console.error(e); }
        }
      }

      if (dbPool) {
        try {
          await dbPool.query('DELETE FROM gallery WHERE id = ?', [id]);
          const [rows]: any = await dbPool.query('SELECT * FROM gallery');
          return res.json({ success: true, gallery: rows });
        } catch (dbErr) {
          console.warn('MySQL DELETE gallery failed, falling back to local JSON:', dbErr);
        }
      }

      let gallery = [];
      if (fs.existsSync(galleryFile)) {
        gallery = JSON.parse(fs.readFileSync(galleryFile, 'utf8'));
      } else {
        gallery = [...DEFAULT_GALLERY];
      }

      gallery = gallery.filter((g: any) => g.id !== id);
      fs.writeFileSync(galleryFile, JSON.stringify(gallery, null, 2), 'utf8');
      res.json({ success: true, gallery });
    } catch (error) {
      console.error('Error deleting gallery item:', error);
      res.status(500).json({ error: 'Failed to delete gallery item' });
    }
  });

  // GET bio
  app.get('/api/bio', async (req, res) => {
    try {
      if (dbPool) {
        try {
          const [rows]: any = await dbPool.query('SELECT content FROM bio LIMIT 1');
          if (rows.length > 0) {
            return res.json({ bio: rows[0].content });
          }
        } catch (dbErr) {
          console.warn('MySQL GET bio failed, falling back to local JSON:', dbErr);
        }
      }
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
  app.post('/api/bio', async (req, res) => {
    try {
      const { bio } = req.body;
      if (typeof bio !== 'string') {
        return res.status(400).json({ error: 'Bio must be a string' });
      }

      if (dbPool) {
        try {
          await dbPool.query('UPDATE bio SET content = ?', [bio]);
          return res.json({ success: true, bio });
        } catch (dbErr) {
          console.warn('MySQL UPDATE bio failed, falling back to local JSON:', dbErr);
        }
      }

      fs.writeFileSync(bioFile, bio, 'utf8');
      res.json({ success: true, bio });
    } catch (error) {
      res.status(500).json({ error: 'Failed to save bio' });
    }
  });

  // GET settings
  app.get('/api/settings', async (req, res) => {
    try {
      if (dbPool) {
        try {
          const [rows]: any = await dbPool.query('SELECT name, value FROM settings');
          const settingsObj: any = { colors: {}, content: {} };
          for (const row of rows) {
            try {
              settingsObj[row.name] = JSON.parse(row.value);
            } catch (je) {
              settingsObj[row.name] = row.value;
            }
          }
          return res.json(settingsObj);
        } catch (dbErr) {
          console.warn('MySQL GET settings failed, falling back to local JSON:', dbErr);
        }
      }
      if (fs.existsSync(settingsFile)) {
        const data = fs.readFileSync(settingsFile, 'utf8');
        try {
          const parsed = JSON.parse(data);
          return res.json(parsed.colors ? parsed : { colors: parsed, content: {} });
        } catch (je) {
          return res.json({ colors: {}, content: {} });
        }
      }
      res.json({ colors: {}, content: {} });
    } catch (e) {
      res.json({ colors: {}, content: {} });
    }
  });

  // POST settings
  app.post('/api/settings', async (req, res) => {
    try {
      const { colors, content } = req.body;
      
      if (dbPool) {
        try {
          if (colors) {
            const colorsJson = JSON.stringify(colors);
            await dbPool.query('INSERT INTO settings (name, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value = ?', ['colors', colorsJson, colorsJson]);
          }
          if (content) {
            const contentJson = JSON.stringify(content);
            await dbPool.query('INSERT INTO settings (name, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value = ?', ['content', contentJson, contentJson]);
          }
          
          // Return full settings
          const [rows]: any = await dbPool.query('SELECT name, value FROM settings');
          const settingsObj: any = { colors: {}, content: {} };
          for (const row of rows) {
            try {
              settingsObj[row.name] = JSON.parse(row.value);
            } catch (je) {
              settingsObj[row.name] = row.value;
            }
          }
          return res.json({ success: true, ...settingsObj });
        } catch (dbErr) {
          console.warn('MySQL UPDATE settings failed, falling back to local JSON:', dbErr);
        }
      }

      let localSettings: any = { colors: {}, content: {} };
      if (fs.existsSync(settingsFile)) {
        try {
          const fileData = fs.readFileSync(settingsFile, 'utf8');
          const parsed = JSON.parse(fileData);
          localSettings = parsed.colors ? parsed : { colors: parsed, content: {} };
        } catch (je) {
          console.error(je);
        }
      }
      if (colors) localSettings.colors = colors;
      if (content) localSettings.content = content;

      fs.writeFileSync(settingsFile, JSON.stringify(localSettings, null, 2), 'utf8');
      res.json({ success: true, ...localSettings });
    } catch (error) {
      res.status(500).json({ error: 'Failed to save settings' });
    }
  });

  // GET messages
  app.get('/api/messages', async (req, res) => {
    try {
      if (dbPool) {
        try {
          const [rows]: any = await dbPool.query('SELECT * FROM messages ORDER BY id DESC');
          return res.json(rows);
        } catch (dbErr) {
          console.warn('MySQL GET messages failed, falling back to local JSON:', dbErr);
        }
      }
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
  app.post('/api/messages', async (req, res) => {
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

      if (dbPool) {
        try {
          await dbPool.query(
            'INSERT INTO messages (id, name, email, subject, message, createdAt) VALUES (?, ?, ?, ?, ?, ?)',
            [newMessage.id, newMessage.name, newMessage.email, newMessage.subject, newMessage.message, newMessage.createdAt]
          );
          const [rows]: any = await dbPool.query('SELECT * FROM messages ORDER BY id DESC');
          return res.json({ success: true, messages: rows });
        } catch (dbErr) {
          console.warn('MySQL INSERT message failed, falling back to local JSON:', dbErr);
        }
      }

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
  app.delete('/api/messages/:id', async (req, res) => {
    try {
      const { id } = req.params;

      if (dbPool) {
        try {
          await dbPool.query('DELETE FROM messages WHERE id = ?', [id]);
          const [rows]: any = await dbPool.query('SELECT * FROM messages ORDER BY id DESC');
          return res.json({ success: true, messages: rows });
        } catch (dbErr) {
          console.warn('MySQL DELETE message failed, falling back to local JSON:', dbErr);
        }
      }

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
