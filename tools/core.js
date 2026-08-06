// ==========================================
// CORE DASHBOARD & MODAL HANDLER (LEOO-TOOLS)
// ==========================================

const toolsData = [
  {
    id: "media-downloader",
    name: "Media Downloader",
    description: "Unduh video & audio dari TikTok, YouTube, IG, dan Facebook.",
    category: "media",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>`,
    html: `
      <div class="tool-form">
        <label>URL Media:</label>
        <input type="text" id="mediaUrl" placeholder="Tempelkan link TikTok, YouTube, IG, FB...">
        <button class="btn-primary" onclick="downloadMedia()">Unduh Media</button>
        <div id="mediaResult" class="tool-result"></div>
      </div>
    `
  },
  {
    id: "image-upscaler",
    name: "Image Upscaler",
    description: "Tingkatkan resolusi gambar hingga 2x menggunakan AI backend.",
    category: "image",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>`,
    html: `
      <div class="tool-form">
        <label>Pilih Gambar:</label>
        <input type="file" id="imageInput" accept="image/*">
        <button class="btn-primary" onclick="upscaleImage()">Proses Upscale 2x</button>
        <div id="imageResult" class="tool-result"></div>
      </div>
    `
  },
  {
    id: "base64-tool",
    name: "Base64 Encoder / Decoder",
    description: "Ubah teks biasa menjadi string Base64 dan sebaliknya.",
    category: "utility",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
    html: `
      <div class="tool-form">
        <label>Input Teks / Base64:</label>
        <textarea id="base64Input" rows="4" placeholder="Masukkan teks di sini..."></textarea>
        <div class="btn-group">
          <button class="btn-primary" onclick="encodeBase64()">Encode</button>
          <button class="btn-secondary" onclick="decodeBase64()">Decode</button>
        </div>
        <pre id="base64Result" class="tool-result-box"></pre>
      </div>
    `
  },
  {
    id: "color-picker",
    name: "Color Picker Pro",
    description: "Pilih warna secara visual dan salin kode HEX atau RGB.",
    category: "utility",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 22 1-1h3l9-9"/><path d="M3 21v-3l9-9"/><path d="m15 6 3-3a2.12 2.12 0 0 1 3 3l-3 3"/><path d="m9 15 6-6"/></svg>`,
    html: `
      <div class="tool-form">
        <label>Pilih Warna:</label>
        <input type="color" id="colorPicker" value="#0066ff" style="height:50px; cursor:pointer;">
        <div class="btn-group">
          <button class="btn-primary" onclick="copyColor('hex')">Copy HEX</button>
          <button class="btn-secondary" onclick="copyColor('rgb')">Copy RGB</button>
        </div>
        <div id="colorResult" class="tool-result">HEX: #0066ff | RGB: rgb(0, 102, 255)</div>
      </div>
    `
  },
  {
    id: "text-analyzer",
    name: "Text Analyzer",
    description: "Hitung jumlah karakter, kata, baris, spasi, dan kalimat.",
    category: "utility",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/></svg>`,
    html: `
      <div class="tool-form">
        <label>Masukkan Teks:</label>
        <textarea id="counterInput" rows="5" placeholder="Ketik atau tempel teks..."></textarea>
        <button class="btn-primary" onclick="analyzeText()">Analisis Teks</button>
        <div id="counterResult" class="tool-result">Silakan masukkan teks.</div>
      </div>
    `
  },
  {
    id: "json-formatter",
    name: "JSON Formatter",
    description: "Format dan rapikan sintaks JSON yang berantakan.",
    category: "utility",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
    html: `
      <div class="tool-form">
        <label>Input Raw JSON:</label>
        <textarea id="jsonInput" rows="5" placeholder='{"key": "value"}'></textarea>
        <button class="btn-primary" onclick="formatJson()">Format JSON</button>
        <pre id="jsonResult" class="tool-result-box"></pre>
      </div>
    `
  },
  {
    id: "news-headline",
    name: "Berita Indonesia",
    description: "Pantau headline berita terkini dari Indonesia via GNews.",
    category: "media",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></svg>`,
    html: `
      <div class="tool-form">
        <label>Kategori Berita:</label>
        <select id="newsCategory">
          <option value="general">Umum</option>
          <option value="technology">Teknologi</option>
          <option value="business">Bisnis</option>
          <option value="sports">Olahraga</option>
          <option value="entertainment">Hiburan</option>
        </select>
        <button class="btn-primary" onclick="getNews()">Muat Berita</button>
        <div id="newsResult" class="tool-result" style="text-align:left;"></div>
      </div>
    `
  },
  {
    id: "password-generator",
    name: "Password Generator",
    description: "Buat kata sandi acak yang kuat dan aman.",
    category: "utility",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4.1a1 1 0 0 0-1.4 0l-2.1 2.1a1 1 0 0 0 0 1.3Z"/><path d="m15.5 7.5-3 3"/><path d="M2 22l10-10"/><circle cx="6.5" cy="17.5" r="2.5"/></svg>`,
    html: `
      <div class="tool-form">
        <label>Panjang Karakter:</label>
        <input type="number" id="passLength" value="16" min="6" max="64">
        <button class="btn-primary" onclick="generatePassword()">Generate Password</button>
        <pre id="passResult" class="tool-result-box"></pre>
      </div>
    `
  },
  {
    id: "unit-converter",
    name: "Konverter Suhu",
    description: "Konversi satuan suhu Celsius, Fahrenheit, dan Kelvin.",
    category: "utility",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/></svg>`,
    html: `
      <div class="tool-form">
        <label>Nilai Suhu:</label>
        <input type="number" id="unitInput" placeholder="Contoh: 36">
        <label>Arah Konversi:</label>
        <select id="unitDirection">
          <option value="CF">Celsius ➔ Fahrenheit</option>
          <option value="FC">Fahrenheit ➔ Celsius</option>
          <option value="CK">Celsius ➔ Kelvin</option>
          <option value="KC">Kelvin ➔ Celsius</option>
        </select>
        <button class="btn-primary" onclick="convertUnit()">Konversi</button>
        <div id="unitResult" class="tool-result"></div>
      </div>
    `
  },
  {
    id: "url-shortener",
    name: "URL Shortener",
    description: "Pendekkan tautan panjang menggunakan TinyURL API.",
    category: "utility",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
    html: `
      <div class="tool-form">
        <label>URL Panjang:</label>
        <input type="text" id="urlInput" placeholder="https://contoh.com/link-panjang-sekali">
        <button class="btn-primary" onclick="shortenUrl()">Pendekkan Link</button>
        <div id="urlResult" class="tool-result"></div>
      </div>
    `
  },
  {
    id: "weather-tool",
    name: "Cek Cuaca",
    description: "Cek kondisi cuaca terkini di kota tujuan Anda.",
    category: "utility",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19a4.5 4.5 0 1 0 0-9h-1.8A7 7 0 1 0 3 14.5a4.5 4.5 0 0 0 4.5 4.5h10Z"/></svg>`,
    html: `
      <div class="tool-form">
        <label>Nama Kota:</label>
        <input type="text" id="weatherCity" placeholder="Contoh: Jakarta, Surabaya, Samarinda">
        <button class="btn-primary" onclick="checkWeather()">Cek Cuaca</button>
        <div id="weatherResult" class="tool-result"></div>
      </div>
    `
  }
];

// Usage Counter Logic
let usageCount = parseInt(localStorage.getItem('usageCount') || '0');

function updateUsageDisplay() {
  const el = document.getElementById('usage-count');
  if (el) el.textContent = usageCount;
}

window.incrementUsage = function() {
  usageCount++;
  localStorage.setItem('usageCount', usageCount.toString());
  updateUsageDisplay();
};

// Toast Notification
window.showToast = function(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
};

// Render Dashboard Grid
function renderTools(filter = 'all') {
  const grid = document.getElementById('tools-grid');
  if (!grid) return;
  grid.innerHTML = '';

  const filtered = filter === 'all' ? toolsData : toolsData.filter(t => t.category === filter);

  filtered.forEach(tool => {
    const card = document.createElement('div');
    card.className = 'tool-card';
    card.onclick = () => openToolModal(tool.id);

    card.innerHTML = `
      <div class="card-header">
        <div class="card-icon">${tool.icon}</div>
        <span class="card-badge">${tool.category}</span>
      </div>
      <h3 class="card-title">${tool.name}</h3>
      <p class="card-desc">${tool.description}</p>
    `;
    grid.appendChild(card);
  });
}

// Modal Control
function openToolModal(toolId) {
  const tool = toolsData.find(t => t.id === toolId);
  if (!tool) return;

  document.getElementById('modal-icon').innerHTML = tool.icon;
  document.getElementById('modal-title').textContent = tool.name;
  document.getElementById('modal-body').innerHTML = tool.html;

  const modal = document.getElementById('tool-modal');
  modal.classList.add('active');
}

function closeModal() {
  const modal = document.getElementById('tool-modal');
  if (modal) modal.classList.remove('active');
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  renderTools();
  updateUsageDisplay();

  // Category Filters
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterBtns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      renderTools(e.target.dataset.category);
    });
  });

  // Modal Close Events
  document.getElementById('modal-close').addEventListener('click', closeModal);
  window.addEventListener('click', (e) => {
    const modal = document.getElementById('tool-modal');
    if (e.target === modal) closeModal();
  });

  // Theme Toggle Event
  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const isDark = document.documentElement.classList.toggle('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
  }
});