// ==========================================
// NEWS — CNN Indonesia via api.synoxcloud.xyz
// ==========================================
window.getNews = function () {
    var result = document.getElementById('newsResult');
    var btn    = document.querySelector('[onclick="getNews()"]');

    result.textContent = '';
    if (btn) { btn.disabled = true; btn.style.opacity = '0.6'; }

    var pg = createProgress('newsProgressWrap', 'Mengambil berita terkini');
    pg.crawl(8, 78, 5000, 'Menghubungi server...');

    fetch('https://api.synoxcloud.xyz/berita/cnnindonesia')
    .then(function (res) {
        if (res.status === 429) throw new Error('__ratelimit__');
        if (!res.ok) throw new Error('Gagal mengambil berita (HTTP ' + res.status + ')');
        return res.json();
    })
    .then(function (data) {
        pg.set(92, 'Menyusun berita...');
        if (!data.status || !data.result || data.result.length === 0) {
            throw new Error('Tidak ada berita tersedia.');
        }

        // ── Deduplikasi berdasarkan link ────────────────────────
        var seen = {};
        var articles = [];

        data.result.forEach(function (item) {
            if (item.thumbnail && item.link && !seen[item.link]) {
                seen[item.link] = true;
                articles.push(item);
            }
        });
        data.result.forEach(function (item) {
            if (item.link && !seen[item.link]) {
                seen[item.link] = true;
                articles.push(item);
            }
        });

        // ── Bersihkan title ─────────────────────────────────────
        var CATEGORIES = ['Nasional','Internasional','Ekonomi','Teknologi','Olahraga',
                          'Hiburan','Gaya Hidup','Otomotif','Travel','Edukasi'];
        var catPattern = new RegExp('\\s*(' + CATEGORIES.join('|') + ')\\s*$', 'i');

        articles = articles.map(function (item) {
            var t = item.title || '';
            t = t.replace(/^\d{1,2}\s*\n\s*/g, '');
            t = t.replace(/\s+/g, ' ').trim();
            t = t.replace(catPattern, '').trim();
            return { title: t, link: item.link, thumbnail: item.thumbnail || '' };
        }).filter(function (item) {
            return item.title.length > 0;
        });

        if (articles.length === 0) throw new Error('Tidak ada berita untuk ditampilkan.');

        pg.done('Berita dimuat!');
        if (btn) { btn.disabled = false; btn.style.opacity = ''; }

        // ── Render artikel ──────────────────────────────────────
        var html = '<div class="news-list">';
        articles.forEach(function (art, i) {
            var safeTitle = escHtml(art.title);
            var safeLink  = escHtml(art.link);
            var safeThumb = escHtml(art.thumbnail);
            var haThumb   = art.thumbnail ? true : false;

            html += '<a class="news-item" href="' + safeLink + '" target="_blank" rel="noopener noreferrer">';

            if (haThumb) {
                html += '<div class="news-thumb-wrap">' +
                    '<img class="news-thumb" src="' + safeThumb + '" alt="" loading="lazy" ' +
                    'onerror="this.parentNode.classList.add(\'news-thumb-error\')">' +
                    '</div>';
            } else {
                html += '<div class="news-thumb-wrap news-thumb-placeholder">' +
                    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width:22px;height:22px;color:var(--text-muted);">' +
                    '<rect x="3" y="3" width="18" height="18" rx="3"/>' +
                    '<path d="M3 9h18M9 21V9"/>' +
                    '</svg>' +
                    '</div>';
            }

            html += '<div class="news-content">' +
                '<span class="news-index">' + String(i + 1).padStart(2, '0') + '</span>' +
                '<p class="news-title">' + safeTitle + '</p>' +
                '<span class="news-source">CNN Indonesia</span>' +
                '</div>';

            html += '</a>';
        });
        html += '</div>';

        result.innerHTML = html;
        showToast('Berita berhasil dimuat!', 'success');
        incrementUsage();
    })
    .catch(function (err) {
        var isRateLimit = err.message === '__ratelimit__';
        var msg = isRateLimit
            ? 'Server sedang sibuk, coba lagi dalam beberapa detik.'
            : err.message;

        pg.error('Gagal: ' + msg);
        result.innerHTML = '<div style="color:var(--text-secondary);font-size:0.875rem;">' +
            escHtml(msg) +
            '</div>';

        if (btn) { btn.disabled = false; btn.style.opacity = ''; }
        showToast(isRateLimit ? 'Server sibuk, coba lagi' : 'Gagal memuat berita', 'error');
    });
};

// ── HTML escape helper ─────────────────────────────────────────
function escHtml(str) {
    return String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}
