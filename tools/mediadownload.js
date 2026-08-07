// ==========================================
// MEDIA DOWNLOADER — TikTok, YouTube, Instagram, Facebook
// ==========================================

var SIPUTZX_BASE = 'https://api.siputzx.my.id';

function showMediaLoading(resultId) {
    document.getElementById(resultId).innerHTML =
        '⏳ Sedang memproses link... <br> <small style="color:var(--text-secondary);">Mohon tunggu sebentar.</small>';
}

function showMediaResult(resultId, previewId, downloadUrl, title, thumbnail) {
    var result = document.getElementById(resultId);
    var preview = document.getElementById(previewId);

    if (preview && thumbnail) {
        preview.innerHTML = '<img src="' + thumbnail + '" style="max-width:100%; border-radius:16px; margin-top:12px;">';
    }

    result.innerHTML =
        '✅ <b>' + (title || 'Media') + '</b>' +
        '<br><br><a href="' + downloadUrl + '" target="_blank" style="color:var(--accent-light); font-weight:600;">⬇️ Download File</a>';

    showToast('Media siap di-download!', 'success');
    incrementUsage();
}

function showMediaError(resultId, message) {
    document.getElementById(resultId).textContent = 'Error: ' + message;
    showToast('Gagal proses link', 'error');
}

// ---------- TIKTOK ----------
window.downloadTiktok = function() {
    var link = document.getElementById('tiktokLink').value.trim();
    if (!link) {
        document.getElementById('tiktokResult').textContent = 'Masukkan link dulu!';
        showToast('Masukkan link dulu!', 'error');
        return;
    }

    showMediaLoading('tiktokResult');

    fetch(SIPUTZX_BASE + '/api/d/tiktok/v2?url=' + encodeURIComponent(link))
    .then(function(res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
    })
    .then(function(json) {
        if (!json.status || !json.data) throw new Error('Data tidak ditemukan / link tidak valid.');
        var data = json.data;
        var downloadUrl = data.no_watermark_link_hd || data.no_watermark_link;
        if (!downloadUrl) throw new Error('Link download tidak tersedia untuk konten ini (mungkin post foto/slideshow, bukan video).');
        showMediaResult('tiktokResult', 'tiktokPreview', downloadUrl, data.text || data.author_nickname, data.cover_link);
    })
    .catch(function(err) {
        showMediaError('tiktokResult', err.message);
    });
};

// ---------- YOUTUBE ----------
window.downloadYoutube = function() {
    var link = document.getElementById('youtubeLink').value.trim();
    if (!link) {
        document.getElementById('youtubeResult').textContent = 'Masukkan link dulu!';
        showToast('Masukkan link dulu!', 'error');
        return;
    }

    showMediaLoading('youtubeResult');

    fetch(SIPUTZX_BASE + '/api/d/ummy?url=' + encodeURIComponent(link))
    .then(function(res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
    })
    .then(function(json) {
        if (!json.status || !json.data) throw new Error('Data tidak ditemukan / link tidak valid.');
        var data = json.data;
        var candidates = (data.url || []).filter(function(f) { return f.downloadable === true; });
        candidates.sort(function(a, b) { return (b.qualityNumber || 0) - (a.qualityNumber || 0); });
        if (candidates.length === 0) throw new Error('Tidak ada format video+audio yang siap didownload langsung.');
        var best = candidates[0];
        var title = (data.meta && data.meta.title) || 'Video YouTube';
        showMediaResult('youtubeResult', 'youtubePreview', best.url, title + ' (' + best.quality + 'p)', data.thumb);
    })
    .catch(function(err) {
        showMediaError('youtubeResult', err.message);
    });
};

// ---------- INSTAGRAM ----------
window.downloadInstagram = function() {
    document.getElementById('instagramResult').textContent = 'Fitur ini belum tersedia, masih dalam pengembangan.';
    showToast('Fitur Instagram belum tersedia', 'error');
};

// ---------- FACEBOOK ----------
window.downloadFacebook = function() {
    document.getElementById('facebookResult').textContent = 'Fitur ini belum tersedia, masih dalam pengembangan.';
    showToast('Fitur Facebook belum tersedia', 'error');
};
