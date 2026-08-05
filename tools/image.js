// ==========================================
// IMAGE ENHANCER (PixelBoostAI - pure browser, no server)
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
    var reader = new FileReader();
    reader.onload = function(e) {
        var img = new Image();
        img.onload = function() {
            try {
                // 1. Upscale pake PixelBoostAI (4x, metode lanczos)
                var upscaled = pixelboostai.upscale(img, {
                    scale: 2,          // 2x, 3x, atau 4x
                    method: 'lanczos',  // lanczos, bicubic, bilinear, nearest
                    quality: 'high'     // low, medium, high
                });

                // 2. Tampilkan hasil
                preview.innerHTML = '<img src="' + upscaled + '" alt="Upscaled" style="max-width:100%; border-radius:16px; margin-top:12px;">';
                result.innerHTML = '✅ Gambar berhasil di-upscale! <br> <a href="' + upscaled + '" download style="color:var(--accent-light);">Download hasil</a>';
                showToast('✨ Gambar berhasil di-upscale!');
                incrementUsage();
            } catch (err) {
                result.textContent = '❌ Error: ' + err.message;
                showToast('❌ Gagal upscale gambar');
            }
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
};
