// ==========================================
// MEDIA DOWNLOADER (TikTok, YouTube, Instagram, Facebook)
// Lewat backend sendiri (api/download.py) karena API downloader
// video hampir semua kena CORS kalau dipanggil langsung dari browser.
// ==========================================
window.downloadMedia = function() {
    var platform = document.getElementById('mediaPlatform').value;
    var link = document.getElementById('mediaLink').value.trim();
    var result = document.getElementById('mediaResult');

    if (!link) {
        result.textContent = '⚠️ Masukkan link dulu!';
        return;
    }

    result.innerHTML = '⏳ Sedang memproses link... <br> <small style="color:var(--text-secondary);">Bisa makan waktu beberapa detik tergantung ukuran video.</small>';

    fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform: platform, url: link })
    })
    .then(function(response) {
        if (!response.ok) {
            return response.json().catch(function() { return {}; }).then(function(data) {
                throw new Error(data.detail || ('HTTP ' + response.status));
            });
        }
        return response.json();
    })
    .then(function(data) {
        if (!data || !data.download_url) {
            throw new Error('Link download tidak ditemukan di response.');
        }

        var title = data.title || 'Media';
        var thumbnail = data.thumbnail
            ? '<img src="' + data.thumbnail + '" style="max-width:100%; border-radius:16px; margin-top:12px;">'
            : '';

        result.innerHTML =
            '✅ <b>' + title + '</b>' +
            thumbnail +
            '<br><br><a href="' + data.download_url + '" target="_blank" download style="color:var(--accent-light); font-weight:600;">⬇️ Download File</a>';

        showToast('📥 Media siap di-download!');
        incrementUsage();
    })
    .catch(function(err) {
        result.textContent = '❌ Error: ' + err.message;
        showToast('❌ Gagal proses link');
    });
};
