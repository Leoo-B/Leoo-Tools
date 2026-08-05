// ==========================================
// LOADER – Memuat semua file tools secara berurutan
// ==========================================
(function() {
    var files = [
        'tools/core.js',
        'tools/password.js',
        'tools/json.js',
        'tools/unit.js',
        'tools/base64.js',
        'tools/counter.js',
        'tools/color.js',
        'tools/weather.js',
        'tools/urlshort.js',
        'tools/image.js',
        'tools/mediadownload.js',
        'tools/news.js'
    ];

    var index = 0;

    function loadNext() {
        if (index >= files.length) {
            if (typeof initAll === 'function') {
                initAll();
            }
            return;
        }

        var script = document.createElement('script');
        script.src = files[index];
        script.onload = function() {
            index++;
            loadNext();
        };
        script.onerror = function() {
            console.error('❌ Gagal memuat:', files[index]);
            index++;
            loadNext();
        };
        document.body.appendChild(script);
    }

    loadNext();
})();
