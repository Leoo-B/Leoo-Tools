(function() {
    var script = document.createElement('script');
    script.src = 'tools/core.js';
    script.onload = function() {
        if (typeof initAll === 'function') initAll();
    };
    script.onerror = function() {
        console.error('❌ Gagal memuat core.js');
    };
    document.body.appendChild(script);
})();
