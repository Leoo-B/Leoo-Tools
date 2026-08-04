(function() {
    // Tunggu 4.8 detik (sesuai animasi), lalu sembunyikan splash & tampilkan dashboard
    setTimeout(function() {
        var splash = document.getElementById('splash');
        var dashboard = document.getElementById('dashboard');
        if (splash) splash.classList.add('hide');
        if (dashboard) dashboard.classList.add('active');
    }, 4800);

    // Proteksi biar orang gabisa inspect element (kayak aslinya)
    document.addEventListener('contextmenu', function(e) { e.preventDefault(); });
    document.addEventListener('keydown', function(e) {
        var key = String(e.key || '').toLowerCase();
        var blocked = key === 'f12' || 
                      (e.ctrlKey && e.shiftKey && (key === 'i' || key === 'j' || key === 'c')) || 
                      (e.ctrlKey && key === 'u');
        if (blocked) {
            e.preventDefault();
            e.stopPropagation();
        }
    });
})();
