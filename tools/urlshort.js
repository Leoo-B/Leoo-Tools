// ==========================================
// URL SHORTENER (is.gd – GRATIS, TANPA API KEY)
// ==========================================
window.shortenUrl = function() {
    var url = document.getElementById('urlInput').value.trim();
    var result = document.getElementById('urlResult');
    if (!url) { result.textContent = '⚠️ Masukkan link dulu!'; return; }
    result.textContent = '⏳ Sedang memendekkan...';

    fetch('https://is.gd/create.php?format=json&url=' + encodeURIComponent(url))
    .then(function(response) {
        if (!response.ok) throw new Error('Gagal memendekkan');
        return response.json();
    })
    .then(function(data) {
        if (data.shorturl) {
            result.innerHTML = '✅ Link pendek: <a href="' + data.shorturl + '" target="_blank" style="color:var(--accent-light);">' + data.shorturl + '</a>';
            showToast('✂️ Link berhasil dipendekkan!');
            incrementUsage();
        } else {
            result.textContent = '❌ Gagal memendekkan link.';
        }
    })
    .catch(function(err) {
        result.textContent = '❌ Error: ' + err.message;
        showToast('❌ Gagal pendekin link');
    });
};
