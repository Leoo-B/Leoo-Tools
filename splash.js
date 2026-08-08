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
        if (splash)    splash.classList.add('hide');
        if (dashboard) dashboard.classList.add('active');
    }, 3000);
})();
