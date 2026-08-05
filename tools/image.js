// ==========================================
// IMAGE ENHANCER (DeepAI – API KEY UDAH MASUK)
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
    var formData = new FormData();
    formData.append('image', file);

    result.textContent = '⏳ Sedang memproses...';

    fetch('https://api.deepai.org/api/torch-srgan', {
        method: 'POST',
        headers: {
            'api-key': '8fc9580f-26d2-42b3-9b6a-bb6af33e4799'
        },
        body: formData
    })
    .then(function(response) {
        if (!response.ok) throw new Error('Gagal enhance gambar');
        return response.json();
    })
    .then(function(data) {
        if (data.output_url) {
            preview.innerHTML = '<img src="' + data.output_url + '" alt="Enhanced" style="max-width:100%; border-radius:16px; margin-top:12px;">';
            result.innerHTML = '✅ Gambar berhasil di-HD-kan! <br> <a href="' + data.output_url + '" target="_blank" style="color:var(--accent-light);">Download hasil</a>';
            showToast('✨ Gambar berhasil di-HD-kan!');
            incrementUsage();
        } else {
            result.textContent = '❌ Gagal enhance gambar.';
        }
    })
    .catch(function(err) {
        result.textContent = '❌ Error: ' + err.message + '. Pastikan API key benar.';
        showToast('❌ Gagal enhance gambar');
    });
};
