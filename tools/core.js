// ==========================================
// CORE – Data Tools, Render, Toast, Scroll, Stats
// ==========================================

// ---------- TOAST (max 3, success/error aware) ----------
// type: 'success' | 'error' | 'info' (default)
window.showToast = function(message, type) {
    var container = document.getElementById('toastContainer');
    if (!container) return;

    var currentToasts = container.querySelectorAll('.toast');
    if (currentToasts.length >= 3) {
        var oldestToast = currentToasts[0];
        if (oldestToast) oldestToast.remove();
    }

    var toast = document.createElement('div');
    toast.className = 'toast';
    if (type === 'success') toast.classList.add('toast-success');
    else if (type === 'error') toast.classList.add('toast-error');
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(function() {
        if (toast.parentNode) toast.remove();
    }, 3000);
};

// ---------- SCROLL TOP ----------
(function() {
    var btn = document.getElementById('scrollTopBtn');
    if (!btn) return;
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            btn.classList.add('show');
        } else {
            btn.classList.remove('show');
        }
    });
    btn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();

// ---------- SIMPLE ICONS HELPER ----------
// Render SVG dari simple-icons sebagai inline HTML
function getSimpleIcon(slug, size) {
    size = size || 28;
    // simple-icons global object: window.simpleIcons['tiktok'] dst
    var si = window.simpleIcons && window.simpleIcons[slug];
    if (si) {
        return '<svg class="si-icon" role="img" viewBox="0 0 24 24" width="' + size + '" height="' + size + '" xmlns="http://www.w3.org/2000/svg"><path d="' + si.path + '"/></svg>';
    }
    // Fallback ke lucide jika simple-icons belum load
    return '<i data-lucide="circle" style="width:' + size + 'px;height:' + size + 'px;"></i>';
}

// ---------- DATA TOOLS ----------
// iconType: 'lucide' (default) | 'simple' (pakai simple-icons slug)
var tools = [
    { name: "Password Generator",      icon: "key-round",        iconType: "lucide",  cat: "utility", desc: "Bikin password super kuat.",                     id: "password"  },
    { name: "JSON Formatter",          icon: "braces",           iconType: "lucide",  cat: "dev",     desc: "Rapihin & validasi JSON.",                       id: "json"      },
    { name: "Unit Converter",          icon: "thermometer",      iconType: "lucide",  cat: "utility", desc: "Celcius, Fahrenheit, Kelvin.",                   id: "unit"      },
    { name: "Base64 Encoder/Decoder",  icon: "lock-keyhole",     iconType: "lucide",  cat: "text",    desc: "Encode/decode teks base64.",                     id: "base64"    },
    { name: "Text Analyzer",           icon: "text-cursor-input",iconType: "lucide",  cat: "text",    desc: "Hitung huruf, kata, kalimat.",                   id: "counter"   },
    { name: "Color Picker Pro",        icon: "pipette",          iconType: "lucide",  cat: "utility", desc: "Pilih warna + salin kode.",                      id: "color"     },
    { name: "TikTok Downloader",       icon: "tiktok",           iconType: "simple",  cat: "utility", desc: "Download video TikTok tanpa watermark.",         id: "tiktok"    },
    { name: "YouTube Downloader",      icon: "youtube",          iconType: "simple",  cat: "utility", desc: "Download video YouTube.",                        id: "youtube"   },
    { name: "Instagram Downloader",    icon: "instagram",        iconType: "simple",  cat: "utility", desc: "Download foto/video Instagram.",                 id: "instagram" },
    { name: "Facebook Downloader",     icon: "facebook",         iconType: "simple",  cat: "utility", desc: "Download video Facebook.",                       id: "facebook"  },
    { name: "Pengecekan Cuaca",        icon: "cloud-sun",        iconType: "lucide",  cat: "utility", desc: "Cek cuaca kota mana pun.",                       id: "weather"   },
    { name: "URL Shortener",           icon: "link",             iconType: "lucide",  cat: "utility", desc: "Pendekin link panjang jadi pendek.",             id: "urlshort"  },
    { name: "Image Enhancer",          icon: "image-up",         iconType: "lucide",  cat: "utility", desc: "Ubah gambar jadi HD / upscale.",                 id: "image"     },
    { name: "News Headline",           icon: "newspaper",        iconType: "lucide",  cat: "utility", desc: "Berita terkini dari berbagai kategori.",         id: "news"      },
];

// ---------- COUNTER ----------
var totalUsage = parseInt(localStorage.getItem('totalUsage')) || 0;
window.updateUsageCounter = function() {};
window.incrementUsage = function() {
    totalUsage += 1;
    localStorage.setItem('totalUsage', totalUsage);
};

// ---------- STATISTIK ----------
var lastOpened = localStorage.getItem('lastOpened') || '-';
window.updateStats = function() {};

// ---------- RENDER GRID ----------
window.renderTools = function() {
    var grid = document.getElementById('toolsGrid');
    var searchVal = document.getElementById('searchInput').value.toLowerCase();
    var activeChip = document.querySelector('.chip.active');
    var currentCat = activeChip ? activeChip.dataset.cat : 'all';

    grid.innerHTML = '';
    for (var i = 0; i < 6; i++) {
        grid.innerHTML += '<div class="skeleton"><div class="skeleton-icon"></div><div class="skeleton-title"></div><div class="skeleton-desc"></div></div>';
    }

    var filtered = tools.filter(function(t) {
        var matchCat = currentCat === 'all' || t.cat === currentCat;
        var matchSearch = t.name.toLowerCase().includes(searchVal) || t.desc.toLowerCase().includes(searchVal);
        return matchCat && matchSearch;
    });

    setTimeout(function() {
        if (filtered.length === 0) {
            grid.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:60px 0; color:var(--mute);">Gak ada tool yang cocok...</div>';
        } else {
            var html = '';
            filtered.forEach(function(t) {
                var iconHtml = t.iconType === 'simple'
                    ? getSimpleIcon(t.icon, 28)
                    : '<i data-lucide="' + t.icon + '"></i>';
                html += '<div class="tool-card" onclick="openTool(\'' + t.id + '\')">' +
                        '<span class="badge">' + t.cat + '</span>' +
                        iconHtml +
                        '<h4>' + t.name + '</h4>' +
                        '<p>' + t.desc + '</p>' +
                        '</div>';
            });
            grid.innerHTML = html;
        }
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }, 300);
};

// ---------- BUKA / TUTUP TOOL ----------
window.openTool = function(toolId) {
    var tool = tools.find(function(t) { return t.id === toolId; });
    if (!tool) return;

    lastOpened = tool.name;
    localStorage.setItem('lastOpened', lastOpened);

    document.body.classList.add('tool-open');

    var toolPage = document.getElementById('toolPage');
    toolPage.style.display = '';
    toolPage.classList.add('active');

    document.getElementById('toolPageTitle').textContent = tool.name;

    var body = document.getElementById('toolPageBody');
    var html = '<div class="tool-desc">' + tool.desc + '</div>';

    switch(toolId) {
        case 'password':
            html += '<label>Panjang Password</label>' +
                    '<input type="number" id="passLength" value="16" min="6" max="64">' +
                    '<button class="btn-primary" onclick="generatePassword()">Generate</button>' +
                    '<div class="result-box" id="passResult">Klik generate untuk hasil</div>' +
                    '<small style="color:var(--mute); display:block; margin-top:8px;">Huruf besar, kecil, angka, & simbol</small>';
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
                    '<button class="btn-primary" onclick="analyzeText()">Analisis</button>' +
                    '<div class="result-box" id="counterResult">Klik analisis untuk lihat statistik</div>';
            break;
        case 'color':
            html += '<label>Pilih Warna</label>' +
                    '<input type="color" id="colorPicker" value="#0070f3" ' +
                    'style="height:56px; padding:4px; cursor:pointer; background:var(--canvas); border-radius:var(--radius-sm); width:100%; box-shadow:var(--shadow-l1);" ' +
                    'oninput="updateColorPreview(this.value)">' +
                    '<div class="color-preview" id="colorPreview" style="background:#0070f3;"></div>' +
                    '<div class="btn-group">' +
                    '<button class="btn-primary" onclick="copyColor(\'hex\')">Copy HEX</button>' +
                    '<button class="btn-primary btn-secondary" onclick="copyColor(\'rgb\')">Copy RGB</button>' +
                    '</div>' +
                    '<div class="result-box" id="colorResult">HEX: #0070f3 | RGB: rgb(0, 112, 243)</div>';
            break;
        case 'tiktok':
            html += '<label>Link TikTok</label>' +
                    '<input type="text" id="tiktokLink" placeholder="https://www.tiktok.com/@user/video/...">' +
                    '<button class="btn-primary" onclick="downloadTiktok()">Download</button>' +
                    '<div class="result-box" id="tiktokResult">Hasil download akan muncul di sini</div>' +
                    '<div id="tiktokPreview" style="margin-top:12px;"></div>' +
                    '<small style="color:var(--mute); display:block; margin-top:8px;">Hanya untuk konten publik & legal.</small>';
            break;
        case 'youtube':
            html += '<label>Link YouTube</label>' +
                    '<input type="text" id="youtubeLink" placeholder="https://youtube.com/watch?v=...">' +
                    '<button class="btn-primary" onclick="downloadYoutube()">Download</button>' +
                    '<div class="result-box" id="youtubeResult">Hasil download akan muncul di sini</div>' +
                    '<div id="youtubePreview" style="margin-top:12px;"></div>' +
                    '<small style="color:var(--mute); display:block; margin-top:8px;">Kualitas terbatas 360p. Hanya untuk konten publik & legal.</small>';
            break;
        case 'instagram':
            html += '<label>Link Instagram</label>' +
                    '<input type="text" id="instagramLink" placeholder="https://www.instagram.com/p/...">' +
                    '<button class="btn-primary" onclick="downloadInstagram()">Download</button>' +
                    '<div class="result-box" id="instagramResult">Hasil download akan muncul di sini</div>' +
                    '<div id="instagramPreview" style="margin-top:12px;"></div>' +
                    '<small style="color:var(--mute); display:block; margin-top:8px;">Hanya untuk konten publik & legal.</small>';
            break;
        case 'facebook':
            html += '<label>Link Facebook</label>' +
                    '<input type="text" id="facebookLink" placeholder="https://www.facebook.com/.../videos/...">' +
                    '<button class="btn-primary" onclick="downloadFacebook()">Download</button>' +
                    '<div class="result-box" id="facebookResult">Hasil download akan muncul di sini</div>' +
                    '<div id="facebookPreview" style="margin-top:12px;"></div>' +
                    '<small style="color:var(--mute); display:block; margin-top:8px;">Hanya untuk konten publik & legal.</small>';
            break;
        case 'weather':
            html += '<label>Nama Kota</label>' +
                    '<input type="text" id="weatherCity" placeholder="Jakarta">' +
                    '<button class="btn-primary" onclick="checkWeather()">Cek Cuaca</button>' +
                    '<div class="result-box" id="weatherResult">Masukkan nama kota, lalu klik cek.</div>';
            break;
        case 'urlshort':
            html += '<label>Link Panjang</label>' +
                    '<input type="text" id="urlInput" placeholder="https://...">' +
                    '<button class="btn-primary" onclick="shortenUrl()">Persingkat</button>' +
                    '<div class="result-box" id="urlResult">Hasil link pendek akan muncul di sini</div>';
            break;
        case 'image':
            html += '<label>Upload Gambar</label>' +
                    '<input type="file" id="imageInput" accept="image/*">' +
                    '<button class="btn-primary" onclick="enhanceImage()">Enhance</button>' +
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
                    '<div class="result-box" id="newsResult">Pilih kategori, klik lihat berita.</div>';
            break;
        default:
            html += '<p>Tool ini belum siap.</p>';
    }
    body.innerHTML = html;
    if (typeof lucide !== 'undefined') lucide.createIcons();
};

window.closeToolPage = function() {
    document.body.classList.remove('tool-open');
    var toolPage = document.getElementById('toolPage');
    toolPage.classList.remove('active');
    toolPage.style.display = '';
};

// ---------- INIT GLOBAL ----------
window.initAll = function() {
    var theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
    var toggle = document.getElementById('themeToggle');

    function updateThemeIcon(t) {
        toggle.innerHTML = t === 'dark'
            ? '<i data-lucide="sun"></i>'
            : '<i data-lucide="moon"></i>';
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }
    updateThemeIcon(theme);

    toggle.addEventListener('click', function() {
        var current = document.documentElement.getAttribute('data-theme');
        var next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        updateThemeIcon(next);
        showToast(next === 'dark' ? 'Mode Gelap' : 'Mode Terang', 'info');
    });

    document.getElementById('searchInput').addEventListener('input', function() { renderTools(); });
    document.querySelectorAll('.chip').forEach(function(chip) {
        chip.addEventListener('click', function() {
            document.querySelectorAll('.chip').forEach(function(c) { c.classList.remove('active'); });
            this.classList.add('active');
            renderTools();
        });
    });

    renderTools();
};
