// ==========================================
// Vercel Serverless Function — Proxy ImgBB Upload
// Endpoint: POST /api/imgbb
// Security:
//   - Layer 1: Origin / Referer whitelist
//   - Layer 2: CSRF token (X-CSRF-Token header)
// ==========================================

import { createHmac } from 'crypto';

const IMGBB_KEY = process.env.IMGBB_KEY;
const IMGBB_URL = 'https://api.imgbb.com/1/upload';

export const config = {
    api: { bodyParser: false },
};

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
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-CSRF-Token');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') {
        return res.status(405).json({ status: false, message: 'Method tidak diizinkan.' });
    }

    // ── Layer 1: Origin check ──────────────────────────────────
    if (!isAllowedOrigin(req)) {
        return res.status(403).json({ status: false, message: 'Akses tidak diizinkan.' });
    }

    // ── Layer 2: CSRF token check ──────────────────────────────
    const csrfToken = req.headers['x-csrf-token'] || '';
    if (!isValidCsrfToken(csrfToken)) {
        return res.status(403).json({ status: false, message: 'Token tidak valid.' });
    }

    // ── ImgBB key check ────────────────────────────────────────
    if (!IMGBB_KEY) {
        return res.status(500).json({ status: false, message: 'Server tidak dikonfigurasi.' });
    }

    try {
        const chunks = [];
        for await (const chunk of req) {
            chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
        }
        const rawBody = Buffer.concat(chunks);

        const contentType = req.headers['content-type'] || '';
        if (!contentType.includes('multipart/form-data')) {
            return res.status(400).json({ status: false, message: 'Content-Type harus multipart/form-data.' });
        }

        const imgbbResponse = await fetch(`${IMGBB_URL}?key=${IMGBB_KEY}`, {
            method:  'POST',
            headers: { 'Content-Type': contentType },
            body:    rawBody,
        });

        if (!imgbbResponse.ok) throw new Error('ImgBB error HTTP ' + imgbbResponse.status);

        const data = await imgbbResponse.json();
        return res.status(200).json(data);

    } catch (err) {
        return res.status(500).json({ status: false, message: err.message });
    }
}
