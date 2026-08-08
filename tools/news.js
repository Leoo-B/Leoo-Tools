// ==========================================
// NEWS HEADLINE (GNews API)
// ==========================================
window.getNews = function () {
    var category = document.getElementById('newsCategory').value;
    var result   = document.getElementById('newsResult');

    result.textContent = '';
    var pg = createProgress('newsProgressWrap', 'Mengambil berita terkini');
    pg.crawl(8, 78, 5000, 'Menghubungi GNews API...');

    fetch('https://gnews.io/api/v4/top-headlines?category=' + category + '&lang=id&country=id&max=5')
    .then(function (response) {
        if (!response.ok) throw new Error('Gagal mengambil berita');
        return response.json();
    })
    .then(function (data) {
        pg.set(92, 'Menyusun berita...');
        if (data.articles && data.articles.length > 0) {
            var html = '<ul style="list-style:none; padding:0; margin:0;">';
            for (var i = 0; i < Math.min(5, data.articles.length); i++) {
                var art = data.articles[i];
                html += '<li style="padding:12px 0; border-bottom:1px solid var(--border-subtle);">';
                html += '<a href="' + art.url + '" target="_blank" style="color:var(--accent-glow); font-weight:600; font-size:0.875rem; text-decoration:none; line-height:1.4; display:block;">' + (art.title || 'Judul tidak tersedia') + '</a>';
                if (art.description) html += '<p style="font-size:0.775rem; color:var(--text-secondary); margin:5px 0 0; line-height:1.5;">' + art.description + '</p>';
                html += '</li>';
            }
            html += '</ul>';
            pg.done('Berita dimuat!');
            result.innerHTML = html;
            showToast('Berita berhasil dimuat!', 'success');
            incrementUsage();
        } else {
            throw new Error('Tidak ada berita untuk kategori ini.');
        }
    })
    .catch(function (err) {
        pg.error('Gagal: ' + err.message);
        result.textContent = 'Error: ' + err.message + '. Coba lagi nanti.';
        showToast('Gagal memuat berita', 'error');
    });
};
