// ==========================================
// Vercel Serverless Function — Proxy ExsalAPI Enhance
// Endpoint: /api/enhance?image_url=...
// Security:
//   - Layer 1: Origin / Referer whitelist
//   - Layer 2: CSRF token (X-CSRF-Token header)
// ==========================================

import { createHmac } from 'crypto';

const EXSAL_ENHANCE = 'https://exsalapi.my.id/api/ai/image/enhance';
const EXSAL_KEY     = 'exs_leoob_1a593ef4';

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
    const window = Math.floor(Date.now() / (5 * 60 * 1000)) - 1;
    return createHmac('sha256', secret)
        .update('leoo-tools:' + window)
        .digest('hex');
}

function isValidCsrfToken(token) {
    if (!SECRET || !token) return false;
    return token === getWindowedToken(SECRET) || token === getPrevWindowedToken(SECRET);
}

function isAllowedOrigin(req) {
    const origin  = req.headers['origin']  || '';
    const referer = req.headers['referer'] || '';
    return ALLOWED_ORIGINS.some(function (o) {
        return origin.startsWith(o) || referer.startsWith(o);
    });
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

    const { image_url, dl } = req.query;

    // ── Mode download: /api/enhance?dl=URL_GAMBAR ──────────────
    if (dl) {
        try {
            const imgRes = await fetch(dl, {
                headers: {
                    'Referer':    'https://exsalapi.my.id/',
                    'User-Agent': 'Mozilla/5.0 (Linux; Android 12) AppleWebKit/537.36 Chrome/120 Mobile Safari/537.36'
                }
            });

            if (!imgRes.ok) throw new Error('Gagal fetch gambar (HTTP ' + imgRes.status + ')');

            const contentType = imgRes.headers.get('content-type') || 'image/jpeg';
            const buffer      = await imgRes.arrayBuffer();

            res.setHeader('Content-Type', contentType);
            res.setHeader('Content-Disposition', 'attachment; filename="enhanced.jpg"');
            return res.status(200).send(Buffer.from(buffer));

        } catch (err) {
            return res.status(500).json({ status: false, message: err.message });
        }
    }

    // ── Mode enhance: /api/enhance?image_url=... ───────────────
    if (!image_url) {
        return res.status(400).json({ status: false, message: 'Parameter image_url wajib diisi.' });
    }

    try {
        const url      = `${EXSAL_ENHANCE}?image_url=${encodeURIComponent(image_url)}&apikey=${EXSAL_KEY}`;
        const response = await fetch(url);

        if (!response.ok) throw new Error('ExsalAPI HTTP ' + response.status);

        const data = await response.json();
        return res.status(200).json(data);

    } catch (err) {
        return res.status(500).json({ status: false, message: err.message });
    }
}
