// ==========================================
// DATA TOOLS (Tambah / ubah di sini)
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
// FUNGSI RENDER GRID
// ==========================================
function renderTools() {
    var grid = document.getElementById('toolsGrid');
    var searchVal = document.getElementById('searchInput').value.toLowerCase();
    var activeChip = document.querySelector('.chip.active');
    var currentCat = activeChip ? activeChip.dataset.cat : 'all';

    var filtered = tools.filter(function(t) {
        var matchCat = currentCat === 'all' || t.cat === currentCat;
        var matchSearch = t.name.toLowerCase().includes(searchVal) || t.desc.toLowerCase().includes(searchVal);
        return matchCat && matchSearch;
    });

    if (filtered.length === 0) {
        grid.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:60px 0; color:#5a4a7a;">😭 Gak ada tool yang cocok bro...</div>';
        return;
    }

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

// ==========================================
// FUNGSI BUKA MODAL (per tools)
// ==========================================
window.openTool = function(toolId) {
    var modal = document.getElementById('modal');
    var title = document.getElementById('modalTitle');
    var body = document.getElementById('modalBody');
    var tool = tools.find(function(t) { return t.id === toolId; });
    if (!tool) return;
    title.innerHTML = tool.icon + ' ' + tool.name;

    var html = '';
    switch(toolId) {
        case 'password':
            html = '<label>🔐 Panjang Password</label>' +
                   '<input type="number" id="passLength" value="16" min="6" max="64">' +
                   '<button class="btn-primary" onclick="generatePassword()">⚡ Generate!</button>' +
                   '<div class="result-box" id="passResult">Klik generate untuk hasil</div>' +
                   '<small style="color:#5a4a7a; display:block; margin-top:6px;">Huruf besar, kecil, angka, & simbol</small>';
            break;
        case 'json':
            html = '<label>📄 Masukkan JSON</label>' +
                   '<textarea id="jsonInput" placeholder=\'{ "nama": "Nexus" }\'></textarea>' +
                   '<button class="btn-primary" onclick="formatJson()">✨ Format & Validasi</button>' +
                   '<div class="result-box" id="jsonResult">Hasil akan muncul di sini</div>';
            break;
        case 'unit':
            html = '<label>🌡️ Pilih Arah Konversi</label>' +
                   '<select id="unitDirection" style="width:100%; background:rgba(255,255,255,0.04); border:1px solid rgba(168,85,247,0.15); border-radius:16px; padding:12px 16px; color:#eee8ff;">' +
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
            html = '<label>📝 Teks / Base64</label>' +
                   '<textarea id="base64Input" placeholder="Masukkan teks atau kode base64..."></textarea>' +
                   '<div style="display:flex; gap:10px;">' +
                   '<button class="btn-primary" style="flex:1;" onclick="encodeBase64()">🔒 Encode</button>' +
                   '<button class="btn-primary" style="flex:1; background:#4a2a7a;" onclick="decodeBase64()">🔓 Decode</button>' +
                   '</div>' +
                   '<div class="result-box" id="base64Result">Hasil di sini</div>';
            break;
        case 'counter':
            html = '<label>📝 Masukkan Teks</label>' +
                   '<textarea id="counterInput" placeholder="Tulis sesuatu..."></textarea>' +
                   '<button class="btn-primary" onclick="analyzeText()">📊 Analisis</button>' +
                   '<div class="result-box" id="counterResult">Klik analisis untuk lihat statistik</div>';
            break;
        case 'color':
            html = '<label>🎨 Pilih Warna</label>' +
                   '<input type="color" id="colorPicker" value="#7c3aed" style="height:60px; padding:4px; cursor:pointer;">' +
                   '<div class="color-preview" id="colorPreview" style="background:#7c3aed;"></div>' +
                   '<div style="display:flex; gap:10px; margin-top:10px; flex-wrap:wrap;">' +
                   '<button class="btn-primary" style="flex:1; padding:8px;" onclick="copyColor(\'hex\')">📋 Copy HEX</button>' +
                   '<button class="btn-primary" style="flex:1; padding:8px; background:#4a2a7a;" onclick="copyColor(\'rgb\')">📋 Copy RGB</button>' +
                   '</div>' +
                   '<div class="result-box" id="colorResult">HEX: #7c3aed | RGB: rgb(124,58,237)</div>';
            break;
        default: html = '<p>Tool ini belum siap, tapi lo bisa bayangin aja kerennya! 😎</p>';
    }
    body.innerHTML = html;
    modal.classList.add('show');

    // Event khusus buat Color Picker biar realtime
    if (toolId === 'color') {
        setTimeout(function() {
            var picker = document.getElementById('colorPicker');
            if (picker) {
                picker.addEventListener('input', function(e) {
                    var val = e.target.value;
                    var preview = document.getElementById('colorPreview');
                    if (preview) preview.style.background = val;
                    var rgb = hexToRgb(val);
                    var result = document.getElementById('colorResult');
                    if (result) result.innerHTML = 'HEX: ' + val + ' | RGB: rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')';
                });
            }
        }, 50);
    }
};

window.closeModal = function() {
    document.getElementById('modal').classList.remove('show');
};
document.getElementById('modal').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
});

// ==========================================
// FUNGSI TOOLS (BENERAN JALAN)
// ==========================================

// 1. Password Generator
window.generatePassword = function() {
    var len = parseInt(document.getElementById('passLength').value) || 16;
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    var pass = '';
    for (var i = 0; i < len; i++) pass += chars.charAt(Math.floor(Math.random() * chars.length));
    document.getElementById('passResult').textContent = pass;
};

// 2. JSON Formatter
window.formatJson = function() {
    var input = document.getElementById('jsonInput').value.trim();
    var result = document.getElementById('jsonResult');
    try {
        var parsed = JSON.parse(input);
        result.textContent = JSON.stringify(parsed, null, 2);
        result.style.borderLeftColor = '#4ade80';
    } catch(e) {
        result.textContent = '❌ Error: ' + e.message;
        result.style.borderLeftColor = '#f87171';
    }
};

// 3. Unit Converter
window.convertUnit = function() {
    var val = parseFloat(document.getElementById('unitInput').value);
    var dir = document.getElementById('unitDirection').value;
    var result = document.getElementById('unitResult');
    if (isNaN(val)) { result.textContent = '⚠️ Masukkan angka dulu bro!'; return; }
    var output = '';
    switch(dir) {
        case 'CF': output = val + '°C = ' + (val * 9/5 + 32).toFixed(2) + '°F'; break;
        case 'FC': output = val + '°F = ' + ((val - 32) * 5/9).toFixed(2) + '°C'; break;
        case 'CK': output = val + '°C = ' + (val + 273.15).toFixed(2) + ' K'; break;
        case 'KC': output = val + 'K = ' + (val - 273.15).toFixed(2) + '°C'; break;
        default: output = 'Error';
    }
    result.textContent = '✅ ' + output;
};

// 4. Base64
window.encodeBase64 = function() {
    var input = document.getElementById('base64Input').value;
    try { document.getElementById('base64Result').textContent = btoa(unescape(encodeURIComponent(input))); } 
    catch(e) { document.getElementById('base64Result').textContent = '❌ Gagal encode: ' + e.message; }
};
window.decodeBase64 = function() {
    var input = document.getElementById('base64Input').value;
    try { document.getElementById('base64Result').textContent = decodeURIComponent(escape(atob(input))); } 
    catch(e) { document.getElementById('base64Result').textContent = '❌ Gagal decode (cek format base64): ' + e.message; }
};

// 5. Text Analyzer
window.analyzeText = function() {
    var txt = document.getElementById('counterInput').value;
    var chars = txt.length;
    var words = txt.trim() === '' ? 0 : txt.trim().split(/\s+/).length;
    var lines = txt === '' ? 0 : txt.split(/\n/).length;
    var spaces = (txt.match(/ /g) || []).length;
    var sentences = (txt.match(/[.!?]+/g) || []).length;
    document.getElementById('counterResult').innerHTML = 
        '📊 <b>' + chars + '</b> huruf | <b>' + words + '</b> kata | <b>' + lines + '</b> baris | <b>' + spaces + '</b> spasi | <b>' + sentences + '</b> kalimat';
};

// 6. Color Picker Helper
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
        var res = document.getElementById('colorResult');
        res.textContent = '✅ "' + text + '" berhasil di-copy!';
        setTimeout(function() { res.innerHTML = 'HEX: ' + val + ' | RGB: rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')'; }, 2000);
    }).catch(function() { alert('Copy manual aja bro: ' + text); });
};

// ==========================================
// EVENT LISTENER (Search & Filter)
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    // Search
    var searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() { renderTools(); });
    }

    // Filter kategori (chip)
    var chips = document.querySelectorAll('.chip');
    chips.forEach(function(chip) {
        chip.addEventListener('click', function() {
            chips.forEach(function(c) { c.classList.remove('active'); });
            this.classList.add('active');
            renderTools();
        });
    });

    // Render awal (tapi splash.js yang nampilin dashboard, 
    // kita render setelah dashboard aktif. Tapi gpp render dulu aja)
    // Karena splash.js nunda 4.8 detik, tools.js jalan lebih cepet.
    // Biar aman, kita render ulang setelah dashboard muncul.
    // Tapi kita panggil renderTools() sekarang juga biar gak kosong.
    renderTools();

    // Re-render saat dashboard aktif (buat jaga-jaga)
    var observer = new MutationObserver(function() {
        var dashboard = document.getElementById('dashboard');
        if (dashboard && dashboard.classList.contains('active')) {
            renderTools();
            observer.disconnect();
        }
    });
    observer.observe(document.getElementById('dashboard'), { attributes: true, attributeFilter: ['class'] });
});
