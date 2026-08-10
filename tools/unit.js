// ==========================================
// UNIT CONVERTER — 7 Kategori
// Suhu, Panjang, Berat, Kecepatan, Luas, Volume, Data
// ==========================================

var UNIT_CATEGORIES = {
    suhu: {
        label: 'Suhu',
        units: ['°C', '°F', 'K'],
        convert: function (val, from, to) {
            // Normalisasi ke Celsius dulu
            var c;
            if      (from === '°C') c = val;
            else if (from === '°F') c = (val - 32) * 5 / 9;
            else if (from === 'K')  c = val - 273.15;

            if      (to === '°C') return c;
            else if (to === '°F') return c * 9 / 5 + 32;
            else if (to === 'K')  return c + 273.15;
        }
    },
    panjang: {
        label: 'Panjang',
        units: ['km', 'm', 'cm', 'mm', 'mil', 'yard', 'kaki', 'inci'],
        // Basis: meter
        toBase: { 'km': 1000, 'm': 1, 'cm': 0.01, 'mm': 0.001, 'mil': 1609.344, 'yard': 0.9144, 'kaki': 0.3048, 'inci': 0.0254 },
        convert: function (val, from, to) {
            return val * this.toBase[from] / this.toBase[to];
        }
    },
    berat: {
        label: 'Berat',
        units: ['ton', 'kg', 'g', 'mg', 'lb', 'oz'],
        // Basis: gram
        toBase: { 'ton': 1e6, 'kg': 1000, 'g': 1, 'mg': 0.001, 'lb': 453.59237, 'oz': 28.349523 },
        convert: function (val, from, to) {
            return val * this.toBase[from] / this.toBase[to];
        }
    },
    kecepatan: {
        label: 'Kecepatan',
        units: ['km/h', 'm/s', 'mph', 'knot'],
        // Basis: m/s
        toBase: { 'km/h': 1/3.6, 'm/s': 1, 'mph': 0.44704, 'knot': 0.514444 },
        convert: function (val, from, to) {
            return val * this.toBase[from] / this.toBase[to];
        }
    },
    luas: {
        label: 'Luas',
        units: ['km²', 'm²', 'cm²', 'hektar', 'acre'],
        // Basis: m²
        toBase: { 'km²': 1e6, 'm²': 1, 'cm²': 0.0001, 'hektar': 10000, 'acre': 4046.856 },
        convert: function (val, from, to) {
            return val * this.toBase[from] / this.toBase[to];
        }
    },
    volume: {
        label: 'Volume',
        units: ['m³', 'liter', 'ml', 'galon', 'fl oz'],
        // Basis: liter
        toBase: { 'm³': 1000, 'liter': 1, 'ml': 0.001, 'galon': 3.785411784, 'fl oz': 0.0295735 },
        convert: function (val, from, to) {
            return val * this.toBase[from] / this.toBase[to];
        }
    },
    data: {
        label: 'Data',
        units: ['TB', 'GB', 'MB', 'KB', 'byte', 'bit'],
        // Basis: byte
        toBase: { 'TB': 1099511627776, 'GB': 1073741824, 'MB': 1048576, 'KB': 1024, 'byte': 1, 'bit': 0.125 },
        convert: function (val, from, to) {
            return val * this.toBase[from] / this.toBase[to];
        }
    }
};

function updateUnitDropdowns(catKey) {
    var cat     = UNIT_CATEGORIES[catKey];
    var fromSel = document.getElementById('unitFrom');
    var toSel   = document.getElementById('unitTo');
    if (!fromSel || !toSel || !cat) return;

    var fromOpts = cat.units.map(function (u, i) {
        return '<option value="' + u + '"' + (i === 0 ? ' selected' : '') + '>' + u + '</option>';
    }).join('');
    var toOpts = cat.units.map(function (u, i) {
        return '<option value="' + u + '"' + (i === 1 ? ' selected' : '') + '>' + u + '</option>';
    }).join('');

    fromSel.innerHTML = fromOpts;
    toSel.innerHTML   = toOpts;

    // Reset result
    var result = document.getElementById('unitResult');
    if (result) result.textContent = 'Hasil konversi';
}

window.onUnitCategoryChange = function () {
    var catKey = document.getElementById('unitCategory').value;
    updateUnitDropdowns(catKey);
};

window.convertUnit = function () {
    var val    = parseFloat(document.getElementById('unitInput').value);
    var catKey = document.getElementById('unitCategory').value;
    var from   = document.getElementById('unitFrom').value;
    var to     = document.getElementById('unitTo').value;
    var result = document.getElementById('unitResult');

    if (isNaN(val)) {
        result.textContent = 'Masukkan angka dulu!';
        showToast('Masukkan angka!', 'error');
        return;
    }

    var cat = UNIT_CATEGORIES[catKey];
    if (!cat) return;

    if (from === to) {
        result.textContent = val + ' ' + from + ' = ' + val + ' ' + to;
        showToast('Konversi selesai!', 'success');
        return;
    }

    var converted = cat.convert(val, from, to);

    // Format angka: hindari floating point noise
    var formatted;
    if (Math.abs(converted) >= 1e9 || (Math.abs(converted) < 1e-4 && converted !== 0)) {
        formatted = converted.toExponential(4);
    } else {
        // Maksimal 8 desimal, hilangkan trailing zero
        formatted = parseFloat(converted.toFixed(8)).toString();
    }

    result.textContent = val + ' ' + from + ' = ' + formatted + ' ' + to;
    showToast('Konversi selesai!', 'success');
    incrementUsage();
};

window.getTemplate_unit = function (tool) {
    var catOptions = Object.keys(UNIT_CATEGORIES).map(function (key) {
        return '<option value="' + key + '">' + UNIT_CATEGORIES[key].label + '</option>';
    }).join('');

    var defaultUnits = UNIT_CATEGORIES['suhu'].units;
    var fromOpts = defaultUnits.map(function (u, i) {
        return '<option value="' + u + '"' + (i === 0 ? ' selected' : '') + '>' + u + '</option>';
    }).join('');
    var toOpts = defaultUnits.map(function (u, i) {
        return '<option value="' + u + '"' + (i === 1 ? ' selected' : '') + '>' + u + '</option>';
    }).join('');

    return '<div class="tool-desc">' + tool.desc + '</div>' +
        '<label>Kategori</label>' +
        '<select id="unitCategory" onchange="onUnitCategoryChange()">' + catOptions + '</select>' +
        '<div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:0;">' +
            '<div><label style="margin-top:18px;">Dari</label>' +
            '<select id="unitFrom">' + fromOpts + '</select></div>' +
            '<div><label style="margin-top:18px;">Ke</label>' +
            '<select id="unitTo">' + toOpts + '</select></div>' +
        '</div>' +
        '<label>Nilai</label>' +
        '<input type="number" id="unitInput" placeholder="0" step="any">' +
        '<button class="btn-primary" onclick="convertUnit()">Konversi</button>' +
        '<div class="result-box" id="unitResult">Hasil konversi</div>';
};
