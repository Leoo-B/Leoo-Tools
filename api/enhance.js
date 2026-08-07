// ==========================================
// Vercel Serverless Function — Proxy ExsalAPI Enhance
// Endpoint: /api/enhance?image_url=...
// ==========================================

const EXSAL_ENHANCE = 'https://exsalapi.my.id/api/ai/image/enhance';
const EXSAL_KEY     = 'exs_leoob_1a593ef4';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const { image_url, dl } = req.query;

    // ── Mode download: /api/enhance?dl=URL_GAMBAR ──────────────
    // Browser tidak pernah hit exsalapi langsung — Vercel yang fetch lalu stream balik
    if (dl) {
        try {
            const imgRes = await fetch(dl, {
                headers: {
                    // Pura-pura request datang dari browser biasa di exsalapi.my.id
                    'Referer': 'https://exsalapi.my.id/',
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
