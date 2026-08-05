// ==========================================
// MEDIA DOWNLOADER (GRATIS, TANPA API KEY)
// ==========================================
window.downloadMedia = function() {
    var platform = document.getElementById('mediaPlatform').value;
    var link = document.getElementById('mediaLink').value.trim();
    var result = document.getElementById('mediaResult');
    if (!link) { result.textContent = '⚠️ Masukkan link dulu bro!'; return; }
    result.textContent = '⏳ Sedang memproses...';

    var apiUrl = 'https://allmediadownloader.p.rapidapi.com/download?url=' + encodeURIComponent(link) + '&platform=' + platform;

    fetch(apiUrl, {
        headers: {
            'x-rapidapi-host': 'allmediadownloader.p.rapidapi.com',
            'x-rapidapi-key': ''
        }
    })
    .then(function(response) {
        if (!response.ok) throw new Error('Gagal fetch API');
        return response.json();
    })
    .then(function(data) {
        if (data.error) { result.textContent = '❌ ' + data.error; return; }
        if (data.download_link) {
            result.innerHTML = '✅ Link download: <a href="' + data.download_link + '" target="_blank" style="color:var(--accent-light);">' + data.download_link + '</a>';
            showToast('📥 Link download siap!');
            incrementUsage();
        } else {
            result.textContent = '❌ Gagal mendapatkan link download.';
        }
    })
    .catch(function(err) {
        result.textContent = '❌ Error: ' + err.message + '. Coba lagi atau gunakan platform lain.';
        showToast('❌ Gagal download media');
    });
};
