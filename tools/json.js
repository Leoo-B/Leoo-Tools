// ==========================================
// JSON FORMATTER
// ==========================================
window.formatJson = function() {
    var input = document.getElementById('jsonInput').value.trim();
    var result = document.getElementById('jsonResult');
    try {
        var parsed = JSON.parse(input);
        result.textContent = JSON.stringify(parsed, null, 2);
        result.style.borderLeftColor = '#4ade80';
        showToast('✅ JSON berhasil diformat!');
        incrementUsage();
    } catch(e) {
        result.textContent = '❌ Error: ' + e.message;
        result.style.borderLeftColor = '#f87171';
        showToast('❌ Error JSON: ' + e.message);
    }
};
