// ==========================================
// Vercel Serverless Function — CSRF Token
// Endpoint: GET /api/token
// Generate token HMAC-SHA256 valid per 5 menit window
// ==========================================

import { createHmac } from 'crypto';

const SECRET = process.env.CSRF_SECRET;

function getWindowedToken(secret) {
    // Window 5 menit — token valid selama window yang sama
    const window = Math.floor(Date.now() / (5 * 60 * 1000));
    return createHmac('sha256', secret)
        .update('leoo-tools:' + window)
        .digest('hex');
}

export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    if (!SECRET) {
        return res.status(500).json({ status: false, message: 'Server tidak dikonfigurasi.' });
    }

    const token = getWindowedToken(SECRET);
    // Cache sebentar saja — token berubah tiap 5 menit
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ status: true, token });
}
