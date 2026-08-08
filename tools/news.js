// ==========================================
// NEWS — CNN Indonesia via api.synoxcloud.xyz
// ==========================================
window.getNews = function () {
    var result = document.getElementById('newsResult');

    result.textContent = '';
    var pg = createProgress('newsProgressWrap', 'Mengambil berita terkini');
    pg.crawl(8, 78, 5000, 'Menghubungi server...');

    fetch('https://api.synoxcloud.xyz/berita/cnnindonesia')
    .then(function (res) {
        if (!res.ok) throw new Error('Gagal mengambil berita');
        return res.json();
    })
    .then(function (data) {
        pg.set(92, 'Menyusun berita...');
        if (!data.status || !data.result || data.result.length === 0) {
            throw new Error('Tidak ada berita tersedia.');
        }

        // ── Deduplikasi berdasarkan link ────────────────────────
        // Prioritaskan entry yang punya thumbnail
        var seen = {};
        var articles = [];

        // Pass 1: entry dengan thumbnail
        data.result.forEach(function (item) {
            if (item.thumbnail && item.link && !seen[item.link]) {
                seen[item.link] = true;
                articles.push(item);
            }
        });

        // Pass 2: entry tanpa thumbnail yang belum masuk
        data.result.forEach(function (item) {
            if (item.link && !seen[item.link]) {
                seen[item.link] = true;
                articles.push(item);
            }
        });

        // ── Bersihkan title ─────────────────────────────────────
        // Hapus: nomor urut di depan, whitespace berlebih, kategori di akhir
        var CATEGORIES = ['Nasional','Internasional','Ekonomi','Teknologi','Olahraga',
                          'Hiburan','Gaya Hidup','Otomotif','Travel','Edukasi'];
        var catPattern = new RegExp('\\s*(' + CATEGORIES.join('|') + ')\\s*$', 'i');

        articles = articles.map(function (item) {
            var t = item.title || '';
            // Hapus nomor urut "01 \n", "02 \n", dll
            t = t.replace(/^\d{1,2}\s*\n\s*/g, '');
            // Normalkan whitespace
            t = t.replace(/\s+/g, ' ').trim();
            // Hapus kategori di akhir
            t = t.replace(catPattern, '').trim();
            return { title: t, link: item.link, thumbnail: item.thumbnail || '' };
        }).filter(function (item) {
            return item.title.length > 0;
        });

        if (articles.length === 0) throw new Error('Tidak ada berita untuk ditampilkan.');

        pg.done('Berita dimuat!');

        // ── Render artikel ──────────────────────────────────────
        var html = '<div class="news-list">';
        articles.forEach(function (art, i) {
            var haThumb = art.thumbnail ? true : false;
            html += '<a class="news-item" href="' + art.link + '" target="_blank" rel="noopener noreferrer">';

            if (haThumb) {
                html += '<div class="news-thumb-wrap">' +
                    '<img class="news-thumb" src="' + art.thumbnail + '" alt="" loading="lazy" ' +
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
                '<p class="news-title">' + art.title + '</p>' +
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
        pg.error('Gagal: ' + err.message);
        result.textContent = 'Error: ' + err.message + '. Coba lagi nanti.';
        showToast('Gagal memuat berita', 'error');
    });
};
