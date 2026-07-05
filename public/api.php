<?php
/**
 * Kianour Music - PHP & MySQL API Bridge (api.php)
 * ----------------------------------------------------
 * راهنمای فارسی برای نصب روی هاست سی‌پنل (cPanel):
 * ۱. این فایل را در پوشه اصلی وب‌سایت خود آپلود کنید (معمولاً public_html).
 * ۲. اطلاعات اتصال به دیتابیس را در بخش تنظیمات دیتابیس زیر وارد کنید.
 * ۳. جداول دیتابیس در اولین فراخوانی این اسکریپت به صورت خودکار ساخته خواهند شد.
 * ۴. مطمئن شوید که دسترسی‌های فایل (File Permissions) روی 644 تنظیم شده باشد.
 */

// --- ۱. تنظیم هدرهای CORS و فرمت خروجی ---
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=utf-8");

// مدیریت درخواست‌های مقدماتی (Preflight Requests)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// --- ۲. تنظیمات اتصال به دیتابیس مای‌اس‌کیو‌ال ---
define('DB_HOST', 'localhost');
define('DB_USER', 'easydri1_crm'); // نام کاربری دیتابیس شما
define('DB_PASS', '09386561626mM@'); // رمز عبور دیتابیس شما
define('DB_NAME', 'easydri1_crm'); // نام دیتابیس شما
define('DB_PORT', 3306);

// خاموش کردن نمایش خطاهای پیش‌فرض پی‌اچ‌پی برای عدم تداخل با فرمت JSON
error_reporting(0);
ini_set('display_errors', 0);

// تابع کمکی برای بازگرداندن پاسخ خطا به فرمت JSON
function send_error($message, $code = 500) {
    http_response_code($code);
    echo json_encode([
        "success" => false,
        "error" => $message
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit();
}

// تابع کمکی برای بازگرداندن پاسخ موفقیت‌آمیز به فرمت JSON
function send_success($data = []) {
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit();
}

// --- ۳. ایجاد اتصال به دیتابیس ---
try {
    $mysqli = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT);
    
    if ($mysqli->connect_error) {
        send_error("اتصال به دیتابیس ناموفق بود: " . $mysqli->connect_error);
    }
    
    // تنظیم یونیکد برای پشتیبانی کامل از حروف فارسی و کاراکترهای خاص
    $mysqli->set_charset("utf8mb4");
} catch (Exception $e) {
    send_error("خطای سیستمی دیتابیس: " . $e->getMessage());
}

// --- ۴. ساخت خودکار جداول بر اساس مدل‌های پروژه (در صورت عدم وجود) ---
$createTablesQueries = [
    "tracks" => "CREATE TABLE IF NOT EXISTS tracks (
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
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;",

    "messages" => "CREATE TABLE IF NOT EXISTS messages (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
        email VARCHAR(255) NOT NULL,
        subject VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
        message TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
        createdAt VARCHAR(100)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;",

    "bio" => "CREATE TABLE IF NOT EXISTS bio (
        id INT PRIMARY KEY AUTO_INCREMENT,
        content TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;"
];

foreach ($createTablesQueries as $tableName => $sqlQuery) {
    if (!$mysqli->query($sqlQuery)) {
        send_error("خطا در ایجاد جدول $tableName: " . $mysqli->error);
    }
}

// مقداردهی اولیه بیوگرافی پیش‌فرض در اولین اجرا
$checkBio = $mysqli->query("SELECT COUNT(*) as count FROM bio");
$bioCount = $checkBio->fetch_assoc();
if ($bioCount['count'] == 0) {
    $defaultBio = "من کیانور پرتوی هستم؛ نوازنده گیتار، خواننده، آهنگساز، تنظیم‌کننده و تهیه‌کننده موسیقی با بیش از ۲۰ سال سابقه حرفه‌ای. در طول فعالیتم، بین دنیای ارکستر و فضای مدرن موسیقی پاپ و جز پل زده‌ام تا آثاری خلق کنم که هم از نظر فنی غنی باشند و هم از نظر احساسی تأثیرگذار. دارای مدرک کارشناسی موسیقی از دانشگاه موسیقی کنسرواتوار تهران و کارشناسی ارشد آهنگسازی کاربردی از دانشکده موسیقی تهران هستم و همچنین به عنوان مهندس صدا فعالیت می‌کنم.";
    $stmt = $mysqli->prepare("INSERT INTO bio (content) VALUES (?)");
    $stmt->bind_param("s", $defaultBio);
    $stmt->execute();
    $stmt->close();
}

// --- ۵. مسیریابی درخواست‌ها بر اساس اکشن ---
$action = isset($_GET['action']) ? $_GET['action'] : '';

switch ($action) {
    
    // الف. بررسی وضعیت سرویس و ارتباط با دیتابیس
    case 'status':
        send_success([
            "status" => "online",
            "message" => "اتصال دیتابیس مای‌اس‌کیو‌ال با موفقیت برقرار است.",
            "database" => DB_NAME,
            "version" => "1.4.0"
        ]);
        break;

    // ب. دریافت آثار صوتی (Tracks)
    case 'tracks':
        if ($_SERVER['REQUEST_METHOD'] == 'GET') {
            $result = $mysqli->query("SELECT * FROM tracks ORDER BY id DESC");
            $tracks = [];
            while ($row = $result->fetch_assoc()) {
                $tracks[] = $row;
            }
            send_success($tracks);
        } 
        elseif ($_SERVER['REQUEST_METHOD'] == 'POST') {
            // افزودن قطعه جدید
            $input = json_decode(file_get_contents("php://input"), true);
            if (!$input) {
                send_error("اطلاعات ارسالی نامعتبر است.");
            }
            
            $id = isset($input['id']) ? $input['id'] : 'custom-' . round(microtime(true) * 1000);
            $title = isset($input['title']) ? trim($input['title']) : '';
            $titleEn = isset($input['titleEn']) ? trim($input['titleEn']) : 'Custom Track';
            $genre = isset($input['genre']) ? trim($input['genre']) : 'Smooth Jazz';
            $duration = isset($input['duration']) ? trim($input['duration']) : '03:00';
            $audioUrl = isset($input['audioUrl']) ? trim($input['audioUrl']) : '';
            $coverUrl = isset($input['coverUrl']) ? trim($input['coverUrl']) : '';
            $description = isset($input['description']) ? trim($input['description']) : 'قطعه اختصاصی';
            $year = isset($input['year']) ? trim($input['year']) : '۱۴۰۳';
            $instrument = isset($input['instrument']) ? trim($input['instrument']) : 'گیتار';

            if (empty($title) || empty($audioUrl)) {
                send_error("عنوان اثر و فایل صوتی اجباری هستند.");
            }

            $stmt = $mysqli->prepare("INSERT INTO tracks (id, title, titleEn, genre, duration, audioUrl, coverUrl, description, year, instrument) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->bind_param("ssssssssss", $id, $title, $titleEn, $genre, $duration, $audioUrl, $coverUrl, $description, $year, $instrument);
            
            if ($stmt->execute()) {
                $stmt->close();
                // کل قطعات را به روز شده برمی‌گردانیم
                $result = $mysqli->query("SELECT * FROM tracks ORDER BY id DESC");
                $tracks = [];
                while ($row = $result->fetch_assoc()) {
                    $tracks[] = $row;
                }
                send_success(["success" => true, "tracks" => $tracks]);
            } else {
                send_error("خطا در ثبت موزیک: " . $stmt->error);
            }
        }
        break;

    // ج. حذف قطعه موسیقی بر اساس ID
    case 'delete_track':
        if ($_SERVER['REQUEST_METHOD'] == 'DELETE' || isset($_GET['id'])) {
            $id = isset($_GET['id']) ? $_GET['id'] : '';
            if (empty($id)) {
                // تلاش برای خواندن بدنه جیسون
                $input = json_decode(file_get_contents("php://input"), true);
                $id = isset($input['id']) ? $input['id'] : '';
            }

            if (empty($id)) {
                send_error("شناسه قطعه جهت حذف ارسال نشده است.");
            }

            // ابتدا فایل‌های صوتی و کاور مربوطه را پیدا کرده و حذف می‌کنیم
            $audioUrl = '';
            $coverUrl = '';
            $selectStmt = $mysqli->prepare("SELECT audioUrl, coverUrl FROM tracks WHERE id = ?");
            $selectStmt->bind_param("s", $id);
            $selectStmt->execute();
            $selectResult = $selectStmt->get_result();
            if ($row = $selectResult->fetch_assoc()) {
                $audioUrl = $row['audioUrl'];
                $coverUrl = $row['coverUrl'];
            }
            $selectStmt->close();

            // حذف فیزیکی فایل صوتی
            if (!empty($audioUrl)) {
                $cleanPath = ltrim(str_replace('./', '', $audioUrl), '/');
                if (strpos($cleanPath, 'uploads/') === 0) {
                    $physicalPath = __DIR__ . '/' . $cleanPath;
                    if (file_exists($physicalPath)) {
                        @unlink($physicalPath);
                    }
                }
            }

            // حذف فیزیکی کاور
            if (!empty($coverUrl)) {
                $cleanPath = ltrim(str_replace('./', '', $coverUrl), '/');
                if (strpos($cleanPath, 'uploads/') === 0) {
                    $physicalPath = __DIR__ . '/' . $cleanPath;
                    if (file_exists($physicalPath)) {
                        @unlink($physicalPath);
                    }
                }
            }

            $stmt = $mysqli->prepare("DELETE FROM tracks WHERE id = ?");
            $stmt->bind_param("s", $id);
            
            if ($stmt->execute()) {
                $stmt->close();
                // لیست بروزشده آثار
                $result = $mysqli->query("SELECT * FROM tracks ORDER BY id DESC");
                $tracks = [];
                while ($row = $result->fetch_assoc()) {
                    $tracks[] = $row;
                }
                send_success(["success" => true, "tracks" => $tracks]);
            } else {
                send_error("خطا در حذف موزیک: " . $stmt->error);
            }
        }
        break;

    // د. مدیریت بیوگرافی (Bio)
    case 'bio':
        if ($_SERVER['REQUEST_METHOD'] == 'GET') {
            $result = $mysqli->query("SELECT content FROM bio LIMIT 1");
            $row = $result->fetch_assoc();
            send_success(["bio" => $row ? $row['content'] : '']);
        } 
        elseif ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $input = json_decode(file_get_contents("php://input"), true);
            $bio = isset($input['bio']) ? $input['bio'] : '';

            $stmt = $mysqli->prepare("UPDATE bio SET content = ?");
            $stmt->bind_param("s", $bio);
            
            if ($stmt->execute()) {
                $stmt->close();
                send_success(["success" => true, "bio" => $bio]);
            } else {
                send_error("خطا در ویرایش بیوگرافی: " . $stmt->error);
            }
        }
        break;

    // ه. مدیریت پیام‌های تماس (Messages)
    case 'messages':
        if ($_SERVER['REQUEST_METHOD'] == 'GET') {
            $result = $mysqli->query("SELECT * FROM messages ORDER BY id DESC");
            $messages = [];
            while ($row = $result->fetch_assoc()) {
                $messages[] = $row;
            }
            send_success($messages);
        } 
        elseif ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $input = json_decode(file_get_contents("php://input"), true);
            if (!$input) {
                send_error("اطلاعات ارسالی معتبر نیست.");
            }

            $id = 'msg-' . round(microtime(true) * 1000);
            $name = isset($input['name']) ? trim($input['name']) : '';
            $email = isset($input['email']) ? trim($input['email']) : '';
            $subject = isset($input['subject']) ? trim($input['subject']) : 'بدون موضوع';
            $message = isset($input['message']) ? trim($input['message']) : '';
            $createdAt = isset($input['createdAt']) ? trim($input['createdAt']) : date("Y-m-d H:i:s");

            if (empty($name) || empty($email) || empty($message)) {
                send_error("نام، ایمیل و متن پیام الزامی هستند.");
            }

            $stmt = $mysqli->prepare("INSERT INTO messages (id, name, email, subject, message, createdAt) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->bind_param("ssssss", $id, $name, $email, $subject, $message, $createdAt);
            
            if ($stmt->execute()) {
                $stmt->close();
                // پیام‌های به‌روزشده
                $result = $mysqli->query("SELECT * FROM messages ORDER BY id DESC");
                $messages = [];
                while ($row = $result->fetch_assoc()) {
                    $messages[] = $row;
                }
                send_success(["success" => true, "messages" => $messages]);
            } else {
                send_error("خطا در ثبت پیام: " . $stmt->error);
            }
        }
        break;

    // و. حذف پیام تماس بر اساس ID
    case 'delete_message':
        if ($_SERVER['REQUEST_METHOD'] == 'DELETE' || isset($_GET['id'])) {
            $id = isset($_GET['id']) ? $_GET['id'] : '';
            if (empty($id)) {
                $input = json_decode(file_get_contents("php://input"), true);
                $id = isset($input['id']) ? $input['id'] : '';
            }

            if (empty($id)) {
                send_error("شناسه پیام جهت حذف ارسال نشده است.");
            }

            $stmt = $mysqli->prepare("DELETE FROM messages WHERE id = ?");
            $stmt->bind_param("s", $id);
            
            if ($stmt->execute()) {
                $stmt->close();
                // پیام‌های به‌روزشده
                $result = $mysqli->query("SELECT * FROM messages ORDER BY id DESC");
                $messages = [];
                while ($row = $result->fetch_assoc()) {
                    $messages[] = $row;
                }
                send_success(["success" => true, "messages" => $messages]);
            } else {
                send_error("خطا در حذف پیام: " . $stmt->error);
            }
        }
        break;

    // ز. بارگذاری فایل صوتی یا تصویر روی سرور (Upload)
    case 'upload':
        if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_FILES['file'])) {
            $file = $_FILES['file'];
            
            // بررسی خطاهای آپلود
            if ($file['error'] !== UPLOAD_ERR_OK) {
                send_error("خطا در آپلود فایل: " . $file['error']);
            }
            
            // ایجاد پوشه uploads در صورت عدم وجود
            $uploadsDir = __DIR__ . '/uploads';
            if (!file_exists($uploadsDir)) {
                mkdir($uploadsDir, 0755, true);
            }
            
            $fileExtension = pathinfo($file['name'], PATHINFO_EXTENSION);
            if (empty($fileExtension)) {
                // تعیین پسوند بر اساس نوع فایل
                if (strpos($file['type'], 'audio/') !== false) {
                    $fileExtension = 'mp3';
                } else if (strpos($file['type'], 'image/') !== false) {
                    $fileExtension = 'jpg';
                } else {
                    $fileExtension = 'bin';
                }
            }
            
            $uniqueName = 'file-' . round(microtime(true) * 1000) . '-' . rand(1000, 9999) . '.' . $fileExtension;
            $destination = $uploadsDir . '/' . $uniqueName;
            
            if (move_uploaded_file($file['tmp_name'], $destination)) {
                $publicUrl = '/uploads/' . $uniqueName; // استفاده از مسیر نسبی با پیشوند اسلش برای سازگاری کامل
                send_success(["success" => true, "url" => $publicUrl]);
            } else {
                send_error("امکان ذخیره فایل در سرور وجود ندارد. دسترسی پوشه uploads را بررسی کنید.");
            }
        } else {
            send_error("فایلی ارسال نشده است یا متد نامعتبر است.", 400);
        }
        break;

    default:
        send_error("اکشن درخواستی معتبر نیست یا تعریف نشده است.", 400);
        break;
}

$mysqli->close();
?>
