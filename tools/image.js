// ==========================================
// IMAGE ENHANCER (RapidAPI – /imgupscalerform)
// ==========================================
window.enhanceImage = function() {
    var fileInput = document.getElementById('imageInput');
    var result = document.getElementById('imageResult');
    var preview = document.getElementById('imagePreview');

    // Validasi: ada file gak?
    if (!fileInput.files || fileInput.files.length === 0) {
        result.textContent = '⚠️ Upload gambar dulu!';
        return;
    }

    var file = fileInput.files[0];
    var formData = new FormData();
    formData.append('file', file);
    formData.append('resolution', '512');
    formData.append('strength', '0.3');
    formData.append('hdr_effect', '0');

    result.textContent = '⏳ Sedang memproses... (bisa 10-20 detik)';

    fetch('https://chatgpt-vision1.p.rapidapi.com/imgupscalerform', {
        method: 'POST',
        headers: {
            'x-rapidapi-host': 'chatgpt-vision1.p.rapidapi.com',
            'x-rapidapi-key': '28922b9718mh1a8a4f271170b5p1c2c51jsn3f8f2299783a'
        },
        body: formData
    })
    .then(function(response) {
        if (!response.ok) throw new Error('Gagal upscale');
        return response.json();
    })
    .then(function(data) {
        // Cek respon dari API
        if (data.output_url || data.image_url || data.result) {
            var imageUrl = data.output_url || data.image_url || data.result;
            preview.innerHTML = '<img src="' + imageUrl + '" alt="Upscaled" style="max-width:100%; border-radius:16px; margin-top:12px; border:1px solid var(--border-color);">';
            result.innerHTML = '✅ Gambar berhasil di-upscale! <br> <a href="' + imageUrl + '" target="_blank" style="color:var(--accent-light);">Download hasil</a>';
            showToast('✨ Gambar berhasil di-upscale!');
            incrementUsage();
        } else {
            result.textContent = '❌ Gagal upscale. Cek response: ' + JSON.stringify(data);
        }
    })
    .catch(function(err) {
        result.textContent = '❌ Error: ' + err.message;
        showToast('❌ Gagal upscale gambar');
    });
};
