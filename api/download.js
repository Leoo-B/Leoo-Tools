// ==========================================
// Vercel Serverless Function — Proxy Video Download
// Endpoint: /api/download?url=VIDEO_URL&filename=namafile.mp4
// Keamanan:
//   - Whitelist domain yang diizinkan
//   - Rate limit 30 req/IP/menit (in-memory, best-effort)
// ==========================================

// ── WHITELIST DOMAIN ───────────────────────────────────────────
const ALLOWED_DOMAINS = [
    'tiktok.com',
    'tiktokcdn.com',
    'tiktokcdn-us.com',
    'googlevideo.com',
    'cdninstagram.com',
    'fbcdn.net',
    'facebook.com',
    'siputzx.my.id',
    'akamaized.net',
    'scdn.co',
];

function isDomainAllowed(urlStr) {
    try {
        var hostname = new URL(urlStr).hostname.toLowerCase();
        return ALLOWED_DOMAINS.some(function (domain) {
            return hostname === domain || hostname.endsWith('.' + domain);
        });
    } catch (e) {
        return false;
    }
}

// ── RATE LIMIT (in-memory, best-effort) ───────────────────────
// Catatan: di Vercel serverless, Map ini tidak shared antar instance.
// Efeknya adalah rate limit yang longgar tapi tetap berguna sebagai
// pengaman dasar pada instance yang sama.
var rateLimitMap = new Map();
var RATE_LIMIT   = 30;   // maks request per window
var RATE_WINDOW  = 60000; // 1 menit dalam ms

function isRateLimited(ip) {
    var now  = Date.now();
    var data = rateLimitMap.get(ip);

    if (!data || now - data.windowStart > RATE_WINDOW) {
        // Window baru atau sudah expired
        rateLimitMap.set(ip, { windowStart: now, count: 1 });
        return false;
    }

    data.count += 1;
    if (data.count > RATE_LIMIT) {
        return true;
    }

    return false;
}

// Bersihkan entri lama dari Map setiap 5 menit agar tidak memory leak
if (typeof setInterval !== 'undefined') {
    setInterval(function () {
        var now = Date.now();
        rateLimitMap.forEach(function (data, ip) {
            if (now - data.windowStart > RATE_WINDOW * 2) {
                rateLimitMap.delete(ip);
            }
        });
    }, 5 * 60 * 1000);
}

// ── HANDLER ────────────────────────────────────────────────────
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    // ── Ambil IP client ────────────────────────────────────────
    var ip = (
        req.headers['x-forwarded-for'] ||
        req.headers['x-real-ip'] ||
        req.socket?.remoteAddress ||
        'unknown'
    ).split(',')[0].trim();

    // ── Rate limit check ───────────────────────────────────────
    if (isRateLimited(ip)) {
        return res.status(429).json({
            status:  false,
            message: 'Terlalu banyak request, tunggu sebentar.',
        });
    }

    const { url, filename } = req.query;

    if (!url) {
        return res.status(400).json({ status: false, message: 'Parameter url wajib diisi.' });
    }

    // ── Decode & validasi URL ──────────────────────────────────
    var decodedUrl;
    try {
        decodedUrl = decodeURIComponent(url);
    } catch (e) {
        return res.status(400).json({ status: false, message: 'URL tidak valid.' });
    }

    // ── Whitelist check ────────────────────────────────────────
    if (!isDomainAllowed(decodedUrl)) {
        return res.status(403).json({
            status:  false,
            message: 'Domain tidak diizinkan.',
        });
    }

    try {
        const videoRes = await fetch(decodedUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 12) AppleWebKit/537.36 Chrome/120 Mobile Safari/537.36',
                'Referer':    'https://www.tiktok.com/',
                'Accept':     '*/*',
            }
        });

        if (!videoRes.ok) throw new Error('Gagal fetch video (HTTP ' + videoRes.status + ')');

        const contentType   = videoRes.headers.get('content-type') || 'video/mp4';
        const contentLength = videoRes.headers.get('content-length');
        const safeFilename  = (filename || 'video.mp4').replace(/[^a-zA-Z0-9._-]/g, '_');

        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', 'attachment; filename="' + safeFilename + '"');
        if (contentLength) res.setHeader('Content-Length', contentLength);
        res.setHeader('Cache-Control', 'no-store');

        const buffer = await videoRes.arrayBuffer();
        return res.status(200).send(Buffer.from(buffer));

    } catch (err) {
        return res.status(500).json({ status: false, message: err.message });
    }
}
