// ==========================================
// UNIT CONVERTER (SUHU)
// ==========================================
window.convertUnit = function() {
    var val = parseFloat(document.getElementById('unitInput').value);
    var dir = document.getElementById('unitDirection').value;
    var result = document.getElementById('unitResult');
    if (isNaN(val)) {
        result.textContent = 'Masukkan angka dulu!';
        showToast('Masukkan angka!', 'error');
        return;
    }
    var output = '';
    switch(dir) {
        case 'CF': output = val + '°C = ' + (val * 9/5 + 32).toFixed(2) + '°F'; break;
        case 'FC': output = val + '°F = ' + ((val - 32) * 5/9).toFixed(2) + '°C'; break;
        case 'CK': output = val + '°C = ' + (val + 273.15).toFixed(2) + ' K'; break;
        case 'KC': output = val + 'K = ' + (val - 273.15).toFixed(2) + '°C'; break;
        default: output = 'Error';
    }
    result.textContent = output;
    showToast('Konversi selesai!', 'success');
    incrementUsage();
};

window.getTemplate_unit = function(tool) {
    return '<div class="tool-desc">' + tool.desc + '</div>' +
        '<label>Arah Konversi</label>' +
        '<select id="unitDirection">' +
        '<option value="CF">Celcius → Fahrenheit</option>' +
        '<option value="FC">Fahrenheit → Celcius</option>' +
        '<option value="CK">Celcius → Kelvin</option>' +
        '<option value="KC">Kelvin → Celcius</option>' +
        '</select>' +
        '<label>Masukkan Nilai</label>' +
        '<input type="number" id="unitInput" placeholder="0" step="any">' +
        '<button class="btn-primary" onclick="convertUnit()">Konversi</button>' +
        '<div class="result-box" id="unitResult">Hasil konversi</div>';
};
