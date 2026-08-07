// ==========================================
// JSON FORMATTER
// ==========================================
window.formatJson = function() {
    var input = document.getElementById('jsonInput').value.trim();
    var result = document.getElementById('jsonResult');
    try {
        var parsed = JSON.parse(input);
        result.textContent = JSON.stringify(parsed, null, 2);
        result.style.borderLeftColor = '';
        showToast('JSON berhasil diformat!', 'success');
        incrementUsage();
    } catch(e) {
        result.textContent = 'Error: ' + e.message;
        showToast('Error JSON: ' + e.message, 'error');
    }
};
