// ==========================================
// IMAGE ENHANCER (image-upscaling.net – GRATIS, NO API KEY)
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

    // 2. Batasi ukuran (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
        result.textContent = '⚠️ Ukuran gambar terlalu besar! Maksimal 10MB.';
        return;
    }

    var reader = new FileReader();

    reader.onload = function(e) {
        var base64Image = e.target.result; // format: data:image/png;base64,...

        result.innerHTML = '⏳ Sedang memproses... <br> <small style="color:var(--text-secondary);">Upscale 4x, bisa makan waktu 10-30 detik</small>';

        // 3. Kirim ke API image-upscaling.net
        fetch('https://api.image-upscaling.net/upscale', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                image: base64Image,
                scale: 4 // bisa 2, 4, atau 8
            })
        })
        .then(function(response) {
            if (!response.ok) {
                // Coba baca pesan error dari response
                return response.text().then(function(text) {
                    throw new Error('HTTP ' + response.status + ': ' + text);
                });
            }
            return response.json();
        })
        .then(function(data) {
            console.log('Response API:', data);

            // 4. Cek hasil
            if (data.success && data.url) {
                var resultUrl = data.url;
                preview.innerHTML = '<img src="' + resultUrl + '" alt="Upscaled" style="max-width:100%; border-radius:16px; margin-top:12px; box-shadow: 0 0 20px rgba(168,85,247,0.2);">';
                result.innerHTML = '✅ Gambar berhasil di-upscale 4x! <br> <a href="' + resultUrl + '" target="_blank" style="color:var(--accent-light);">Download hasil</a>';
                showToast('✨ Gambar berhasil di-upscale!');
                incrementUsage();
            } else {
                result.textContent = '❌ Gagal upscale. ' + (data.message || 'Response tidak valid.');
            }
        })
        .catch(function(err) {
            result.textContent = '❌ Error: ' + err.message;
            showToast('❌ Gagal upscale gambar');
        });
    };

    reader.readAsDataURL(file);
};
