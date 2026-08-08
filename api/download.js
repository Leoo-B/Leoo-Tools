// ==========================================
// Vercel Serverless Function — Proxy Video Download
// Endpoint: /api/download?url=VIDEO_URL&filename=namafile.mp4
// ==========================================

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const { url, filename } = req.query;

    if (!url) {
        return res.status(400).json({ status: false, message: 'Parameter url wajib diisi.' });
    }

    try {
        const videoRes = await fetch(decodeURIComponent(url), {
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
