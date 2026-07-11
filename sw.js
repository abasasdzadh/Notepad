// START OF FILE Notepad-main/sw.js

const CACHE_NAME = 'notepad-pwa-v1';

// لیست فایل‌هایی که باید در اولین لود برنامه به صورت کامل دانلود و آفلاین ذخیره شوند
const ASSETS = [
  './',
  './index.html',
  './app.js',
  './manifest.json',
  // پیش‌ذخیره فونت وزیر و تمامی فرمت‌های woff2 آن برای آفلاین شدن ۱۰۰٪ تایپوگرافی فارسی
  'https://cdn.jsdelivr.net/gh/rastikerdar/vazir-font@v30.1.0/dist/font-face.css',
  'https://cdn.jsdelivr.net/gh/rastikerdar/vazir-font@v30.1.0/dist/fonts/woff2/Vazir.woff2',
  'https://cdn.jsdelivr.net/gh/rastikerdar/vazir-font@v30.1.0/dist/fonts/woff2/Vazir-Bold.woff2',
  'https://cdn.jsdelivr.net/gh/rastikerdar/vazir-font@v30.1.0/dist/fonts/woff2/Vazir-Light.woff2',
  'https://cdn.jsdelivr.net/gh/rastikerdar/vazir-font@v30.1.0/dist/fonts/woff2/Vazir-Medium.woff2',
  'https://cdn.jsdelivr.net/gh/rastikerdar/vazir-font@v30.1.0/dist/fonts/woff2/Vazir-Thin.woff2'
];

// مرحله نصب (Install): دانلود و ذخیره تمامی دارایی‌های پایه در کش
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('SW: Pre-caching assets for offline execution...');
        return cache.addAll(ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// مرحله فعال‌سازی (Activate): پاک‌سازی نسخه‌های کش قدیمی در صورت انتشار آپدیت
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// استراتژی Cache-First: خواندن مستقیم و آنی از کش بدون نیاز به سرور (با فال‌بک دانلود پویا)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // اگر فایل از قبل در کش ذخیره شده، فوراً و بدون نیاز به اینترنت آن را لود کن
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // در غیر این صورت، آن را از اینترنت دانلود کرده و برای استفاده‌های بعدی در کش قرار بده
        return fetch(event.request).then(networkResponse => {
          // ذخیره پاسخ‌های معتبر اینترنتی (شامل فایل‌های CORS و CDNهای خارجی)
          if (networkResponse && (networkResponse.status === 200 || networkResponse.status === 0)) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        }).catch(() => {
          // فال‌بک اضطراری در صورتی که کاربر کلاً آفلاین است و فایل جدیدی درخواست کرده که در کش نیست
          return new Response('محتوا به صورت آفلاین در دسترس نیست.', { 
            status: 503, 
            headers: { 'Content-Type': 'text/plain; charset=utf-8' } 
          });
        });
      })
  );
});
