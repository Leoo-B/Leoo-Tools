// ==========================================
// PASSWORD GENERATOR
// ==========================================
window.generatePassword = function() {
    var len = parseInt(document.getElementById('passLength').value) || 16;
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    var pass = '';
    for (var i = 0; i < len; i++) pass += chars.charAt(Math.floor(Math.random() * chars.length));
    document.getElementById('passResult').textContent = pass;
    showToast('Password berhasil digenerate!', 'success');
    incrementUsage();
};

window.getTemplate_password = function(tool) {
    return '<div class="tool-desc">' + tool.desc + '</div>' +
        '<label>Panjang Password</label>' +
        '<input type="number" id="passLength" value="16" min="6" max="64">' +
        '<button class="btn-primary" onclick="generatePassword()">Generate Password</button>' +
        resultBoxWithCopy('passResult', 'Klik generate untuk hasil') +
        '<small style="color:var(--text-muted); display:block; margin-top:8px; font-size:0.75rem;">Kombinasi huruf besar, kecil, angka & simbol</small>';
};
