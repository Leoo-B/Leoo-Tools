// ==========================================
// CORE – Toast, Navbar, Progress, Render, Init
// ==========================================

// ── CSRF TOKEN ─────────────────────────────────────────────────
var _csrfToken = null;

function fetchCsrfToken() {
    return fetch('/api/token')
        .then(function (res) { return res.json(); })
        .then(function (data) {
            if (data.status && data.token) {
                _csrfToken = data.token;
            }
        })
        .catch(function () {
            // Gagal fetch token — API call akan ditolak server, biarkan saja
            _csrfToken = null;
        });
}

// Refresh token setiap 4.5 menit (sebelum window 5 menit habis)
setInterval(fetchCsrfToken, 4.5 * 60 * 1000);

// Helper: tambah CSRF header ke fetch options
function withCsrf(options) {
    options = options || {};
    options.headers = options.headers || {};
    if (_csrfToken) options.headers['X-CSRF-Token'] = _csrfToken;
    return options;
}

// ── TOAST ──────────────────────────────────────────────────────
window.showToast = function (message, type) {
    var container = document.getElementById('toastContainer');
    if (!container) return;
    var current = container.querySelectorAll('.toast');
    if (current.length >= 3) {
        dismissToast(current[0]);
    }
    var toast = document.createElement('div');
    toast.className = 'toast' + (type === 'success' ? ' toast-success' : type === 'error' ? ' toast-error' : '');
    toast.textContent = message;
    container.appendChild(toast);
    var timer = setTimeout(function () { dismissToast(toast); }, 2800);
    toast._dismissTimer = timer;
};

function dismissToast(toast) {
    if (!toast || toast._dismissed) return;
    toast._dismissed = true;
    if (toast._dismissTimer) clearTimeout(toast._dismissTimer);
    toast.classList.add('toast-exit');
    setTimeout(function () {
        if (toast.parentNode) toast.remove();
    }, 380);
}

// ── COPY TO CLIPBOARD HELPER ───────────────────────────────────
window.copyResultBox = function (btnEl, resultId) {
    var el = document.getElementById(resultId);
    if (!el) return;
    var text = (el.innerText || el.textContent || '').trim();
    if (!text) { showToast('Tidak ada teks untuk disalin', 'error'); return; }
    navigator.clipboard.writeText(text).then(function () {
        showToast('Berhasil disalin!', 'success');
        btnEl.innerHTML = '<i data-lucide="check"></i>';
        btnEl.style.color = 'var(--toast-success-text)';
        if (typeof lucide !== 'undefined') lucide.createIcons();
        setTimeout(function () {
            btnEl.innerHTML = '<i data-lucide="copy"></i>';
            btnEl.style.color = '';
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }, 1800);
    }).catch(function () {
        showToast('Gagal menyalin', 'error');
    });
};

// ── RESULT BOX WITH COPY BUTTON ────────────────────────────────
function resultBoxWithCopy(id, placeholder) {
    return '<div style="position:relative;">' +
        '<div class="result-box" id="' + id + '">' + (placeholder || '') + '</div>' +
        '<button onclick="copyResultBox(this,\'' + id + '\')" title="Salin" ' +
        'style="position:absolute;top:9px;right:10px;background:transparent;border:none;' +
        'cursor:pointer;color:var(--text-muted);padding:2px;display:flex;align-items:center;' +
        'transition:color var(--dur-fast) var(--ease-out);" ' +
        'onmouseenter="this.style.color=\'var(--accent-glow)\'" ' +
        'onmouseleave="this.style.color=\'var(--text-muted)\'">' +
        '<i data-lucide="copy" style="width:14px;height:14px;"></i>' +
        '</button>' +
        '</div>';
}

// ── INPUT WITH CLEAR BUTTON ────────────────────────────────────
function inputWithClear(id, type, placeholder, extraAttrs) {
    type = type || 'text';
    extraAttrs = extraAttrs || '';
    return '<div style="position:relative;">' +
        '<input type="' + type + '" id="' + id + '" placeholder="' + (placeholder || '') + '" ' + extraAttrs +
        ' style="padding-right:38px;">' +
        '<button onclick="clearInput(\'' + id + '\')" title="Hapus" ' +
        'style="position:absolute;top:50%;right:10px;transform:translateY(-50%);background:transparent;' +
        'border:none;cursor:pointer;color:var(--text-muted);padding:2px;display:flex;align-items:center;' +
        'transition:color var(--dur-fast) var(--ease-out);" ' +
        'onmouseenter="this.style.color=\'var(--accent-rose)\'" ' +
        'onmouseleave="this.style.color=\'var(--text-muted)\'">' +
        '<i data-lucide="x" style="width:14px;height:14px;"></i>' +
        '</button>' +
        '</div>';
}

function textareaWithClear(id, placeholder, extraStyle) {
    return '<div style="position:relative;">' +
        '<textarea id="' + id + '" placeholder="' + (placeholder || '') + '" ' +
        'style="padding-right:36px;' + (extraStyle || '') + '"></textarea>' +
        '<button onclick="clearInput(\'' + id + '\')" title="Hapus" ' +
        'style="position:absolute;top:10px;right:10px;background:transparent;' +
        'border:none;cursor:pointer;color:var(--text-muted);padding:2px;display:flex;align-items:center;' +
        'transition:color var(--dur-fast) var(--ease-out);" ' +
        'onmouseenter="this.style.color=\'var(--accent-rose)\'" ' +
        'onmouseleave="this.style.color=\'var(--text-muted)\'">' +
        '<i data-lucide="x" style="width:14px;height:14px;"></i>' +
        '</button>' +
        '</div>';
}

window.clearInput = function (id) {
    var el = document.getElementById(id);
    if (el) { el.value = ''; el.focus(); }
};

// ── HONEST PROGRESS BAR ────────────────────────────────────────
window.createProgress = function (wrapId, label) {
    var wrap = document.getElementById(wrapId);
    if (!wrap) return { set: function(){}, crawl: function(){}, done: function(){}, error: function(){}, cancel: function(){} };

    var abortController = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var cancelled = false;

    wrap.innerHTML =
        '<div class="progress-wrap visible">' +
            '<div class="progress-header">' +
                '<span class="progress-label">' + (label || 'Memproses...') + '</span>' +
                '<div style="display:flex;align-items:center;gap:10px;">' +
                    '<span class="progress-pct" id="pg_pct_' + wrapId + '">0%</span>' +
                    '<button class="progress-cancel-btn" id="pg_cancel_' + wrapId + '" aria-label="Batalkan proses">Batal</button>' +
                '</div>' +
            '</div>' +
            '<div class="progress-track">' +
                '<div class="progress-fill" id="pg_fill_' + wrapId + '" style="width:0%"></div>' +
            '</div>' +
            '<div class="progress-status" id="pg_status_' + wrapId + '">&nbsp;</div>' +
        '</div>';

    var fillEl    = document.getElementById('pg_fill_' + wrapId);
    var pctEl     = document.getElementById('pg_pct_' + wrapId);
    var statusEl  = document.getElementById('pg_status_' + wrapId);
    var cancelBtn = document.getElementById('pg_cancel_' + wrapId);
    var crawlTimer = null;
    var current = 0;

    function setVal(pct, statusText) {
        pct = Math.max(0, Math.min(100, Math.round(pct)));
        current = pct;
        if (fillEl)  fillEl.style.width  = pct + '%';
        if (pctEl)   pctEl.textContent   = pct + '%';
        if (statusEl && statusText) statusEl.textContent = statusText;
    }

    function clearCrawl() {
        if (crawlTimer) { clearInterval(crawlTimer); crawlTimer = null; }
    }

    function crawl(from, to, durationMs, statusText) {
        clearCrawl();
        setVal(from, statusText || null);
        var steps    = Math.max(1, Math.floor(durationMs / 120));
        var stepSize = (to - from) / steps;
        var val      = from;
        crawlTimer = setInterval(function () {
            val += stepSize;
            if (val >= to) { val = to; clearCrawl(); }
            setVal(val, null);
        }, 120);
    }

    function done(statusText) {
        clearCrawl();
        if (cancelBtn) cancelBtn.style.display = 'none';
        setVal(100, statusText || 'Selesai!');
        if (fillEl) {
            fillEl.style.background = 'linear-gradient(90deg, #22c55e, #4ade80)';
            fillEl.style.boxShadow  = '0 0 12px rgba(74,222,128,0.4)';
        }
        var pw = wrap.querySelector('.progress-wrap');
        if (pw) {
            pw.classList.add('progress-done-flash');
            setTimeout(function () {
                pw.classList.remove('progress-done-flash');
                pw.classList.add('progress-done-blink');
                setTimeout(function () {
                    pw.classList.remove('progress-done-blink');
                    pw.classList.add('progress-done-out');
                    setTimeout(function () {
                        pw.style.display = 'none';
                        pw.classList.remove('progress-done-out');
                    }, 500);
                }, 320);
            }, 180);
        }
    }

    function error(statusText) {
        clearCrawl();
        if (cancelBtn) cancelBtn.style.display = 'none';
        if (fillEl) {
            fillEl.style.background = 'linear-gradient(90deg, #ef4444, #f87171)';
            fillEl.style.boxShadow  = '0 0 12px rgba(239,68,68,0.4)';
        }
        setVal(current, statusText || 'Terjadi kesalahan.');
    }

    function cancel() {
        if (cancelled) return;
        cancelled = true;
        clearCrawl();
        if (abortController) abortController.abort();
        if (fillEl) {
            fillEl.style.background = 'linear-gradient(90deg, #f59e0b, #fbbf24)';
            fillEl.style.boxShadow  = '0 0 12px rgba(245,158,11,0.4)';
        }
        setVal(current, 'Dibatalkan.');
        if (cancelBtn) cancelBtn.style.display = 'none';
        setTimeout(function () {
            var pw = wrap.querySelector('.progress-wrap');
            if (pw) { pw.style.transition = 'opacity 0.5s ease'; pw.style.opacity = '0'; }
            setTimeout(function () { if (pw) pw.style.display = 'none'; }, 520);
        }, 1000);
    }

    if (cancelBtn) cancelBtn.addEventListener('click', function () { cancel(); });

    setVal(8, 'Menghubungi server...');

    return {
        set: setVal,
        crawl: crawl,
        done: done,
        error: error,
        cancel: cancel,
        signal: abortController ? abortController.signal : null,
        isCancelled: function () { return cancelled; }
    };
};

// ── CEK APAKAH ADA PROGRESS AKTIF ─────────────────────────────
function hasActiveProgress() {
    return !!document.querySelector('.progress-wrap.visible');
}

// ── CANCEL SEMUA PROGRESS ──────────────────────────────────────
function cancelAllProgress() {
    document.querySelectorAll('.progress-cancel-btn').forEach(function (btn) {
        if (btn.style.display !== 'none') btn.click();
    });
}

// ── MODAL KONFIRMASI ───────────────────────────────────────────
var _confirmCallback = null;

function showConfirmModal(onLeave) {
    _confirmCallback = onLeave;
    var overlay = document.getElementById('confirmOverlay');
    if (!overlay) { onLeave(); return; }
    overlay.classList.add('active');
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function hideConfirmModal() {
    var overlay = document.getElementById('confirmOverlay');
    if (overlay) overlay.classList.remove('active');
    _confirmCallback = null;
}

// Tombol "Tetap di Sini"
document.addEventListener('DOMContentLoaded', function () {
    var stayBtn  = document.getElementById('confirmStay');
    var leaveBtn = document.getElementById('confirmLeave');
    if (stayBtn)  stayBtn.addEventListener('click', hideConfirmModal);
    if (leaveBtn) leaveBtn.addEventListener('click', function () {
        hideConfirmModal();
        cancelAllProgress();
        if (typeof _confirmCallback === 'function') _confirmCallback();
    });
});

// ── NAVBAR SCROLL COLLAPSE ──────────────────────────────────────
(function () {
    var wrapper         = document.getElementById('navbarWrapper');
    var scrollBtn       = document.getElementById('scrollTopBtn');
    var mainSearch      = document.getElementById('searchInput');
    var collapsedSearch = document.getElementById('searchInputCollapsed');
    var COLLAPSE_THRESHOLD = 60;

    if (mainSearch && collapsedSearch) {
        mainSearch.addEventListener('input', function () { collapsedSearch.value = this.value; });
        collapsedSearch.addEventListener('input', function () { mainSearch.value = this.value; });
    }

    window.addEventListener('scroll', function () {
        var y = window.scrollY;
        if (wrapper) {
            if (y > COLLAPSE_THRESHOLD) wrapper.classList.add('is-collapsed', 'scrolled');
            else {
                wrapper.classList.remove('is-collapsed');
                if (y === 0) wrapper.classList.remove('scrolled');
            }
        }
        if (scrollBtn) {
            if (y > 300) scrollBtn.classList.add('show');
            else scrollBtn.classList.remove('show');
        }
    }, { passive: true });

    if (scrollBtn) scrollBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();

// ── SEARCH COMBOBOX ────────────────────────────────────────────
(function () {
    function getInputs() {
        return [
            document.getElementById('searchInput'),
            document.getElementById('searchInputCollapsed'),
            document.getElementById('heroSearchInput')
        ].filter(Boolean);
    }

    function getOrCreateDropdown(inputEl) {
        var id = 'dd_' + inputEl.id;
        var existing = document.getElementById(id);
        if (existing) return existing;
        var dd = document.createElement('div');
        dd.id = id;
        dd.className = 'search-dropdown';
        dd.style.display = 'none';
        dd.style.position = 'fixed';
        document.body.appendChild(dd);
        return dd;
    }

    function closeAll() {
        document.querySelectorAll('.search-dropdown').forEach(function (dd) {
            dd.style.display = 'none';
        });
    }

    function renderDropdown(dd, query, inputEl) {
        if (!query) { dd.style.display = 'none'; return; }
        var q = query.toLowerCase();
        var matched = tools.filter(function (t) { return t.name.toLowerCase().includes(q); });

        if (matched.length === 0) {
            dd.innerHTML = '<div class="search-dropdown-empty">Tidak ada tool ditemukan</div>';
        } else {
            dd.innerHTML = matched.map(function (t) {
                var iconHtml = t.iconType === 'simple'
                    ? '<img src="https://cdn.simpleicons.org/' + t.icon + '" width="14" height="14" style="opacity:.7;filter:brightness(0) invert(1);flex-shrink:0;">'
                    : '<i data-lucide="' + t.icon + '"></i>';
                return '<div class="search-dropdown-item" data-id="' + t.id + '">' +
                    iconHtml + '<span>' + t.name + '</span></div>';
            }).join('');
        }

        var rect = inputEl.getBoundingClientRect();
        dd.style.top   = (rect.bottom + 8) + 'px';
        dd.style.left  = rect.left + 'px';
        dd.style.width = rect.width + 'px';
        dd.style.display = 'block';
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    function scrollAndHighlight(toolId) {
        var card = document.querySelector('.tool-card[onclick*="\'' + toolId + '\'"]');
        if (card) {
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            card.classList.add('highlighted');
            setTimeout(function () { card.classList.remove('highlighted'); }, 1000);
            return true;
        }
        return false;
    }

    function selectTool(toolId) {
        getInputs().forEach(function (inp) { inp.value = ''; });
        closeAll();
        var found = scrollAndHighlight(toolId);
        if (!found) {
            document.querySelectorAll('.chip').forEach(function (c) { c.classList.remove('active'); });
            var allChip = document.querySelector('.chip[data-cat="all"]');
            if (allChip) allChip.classList.add('active');
            if (typeof renderTools === 'function') renderTools();
            setTimeout(function () { scrollAndHighlight(toolId); }, 320);
        }
    }

    // ── RESET PENCARIAN (ganti auto-restore) ──────────────────
    window.resetSearch = function () {
        getInputs().forEach(function (inp) { inp.value = ''; });
        closeAll();
        document.querySelectorAll('.chip').forEach(function (c) { c.classList.remove('active'); });
        var allChip = document.querySelector('.chip[data-cat="all"]');
        if (allChip) allChip.classList.add('active');
        if (typeof renderTools === 'function') renderTools();
    };

    function showEmptyState() {
        var grid = document.getElementById('toolsGrid');
        if (!grid) return;
        grid.innerHTML =
            '<div class="empty-state">' +
                '<div class="empty-state-box">' +
                    '<svg class="empty-state-icon" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">' +
                        '<rect x="8" y="16" width="48" height="36" rx="6" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 3"/>' +
                        '<circle cx="32" cy="28" r="6" stroke="currentColor" stroke-width="1.5"/>' +
                        '<path d="M20 44c0-6.627 5.373-10 12-10s12 3.373 12 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' +
                        '<path d="M28 8h8M24 8h1M39 8h1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' +
                    '</svg>' +
                    '<p class="empty-state-title">Tidak ada tool ditemukan</p>' +
                    '<p class="empty-state-desc">Coba kata kunci lain atau pilih kategori berbeda.</p>' +
                    '<button class="btn-reset-search" onclick="resetSearch()">Reset Pencarian</button>' +
                '</div>' +
            '</div>';
    }

    function initCombobox() {
        getInputs().forEach(function (inputEl) {
            var dd = getOrCreateDropdown(inputEl);
            if (!dd) return;

            inputEl.addEventListener('input', function () {
                var val = inputEl.value;
                getInputs().forEach(function (other) {
                    if (other !== inputEl) other.value = val;
                });
                renderDropdown(dd, val.trim(), inputEl);
                document.querySelectorAll('.search-dropdown').forEach(function (other) {
                    if (other !== dd) other.style.display = 'none';
                });
            });

            inputEl.addEventListener('keydown', function (e) {
                if (e.key === 'Escape') { closeAll(); inputEl.blur(); return; }
                if (e.key === 'Enter') {
                    var query = inputEl.value.trim();
                    if (!query) return;
                    var matched = tools.filter(function (t) {
                        return t.name.toLowerCase().includes(query.toLowerCase());
                    });
                    if (matched.length > 0) {
                        e.preventDefault();
                        selectTool(matched[0].id);
                    } else {
                        e.preventDefault();
                        getInputs().forEach(function (inp) { inp.value = ''; });
                        closeAll();
                        showEmptyState();
                    }
                }
            });

            dd.addEventListener('mousedown', function (e) {
                var item = e.target.closest('.search-dropdown-item');
                if (!item) return;
                e.preventDefault();
                selectTool(item.dataset.id);
            });
        });

        document.addEventListener('mousedown', function (e) {
            if (!e.target.closest('.nav-search')) closeAll();
        });
    }

    var _initTimer = setInterval(function () {
        if (typeof tools !== 'undefined' && document.getElementById('searchInput')) {
            clearInterval(_initTimer);
            initCombobox();
        }
    }, 100);
})();

// ── ICON HELPER ────────────────────────────────────────────────
function getSimpleIcon(slug, size) {
    size = size || 26;
    return '<img class="si-icon" src="https://cdn.simpleicons.org/' + slug + '" ' +
           'width="' + size + '" height="' + size + '" alt="' + slug + '" loading="lazy">';
}

// ── DATA TOOLS ─────────────────────────────────────────────────
var tools = [
    { name: 'Password Generator',      icon: 'key-round',         iconType: 'lucide', cat: 'utility', desc: 'Bikin password super kuat.',                   id: 'password'  },
    { name: 'JSON Formatter',          icon: 'braces',            iconType: 'lucide', cat: 'dev',     desc: 'Rapihin & validasi JSON.',                     id: 'json'      },
    { name: 'Unit Converter',          icon: 'thermometer',       iconType: 'lucide', cat: 'utility', desc: 'Konversi suhu, panjang, berat, dan lainnya.',  id: 'unit'      },
    { name: 'Base64 Encoder/Decoder',  icon: 'lock-keyhole',      iconType: 'lucide', cat: 'text',    desc: 'Encode/decode teks base64.',                   id: 'base64'    },
    { name: 'Text Analyzer',           icon: 'text-cursor-input', iconType: 'lucide', cat: 'text',    desc: 'Hitung huruf, kata, kalimat.',                 id: 'counter'   },
    { name: 'Color Picker Pro',        icon: 'pipette',           iconType: 'lucide', cat: 'utility', desc: 'Pilih warna + salin kode.',                    id: 'color'     },
    { name: 'TikTok Downloader',       icon: 'tiktok',            iconType: 'simple', cat: 'utility', desc: 'Download video TikTok tanpa watermark.',       id: 'tiktok'    },
    { name: 'YouTube Downloader',      icon: 'youtube',           iconType: 'simple', cat: 'utility', desc: 'Download video YouTube.',                      id: 'youtube'   },
    { name: 'Instagram Downloader',    icon: 'instagram',         iconType: 'simple', cat: 'utility', desc: 'Download foto/video Instagram.',               id: 'instagram' },
    { name: 'Facebook Downloader',     icon: 'facebook',          iconType: 'simple', cat: 'utility', desc: 'Download video Facebook.',                     id: 'facebook'  },
    { name: 'Pengecekan Cuaca',        icon: 'cloud-sun',         iconType: 'lucide', cat: 'utility', desc: 'Cek cuaca kota mana pun.',                     id: 'weather'   },
    { name: 'URL Shortener',           icon: 'link',              iconType: 'lucide', cat: 'utility', desc: 'Pendekin link panjang jadi pendek.',           id: 'urlshort'  },
    { name: 'Image Enhancer',          icon: 'image-up',          iconType: 'lucide', cat: 'utility', desc: 'Ubah gambar jadi HD / upscale.',               id: 'image'     },
    { name: 'News Headline',           icon: 'newspaper',         iconType: 'lucide', cat: 'utility', desc: 'Berita terkini dari berbagai kategori.',       id: 'news'      },
];

// ── USAGE COUNTER ──────────────────────────────────────────────
var totalUsage = parseInt(localStorage.getItem('totalUsage')) || 0;
window.updateUsageCounter = function () {};
window.incrementUsage = function () {
    totalUsage += 1;
    localStorage.setItem('totalUsage', totalUsage);
};

// ── TOOL SCRIPT MAP ────────────────────────────────────────────
var toolScriptMap = {
    password:  'tools/password.js',
    json:      'tools/json.js',
    unit:      'tools/unit.js',
    base64:    'tools/base64.js',
    counter:   'tools/counter.js',
    color:     'tools/color.js',
    tiktok:    'tools/mediadownload.js',
    youtube:   'tools/mediadownload.js',
    instagram: 'tools/mediadownload.js',
    facebook:  'tools/mediadownload.js',
    weather:   'tools/weather.js',
    urlshort:  'tools/urlshort.js',
    image:     'tools/image.js',
    news:      'tools/news.js',
};

var loadedScripts = {};

function loadToolScript(toolId, callback) {
    var src = toolScriptMap[toolId];
    if (!src) return callback();
    if (loadedScripts[src]) return callback();
    var script = document.createElement('script');
    script.src = src;
    script.onload = function () { loadedScripts[src] = true; callback(); };
    script.onerror = function () { console.error('❌ Gagal memuat:', src); callback(); };
    document.body.appendChild(script);
}

// ── RENDER GRID ────────────────────────────────────────────────
window.renderTools = function () {
    var grid = document.getElementById('toolsGrid');
    var searchVal = ((document.getElementById('searchInput') || {}).value || '').toLowerCase();
    var activeChip = document.querySelector('.chip.active');
    var currentCat = activeChip ? activeChip.dataset.cat : 'all';

    var skelHtml = '';
    for (var i = 0; i < 6; i++) {
        skelHtml += '<div class="skeleton"><div class="skeleton-icon"></div><div class="skeleton-title"></div><div class="skeleton-desc"></div></div>';
    }
    grid.innerHTML = skelHtml;

    var filtered = tools.filter(function (t) {
        var matchCat    = currentCat === 'all' || t.cat === currentCat;
        var matchSearch = t.name.toLowerCase().includes(searchVal);
        return matchCat && matchSearch;
    });

    setTimeout(function () {
        if (filtered.length === 0) {
            grid.innerHTML =
                '<div class="empty-state">' +
                    '<div class="empty-state-box">' +
                        '<svg class="empty-state-icon" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">' +
                            '<rect x="8" y="16" width="48" height="36" rx="6" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 3"/>' +
                            '<circle cx="32" cy="28" r="6" stroke="currentColor" stroke-width="1.5"/>' +
                            '<path d="M20 44c0-6.627 5.373-10 12-10s12 3.373 12 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' +
                            '<path d="M28 8h8M24 8h1M39 8h1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' +
                        '</svg>' +
                        '<p class="empty-state-title">Tidak ada tool ditemukan</p>' +
                        '<p class="empty-state-desc">Coba kata kunci lain atau pilih kategori berbeda.</p>' +
                        '<button class="btn-reset-search" onclick="resetSearch()">Reset Pencarian</button>' +
                    '</div>' +
                '</div>';
        } else {
            var html = '';
            filtered.forEach(function (t) {
                var iconHtml = t.iconType === 'simple'
                    ? getSimpleIcon(t.icon, 26)
                    : '<i data-lucide="' + t.icon + '"></i>';
                html += '<button class="tool-card" onclick="openTool(\'' + t.id + '\')" aria-label="Buka ' + t.name + '">' +
                        '<span class="badge">' + t.cat + '</span>' +
                        iconHtml +
                        '<h4>' + t.name + '</h4>' +
                        '<p>' + t.desc + '</p>' +
                        '</button>';
            });
            grid.innerHTML = html;
        }
        if (typeof lucide !== 'undefined') lucide.createIcons();

        var cards = grid.querySelectorAll('.tool-card');
        cards.forEach(function (card) {
            card.addEventListener('mousemove', function (e) {
                var rect = card.getBoundingClientRect();
                card.style.setProperty('--mx', (e.clientX - rect.left) + 'px');
                card.style.setProperty('--my', (e.clientY - rect.top) + 'px');
            });
        });
    }, 100);
};

// ── OPEN TOOL ──────────────────────────────────────────────────
window.openTool = function (toolId) {
    var tool = tools.find(function (t) { return t.id === toolId; });
    if (!tool) return;

    localStorage.setItem('lastOpened', tool.name);
    document.body.classList.add('tool-open');

    // Spinner saat script loading
    var toolPage = document.getElementById('toolPage');
    var body     = document.getElementById('toolPageBody');
    toolPage.style.display = '';
    toolPage.classList.add('active');
    document.getElementById('toolPageTitle').textContent = tool.name;
    body.innerHTML =
        '<div style="display:flex;align-items:center;justify-content:center;padding:60px 0;">' +
            '<div class="tool-load-spinner"></div>' +
        '</div>';

    // Push URL state
    history.pushState({ tool: toolId }, '', '/?tool=' + toolId);

    loadToolScript(toolId, function () {
        _renderToolPage(toolId, tool);
    });
};

// ── RENDER TOOL PAGE ───────────────────────────────────────────
function _renderToolPage(toolId, tool) {
    var toolPage = document.getElementById('toolPage');
    toolPage.style.display = '';
    toolPage.classList.add('active');
    document.getElementById('toolPageTitle').textContent = tool.name;

    var body = document.getElementById('toolPageBody');
    var getTemplateFn = window['getTemplate_' + toolId];
    var html = typeof getTemplateFn === 'function'
        ? getTemplateFn(tool)
        : '<div class="tool-desc">' + tool.desc + '</div><p style="color:var(--text-muted);">Tool ini belum siap.</p>';

    body.innerHTML = html;
    if (typeof lucide !== 'undefined') lucide.createIcons();

    var children = body.children;
    for (var i = 0; i < children.length; i++) {
        (function (el, idx) {
            el.style.opacity    = '0';
            el.style.transform  = 'translateY(18px)';
            el.style.transition = 'none';
            setTimeout(function () {
                el.style.transition = 'opacity 0.38s cubic-bezier(0.16,1,0.3,1), transform 0.38s cubic-bezier(0.16,1,0.3,1)';
                el.style.opacity    = '1';
                el.style.transform  = 'translateY(0)';
            }, 60 + idx * 70);
        })(children[i], i);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── CLOSE TOOL ─────────────────────────────────────────────────
function _doCloseToolPage() {
    var toolPage = document.getElementById('toolPage');
    toolPage.classList.add('closing');
    setTimeout(function () {
        document.body.classList.remove('tool-open');
        toolPage.classList.remove('active', 'closing');
        toolPage.removeAttribute('style');
        var body = document.getElementById('toolPageBody');
        if (body) body.innerHTML = '';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 280);
}

window.closeToolPage = function () {
    if (hasActiveProgress()) {
        showConfirmModal(function () {
            history.pushState(null, '', '/');
            _doCloseToolPage();
        });
        return;
    }
    history.pushState(null, '', '/');
    _doCloseToolPage();
};

// ── POPSTATE (browser back/forward) ───────────────────────────
window.addEventListener('popstate', function (e) {
    if (e.state && e.state.tool) {
        // Forward ke tool
        var tool = tools.find(function (t) { return t.id === e.state.tool; });
        if (tool) {
            document.body.classList.add('tool-open');
            var toolPage = document.getElementById('toolPage');
            var body     = document.getElementById('toolPageBody');
            toolPage.style.display = '';
            toolPage.classList.add('active');
            document.getElementById('toolPageTitle').textContent = tool.name;
            body.innerHTML =
                '<div style="display:flex;align-items:center;justify-content:center;padding:60px 0;">' +
                    '<div class="tool-load-spinner"></div>' +
                '</div>';
            loadToolScript(e.state.tool, function () {
                _renderToolPage(e.state.tool, tool);
            });
        }
    } else {
        // Back ke home
        if (hasActiveProgress()) {
            // Cegah navigasi dulu, push state balik
            history.pushState(
                document.body.classList.contains('tool-open')
                    ? { tool: new URLSearchParams(location.search).get('tool') }
                    : null,
                '',
                location.href
            );
            showConfirmModal(function () {
                history.back();
            });
            return;
        }
        _doCloseToolPage();
    }
});

// ── INIT ───────────────────────────────────────────────────────
window.initAll = function () {
    // Fetch CSRF token pertama kali
    fetchCsrfToken();

    var theme  = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    var toggle = document.getElementById('themeToggle');

    function updateThemeIcon(t) {
        toggle.innerHTML = t === 'dark'
            ? '<i data-lucide="sun"></i>'
            : '<i data-lucide="moon"></i>';
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }
    updateThemeIcon(theme);

    toggle.addEventListener('click', function () {
        var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.body.classList.add('theme-transitioning');
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        updateThemeIcon(next);
        showToast(next === 'dark' ? '🌙 Mode Gelap' : '☀️ Mode Terang', 'success');
        setTimeout(function () { document.body.classList.remove('theme-transitioning'); }, 400);
    });

    document.querySelectorAll('.chip').forEach(function (chip) {
        chip.addEventListener('click', function () {
            document.querySelectorAll('.chip').forEach(function (c) { c.classList.remove('active'); });
            this.classList.add('active');
            renderTools();
        });
    });

    if (typeof lucide !== 'undefined') lucide.createIcons();
    renderTools();

    // Cek URL apakah ada ?tool=xxx saat pertama load
    var params = new URLSearchParams(window.location.search);
    var toolFromUrl = params.get('tool');
    if (toolFromUrl && tools.find(function (t) { return t.id === toolFromUrl; })) {
        // Tunggu splash selesai dulu — splash.js hide splash setelah hideDelay
        // Kita detect kapan splash hidden lewat MutationObserver
        var splash = document.getElementById('splash');
        if (!splash || splash.style.display === 'none') {
            openTool(toolFromUrl);
        } else {
            var observer = new MutationObserver(function () {
                if (splash.style.display === 'none' || splash.classList.contains('hide')) {
                    observer.disconnect();
                    setTimeout(function () { openTool(toolFromUrl); }, 100);
                }
            });
            observer.observe(splash, { attributes: true, attributeFilter: ['style', 'class'] });
        }
    }
};
