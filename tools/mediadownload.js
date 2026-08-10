// ==========================================
// MEDIA DOWNLOADER — TikTok, YouTube, Instagram, Facebook
// Proxy download + semua resolusi + best badge + MP3 option
// Pilih resolusi dulu → klik Download
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

// ── HTML ESCAPE ────────────────────────────────────────────────
function escHtml(str) {
    return String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// ── ATTR ESCAPE ────────────────────────────────────────────────
function escAttr(str) {
    return String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

// ── RATE LIMIT / ERROR MESSAGE ─────────────────────────────────
function friendlyError(status, fallback) {
    if (status === 429) return 'Server sedang sibuk, tunggu beberapa detik lalu coba lagi.';
    if (status === 403) return 'Akses ditolak oleh server. Coba lagi nanti.';
    if (status === 404) return 'Video tidak ditemukan. Pastikan link benar dan konten masih publik.';
    if (status === 500) return 'Server error, coba lagi dalam beberapa saat.';
    if (status === 503) return 'Server sedang tidak tersedia, coba lagi nanti.';
    return fallback || 'Terjadi kesalahan. Coba lagi.';
}

function parseHttpStatus(errMsg) {
    var m = String(errMsg).match(/HTTP (\d+)/);
    return m ? parseInt(m[1]) : null;
}

// ── HELPERS ────────────────────────────────────────────────────
function fmtDuration(ms) {
    var totalSec = Math.floor(parseInt(ms) / 1000);
    if (isNaN(totalSec) || totalSec <= 0) return null;
    var min = Math.floor(totalSec / 60);
    var sec = totalSec % 60;
    return min + ':' + (sec < 10 ? '0' : '') + sec;
}

function safeStatVal(v) {
    if (v === null || v === undefined || v === '' || v === '0') return null;
    return String(v);
}

function buildStats(stats) {
    var html = '';
    stats.forEach(function (s) {
        if (!s.value) return;
        html += '<div class="media-stat-item">' + s.icon +
                ' <span>' + escHtml(s.value) + (s.label ? ' ' + escHtml(s.label) : '') + '</span></div>';
    });
    return html ? '<div class="media-stats">' + html + '</div>' : '';
}

// ── BUTTON HELPERS ─────────────────────────────────────────────
function setMainBtn(platform, disabled) {
    var fnMap = {
        tiktok:    'downloadTiktok()',
        youtube:   'downloadYoutube()',
        instagram: 'downloadInstagram()',
        facebook:  'downloadFacebook()',
    };
    var fn  = fnMap[platform];
    var btn = fn ? document.querySelector('[onclick="' + fn + '"]') : null;
    if (!btn) return;
    btn.disabled     = disabled;
    btn.style.opacity = disabled ? '0.6' : '';
}

function showMediaError(wrapId, message, platform) {
    var wrap = document.getElementById(wrapId);
    if (!wrap) return;
    wrap.innerHTML =
        '<div class="result-box" style="color:var(--toast-error-text);border-color:var(--toast-error-border);">' +
        escHtml(message) +
        '</div>';
    showToast('Gagal proses link', 'error');
    if (platform) setMainBtn(platform, false);
}

// ── TOAST WARNING ──────────────────────────────────────────────
function showWarningToast(message) {
    var container = document.getElementById('toastContainer');
    if (!container) return;
    var current = container.querySelectorAll('.toast');
    if (current.length >= 3) {
        var first = current[0];
        first.classList.add('toast-exit');
        setTimeout(function () { if (first.parentNode) first.remove(); }, 380);
    }
    var toast = document.createElement('div');
    toast.className = 'toast toast-warning';
    toast.textContent = message;
    container.appendChild(toast);
    var timer = setTimeout(function () { dismissToastEl(toast); }, 2800);
    toast._dismissTimer = timer;
}

function dismissToastEl(toast) {
    if (!toast || toast._dismissed) return;
    toast._dismissed = true;
    if (toast._dismissTimer) clearTimeout(toast._dismissTimer);
    toast.classList.add('toast-exit');
    setTimeout(function () { if (toast.parentNode) toast.remove(); }, 380);
}

// ── PROXY DOWNLOAD ─────────────────────────────────────────────
function triggerProxyDownload(btn, url, filename) {
    if (btn._downloading) return;
    btn._downloading = true;

    var originalHTML = btn.innerHTML;
    btn.innerHTML = '<span class="dl-spinner"></span><span>Mengunduh...</span>';
    btn.disabled = true;
    btn.style.opacity = '0.75';

    var proxyUrl = '/api/download?url=' + encodeURIComponent(url) +
                   '&filename=' + encodeURIComponent(filename || 'video.mp4');

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
        var status = parseHttpStatus(err.message);
        showToast('Gagal download: ' + friendlyError(status, err.message), 'error');
    })
    .finally(function () {
        btn._downloading = false;
        btn.innerHTML = originalHTML;
        btn.disabled = false;
        btn.style.opacity = '';
    });
}

// ── BUILD DOWNLOAD LIST ────────────────────────────────────────
var _selectedDownload = {};

function buildDownloadList(downloads, wrapId) {
    if (!downloads || downloads.length === 0) return '';

    var videoItems = downloads.filter(function (d) { return !d.isAudio; });
    var audioItems = downloads.filter(function (d) { return d.isAudio; });

    var html = '<div class="media-dl-section">';

    if (videoItems.length > 0) {
        html += '<div class="media-dl-label">Video</div><ul class="media-dl-list">';
        videoItems.forEach(function (d) {
            var idx = downloads.indexOf(d);
            html += '<li>' +
                '<button class="media-dl-btn" ' +
                'data-wrap="' + escAttr(wrapId) + '" ' +
                'data-idx="' + idx + '" ' +
                'onclick="selectDownloadItem(this)">' +
                '<span style="display:flex;align-items:center;gap:8px;">' + ICON_DL + ' ' + escHtml(d.label) + '</span>' +
                '<div class="media-dl-right">' +
                (d.isBest ? '<span class="best-badge">✦ Terbaik</span>' : '') +
                '<span class="quality-badge">' + escHtml(d.quality || '') + '</span>' +
                '</div></button></li>';
        });
        html += '</ul>';
    }

    if (audioItems.length > 0) {
        html += '<div class="media-dl-label" style="margin-top:14px;">Audio</div><ul class="media-dl-list">';
        audioItems.forEach(function (d) {
            var idx = downloads.indexOf(d);
            html += '<li>' +
                '<button class="media-dl-btn media-dl-btn--audio" ' +
                'data-wrap="' + escAttr(wrapId) + '" ' +
                'data-idx="' + idx + '" ' +
                'onclick="selectDownloadItem(this)">' +
                '<span style="display:flex;align-items:center;gap:8px;">' + ICON_MUSIC + ' ' + escHtml(d.label) + '</span>' +
                '<div class="media-dl-right">' +
                '<span class="quality-badge">' + escHtml(d.quality || 'MP3') + '</span>' +
                '</div></button></li>';
        });
        html += '</ul>';
    }

    html += '<button class="media-dl-confirm-btn" id="dlConfirmBtn_' + escAttr(wrapId) + '" ' +
            'onclick="confirmDownload(\'' + escAttr(wrapId) + '\')">' +
            ICON_DL + ' <span>Download</span>' +
            '</button>';

    html += '</div>';
    return html;
}

// ── SELECT ITEM ────────────────────────────────────────────────
window.selectDownloadItem = function (btn) {
    var wrapId = btn.getAttribute('data-wrap');
    var idx    = parseInt(btn.getAttribute('data-idx'));

    var card = document.getElementById('card_' + wrapId);
    if (card) {
        card.querySelectorAll('.media-dl-btn').forEach(function (b) {
            b.classList.remove('media-dl-btn--selected');
        });
    }

    btn.classList.add('media-dl-btn--selected');
    _selectedDownload[wrapId] = idx;
};

// ── CONFIRM DOWNLOAD ───────────────────────────────────────────
window.confirmDownload = function (wrapId) {
    var idx = _selectedDownload[wrapId];
    if (idx === undefined || idx === null) {
        showWarningToast('Pilih resolusi dulu sebelum download!');
        return;
    }

    var downloads = _downloadsStore[wrapId];
    if (!downloads || !downloads[idx]) {
        showWarningToast('Pilih resolusi dulu sebelum download!');
        return;
    }

    var d   = downloads[idx];
    var btn = document.getElementById('dlConfirmBtn_' + wrapId);
    if (!btn) return;

    triggerProxyDownload(btn, d.url, d.filename);
};

// ── DOWNLOADS STORE ────────────────────────────────────────────
var _downloadsStore = {};

// ── MEDIA CARD ─────────────────────────────────────────────────
function buildMediaCard(wrapId, options) {
    var wrap = document.getElementById(wrapId);
    if (!wrap) return;

    _downloadsStore[wrapId] = options.downloads || [];
    delete _selectedDownload[wrapId];

    var thumbSection = '';
    if (options.thumb) {
        thumbSection =
            '<div class="media-thumb-wrap" id="thumbWrap_' + escAttr(wrapId) + '" ' +
            'onclick="playMediaInline(\'' + escAttr(wrapId) + '\',\'' + escAttr(options.videoUrl || '') + '\')">' +
                '<img class="media-thumb-img" src="' + escAttr(options.thumb) + '" alt="thumbnail" ' +
                'loading="lazy" onerror="this.parentNode.style.display=\'none\'">' +
                (options.videoUrl
                    ? '<div class="media-play-btn"><div class="media-play-circle">' + ICON_PLAY + '</div></div>'
                    : '') +
            '</div>';
    }

    var infoSection = '';
    if (options.title || options.author) {
        infoSection = '<div class="media-info">';
        if (options.title)  infoSection += '<div class="media-info-title">'  + escHtml(options.title)  + '</div>';
        if (options.author) infoSection += '<div class="media-info-author">' + escHtml(options.author) + '</div>';
        infoSection += '</div>';
    }

    wrap.innerHTML =
        '<div class="media-result-card" id="card_' + escAttr(wrapId) + '">' +
            thumbSection + infoSection +
            (options.stats || '') +
            buildDownloadList(options.downloads, wrapId) +
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
    setMainBtn('tiktok', true);
    var pg = createProgress('tiktokProgressWrap', 'Mengambil video TikTok');
    pg.crawl(8, 80, 6000, 'Menghubungi server...');

    Promise.all([
        fetch(SIPUTZX_BASE + '/api/d/tiktok/v2?url=' + encodeURIComponent(link))
            .then(function (r) { return r.ok ? r.json() : Promise.resolve(null); })
            .catch(function () { return null; }),
        fetch(SIPUTZX_BASE + '/api/d/ummy?url=' + encodeURIComponent(link))
            .then(function (r) {
                if (r.status === 429) throw new Error('HTTP 429');
                if (!r.ok) throw new Error('HTTP ' + r.status);
                return r.json();
            })
    ])
    .then(function (results) {
        pg.set(90, 'Memproses data...');

        var statRes = results[0];
        var ummyRes = results[1];

        if (!ummyRes || !ummyRes.status || !ummyRes.data) {
            throw new Error('Data tidak ditemukan / link tidak valid.');
        }

        var u    = ummyRes.data;
        var meta = u.meta || {};
        var stat = (statRes && statRes.status && statRes.data) ? statRes.data : null;

        var stats = '';
        if (stat) {
            stats = buildStats([
                { icon: ICON_EYE,   value: safeStatVal(stat.play_count)    },
                { icon: ICON_LIKE,  value: safeStatVal(stat.like_count)    },
                { icon: ICON_CMT,   value: safeStatVal(stat.comment_count) },
                { icon: ICON_SHARE, value: safeStatVal(stat.share_count)   },
                { icon: ICON_TIME,  value: fmtDuration(stat.duration)      },
            ]);
        }

        var rawUrls   = (u.url || []).filter(function (f) { return f.url; });
        if (rawUrls.length === 0) throw new Error('Tidak ada format yang tersedia.');

        var videoUrls = rawUrls.filter(function (f) { return f.type !== 'mp3' && f.ext !== 'mp3'; });
        var mp3Urls   = rawUrls.filter(function (f) { return f.type === 'mp3'  || f.ext === 'mp3'; });

        videoUrls.sort(function (a, b) {
            return (parseInt(b.subname) || 0) - (parseInt(a.subname) || 0);
        });

        var downloads  = [];
        var audioItems = [];

        videoUrls.forEach(function (f, i) {
            var qLabel = f.subname ? f.subname + 'p' : (f.name || 'MP4');
            downloads.push({
                label:    'Video TikTok',
                url:      f.url,
                quality:  qLabel,
                filename: 'tiktok_' + (f.subname || i) + '.mp4',
                isBest:   i === 0,
                isAudio:  false,
            });
        });

        mp3Urls.forEach(function (f) {
            audioItems.push({
                label:    'Audio (MP3)',
                url:      f.url,
                quality:  'MP3',
                filename: 'tiktok_audio.mp3',
                isBest:   false,
                isAudio:  true,
            });
        });

        var allDownloads = downloads.concat(audioItems);
        var videoUrl     = videoUrls.length > 0 ? videoUrls[0].url : '';
        var author       = (meta.author && meta.author.unique_id)
                           ? '@' + meta.author.unique_id
                           : (stat ? '@' + stat.author_nickname : '');

        pg.done('Berhasil!');
        setMainBtn('tiktok', false);
        buildMediaCard('tiktokResultWrap', {
            thumb:     u.thumb || '',
            title:     meta.title || (stat && stat.text) || 'TikTok Video',
            author:    author,
            stats:     stats,
            downloads: allDownloads,
            videoUrl:  videoUrl,
        });
        showToast('Video TikTok siap!', 'success');
        incrementUsage();
    })
    .catch(function (err) {
        var status = parseHttpStatus(err.message);
        var msg    = friendlyError(status, err.message);
        pg.error('Gagal: ' + msg);
        showMediaError('tiktokResultWrap', msg, 'tiktok');
    });
};

// ── YOUTUBE ────────────────────────────────────────────────────
window.downloadYoutube = function () {
    var link = document.getElementById('youtubeLink').value.trim();
    if (!link) { showToast('Masukkan link dulu!', 'error'); return; }

    document.getElementById('youtubeResultWrap').innerHTML = '';
    setMainBtn('youtube', true);
    var pg = createProgress('youtubeProgressWrap', 'Mengambil video YouTube');
    pg.crawl(8, 75, 9000, 'Menghubungi server...');

    fetch(SIPUTZX_BASE + '/api/d/ummy?url=' + encodeURIComponent(link))
    .then(function (res) {
        if (res.status === 429) throw new Error('HTTP 429');
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
    })
    .then(function (json) {
        pg.set(90, 'Memproses format video...');
        if (!json.status || !json.data) throw new Error('Data tidak ditemukan / link tidak valid.');
        var d    = json.data;
        var meta = d.meta || {};

        var all = (d.url || []).filter(function (f) { return f.downloadable === true && f.url; });

        var videoFormats = all.filter(function (f) {
            return f.type !== 'audio' && !String(f.quality || '').toLowerCase().includes('audio');
        });
        var audioFormats = all.filter(function (f) {
            return f.type === 'audio' || String(f.quality || '').toLowerCase().includes('audio');
        });

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

        var bestVideo = videoFormats[0] || audioFormats[0];
        var videoUrl  = bestVideo ? bestVideo.url : '';
        var thumbUrl  = d.thumb || (meta.thumbnail && meta.thumbnail[0] && meta.thumbnail[0].url) || '';

        var stats = buildStats([
            { icon: ICON_EYE,  value: safeStatVal(meta.viewCount)    },
            { icon: ICON_LIKE, value: safeStatVal(meta.likeCount)    },
            { icon: ICON_CMT,  value: safeStatVal(meta.commentCount) },
            { icon: ICON_TIME, value: safeStatVal(meta.duration)     },
        ]);

        pg.done('Berhasil!');
        setMainBtn('youtube', false);
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
        var status = parseHttpStatus(err.message);
        var msg    = friendlyError(status, err.message);
        pg.error('Gagal: ' + msg);
        showMediaError('youtubeResultWrap', msg, 'youtube');
    });
};

// ── INSTAGRAM ──────────────────────────────────────────────────
window.downloadInstagram = function () {
    var link = document.getElementById('instagramLink').value.trim();
    if (!link) { showToast('Masukkan link dulu!', 'error'); return; }

    document.getElementById('instagramResultWrap').innerHTML = '';
    setMainBtn('instagram', true);
    var pg = createProgress('instagramProgressWrap', 'Mengambil media Instagram');
    pg.crawl(8, 78, 7000, 'Menghubungi server...');

    fetch(SIPUTZX_BASE + '/api/d/ummy?url=' + encodeURIComponent(link))
    .then(function (res) {
        if (res.status === 429) throw new Error('HTTP 429');
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
    })
    .then(function (json) {
        pg.set(90, 'Memproses media...');
        if (!json.status || !json.data) throw new Error('Data tidak ditemukan / link tidak valid.');
        var d    = json.data;
        var meta = d.meta || {};

        var urls = (d.url || []).filter(function (u) { return u.url; });
        if (urls.length === 0) throw new Error('Tidak ada media yang bisa didownload.');

        urls.sort(function (a, b) { return (parseInt(b.quality) || 0) - (parseInt(a.quality) || 0); });

        var downloads  = [];
        var audioItems = [];

        urls.forEach(function (u, i) {
            var isAudio = u.type === 'audio' || (u.url && u.url.includes('.mp3'));
            var isVideo = u.type === 'video' || (u.url && u.url.includes('.mp4'));
            var ext     = isAudio ? 'mp3' : (isVideo ? 'mp4' : (u.subname || 'file'));
            var qLabel  = u.quality
                ? (parseInt(u.quality) ? u.quality + 'p' : u.quality)
                : (u.subname || (isAudio ? 'MP3' : 'HD'));

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

        var allDownloads = downloads.concat(audioItems);
        var firstVideo   = urls.find(function (u) {
            return u.type === 'video' || (u.url && u.url.includes('.mp4'));
        });
        var videoUrl = firstVideo ? firstVideo.url : '';

        var title = meta.title || meta.caption || 'Instagram Media';
        if (title.length > 80) title = title.substring(0, 80) + '...';

        var stats = buildStats([
            { icon: ICON_LIKE, value: safeStatVal(meta.likeCount)    },
            { icon: ICON_CMT,  value: safeStatVal(meta.commentCount) },
            { icon: ICON_EYE,  value: safeStatVal(meta.viewCount)    },
        ]);

        pg.done('Berhasil!');
        setMainBtn('instagram', false);
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
        var status = parseHttpStatus(err.message);
        var msg    = friendlyError(status, err.message);
        pg.error('Gagal: ' + msg);
        showMediaError('instagramResultWrap', msg, 'instagram');
    });
};

// ── FACEBOOK ───────────────────────────────────────────────────
window.downloadFacebook = function () {
    var link = document.getElementById('facebookLink').value.trim();
    if (!link) { showToast('Masukkan link dulu!', 'error'); return; }

    document.getElementById('facebookResultWrap').innerHTML = '';
    setMainBtn('facebook', true);
    var pg = createProgress('facebookProgressWrap', 'Mengambil video Facebook');
    pg.crawl(8, 82, 6000, 'Menghubungi server...');

    fetch(SIPUTZX_BASE + '/api/d/facebook?url=' + encodeURIComponent(link))
    .then(function (res) {
        if (res.status === 429) throw new Error('HTTP 429');
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
    })
    .then(function (json) {
        pg.set(90, 'Memproses data...');
        if (!json.status || !json.data) throw new Error('Data tidak ditemukan / link tidak valid.');
        var d = json.data;

        var rawItems = (d.downloads || []).filter(function (x) { return x.url; });
        if (rawItems.length === 0) throw new Error('Tidak ada video yang bisa didownload.');

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

        var stats = buildStats([{ icon: ICON_TIME, value: safeStatVal(d.duration) }]);

        pg.done('Berhasil!');
        setMainBtn('facebook', false);
        buildMediaCard('facebookResultWrap', {
            thumb:     d.thumbnail || '',
            title:     d.title || 'Facebook Video',
            author:    '',
            stats:     stats,
            downloads: downloads,
            videoUrl:  rawItems[0] ? rawItems[0].url : '',
        });
        showToast('Video Facebook siap!', 'success');
        incrementUsage();
    })
    .catch(function (err) {
        var status = parseHttpStatus(err.message);
        var msg    = friendlyError(status, err.message);
        pg.error('Gagal: ' + msg);
        showMediaError('facebookResultWrap', msg, 'facebook');
    });
};

// ── TEMPLATES ─────────────────────────────────────────────────
window.getTemplate_tiktok = function(tool) {
    return '<div class="tool-desc">' + tool.desc + '</div>' +
        '<label>Link TikTok</label>' +
        inputWithClear('tiktokLink', 'text', 'https://www.tiktok.com/@user/video/...', 'onkeydown="if(event.key===\'Enter\') downloadTiktok()"') +
        '<button class="btn-primary" onclick="downloadTiktok()">Download</button>' +
        '<div id="tiktokProgressWrap"></div>' +
        '<div id="tiktokResultWrap"></div>' +
        '<small style="color:var(--text-muted); display:block; margin-top:8px; font-size:0.75rem;">Hanya untuk konten publik & legal.</small>';
};

window.getTemplate_youtube = function(tool) {
    return '<div class="tool-desc">' + tool.desc + '</div>' +
        '<label>Link YouTube</label>' +
        inputWithClear('youtubeLink', 'text', 'https://youtube.com/watch?v=...', 'onkeydown="if(event.key===\'Enter\') downloadYoutube()"') +
        '<button class="btn-primary" onclick="downloadYoutube()">Download</button>' +
        '<div id="youtubeProgressWrap"></div>' +
        '<div id="youtubeResultWrap"></div>' +
        '<small style="color:var(--text-muted); display:block; margin-top:8px; font-size:0.75rem;">Hanya untuk konten publik & legal.</small>';
};

window.getTemplate_instagram = function(tool) {
    return '<div class="tool-desc">' + tool.desc + '</div>' +
        '<label>Link Instagram</label>' +
        inputWithClear('instagramLink', 'text', 'https://www.instagram.com/p/...', 'onkeydown="if(event.key===\'Enter\') downloadInstagram()"') +
        '<button class="btn-primary" onclick="downloadInstagram()">Download</button>' +
        '<div id="instagramProgressWrap"></div>' +
        '<div id="instagramResultWrap"></div>' +
        '<small style="color:var(--text-muted); display:block; margin-top:8px; font-size:0.75rem;">Hanya untuk konten publik & legal.</small>';
};

window.getTemplate_facebook = function(tool) {
    return '<div class="tool-desc">' + tool.desc + '</div>' +
        '<label>Link Facebook</label>' +
        inputWithClear('facebookLink', 'text', 'https://www.facebook.com/.../videos/...', 'onkeydown="if(event.key===\'Enter\') downloadFacebook()"') +
        '<button class="btn-primary" onclick="downloadFacebook()">Download</button>' +
        '<div id="facebookProgressWrap"></div>' +
        '<div id="facebookResultWrap"></div>' +
        '<small style="color:var(--text-muted); display:block; margin-top:8px; font-size:0.75rem;">Hanya untuk konten publik & legal.</small>';
};
