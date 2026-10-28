/* Smart House Owner – router, actions, forms, PWA glue. */
(function () {
  var SHO = window.SHO, C = window.SHO_CONTENT;
  var L = SHO.L, T = SHO.T, esc = SHO.esc, ic = SHO.ic;
  var app = document.getElementById('app');
  SHO.W = null;

  function newWizard(extra) {
    SHO.W = { step: 0, photos: [], ans: {}, followOf: null, busy: false };
    if (extra) for (var k in extra) SHO.W[k] = extra[k];
  }

  function parse() {
    var h = (location.hash || '').replace(/^#\/?/, '');
    var parts = h.split('/').filter(Boolean).map(decodeURIComponent);
    return { name: parts[0] || 'home', args: parts.slice(1) };
  }
  function pick(r) {
    var V = SHO.V;
    if (!SHO.S.profile) return { v: V.setup(), tab: '' };
    switch (r.name) {
      case 'setup': return { v: V.setup(), tab: 'more' };
      case 'stages': return { v: V.stages(), tab: 'stages' };
      case 'stage': return { v: V.stage(r.args), tab: 'stages' };
      case 'check':
        if (r.args[0] === 'new') { if (!SHO.W) newWizard(); return { v: V.checkNew(), tab: 'check' }; }
        if (r.args[0] === 'view') return { v: V.checkView(r.args.slice(1)), tab: 'check' };
        return { v: V.check(), tab: 'check' };
      case 'flags': return { v: V.flags(), tab: 'home' };
      case 'engineer': return { v: V.engineer(), tab: 'more' };
      case 'money': return { v: V.money(r.args), tab: 'money' };
      case 'calc': return { v: V.calc(r.args), tab: 'more' };
      case 'quality': return { v: V.quality(), tab: 'more' };
      case 'learn': return { v: V.learn(), tab: 'more' };
      case 'diary': return { v: V.diary(r.args), tab: 'more' };
      case 'log': return { v: V.log(), tab: 'more' };
      case 'reminders': return { v: V.reminders(), tab: 'more' };
      case 'report': return { v: V.report(), tab: 'more' };
      case 'settings': return { v: V.settings(), tab: 'more' };
      case 'more': return { v: V.more(), tab: 'more' };
      default: return { v: V.home(), tab: 'home' };
    }
  }

  function topbar(v) {
    var left = v.back
      ? '<a class="icon-btn" href="' + v.back + '" aria-label="' + L('Peeche', 'पीछे') + '">' + ic('back', 24) + '</a>'
      : '<a class="logo" href="#/home" aria-label="Home">' + ic('home', 20, '#1B1F24', 2.4) + '</a>';
    return '<header class="topbar">' + left + '<div class="title">' + esc(v.title) + '</div>' +
      '<div class="lang" role="group" aria-label="Language"><button class="' + (SHO.hi() ? '' : 'on') + '" data-a="lang" data-v="en" aria-pressed="' + !SHO.hi() + '">Hinglish</button><button class="' + (SHO.hi() ? 'on' : '') + '" data-a="lang" data-v="hi" aria-pressed="' + SHO.hi() + '">हिंदी</button></div></header>';
  }
  function nav(tab) {
    if (!SHO.S.profile) return '';
    var items = [['home', '#/home', 'home', L('Home', 'होम')], ['stages', '#/stages', 'list', L('Checklist', 'चेकलिस्ट')], ['check', '#/check', 'camera', L('Photo check', 'फ़ोटो जाँच')], ['money', '#/money', 'rupee', L('Hisaab', 'हिसाब')], ['more', '#/more', 'grid', L('Aur', 'और')]];
    return '<nav class="nav" aria-label="Main"><div class="nav-in">' + items.map(function (it) {
      return '<a href="' + it[1] + '" class="' + (it[0] === 'check' ? 'cam ' : '') + (tab === it[0] ? 'on' : '') + '"' + (tab === it[0] ? ' aria-current="page"' : '') + '><span class="nav-ic">' + ic(it[2], 20) + '</span>' + it[3] + '</a>';
    }).join('') + '</div></nav>';
  }

  SHO.render = function (toTop) {
    var r = parse();
    var p = pick(r);
    app.innerHTML = topbar(p.v) + '<main id="main">' + p.v.body + '</main>' + nav(p.tab);
    document.documentElement.lang = SHO.hi() ? 'hi' : 'hi-Latn';
    document.title = p.v.title === 'Smart House Owner' ? 'Smart House Owner' : p.v.title + ' · Smart House Owner';
    SHO.hydratePhotos(app);
    Array.prototype.forEach.call(app.querySelectorAll('form[data-calc]'), function (f) { SHO.renderCalc(f); });
    if (toTop) window.scrollTo(0, 0);
  };
  function go(hash) { if (location.hash === hash) SHO.render(true); else location.hash = hash; }

  window.addEventListener('hashchange', function () {
    var r = parse();
    if (!(r.name === 'check' && r.args[0] === 'new')) SHO.W = null;
    if ('speechSynthesis' in window) { try { window.speechSynthesis.cancel(); } catch (e) {} }
    SHO.render(true);
  });

  /* ---------- helpers ---------- */
  function findById(list, id) { for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; return null; }
  function removeById(list, id) { for (var i = 0; i < list.length; i++) if (list[i].id === id) { list.splice(i, 1); return; } }
  function nowTime() { var d = new Date(); return SHO.pad(d.getHours()) + ':' + SHO.pad(d.getMinutes()); }
  function openUrl(u) { var w = window.open(u, '_blank', 'noopener'); if (!w) location.href = u; }

  function speak(text) {
    if (!('speechSynthesis' in window)) { SHO.toast(L('Is phone me bolne ki suvidha nahi hai.', 'इस फ़ोन में बोलने की सुविधा नहीं है।')); return; }
    var ss = window.speechSynthesis;
    if (ss.speaking) { ss.cancel(); return; }
    var u = new SpeechSynthesisUtterance(text);
    u.lang = 'hi-IN'; u.rate = 0.95;
    var vs = ss.getVoices() || [];
    for (var i = 0; i < vs.length; i++) { if (/^hi/i.test(vs[i].lang)) { u.voice = vs[i]; break; } }
    ss.speak(u);
    SHO.toast(L('Bol raha hoon… rokne ke liye dobara dabao', 'बोल रहा हूँ… रोकने के लिए दोबारा दबाएँ'));
  }

  function shareCheck(c, toEng) {
    var r = SHO.analyze(c.ans);
    var sevT = c.sev === 3 ? L('Engineer bulao (serious)', 'इंजीनियर बुलाएँ (गंभीर)') : c.sev === 2 ? L('Dhyan do', 'ध्यान दें') : L('Normal', 'सामान्य');
    var p = SHO.S.profile || {};
    var lines = [];
    if (toEng) {
      lines.push(L('Namaste Kunal ji, Smart House Owner app se photo check:', 'नमस्ते कुणाल जी, Smart House Owner ऐप से फ़ोटो जाँच:'));
      lines.push(L('Owner: ', 'मालिक: ') + (p.name || '') + (p.city ? ', ' + p.city : ''));
    } else {
      lines.push(L('Thekedar ji, ghar me ye problem dikhi hai. Kripya dekh kar theek karwayein:', 'ठेकेदार जी, घर में यह समस्या दिखी है। कृपया देखकर ठीक करवाएँ:'));
    }
    lines.push('');
    lines.push('*' + r.title + '* (' + sevT + ')');
    [['part', SHO.PARTS], ['stage', SHO.STAGEQ], ['width', SHO.WIDTHS], ['since', SHO.SINCE], ['trend', SHO.TREND]].forEach(function (x) { if (c.ans[x[0]]) lines.push('- ' + SHO.optLabel(x[1], c.ans[x[0]])); });
    lines.push('');
    lines.push(L('Check karna hai:', 'जाँचना है:'));
    r.checks.forEach(function (x) { lines.push('• ' + x); });
    lines.push(L('Theek kaise hoga:', 'ठीक कैसे होगा:'));
    r.repair.forEach(function (x) { lines.push('• ' + x); });
    lines.push(L('Na karein: ', 'न करें: ') + r.dont);
    if (toEng) { lines.push(''); lines.push(L('Kya ye sahi hai? Aapki salah chahiye.', 'क्या यह सही है? आपकी सलाह चाहिए।')); }
    var text = lines.join('\n');
    var waUrl = SHO.wa(text, toEng ? SHO.ENG.phone : '');
    if (navigator.canShare && c.photos && c.photos.length) {
      Promise.all(c.photos.map(function (id, k) { return SHO.getPhoto(id).then(function (d) { return d ? SHO.dataUrlToFile(d, 'photo-' + (k + 1) + '.jpg') : null; }); })).then(function (files) {
        files = files.filter(Boolean);
        var data = { text: toEng ? text + '\n\n(' + T(SHO.ENG.name) + ': ' + SHO.ENG.phoneShow + ')' : text, files: files };
        if (files.length && navigator.canShare(data)) {
          navigator.share(data).catch(function () {});
          if (toEng) SHO.toast(L('WhatsApp me Kunal ji (94248 30991) ko chuno', 'WhatsApp में कुणाल जी (94248 30991) को चुनें'));
        } else openUrl(waUrl);
      });
    } else {
      openUrl(waUrl);
      if (c.photos && c.photos.length) SHO.toast(L('Message ke baad photo bhi bhej dena', 'मैसेज के बाद फ़ोटो भी भेज दें'));
    }
  }

  function summaryText() {
    var S = SHO.S, p = S.profile, o = SHO.overall(), f = SHO.flags();
    var spent = S.expenses.reduce(function (a, x) { return a + SHO.num(x.amount); }, 0);
    var lines = [L('Namaste Kunal ji, mere ghar ka summary (Smart House Owner app):', 'नमस्ते कुणाल जी, मेरे घर का सारांश (Smart House Owner ऐप):'), '',
      L('Owner: ', 'मालिक: ') + p.name + (p.city ? ', ' + p.city : ''),
      L('Ghar: ', 'घर: ') + (p.house || '-'),
      L('Abhi ka stage: ', 'अभी का स्टेज: ') + T(C.STAGES[SHO.currentStage()].name),
      L('Inspection: ', 'जाँच: ') + o.pct + '% (' + o.ok + ' ' + L('sahi', 'सही') + ', ' + o.bad + ' ' + L('galat', 'ग़लत') + ')',
      L('Kharch: ', 'ख़र्च: ') + SHO.rupee(spent) + (SHO.num(p.budget) ? ' / ' + SHO.rupee(p.budget) : '')];
    if (f.length) { lines.push(''); lines.push(L('Red flags:', 'रेड फ़्लैग:')); f.slice(0, 10).forEach(function (x) { lines.push('• ' + x.title + ' (' + x.sub + ')'); }); }
    lines.push(''); lines.push(L('Kripya salah dein.', 'कृपया सलाह दें।'));
    return lines.join('\n');
  }

  function addReminder(title, date, extra) {
    var r = { id: SHO.uid(), title: title, date: date, done: false };
    if (extra) for (var k in extra) r[k] = extra[k];
    SHO.S.reminders.push(r);
  }

  function finishWizard() {
    var W = SHO.W;
    var res = SHO.analyze(W.ans);
    var c = { id: SHO.uid(), created: Date.now(), date: SHO.today(), photos: W.photos.slice(), ans: W.ans, sev: res.sev, followOf: W.followOf || null, resolved: false };
    SHO.S.photoChecks.push(c);
    if (W.followOf && W.ans.trend === 'less') { var par = findById(SHO.S.photoChecks, W.followOf); if (par) par.resolved = true; }
    SHO.save();
    SHO.W = null;
    location.hash = '#/check/view/' + c.id;
  }

  /* ---------- click actions ---------- */
  var A = {
    lang: function (el) { SHO.S.lang = el.getAttribute('data-v'); SHO.save(); SHO.render(); },
    mark: function (el) {
      var k = el.getAttribute('data-k'), v = el.getAttribute('data-v');
      if (SHO.S.checks[k] === v) delete SHO.S.checks[k]; else SHO.S.checks[k] = v;
      SHO.save(); SHO.render();
      if (v === 'bad' && SHO.S.checks[k] === 'bad') SHO.toast(L('Red flag laga. Theek hone tak agla kaam rukwao.', 'रेड फ़्लैग लगा। ठीक होने तक अगला काम रुकवाएँ।'));
    },
    'stage-done': function (el) {
      var i = +el.getAttribute('data-i'), st = SHO.stageStat(i);
      if (!st.pass && !confirm(L('Kuch points abhi Sahi mark nahi hue (' + st.ok + '/' + st.n + '). Fir bhi stage poora karein?', 'कुछ पॉइंट अभी सही मार्क नहीं हुए (' + st.ok + '/' + st.n + ')। फिर भी स्टेज पूरा करें?'))) return;
      SHO.S.stageDone[i] = SHO.today(); SHO.save();
      var pend = SHO.S.payments.filter(function (p) { return p.status !== 'paid' && String(p.stage) === String(i); });
      SHO.render();
      SHO.toast(pend.length ? L('Stage poora! Is stage ka thekedar payment ab de sakte ho.', 'स्टेज पूरा! इस स्टेज का ठेकेदार पेमेंट अब दे सकते हैं।') : L('Stage poora hua 👍', 'स्टेज पूरा हुआ 👍'));
    },
    'stage-undo': function (el) { delete SHO.S.stageDone[+el.getAttribute('data-i')]; SHO.save(); SHO.render(); },
    'w-next': function () { if (SHO.W) { SHO.W.step = 1; SHO.render(true); } },
    'w-back': function () { if (SHO.W) { SHO.W.step = Math.max(0, SHO.W.step - 1); SHO.render(true); } },
    'w-del-photo': function (el) { var W = SHO.W; if (!W) return; var k = +el.getAttribute('data-k'); var id = W.photos.splice(k, 1)[0]; if (id) SHO.delPhoto(id); SHO.render(); },
    'w-ans': function (el) {
      var W = SHO.W; if (!W) return;
      var k = el.getAttribute('data-k'), v = el.getAttribute('data-v');
      W.ans[k] = v;
      if (k === 'prob' && v !== 'crack') delete W.ans.width;
      var qs = SHO.questions(W.ans, !!W.followOf);
      W.step++;
      if (W.step > qs.length) finishWizard(); else SHO.render(true);
    },
    speak: function (el) { var c = findById(SHO.S.photoChecks, el.getAttribute('data-id')); if (c) speak(SHO.resultText(c, 'hi')); },
    'share-thekedar': function (el) { var c = findById(SHO.S.photoChecks, el.getAttribute('data-id')); if (c) shareCheck(c, false); },
    'share-eng': function (el) { var c = findById(SHO.S.photoChecks, el.getAttribute('data-id')); if (c) shareCheck(c, true); },
    'check-remind': function (el) {
      var c = findById(SHO.S.photoChecks, el.getAttribute('data-id')); if (!c) return;
      addReminder(L('Dobara photo lo: ', 'दोबारा फ़ोटो लें: ') + SHO.analyze(c.ans).title, SHO.addDays(SHO.today(), 7), { link: 'check/view/' + c.id });
      SHO.save(); SHO.toast(L('7 din baad ka reminder lag gaya', '7 दिन बाद का रिमाइंडर लग गया'));
    },
    'check-follow': function (el) {
      var c = findById(SHO.S.photoChecks, el.getAttribute('data-id')); if (!c) return;
      var ans = {}; for (var k in c.ans) if (k !== 'trend') ans[k] = c.ans[k];
      newWizard({ followOf: c.id, ans: ans });
      location.hash = '#/check/new';
    },
    'check-resolve': function (el) { var c = findById(SHO.S.photoChecks, el.getAttribute('data-id')); if (!c) return; c.resolved = !c.resolved; SHO.save(); SHO.render(); if (c.resolved) SHO.toast(L('Badhiya! Theek mark ho gaya.', 'बढ़िया! ठीक मार्क हो गया।')); },
    'check-del': function (el) {
      var id = el.getAttribute('data-id'), c = findById(SHO.S.photoChecks, id); if (!c) return;
      if (!confirm(L('Ye photo check hataein?', 'यह फ़ोटो जाँच हटाएँ?'))) return;
      (c.photos || []).forEach(SHO.delPhoto); removeById(SHO.S.photoChecks, id); SHO.save(); go('#/check');
    },
    'rem-done': function (el) {
      var r = findById(SHO.S.reminders, el.getAttribute('data-id')); if (!r) return;
      if (r.until && r.date < r.until) { r.date = SHO.addDays(SHO.today() > r.date ? SHO.today() : r.date, 1); if (r.date > r.until) r.done = true; SHO.toast(L('Shabash! Kal phir yaad dilaunga.', 'शाबाश! कल फिर याद दिलाऊँगा।')); }
      else r.done = true;
      SHO.save(); SHO.render();
    },
    'rem-del': function (el) { removeById(SHO.S.reminders, el.getAttribute('data-id')); SHO.save(); SHO.render(); },
    'pay-done': function (el) {
      var p = findById(SHO.S.payments, el.getAttribute('data-id')); if (!p) return;
      p.status = 'paid'; p.paidDate = SHO.today();
      SHO.S.expenses.push({ id: SHO.uid(), created: Date.now(), date: SHO.today(), cat: 'labour', amount: SHO.num(p.amount), note: p.who + (p.stage !== '' && p.stage != null ? ' – ' + T(C.STAGES[+p.stage].name) : '') });
      SHO.save(); SHO.render(); SHO.toast(L('Payment likh liya aur kharch me jod diya', 'पेमेंट लिख लिया और ख़र्च में जोड़ दिया'));
    },
    'pay-del': function (el) { if (!confirm(L('Hataein?', 'हटाएँ?'))) return; removeById(SHO.S.payments, el.getAttribute('data-id')); SHO.save(); SHO.render(); },
    'exp-del': function (el) { if (!confirm(L('Ye kharch hataein?', 'यह ख़र्च हटाएँ?'))) return; var x = findById(SHO.S.expenses, el.getAttribute('data-id')); if (x && x.photo) SHO.delPhoto(x.photo); removeById(SHO.S.expenses, el.getAttribute('data-id')); SHO.save(); SHO.render(); },
    'diary-del': function (el) { if (!confirm(L('Ye photo hataein?', 'यह फ़ोटो हटाएँ?'))) return; var x = findById(SHO.S.diary, el.getAttribute('data-id')); if (x && x.photo) SHO.delPhoto(x.photo); removeById(SHO.S.diary, el.getAttribute('data-id')); SHO.save(); SHO.render(); },
    'log-del': function (el) { if (!confirm(L('Hataein?', 'हटाएँ?'))) return; removeById(SHO.S.logs, el.getAttribute('data-id')); SHO.save(); SHO.render(); },
    'send-summary': function () { openUrl(SHO.wa(summaryText(), SHO.ENG.phone)); },
    install: function () { var e = SHO.installEvt; if (!e) return; e.prompt(); (e.userChoice || Promise.resolve()).then(function () { SHO.installEvt = null; SHO.render(); }); },
    notif: function () {
      if (!('Notification' in window)) return;
      Notification.requestPermission().then(function (p) { SHO.render(); if (p === 'granted') { SHO.toast(L('Notification chalu! App kholne par due kaam yaad dilaunga.', 'नोटिफ़िकेशन चालू! ऐप खोलने पर बाकी काम याद दिलाऊँगा।')); notifyDue(true); } });
    },
    print: function () { window.print(); },
    backup: function () {
      var ids = SHO.allPhotoIds();
      Promise.all(ids.map(function (id) { return SHO.getPhoto(id).then(function (d) { return [id, d]; }); })).then(function (pairs) {
        var photos = {}; pairs.forEach(function (p) { if (p[1]) photos[p[0]] = p[1]; });
        var blob = new Blob([JSON.stringify({ app: 'smart-house-owner', v: 1, at: new Date().toISOString(), state: SHO.S, photos: photos })], { type: 'application/json' });
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob); a.download = 'smart-house-owner-backup-' + SHO.today() + '.json';
        document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 2000);
        SHO.toast(L('Backup file download ho gayi', 'बैकअप फ़ाइल डाउनलोड हो गई'));
      });
    },
    wipe: function () {
      if (!confirm(L('Saara data (photos, checklist, hisaab) mit jayega. Pakka?', 'सारा डेटा (फ़ोटो, चेकलिस्ट, हिसाब) मिट जाएगा। पक्का?'))) return;
      if (!confirm(L('Aakhri baar: kya backup bana liya? Mitayein?', 'आख़िरी बार: क्या बैकअप बना लिया? मिटाएँ?'))) return;
      var lang = SHO.S.lang; SHO.reset(); SHO.S.lang = lang; SHO.save(); SHO.clearPhotos(); go('#/home');
    }
  };
  document.addEventListener('click', function (e) {
    var el = e.target.closest ? e.target.closest('[data-a]') : null;
    if (!el) return;
    var fn = A[el.getAttribute('data-a')];
    if (fn) { e.preventDefault(); fn(el, e); }
  });

  /* ---------- forms ---------- */
  function fileOf(form, name) { var el = form.elements[name]; return el && el.files && el.files[0] ? el.files[0] : null; }
  var F = {
    profile: function (f, d) {
      var first = !SHO.S.profile;
      SHO.S.profile = { name: (d.get('name') || '').trim(), house: (d.get('house') || '').trim(), city: (d.get('city') || '').trim(), budget: SHO.num(d.get('budget')) || '', start: d.get('start') || SHO.today(), stage: +d.get('stage') || 0 };
      if (first) { for (var i = 0; i < SHO.S.profile.stage; i++) SHO.S.stageDone[i] = SHO.today(); }
      SHO.save(); go('#/home');
      SHO.toast(first ? L('Swagat hai! Ab har stage par check karte raho.', 'स्वागत है! अब हर स्टेज पर जाँच करते रहें।') : L('Save ho gaya', 'सेव हो गया'));
    },
    'stage-note': function (f, d) { SHO.S.stageNotes[f.getAttribute('data-i')] = (d.get('note') || '').trim(); SHO.save(); SHO.toast(L('Note save ho gaya', 'नोट सेव हो गया')); },
    yt: function (f, d) { var q = (d.get('q') || '').trim(); if (q) openUrl(C.yt(q)); },
    payment: function (f, d) {
      SHO.S.payments.push({ id: SHO.uid(), created: Date.now(), who: (d.get('who') || '').trim(), stage: d.get('stage'), amount: SHO.num(d.get('amount')), gate: !!d.get('gate'), status: 'pending' });
      SHO.save(); SHO.render(); SHO.toast(L('Milestone jud gaya', 'माइलस्टोन जुड़ गया'));
    },
    expense: function (f, d) {
      var file = fileOf(f, 'photo');
      var x = { id: SHO.uid(), created: Date.now(), date: d.get('date') || SHO.today(), cat: d.get('cat'), amount: SHO.num(d.get('amount')), note: (d.get('note') || '').trim() };
      var done = function () { SHO.S.expenses.push(x); SHO.save(); SHO.render(); SHO.toast(L('Kharch jud gaya', 'ख़र्च जुड़ गया')); };
      if (!file) return done();
      SHO.toast(L('Photo save ho rahi hai…', 'फ़ोटो सेव हो रही है…'));
      SHO.compress(file, 1400).then(function (data) { x.photo = 'p' + SHO.uid(); return SHO.putPhoto(x.photo, data); }).then(done, done);
    },
    diary: function (f, d) {
      var file = fileOf(f, 'photo'); if (!file) return;
      var x = { id: SHO.uid(), created: Date.now(), date: SHO.today(), time: nowTime(), stage: d.get('stage'), caption: (d.get('caption') || '').trim() };
      var wantLoc = !!d.get('loc');
      var btn = f.querySelector('button[type=submit]'); if (btn) btn.disabled = true;
      var finish = function () { SHO.S.diary.push(x); SHO.save(); go('#/diary'); SHO.toast(L('Photo diary me save', 'फ़ोटो डायरी में सेव')); };
      var getLoc = function () {
        return new Promise(function (res) {
          if (!wantLoc || !navigator.geolocation) return res();
          navigator.geolocation.getCurrentPosition(function (pos) { x.lat = Math.round(pos.coords.latitude * 1e5) / 1e5; x.lng = Math.round(pos.coords.longitude * 1e5) / 1e5; res(); }, function () { res(); }, { timeout: 8000, maximumAge: 600000 });
        });
      };
      SHO.compress(file).then(function (data) { x.photo = 'p' + SHO.uid(); return SHO.putPhoto(x.photo, data); }).then(getLoc).then(finish, function () { if (btn) btn.disabled = false; SHO.toast(L('Photo nahi khuli, dobara try karo', 'फ़ोटो नहीं खुली, दोबारा कोशिश करें')); });
    },
    log: function (f, d) {
      SHO.S.logs.push({ id: SHO.uid(), created: Date.now(), date: d.get('date') || SHO.today(), mistri: SHO.num(d.get('mistri')), labour: SHO.num(d.get('labour')), work: (d.get('work') || '').trim(), material: (d.get('material') || '').trim(), note: (d.get('note') || '').trim() });
      SHO.save(); SHO.render(); SHO.toast(L('Aaj ka kaam likh liya', 'आज का काम लिख लिया'));
    },
    'rem-template': function (f, d) {
      var t = C.REMINDER_TEMPLATES[+d.get('tpl')]; if (!t) return;
      var from = d.get('from') || SHO.today();
      var date = SHO.addDays(from, t.days), title = T(t.title);
      if (t.repeat) { var until = SHO.addDays(from, t.repeat); addReminder(title + ' – ' + L(SHO.fmtDate(until) + ' tak roz', SHO.fmtDate(until) + ' तक रोज़'), date < SHO.today() ? SHO.today() : date, { until: until }); }
      else addReminder(title, date);
      SHO.save(); SHO.render(); SHO.toast(L('Reminder lag gaya', 'रिमाइंडर लग गया'));
    },
    'rem-custom': function (f, d) { var t = (d.get('title') || '').trim(); if (!t) return; addReminder(t, d.get('date') || SHO.today()); SHO.save(); SHO.render(); SHO.toast(L('Reminder lag gaya', 'रिमाइंडर लग गया')); }
  };
  document.addEventListener('submit', function (e) {
    var f = e.target;
    if (f.hasAttribute('data-calc')) { e.preventDefault(); return; }
    var name = f.getAttribute('data-f'); if (!name || !F[name]) return;
    e.preventDefault();
    F[name](f, new FormData(f));
  });

  /* ---------- change / input ---------- */
  document.addEventListener('change', function (e) {
    var el = e.target;
    var c = el.getAttribute && el.getAttribute('data-c');
    if (c === 'w-photo') {
      var W = SHO.W, file = el.files && el.files[0];
      if (!W || !file) return;
      W.busy = true; SHO.render();
      SHO.compress(file).then(function (data) { var id = 'p' + SHO.uid(); return SHO.putPhoto(id, data).then(function () { W.photos.push(id); }); })
        .catch(function () { SHO.toast(L('Photo nahi khuli, dobara try karo', 'फ़ोटो नहीं खुली, दोबारा कोशिश करें')); })
        .then(function () { W.busy = false; SHO.render(); });
      return;
    }
    if (c === 'restore') {
      var f = el.files && el.files[0]; if (!f) return;
      var fr = new FileReader();
      fr.onload = function () {
        try {
          var data = JSON.parse(fr.result);
          if (!data || data.app !== 'smart-house-owner' || !data.state) throw new Error('bad');
          if (!confirm(L('Backup se data wapas laayein? Abhi ka data badal jayega.', 'बैकअप से डेटा वापस लाएँ? अभी का डेटा बदल जाएगा।'))) return;
          SHO.clearPhotos().then(function () {
            var ps = data.photos || {};
            return Promise.all(Object.keys(ps).map(function (id) { return SHO.putPhoto(id, ps[id]); }));
          }).then(function () { SHO.replaceState(data.state); go('#/home'); SHO.toast(L('Backup wapas aa gaya', 'बैकअप वापस आ गया')); });
        } catch (err) { SHO.toast(L('Ye sahi backup file nahi hai', 'यह सही बैकअप फ़ाइल नहीं है')); }
      };
      fr.readAsText(f);
      return;
    }
    var cf = el.closest && el.closest('form[data-calc]'); if (cf) SHO.renderCalc(cf);
  });
  document.addEventListener('input', function (e) { var cf = e.target.closest && e.target.closest('form[data-calc]'); if (cf) SHO.renderCalc(cf); });

  /* ---------- PWA ---------- */
  window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); SHO.installEvt = e; var r = parse(); if (r.name === 'home' || r.name === 'more') SHO.render(); });
  window.addEventListener('appinstalled', function () { SHO.installEvt = null; });

  function notifyDue(force) {
    try {
      if (!('Notification' in window) || Notification.permission !== 'granted') return;
      var today = SHO.today();
      if (!force && SHO.S.notifiedOn === today) return;
      var due = SHO.S.reminders.filter(function (r) { return !r.done && r.date <= today; });
      if (!due.length) return;
      SHO.S.notifiedOn = today; SHO.save();
      var title = L('Aaj ka kaam: ', 'आज का काम: ') + due.length;
      var body = due.slice(0, 3).map(function (r) { return '• ' + r.title; }).join('\n');
      var opts = { body: body, icon: 'icons/icon-192.png', badge: 'icons/icon-192.png', tag: 'sho-due' };
      if (navigator.serviceWorker && navigator.serviceWorker.ready) navigator.serviceWorker.ready.then(function (reg) { reg.showNotification(title, opts); }).catch(function () {});
      else new Notification(title, opts);
    } catch (e) {}
  }

  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () {}); });
  }
  if ('speechSynthesis' in window) { try { window.speechSynthesis.getVoices(); } catch (e) {} }

  SHO.render(true);
  setTimeout(function () { notifyDue(false); }, 1500);
})();
