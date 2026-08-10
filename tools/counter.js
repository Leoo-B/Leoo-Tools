// ==========================================
// TEXT ANALYZER
// ==========================================
window.analyzeText = function() {
    var txt = document.getElementById('counterInput').value;
    var chars = txt.length;
    var words = txt.trim() === '' ? 0 : txt.trim().split(/\s+/).length;
    var lines = txt === '' ? 0 : txt.split(/\n/).length;
    var spaces = (txt.match(/ /g) || []).length;
    var sentences = (txt.match(/[.!?]+/g) || []).length;
    document.getElementById('counterResult').innerHTML =
    '<i data-lucide="bar-chart-2" style="width:14px;height:14px;vertical-align:middle;margin-right:6px;color:var(--accent-glow);"></i>' +
    '<b>' + chars + '</b> huruf | <b>' + words + '</b> kata | <b>' + lines + '</b> baris | <b>' + spaces + '</b> spasi | <b>' + sentences + '</b> kalimat';
    if (typeof lucide !== 'undefined') lucide.createIcons();
    showToast('Analisis teks selesai!', 'success');
    incrementUsage();
};

window.getTemplate_counter = function(tool) {
    return '<div class="tool-desc">' + tool.desc + '</div>' +
        '<label>Masukkan Teks</label>' +
        textareaWithClear('counterInput', 'Tulis sesuatu...') +
        '<button class="btn-primary" onclick="analyzeText()">Analisis Teks</button>' +
        '<div class="result-box" id="counterResult">Klik analisis untuk lihat statistik</div>';
};
