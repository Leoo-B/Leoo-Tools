// ==========================================
// Vercel Serverless Function — Proxy ExsalAPI Enhance
// Endpoint: /api/enhance?image_url=...
// ==========================================

const EXSAL_ENHANCE = 'https://exsalapi.my.id/api/ai/image/enhance';
const EXSAL_KEY     = 'exs_leoob_1a593ef4';

export default async function handler(req, res) {
    // Izinkan request dari browser (CORS)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { image_url } = req.query;

    if (!image_url) {
        return res.status(400).json({ status: false, message: 'Parameter image_url wajib diisi.' });
    }

    try {
        const url = `${EXSAL_ENHANCE}?image_url=${encodeURIComponent(image_url)}&apikey=${EXSAL_KEY}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('ExsalAPI HTTP ' + response.status);
        }

        const data = await response.json();
        return res.status(200).json(data);

    } catch (err) {
        return res.status(500).json({ status: false, message: err.message });
    }
}
