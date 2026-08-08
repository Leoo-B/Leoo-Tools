// ==========================================
// MEDIA DOWNLOADER — TikTok, YouTube, Instagram, Facebook
// Modern card UI + honest progress bar
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

    var dlSection = '';
    if (options.downloads && options.downloads.length > 0) {
        dlSection = '<div class="media-dl-section"><div class="media-dl-label">Pilih Kualitas & Download</div><ul class="media-dl-list">';
        options.downloads.forEach(function (d) {
            dlSection += '<li><a href="' + d.url + '" target="_blank" rel="noopener">' +
                '<span>' + ICON_DL + ' ' + (d.label || 'Download') + '</span>' +
                '<div class="media-dl-right"><span class="quality-badge">' + (d.quality || 'HD') + '</span></div>' +
                '</a></li>';
        });
        dlSection += '</ul></div>';
    }

    wrap.innerHTML = '<div class="media-result-card" id="card_' + wrapId + '">' +
        thumbSection + infoSection + (options.stats || '') + dlSection + '</div>';
}

window.playMediaInline = function (wrapId, videoUrl) {
    if (!videoUrl) return;
    var card     = document.getElementById('card_' + wrapId);
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
    pg.crawl(8, 80, 5000, 'Menghubungi server siputzx...');

    fetch(SIPUTZX_BASE + '/api/d/tiktok/v2?url=' + encodeURIComponent(link))
    .then(function (res) { if (!res.ok) throw new Error('HTTP ' + res.status); return res.json(); })
    .then(function (json) {
        pg.set(90, 'Memproses data...');
        if (!json.status || !json.data) throw new Error('Data tidak ditemukan / link tidak valid.');
        var d = json.data;

        var videoUrl = d.no_watermark_link_hd || d.no_watermark_link || d.wmlink || '';
        if (!videoUrl) throw new Error('Link download tidak tersedia (mungkin foto/slideshow).');

        var stats = buildStats([
            { icon: ICON_EYE,   value: fmtNum(d.play_count)    },
            { icon: ICON_LIKE,  value: fmtNum(d.digg_count)    },
            { icon: ICON_CMT,   value: fmtNum(d.comment_count) },
            { icon: ICON_SHARE, value: fmtNum(d.share_count)   },
            { icon: ICON_TIME,  value: d.duration ? d.duration + 's' : null },
        ]);

        var downloads = [];
        if (d.no_watermark_link_hd) downloads.push({ label: 'Video Tanpa Watermark', url: d.no_watermark_link_hd, quality: 'HD' });
        if (d.no_watermark_link)    downloads.push({ label: 'Video Tanpa Watermark', url: d.no_watermark_link,    quality: 'SD' });
        if (d.wmlink)               downloads.push({ label: 'Video + Watermark',      url: d.wmlink,               quality: 'WM' });
        if (d.audio)                downloads.push({ label: 'Audio Saja (MP3)',        url: d.audio,                quality: 'MP3' });

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
    pg.crawl(8, 75, 9000, 'Menghubungi server siputzx...');

    fetch(SIPUTZX_BASE + '/api/d/ummy?url=' + encodeURIComponent(link))
    .then(function (res) { if (!res.ok) throw new Error('HTTP ' + res.status); return res.json(); })
    .then(function (json) {
        pg.set(90, 'Memproses format video...');
        if (!json.status || !json.data) throw new Error('Data tidak ditemukan / link tidak valid.');
        var d    = json.data;
        var meta = d.meta || {};

        var candidates = (d.url || []).filter(function (f) { return f.downloadable === true; });
        candidates.sort(function (a, b) { return (b.qualityNumber || 0) - (a.qualityNumber || 0); });
        if (candidates.length === 0) throw new Error('Tidak ada format yang siap didownload.');

        var bestVideo = candidates.find(function (c) { return c.url; });
        var videoUrl  = bestVideo ? bestVideo.url : '';

        var stats = buildStats([
            { icon: ICON_EYE,  value: fmtNum(meta.viewCount)    },
            { icon: ICON_LIKE, value: fmtNum(meta.likeCount)    },
            { icon: ICON_CMT,  value: fmtNum(meta.commentCount) },
            { icon: ICON_TIME, value: meta.duration || null      },
        ]);

        var downloads = candidates.slice(0, 5).map(function (c) {
            return { label: meta.title || 'YouTube Video', url: c.url, quality: (c.quality || '?') + 'p' };
        });

        pg.done('Berhasil!');
        buildMediaCard('youtubeResultWrap', {
            thumb:     d.thumb || (meta.thumbnail && meta.thumbnail[0] && meta.thumbnail[0].url) || '',
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
    pg.crawl(8, 78, 7000, 'Menghubungi server siputzx...');

    fetch(SIPUTZX_BASE + '/api/d/ummy?url=' + encodeURIComponent(link))
    .then(function (res) { if (!res.ok) throw new Error('HTTP ' + res.status); return res.json(); })
    .then(function (json) {
        pg.set(90, 'Memproses media...');
        if (!json.status || !json.data) throw new Error('Data tidak ditemukan / link tidak valid.');
        var d    = json.data;
        var meta = d.meta || {};

        var urls = (d.url || []);
        urls.sort(function (a, b) { return (b.quality || 0) - (a.quality || 0); });
        if (urls.length === 0) throw new Error('Tidak ada media yang bisa didownload.');

        var firstVideo = urls.find(function (u) { return u.type === 'video' || (u.url && u.url.includes('.mp4')); });
        var videoUrl   = firstVideo ? firstVideo.url : '';

        var stats = buildStats([
            { icon: ICON_LIKE, value: fmtNum(meta.likeCount)    },
            { icon: ICON_CMT,  value: fmtNum(meta.commentCount) },
            { icon: ICON_EYE,  value: fmtNum(meta.viewCount)    },
        ]);

        var title = meta.title || meta.caption || 'Instagram Media';
        if (title.length > 80) title = title.substring(0, 80) + '...';

        var downloads = urls.slice(0, 5).map(function (u) {
            return { label: 'Download Media', url: u.url, quality: u.subname || (u.quality ? u.quality + 'p' : u.type || 'File') };
        });

        pg.done('Berhasil!');
        buildMediaCard('instagramResultWrap', {
            thumb:     d.thumb || meta.thumbnail || '',
            title:     title,
            author:    meta.username ? '@' + meta.username : '',
            stats:     stats,
            downloads: downloads,
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
    pg.crawl(8, 82, 6000, 'Menghubungi server siputzx...');

    fetch(SIPUTZX_BASE + '/api/d/facebook?url=' + encodeURIComponent(link))
    .then(function (res) { if (!res.ok) throw new Error('HTTP ' + res.status); return res.json(); })
    .then(function (json) {
        pg.set(90, 'Memproses data...');
        if (!json.status || !json.data) throw new Error('Data tidak ditemukan / link tidak valid.');
        var d = json.data;

        var videoItems = (d.downloads || []).filter(function (x) { return x.type === 'video'; });
        if (videoItems.length === 0) throw new Error('Tidak ada video yang bisa didownload.');

        var stats = buildStats([{ icon: ICON_TIME, value: d.duration || null }]);

        var bestVideo = videoItems.find(function (v) { return v.quality === 'hd'; }) || videoItems[0];
        var videoUrl  = bestVideo ? bestVideo.url : '';

        var downloads = videoItems.map(function (v) {
            return { label: 'Video Facebook', url: v.url, quality: v.quality ? v.quality.toUpperCase() : 'SD' };
        });

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
