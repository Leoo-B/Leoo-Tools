(function() {
    // Splash minimal, gak ada animasi ring/orb lagi jadi durasinya dipercepat.
    setTimeout(function() {
        var splash = document.getElementById('splash');
        var dashboard = document.getElementById('dashboard');
        if (splash) splash.classList.add('hide');
        if (dashboard) dashboard.classList.add('active');
    }, 1500);

    // Proteksi inspect
    document.addEventListener('contextmenu', function(e) { e.preventDefault(); });
    document.addEventListener('keydown', function(e) {
        var key = String(e.key || '').toLowerCase();
        var blocked = key === 'f12' || (e.ctrlKey && e.shiftKey && (key === 'i' || key === 'j' || key === 'c')) || (e.ctrlKey && key === 'u');
        if (blocked) {
            e.preventDefault();
            e.stopPropagation();
        }
    });
})();
