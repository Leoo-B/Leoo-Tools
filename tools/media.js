// ==========================================
// MEDIA DOWNLOADER (Cobalt API – GRATIS, NO KEY, SUPPORT 20+ PLATFORM)
// ==========================================
window.downloadMedia = function() {
    var platform = document.getElementById('mediaPlatform').value;
    var link = document.getElementById('mediaLink').value.trim();
    var result = document.getElementById('mediaResult');
    if (!link) { result.textContent = '⚠️ Masukkan link dulu bro!'; return; }
    result.textContent = '⏳ Sedang memproses...';

    // Cobalt API – gratis, no key, support TikTok, YT, IG, FB, dll
    var apiUrl = 'https://api.cobalt.tools/api/json';
    
    fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            url: link,
            videoQuality: '720',
            audioFormat: 'mp3'
        })
    })
    .then(function(response) {
        if (!response.ok) throw new Error('Gagal fetch Cobalt API');
        return response.json();
    })
    .then(function(data) {
        if (data.status === 'error') {
            result.textContent = '❌ ' + (data.text || 'Gagal download media');
            return;
        }
        if (data.url) {
            result.innerHTML = '✅ Link download: <a href="' + data.url + '" target="_blank" style="color:var(--accent-light);">' + data.url + '</a>';
            showToast('📥 Link download siap!');
            incrementUsage();
        } else {
            result.textContent = '❌ Gagal mendapatkan link download.';
        }
    })
    .catch(function(err) {
        result.textContent = '❌ Error: ' + err.message + '. Coba lagi atau platform lain.';
        showToast('❌ Gagal download media');
    });
};
