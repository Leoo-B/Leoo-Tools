// ==========================================
// PARTIKEL CANVAS
// ==========================================
(function initParticles() {
    var canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var particles = [];
    var w, h;

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    var count = Math.min(120, Math.floor((w * h) / 12000));
    for (var i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * w,
            y: Math.random() * h,
            r: Math.random() * 3 + 2,
            dx: (Math.random() - 0.5) * 0.4,
            dy: (Math.random() - 0.5) * 0.4,
            o: Math.random() * 0.4 + 0.6
        });
    }

    function draw() {
        ctx.clearRect(0, 0, w, h);
        ctx.shadowColor = 'rgba(168, 85, 247, 0.8)';
        ctx.shadowBlur = 15;
        ctx.fillStyle = 'rgba(200, 170, 255, 0.9)';

        for (var i = 0; i < particles.length; i++) {
            var p = particles[i];
            ctx.globalAlpha = p.o;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
            p.x += p.dx;
            p.y += p.dy;
            if (p.x < 0) p.x = w;
            if (p.x > w) p.x = 0;
            if (p.y < 0) p.y = h;
            if (p.y > h) p.y = 0;
        }
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
        requestAnimationFrame(draw);
    }
    draw();
})();

// ==========================================
// TOAST – MAKSIMAL 3 TUMPUKAN
// ==========================================
function showToast(message) {
    var container = document.getElementById('toastContainer');
    if (!container) return;

    var currentToasts = container.querySelectorAll('.toast');
    if (currentToasts.length >= 3) {
        var oldestToast = currentToasts[0];
        if (oldestToast) {
            oldestToast.remove();
        }
    }

    var toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(function() {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 3000);
}

// ==========================================
// SCROLL TOP
// ==========================================
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

// ==========================================
// DATA TOOLS (Lama + Baru)
// ==========================================
var tools = [
    // Tools lama
    { name: "Password Generator", icon: "🔑", cat: "utility", desc: "Bikin password super kuat.", id: "password" },
    { name: "JSON Formatter", icon: "📋", cat: "dev", desc: "Rapihin & validasi JSON.", id: "json" },
    { name: "Unit Converter (Suhu)", icon: "🌡️", cat: "utility", desc: "Celcius ↔ Fahrenheit ↔ Kelvin.", id: "unit" },
    { name: "Base64 Encoder/Decoder", icon: "🔒", cat: "text", desc: "Encode/decode teks base64.", id: "base64" },
    { name: "Text Analyzer", icon: "📝", cat: "text", desc: "Hitung huruf, kata, kalimat.", id: "counter" },
    { name: "Color Picker Pro", icon: "🎨", cat: "utility", desc: "Pilih warna + salin kode.", id: "color" },

    // Tools baru (5 kunci)
    { name: "Media Downloader", icon: "📥", cat: "utility", desc: "Download video dari TikTok, YT, IG, FB.", id: "media" },
    { name: "Pengecekan Cuaca", icon: "🌤️", cat: "utility", desc: "Cek cuaca kota mana pun.", id: "weather" },
    { name: "URL Shortener", icon: "🔗", cat: "utility", desc: "Pendekin link panjang jadi pendek.", id: "urlshort" },
    { name: "Image Enhancer", icon: "🖼️", cat: "utility", desc: "Ubah gambar jadi HD / upscale.", id: "image" },
    { name: "News Headline", icon: "📰", cat: "utility", desc: "Berita terkini dari berbagai kategori.", id: "news" },
];

// ==========================================
// COUNTER
// ==========================================
var totalUsage = parseInt(localStorage.getItem('totalUsage')) || 0;

function updateUsageCounter() {
    var el = document.getElementById('usageCounter');
    if (!el) return;
    var oldVal = parseInt(el.textContent) || 0;
    var newVal = totalUsage;
    var duration = 400;
    var startTime = performance.now();

    function animateCount(now) {
        var elapsed = now - startTime;
        var progress = Math.min(elapsed / duration, 1);
        var current = Math.floor(oldVal + (newVal - oldVal) * progress);
        el.textContent = current;
        if (progress < 1) {
            requestAnimationFrame(animateCount);
        } else {
            el.textContent = newVal;
        }
    }
    requestAnimationFrame(animateCount);
}

// ==========================================
// STATISTIK
// ==========================================
var lastOpened = localStorage.getItem('lastOpened') || '-';

function updateStats() {
    document.getElementById('totalTools').textContent = tools.length;
    var activeChip = document.querySelector('.chip.active');
    var cat = activeChip ? activeChip.textContent.trim() : 'Semua';
    document.getElementById('activeCategory').textContent = cat;
    document.getElementById('lastOpened').textContent = lastOpened;
}

// ==========================================
// RENDER GRID
// ==========================================
function renderTools() {
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
            grid.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:60px 0; color:var(--text-secondary);">😭 Gak ada tool yang cocok bro...</div>';
        } else {
            var html = '';
            filtered.forEach(function(t) {
                html += '<div class="tool-card" onclick="openTool(\'' + t.id + '\')">' +
                        '<span class="badge">' + t.cat.toUpperCase() + '</span>' +
                        '<span class="icon">' + t.icon + '</span>' +
                        '<h4>' + t.name + '</h4>' +
                        '<p>' + t.desc + '</p>' +
                        '</div>';
            });
            grid.innerHTML = html;
        }
        updateStats();
    }, 300);
}

// ==========================================
// BUKA TOOL
// ==========================================
window.openTool = function(toolId) {
    var tool = tools.find(function(t) { return t.id === toolId; });
    if (!tool) return;

    lastOpened = tool.name;
    localStorage.setItem('lastOpened', lastOpened);
    updateStats();

    document.body.classList.add('tool-open');
    document.getElementById('toolPage').classList.add('active');
    document.getElementById('toolPageTitle').textContent = tool.icon + ' ' + tool.name;

    var body = document.getElementById('toolPageBody');
    var desc = tool.desc;
    var html = '<div class="tool-desc">📌 ' + desc + '</div>';

    switch(toolId) {
        // ========== TOOLS LAMA ==========
        case 'password':
            html += '<label>🔐 Panjang Password</label>' +
                    '<input type="number" id="passLength" value="16" min="6" max="64">' +
                    '<button class="btn-primary" onclick="generatePassword()">⚡ Generate!</button>' +
                    '<div class="result-box" id="passResult">Klik generate untuk hasil</div>' +
                    '<small style="color:var(--text-secondary); display:block; margin-top:6px;">Huruf besar, kecil, angka, & simbol</small>';
            break;
        case 'json':
            html += '<label>📄 Masukkan JSON</label>' +
                    '<textarea id="jsonInput" placeholder=\'{ "nama": "Leoo" }\'></textarea>' +
                    '<button class="btn-primary" onclick="formatJson()">✨ Format & Validasi</button>' +
                    '<div class="result-box" id="jsonResult">Hasil akan muncul di sini</div>';
            break;
        case 'unit':
            html += '<label>🌡️ Pilih Arah Konversi</label>' +
                    '<select id="unitDirection" style="width:100%; background:var(--bg-card); border:1px solid var(--border-color); border-radius:16px; padding:14px 18px; color:var(--text-primary);">' +
                    '<option value="CF">Celcius → Fahrenheit</option>' +
                    '<option value="FC">Fahrenheit → Celcius</option>' +
                    '<option value="CK">Celcius → Kelvin</option>' +
                    '<option value="KC">Kelvin → Celcius</option>' +
                    '</select>' +
                    '<label>📟 Masukkan Nilai</label>' +
                    '<input type="number" id="unitInput" placeholder="0" step="any">' +
                    '<button class="btn-primary" onclick="convertUnit()">🔄 Konversi</button>' +
                    '<div class="result-box" id="unitResult">Hasil konversi</div>';
            break;
        case 'base64':
            html += '<label>📝 Teks / Base64</label>' +
                    '<textarea id="base64Input" placeholder="Masukkan teks atau kode base64..."></textarea>' +
                    '<div class="btn-group">' +
                    '<button class="btn-primary" onclick="encodeBase64()">🔒 Encode</button>' +
                    '<button class="btn-primary" style="background:var(--accent-light); opacity:0.7;" onclick="decodeBase64()">🔓 Decode</button>' +
                    '</div>' +
                    '<div class="result-box" id="base64Result">Hasil di sini</div>';
            break;
        case 'counter':
            html += '<label>📝 Masukkan Teks</label>' +
                    '<textarea id="counterInput" placeholder="Tulis sesuatu..."></textarea>' +
                    '<button class="btn-primary" onclick="analyzeText()">📊 Analisis</button>' +
                    '<div class="result-box" id="counterResult">Klik analisis untuk lihat statistik</div>';
            break;
        case 'color':
            html += '<label>🎨 Pilih Warna</label>' +
                    '<input type="color" id="colorPicker" value="#7c3aed" style="height:70px; padding:4px; cursor:pointer; background:var(--bg-card); border:1px solid var(--border-color); border-radius:16px; width:100%;">' +
                    '<div class="color-preview" id="colorPreview" style="background:#7c3aed;"></div>' +
                    '<div class="btn-group">' +
                    '<button class="btn-primary" onclick="copyColor(\'hex\')">📋 Copy HEX</button>' +
                    '<button class="btn-primary" style="background:var(--accent-light); opacity:0.7;" onclick="copyColor(\'rgb\')">📋 Copy RGB</button>' +
                    '</div>' +
                    '<div class="result-box" id="colorResult">HEX: #7c3aed | RGB: rgb(124,58,237)</div>';
            break;

        // ========== TOOLS BARU ==========
        case 'media':
            html += '<label>📌 Pilih Platform</label>' +
                    '<select id="mediaPlatform" style="width:100%; background:var(--bg-card); border:1px solid var(--border-color); border-radius:16px; padding:14px 18px; color:var(--text-primary);">' +
                    '<option value="tiktok">TikTok</option>' +
                    '<option value="youtube">YouTube</option>' +
                    '<option value="instagram">Instagram</option>' +
                    '<option value="facebook">Facebook</option>' +
                    '</select>' +
                    '<label>🔗 Masukkan Link</label>' +
                    '<input type="text" id="mediaLink" placeholder="https://..." style="width:100%; background:var(--bg-card); border:1px solid var(--border-color); border-radius:16px; padding:14px 18px; color:var(--text-primary);">' +
                    '<button class="btn-primary" onclick="downloadMedia()">📥 Download</button>' +
                    '<div class="result-box" id="mediaResult">Hasil download akan muncul di sini</div>' +
                    '<small style="color:var(--text-secondary); display:block; margin-top:6px;">⚠️ Hanya untuk konten publik & legal.</small>';
            break;
        case 'weather':
            html += '<label>🌍 Nama Kota</label>' +
                    '<input type="text" id="weatherCity" placeholder="Jakarta" style="width:100%; background:var(--bg-card); border:1px solid var(--border-color); border-radius:16px; padding:14px 18px; color:var(--text-primary);">' +
                    '<button class="btn-primary" onclick="checkWeather()">🌤️ Cek Cuaca</button>' +
                    '<div class="result-box" id="weatherResult">Masukkan nama kota, lalu klik cek.</div>';
            break;
        case 'urlshort':
            html += '<label>🔗 Masukkan Link Panjang</label>' +
                    '<input type="text" id="urlInput" placeholder="https://..." style="width:100%; background:var(--bg-card); border:1px solid var(--border-color); border-radius:16px; padding:14px 18px; color:var(--text-primary);">' +
                    '<button class="btn-primary" onclick="shortenUrl()">✂️ Pendekin</button>' +
                    '<div class="result-box" id="urlResult">Hasil link pendek akan muncul di sini</div>';
            break;
        case 'image':
            html += '<label>🖼️ Upload Gambar</label>' +
                    '<input type="file" id="imageInput" accept="image/*" style="width:100%; background:var(--bg-card); border:1px solid var(--border-color); border-radius:16px; padding:12px; color:var(--text-primary);">' +
                    '<button class="btn-primary" onclick="enhanceImage()">✨ HD-kan</button>' +
                    '<div class="result-box" id="imageResult">Upload gambar, lalu klik HD-kan.</div>' +
                    '<div id="imagePreview" style="margin-top:12px;"></div>';
            break;
        case 'news':
            html += '<label>📰 Pilih Kategori</label>' +
                    '<select id="newsCategory" style="width:100%; background:var(--bg-card); border:1px solid var(--border-color); border-radius:16px; padding:14px 18px; color:var(--text-primary);">' +
                    '<option value="general">Umum</option>' +
                    '<option value="technology">Teknologi</option>' +
                    '<option value="sports">Olahraga</option>' +
                    '<option value="health">Kesehatan</option>' +
                    '<option value="science">Sains</option>' +
                    '</select>' +
                    '<button class="btn-primary" onclick="getNews()">📰 Lihat Berita</button>' +
                    '<div class="result-box" id="newsResult">Pilih kategori, klik lihat berita.</div>';
            break;
        default:
            html += '<p>Tool ini belum siap, tapi lo bisa bayangin aja kerennya! 😎</p>';
    }
    body.innerHTML = html;
};

// ==========================================
// TUTUP TOOL
// ==========================================
window.closeToolPage = function() {
    document.body.classList.remove('tool-open');
    document.getElementById('toolPage').classList.remove('active');
};

// ==========================================
// FUNGSI TOOLS LAMA (dengan counter)
// ==========================================
function incrementUsage() {
    totalUsage += 1;
    localStorage.setItem('totalUsage', totalUsage);
    updateUsageCounter();
}

window.generatePassword = function() {
    var len = parseInt(document.getElementById('passLength').value) || 16;
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    var pass = '';
    for (var i = 0; i < len; i++) pass += chars.charAt(Math.floor(Math.random() * chars.length));
    document.getElementById('passResult').textContent = pass;
    showToast('🔑 Password berhasil digenerate!');
    incrementUsage();
};

window.formatJson = function() {
    var input = document.getElementById('jsonInput').value.trim();
    var result = document.getElementById('jsonResult');
    try {
        var parsed = JSON.parse(input);
        result.textContent = JSON.stringify(parsed, null, 2);
        result.style.borderLeftColor = '#4ade80';
        showToast('✅ JSON berhasil diformat!');
        incrementUsage();
    } catch(e) {
        result.textContent = '❌ Error: ' + e.message;
        result.style.borderLeftColor = '#f87171';
        showToast('❌ Error JSON: ' + e.message);
    }
};

window.convertUnit = function() {
    var val = parseFloat(document.getElementById('unitInput').value);
    var dir = document.getElementById('unitDirection').value;
    var result = document.getElementById('unitResult');
    if (isNaN(val)) { result.textContent = '⚠️ Masukkan angka dulu bro!'; showToast('⚠️ Masukkan angka!'); return; }
    var output = '';
    switch(dir) {
        case 'CF': output = val + '°C = ' + (val * 9/5 + 32).toFixed(2) + '°F'; break;
        case 'FC': output = val + '°F = ' + ((val - 32) * 5/9).toFixed(2) + '°C'; break;
        case 'CK': output = val + '°C = ' + (val + 273.15).toFixed(2) + ' K'; break;
        case 'KC': output = val + 'K = ' + (val - 273.15).toFixed(2) + '°C'; break;
        default: output = 'Error';
    }
    result.textContent = '✅ ' + output;
    showToast('🌡️ Konversi selesai!');
    incrementUsage();
};

window.encodeBase64 = function() {
    var input = document.getElementById('base64Input').value;
    try {
        document.getElementById('base64Result').textContent = btoa(unescape(encodeURIComponent(input)));
        showToast('🔒 Encode berhasil!');
        incrementUsage();
    } catch(e) {
        document.getElementById('base64Result').textContent = '❌ Gagal encode: ' + e.message;
        showToast('❌ Gagal encode');
    }
};

window.decodeBase64 = function() {
    var input = document.getElementById('base64Input').value;
    try {
        document.getElementById('base64Result').textContent = decodeURIComponent(escape(atob(input)));
        showToast('🔓 Decode berhasil!');
        incrementUsage();
    } catch(e) {
        document.getElementById('base64Result').textContent = '❌ Gagal decode (cek format base64): ' + e.message;
        showToast('❌ Gagal decode');
    }
};

window.analyzeText = function() {
    var txt = document.getElementById('counterInput').value;
    var chars = txt.length;
    var words = txt.trim() === '' ? 0 : txt.trim().split(/\s+/).length;
    var lines = txt === '' ? 0 : txt.split(/\n/).length;
    var spaces = (txt.match(/ /g) || []).length;
    var sentences = (txt.match(/[.!?]+/g) || []).length;
    document.getElementById('counterResult').innerHTML = '📊 <b>' + chars + '</b> huruf | <b>' + words + '</b> kata | <b>' + lines + '</b> baris | <b>' + spaces + '</b> spasi | <b>' + sentences + '</b> kalimat';
    showToast('📊 Analisis teks selesai!');
    incrementUsage();
};

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? { r: parseInt(result[1],16), g: parseInt(result[2],16), b: parseInt(result[3],16) } : { r:0,g:0,b:0 };
}

window.copyColor = function(type) {
    var picker = document.getElementById('colorPicker');
    var val = picker.value;
    var rgb = hexToRgb(val);
    var text = type === 'hex' ? val : 'rgb(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ')';
    navigator.clipboard.writeText(text).then(function() {
        showToast('✅ "' + text + '" berhasil di-copy!');
        var res = document.getElementById('colorResult');
        res.textContent = '✅ "' + text + '" berhasil di-copy!';
        setTimeout(function() { res.innerHTML = 'HEX: ' + val + ' | RGB: rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')'; }, 2000);
        incrementUsage();
    }).catch(function() {
        showToast('⚠️ Gagal copy, silakan salin manual');
    });
};

// ==========================================
// FUNGSI TOOLS BARU (SEMUA API KEY UDAH GUE MASUKIN)
// ==========================================

// 1. MEDIA DOWNLOADER – GRATIS, NO API KEY!
window.downloadMedia = function() {
    var platform = document.getElementById('mediaPlatform').value;
    var link = document.getElementById('mediaLink').value.trim();
    var result = document.getElementById('mediaResult');
    if (!link) { result.textContent = '⚠️ Masukkan link dulu bro!'; return; }
    result.textContent = '⏳ Sedang memproses...';

    // AllMedia Downloader API – GRATIS, TANPA API KEY![reference:2][reference:3]
    var apiUrl = 'https://allmediadownloader.p.rapidapi.com/download?url=' + encodeURIComponent(link) + '&platform=' + platform;

    fetch(apiUrl, {
        headers: {
            'x-rapidapi-host': 'allmediadownloader.p.rapidapi.com',
            'x-rapidapi-key': '' // KOSONGKAN! API ini emang gratis tanpa key
        }
    })
    .then(function(response) {
        if (!response.ok) throw new Error('Gagal fetch API');
        return response.json();
    })
    .then(function(data) {
        if (data.error) { result.textContent = '❌ ' + data.error; return; }
        if (data.download_link) {
            result.innerHTML = '✅ Link download: <a href="' + data.download_link + '" target="_blank" style="color:var(--accent-light);">' + data.download_link + '</a>';
            showToast('📥 Link download siap!');
            incrementUsage();
        } else {
            result.textContent = '❌ Gagal mendapatkan link download.';
        }
    })
    .catch(function(err) {
        result.textContent = '❌ Error: ' + err.message + '. Coba lagi atau gunakan platform lain.';
        showToast('❌ Gagal download media');
    });
};

// 2. CUACA (pake wttr.in – no API key)
window.checkWeather = function() {
    var city = document.getElementById('weatherCity').value.trim();
    var result = document.getElementById('weatherResult');
    if (!city) { result.textContent = '⚠️ Masukkan nama kota dulu!'; return; }
    result.textContent = '⏳ Sedang mengambil data cuaca...';

    fetch('https://wttr.in/' + encodeURIComponent(city) + '?format=%C+%t+%w+%h&lang=id')
    .then(function(response) {
        if (!response.ok) throw new Error('Kota tidak ditemukan');
        return response.text();
    })
    .then(function(data) {
        var parts = data.split(' ');
        var condition = parts.slice(0, -3).join(' ');
        var temp = parts[parts.length - 3] || '--';
        var wind = parts[parts.length - 2] || '--';
        var humidity = parts[parts.length - 1] || '--';
        result.innerHTML = '🌤️ <b>' + city + '</b><br>Kondisi: ' + condition + '<br>Suhu: ' + temp + '<br>Angin: ' + wind + '<br>Kelembapan: ' + humidity;
        showToast('🌤️ Cuaca ' + city + ' berhasil diambil!');
        incrementUsage();
    })
    .catch(function(err) {
        result.textContent = '❌ Gagal mengambil data cuaca. Pastikan nama kota benar.';
        showToast('❌ Gagal cek cuaca');
    });
};

// 3. URL SHORTENER (pake is.gd – no API key)
window.shortenUrl = function() {
    var url = document.getElementById('urlInput').value.trim();
    var result = document.getElementById('urlResult');
    if (!url) { result.textContent = '⚠️ Masukkan link dulu!'; return; }
    result.textContent = '⏳ Sedang memendekkan...';

    fetch('https://is.gd/create.php?format=json&url=' + encodeURIComponent(url))
    .then(function(response) {
        if (!response.ok) throw new Error('Gagal memendekkan');
        return response.json();
    })
    .then(function(data) {
        if (data.shorturl) {
            result.innerHTML = '✅ Link pendek: <a href="' + data.shorturl + '" target="_blank" style="color:var(--accent-light);">' + data.shorturl + '</a>';
            showToast('✂️ Link berhasil dipendekkan!');
            incrementUsage();
        } else {
            result.textContent = '❌ Gagal memendekkan link.';
        }
    })
    .catch(function(err) {
        result.textContent = '❌ Error: ' + err.message;
        showToast('❌ Gagal pendekin link');
    });
};

// 4. IMAGE ENHANCER (pake API DeepAI – API key udah masukin)
window.enhanceImage = function() {
    var fileInput = document.getElementById('imageInput');
    var result = document.getElementById('imageResult');
    var preview = document.getElementById('imagePreview');
    if (!fileInput.files || fileInput.files.length === 0) {
        result.textContent = '⚠️ Upload gambar dulu!';
        return;
    }
    var file = fileInput.files[0];
    var formData = new FormData();
    formData.append('image', file);

    result.textContent = '⏳ Sedang memproses...';

    // API Key DeepAI – udah gue masukin
    fetch('https://api.deepai.org/api/torch-srgan', {
        method: 'POST',
        headers: {
            'api-key': '8fc9580f-26d2-42b3-9b6a-bb6af33e4799'
        },
        body: formData
    })
    .then(function(response) {
        if (!response.ok) throw new Error('Gagal enhance gambar');
        return response.json();
    })
    .then(function(data) {
        if (data.output_url) {
            preview.innerHTML = '<img src="' + data.output_url + '" alt="Enhanced" style="max-width:100%; border-radius:16px; margin-top:12px;">';
            result.innerHTML = '✅ Gambar berhasil di-HD-kan! <br> <a href="' + data.output_url + '" target="_blank" style="color:var(--accent-light);">Download hasil</a>';
            showToast('✨ Gambar berhasil di-HD-kan!');
            incrementUsage();
        } else {
            result.textContent = '❌ Gagal enhance gambar.';
        }
    })
    .catch(function(err) {
        result.textContent = '❌ Error: ' + err.message + '. Pastikan API key benar.';
        showToast('❌ Gagal enhance gambar');
    });
};

// 5. NEWS HEADLINE (pake NewsAPI – API key udah masukin)
window.getNews = function() {
    var category = document.getElementById('newsCategory').value;
    var result = document.getElementById('newsResult');
    result.textContent = '⏳ Sedang mengambil berita...';

    // API Key NewsAPI – udah gue masukin
    var apiKey = '175ac6f4ebd341fb9b14b1d0281c712b';
    fetch('https://newsapi.org/v2/top-headlines?country=id&category=' + category + '&apiKey=' + apiKey)
    .then(function(response) {
        if (!response.ok) throw new Error('Gagal mengambil berita');
        return response.json();
    })
    .then(function(data) {
        if (data.articles && data.articles.length > 0) {
            var html = '<ul style="list-style:none; padding:0;">';
            for (var i = 0; i < Math.min(5, data.articles.length); i++) {
                var art = data.articles[i];
                html += '<li style="padding:10px 0; border-bottom:1px solid var(--border-color);">';
                html += '<a href="' + art.url + '" target="_blank" style="color:var(--accent-light); font-weight:600;">' + (art.title || 'Judul tidak tersedia') + '</a>';
                if (art.description) html += '<p style="font-size:0.8rem; color:var(--text-secondary); margin:4px 0 0;">' + art.description + '</p>';
                html += '</li>';
            }
            html += '</ul>';
            result.innerHTML = html;
            showToast('📰 Berita berhasil dimuat!');
            incrementUsage();
        } else {
            result.textContent = '📭 Tidak ada berita untuk kategori ini.';
        }
    })
    .catch(function(err) {
        result.textContent = '❌ Error: ' + err.message + '. Pastikan API key benar.';
        showToast('❌ Gagal memuat berita');
    });
};

// ==========================================
// INIT
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    // Tema
    var theme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    var toggle = document.getElementById('themeToggle');
    toggle.textContent = theme === 'dark' ? '🌙' : '☀️';
    toggle.addEventListener('click', function() {
        var current = document.documentElement.getAttribute('data-theme');
        var next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        toggle.textContent = next === 'dark' ? '🌙' : '☀️';
        showToast(next === 'dark' ? '🌙 Mode Gelap' : '☀️ Mode Terang');
    });

    // Search & Filter
    document.getElementById('searchInput').addEventListener('input', function() { renderTools(); });
    document.querySelectorAll('.chip').forEach(function(chip) {
        chip.addEventListener('click', function() {
            document.querySelectorAll('.chip').forEach(function(c) { c.classList.remove('active'); });
            this.classList.add('active');
            renderTools();
        });
    });

    // Inisialisasi counter
    document.getElementById('usageCounter').textContent = totalUsage;

    renderTools();
    updateStats();
});
