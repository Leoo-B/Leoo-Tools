(function () {
    var perf = document.documentElement.getAttribute('data-performance') || 'high';
    var prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) perf = 'entry';

    // ── Animate splash status text ──────────────────────────────
    var statusEl = document.getElementById('nexusShellStatus');

    var defaultSteps = [
        { text: 'menginisialisasi sistem', delay: 0 },
        { text: 'memuat tools & modul',    delay: 700 },
        { text: 'menyiapkan antarmuka',    delay: 1400 },
        { text: 'siap digunakan',          delay: 2000 },
    ];

    var steps, hideDelay;
    if (perf === 'entry') {
        // Minimal feedback and short splash on low devices
        steps = [ { text: 'menginisialisasi sistem', delay: 0 } ];
        hideDelay = 600;
    } else if (perf === 'mid') {
        // Keep most animations but shorten the overall splash time
        steps = defaultSteps;
        hideDelay = 2000;
    } else {
        // High fidelity
        steps = defaultSteps;
        hideDelay = 3000;
    }

    steps.forEach(function (s) {
        setTimeout(function () {
            if (statusEl) statusEl.textContent = s.text;
        }, s.delay);
    });

    // ── Hide splash after configured delay ───────────────────────
    setTimeout(function () {
        var splash    = document.getElementById('splash');
        var dashboard = document.getElementById('dashboard');

        if (splash) {
            splash.classList.add('hide');

            // Hentikan semua animasi setelah transisi hide selesai (slightly longer than CSS transition)
            setTimeout(function () {
                try {
                    // Matikan semua elemen animasi di dalam splash
                    var animated = splash.querySelectorAll('.splash-mesh, .splash-title, .splash-sub, .nx-bar-wrap, .nx-bar-fill, .nx-bar-track, .nx-status');
                    animated.forEach(function (el) {
                        try { el.style.animationPlayState = 'paused'; } catch (e) { /* ignore */ }
                    });
                    // Juga hentikan pseudo-element ::after (orbit ring) via class
                    splash.classList.add('anim-stopped');
                    // Sembunyikan sepenuhnya agar tidak memakan resource rendering
                    splash.style.display = 'none';
                } catch (e) {
                    // defensive: don't break the page
                    console.warn('splash cleanup error', e);
                }
            }, 650);
        }

        if (dashboard) dashboard.classList.add('active');
    }, hideDelay);
})();
