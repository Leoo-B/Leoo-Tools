// ==========================================
// IMAGE ENHANCER (Vercel API + Miragic SDK)
// ==========================================

window.enhanceImage = function() {
    var fileInput = document.getElementById('imageInput');
    var result = document.getElementById('imageResult');
    var preview = document.getElementById('imagePreview');

    if (!fileInput.files || fileInput.files.length === 0) {
        result.textContent = '⚠️ Upload gambar dulu!';
        return;
    }

    var file = fileInput.files[0];

    if (file.size > 10 * 1024 * 1024) {
        result.textContent = '⚠️ Ukuran gambar terlalu besar! Maksimal 10MB.';
        return;
    }

    var formData = new FormData();
    formData.append('file', file);

    result.innerHTML = '⏳ Sedang memproses... <br> <small style="color:var(--text-secondary);">Upscale 2x pake AI, bisa makan waktu 10-30 detik (cold start)</small>';

    fetch('/api/upscale', {
        method: 'POST',
        body: formData
    })
    .then(function(response) {
        if (!response.ok) {
            return response.text().then(function(text) {
                throw new Error('HTTP ' + response.status + ': ' + text);
            });
        }
        // Cek tipe konten
        var contentType = response.headers.get('content-type');
        if (!contentType || !contentType.startsWith('image/')) {
            return response.text().then(function(text) {
                throw new Error('Response bukan gambar: ' + text);
            });
        }
        return response.blob();
    })
    .then(function(blob) {
        // Cek ukuran blob
        if (blob.size === 0) {
            throw new Error('File hasil kosong (0 bytes)');
        }
        var resultUrl = URL.createObjectURL(blob);
        preview.innerHTML = '<img src="' + resultUrl + '" alt="Upscaled" style="max-width:100%; border-radius:16px; margin-top:12px; box-shadow: 0 0 20px rgba(168,85,247,0.2);">';
        result.innerHTML = '✅ Gambar berhasil di-upscale 2x! <br> <a href="' + resultUrl + '" download="upscaled.png" style="color:var(--accent-light);">Download hasil</a>';
        showToast('✨ Gambar berhasil di-upscale!');
        incrementUsage();
    })
    .catch(function(err) {
        result.textContent = '❌ Error: ' + err.message;
        showToast('❌ Gagal upscale gambar');
    });
};
