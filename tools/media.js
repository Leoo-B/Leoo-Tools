// ==========================================
// IMAGE ENHANCER (xBRZ - ES Module version)
// ==========================================

// Import xBRZ Scaler
import { Scaler } from '@kayahr/xbrz';

// Fungsi utama (gak pake window, karena dipanggil dari event listener)
function handleEnhance() {
    const fileInput = document.getElementById('imageInput');
    const result = document.getElementById('imageResult');
    const preview = document.getElementById('imagePreview');

    if (!fileInput.files || fileInput.files.length === 0) {
        result.textContent = '⚠️ Upload gambar dulu!';
        return;
    }

    const file = fileInput.files[0];

    if (file.size > 10 * 1024 * 1024) {
        result.textContent = '⚠️ Ukuran gambar terlalu besar! Maksimal 10MB.';
        return;
    }

    const reader = new FileReader();

    reader.onload = function(e) {
        const img = new Image();

        img.onload = function() {
            try {
                // 1. Baca pixel gambar ke canvas
                const srcCanvas = document.createElement('canvas');
                srcCanvas.width = img.width;
                srcCanvas.height = img.height;
                const srcCtx = srcCanvas.getContext('2d');
                srcCtx.drawImage(img, 0, 0);
                const imageData = srcCtx.getImageData(0, 0, img.width, img.height);
                const srcData = new Uint8ClampedArray(imageData.data);

                // 2. Upscale pake xBRZ (skala 2x)
                const scaleFactor = 2;
                const scaler = new Scaler(img.width, img.height, scaleFactor);
                const targetData = scaler.scale(srcData);

                // 3. Tampilkan hasil ke canvas baru
                const targetCanvas = document.createElement('canvas');
                targetCanvas.width = scaler.targetWidth;
                targetCanvas.height = scaler.targetHeight;
                const targetCtx = targetCanvas.getContext('2d');
                const targetImageData = new ImageData(targetData, scaler.targetWidth, scaler.targetHeight);
                targetCtx.putImageData(targetImageData, 0, 0);

                // 4. Convert ke URL gambar
                const resultUrl = targetCanvas.toDataURL('image/png');

                // 5. Tampilkan di preview
                preview.innerHTML = `<img src="${resultUrl}" alt="Upscaled" style="max-width:100%; border-radius:16px; margin-top:12px;">`;
                result.innerHTML = `✅ Gambar berhasil di-upscale! <br> <a href="${resultUrl}" download style="color:var(--accent-light);">Download hasil</a>`;

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
}

// ==========================================
// PASANG EVENT LISTENER KE TOMBOL (setelah DOM ready)
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    // Karena tombol dibuat dinamis di core.js, kita pake event delegation
    // atau kita tunggu tombol muncul.
    // Cara paling aman: pake MutationObserver atau observer sederhana.
    // Tapi kita bisa langsung pake event listener ke document
    // dengan mengecek target.id.
    document.addEventListener('click', function(e) {
        if (e.target && e.target.id === 'enhanceBtn') {
            handleEnhance();
        }
    });
});
