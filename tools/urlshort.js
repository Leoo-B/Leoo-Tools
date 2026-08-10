// ==========================================
// URL SHORTENER (TinyURL – GRATIS, NO API KEY)
// ==========================================
window.shortenUrl = function () {
    var url    = document.getElementById('urlInput').value.trim();
    var result = document.getElementById('urlResult');
    if (!url) {
        result.textContent = 'Masukkan link dulu!';
        showToast('Masukkan link dulu!', 'error');
        return;
    }

    result.textContent = '';
    var pg = createProgress('urlProgressWrap', 'Memendekkan URL');
    pg.crawl(8, 75, 3500, 'Menghubungi TinyURL...');

    fetch('https://tinyurl.com/api-create.php?url=' + encodeURIComponent(url))
    .then(function (response) {
        if (!response.ok) throw new Error('Gagal memendekkan');
        return response.text();
    })
    .then(function (data) {
        pg.set(95, 'Hampir selesai...');
        if (data && data.startsWith('https://tinyurl.com/')) {
            pg.done('Berhasil!');
            result.innerHTML = 'Link pendek: <a href="' + data + '" target="_blank" style="color:var(--accent-glow); font-weight:500;">' + data + '</a>';
            showToast('Link berhasil dipendekkan!', 'success');
            incrementUsage();
        } else {
            throw new Error('Response tidak valid');
        }
    })
    .catch(function (err) {
        pg.error('Gagal: ' + err.message);
        result.textContent = 'Error: ' + err.message;
        showToast('Gagal pendekin link', 'error');
    });
};

window.getTemplate_urlshort = function(tool) {
    return '<div class="tool-desc">' + tool.desc + '</div>' +
        '<label>Link Panjang</label>' +
        inputWithClear('urlInput', 'text', 'https://...', 'onkeydown="if(event.key===\'Enter\') shortenUrl()"') +
        '<button class="btn-primary" onclick="shortenUrl()">Persingkat</button>' +
        '<div id="urlProgressWrap"></div>' +
        resultBoxWithCopy('urlResult', 'Hasil link pendek akan muncul di sini');
};
