// ==========================================
// IMAGE ENHANCER (ImgBB + Vercel Proxy → ExsalAPI)
// Alur: Upload → ImgBB (display_url) → /api/enhance → before-after slider
// ==========================================

var IMGBB_KEY = 'cf58549c110b49f424dd4076a144b452';

// ── Before-After Slider ───────────────────────────────────────
function initSlider(beforeUrl, afterUrl) {
    var container = document.getElementById('imagePreview');
    container.innerHTML =
        '<style>' +
        '.ba-wrap{position:relative;width:100%;max-width:100%;user-select:none;border-radius:var(--radius-md);overflow:hidden;box-shadow:var(--shadow-l4);margin-top:14px;}' +
        '.ba-wrap img{display:block;width:100%;height:auto;}' +
        '.ba-after{position:absolute;top:0;left:0;width:50%;height:100%;overflow:hidden;}' +
        '.ba-after img{width:var(--full-w);max-width:var(--full-w);}' +
        '.ba-divider{position:absolute;top:0;left:50%;transform:translateX(-50%);width:3px;height:100%;background:#fff;cursor:ew-resize;z-index:3;box-shadow:0 0 6px rgba(0,0,0,0.4);}' +
        '.ba-handle{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:38px;height:38px;border-radius:50%;background:#fff;box-shadow:0 2px 8px rgba(0,0,0,0.35);display:flex;align-items:center;justify-content:center;font-size:14px;color:#333;cursor:ew-resize;}' +
        '.ba-label{position:absolute;bottom:10px;padding:3px 10px;border-radius:999px;font-size:0.7rem;font-weight:600;letter-spacing:.5px;text-transform:uppercase;pointer-events:none;}' +
        '.ba-label-before{left:10px;background:rgba(0,0,0,0.5);color:#fff;}' +
        '.ba-label-after{right:10px;background:rgba(0,112,243,0.85);color:#fff;}' +
        '</style>' +

        '<div class="ba-wrap" id="baWrap">' +
            // Before (bawah)
            '<img src="' + beforeUrl + '" alt="Before">' +
            // Label before
            '<span class="ba-label ba-label-before">Before</span>' +
            // After (atas, di-clip)
            '<div class="ba-after" id="baAfter">' +
                '<img src="' + afterUrl + '" alt="After" id="baAfterImg">' +
            '</div>' +
            // Label after
            '<span class="ba-label ba-label-after">After</span>' +
            // Divider + handle
            '<div class="ba-divider" id="baDivider">' +
                '<div class="ba-handle">⇔</div>' +
            '</div>' +
        '</div>';

    // Set --full-w setelah gambar load
    var wrap     = document.getElementById('baWrap');
    var afterDiv = document.getElementById('baAfter');
    var divider  = document.getElementById('baDivider');
    var afterImg = document.getElementById('baAfterImg');

    function setFullW() {
        var w = wrap.offsetWidth;
        afterImg.style.setProperty('--full-w', w + 'px');
        afterImg.style.width = w + 'px';
        afterImg.style.maxWidth = w + 'px';
    }
    wrap.querySelector('img').addEventListener('load', setFullW);
    setFullW();

    function setPos(pct) {
        pct = Math.max(2, Math.min(98, pct));
        afterDiv.style.width  = pct + '%';
        divider.style.left    = pct + '%';
    }

    function onMove(clientX) {
        var rect = wrap.getBoundingClientRect();
        var pct  = ((clientX - rect.left) / rect.width) * 100;
        setPos(pct);
    }

    // Mouse
    divider.addEventListener('mousedown', function(e) {
        e.preventDefault();
        function onMouseMove(e) { onMove(e.clientX); }
        function onMouseUp()   { document.removeEventListener('mousemove', onMouseMove); document.removeEventListener('mouseup', onMouseUp); }
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    // Touch
    divider.addEventListener('touchstart', function(e) {
        e.preventDefault();
        function onTouchMove(e) { onMove(e.touches[0].clientX); }
        function onTouchEnd()   { document.removeEventListener('touchmove', onTouchMove); document.removeEventListener('touchend', onTouchEnd); }
        document.addEventListener('touchmove', onTouchMove, { passive: false });
        document.addEventListener('touchend', onTouchEnd);
    }, { passive: false });
}

// ── Main Enhance Function ─────────────────────────────────────
window.enhanceImage = function() {
    var fileInput = document.getElementById('imageInput');
    var result    = document.getElementById('imageResult');
    var preview   = document.getElementById('imagePreview');

    preview.innerHTML = '';

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

    // ── STEP 1: Upload ke ImgBB ──────────────────────────────
    result.innerHTML =
        '⏳ <b>Step 1/2:</b> Mengupload gambar ke server...' +
        '<br><small style="color:var(--mute);">Mohon tunggu sebentar.</small>';

    var formData = new FormData();
    formData.append('image', file);
    formData.append('expiration', '259200'); // otomatis hapus setelah 3 hari

    var originalUrl = ''; // simpan untuk slider before

    fetch('https://api.imgbb.com/1/upload?key=' + IMGBB_KEY, {
        method: 'POST',
        body: formData
    })
    .then(function(res) {
        if (!res.ok) throw new Error('Gagal upload ke server (HTTP ' + res.status + ')');
        return res.json();
    })
    .then(function(json) {
        if (!json.success || !json.data || !json.data.display_url) {
            throw new Error('Upload gagal: ' + (json.error && json.error.message ? json.error.message : 'Response tidak valid'));
        }

        originalUrl = json.data.display_url; // simpan untuk before slider

        // ── STEP 2: Enhance via Vercel proxy ─────────────────
        result.innerHTML =
            '⏳ <b>Step 2/2:</b> AI sedang meningkatkan kualitas gambar...' +
            '<br><small style="color:var(--mute);">Proses AI bisa makan waktu 10–30 detik.</small>';

        return fetch('/api/enhance?image_url=' + encodeURIComponent(originalUrl), { method: 'GET' });
    })
    .then(function(res) {
        if (!res.ok) throw new Error('Gagal menghubungi API enhance (HTTP ' + res.status + ')');
        return res.json();
    })
    .then(function(json) {
        if (!json.status || !json.data || !json.data.download_url) {
            throw new Error(json.message || 'Enhance gagal: response tidak valid');
        }

        var rawUrl   = json.data.download_url;
        var proxyUrl = '/api/enhance?dl=' + encodeURIComponent(rawUrl);

        // Tampilkan before-after slider
        initSlider(originalUrl, proxyUrl);

        result.innerHTML =
            '✅ <b>Gambar berhasil ditingkatkan!</b> Geser untuk bandingkan.<br><br>' +
            '<a href="' + proxyUrl + '" download="enhanced.jpg" ' +
            'style="color:var(--accent-light); font-weight:500;">⬇ Download Hasil HD</a>';

        showToast('Gambar berhasil di-enhance!', 'success');
        incrementUsage();
    })
    .catch(function(err) {
        result.textContent = '❌ Error: ' + err.message;
        showToast('Gagal enhance gambar', 'error');
    });
};
