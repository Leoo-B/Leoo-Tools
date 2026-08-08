// ==========================================
// CUACA — api.synoxcloud.xyz
// ==========================================
window.checkWeather = function () {
    var city   = document.getElementById('weatherCity').value.trim();
    var result = document.getElementById('weatherResult');
    if (!city) {
        result.textContent = 'Masukkan nama kota dulu!';
        showToast('Masukkan nama kota!', 'error');
        return;
    }

    result.textContent = '';
    var pg = createProgress('weatherProgressWrap', 'Mengambil data cuaca');
    pg.crawl(8, 80, 4000, 'Menghubungi server...');

    fetch('https://api.synoxcloud.xyz/tools/cuaca?city=' + encodeURIComponent(city))
    .then(function (res) {
        if (!res.ok) throw new Error('Kota tidak ditemukan');
        return res.json();
    })
    .then(function (data) {
        if (!data.status || !data.result) throw new Error('Kota tidak ditemukan');
        pg.set(92, 'Memproses data cuaca...');

        var loc  = data.result.location || {};
        var cur  = data.result.current  || {};
        var day  = data.result.today    || {};

        // ── UV index label ──────────────────────────────────────
        var uvVal   = parseInt(cur.uv_index) || 0;
        var uvLabel = uvVal <= 2  ? 'Rendah' :
                      uvVal <= 5  ? 'Sedang' :
                      uvVal <= 7  ? 'Tinggi' :
                      uvVal <= 10 ? 'Sangat Tinggi' : 'Ekstrem';
        var uvColor = uvVal <= 2  ? '#4ade80' :
                      uvVal <= 5  ? '#facc15' :
                      uvVal <= 7  ? '#fb923c' :
                      uvVal <= 10 ? '#f87171' : '#c084fc';

        // ── Wind direction arrow ────────────────────────────────
        var dirArrow = {
            N:'↑', NNE:'↑↗', NE:'↗', ENE:'↗', E:'→', ESE:'↘', SE:'↘',
            SSE:'↓↘', S:'↓', SSW:'↓↙', SW:'↙', WSW:'↙', W:'←',
            WNW:'↖', NW:'↖', NNW:'↑↖'
        };
        var windArrow = dirArrow[cur.wind_dir] || cur.wind_dir || '';

        // ── Rain label ──────────────────────────────────────────
        var rainMm  = parseFloat(day.rain_mm) || 0;
        var rainLabel = rainMm === 0    ? 'Tidak ada' :
                        rainMm < 1     ? 'Gerimis ringan' :
                        rainMm < 5     ? 'Hujan ringan' :
                        rainMm < 20    ? 'Hujan sedang' : 'Hujan lebat';

        pg.done('Data diterima!');

        result.innerHTML =
            // ── Header lokasi ───────────────────────────────────
            '<div class="wx-header">' +
                '<div class="wx-location">' +
                    '<span class="wx-city">' + (loc.city || city) + '</span>' +
                    '<span class="wx-region">' + [loc.region, loc.country].filter(Boolean).join(', ') + '</span>' +
                '</div>' +
                '<div class="wx-condition-badge">' + cur.condition + '</div>' +
            '</div>' +

            // ── Suhu utama ──────────────────────────────────────
            '<div class="wx-temp-wrap">' +
                '<div class="wx-temp-main">' + cur.temp_c + '°C</div>' +
                '<div class="wx-temp-sub">' +
                    '<span>' + cur.temp_f + '°F</span>' +
                    '<span class="wx-feels">Terasa ' + cur.feels_like_c + '°C</span>' +
                '</div>' +
                '<div class="wx-minmax">↑ ' + day.max_c + '° &nbsp; ↓ ' + day.min_c + '°</div>' +
            '</div>' +

            // ── Grid detail ─────────────────────────────────────
            '<div class="wx-grid">' +
                wxCard('💧', 'Kelembapan',   cur.humidity) +
                wxCard('💨', 'Angin',        windArrow + ' ' + cur.wind_dir + ' ' + cur.wind_kph + ' km/h') +
                wxCard('👁️', 'Jarak Pandang', cur.visibility_km + ' km') +
                wxCard('🌡️', 'Tekanan',      cur.pressure_mb + ' mb') +
                wxCard('🌧️', 'Hujan Hari Ini', rainLabel + ' (' + rainMm + ' mm)') +
                wxCard('☀️', 'UV Index',
                    '<span style="color:' + uvColor + ';font-weight:600;">' + cur.uv_index + ' — ' + uvLabel + '</span>') +
                wxCard('🌅', 'Matahari Terbit', day.sunrise) +
                wxCard('🌇', 'Matahari Terbenam', day.sunset) +
            '</div>';

        showToast('Cuaca ' + (loc.city || city) + ' berhasil diambil!', 'success');
        incrementUsage();
    })
    .catch(function (err) {
        pg.error('Gagal mengambil data cuaca.');
        result.textContent = 'Gagal mengambil data cuaca: ' + err.message;
        showToast('Gagal cek cuaca', 'error');
    });
};

function wxCard(icon, label, value) {
    return '<div class="wx-card">' +
        '<span class="wx-card-icon">' + icon + '</span>' +
        '<span class="wx-card-label">' + label + '</span>' +
        '<span class="wx-card-value">' + (value || '—') + '</span>' +
        '</div>';
}
