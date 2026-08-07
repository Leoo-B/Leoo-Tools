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
