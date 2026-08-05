// ==========================================
// IMAGE ENHANCER (xBRZ - ES Module version)
// ==========================================

// Import xBRZ Scaler
import { Scaler } from '@kayahr/xbrz';

// Fungsi utama (tetap pake window biar bisa dipanggil dari HTML)
window.enhanceImage = function() {
    const fileInput = document.getElementById('imageInput');
    const result = document.getElementById('imageResult');
    const preview = document.getElementById('imagePreview');

    // 1. Validasi file
    if (!fileInput.files || fileInput.files.length === 0) {
        result.textContent = '⚠️ Upload gambar dulu!';
        return;
    }

    const file = fileInput.files[0];

    // 2. Batasi ukuran (max 10MB biar gak berat)
    if (file.size > 10 * 1024 * 1024) {
        result.textContent = '⚠️ Ukuran gambar terlalu besar! Maksimal 10MB.';
        return;
    }

    const reader = new FileReader();

    reader.onload = function(e) {
        const img = new Image();

        img.onload = function() {
            try {
                // 3. Baca pixel gambar ke canvas
                const srcCanvas = document.createElement('canvas');
                srcCanvas.width = img.width;
                srcCanvas.height = img.height;
                const srcCtx = srcCanvas.getContext('2d');
                srcCtx.drawImage(img, 0, 0);
                const imageData = srcCtx.getImageData(0, 0, img.width, img.height);
                const srcData = new Uint8ClampedArray(imageData.data);

                // 4. Upscale pake xBRZ (skala 2x)
                const scaleFactor = 2; // bisa diubah ke 3 atau 4
                const scaler = new Scaler(img.width, img.height, scaleFactor);
                const targetData = scaler.scale(srcData);

                // 5. Tampilkan hasil ke canvas baru
                const targetCanvas = document.createElement('canvas');
                targetCanvas.width = scaler.targetWidth;
                targetCanvas.height = scaler.targetHeight;
                const targetCtx = targetCanvas.getContext('2d');
                const targetImageData = new ImageData(targetData, scaler.targetWidth, scaler.targetHeight);
                targetCtx.putImageData(targetImageData, 0, 0);

                // 6. Convert ke URL gambar
                const resultUrl = targetCanvas.toDataURL('image/png');

                // 7. Tampilkan di preview & kasih link download
                preview.innerHTML = `<img src="${resultUrl}" alt="Upscaled" style="max-width:100%; border-radius:16px; margin-top:12px;">`;
                result.innerHTML = `✅ Gambar berhasil di-upscale! <br> <a href="${resultUrl}" download style="color:var(--accent-light);">Download hasil</a>`;
                
                // 8. Panggil fungsi dari core.js
                if (typeof showToast === 'function') {
                    showToast('✨ Gambar berhasil di-upscale!');
                }
                if (typeof incrementUsage === 'function') {
                    incrementUsage();
                }

            } catch (err) {
                result.textContent = `❌ Error: ${err.message}`;
                if (typeof showToast === 'function') {
                    showToast('❌ Gagal upscale gambar');
                }
            }
        };

        img.src = e.target.result;
    };

    reader.readAsDataURL(file);
};
