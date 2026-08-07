// ==========================================
// MEDIA DOWNLOADER — TikTok, YouTube, Instagram, Facebook
// ==========================================

var SIPUTZX_BASE = 'https://api.siputzx.my.id';

function showMediaLoading(resultId) {
    document.getElementById(resultId).innerHTML =
        '⏳ Sedang memproses link... <br> <small style="color:var(--text-secondary);">Mohon tunggu sebentar.</small>';
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

        var previewHtml = '';
        if (data.cover_link) {
            previewHtml = '<img class="media-thumb" src="' + data.cover_link + '" alt="thumbnail">';
        }

        document.getElementById('tiktokResult').innerHTML =
            '✅ <b>' + (data.text || data.author_nickname || 'TikTok Video') + '</b>' +
            '<br><br><ul class="quality-list"><li><a href="' + downloadUrl + '" target="_blank">' +
            'Download Video (No Watermark) <span class="quality-badge">HD</span></a></li></ul>';
        document.getElementById('tiktokPreview').innerHTML = previewHtml;

        showToast('Video TikTok siap di-download!', 'success');
        incrementUsage();
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

        var title = (data.meta && data.meta.title) || 'Video YouTube';
        var listHtml = '<ul class="quality-list">';
        candidates.forEach(function(c) {
            listHtml += '<li><a href="' + c.url + '" target="_blank">' +
                        'Download ' + title + ' <span class="quality-badge">' + c.quality + 'p</span></a></li>';
        });
        listHtml += '</ul>';

        var previewHtml = data.thumb
            ? '<img class="media-thumb" src="' + data.thumb + '" alt="thumbnail">'
            : '';

        document.getElementById('youtubeResult').innerHTML = '✅ <b>' + title + '</b><br><br>' + listHtml;
        document.getElementById('youtubePreview').innerHTML = previewHtml;

        showToast('Video YouTube siap di-download!', 'success');
        incrementUsage();
    })
    .catch(function(err) {
        showMediaError('youtubeResult', err.message);
    });
};

// ---------- INSTAGRAM ----------
window.downloadInstagram = function() {
    var link = document.getElementById('instagramLink').value.trim();
    if (!link) {
        document.getElementById('instagramResult').textContent = 'Masukkan link dulu!';
        showToast('Masukkan link dulu!', 'error');
        return;
    }

    showMediaLoading('instagramResult');

    // Endpoint sama dengan YouTube downloader (ummy) — support Instagram Reel
    fetch(SIPUTZX_BASE + '/api/d/ummy?url=' + encodeURIComponent(link))
    .then(function(res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
    })
    .then(function(json) {
        if (!json.status || !json.data) throw new Error('Data tidak ditemukan / link tidak valid.');
        var data = json.data;

        // Ambil semua url yang tersedia, sort kualitas tertinggi dulu
        var urls = (data.url || []);
        urls.sort(function(a, b) { return (b.quality || 0) - (a.quality || 0); });
        if (urls.length === 0) throw new Error('Tidak ada media yang bisa didownload dari link ini.');

        var title = (data.meta && data.meta.title)
            ? data.meta.title.substring(0, 80) + (data.meta.title.length > 80 ? '...' : '')
            : 'Instagram Media';
        var username = data.meta && data.meta.username ? '@' + data.meta.username : '';

        var listHtml = '<ul class="quality-list">';
        urls.forEach(function(u) {
            var label = u.subname || (u.quality ? u.quality + 'p' : u.type || 'Download');
            listHtml += '<li><a href="' + u.url + '" target="_blank">' +
                        'Download <span class="quality-badge">' + label + '</span></a></li>';
        });
        listHtml += '</ul>';

        var previewHtml = data.thumb
            ? '<img class="media-thumb" src="' + data.thumb + '" alt="thumbnail">'
            : '';

        document.getElementById('instagramResult').innerHTML =
            '✅ <b>' + title + '</b>' +
            (username ? '<br><small style="color:var(--mute);">' + username + '</small>' : '') +
            '<br><br>' + listHtml;
        document.getElementById('instagramPreview').innerHTML = previewHtml;

        showToast('Media Instagram siap di-download!', 'success');
        incrementUsage();
    })
    .catch(function(err) {
        showMediaError('instagramResult', err.message);
    });
};

// ---------- FACEBOOK ----------
window.downloadFacebook = function() {
    var link = document.getElementById('facebookLink').value.trim();
    if (!link) {
        document.getElementById('facebookResult').textContent = 'Masukkan link dulu!';
        showToast('Masukkan link dulu!', 'error');
        return;
    }

    showMediaLoading('facebookResult');

    fetch(SIPUTZX_BASE + '/api/d/facebook?url=' + encodeURIComponent(link))
    .then(function(res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
    })
    .then(function(json) {
        if (!json.status || !json.data) throw new Error('Data tidak ditemukan / link tidak valid.');
        var data = json.data;

        var downloads = data.downloads || [];
        if (downloads.length === 0) throw new Error('Tidak ada video yang bisa didownload dari link ini.');

        var title = data.title || 'Facebook Video';
        var duration = data.duration ? ' · ' + data.duration : '';

        var listHtml = '<ul class="quality-list">';
        downloads.forEach(function(d) {
            if (d.type === 'video') {
                listHtml += '<li><a href="' + d.url + '" target="_blank">' +
                            'Download <span class="quality-badge">' + d.quality + '</span></a></li>';
            }
        });
        listHtml += '</ul>';

        var previewHtml = data.thumbnail
            ? '<img class="media-thumb" src="' + data.thumbnail + '" alt="thumbnail">'
            : '';

        document.getElementById('facebookResult').innerHTML =
            '✅ <b>' + title + '</b>' +
            '<br><small style="color:var(--mute);">Durasi: ' + (data.duration || '-') + '</small>' +
            '<br><br>' + listHtml;
        document.getElementById('facebookPreview').innerHTML = previewHtml;

        showToast('Video Facebook siap di-download!', 'success');
        incrementUsage();
    })
    .catch(function(err) {
        showMediaError('facebookResult', err.message);
    });
};
