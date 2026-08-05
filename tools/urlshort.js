// ==========================================
// URL SHORTENER (TinyURL – GRATIS, NO API KEY)
// ==========================================
window.shortenUrl = function() {
    var url = document.getElementById('urlInput').value.trim();
    var result = document.getElementById('urlResult');
    if (!url) { result.textContent = '⚠️ Masukkan link dulu!'; return; }
    result.textContent = '⏳ Sedang memendekkan...';

    // TinyURL API – gratis, no key, stabil
    fetch('https://tinyurl.com/api-create.php?url=' + encodeURIComponent(url))
    .then(function(response) {
        if (!response.ok) throw new Error('Gagal memendekkan');
        return response.text();
    })
    .then(function(data) {
        if (data && data.startsWith('https://tinyurl.com/')) {
            result.innerHTML = '✅ Link pendek: <a href="' + data + '" target="_blank" style="color:var(--accent-light);">' + data + '</a>';
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
