// ==========================================
// COLOR PICKER PRO
// ==========================================
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? { r: parseInt(result[1],16), g: parseInt(result[2],16), b: parseInt(result[3],16) } : { r:0,g:0,b:0 };
}

window.updateColorPreview = function(val) {
    var preview = document.getElementById('colorPreview');
    var res = document.getElementById('colorResult');
    if (preview) preview.style.background = val;
    var rgb = hexToRgb(val);
    if (res) res.textContent = 'HEX: ' + val + ' | RGB: rgb(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ')';
};

window.copyColor = function(type) {
    var picker = document.getElementById('colorPicker');
    var val = picker.value;
    var rgb = hexToRgb(val);
    var text = type === 'hex' ? val : 'rgb(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ')';
    navigator.clipboard.writeText(text).then(function() {
        showToast('"' + text + '" berhasil di-copy!', 'success');
        var res = document.getElementById('colorResult');
        res.textContent = '"' + text + '" berhasil di-copy!';
        setTimeout(function() { res.innerHTML = 'HEX: ' + val + ' | RGB: rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')'; }, 2000);
        incrementUsage();
    }).catch(function() {
        showToast('Gagal copy, silakan salin manual', 'error');
    });
};

window.getTemplate_color = function(tool) {
    return '<div class="tool-desc">' + tool.desc + '</div>' +
        '<label>Pilih Warna</label>' +
        '<input type="color" id="colorPicker" value="#3b82f6" ' +
        'style="height:56px; padding:4px; cursor:pointer; border-radius:var(--radius-sm); width:100%;" ' +
        'oninput="updateColorPreview(this.value)">' +
        '<div class="color-preview" id="colorPreview" style="background:#3b82f6;"></div>' +
        '<div class="btn-group">' +
        '<button class="btn-primary" onclick="copyColor(\'hex\')">Copy HEX</button>' +
        '<button class="btn-primary btn-secondary" onclick="copyColor(\'rgb\')">Copy RGB</button>' +
        '</div>' +
        '<div class="result-box" id="colorResult">HEX: #3b82f6 | RGB: rgb(59, 130, 246)</div>';
};
