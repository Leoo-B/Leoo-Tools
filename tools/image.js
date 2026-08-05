// ==========================================
// IMAGE ENHANCER (pica - upscale di browser, no server)
// ==========================================
window.enhanceImage = function() {
    var fileInput = document.getElementById('imageInput');
    var result = document.getElementById('imageResult');
    var preview = document.getElementById('imagePreview');

    // 1. Validasi: cek apakah ada file yang diupload
    if (!fileInput.files || fileInput.files.length === 0) {
        result.textContent = '⚠️ Upload gambar dulu!';
        return;
    }

    var file = fileInput.files[0];

    // 2. Batasi ukuran file (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
        result.textContent = '⚠️ Ukuran gambar terlalu besar! Maksimal 10MB.';
        return;
    }

    var reader = new FileReader();
    reader.onload = function(e) {
        var img = new Image();
        img.onload = function() {
            try {
                // 3. Cek library pica
                var pica = window.pica || window.Pica;
                if (!pica) {
                    throw new Error('Library pica tidak ditemukan. Pastikan script sudah di-load.');
                }

                // 4. Tentukan skala (2x, 3x, atau 4x)
                var scale = 2; // bisa diubah ke 3 atau 4
                var canvas = document.createElement('canvas');
                canvas.width = img.width * scale;
                canvas.height = img.height * scale;

                result.innerHTML = '⏳ Sedang memproses... <br> <small style="color:var(--text-secondary);">Upscale 2x, bisa makan waktu 2-5 detik</small>';

                // 5. Proses upscale pake pica
                pica().resize(img, canvas, {
                    quality: 3,          // 0-3, makin tinggi makin bagus
                    alpha: true,
                    unsharpAmount: 80,   // ketajaman
                    unsharpRadius: 0.6
                })
                .then(function() {
                    // 6. Tampilkan hasil
                    var resultUrl = canvas.toDataURL('image/png');
                    preview.innerHTML = '<img src="' + resultUrl + '" alt="Upscaled" style="max-width:100%; border-radius:16px; margin-top:12px;">';
                    result.innerHTML = '✅ Gambar berhasil di-upscale! <br> <a href="' + resultUrl + '" download style="color:var(--accent-light);">Download hasil</a>';
                    showToast('✨ Gambar berhasil di-upscale!');
                    incrementUsage();
                })
                .catch(function(err) {
                    result.textContent = '❌ Error saat resize: ' + err.message;
                    showToast('❌ Gagal upscale gambar');
                });

            } catch (err) {
                result.textContent = '❌ Error: ' + err.message;
                showToast('❌ Gagal upscale gambar');
            }
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
};
