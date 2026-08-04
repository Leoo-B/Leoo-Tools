// ==========================================
// 1. PARTIKEL DIV (Lebih Ringan & Pasti Muncul)
// ==========================================
function createParticlesDiv() {
    var count = 35; // jumlah bintang
    for (var i = 0; i < count; i++) {
        var el = document.createElement('div');
        el.className = 'particle';
        var size = Math.random() * 4 + 2; // 2–6px
        el.style.width = size + 'px';
        el.style.height = size + 'px';
        el.style.left = Math.random() * 100 + '%';
        el.style.top = Math.random() * 100 + '%';
        el.style.animationDuration = (Math.random() * 15 + 10) + 's'; // 10–25 detik
        el.style.animationDelay = (Math.random() * 15) + 's';
        el.style.background = 'rgba(168, 85, 247, ' + (Math.random() * 0.5 + 0.3) + ')';
        document.body.appendChild(el);
    }
}

// ==========================================
// 2. TOAST NOTIFICATION
// ==========================================
function showToast(message) {
    var container = document.getElementById('toastContainer');
    if (!container) return;
    var toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(function() {
        if (toast.parentNode) toast.remove();
    }, 3000);
}

// ==========================================
// 3. SCROLL TO TOP
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
// 4. DATA TOOLS (tetap sama)
// ==========================================
var tools = [
    { name: "Password Generator", icon: "🔑", cat: "utility", desc: "Bikin password super kuat.", id: "password" },
    { name: "JSON Formatter", icon: "📋", cat: "dev", desc: "Rapihin & validasi JSON.", id: "json" },
    { name: "Unit Converter (Suhu)", icon: "🌡️", cat: "utility", desc: "Celcius ↔ Fahrenheit ↔ Kelvin.", id: "unit" },
    { name: "Base64 Encoder/Decoder", icon: "🔒", cat: "text", desc: "Encode/decode teks base64.", id: "base64" },
    { name: "Text Analyzer", icon: "📝", cat: "text", desc: "Hitung huruf, kata, kalimat.", id: "counter" },
    { name: "Color Picker Pro", icon: "🎨", cat: "utility", desc: "Pilih warna + salin kode.", id: "color" },
];

// ==========================================
// 5. STATISTIK
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
// 6. RENDER GRID
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
// 7. BUKA / TUTUP TOOL (sama)
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
        default: html += '<p>Tool ini belum siap, tapi lo bisa bayangin aja kerennya! 😎</p>';
    }
    body.innerHTML = html;

    if (toolId === 'color') {
        setTimeout(function() {
            var picker = document.getElementById('colorPicker');
            if (picker) {
                picker.addEventListener('input', function(e) {
                    var val = e.target.value;
                    document.getElementById('colorPreview').style.background = val;
                    var rgb = hexToRgb(val);
                    document.getElementById('colorResult').innerHTML = 'HEX: ' + val + ' | RGB: rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')';
                });
            }
        }, 50);
    }
};

window.closeToolPage = function() {
    document.body.classList.remove('tool-open');
    document.getElementById('toolPage').classList.remove('active');
};

// ==========================================
// 8. FUNGSI TOOLS (sama)
// ==========================================
window.generatePassword = function() {
    var len = parseInt(document.getElementById('passLength').value) || 16;
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    var pass = '';
    for (var i = 0; i < len; i++) pass += chars.charAt(Math.floor(Math.random() * chars.length));
    document.getElementById('passResult').textContent = pass;
    showToast('🔑 Password berhasil digenerate!');
};

window.formatJson = function() {
    var input = document.getElementById('jsonInput').value.trim();
    var result = document.getElementById('jsonResult');
    try {
        var parsed = JSON.parse(input);
        result.textContent = JSON.stringify(parsed, null, 2);
        result.style.borderLeftColor = '#4ade80';
        showToast('✅ JSON berhasil diformat!');
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
};

window.encodeBase64 = function() {
    var input = document.getElementById('base64Input').value;
    try {
        document.getElementById('base64Result').textContent = btoa(unescape(encodeURIComponent(input)));
        showToast('🔒 Encode berhasil!');
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
    }).catch(function() {
        showToast('⚠️ Gagal copy, silakan salin manual');
    });
};

// ==========================================
// 9. INIT
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    // Buat partikel div (pengganti canvas)
    createParticlesDiv();

    // Theme Toggle
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

    renderTools();
    updateStats();
});
