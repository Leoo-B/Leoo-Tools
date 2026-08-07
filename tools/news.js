// ==========================================
// NEWS HEADLINE (GNews API)
// ==========================================
window.getNews = function() {
    var category = document.getElementById('newsCategory').value;
    var result = document.getElementById('newsResult');
    result.textContent = 'Sedang mengambil berita...';

    fetch('https://gnews.io/api/v4/top-headlines?category=' + category + '&lang=id&country=id&max=5')
    .then(function(response) {
        if (!response.ok) throw new Error('Gagal mengambil berita');
        return response.json();
    })
    .then(function(data) {
        if (data.articles && data.articles.length > 0) {
            var html = '<ul style="list-style:none; padding:0;">';
            for (var i = 0; i < Math.min(5, data.articles.length); i++) {
                var art = data.articles[i];
                html += '<li style="padding:10px 0; border-bottom:1px solid var(--hairline);">';
                html += '<a href="' + art.url + '" target="_blank" style="color:var(--accent-light); font-weight:600;">' + (art.title || 'Judul tidak tersedia') + '</a>';
                if (art.description) html += '<p style="font-size:0.8rem; color:var(--body-text); margin:4px 0 0;">' + art.description + '</p>';
                html += '</li>';
            }
            html += '</ul>';
            result.innerHTML = html;
            showToast('Berita berhasil dimuat!', 'success');
            incrementUsage();
        } else {
            result.textContent = 'Tidak ada berita untuk kategori ini.';
            showToast('Tidak ada berita', 'error');
        }
    })
    .catch(function(err) {
        result.textContent = 'Error: ' + err.message + '. Coba lagi nanti.';
        showToast('Gagal memuat berita', 'error');
    });
};
