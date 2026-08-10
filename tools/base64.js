// ==========================================
// BASE64 ENCODER / DECODER
// ==========================================
window.encodeBase64 = function() {
    var input = document.getElementById('base64Input').value;
    try {
        document.getElementById('base64Result').textContent = btoa(unescape(encodeURIComponent(input)));
        showToast('Encode berhasil!', 'success');
        incrementUsage();
    } catch(e) {
        document.getElementById('base64Result').textContent = 'Gagal encode: ' + e.message;
        showToast('Gagal encode', 'error');
    }
};

window.decodeBase64 = function() {
    var input = document.getElementById('base64Input').value;
    try {
        document.getElementById('base64Result').textContent = decodeURIComponent(escape(atob(input)));
        showToast('Decode berhasil!', 'success');
        incrementUsage();
    } catch(e) {
        document.getElementById('base64Result').textContent = 'Gagal decode (cek format base64): ' + e.message;
        showToast('Gagal decode', 'error');
    }
};

window.getTemplate_base64 = function(tool) {
    return '<div class="tool-desc">' + tool.desc + '</div>' +
        '<label>Teks / Base64</label>' +
        textareaWithClear('base64Input', 'Masukkan teks atau kode base64...') +
        '<div class="btn-group">' +
        '<button class="btn-primary" onclick="encodeBase64()">Encode</button>' +
        '<button class="btn-primary btn-secondary" onclick="decodeBase64()">Decode</button>' +
        '</div>' +
        resultBoxWithCopy('base64Result', 'Hasil di sini');
};
