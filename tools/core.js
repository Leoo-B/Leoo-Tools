// ==========================================
// CORE – Toast, Navbar, Progress, Render, Init
// ==========================================

// ── TOAST ──────────────────────────────────────────────────────
window.showToast = function (message, type) {
    var container = document.getElementById('toastContainer');
    if (!container) return;
    var current = container.querySelectorAll('.toast');
    if (current.length >= 3) current[0].remove();
    var toast = document.createElement('div');
    toast.className = 'toast' + (type === 'success' ? ' toast-success' : type === 'error' ? ' toast-error' : '');
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(function () { if (toast.parentNode) toast.remove(); }, 3000);
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

    var fillEl   = document.getElementById('pg_fill_' + wrapId);
    var pctEl    = document.getElementById('pg_pct_' + wrapId);
    var statusEl = document.getElementById('pg_status_' + wrapId);
    var cancelBtn = document.getElementById('pg_cancel_' + wrapId);
    var crawlTimer = null;
    var current = 0;

    function setVal(pct, statusText) {
        pct = Math.max(0, Math.min(100, Math.round(pct)));
        current = pct;
        if (fillEl)   fillEl.style.width  = pct + '%';
        if (pctEl)    pctEl.textContent   = pct + '%';
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
        if (fillEl) fillEl.style.background = 'linear-gradient(90deg, #22c55e, #4ade80)';
        if (fillEl) fillEl.style.boxShadow  = '0 0 12px rgba(74,222,128,0.4)';
        setTimeout(function () {
            var pw = wrap.querySelector('.progress-wrap');
            if (pw) { pw.style.transition = 'opacity 0.5s ease'; pw.style.opacity = '0'; }
            setTimeout(function () { if (pw) pw.style.display = 'none'; }, 520);
        }, 900);
    }

    function error(statusText) {
        clearCrawl();
        if (cancelBtn) cancelBtn.style.display = 'none';
        if (fillEl) fillEl.style.background = 'linear-gradient(90deg, #ef4444, #f87171)';
        if (fillEl) fillEl.style.boxShadow  = '0 0 12px rgba(239,68,68,0.4)';
        setVal(current, statusText || 'Terjadi kesalahan.');
    }

    function cancel() {
        if (cancelled) return;
        cancelled = true;
        clearCrawl();
        if (abortController) abortController.abort();
        if (fillEl) fillEl.style.background = 'linear-gradient(90deg, #f59e0b, #fbbf24)';
        if (fillEl) fillEl.style.boxShadow  = '0 0 12px rgba(245,158,11,0.4)';
        setVal(current, 'Dibatalkan.');
        if (cancelBtn) cancelBtn.style.display = 'none';
        setTimeout(function () {
            var pw = wrap.querySelector('.progress-wrap');
            if (pw) { pw.style.transition = 'opacity 0.5s ease'; pw.style.opacity = '0'; }
            setTimeout(function () { if (pw) pw.style.display = 'none'; }, 520);
        }, 1000);
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', function () { cancel(); });
    }

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

// ── NAVBAR SCROLL COLLAPSE ──────────────────────────────────────
(function () {
    var wrapper         = document.getElementById('navbarWrapper');
    var scrollBtn       = document.getElementById('scrollTopBtn');
    var mainSearch      = document.getElementById('searchInput');
    var collapsedSearch = document.getElementById('searchInputCollapsed');

    var COLLAPSE_THRESHOLD = 60;

    if (mainSearch && collapsedSearch) {
        mainSearch.addEventListener('input', function () {
            collapsedSearch.value = this.value;
            if (typeof renderTools === 'function') renderTools();
        });
        collapsedSearch.addEventListener('input', function () {
            mainSearch.value = this.value;
            if (typeof renderTools === 'function') renderTools();
        });
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

    if (scrollBtn) {
        scrollBtn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
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
    { name: 'Unit Converter',          icon: 'thermometer',       iconType: 'lucide', cat: 'utility', desc: 'Celcius, Fahrenheit, Kelvin.',                 id: 'unit'      },
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
        var matchSearch = t.name.toLowerCase().includes(searchVal) || t.desc.toLowerCase().includes(searchVal);
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
    }, 280);
};

// ── OPEN / CLOSE TOOL ──────────────────────────────────────────
window.openTool = function (toolId) {
    var tool = tools.find(function (t) { return t.id === toolId; });
    if (!tool) return;

    localStorage.setItem('lastOpened', tool.name);
    document.body.classList.add('tool-open');

    var toolPage = document.getElementById('toolPage');
    toolPage.style.display = '';
    toolPage.classList.add('active');
    document.getElementById('toolPageTitle').textContent = tool.name;

    var body = document.getElementById('toolPageBody');
    var html = '<div class="tool-desc">' + tool.desc + '</div>';

    switch (toolId) {
        case 'password':
            html += '<label>Panjang Password</label>' +
                    '<input type="number" id="passLength" value="16" min="6" max="64">' +
                    '<button class="btn-primary" onclick="generatePassword()">Generate Password</button>' +
                    '<div class="result-box" id="passResult">Klik generate untuk hasil</div>' +
                    '<small style="color:var(--text-muted); display:block; margin-top:8px; font-size:0.75rem;">Kombinasi huruf besar, kecil, angka & simbol</small>';
            break;
        case 'json':
            html += '<label>Masukkan JSON</label>' +
                    '<textarea id="jsonInput" placeholder=\'{ "nama": "Leoo" }\'></textarea>' +
                    '<button class="btn-primary" onclick="formatJson()">Format & Validasi</button>' +
                    '<div class="result-box" id="jsonResult">Hasil akan muncul di sini</div>';
            break;
        case 'unit':
            html += '<label>Arah Konversi</label>' +
                    '<select id="unitDirection">' +
                    '<option value="CF">Celcius → Fahrenheit</option>' +
                    '<option value="FC">Fahrenheit → Celcius</option>' +
                    '<option value="CK">Celcius → Kelvin</option>' +
                    '<option value="KC">Kelvin → Celcius</option>' +
                    '</select>' +
                    '<label>Masukkan Nilai</label>' +
                    '<input type="number" id="unitInput" placeholder="0" step="any">' +
                    '<button class="btn-primary" onclick="convertUnit()">Konversi</button>' +
                    '<div class="result-box" id="unitResult">Hasil konversi</div>';
            break;
        case 'base64':
            html += '<label>Teks / Base64</label>' +
                    '<textarea id="base64Input" placeholder="Masukkan teks atau kode base64..."></textarea>' +
                    '<div class="btn-group">' +
                    '<button class="btn-primary" onclick="encodeBase64()">Encode</button>' +
                    '<button class="btn-primary btn-secondary" onclick="decodeBase64()">Decode</button>' +
                    '</div>' +
                    '<div class="result-box" id="base64Result">Hasil di sini</div>';
            break;
        case 'counter':
            html += '<label>Masukkan Teks</label>' +
                    '<textarea id="counterInput" placeholder="Tulis sesuatu..."></textarea>' +
                    '<button class="btn-primary" onclick="analyzeText()">Analisis Teks</button>' +
                    '<div class="result-box" id="counterResult">Klik analisis untuk lihat statistik</div>';
            break;
        case 'color':
            html += '<label>Pilih Warna</label>' +
                    '<input type="color" id="colorPicker" value="#3b82f6" ' +
                    'style="height:56px; padding:4px; cursor:pointer; border-radius:var(--radius-sm); width:100%;" ' +
                    'oninput="updateColorPreview(this.value)">' +
                    '<div class="color-preview" id="colorPreview" style="background:#3b82f6;"></div>' +
                    '<div class="btn-group">' +
                    '<button class="btn-primary" onclick="copyColor(\'hex\')">Copy HEX</button>' +
                    '<button class="btn-primary btn-secondary" onclick="copyColor(\'rgb\')">Copy RGB</button>' +
                    '</div>' +
                    '<div class="result-box" id="colorResult">HEX: #3b82f6 | RGB: rgb(59, 130, 246)</div>';
            break;
        case 'tiktok':
            html += '<label>Link TikTok</label>' +
                    '<input type="text" id="tiktokLink" placeholder="https://www.tiktok.com/@user/video/...">' +
                    '<button class="btn-primary" onclick="downloadTiktok()">Download</button>' +
                    '<div id="tiktokProgressWrap"></div>' +
                    '<div id="tiktokResultWrap"></div>' +
                    '<small style="color:var(--text-muted); display:block; margin-top:8px; font-size:0.75rem;">Hanya untuk konten publik & legal.</small>';
            break;
        case 'youtube':
            html += '<label>Link YouTube</label>' +
                    '<input type="text" id="youtubeLink" placeholder="https://youtube.com/watch?v=...">' +
                    '<button class="btn-primary" onclick="downloadYoutube()">Download</button>' +
                    '<div id="youtubeProgressWrap"></div>' +
                    '<div id="youtubeResultWrap"></div>' +
                    '<small style="color:var(--text-muted); display:block; margin-top:8px; font-size:0.75rem;">Hanya untuk konten publik & legal.</small>';
            break;
        case 'instagram':
            html += '<label>Link Instagram</label>' +
                    '<input type="text" id="instagramLink" placeholder="https://www.instagram.com/p/...">' +
                    '<button class="btn-primary" onclick="downloadInstagram()">Download</button>' +
                    '<div id="instagramProgressWrap"></div>' +
                    '<div id="instagramResultWrap"></div>' +
                    '<small style="color:var(--text-muted); display:block; margin-top:8px; font-size:0.75rem;">Hanya untuk konten publik & legal.</small>';
            break;
        case 'facebook':
            html += '<label>Link Facebook</label>' +
                    '<input type="text" id="facebookLink" placeholder="https://www.facebook.com/.../videos/...">' +
                    '<button class="btn-primary" onclick="downloadFacebook()">Download</button>' +
                    '<div id="facebookProgressWrap"></div>' +
                    '<div id="facebookResultWrap"></div>' +
                    '<small style="color:var(--text-muted); display:block; margin-top:8px; font-size:0.75rem;">Hanya untuk konten publik & legal.</small>';
            break;
        case 'weather':
            html += '<label>Nama Kota</label>' +
                    '<input type="text" id="weatherCity" placeholder="Jakarta">' +
                    '<button class="btn-primary" onclick="checkWeather()">Cek Cuaca</button>' +
                    '<div id="weatherProgressWrap"></div>' +
                    '<div class="result-box" id="weatherResult">Masukkan nama kota, lalu klik cek.</div>';
            break;
        case 'urlshort':
            html += '<label>Link Panjang</label>' +
                    '<input type="text" id="urlInput" placeholder="https://...">' +
                    '<button class="btn-primary" onclick="shortenUrl()">Persingkat</button>' +
                    '<div id="urlProgressWrap"></div>' +
                    '<div class="result-box" id="urlResult">Hasil link pendek akan muncul di sini</div>';
            break;
        case 'image':
            html += '<label>Upload Gambar</label>' +
                    '<input type="file" id="imageInput" accept="image/*">' +
                    '<button class="btn-primary" onclick="enhanceImage()">Enhance Gambar</button>' +
                    '<div id="imageProgressWrap"></div>' +
                    '<div class="result-box" id="imageResult">Upload gambar, lalu klik Enhance.</div>' +
                    '<div id="imagePreview" style="margin-top:12px;"></div>';
            break;
        case 'news':
            html += '<label>Kategori Berita</label>' +
                    '<select id="newsCategory">' +
                    '<option value="general">Umum</option>' +
                    '<option value="technology">Teknologi</option>' +
                    '<option value="sports">Olahraga</option>' +
                    '<option value="health">Kesehatan</option>' +
                    '<option value="science">Sains</option>' +
                    '</select>' +
                    '<button class="btn-primary" onclick="getNews()">Lihat Berita</button>' +
                    '<div id="newsProgressWrap"></div>' +
                    '<div class="result-box" id="newsResult">Pilih kategori, klik lihat berita.</div>';
            break;
        default:
            html += '<p style="color:var(--text-muted);">Tool ini belum siap.</p>';
    }

    body.innerHTML = html;
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // ── Staggered animation pada semua elemen langsung di toolPageBody ──
    var children = body.children;
    for (var i = 0; i < children.length; i++) {
        (function (el, idx) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(18px)';
            el.style.transition = 'none';
            setTimeout(function () {
                el.style.transition = 'opacity 0.38s cubic-bezier(0.16,1,0.3,1), transform 0.38s cubic-bezier(0.16,1,0.3,1)';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 60 + idx * 70);
        })(children[i], i);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.closeToolPage = function () {
    document.body.classList.remove('tool-open');
    var toolPage = document.getElementById('toolPage');
    toolPage.classList.remove('active');
    // Bersihkan inline style agar tool bisa dibuka kembali
    toolPage.removeAttribute('style');
    // Reset konten agar tidak ada sisa hasil dari sesi sebelumnya
    var body = document.getElementById('toolPageBody');
    if (body) body.innerHTML = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

// ── INIT ───────────────────────────────────────────────────────
window.initAll = function () {
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
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        updateThemeIcon(next);
        showToast(next === 'dark' ? '🌙 Mode Gelap' : '☀️ Mode Terang', 'success');
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
};
