// ==========================================
// IMAGE ENHANCER (ImgBB + Vercel Proxy → ExsalAPI)
// Alur: Upload → ImgBB (dapat display_url) → /api/enhance (proxy) → tampil hasil
// ==========================================

var IMGBB_KEY = 'cf58549c110b49f424dd4076a144b452';

window.enhanceImage = function() {
    var fileInput = document.getElementById('imageInput');
    var result    = document.getElementById('imageResult');
    var preview   = document.getElementById('imagePreview');

    // Reset preview
    preview.innerHTML = '';

    // Validasi file
    if (!fileInput.files || fileInput.files.length === 0) {
        result.textContent = 'Upload gambar dulu!';
        showToast('Upload gambar dulu!', 'error');
        return;
    }

    var file = fileInput.files[0];

    if (file.size > 10 * 1024 * 1024) {
        result.textContent = 'Ukuran gambar terlalu besar! Maksimal 10MB.';
        showToast('File terlalu besar! Maks 10MB', 'error');
        return;
    }

    // ── STEP 1: Upload ke ImgBB ──────────────────────────────
    result.innerHTML =
        '⏳ <b>Step 1/2:</b> Mengupload gambar ke server...' +
        '<br><small style="color:var(--mute);">Mohon tunggu sebentar.</small>';

    var formData = new FormData();
    formData.append('image', file);
    formData.append('expiration', '259200'); // otomatis hapus setelah 3 hari

    fetch('https://api.imgbb.com/1/upload?key=' + IMGBB_KEY, {
        method: 'POST',
        body: formData
    })
    .then(function(res) {
        if (!res.ok) throw new Error('Gagal upload ke server (HTTP ' + res.status + ')');
        return res.json();
    })
    .then(function(json) {
        if (!json.success || !json.data || !json.data.display_url) {
            throw new Error('Upload gagal: ' + (json.error && json.error.message ? json.error.message : 'Response tidak valid'));
        }

        // display_url = tautan langsung ke file gambar
        var imageUrl = json.data.display_url;

        // ── STEP 2: Enhance via Vercel proxy ─────────────────
        result.innerHTML =
            '⏳ <b>Step 2/2:</b> AI sedang meningkatkan kualitas gambar...' +
            '<br><small style="color:var(--mute);">Proses AI bisa makan waktu 10–30 detik.</small>';

        // Hit /api/enhance (Vercel Function) — bukan langsung ke exsalapi (hindari CORS)
        return fetch('/api/enhance?image_url=' + encodeURIComponent(imageUrl), { method: 'GET' });
    })
    .then(function(res) {
        if (!res.ok) throw new Error('Gagal menghubungi API enhance (HTTP ' + res.status + ')');
        return res.json();
    })
    .then(function(json) {
        if (!json.status || !json.data || !json.data.download_url) {
            throw new Error(json.message || 'Enhance gagal: response tidak valid');
        }

        var downloadUrl = json.data.download_url;

        // Tampilkan hasil
        preview.innerHTML =
            '<img src="' + downloadUrl + '" alt="Enhanced" ' +
            'style="max-width:100%; border-radius:var(--radius-md); margin-top:12px; box-shadow:var(--shadow-l4);">';

        result.innerHTML =
            '✅ <b>Gambar berhasil ditingkatkan!</b><br><br>' +
            '<a href="' + downloadUrl + '" target="_blank" download ' +
            'style="color:var(--accent-light); font-weight:500;">⬇ Download Hasil HD</a>';

        showToast('Gambar berhasil di-enhance!', 'success');
        incrementUsage();
    })
    .catch(function(err) {
        result.textContent = '❌ Error: ' + err.message;
        showToast('Gagal enhance gambar', 'error');
    });
};
