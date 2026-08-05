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
    document.getElementById('counterResult').innerHTML = '📊 <b>' + chars + '</b> huruf | <b>' + words + '</b> kata | <b>' + lines + '</b> baris | <b>' + spaces + '</b> spasi | <b>' + sentences + '</b> kalimat';
    showToast('📊 Analisis teks selesai!');
    incrementUsage();
};
