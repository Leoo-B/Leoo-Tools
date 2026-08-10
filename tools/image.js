// ==========================================
// IMAGE ENHANCER (Proxy ImgBB → /api/imgbb → Vercel Proxy → ExsalAPI)
// Alur: Upload → /api/imgbb → /api/enhance → before-after slider
// API key ImgBB disimpan di server (api/imgbb.js), tidak di client
// ==========================================

// ── Before-After Slider ───────────────────────────────────────
function initSlider(beforeUrl, afterUrl) {
    var container = document.getElementById('imagePreview');
    container.innerHTML =
        '<div class="ba-wrap" id="baWrap">' +
            '<img src="' + beforeUrl + '" alt="Before">' +
            '<span class="ba-label ba-label-before">Before</span>' +
            '<div class="ba-after" id="baAfter">' +
                '<img src="' + afterUrl + '" alt="After" id="baAfterImg">' +
            '</div>' +
            '<span class="ba-label ba-label-after">After</span>' +
            '<div class="ba-divider" id="baDivider">' +
                '<div class="ba-handle">⇔</div>' +
            '</div>' +
        '</div>';

    var wrap     = document.getElementById('baWrap');
    var afterDiv = document.getElementById('baAfter');
    var divider  = document.getElementById('baDivider');
    var afterImg = document.getElementById('baAfterImg');

    function setFullW() {
        var w = wrap.offsetWidth;
        afterImg.style.width    = w + 'px';
        afterImg.style.maxWidth = w + 'px';
    }
    wrap.querySelector('img').addEventListener('load', setFullW);
    setFullW();

    function setPos(pct) {
        pct = Math.max(2, Math.min(98, pct));
        afterDiv.style.width = pct + '%';
        divider.style.left   = pct + '%';
    }
    function onMove(clientX) {
        var rect = wrap.getBoundingClientRect();
        setPos(((clientX - rect.left) / rect.width) * 100);
    }

    divider.addEventListener('mousedown', function (e) {
        e.preventDefault();
        function mm(e) { onMove(e.clientX); }
        function mu()  { document.removeEventListener('mousemove', mm); document.removeEventListener('mouseup', mu); }
        document.addEventListener('mousemove', mm);
        document.addEventListener('mouseup', mu);
    });
    divider.addEventListener('touchstart', function (e) {
        e.preventDefault();
        function tm(e) { onMove(e.touches[0].clientX); }
        function te()  { document.removeEventListener('touchmove', tm); document.removeEventListener('touchend', te); }
        document.addEventListener('touchmove', tm, { passive: false });
        document.addEventListener('touchend', te);
    }, { passive: false });
}

// ── Main Enhance ──────────────────────────────────────────────
window.enhanceImage = function () {
    var fileInput = document.getElementById('imageInput');
    var result    = document.getElementById('imageResult');
    var preview   = document.getElementById('imagePreview');

    preview.innerHTML = '';
    result.textContent = '';

    if (!fileInput.files || fileInput.files.length === 0) {
        result.textContent = 'Upload gambar dulu!';
        showToast('Upload gambar dulu!', 'error');
        return;
    }

    var file = fileInput.files[0];
    if (file.size > 10 * 1024 * 1024) {
        result.textContent = 'Ukuran gambar terlalu besar! Maksimal 10MB.';
        showToast('File terlalu besar! Maks 10MB', 'error');
        return;
    }

    var pg = createProgress('imageProgressWrap', 'Meningkatkan kualitas gambar');

    pg.crawl(5, 38, 4000, 'Step 1/2 · Mengupload ke server...');

    var formData = new FormData();
    formData.append('image', file);
    formData.append('expiration', '259200');

    var originalUrl = '';

    fetch('/api/imgbb', { method: 'POST', body: formData })
    .then(function (res) {
        if (!res.ok) throw new Error('Gagal upload ke server (HTTP ' + res.status + ')');
        return res.json();
    })
    .then(function (json) {
        if (!json.success || !json.data || !json.data.display_url) {
            throw new Error('Upload gagal: ' + (json.error && json.error.message ? json.error.message : 'Response tidak valid'));
        }
        originalUrl = json.data.display_url;

        pg.crawl(42, 88, 18000, 'Step 2/2 · AI sedang memproses gambar...');
        return fetch('/api/enhance?image_url=' + encodeURIComponent(originalUrl), { method: 'GET' });
    })
    .then(function (res) {
        if (!res.ok) throw new Error('Gagal menghubungi API enhance (HTTP ' + res.status + ')');
        return res.json();
    })
    .then(function (json) {
        if (!json.status || !json.data || !json.data.download_url) {
            throw new Error(json.message || 'Enhance gagal: response tidak valid');
        }

        var rawUrl   = json.data.download_url;
        var proxyUrl = '/api/enhance?dl=' + encodeURIComponent(rawUrl);

        pg.done('Gambar berhasil ditingkatkan!');

        initSlider(originalUrl, proxyUrl);

        result.innerHTML =
            '✅ <b>Gambar berhasil ditingkatkan!</b> Geser slider untuk bandingkan.<br><br>' +
            '<a href="' + proxyUrl + '" download="enhanced.jpg" ' +
            'style="color:var(--accent-glow); font-weight:500;">⬇ Download Hasil HD</a>';

        showToast('Gambar berhasil di-enhance!', 'success');
        incrementUsage();
    })
    .catch(function (err) {
        pg.error('Gagal: ' + err.message);
        result.textContent = '❌ Error: ' + err.message;
        showToast('Gagal enhance gambar', 'error');
    });
};

window.getTemplate_image = function(tool) {
    return '<div class="tool-desc">' + tool.desc + '</div>' +
        '<label>Upload Gambar</label>' +
        '<input type="file" id="imageInput" accept="image/*">' +
        '<button class="btn-primary" onclick="enhanceImage()">Enhance Gambar</button>' +
        '<div id="imageProgressWrap"></div>' +
        '<div class="result-box" id="imageResult">Upload gambar, lalu klik Enhance.</div>' +
        '<div id="imagePreview" style="margin-top:12px;"></div>';
};
