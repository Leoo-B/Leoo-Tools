// ==========================================
// IMAGE ENHANCER (RapidAPI – ChatGPT VISION)
// ENDPOINT: /imgupscalerform (Upload File)
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
    var formData = new FormData();
    formData.append('file', file);
    formData.append('resolution', '512');   // 512, 768, 1024, 2048
    formData.append('strength', '0.3');     // 0.1 - 0.9 (semakin tinggi, semakin kuat efek)
    formData.append('hdr_effect', '0');     // 0 - 1 (efek HDR)

    result.textContent = '⏳ Sedang memproses...';

    // 2. Panggil API ChatGPT VISION (endpoint /imgupscalerform)
    fetch('https://chatgpt-vision1.p.rapidapi.com/imgupscalerform', {
        method: 'POST',
        headers: {
            'x-rapidapi-host': 'chatgpt-vision1.p.rapidapi.com',
            'x-rapidapi-key': '28922b9718mshb1a8a4f271170b5p1c2c51jsn3f8f2299783a' // Ganti dengan API key lo
        },
        body: formData
    })
    .then(function(response) {
        if (!response.ok) throw new Error('Gagal upscale (HTTP ' + response.status + ')');
        return response.json();
    })
    .then(function(data) {
        console.log('Response API:', data); // buat debugging

        // 3. Cek respon dari API (struktur respon bisa beda)
        // Coba cek beberapa kemungkinan field hasil
        var imageUrl = data.output_url || data.image_url || data.result || data.url || data.data;

        if (imageUrl) {
            preview.innerHTML = '<img src="' + imageUrl + '" alt="Upscaled" style="max-width:100%; border-radius:16px; margin-top:12px;">';
            result.innerHTML = '✅ Gambar berhasil di-upscale! <br> <a href="' + imageUrl + '" target="_blank" style="color:var(--accent-light);">Download hasil</a>';
            showToast('✨ Gambar berhasil di-upscale!');
            incrementUsage();
        } else {
            // Tampilkan respon API biar keliatan error-nya
            result.textContent = '❌ Gagal upscale. Response: ' + JSON.stringify(data);
        }
    })
    .catch(function(err) {
        result.textContent = '❌ Error: ' + err.message;
        showToast('❌ Gagal upscale gambar');
    });
};
