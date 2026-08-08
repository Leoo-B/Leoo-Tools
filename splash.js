(function () {
    // ── Animate splash status text ──────────────────────────────
    var statusEl = document.getElementById('nexusShellStatus');
    var steps = [
        { text: 'menginisialisasi sistem', delay: 0 },
        { text: 'memuat tools & modul',    delay: 700 },
        { text: 'menyiapkan antarmuka',    delay: 1400 },
        { text: 'siap digunakan',          delay: 2000 },
    ];

    steps.forEach(function (s) {
        setTimeout(function () {
            if (statusEl) statusEl.textContent = s.text;
        }, s.delay);
    });

    // ── Hide splash after 3s ────────────────────────────────────
    setTimeout(function () {
        var splash    = document.getElementById('splash');
        var dashboard = document.getElementById('dashboard');

        if (splash) {
            splash.classList.add('hide');

            // Hentikan semua animasi setelah transisi hide selesai (600ms)
            setTimeout(function () {
                // Matikan semua elemen animasi di dalam splash
                var animated = splash.querySelectorAll('.splash-mesh, .splash-title, .splash-sub, .nx-bar-wrap, .nx-bar-fill, .nx-bar-track, .nx-status');
                animated.forEach(function (el) {
                    el.style.animationPlayState = 'paused';
                });
                // Juga hentikan pseudo-element ::after (orbit ring) via class
                splash.classList.add('anim-stopped');
                // Sembunyikan sepenuhnya agar tidak memakan resource rendering
                splash.style.display = 'none';
            }, 650);
        }

        if (dashboard) dashboard.classList.add('active');
    }, 3000);
})();
