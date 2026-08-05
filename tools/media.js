// ==========================================
// IMAGE ENHANCER (xBRZ - UMD version)
// ==========================================

window.enhanceImage = function() {
    var fileInput = document.getElementById('imageInput');
    var result = document.getElementById('imageResult');
    var preview = document.getElementById('imagePreview');

    // 1. Validasi file
    if (!fileInput.files || fileInput.files.length === 0) {
        result.textContent = '⚠️ Upload gambar dulu!';
        return;
    }

    var file = fileInput.files[0];

    if (file.size > 10 * 1024 * 1024) {
        result.textContent = '⚠️ Ukuran gambar terlalu besar! Maksimal 10MB.';
        return;
    }

    var reader = new FileReader();
    reader.onload = function(e) {
        var img = new Image();
        img.onload = function() {
            try {
                // 2. Cek library xBRZ
                if (typeof window.xbrz === 'undefined') {
                    throw new Error('Library xBRZ tidak ditemukan. Pastikan script sudah di-load.');
                }

                // 3. Baca pixel gambar ke canvas
                var srcCanvas = document.createElement('canvas');
                srcCanvas.width = img.width;
                srcCanvas.height = img.height;
                var srcCtx = srcCanvas.getContext('2d');
                srcCtx.drawImage(img, 0, 0);
                var imageData = srcCtx.getImageData(0, 0, img.width, img.height);
                var srcData = new Uint8ClampedArray(imageData.data);

                // 4. Upscale pake xBRZ (skala 2x)
                var scaleFactor = 2; // bisa diubah ke 3 atau 4
                var targetWidth = img.width * scaleFactor;
                var targetHeight = img.height * scaleFactor;
                var targetData = new Uint8ClampedArray(targetWidth * targetHeight * 4);

                // Panggil fungsi xBRZ dari UMD
                window.xbrz.scale(
                    imageData.data,
                    img.width,
                    img.height,
                    targetData,
                    targetWidth,
                    targetHeight,
                    scaleFactor,
                    null // parameter optional
                );

                // 5. Tampilkan hasil ke canvas baru
                var targetCanvas = document.createElement('canvas');
                targetCanvas.width = targetWidth;
                targetCanvas.height = targetHeight;
                var targetCtx = targetCanvas.getContext('2d');
                var targetImageData = new ImageData(targetData, targetWidth, targetHeight);
                targetCtx.putImageData(targetImageData, 0, 0);

                // 6. Convert ke URL gambar
                var resultUrl = targetCanvas.toDataURL('image/png');

                // 7. Tampilkan di preview
                preview.innerHTML = '<img src="' + resultUrl + '" alt="Upscaled" style="max-width:100%; border-radius:16px; margin-top:12px;">';
                result.innerHTML = '✅ Gambar berhasil di-upscale! <br> <a href="' + resultUrl + '" download style="color:var(--accent-light);">Download hasil</a>';
                
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
