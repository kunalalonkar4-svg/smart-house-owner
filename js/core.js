/* Smart House Owner – core: state, helpers, photos, icons. */
(function () {
  var SHO = window.SHO = {};
  SHO.ENG = {
    name: ['Er. Kunal Alonkar', 'इं. कुणाल अलोणकर'],
    firm: 'Unique Valuer and Engineers',
    phone: '919424830991',
    phoneShow: '+91 94248 30991',
    email: 'uniquevaluerandengineers@yahoo.com',
    creds: [['Civil Engineer, B.Tech', 'सिविल इंजीनियर, बी.टेक'], ['10+ saal ka experience', '10+ साल का अनुभव'], ['Registered Valuer, IIV Pune', 'रजिस्टर्ड वैल्यूअर, IIV पुणे']]
  };

  var KEY = 'sho_app_v1';
  function defaults() {
    return {
      lang: 'en', profile: null,
      checks: {}, stageNotes: {}, stageDone: {},
      photoChecks: [], expenses: [], payments: [], diary: [], logs: [], reminders: [],
      notifiedOn: ''
    };
  }
  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) {
        var s = JSON.parse(raw);
        var d = defaults();
        for (var k in d) { if (s[k] === undefined) s[k] = d[k]; }
        return s;
      }
    } catch (e) {}
    return defaults();
  }
  SHO.S = load();
  SHO.save = function () {
    try { localStorage.setItem(KEY, JSON.stringify(SHO.S)); }
    catch (e) { SHO.toast(SHO.L('Phone ki memory bhar gayi, kuch purani photos hatao.', 'फ़ोन की मेमोरी भर गई, कुछ पुरानी फ़ोटो हटाएँ।')); }
  };
  SHO.reset = function () { SHO.S = defaults(); SHO.save(); };
  SHO.replaceState = function (s) { var d = defaults(); for (var k in d) { if (s[k] === undefined) s[k] = d[k]; } SHO.S = s; SHO.save(); };

  SHO.hi = function () { return SHO.S.lang === 'hi'; };
  SHO.L = function (a, b) { return SHO.hi() ? b : a; };
  SHO.T = function (x) { return Array.isArray(x) ? (SHO.hi() ? x[1] : x[0]) : (x == null ? '' : x); };

  SHO.esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  SHO.uid = function () { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); };
  SHO.pad = function (n) { return (n < 10 ? '0' : '') + n; };
  SHO.isoDate = function (d) { d = d || new Date(); return d.getFullYear() + '-' + SHO.pad(d.getMonth() + 1) + '-' + SHO.pad(d.getDate()); };
  SHO.today = function () { return SHO.isoDate(new Date()); };
  SHO.addDays = function (iso, n) { var p = iso.split('-'); var d = new Date(+p[0], +p[1] - 1, +p[2]); d.setDate(d.getDate() + n); return SHO.isoDate(d); };
  SHO.daysBetween = function (a, b) {
    var pa = a.split('-'), pb = b.split('-');
    var da = new Date(+pa[0], +pa[1] - 1, +pa[2]), db = new Date(+pb[0], +pb[1] - 1, +pb[2]);
    return Math.round((db - da) / 86400000);
  };
  SHO.fmtDate = function (iso) {
    if (!iso) return '';
    var p = String(iso).slice(0, 10).split('-');
    var d = new Date(+p[0], +p[1] - 1, +p[2]);
    try { return d.toLocaleDateString(SHO.hi() ? 'hi-IN' : 'en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); }
    catch (e) { return iso; }
  };
  SHO.rupee = function (n) {
    n = Math.round(Number(n) || 0);
    try { return '₹' + n.toLocaleString('en-IN'); } catch (e) { return '₹' + n; }
  };
  SHO.num = function (v) { var n = parseFloat(String(v == null ? '' : v).replace(/,/g, '')); return isNaN(n) ? 0 : n; };
  SHO.wa = function (text, phone) { return 'https://wa.me/' + (phone || '') + '?text=' + encodeURIComponent(text); };

  var toastTimer = null;
  SHO.toast = function (msg) {
    var el = document.getElementById('toast');
    if (!el) { el = document.createElement('div'); el.id = 'toast'; el.className = 'toast'; el.setAttribute('role', 'status'); document.body.appendChild(el); }
    el.textContent = msg; el.style.display = 'block';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.style.display = 'none'; }, 2600);
  };

  /* ---------- Photos (IndexedDB, memory fallback) ---------- */
  var mem = {};
  var cache = {};
  var dbp = null;
  function db() {
    if (dbp) return dbp;
    dbp = new Promise(function (res) {
      try {
        if (!window.indexedDB) return res(null);
        var r = indexedDB.open('sho_photos', 1);
        r.onupgradeneeded = function () { r.result.createObjectStore('p'); };
        r.onsuccess = function () { res(r.result); };
        r.onerror = function () { res(null); };
      } catch (e) { res(null); }
    });
    return dbp;
  }
  SHO.putPhoto = function (id, data) {
    cache[id] = data;
    return db().then(function (d) {
      if (!d) { mem[id] = data; return; }
      return new Promise(function (res) {
        try { var tx = d.transaction('p', 'readwrite'); tx.objectStore('p').put(data, id); tx.oncomplete = res; tx.onerror = res; }
        catch (e) { mem[id] = data; res(); }
      });
    });
  };
  SHO.getPhoto = function (id) {
    if (cache[id]) return Promise.resolve(cache[id]);
    return db().then(function (d) {
      if (!d) return mem[id] || null;
      return new Promise(function (res) {
        try {
          var rq = d.transaction('p').objectStore('p').get(id);
          rq.onsuccess = function () { if (rq.result) cache[id] = rq.result; res(rq.result || null); };
          rq.onerror = function () { res(null); };
        } catch (e) { res(mem[id] || null); }
      });
    });
  };
  SHO.delPhoto = function (id) {
    delete cache[id]; delete mem[id];
    return db().then(function (d) {
      if (!d) return;
      try { d.transaction('p', 'readwrite').objectStore('p').delete(id); } catch (e) {}
    });
  };
  SHO.clearPhotos = function () {
    cache = {}; mem = {};
    return db().then(function (d) { if (!d) return; try { d.transaction('p', 'readwrite').objectStore('p').clear(); } catch (e) {} });
  };
  SHO.allPhotoIds = function () {
    var S = SHO.S, ids = [];
    S.photoChecks.forEach(function (c) { (c.photos || []).forEach(function (p) { ids.push(p); }); });
    S.expenses.forEach(function (x) { if (x.photo) ids.push(x.photo); });
    S.diary.forEach(function (x) { if (x.photo) ids.push(x.photo); });
    return ids;
  };
  SHO.compress = function (file, max) {
    max = max || 1280;
    return new Promise(function (res, rej) {
      var fr = new FileReader();
      fr.onerror = function () { rej(new Error('read')); };
      fr.onload = function () {
        var img = new Image();
        img.onerror = function () { rej(new Error('img')); };
        img.onload = function () {
          var w = img.naturalWidth, h = img.naturalHeight;
          var sc = Math.min(1, max / Math.max(w, h));
          var c = document.createElement('canvas');
          c.width = Math.max(1, Math.round(w * sc)); c.height = Math.max(1, Math.round(h * sc));
          var ctx = c.getContext('2d');
          ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height);
          ctx.drawImage(img, 0, 0, c.width, c.height);
          try { res(c.toDataURL('image/jpeg', 0.72)); } catch (e) { res(fr.result); }
        };
        img.src = fr.result;
      };
      fr.readAsDataURL(file);
    });
  };
  SHO.hydratePhotos = function (root) {
    var imgs = (root || document).querySelectorAll('img[data-photo]');
    Array.prototype.forEach.call(imgs, function (im) {
      var id = im.getAttribute('data-photo');
      if (!id || im.getAttribute('data-loaded') === id) return;
      SHO.getPhoto(id).then(function (src) { if (src) { im.src = src; im.setAttribute('data-loaded', id); } });
    });
  };
  SHO.dataUrlToFile = function (dataUrl, name) {
    try {
      var arr = dataUrl.split(','), mime = (arr[0].match(/:(.*?);/) || [])[1] || 'image/jpeg';
      var bstr = atob(arr[1]), n = bstr.length, u8 = new Uint8Array(n);
      while (n--) u8[n] = bstr.charCodeAt(n);
      return new File([u8], name, { type: mime });
    } catch (e) { return null; }
  };

  /* ---------- Icons (inline stroke SVG) ---------- */
  var P = {
    home: '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/>',
    list: '<path d="M9 6h11M9 12h11M9 18h11"/><path d="M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2"/>',
    camera: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
    rupee: '<path d="M7 5h10M7 9h10M7 5c5 0 6 8 0 8l7 6"/>',
    grid: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
    back: '<path d="M15 5l-7 7 7 7"/>',
    chev: '<path d="M9 5l7 7-7 7"/>',
    flag: '<path d="M5 21V4h11l-2 4 2 4H5"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>',
    phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>',
    wa: '<path d="M21 12a9 9 0 0 1-13.4 7.8L3 21l1.3-4.4A9 9 0 1 1 21 12z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 1c-1-.5-2-1.5-2.5-2.5l1-1-1-2z"/>',
    video: '<rect x="3" y="6" width="13" height="12" rx="2"/><path d="M16 10l5-3v10l-5-3z"/>',
    calc: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 12h1M12 12h1M16 12h0M8 16h1M12 16h1M16 16h0"/>',
    shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
    book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5"/>',
    image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 17l-5-5-9 8"/>',
    note: '<path d="M6 3h9l4 4v14H6z"/><path d="M9 11h7M9 15h7M9 7h4"/>',
    bell: '<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 21h4"/>',
    report: '<path d="M6 3h9l4 4v14H6z"/><path d="M9 17v-3M12 17v-6M15 17v-4"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1.2l2-1.6-2-3.4-2.4 1a7 7 0 0 0-2-1.2L14 3h-4l-.5 2.6a7 7 0 0 0-2 1.2l-2.4-1-2 3.4 2 1.6a7 7 0 0 0 0 2.4l-2 1.6 2 3.4 2.4-1a7 7 0 0 0 2 1.2L10 21h4l.5-2.6a7 7 0 0 0 2-1.2l2.4 1 2-3.4-2-1.6c.1-.4.1-.8.1-1.2z"/>',
    play: '<path d="M8 5v14l11-7z" fill="currentColor" stroke="none"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    trash: '<path d="M4 7h16M10 7V4h4v3M6 7l1 14h10l1-14"/>',
    check: '<path d="M5 12l5 5 9-10"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    speaker: '<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11"/>',
    share: '<circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="M8.2 10.8l7.6-4.6M8.2 13.2l7.6 4.6"/>',
    refresh: '<path d="M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5"/>',
    pin: '<path d="M12 21s7-6.3 7-12a7 7 0 0 0-14 0c0 5.7 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/>',
    download: '<path d="M12 4v11M7 10l5 5 5-5M4 20h16"/>',
    upload: '<path d="M12 20V9M7 14l5-5 5 5M4 4h16"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    alert: '<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18h0"/>',
    brick: '<rect x="3" y="5" width="18" height="14" rx="1"/><path d="M3 10h18M3 14h18M9 5v5M15 10v4M9 14v5"/>',
    cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14M12 17h0"/>',
    install: '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M12 7v7M9 11l3 3 3-3"/>',
    hard: '<path d="M4 16h16v3H4z"/><path d="M5 16a7 7 0 0 1 14 0"/><path d="M12 9V5M9 10V7M15 10V7"/>'
  };
  SHO.ic = function (name, size, color, sw) {
    size = size || 22;
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="' + (color || 'currentColor') + '" stroke-width="' + (sw || 2) + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (P[name] || '') + '</svg>';
  };

  SHO.sevChip = function (sev) {
    if (sev === 3) return '<span class="chip r"><span class="dot" style="background:#B42318"></span>' + SHO.L('Engineer bulao', 'इंजीनियर बुलाएँ') + '</span>';
    if (sev === 2) return '<span class="chip y"><span class="dot" style="background:#E0A800"></span>' + SHO.L('Dhyan do', 'ध्यान दें') + '</span>';
    return '<span class="chip g"><span class="dot" style="background:#1E7B3A"></span>' + SHO.L('Normal', 'सामान्य') + '</span>';
  };

  SHO.gcal = function (title, iso, details) {
    var d = iso.replace(/-/g, '');
    var e = SHO.addDays(iso, 1).replace(/-/g, '');
    return 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + encodeURIComponent(title) + '&dates=' + d + '/' + e + '&details=' + encodeURIComponent(details || 'Smart House Owner');
  };
})();
