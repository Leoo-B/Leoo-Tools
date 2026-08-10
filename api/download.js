// ==========================================
// Vercel Serverless Function — Proxy Video Download
// Endpoint: /api/download?url=VIDEO_URL&filename=namafile.mp4
// Security:
//   - Layer 1: Origin / Referer whitelist
//   - Layer 2: CSRF token (X-CSRF-Token header)
//   - Whitelist domain yang diizinkan
//   - Rate limit 30 req/IP/menit (in-memory, best-effort)
// ==========================================

import { createHmac } from 'crypto';

// ── ALLOWED ORIGINS (Layer 1) ──────────────────────────────────
const ALLOWED_ORIGINS = [
    'https://leoo-tools.vercel.app', // ganti dengan domain production kamu
    'http://localhost:3000',
    'http://localhost:5500',
    'http://127.0.0.1:5500',
];

// ── CSRF VERIFY (Layer 2) ──────────────────────────────────────
const SECRET = process.env.CSRF_SECRET;

function getWindowedToken(secret) {
    const window = Math.floor(Date.now() / (5 * 60 * 1000));
    return createHmac('sha256', secret)
        .update('leoo-tools:' + window)
        .digest('hex');
}

function getPrevWindowedToken(secret) {
    // Toleransi 1 window sebelumnya agar tidak gagal saat window baru mulai
    const window = Math.floor(Date.now() / (5 * 60 * 1000)) - 1;
    return createHmac('sha256', secret)
        .update('leoo-tools:' + window)
        .digest('hex');
}

function isValidCsrfToken(token) {
    if (!SECRET || !token) return false;
    const current  = getWindowedToken(SECRET);
    const previous = getPrevWindowedToken(SECRET);
    return token === current || token === previous;
}

function isAllowedOrigin(req) {
    const origin  = req.headers['origin']  || '';
    const referer = req.headers['referer'] || '';
    return ALLOWED_ORIGINS.some(function (o) {
        return origin.startsWith(o) || referer.startsWith(o);
    });
}

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
var rateLimitMap = new Map();
var RATE_LIMIT   = 30;
var RATE_WINDOW  = 60000;

function isRateLimited(ip) {
    var now  = Date.now();
    var data = rateLimitMap.get(ip);
    if (!data || now - data.windowStart > RATE_WINDOW) {
        rateLimitMap.set(ip, { windowStart: now, count: 1 });
        return false;
    }
    data.count += 1;
    return data.count > RATE_LIMIT;
}

if (typeof setInterval !== 'undefined') {
    setInterval(function () {
        var now = Date.now();
        rateLimitMap.forEach(function (data, ip) {
            if (now - data.windowStart > RATE_WINDOW * 2) rateLimitMap.delete(ip);
        });
    }, 5 * 60 * 1000);
}

// ── HANDLER ────────────────────────────────────────────────────
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-CSRF-Token');

    if (req.method === 'OPTIONS') return res.status(200).end();

    // ── Layer 1: Origin check ──────────────────────────────────
    if (!isAllowedOrigin(req)) {
        return res.status(403).json({ status: false, message: 'Akses tidak diizinkan.' });
    }

    // ── Layer 2: CSRF token check ──────────────────────────────
    const csrfToken = req.headers['x-csrf-token'] || '';
    if (!isValidCsrfToken(csrfToken)) {
        return res.status(403).json({ status: false, message: 'Token tidak valid.' });
    }

    // ── IP + Rate limit ────────────────────────────────────────
    var ip = (
        req.headers['x-forwarded-for'] ||
        req.headers['x-real-ip'] ||
        req.socket?.remoteAddress ||
        'unknown'
    ).split(',')[0].trim();

    if (isRateLimited(ip)) {
        return res.status(429).json({ status: false, message: 'Terlalu banyak request, tunggu sebentar.' });
    }

    const { url, filename } = req.query;
    if (!url) return res.status(400).json({ status: false, message: 'Parameter url wajib diisi.' });

    var decodedUrl;
    try {
        decodedUrl = decodeURIComponent(url);
    } catch (e) {
        return res.status(400).json({ status: false, message: 'URL tidak valid.' });
    }

    if (!isDomainAllowed(decodedUrl)) {
        return res.status(403).json({ status: false, message: 'Domain tidak diizinkan.' });
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
