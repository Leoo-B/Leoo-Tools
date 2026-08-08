// ==========================================
// Vercel Serverless Function — Proxy ImgBB Upload
// Endpoint: POST /api/imgbb
// Body: multipart/form-data dengan field "image" (file)
//       dan opsional "expiration" (string detik)
// ==========================================

const IMGBB_KEY = process.env.IMGBB_KEY || 'cf58549c110b49f424dd4076a144b452';
const IMGBB_URL = 'https://api.imgbb.com/1/upload';

export const config = {
    api: {
        bodyParser: false, // Kita handle stream manual
    },
};

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') {
        return res.status(405).json({ status: false, message: 'Method tidak diizinkan.' });
    }

    try {
        // ── Baca raw body sebagai Buffer ────────────────────────
        const chunks = [];
        for await (const chunk of req) {
            chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
        }
        const rawBody = Buffer.concat(chunks);

        // ── Ambil Content-Type dari request (termasuk boundary) ─
        const contentType = req.headers['content-type'] || '';
        if (!contentType.includes('multipart/form-data')) {
            return res.status(400).json({ status: false, message: 'Content-Type harus multipart/form-data.' });
        }

        // ── Forward ke ImgBB dengan key di query string ─────────
        const imgbbResponse = await fetch(`${IMGBB_URL}?key=${IMGBB_KEY}`, {
            method:  'POST',
            headers: { 'Content-Type': contentType },
            body:    rawBody,
        });

        if (!imgbbResponse.ok) {
            throw new Error('ImgBB error HTTP ' + imgbbResponse.status);
        }

        const data = await imgbbResponse.json();
        return res.status(200).json(data);

    } catch (err) {
        return res.status(500).json({ status: false, message: err.message });
    }
}
