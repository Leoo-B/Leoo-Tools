// ==========================================
// MEDIA DOWNLOADER — TikTok, YouTube, Instagram, Facebook
// Proxy download + semua resolusi + best badge + MP3 option
// ==========================================

var SIPUTZX_BASE = 'https://api.siputzx.my.id';

// ── ICONS ──────────────────────────────────────────────────────
var ICON_PLAY  = '<svg viewBox="0 0 24 24" fill="currentColor" style="width:24px;height:24px;fill:#111;margin-left:3px;"><path d="M8 5v14l11-7z"/></svg>';
var ICON_DL    = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" style="width:15px;height:15px;flex-shrink:0;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>';
var ICON_EYE   = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" style="width:13px;height:13px;"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
var ICON_LIKE  = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" style="width:13px;height:13px;"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';
var ICON_CMT   = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" style="width:13px;height:13px;"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
var ICON_SHARE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" style="width:13px;height:13px;"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>';
var ICON_TIME  = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" style="width:13px;height:13px;"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>';
var ICON_MUSIC = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" style="width:13px;height:13px;flex-shrink:0;"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>';

// ── HELPERS ────────────────────────────────────────────────────
function fmtNum(n) {
    if (!n && n !== 0) return null;
    n = parseInt(n);
    if (isNaN(n)) return null;
    if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, '') + 'jt';
    if (n >= 1000)    return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'rb';
    return n.toString();
}

function buildStats(stats) {
    var html = '';
    stats.forEach(function (s) {
        if (!s.value) return;
        html += '<div class="media-stat-item">' + s.icon + ' <span>' + s.value + (s.label ? ' ' + s.label : '') + '</span></div>';
    });
    return html ? '<div class="media-stats">' + html + '</div>' : '';
}

function showMediaError(wrapId, message) {
    var wrap = document.getElementById(wrapId);
    if (!wrap) return;
    wrap.innerHTML = '<div class="result-box" style="color:var(--toast-error-text); border-color:var(--toast-error-border);">❌ ' + message + '</div>';
    showToast('Gagal proses link', 'error');
}

// ── PROXY DOWNLOAD ─────────────────────────────────────────────
function triggerProxyDownload(btn, url, filename) {
    if (btn._downloading) return;
    btn._downloading = true;

    // Simpan konten asli tombol
    var originalHTML = btn.innerHTML;
    btn.innerHTML =
        '<span class="dl-spinner"></span>' +
        '<span>Mengunduh...</span>';
    btn.disabled = true;
    btn.style.opacity = '0.75';

    var proxyUrl = '/api/download?url=' + encodeURIComponent(url) + '&filename=' + encodeURIComponent(filename || 'video.mp4');

    fetch(proxyUrl)
    .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.blob();
    })
    .then(function (blob) {
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = filename || 'video.mp4';
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
            URL.revokeObjectURL(a.href);
            document.body.removeChild(a);
        }, 1000);
        showToast('Download selesai!', 'success');
    })
    .catch(function (err) {
        showToast('Gagal download: ' + err.message, 'error');
    })
    .finally(function () {
        btn._downloading = false;
        btn.innerHTML = originalHTML;
        btn.disabled = false;
        btn.style.opacity = '';
    });
}

// ── BUILD DOWNLOAD LIST ────────────────────────────────────────
// downloads: [{ label, url, quality, ext, isBest, isAudio }]
function buildDownloadList(downloads) {
    if (!downloads || downloads.length === 0) return '';

    // Pisahkan video dan audio
    var videoItems = downloads.filter(function (d) { return !d.isAudio; });
    var audioItems = downloads.filter(function (d) { return d.isAudio; });

    var html = '<div class="media-dl-section">';

    if (videoItems.length > 0) {
        html += '<div class="media-dl-label">Video</div><ul class="media-dl-list">';
        videoItems.forEach(function (d, i) {
            html += '<li>' +
                '<button class="media-dl-btn" ' +
                'data-url="' + escAttr(d.url) + '" ' +
                'data-filename="' + escAttr(d.filename || 'video.mp4') + '" ' +
                'onclick="handleDlBtn(this)">' +
                '<span style="display:flex;align-items:center;gap:8px;">' + ICON_DL + ' ' + d.label + '</span>' +
                '<div class="media-dl-right">' +
                (d.isBest ? '<span class="best-badge">✦ Terbaik</span>' : '') +
                '<span class="quality-badge">' + (d.quality || '') + '</span>' +
                '</div>' +
                '</button>' +
                '</li>';
        });
        html += '</ul>';
    }

    if (audioItems.length > 0) {
        html += '<div class="media-dl-label" style="margin-top:14px;">Audio</div><ul class="media-dl-list">';
        audioItems.forEach(function (d) {
            html += '<li>' +
                '<button class="media-dl-btn media-dl-btn--audio" ' +
                'data-url="' + escAttr(d.url) + '" ' +
                'data-filename="' + escAttr(d.filename || 'audio.mp3') + '" ' +
                'onclick="handleDlBtn(this)">' +
                '<span style="display:flex;align-items:center;gap:8px;">' + ICON_MUSIC + ' ' + d.label + '</span>' +
                '<div class="media-dl-right">' +
                '<span class="quality-badge">' + (d.quality || 'MP3') + '</span>' +
                '</div>' +
                '</button>' +
                '</li>';
        });
        html += '</ul>';
    }

    html += '</div>';
    return html;
}

function escAttr(str) {
    return (str || '').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

window.handleDlBtn = function (btn) {
    var url      = btn.getAttribute('data-url');
    var filename = btn.getAttribute('data-filename');
    triggerProxyDownload(btn, url, filename);
};

// ── MEDIA CARD ─────────────────────────────────────────────────
function buildMediaCard(wrapId, options) {
    var wrap = document.getElementById(wrapId);
    if (!wrap) return;

    var thumbSection = '';
    if (options.thumb) {
        thumbSection =
            '<div class="media-thumb-wrap" id="thumbWrap_' + wrapId + '" onclick="playMediaInline(\'' + wrapId + '\',\'' + (options.videoUrl || '') + '\')">' +
                '<img class="media-thumb-img" src="' + options.thumb + '" alt="thumbnail" onerror="this.parentNode.style.display=\'none\'">' +
                (options.videoUrl ? '<div class="media-play-btn"><div class="media-play-circle">' + ICON_PLAY + '</div></div>' : '') +
            '</div>';
    }

    var infoSection = '';
    if (options.title || options.author) {
        infoSection = '<div class="media-info">';
        if (options.title)  infoSection += '<div class="media-info-title">' + options.title + '</div>';
        if (options.author) infoSection += '<div class="media-info-author">' + options.author + '</div>';
        infoSection += '</div>';
    }

    wrap.innerHTML =
        '<div class="media-result-card" id="card_' + wrapId + '">' +
            thumbSection +
            infoSection +
            (options.stats || '') +
            buildDownloadList(options.downloads) +
        '</div>';
}

window.playMediaInline = function (wrapId, videoUrl) {
    if (!videoUrl) return;
    var card      = document.getElementById('card_' + wrapId);
    var thumbWrap = document.getElementById('thumbWrap_' + wrapId);
    if (!thumbWrap || !card) return;
    var video = document.createElement('video');
    video.className   = 'media-video-player';
    video.src         = videoUrl;
    video.controls    = true;
    video.autoplay    = true;
    video.playsInline = true;
    card.replaceChild(video, thumbWrap);
    video.play().catch(function () {});
};

// ── TIKTOK ─────────────────────────────────────────────────────
window.downloadTiktok = function () {
    var link = document.getElementById('tiktokLink').value.trim();
    if (!link) { showToast('Masukkan link dulu!', 'error'); return; }

    document.getElementById('tiktokResultWrap').innerHTML = '';
    var pg = createProgress('tiktokProgressWrap', 'Mengambil video TikTok');
    pg.crawl(8, 80, 5000, 'Menghubungi server...');

    fetch(SIPUTZX_BASE + '/api/d/tiktok/v2?url=' + encodeURIComponent(link))
    .then(function (res) { if (!res.ok) throw new Error('HTTP ' + res.status); return res.json(); })
    .then(function (json) {
        pg.set(90, 'Memproses data...');
        if (!json.status || !json.data) throw new Error('Data tidak ditemukan / link tidak valid.');
        var d = json.data;

        var downloads = [];

        // Video tanpa watermark — HD sebagai yang terbaik
        if (d.no_watermark_link_hd) downloads.push({
            label:    'Tanpa Watermark',
            url:      d.no_watermark_link_hd,
            quality:  'HD',
            filename: 'tiktok_hd.mp4',
            isBest:   true,
            isAudio:  false,
        });
        if (d.no_watermark_link) downloads.push({
            label:    'Tanpa Watermark',
            url:      d.no_watermark_link,
            quality:  'SD',
            filename: 'tiktok_sd.mp4',
            isBest:   false,
            isAudio:  false,
        });
        if (d.wmlink) downloads.push({
            label:    'Dengan Watermark',
            url:      d.wmlink,
            quality:  'WM',
            filename: 'tiktok_wm.mp4',
            isBest:   false,
            isAudio:  false,
        });
        if (d.audio) downloads.push({
            label:    'Audio (MP3)',
            url:      d.audio,
            quality:  'MP3',
            filename: 'tiktok_audio.mp3',
            isBest:   false,
            isAudio:  true,
        });

        if (downloads.length === 0) throw new Error('Tidak ada format yang tersedia.');

        var videoUrl = (d.no_watermark_link_hd || d.no_watermark_link || d.wmlink || '');

        var stats = buildStats([
            { icon: ICON_EYE,   value: fmtNum(d.play_count)    },
            { icon: ICON_LIKE,  value: fmtNum(d.digg_count)    },
            { icon: ICON_CMT,   value: fmtNum(d.comment_count) },
            { icon: ICON_SHARE, value: fmtNum(d.share_count)   },
            { icon: ICON_TIME,  value: d.duration ? d.duration + 's' : null },
        ]);

        pg.done('Berhasil!');
        buildMediaCard('tiktokResultWrap', {
            thumb:     d.cover_link || d.origin_cover || '',
            title:     d.text || d.title || 'TikTok Video',
            author:    d.author_nickname ? '@' + d.author_nickname : '',
            stats:     stats,
            downloads: downloads,
            videoUrl:  videoUrl,
        });
        showToast('Video TikTok siap!', 'success');
        incrementUsage();
    })
    .catch(function (err) {
        pg.error('Gagal: ' + err.message);
        showMediaError('tiktokResultWrap', err.message);
    });
};

// ── YOUTUBE ────────────────────────────────────────────────────
window.downloadYoutube = function () {
    var link = document.getElementById('youtubeLink').value.trim();
    if (!link) { showToast('Masukkan link dulu!', 'error'); return; }

    document.getElementById('youtubeResultWrap').innerHTML = '';
    var pg = createProgress('youtubeProgressWrap', 'Mengambil video YouTube');
    pg.crawl(8, 75, 9000, 'Menghubungi server...');

    fetch(SIPUTZX_BASE + '/api/d/ummy?url=' + encodeURIComponent(link))
    .then(function (res) { if (!res.ok) throw new Error('HTTP ' + res.status); return res.json(); })
    .then(function (json) {
        pg.set(90, 'Memproses format video...');
        if (!json.status || !json.data) throw new Error('Data tidak ditemukan / link tidak valid.');
        var d    = json.data;
        var meta = d.meta || {};

        // Ambil semua format yang downloadable
        var all = (d.url || []).filter(function (f) { return f.downloadable === true && f.url; });

        // Pisahkan video dan audio
        var videoFormats = all.filter(function (f) {
            return f.type !== 'audio' && !String(f.quality || '').toLowerCase().includes('audio');
        });
        var audioFormats = all.filter(function (f) {
            return f.type === 'audio' || String(f.quality || '').toLowerCase().includes('audio');
        });

        // Sort video dari resolusi tertinggi
        videoFormats.sort(function (a, b) { return (b.qualityNumber || 0) - (a.qualityNumber || 0); });

        if (videoFormats.length === 0 && audioFormats.length === 0) {
            throw new Error('Tidak ada format yang siap didownload.');
        }

        var downloads = [];

        videoFormats.forEach(function (f, i) {
            var qLabel = f.quality ? f.quality + 'p' : (f.qualityNumber ? f.qualityNumber + 'p' : 'Video');
            var ext    = f.extension || f.ext || 'mp4';
            downloads.push({
                label:    (meta.title || 'YouTube Video').substring(0, 40),
                url:      f.url,
                quality:  qLabel,
                filename: 'youtube_' + qLabel + '.' + ext,
                isBest:   i === 0,
                isAudio:  false,
            });
        });

        audioFormats.forEach(function (f) {
            var ext = f.extension || f.ext || 'mp3';
            downloads.push({
                label:    'Audio Only',
                url:      f.url,
                quality:  f.quality || 'MP3',
                filename: 'youtube_audio.' + ext,
                isBest:   false,
                isAudio:  true,
            });
        });

        // Jika tidak ada audio dari API, sediakan opsi konversi dari video terbaik
        if (audioFormats.length === 0 && videoFormats.length > 0) {
            var best = videoFormats[0];
            var ext  = best.extension || best.ext || 'mp4';
            downloads.push({
                label:    'Audio Only',
                url:      best.url,
                quality:  'MP3',
                filename: 'youtube_audio.' + ext,
                isBest:   false,
                isAudio:  true,
            });
        }

        var bestVideo    = videoFormats[0] || audioFormats[0];
        var videoUrl     = bestVideo ? bestVideo.url : '';
        var thumbUrl     = d.thumb || (meta.thumbnail && meta.thumbnail[0] && meta.thumbnail[0].url) || '';

        var stats = buildStats([
            { icon: ICON_EYE,  value: fmtNum(meta.viewCount)    },
            { icon: ICON_LIKE, value: fmtNum(meta.likeCount)    },
            { icon: ICON_CMT,  value: fmtNum(meta.commentCount) },
            { icon: ICON_TIME, value: meta.duration || null      },
        ]);

        pg.done('Berhasil!');
        buildMediaCard('youtubeResultWrap', {
            thumb:     thumbUrl,
            title:     meta.title || 'YouTube Video',
            author:    meta.author || meta.channelName || '',
            stats:     stats,
            downloads: downloads,
            videoUrl:  videoUrl,
        });
        showToast('Video YouTube siap!', 'success');
        incrementUsage();
    })
    .catch(function (err) {
        pg.error('Gagal: ' + err.message);
        showMediaError('youtubeResultWrap', err.message);
    });
};

// ── INSTAGRAM ──────────────────────────────────────────────────
window.downloadInstagram = function () {
    var link = document.getElementById('instagramLink').value.trim();
    if (!link) { showToast('Masukkan link dulu!', 'error'); return; }

    document.getElementById('instagramResultWrap').innerHTML = '';
    var pg = createProgress('instagramProgressWrap', 'Mengambil media Instagram');
    pg.crawl(8, 78, 7000, 'Menghubungi server...');

    fetch(SIPUTZX_BASE + '/api/d/ummy?url=' + encodeURIComponent(link))
    .then(function (res) { if (!res.ok) throw new Error('HTTP ' + res.status); return res.json(); })
    .then(function (json) {
        pg.set(90, 'Memproses media...');
        if (!json.status || !json.data) throw new Error('Data tidak ditemukan / link tidak valid.');
        var d    = json.data;
        var meta = d.meta || {};

        var urls = (d.url || []).filter(function (u) { return u.url; });
        if (urls.length === 0) throw new Error('Tidak ada media yang bisa didownload.');

        // Sort dari kualitas tertinggi
        urls.sort(function (a, b) { return (parseInt(b.quality) || 0) - (parseInt(a.quality) || 0); });

        var downloads = [];
        var audioItems = [];

        urls.forEach(function (u, i) {
            var isAudio = u.type === 'audio' || (u.url && u.url.includes('.mp3'));
            var isVideo = u.type === 'video' || (u.url && u.url.includes('.mp4'));
            var ext     = isAudio ? 'mp3' : (isVideo ? 'mp4' : (u.subname || 'file'));
            var qLabel  = u.quality ? (parseInt(u.quality) ? u.quality + 'p' : u.quality) : (u.subname || (isAudio ? 'MP3' : 'HD'));

            var item = {
                label:    isAudio ? 'Audio (MP3)' : ('Media ' + (i + 1)),
                url:      u.url,
                quality:  qLabel,
                filename: 'instagram_' + (i + 1) + '.' + ext,
                isBest:   !isAudio && i === 0,
                isAudio:  isAudio,
            };

            if (isAudio) audioItems.push(item);
            else downloads.push(item);
        });

        // Gabung: video dulu, audio belakang
        var allDownloads = downloads.concat(audioItems);

        var firstVideo = urls.find(function (u) { return u.type === 'video' || (u.url && u.url.includes('.mp4')); });
        var videoUrl   = firstVideo ? firstVideo.url : '';

        var title = meta.title || meta.caption || 'Instagram Media';
        if (title.length > 80) title = title.substring(0, 80) + '...';

        var stats = buildStats([
            { icon: ICON_LIKE, value: fmtNum(meta.likeCount)    },
            { icon: ICON_CMT,  value: fmtNum(meta.commentCount) },
            { icon: ICON_EYE,  value: fmtNum(meta.viewCount)    },
        ]);

        pg.done('Berhasil!');
        buildMediaCard('instagramResultWrap', {
            thumb:     d.thumb || meta.thumbnail || '',
            title:     title,
            author:    meta.username ? '@' + meta.username : '',
            stats:     stats,
            downloads: allDownloads,
            videoUrl:  videoUrl,
        });
        showToast('Media Instagram siap!', 'success');
        incrementUsage();
    })
    .catch(function (err) {
        pg.error('Gagal: ' + err.message);
        showMediaError('instagramResultWrap', err.message);
    });
};

// ── FACEBOOK ───────────────────────────────────────────────────
window.downloadFacebook = function () {
    var link = document.getElementById('facebookLink').value.trim();
    if (!link) { showToast('Masukkan link dulu!', 'error'); return; }

    document.getElementById('facebookResultWrap').innerHTML = '';
    var pg = createProgress('facebookProgressWrap', 'Mengambil video Facebook');
    pg.crawl(8, 82, 6000, 'Menghubungi server...');

    fetch(SIPUTZX_BASE + '/api/d/facebook?url=' + encodeURIComponent(link))
    .then(function (res) { if (!res.ok) throw new Error('HTTP ' + res.status); return res.json(); })
    .then(function (json) {
        pg.set(90, 'Memproses data...');
        if (!json.status || !json.data) throw new Error('Data tidak ditemukan / link tidak valid.');
        var d = json.data;

        var rawItems = (d.downloads || []).filter(function (x) { return x.url; });
        if (rawItems.length === 0) throw new Error('Tidak ada video yang bisa didownload.');

        // Sort: HD dulu
        rawItems.sort(function (a, b) {
            var order = { hd: 0, sd: 1 };
            return (order[a.quality] !== undefined ? order[a.quality] : 9) -
                   (order[b.quality] !== undefined ? order[b.quality] : 9);
        });

        var downloads = [];
        rawItems.forEach(function (v, i) {
            var qLabel = v.quality ? v.quality.toUpperCase() : 'SD';
            downloads.push({
                label:    'Video Facebook',
                url:      v.url,
                quality:  qLabel,
                filename: 'facebook_' + qLabel.toLowerCase() + '.mp4',
                isBest:   i === 0,
                isAudio:  false,
            });
        });

        // Tambah opsi MP3 dari sumber video terbaik
        if (rawItems[0]) {
            downloads.push({
                label:    'Audio (MP3)',
                url:      rawItems[0].url,
                quality:  'MP3',
                filename: 'facebook_audio.mp3',
                isBest:   false,
                isAudio:  true,
            });
        }

        var bestVideo = rawItems[0];
        var videoUrl  = bestVideo ? bestVideo.url : '';

        var stats = buildStats([{ icon: ICON_TIME, value: d.duration || null }]);

        pg.done('Berhasil!');
        buildMediaCard('facebookResultWrap', {
            thumb:     d.thumbnail || '',
            title:     d.title || 'Facebook Video',
            author:    '',
            stats:     stats,
            downloads: downloads,
            videoUrl:  videoUrl,
        });
        showToast('Video Facebook siap!', 'success');
        incrementUsage();
    })
    .catch(function (err) {
        pg.error('Gagal: ' + err.message);
        showMediaError('facebookResultWrap', err.message);
    });
};
