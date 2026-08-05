// ==========================================
// CUACA (wttr.in – GRATIS, TANPA API KEY)
// ==========================================
window.checkWeather = function() {
    var city = document.getElementById('weatherCity').value.trim();
    var result = document.getElementById('weatherResult');
    if (!city) { result.textContent = '⚠️ Masukkan nama kota dulu!'; return; }
    result.textContent = '⏳ Sedang mengambil data cuaca...';

    fetch('https://wttr.in/' + encodeURIComponent(city) + '?format=%C+%t+%w+%h&lang=id')
    .then(function(response) {
        if (!response.ok) throw new Error('Kota tidak ditemukan');
        return response.text();
    })
    .then(function(data) {
        var parts = data.split(' ');
        var condition = parts.slice(0, -3).join(' ');
        var temp = parts[parts.length - 3] || '--';
        var wind = parts[parts.length - 2] || '--';
        var humidity = parts[parts.length - 1] || '--';
        result.innerHTML = '🌤️ <b>' + city + '</b><br>Kondisi: ' + condition + '<br>Suhu: ' + temp + '<br>Angin: ' + wind + '<br>Kelembapan: ' + humidity;
        showToast('🌤️ Cuaca ' + city + ' berhasil diambil!');
        incrementUsage();
    })
    .catch(function(err) {
        result.textContent = '❌ Gagal mengambil data cuaca. Pastikan nama kota benar.';
        showToast('❌ Gagal cek cuaca');
    });
};
