// ==========================================
// CUACA (wttr.in – GRATIS, TANPA API KEY)
// ==========================================
window.checkWeather = function() {
    var city = document.getElementById('weatherCity').value.trim();
    var result = document.getElementById('weatherResult');
    if (!city) {
        result.textContent = 'Masukkan nama kota dulu!';
        showToast('Masukkan nama kota!', 'error');
        return;
    }
    result.textContent = 'Sedang mengambil data cuaca...';

    fetch('https://wttr.in/' + encodeURIComponent(city) + '?format=j1')
    .then(function(response) {
        if (!response.ok) throw new Error('Kota tidak ditemukan');
        return response.json();
    })
    .then(function(data) {
        var current = data.current_condition[0];
        var desc = current.weatherDesc[0].value;
        var temp = current.temp_C + '°C';
        var feelsLike = current.FeelsLikeC + '°C';
        var wind = current.windspeedKmph + ' km/h';
        var humidity = current.humidity + '%';
        result.innerHTML =
            '🌤️ <b>' + city + '</b><br>' +
            'Kondisi: ' + desc + '<br>' +
            'Suhu: ' + temp + ' (terasa ' + feelsLike + ')<br>' +
            'Angin: ' + wind + '<br>' +
            'Kelembapan: ' + humidity;
        showToast('Cuaca ' + city + ' berhasil diambil!', 'success');
        incrementUsage();
    })
    .catch(function() {
        result.textContent = 'Gagal mengambil data cuaca. Pastikan nama kota benar.';
        showToast('Gagal cek cuaca', 'error');
    });
};
