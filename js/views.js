/* Smart House Owner – screens. Each view returns { title, back, body }. */
(function () {
  var SHO = window.SHO, C = window.SHO_CONTENT;
  var L = SHO.L, T = SHO.T, esc = SHO.esc, ic = SHO.ic;
  var V = SHO.V = {};

  function bullets(arr, icon, color) {
    return '<div class="stack-s">' + arr.map(function (x) {
      return '<div class="bullet">' + ic(icon || 'check', 18, color || '#8A6500', 2.4) + '<span>' + esc(x) + '</span></div>';
    }).join('') + '</div>';
  }
  function videoLinks(vs) {
    return '<div class="stack-s">' + vs.map(function (v) {
      return '<a class="list-item" href="' + esc(v.url) + '" target="_blank" rel="noopener"><span class="ic" style="background:#1B1F24;color:#F2B705">' + ic('play', 18) + '</span><span class="grow"><span class="bold" style="display:block">' + esc(T(v.title)) + '</span><span class="tiny muted">' + L('YouTube par dekho', 'YouTube पर देखें') + '</span></span>' + '<span class="chev">' + ic('chev', 18) + '</span></a>';
    }).join('') + '</div>';
  }
  function photoThumb(id, extra) {
    return '<div class="thumb"><img data-photo="' + esc(id) + '" alt="">' + (extra || '') + '</div>';
  }
  function engineerMini() {
    return '<div class="card dark stack"><div class="row"><div class="logo" style="width:44px;height:44px;border-radius:50%;color:#1B1F24;font-weight:800;font-family:Archivo,sans-serif">KA</div><div class="grow"><div class="bold">' + esc(T(SHO.ENG.name)) + '</div><div class="tiny muted">' + L('Civil Engineer · 10+ saal · Registered Valuer', 'सिविल इंजीनियर · 10+ साल · रजिस्टर्ड वैल्यूअर') + '</div></div></div>' +
      '<div class="fab-row"><a class="btn" href="#/engineer">' + ic('video', 18) + L('Engineer se baat karo', 'इंजीनियर से बात करें') + '</a></div></div>';
  }
  SHO.stageOptions = function (sel, withNone) {
    var h = withNone ? '<option value="">' + L('— Koi nahi —', '— कोई नहीं —') + '</option>' : '';
    return h + C.STAGES.map(function (s, i) { return '<option value="' + i + '"' + (String(sel) === String(i) ? ' selected' : '') + '>' + esc(T(s.name)) + '</option>'; }).join('');
  };

  /* ---------------- Setup ---------------- */
  V.setup = function () {
    var p = SHO.S.profile || {};
    return { title: L('Shuru karein', 'शुरू करें'), body:
      '<div class="card dark stack"><div class="eyebrow" style="color:#F2B705">Smart House Owner</div><h1>' + L('Engineer roz nahi aa sakta. Aap roz check kar sakte ho.', 'इंजीनियर रोज़ नहीं आ सकता। आप रोज़ जाँच कर सकते हैं।') + '</h1><p class="muted">' + L('Apne ghar ki thodi jaankari bharo. Sab kuch aapke phone me hi save rahega.', 'अपने घर की थोड़ी जानकारी भरें। सब कुछ आपके फ़ोन में ही सेव रहेगा।') + '</p></div>' +
      '<form class="card stack" data-f="profile">' +
      '<label class="f">' + L('Aapka naam', 'आपका नाम') + '<input class="in" name="name" required autocomplete="name" value="' + esc(p.name || '') + '"></label>' +
      '<label class="f">' + L('Ghar ka naam (jaise "Mera Ghar")', 'घर का नाम (जैसे "मेरा घर")') + '<input class="in" name="house" value="' + esc(p.house || '') + '"></label>' +
      '<label class="f">' + L('Shehar', 'शहर') + '<input class="in" name="city" autocomplete="address-level2" value="' + esc(p.city || '') + '"></label>' +
      '<div class="grid2"><label class="f">' + L('Kul budget (₹)', 'कुल बजट (₹)') + '<input class="in" name="budget" inputmode="numeric" value="' + esc(p.budget || '') + '"></label>' +
      '<label class="f">' + L('Kaam shuru (date)', 'काम शुरू (तारीख़)') + '<input class="in" type="date" name="start" value="' + esc(p.start || SHO.today()) + '"></label></div>' +
      '<label class="f">' + L('Abhi kis stage par hai?', 'अभी किस स्टेज पर है?') + '<select class="in" name="stage">' + SHO.stageOptions(p.stage != null ? p.stage : 0) + '</select></label>' +
      '<button class="btn block" type="submit">' + (SHO.S.profile ? L('Save karo', 'सेव करें') : L('App shuru karo', 'ऐप शुरू करें')) + '</button>' +
      '<p class="tiny muted">' + L('Ye app jaankari ke liye hai. Structure ki serious problem par engineer ki salah zaroor lein.', 'यह ऐप जानकारी के लिए है। ढाँचे की गंभीर समस्या पर इंजीनियर की सलाह ज़रूर लें।') + '</p></form>' };
  };

  /* ---------------- Home ---------------- */
  V.home = function () {
    var S = SHO.S, p = S.profile;
    var o = SHO.overall(), cur = SHO.currentStage(), cs = SHO.stageStat(cur);
    var flags = SHO.flags(), red = flags.filter(function (f) { return f.sev === 3; }).length;
    var spent = S.expenses.reduce(function (a, x) { return a + SHO.num(x.amount); }, 0);
    var budget = SHO.num(p.budget);
    var today = SHO.today();
    var due = S.reminders.filter(function (r) { return !r.done && r.date <= today; }).sort(function (a, b) { return a.date < b.date ? -1 : 1; });
    var h = '';
    h += '<div class="card dark stack"><div class="between"><div><div class="tiny muted">' + L('Namaste', 'नमस्ते') + ', ' + esc(p.name) + '</div><h1>' + esc(p.house || L('Mera Ghar', 'मेरा घर')) + '</h1>' + (p.city ? '<div class="small muted">' + esc(p.city) + '</div>' : '') + '</div>' +
      '<div style="text-align:right"><div class="display" style="font-size:30px;font-weight:800;color:#F2B705">' + o.pct + '%</div><div class="tiny muted">' + L('inspection hui', 'जाँच हुई') + '</div></div></div>' +
      '<div class="progress y"><div style="width:' + o.pct + '%"></div></div>' +
      '<div class="between"><div><div class="tiny muted">' + L('Abhi ka stage', 'अभी का स्टेज') + '</div><div class="bold">' + (cur + 1) + '. ' + esc(T(C.STAGES[cur].name)) + ' · ' + cs.ok + '/' + cs.n + '</div></div><a class="btn small" href="#/stage/' + cur + '">' + L('Check karo', 'जाँचें') + '</a></div></div>';

    if (SHO.installEvt) h += '<button class="btn dark block" data-a="install">' + ic('install', 20) + L('App phone me install karo', 'ऐप फ़ोन में इंस्टॉल करें') + '</button>';

    h += '<a class="card yellow stack" href="#/check/new" style="text-decoration:none;color:inherit"><div class="row"><div class="logo" style="background:#1B1F24;color:#F2B705;width:48px;height:48px;border-radius:12px">' + ic('camera', 26) + '</div><div class="grow"><h2>' + L('Photo se Problem Check', 'फ़ोटो से समस्या जाँच') + '</h2><div class="small" style="color:#3A2E00">' + L('Crack, seelan, tedha-pan? Photo lo, 4 sawal, turant jawab.', 'दरार, सीलन, टेढ़ापन? फ़ोटो लें, 4 सवाल, तुरंत जवाब।') + '</div></div>' + ic('chev', 20) + '</div></a>';

    h += '<div class="grid2">' +
      '<a class="stat' + (red ? ' r' : '') + '" href="#/flags" style="text-decoration:none;color:inherit"><div class="n">' + flags.length + '</div><div class="l">' + L('Red flags / dhyan do', 'रेड फ़्लैग / ध्यान दें') + '</div></a>' +
      '<a class="stat" href="#/check" style="text-decoration:none;color:inherit"><div class="n">' + S.photoChecks.length + '</div><div class="l">' + L('Photo checks', 'फ़ोटो जाँच') + '</div></a>' +
      '<a class="stat" href="#/money" style="text-decoration:none;color:inherit"><div class="n" style="font-size:20px">' + SHO.rupee(spent) + '</div><div class="l">' + (budget ? L('kharch, budget ', 'ख़र्च, बजट ') + SHO.rupee(budget) : L('ab tak kharch', 'अब तक ख़र्च')) + '</div></a>' +
      '<a class="stat' + (due.length ? ' r' : '') + '" href="#/reminders" style="text-decoration:none;color:inherit"><div class="n">' + due.length + '</div><div class="l">' + L('Aaj ke reminder', 'आज के रिमाइंडर') + '</div></a></div>';

    if (red) h += '<a class="notice r" href="#/flags" style="text-decoration:none;display:flex;gap:10px;align-items:center">' + ic('alert', 20) + '<span class="grow">' + L(red + ' red flag hain. Agla kaam shuru karne se pehle dekho.', red + ' रेड फ़्लैग हैं। अगला काम शुरू करने से पहले देखें।') + '</span>' + ic('chev', 18) + '</a>';

    if (due.length) {
      h += '<div class="card stack"><div class="between"><h3>' + L('Aaj karna hai', 'आज करना है') + '</h3><a class="small" href="#/reminders">' + L('Sab dekho', 'सब देखें') + '</a></div>' +
        due.slice(0, 4).map(function (r) {
          var late = SHO.daysBetween(r.date, today);
          return '<div class="row" style="padding:6px 0;border-bottom:1px solid #EEECE6"><div class="grow"><div class="bold small">' + esc(r.title) + '</div><div class="tiny ' + (late > 0 ? '' : 'muted') + '" style="' + (late > 0 ? 'color:#B42318' : '') + '">' + (late > 0 ? L(late + ' din late', late + ' दिन देर') : L('Aaj', 'आज')) + '</div></div><button class="btn small green" data-a="rem-done" data-id="' + r.id + '">' + ic('check', 16) + L('Ho gaya', 'हो गया') + '</button></div>';
        }).join('') + '</div>';
    }

    h += '<div class="stack-s"><h3>' + L('Tools', 'टूल्स') + '</h3><div class="grid3">' +
      tile('#/calc', 'calc', L('Material calculator', 'मटेरियल कैलकुलेटर')) +
      tile('#/diary', 'image', L('Photo diary', 'फ़ोटो डायरी')) +
      tile('#/log', 'note', L('Roz ka kaam', 'रोज़ का काम')) +
      tile('#/quality', 'shield', L('Material quality', 'मटेरियल क्वालिटी')) +
      tile('#/learn', 'book', L('Aam galtiyan', 'आम ग़लतियाँ')) +
      tile('#/report', 'report', L('House health card', 'हाउस हेल्थ कार्ड')) +
      '</div></div>';
    h += engineerMini();
    return { title: 'Smart House Owner', body: h };
  };
  function tile(href, icon, t) { return '<a class="tile" href="' + href + '"><span class="ic">' + ic(icon, 20) + '</span><span class="t">' + esc(t) + '</span></a>'; }

  /* ---------------- Stages ---------------- */
  V.stages = function () {
    var o = SHO.overall();
    var h = '<div class="card stack"><div class="between"><h2>' + L('Stage-wise checklist', 'स्टेज-वार चेकलिस्ट') + '</h2><span class="chip">' + o.ok + '/' + o.tot + ' ' + L('sahi', 'सही') + '</span></div><div class="progress"><div style="width:' + Math.round(o.ok / o.tot * 100) + '%"></div></div><p class="small muted">' + L('Stage par tap karo, har point ko Sahi ya Galat mark karo.', 'स्टेज पर टैप करें, हर पॉइंट को सही या ग़लत मार्क करें।') + '</p></div>';
    h += '<div class="card"><div class="list">' + C.STAGES.map(function (s, i) {
      var st = SHO.stageStat(i);
      var badge = st.done ? '<span class="chip g">' + ic('check', 14) + L('Poora', 'पूरा') + '</span>' : st.bad ? '<span class="chip r">' + st.bad + ' ' + L('galat', 'ग़लत') + '</span>' : st.ok ? '<span class="chip y">' + st.ok + '/' + st.n + '</span>' : '';
      return '<a class="list-item" href="#/stage/' + i + '"><span class="ic display bold">' + (i + 1) + '</span><span class="grow stack-s" style="gap:6px"><span class="between"><span class="bold">' + esc(T(s.name)) + '</span>' + badge + '</span><span class="progress' + (st.bad ? ' r' : '') + '"><span style="display:block;height:100%;width:' + st.pct + '%;background:' + (st.bad ? '#B42318' : '#1E7B3A') + '"></span></span></span><span class="chev">' + ic('chev', 18) + '</span></a>';
    }).join('') + '</div></div>';
    return { title: L('Checklist', 'चेकलिस्ट'), body: h };
  };

  V.stage = function (args) {
    var i = Math.max(0, Math.min(C.STAGES.length - 1, parseInt(args[0], 10) || 0));
    var s = C.STAGES[i], st = SHO.stageStat(i), S = SHO.S;
    var h = '<div class="card stack"><div class="between"><div><div class="tiny muted">' + L('Stage ' + (i + 1) + ' / 10', 'स्टेज ' + (i + 1) + ' / 10') + '</div><h1>' + esc(T(s.name)) + '</h1></div>' + (st.done ? '<span class="chip g">' + ic('check', 14) + L('Poora hua', 'पूरा हुआ') + '</span>' : '') + '</div><p class="muted small">' + esc(T(s.intro)) + '</p>' +
      '<div class="row small"><span><b style="color:#1E7B3A">' + st.ok + '</b> ' + L('sahi', 'सही') + '</span><span><b style="color:#B42318">' + st.bad + '</b> ' + L('galat', 'ग़लत') + '</span><span><b>' + st.left + '</b> ' + L('baaki', 'बाकी') + '</span></div><div class="progress' + (st.bad ? ' r' : '') + '"><div style="width:' + st.pct + '%"></div></div></div>';

    h += '<div class="card"><h3>' + L('Ye check karo', 'यह जाँचें') + '</h3>' + s.items.map(function (it, j) {
      var v = S.checks[i + '-' + j];
      return '<div class="check-row"><div>' + esc(T(it)) + '</div><div class="seg"><button class="ok' + (v === 'ok' ? ' on' : '') + '" aria-pressed="' + (v === 'ok') + '" data-a="mark" data-k="' + i + '-' + j + '" data-v="ok">' + ic('check', 16) + ' ' + L('Sahi', 'सही') + '</button><button class="bad' + (v === 'bad' ? ' on' : '') + '" aria-pressed="' + (v === 'bad') + '" data-a="mark" data-k="' + i + '-' + j + '" data-v="bad">' + ic('x', 16) + ' ' + L('Galat', 'ग़लत') + '</button></div></div>';
    }).join('') + '</div>';

    if (st.bad) h += '<div class="notice r stack-s"><div>' + L('Red flag: ' + st.bad + ' point galat hain. Agla kaam shuru karne se pehle theek karwao ya engineer se confirm karao.', 'रेड फ़्लैग: ' + st.bad + ' पॉइंट ग़लत हैं। अगला काम शुरू करने से पहले ठीक करवाएँ या इंजीनियर से पुष्टि करवाएँ।') + '</div><div class="fab-row"><a class="btn small red" href="#/engineer">' + L('Engineer bulao', 'इंजीनियर बुलाएँ') + '</a><a class="btn small ghost" href="#/check/new">' + L('Photo check', 'फ़ोटो जाँच') + '</a></div></div>';

    var photos = S.diary.filter(function (d) { return String(d.stage) === String(i); });
    h += '<div class="card stack"><div class="between"><h3>' + L('Is stage ki photos', 'इस स्टेज की फ़ोटो') + '</h3><span class="chip">' + photos.length + '</span></div>' +
      (photos.length ? '<div class="thumbs">' + photos.slice(0, 6).map(function (d) { return photoThumb(d.photo); }).join('') + '</div>' : '<p class="small muted">' + L('Plaster ya concrete se pehle sariya, pipe aur wiring ki photo zaroor lo.', 'प्लास्टर या कंक्रीट से पहले सरिया, पाइप और वायरिंग की फ़ोटो ज़रूर लें।') + '</p>') +
      '<a class="btn ghost" href="#/diary/add/' + i + '">' + ic('camera', 18) + L('Photo jodo', 'फ़ोटो जोड़ें') + '</a></div>';

    h += '<div class="card stack"><h3>' + L('Videos', 'वीडियो') + '</h3>' + videoLinks(s.videos) + '</div>';

    var askText = T(s.name) + ' – ' + L('Thekedar ji, ye bata dijiye:', 'ठेकेदार जी, यह बता दीजिए:') + '\n' + s.ask.map(function (q, k) { return (k + 1) + '. ' + T(q); }).join('\n');
    h += '<div class="card stack"><h3>' + L('Thekedar se poochho', 'ठेकेदार से पूछें') + '</h3>' + bullets(s.ask.map(T), 'help', '#1F4E79') +
      '<a class="btn ghost" href="' + esc(SHO.wa(askText)) + '" target="_blank" rel="noopener">' + ic('wa', 18) + L('WhatsApp par bhejo', 'WhatsApp पर भेजें') + '</a></div>';

    h += '<form class="card stack" data-f="stage-note" data-i="' + i + '"><label class="f">' + L('Note (jaise sariya ka size, mistri ne kya kaha)', 'नोट (जैसे सरिया का साइज़, मिस्त्री ने क्या कहा)') + '<textarea class="in" name="note">' + esc(S.stageNotes[i] || '') + '</textarea></label><button class="btn ghost" type="submit">' + L('Note save karo', 'नोट सेव करें') + '</button></form>';

    if (!st.done) h += '<button class="btn green block" data-a="stage-done" data-i="' + i + '">' + ic('check', 20) + L('Ye stage poora hua', 'यह स्टेज पूरा हुआ') + '</button>';
    else h += '<button class="btn ghost block" data-a="stage-undo" data-i="' + i + '">' + L('Stage dobara khulo', 'स्टेज दोबारा खोलें') + '</button>';
    var nav = '<div class="fab-row">' + (i > 0 ? '<a class="btn ghost" href="#/stage/' + (i - 1) + '">← ' + esc(T(C.STAGES[i - 1].name)) + '</a>' : '') + (i < C.STAGES.length - 1 ? '<a class="btn ghost" href="#/stage/' + (i + 1) + '">' + esc(T(C.STAGES[i + 1].name)) + ' →</a>' : '') + '</div>';
    h += nav;
    return { title: T(s.name), back: '#/stages', body: h };
  };

  /* ---------------- Photo check ---------------- */
  V.check = function () {
    var S = SHO.S;
    var h = '<a class="card yellow stack" href="#/check/new" style="text-decoration:none;color:inherit"><div class="row"><div class="logo" style="background:#1B1F24;color:#F2B705;width:52px;height:52px;border-radius:14px">' + ic('camera', 28) + '</div><div class="grow"><h2>' + L('Nayi photo check', 'नई फ़ोटो जाँच') + '</h2><div class="small" style="color:#3A2E00">' + L('Photo → 4 sawal → jawab, videos aur engineer', 'फ़ोटो → 4 सवाल → जवाब, वीडियो और इंजीनियर') + '</div></div>' + ic('plus', 24) + '</div></a>';
    var list = S.photoChecks.slice().sort(function (a, b) { return a.created < b.created ? 1 : -1; });
    if (!list.length) {
      h += '<div class="card empty">' + ic('image', 40, '#9AA0A6', 1.6) + '<div>' + L('Abhi koi photo check nahi. Upar se pehla check karo.', 'अभी कोई फ़ोटो जाँच नहीं। ऊपर से पहली जाँच करें।') + '</div></div>';
    } else {
      h += '<div class="card"><h3 style="margin-bottom:4px">' + L('Pichhle checks', 'पिछली जाँच') + '</h3><div class="list">' + list.map(function (c) {
        var r = SHO.analyze(c.ans);
        return '<a class="list-item" href="#/check/view/' + c.id + '"><span class="ic" style="overflow:hidden;width:56px;height:56px">' + (c.photos && c.photos[0] ? '<img data-photo="' + esc(c.photos[0]) + '" alt="" style="width:100%;height:100%;object-fit:cover">' : ic('image', 22)) + '</span><span class="grow"><span class="bold" style="display:block">' + esc(r.title) + '</span><span class="row-wrap" style="margin-top:4px">' + SHO.sevChip(c.sev) + (c.resolved ? '<span class="chip g">' + L('Theek ho gaya', 'ठीक हो गया') + '</span>' : '') + (c.followOf ? '<span class="chip b">' + L('Follow-up', 'फ़ॉलो-अप') + '</span>' : '') + '</span><span class="tiny muted">' + SHO.fmtDate(c.date) + '</span></span><span class="chev">' + ic('chev', 18) + '</span></a>';
      }).join('') + '</div></div>';
    }
    h += '<div class="notice b small">' + L('Ye shuruaati andaza deta hai, final faisla nahi. Red flag par engineer se confirm karao.', 'यह शुरुआती अंदाज़ा देता है, अंतिम फ़ैसला नहीं। रेड फ़्लैग पर इंजीनियर से पुष्टि करवाएँ।') + '</div>';
    return { title: L('Photo check', 'फ़ोटो जाँच'), body: h };
  };

  V.checkNew = function () {
    var W = SHO.W;
    var parent = W.followOf ? SHO.S.photoChecks.filter(function (c) { return c.id === W.followOf; })[0] : null;
    var qs = SHO.questions(W.ans, !!parent);
    var total = qs.length + 1;
    var h = '';
    var stepNo = W.step + 1;
    h += '<div class="between"><span class="small muted">' + L('Step ' + stepNo + ' / ' + total, 'स्टेप ' + stepNo + ' / ' + total) + '</span>' + (parent ? '<span class="chip b">' + L('Follow-up photo', 'फ़ॉलो-अप फ़ोटो') + '</span>' : '') + '</div><div class="progress y"><div style="width:' + Math.round(stepNo / total * 100) + '%"></div></div>';
    if (W.step === 0) {
      h += '<div class="card stack"><h2>' + L('Problem ki photo daalo', 'समस्या की फ़ोटो डालें') + '</h2><p class="small muted">' + L('1 se 3 photo: ek paas se, ek door se. Crack ho to paas me sikka ya scale rakh kar photo lo.', '1 से 3 फ़ोटो: एक पास से, एक दूर से। दरार हो तो पास में सिक्का या स्केल रखकर फ़ोटो लें।') + '</p>' +
        (W.photos.length ? '<div class="thumbs">' + W.photos.map(function (id, k) { return photoThumb(id, '<button class="x" aria-label="' + L('Photo hatao', 'फ़ोटो हटाएँ') + '" data-a="w-del-photo" data-k="' + k + '">' + ic('x', 16) + '</button>'); }).join('') + '</div>' : '') +
        (W.photos.length < 3 ? '<div class="photo-drop">' + ic('camera', 34, '#8A8F96', 1.6) + '<span class="bold" style="color:#1B1F24">' + L('Photo lo ya gallery se chuno', 'फ़ोटो लें या गैलरी से चुनें') + '</span><span class="tiny">' + (3 - W.photos.length) + ' ' + L('aur daal sakte ho', 'और डाल सकते हैं') + '</span><input type="file" accept="image/*" data-c="w-photo" aria-label="' + L('Photo chuno', 'फ़ोटो चुनें') + '"></div>' : '') +
        '<div class="fab-row"><button class="btn" data-a="w-next"' + (W.busy ? ' disabled' : '') + '>' + (W.photos.length ? L('Aage badho', 'आगे बढ़ें') : L('Bina photo ke aage', 'बिना फ़ोटो के आगे')) + '</button></div></div>';
    } else {
      var q = qs[W.step - 1];
      h += '<div class="card stack"><h2>' + esc(T(q.q)) + '</h2>' + (q.hint ? '<p class="small muted">' + esc(T(q.hint)) + '</p>' : '');
      if (q.compare && parent) {
        h += '<div class="compare"><figure>' + (parent.photos[0] ? '<img data-photo="' + esc(parent.photos[0]) + '" alt="">' : '<div class="thumb"></div>') + '<figcaption>' + L('Pehle', 'पहले') + ' · ' + SHO.fmtDate(parent.date) + '</figcaption></figure><figure>' + (W.photos[0] ? '<img data-photo="' + esc(W.photos[0]) + '" alt="">' : '<div class="thumb"></div>') + '<figcaption>' + L('Ab', 'अब') + ' · ' + SHO.fmtDate(SHO.today()) + '</figcaption></figure></div>';
      }
      h += '<div class="opt-grid">' + q.opts.map(function (o) {
        var on = W.ans[q.key] === o[0];
        return '<button class="opt' + (on ? ' on' : '') + '" aria-pressed="' + on + '" data-a="w-ans" data-k="' + q.key + '" data-v="' + o[0] + '">' + esc(T(o[1])) + (o[2] ? '<small>' + esc(T(o[2])) + '</small>' : '') + '</button>';
      }).join('') + '</div><button class="link-btn" data-a="w-back">← ' + L('Peeche', 'पीछे') + '</button></div>';
    }
    return { title: L('Nayi photo check', 'नई फ़ोटो जाँच'), back: '#/check', body: h };
  };

  V.checkView = function (args) {
    var c = SHO.S.photoChecks.filter(function (x) { return x.id === args[0]; })[0];
    if (!c) return { title: L('Photo check', 'फ़ोटो जाँच'), back: '#/check', body: '<div class="card empty">' + L('Ye check nahi mila.', 'यह जाँच नहीं मिली।') + '</div>' };
    var r = SHO.analyze(c.ans);
    var parent = c.followOf ? SHO.S.photoChecks.filter(function (x) { return x.id === c.followOf; })[0] : null;
    var h = '';
    if (parent && parent.photos[0] && c.photos[0]) {
      h += '<div class="card stack"><h3>' + L('Pehle vs ab', 'पहले बनाम अब') + '</h3><div class="compare"><figure><img data-photo="' + esc(parent.photos[0]) + '" alt=""><figcaption>' + SHO.fmtDate(parent.date) + '</figcaption></figure><figure><img data-photo="' + esc(c.photos[0]) + '" alt=""><figcaption>' + SHO.fmtDate(c.date) + '</figcaption></figure></div></div>';
    } else if (c.photos.length) {
      h += '<img class="hero-photo" data-photo="' + esc(c.photos[0]) + '" alt="">' + (c.photos.length > 1 ? '<div class="thumbs">' + c.photos.slice(1).map(function (id) { return photoThumb(id); }).join('') + '</div>' : '');
    }
    var chips = [['part', SHO.PARTS], ['stage', SHO.STAGEQ], ['prob', SHO.PROBS], ['width', SHO.WIDTHS], ['since', SHO.SINCE], ['trend', SHO.TREND]].filter(function (x) { return c.ans[x[0]]; }).map(function (x) { return '<span class="chip">' + esc(SHO.optLabel(x[1], c.ans[x[0]])) + '</span>'; }).join('');
    h += '<div class="card stack"><div class="between"><h2>' + esc(r.title) + '</h2>' + SHO.sevChip(c.sev) + '</div><div class="row-wrap">' + chips + '</div><p>' + esc(r.desc) + '</p>' +
      (r.notes.length ? '<div class="notice y small">' + r.notes.map(esc).join('<br>') + '</div>' : '') +
      (c.sev === 3 ? '<div class="notice r">' + L('Red flag: is hisse ka kaam abhi rukwao aur engineer se dikhwao.', 'रेड फ़्लैग: इस हिस्से का काम अभी रुकवाएँ और इंजीनियर को दिखाएँ।') + '</div>' : '') +
      '<div class="fab-row"><button class="btn ghost small" data-a="speak" data-id="' + c.id + '">' + ic('speaker', 18) + L('Bolkar suno', 'बोलकर सुनें') + '</button></div></div>';
    h += '<div class="card stack"><h3>' + L('Kyun hua ho sakta hai', 'क्यों हुआ हो सकता है') + '</h3>' + bullets(r.cause, 'help', '#545B63') + '</div>';
    h += '<div class="card stack"><h3>' + L('Ye check karo', 'यह जाँचें') + '</h3>' + bullets(r.checks) + '</div>';
    h += '<div class="card stack"><h3>' + L('Theek kaise hoga', 'ठीक कैसे होगा') + '</h3>' + bullets(r.repair, 'check', '#1E7B3A') + '<h3>' + L('Kya na karein', 'क्या न करें') + '</h3>' + bullets([r.dont], 'x', '#B42318') + '</div>';
    h += '<div class="card stack"><h3>' + L('Related videos', 'संबंधित वीडियो') + '</h3>' + videoLinks(r.videos) +
      '<form class="stack-s" data-f="yt"><label class="f">' + L('YouTube par turant dhundho', 'YouTube पर तुरंत खोजें') + '<input class="in" name="q" value="' + esc(r.query) + '"></label><button class="btn dark" type="submit">' + ic('search', 18) + L('YouTube par dhundho', 'YouTube पर खोजें') + '</button></form></div>';
    h += '<div class="card stack"><h3>' + L('Aage kya karein', 'आगे क्या करें') + '</h3>' +
      '<button class="btn green block" data-a="share-thekedar" data-id="' + c.id + '">' + ic('wa', 18) + L('Thekedar ko bhejo', 'ठेकेदार को भेजें') + '</button>' +
      '<button class="btn blue block" data-a="share-eng" data-id="' + c.id + '">' + ic('hard', 18) + L('Engineer se confirm karao', 'इंजीनियर से पुष्टि करवाएँ') + '</button>' +
      '<div class="fab-row"><button class="btn ghost" data-a="check-remind" data-id="' + c.id + '">' + ic('bell', 18) + L('7 din ka reminder', '7 दिन का रिमाइंडर') + '</button><button class="btn ghost" data-a="check-follow" data-id="' + c.id + '">' + ic('refresh', 18) + L('Nayi photo se tulna', 'नई फ़ोटो से तुलना') + '</button></div>' +
      '<div class="fab-row"><button class="btn ghost" data-a="check-resolve" data-id="' + c.id + '">' + (c.resolved ? L('Dobara khulo', 'दोबारा खोलें') : ic('check', 18) + L('Theek ho gaya', 'ठीक हो गया')) + '</button><button class="btn ghost" data-a="check-del" data-id="' + c.id + '" style="color:#B42318">' + ic('trash', 18) + L('Hatao', 'हटाएँ') + '</button></div></div>';
    h += '<p class="tiny muted">' + L('Ye jawab aapke chune jawabon par aadharit andaza hai. Final faisla engineer ki jaanch se lein.', 'यह जवाब आपके चुने जवाबों पर आधारित अंदाज़ा है। अंतिम फ़ैसला इंजीनियर की जाँच से लें।') + '</p>';
    return { title: r.title, back: '#/check', body: h };
  };

  /* ---------------- Red flags ---------------- */
  V.flags = function () {
    var f = SHO.flags();
    var h = '<div class="card stack"><h2>' + L('Red flags', 'रेड फ़्लैग') + '</h2><p class="small muted">' + L('Checklist me Galat mark hue points aur Photo check ki problems, jo abhi theek nahi hui.', 'चेकलिस्ट में ग़लत मार्क हुए पॉइंट और फ़ोटो जाँच की समस्याएँ, जो अभी ठीक नहीं हुईं।') + '</p></div>';
    if (!f.length) return { title: L('Red flags', 'रेड फ़्लैग'), back: '#/home', body: h + '<div class="card empty">' + ic('shield', 40, '#1E7B3A', 1.6) + '<div class="bold" style="color:#1E7B3A">' + L('Koi red flag nahi. Badhiya!', 'कोई रेड फ़्लैग नहीं। बढ़िया!') + '</div></div>' };
    h += '<div class="card"><div class="list">' + f.map(function (x) {
      var href = x.kind === 'check' ? '#/stage/' + x.stage : '#/check/view/' + x.id;
      var act = x.kind === 'check' ? '<button class="btn small green" data-a="mark" data-k="' + x.key + '" data-v="ok">' + L('Theek hua', 'ठीक हुआ') + '</button>' : '<button class="btn small green" data-a="check-resolve" data-id="' + x.id + '">' + L('Theek hua', 'ठीक हुआ') + '</button>';
      return '<div class="list-item"><span class="dot" style="width:12px;height:12px;background:' + (x.sev === 3 ? '#B42318' : '#E0A800') + '"></span><a class="grow" href="' + href + '" style="text-decoration:none;color:inherit"><span class="bold" style="display:block">' + esc(x.title) + '</span><span class="tiny muted">' + esc(x.sub) + ' · ' + (x.kind === 'check' ? L('Checklist', 'चेकलिस्ट') : L('Photo check', 'फ़ोटो जाँच')) + '</span></a>' + act + '</div>';
    }).join('') + '</div></div>';
    h += '<a class="btn red block" href="#/engineer">' + ic('hard', 18) + L('Engineer se dikhwao', 'इंजीनियर को दिखाएँ') + '</a>';
    return { title: L('Red flags', 'रेड फ़्लैग'), back: '#/home', body: h };
  };

  /* ---------------- Engineer ---------------- */
  V.engineer = function () {
    var E = SHO.ENG, p = SHO.S.profile || {};
    var who = (p.name ? p.name : '') + (p.city ? ', ' + p.city : '');
    var vMsg = L('Namaste Kunal ji, main ' + who + ' se. Mujhe ghar ki inspection ke liye video call book karni hai.', 'नमस्ते कुणाल जी, मैं ' + who + ' से। मुझे घर की जाँच के लिए वीडियो कॉल बुक करनी है।');
    var sMsg = L('Namaste Kunal ji, main ' + who + ' se. Mujhe ghar ki site visit book karni hai. Mera pata: ', 'नमस्ते कुणाल जी, मैं ' + who + ' से। मुझे घर की साइट विज़िट बुक करनी है। मेरा पता: ');
    var h = '<div class="card dark stack"><div class="row"><div class="logo" style="width:64px;height:64px;border-radius:50%;color:#1B1F24;font-weight:800;font-size:22px;font-family:Archivo,sans-serif">KA</div><div class="grow"><div class="eyebrow" style="color:#F2B705">' + L('Aapke engineer', 'आपके इंजीनियर') + '</div><h2>' + esc(T(E.name)) + '</h2><div class="small muted">' + esc(E.firm) + '</div></div></div><div class="row-wrap">' + E.creds.map(function (c) { return '<span class="chip" style="background:#2A2F35;color:#fff;border-color:#4A4F55">' + esc(T(c)) + '</span>'; }).join('') + '</div></div>';
    h += '<div class="card stack"><h3>' + L('Video call par baat', 'वीडियो कॉल पर बात') + '</h3><p class="small muted">' + L('Photos aur sawal bhejo, video call par site dikhao. Kahin se bhi.', 'फ़ोटो और सवाल भेजें, वीडियो कॉल पर साइट दिखाएँ। कहीं से भी।') + '</p><a class="btn green" href="' + esc(SHO.wa(vMsg, E.phone)) + '" target="_blank" rel="noopener">' + ic('video', 18) + L('Video call book karo', 'वीडियो कॉल बुक करें') + '</a></div>';
    h += '<div class="card stack"><h3>' + L('Site visit', 'साइट विज़िट') + '</h3><p class="small muted">' + L('Engineer khud site par aakar jaanch karenge. Pata aur suvidha ka samay bhejo.', 'इंजीनियर ख़ुद साइट पर आकर जाँच करेंगे। पता और सुविधा का समय भेजें।') + '</p><a class="btn" href="' + esc(SHO.wa(sMsg, E.phone)) + '" target="_blank" rel="noopener">' + ic('home', 18) + L('Site visit book karo', 'साइट विज़िट बुक करें') + '</a></div>';
    h += '<div class="card stack"><h3>' + L('Apne ghar ki report bhejo', 'अपने घर की रिपोर्ट भेजें') + '</h3><p class="small muted">' + L('Checklist, red flags aur kharch ka summary ek message me.', 'चेकलिस्ट, रेड फ़्लैग और ख़र्च का सारांश एक मैसेज में।') + '</p><button class="btn blue" data-a="send-summary">' + ic('report', 18) + L('Summary WhatsApp karo', 'सारांश WhatsApp करें') + '</button></div>';
    h += '<div class="fab-row"><a class="btn ghost" href="tel:+' + E.phone + '">' + ic('phone', 18) + E.phoneShow + '</a><a class="btn ghost" href="mailto:' + E.email + '">' + ic('mail', 18) + 'Email</a></div>';
    h += '<p class="tiny muted">' + L('Video call aur site visit ki fees engineer se baat karke tay hogi.', 'वीडियो कॉल और साइट विज़िट की फ़ीस इंजीनियर से बात करके तय होगी।') + '</p>';
    return { title: L('Engineer', 'इंजीनियर'), back: '#/home', body: h };
  };

  /* ---------------- Money ---------------- */
  V.money = function (args) {
    var tab = args[0] || 'kharch', S = SHO.S;
    var spent = S.expenses.reduce(function (a, x) { return a + SHO.num(x.amount); }, 0);
    var budget = SHO.num(S.profile.budget);
    var pct = budget ? Math.min(100, Math.round(spent / budget * 100)) : 0;
    var h = '<div class="card stack"><div class="between"><div><div class="tiny muted">' + L('Ab tak kharch', 'अब तक ख़र्च') + '</div><div class="money" style="font-size:28px">' + SHO.rupee(spent) + '</div></div>' + (budget ? '<div style="text-align:right"><div class="tiny muted">' + L('Budget', 'बजट') + '</div><div class="bold">' + SHO.rupee(budget) + '</div></div>' : '<a class="small" href="#/settings">' + L('Budget daalo', 'बजट डालें') + '</a>') + '</div>' +
      (budget ? '<div class="progress' + (spent > budget ? ' r' : pct > 85 ? ' y' : '') + '"><div style="width:' + pct + '%"></div></div><div class="small ' + (spent > budget ? '' : 'muted') + '" style="' + (spent > budget ? 'color:#B42318;font-weight:600' : '') + '">' + (spent > budget ? L('Budget se ' + SHO.rupee(spent - budget) + ' zyada', 'बजट से ' + SHO.rupee(spent - budget) + ' ज़्यादा') : L(SHO.rupee(budget - spent) + ' bacha hai', SHO.rupee(budget - spent) + ' बचा है')) + '</div>' : '') + '</div>';
    h += '<div class="tabs" role="tablist"><a href="#/money/kharch" class="' + (tab === 'kharch' ? 'on' : '') + '">' + L('Kharch', 'ख़र्च') + '</a><a href="#/money/pay" class="' + (tab === 'pay' ? 'on' : '') + '">' + L('Thekedar payment', 'ठेकेदार पेमेंट') + '</a></div>';

    if (tab === 'pay') {
      h += '<form class="card stack" data-f="payment"><h3>' + L('Naya payment milestone', 'नया पेमेंट माइलस्टोन') + '</h3>' +
        '<label class="f">' + L('Thekedar / kaam karne wala', 'ठेकेदार / काम करने वाला') + '<input class="in" name="who" required></label>' +
        '<div class="grid2"><label class="f">' + L('Kis stage ka', 'किस स्टेज का') + '<select class="in" name="stage">' + SHO.stageOptions('', true) + '</select></label><label class="f">' + L('Rakam (₹)', 'रकम (₹)') + '<input class="in" name="amount" inputmode="numeric" required></label></div>' +
        '<label class="row small" style="gap:10px"><input type="checkbox" name="gate" checked style="width:22px;height:22px"> ' + L('Inspection pass hone par hi payment', 'जाँच पास होने पर ही पेमेंट') + '</label>' +
        '<button class="btn" type="submit">' + ic('plus', 18) + L('Jodo', 'जोड़ें') + '</button></form>';
      var pays = S.payments.slice().sort(function (a, b) { return (a.status === 'paid') - (b.status === 'paid'); });
      if (!pays.length) h += '<div class="card empty">' + L('Stage ke hisaab se payment likho. Inspection pass hone par hi agla payment karo.', 'स्टेज के हिसाब से पेमेंट लिखें। जाँच पास होने पर ही अगला पेमेंट करें।') + '</div>';
      else h += '<div class="card"><div class="list">' + pays.map(function (p) {
        var gateTxt = '', ok = true;
        if (p.status !== 'paid' && p.gate && p.stage !== '' && p.stage != null) {
          var st = SHO.stageStat(+p.stage);
          ok = st.pass;
          gateTxt = ok ? '<span class="chip g">' + ic('check', 14) + L('Inspection pass', 'जाँच पास') + '</span>' : '<span class="chip r">' + L('Inspection baaki', 'जाँच बाकी') + ' (' + st.ok + '/' + st.n + ')</span>';
        }
        return '<div class="list-item" style="align-items:flex-start"><div class="grow stack-s" style="gap:4px"><div class="between"><span class="bold">' + esc(p.who) + '</span><span class="amount-r">' + SHO.rupee(p.amount) + '</span></div><span class="tiny muted">' + (p.stage !== '' && p.stage != null ? esc(T(C.STAGES[+p.stage].name)) : L('Bina stage', 'बिना स्टेज')) + (p.status === 'paid' ? ' · ' + L('Diya', 'दिया') + ' ' + SHO.fmtDate(p.paidDate) : '') + '</span><div class="row-wrap">' + (p.status === 'paid' ? '<span class="chip g">' + L('Payment ho gaya', 'पेमेंट हो गया') + '</span>' : gateTxt) + '</div>' +
          (p.status !== 'paid' ? '<div class="fab-row"><button class="btn small ' + (ok ? 'green' : 'ghost') + '" data-a="pay-done" data-id="' + p.id + '">' + (ok ? L('Payment kiya', 'पेमेंट किया') : L('Fir bhi payment kiya', 'फिर भी पेमेंट किया')) + '</button><button class="btn small ghost" data-a="pay-del" data-id="' + p.id + '" aria-label="' + L('Hatao', 'हटाएँ') + '">' + ic('trash', 16) + '</button></div>' : '') + '</div></div>';
      }).join('') + '</div></div>';
      return { title: L('Hisaab', 'हिसाब'), body: h };
    }

    var cats = C.EXP_CATS;
    h += '<form class="card stack" data-f="expense"><h3>' + L('Naya kharch', 'नया ख़र्च') + '</h3><div class="grid2"><label class="f">' + L('Rakam (₹)', 'रकम (₹)') + '<input class="in" name="amount" inputmode="numeric" required></label><label class="f">' + L('Date', 'तारीख़') + '<input class="in" type="date" name="date" value="' + SHO.today() + '"></label></div>' +
      '<label class="f">' + L('Kis cheez ka', 'किस चीज़ का') + '<select class="in" name="cat">' + cats.map(function (c) { return '<option value="' + c[0] + '">' + esc(T(c[1])) + '</option>'; }).join('') + '</select></label>' +
      '<label class="f">' + L('Note (jaise 50 bori cement)', 'नोट (जैसे 50 बोरी सीमेंट)') + '<input class="in" name="note"></label>' +
      '<label class="f">' + L('Bill ki photo (optional)', 'बिल की फ़ोटो (वैकल्पिक)') + '<input class="in" type="file" name="photo" accept="image/*"></label>' +
      '<button class="btn" type="submit">' + ic('plus', 18) + L('Kharch jodo', 'ख़र्च जोड़ें') + '</button></form>';
    if (S.expenses.length) {
      var byCat = {};
      S.expenses.forEach(function (x) { byCat[x.cat] = (byCat[x.cat] || 0) + SHO.num(x.amount); });
      h += '<div class="card stack"><h3>' + L('Kahan kitna gaya', 'कहाँ कितना गया') + '</h3>' + cats.filter(function (c) { return byCat[c[0]]; }).map(function (c) {
        var v = byCat[c[0]], w = Math.round(v / spent * 100);
        return '<div class="stack-s" style="gap:4px"><div class="between small"><span>' + esc(T(c[1])) + '</span><span class="bold">' + SHO.rupee(v) + ' · ' + w + '%</span></div><div class="progress y"><div style="width:' + w + '%"></div></div></div>';
      }).join('') + '</div>';
      var list = S.expenses.slice().sort(function (a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : (a.created < b.created ? 1 : -1); });
      h += '<div class="card"><h3>' + L('Saare kharch', 'सभी ख़र्च') + '</h3><div class="list">' + list.map(function (x) {
        var cn = ''; cats.forEach(function (c) { if (c[0] === x.cat) cn = T(c[1]); });
        return '<div class="list-item">' + (x.photo ? '<span class="ic" style="overflow:hidden"><img data-photo="' + esc(x.photo) + '" alt="" style="width:100%;height:100%;object-fit:cover"></span>' : '<span class="ic">' + ic('rupee', 18) + '</span>') + '<span class="grow"><span class="bold" style="display:block">' + esc(x.note || cn) + '</span><span class="tiny muted">' + esc(cn) + ' · ' + SHO.fmtDate(x.date) + '</span></span><span class="amount-r">' + SHO.rupee(x.amount) + '</span><button class="icon-btn" data-a="exp-del" data-id="' + x.id + '" aria-label="' + L('Hatao', 'हटाएँ') + '" style="color:#9AA0A6">' + ic('trash', 18) + '</button></div>';
      }).join('') + '</div></div>';
    }
    return { title: L('Hisaab', 'हिसाब'), body: h };
  };

  /* ---------------- Calculator ---------------- */
  V.calc = function (args) {
    var tab = args[0] || 'concrete';
    var tabs = [['concrete', L('Concrete', 'कंक्रीट')], ['brick', L('Eent', 'ईंट')], ['plaster', L('Plaster', 'प्लास्टर')], ['steel', L('Sariya', 'सरिया')]];
    var h = '<div class="tabs">' + tabs.map(function (t) { return '<a href="#/calc/' + t[0] + '" class="' + (tab === t[0] ? 'on' : '') + '">' + t[1] + '</a>'; }).join('') + '</div>';
    var unitSel = '<label class="f">' + L('Naap ki unit', 'नाप की इकाई') + '<select class="in" name="unit"><option value="ft">' + L('Feet', 'फ़ीट') + '</option><option value="m">' + L('Metre', 'मीटर') + '</option></select></label>';
    h += '<form class="card stack" data-calc="' + tab + '" onsubmit="return false">';
    if (tab === 'concrete') {
      h += '<h3>' + L('Slab / beam / column / footing ka concrete', 'स्लैब / बीम / कॉलम / फ़ुटिंग का कंक्रीट') + '</h3>' + unitSel +
        '<div class="grid3"><label class="f">' + L('Lambai', 'लंबाई') + '<input class="in" name="l" inputmode="decimal" value="20"></label><label class="f">' + L('Chaudai', 'चौड़ाई') + '<input class="in" name="w" inputmode="decimal" value="15"></label><label class="f">' + L('Motai', 'मोटाई') + '<input class="in" name="t" inputmode="decimal" value="0.42"></label></div>' +
        '<div class="grid2"><label class="f">' + L('Mix', 'मिक्स') + '<select class="in" name="mix"><option value="M20">M20 (1:1.5:3)</option><option value="M15">M15 (1:2:4)</option><option value="M10">M10 (1:3:6)</option></select></label><label class="f">' + L('Kitne nag', 'कितने नग') + '<input class="in" name="n" inputmode="numeric" value="1"></label></div>' +
        '<p class="tiny muted">' + L('5 inch slab = 0.42 ft. Column ke liye: lambai × chaudai × oonchai aur nag.', '5 इंच स्लैब = 0.42 फ़ीट। कॉलम के लिए: लंबाई × चौड़ाई × ऊँचाई और नग।') + '</p>';
    } else if (tab === 'brick') {
      h += '<h3>' + L('Deewar ki eent aur masala', 'दीवार की ईंट और मसाला') + '</h3>' + unitSel +
        '<div class="grid2"><label class="f">' + L('Deewar ki lambai', 'दीवार की लंबाई') + '<input class="in" name="l" inputmode="decimal" value="10"></label><label class="f">' + L('Oonchai', 'ऊँचाई') + '<input class="in" name="h" inputmode="decimal" value="10"></label></div>' +
        '<div class="grid2"><label class="f">' + L('Deewar', 'दीवार') + '<select class="in" name="th"><option value="9">9 inch</option><option value="4.5">4.5 inch</option></select></label><label class="f">' + L('Masala mix', 'मसाला मिक्स') + '<select class="in" name="r"><option value="6">1:6</option><option value="4">1:4</option><option value="5">1:5</option></select></label></div>' +
        '<p class="tiny muted">' + L('Darwaze-khidki ki jagah ghata kar lambai daalo.', 'दरवाज़े-खिड़की की जगह घटाकर लंबाई डालें।') + '</p>';
    } else if (tab === 'plaster') {
      h += '<h3>' + L('Plaster ka cement aur ret', 'प्लास्टर का सीमेंट और रेत') + '</h3>' + unitSel +
        '<div class="grid2"><label class="f">' + L('Lambai', 'लंबाई') + '<input class="in" name="l" inputmode="decimal" value="10"></label><label class="f">' + L('Oonchai', 'ऊँचाई') + '<input class="in" name="h" inputmode="decimal" value="10"></label></div>' +
        '<div class="grid2"><label class="f">' + L('Motai', 'मोटाई') + '<select class="in" name="mm"><option value="12">12 mm (' + L('andar', 'अंदर') + ')</option><option value="20">20 mm (' + L('bahar', 'बाहर') + ')</option><option value="15">15 mm</option></select></label><label class="f">' + L('Mix', 'मिक्स') + '<select class="in" name="r"><option value="4">1:4</option><option value="6">1:6</option><option value="3">1:3</option></select></label></div>';
    } else {
      h += '<h3>' + L('Sariya ka andaza', 'सरिया का अंदाज़ा') + '</h3><div class="grid2"><label class="f">' + L('Kahan', 'कहाँ') + '<select class="in" name="el"><option value="slab">' + L('Slab', 'स्लैब') + '</option><option value="beam">' + L('Beam', 'बीम') + '</option><option value="column">' + L('Column', 'कॉलम') + '</option><option value="footing">' + L('Footing', 'फ़ुटिंग') + '</option></select></label><label class="f">' + L('Concrete (cu.ft)', 'कंक्रीट (घन फ़ीट)') + '<input class="in" name="cft" inputmode="decimal" value="126"></label></div>' +
        '<h3 style="margin-top:6px">' + L('Sariya ka vazan check', 'सरिया का वज़न जाँच') + '</h3><div class="grid2"><label class="f">' + L('Sariya (mm)', 'सरिया (मिमी)') + '<select class="in" name="d"><option>8</option><option>10</option><option selected>12</option><option>16</option><option>20</option><option>25</option></select></label><label class="f">' + L('Lambai (metre)', 'लंबाई (मीटर)') + '<input class="in" name="len" inputmode="decimal" value="12"></label></div>';
    }
    h += '<div id="calc-out" class="stack-s"></div></form>';
    h += '<p class="tiny muted">' + L('Ye thumb rule wala andaza hai (5% wastage ke saath). Final quantity engineer ki drawing / BOQ se lein.', 'यह थंब रूल वाला अंदाज़ा है (5% बर्बादी के साथ)। अंतिम मात्रा इंजीनियर की ड्रॉइंग / BOQ से लें।') + '</p>';
    return { title: L('Material calculator', 'मटेरियल कैलकुलेटर'), back: '#/more', body: h };
  };
  SHO.renderCalc = function (form) {
    var out = form.querySelector('#calc-out'); if (!out) return;
    var g = function (n) { var el = form.elements[n]; return el ? el.value : ''; };
    var num = SHO.num, kind = form.getAttribute('data-calc');
    var rows = [];
    var R = function (label, val, unit) { rows.push('<div class="between" style="padding:8px 0;border-bottom:1px solid #EEECE6"><span>' + label + '</span><span class="money" style="font-size:18px">' + val + ' <span class="small muted" style="font-family:Inter,sans-serif;font-weight:500">' + unit + '</span></span></div>'); };
    var f1 = function (x) { return (Math.round(x * 10) / 10).toLocaleString('en-IN'); };
    var f0 = function (x) { return Math.ceil(x).toLocaleString('en-IN'); };
    if (kind === 'concrete') {
      var r = SHO.calcConcrete(num(g('l')), num(g('w')), num(g('t')), g('unit'), g('mix'), Math.max(1, num(g('n'))));
      R(L('Concrete', 'कंक्रीट'), f1(r.volFt), L('cu.ft', 'घन फ़ीट') + ' (' + f1(r.vol) + ' m³)');
      R(L('Cement', 'सीमेंट'), f0(r.bags * 1.05), L('bori (50 kg)', 'बोरी (50 किलो)'));
      R(L('Ret', 'रेत'), f0(r.sandFt * 1.05), L('cu.ft', 'घन फ़ीट'));
      R(L('Gitti (20 mm)', 'गिट्टी (20 मिमी)'), f0(r.aggFt * 1.05), L('cu.ft', 'घन फ़ीट'));
      R(L('Paani (lagbhag)', 'पानी (लगभग)'), f0(r.water), L('litre', 'लीटर'));
    } else if (kind === 'brick') {
      var b = SHO.calcBrick(num(g('l')), num(g('h')), g('th'), g('unit'), num(g('r')));
      R(L('Eent', 'ईंट'), f0(b.bricks), L('nag', 'नग'));
      R(L('Cement', 'सीमेंट'), f0(b.bags * 1.05), L('bori', 'बोरी'));
      R(L('Ret', 'रेत'), f0(b.sandFt * 1.05), L('cu.ft', 'घन फ़ीट'));
    } else if (kind === 'plaster') {
      var p = SHO.calcPlaster(num(g('l')), num(g('h')), g('unit'), num(g('mm')), num(g('r')));
      R(L('Area', 'क्षेत्रफल'), f1(p.areaFt), L('sq.ft', 'वर्ग फ़ीट'));
      R(L('Cement', 'सीमेंट'), f0(p.bags * 1.05), L('bori', 'बोरी'));
      R(L('Ret', 'रेत'), f0(p.sandFt * 1.05), L('cu.ft', 'घन फ़ीट'));
    } else {
      var rule = SHO.STEEL_RULE[g('el')] || [80, 100];
      var m3 = num(g('cft')) / 35.3147;
      R(L('Sariya (andaza)', 'सरिया (अंदाज़ा)'), f0(m3 * rule[0]) + '–' + f0(m3 * rule[1]), L('kg', 'किलो'));
      var d = num(g('d')), wpm = SHO.barWeight(d);
      R(d + ' mm ' + L('ka vazan', 'का वज़न'), (Math.round(wpm * 1000) / 1000), L('kg / metre', 'किलो / मीटर'));
      R(L('Ek sariya', 'एक सरिया') + ' (' + f1(num(g('len'))) + ' m)', f1(wpm * num(g('len'))), L('kg', 'किलो'));
      rows.push('<p class="tiny muted">' + L('Dukaan par sariya tol kar dekho: vazan isse 5% se zyada kam ho to patla sariya hai.', 'दुकान पर सरिया तौलकर देखें: वज़न इससे 5% से ज़्यादा कम हो तो पतला सरिया है।') + '</p>');
    }
    out.innerHTML = '<div class="notice g" style="padding:4px 14px">' + rows.join('') + '</div>';
  };

  /* ---------------- Quality guide ---------------- */
  V.quality = function () {
    var h = '<div class="card stack"><h2>' + L('Achha material kaise pehchanein', 'अच्छा मटेरियल कैसे पहचानें') + '</h2><p class="small muted">' + L('Site par bina machine ke simple tests.', 'साइट पर बिना मशीन के आसान टेस्ट।') + '</p></div>';
    h += C.QUALITY.map(function (q, i) {
      return '<details class="acc"' + (i === 0 ? ' open' : '') + '><summary><span class="row">' + ic('brick', 20) + esc(T(q.name)) + '</span><span class="chev">' + ic('chev', 18) + '</span></summary><div class="acc-body">' + bullets(q.tests.map(T)) + '</div></details>';
    }).join('');
    return { title: L('Material quality', 'मटेरियल क्वालिटी'), back: '#/more', body: h };
  };

  /* ---------------- Learn (common mistakes) ---------------- */
  V.learn = function () {
    var top = [['Likhit agreement na hona', 'लिखित एग्रीमेंट न होना'], ['Advance zyada dena', 'एडवांस ज़्यादा देना'], ['Curing kam karna', 'क्यूरिंग कम करना'], ['Waterproofing me kanjoosi', 'वॉटरप्रूफ़िंग में कंजूसी'], ['Naksha pass ke bina banana', 'नक्शा पास के बिना बनाना']];
    var h = '<div class="card dark stack"><div class="eyebrow" style="color:#F2B705">' + L('Sabse zyada nuksaan', 'सबसे ज़्यादा नुकसान') + '</div><h2>' + L('In 5 galtiyon se bacho', 'इन 5 ग़लतियों से बचें') + '</h2>' + top.map(function (t, k) { return '<div class="row"><span class="display bold" style="color:#F2B705;width:22px">' + (k + 1) + '</span><span>' + esc(T(t)) + '</span></div>'; }).join('') + '</div>';
    h += C.MISTAKES.map(function (g) {
      return '<details class="acc"><summary><span>' + esc(T(g.title)) + ' <span class="chip" style="margin-left:6px">' + g.items.length + '</span></span><span class="chev">' + ic('chev', 18) + '</span></summary><div class="acc-body">' + g.items.map(function (it) {
        return '<div class="card soft" style="padding:12px"><div class="row" style="align-items:flex-start">' + ic('alert', 18, '#B42318') + '<div class="grow"><div class="bold">' + esc(T(it[0])) + '</div><div class="small" style="color:#3A4047;margin-top:4px">' + esc(T(it[1])) + '</div></div></div></div>';
      }).join('') + '</div></details>';
    }).join('');
    return { title: L('Aam galtiyan', 'आम ग़लतियाँ'), back: '#/more', body: h };
  };

  /* ---------------- Photo diary ---------------- */
  V.diary = function (args) {
    var S = SHO.S;
    if (args[0] === 'add') {
      var pre = args[1] != null ? args[1] : SHO.currentStage();
      var h0 = '<form class="card stack" data-f="diary"><h2>' + L('Diary me photo jodo', 'डायरी में फ़ोटो जोड़ें') + '</h2>' +
        '<label class="f">' + L('Photo', 'फ़ोटो') + '<input class="in" type="file" name="photo" accept="image/*" required></label>' +
        '<label class="f">' + L('Stage', 'स्टेज') + '<select class="in" name="stage">' + SHO.stageOptions(pre) + '</select></label>' +
        '<label class="f">' + L('Kya hai is photo me', 'इस फ़ोटो में क्या है') + '<input class="in" name="caption" placeholder="' + L('jaise: slab ka sariya, casting se pehle', 'जैसे: स्लैब का सरिया, ढलाई से पहले') + '"></label>' +
        '<label class="row small" style="gap:10px"><input type="checkbox" name="loc" style="width:22px;height:22px"> ' + L('Location bhi save karo', 'लोकेशन भी सेव करें') + '</label>' +
        '<button class="btn" type="submit">' + ic('plus', 18) + L('Save karo', 'सेव करें') + '</button></form>';
      return { title: L('Photo jodo', 'फ़ोटो जोड़ें'), back: '#/diary', body: h0 };
    }
    var filter = args[0] === 'stage' ? args[1] : '';
    var list = S.diary.filter(function (d) { return filter === '' || String(d.stage) === String(filter); }).sort(function (a, b) { return a.created < b.created ? 1 : -1; });
    var h = '<a class="btn block" href="#/diary/add">' + ic('camera', 20) + L('Nayi photo jodo', 'नई फ़ोटो जोड़ें') + '</a>';
    h += '<div class="row-wrap"><a class="chip' + (filter === '' ? ' y' : '') + '" href="#/diary" style="text-decoration:none;color:inherit">' + L('Sab', 'सब') + ' (' + S.diary.length + ')</a>' + C.STAGES.map(function (s, i) {
      var n = S.diary.filter(function (d) { return String(d.stage) === String(i); }).length;
      return n ? '<a class="chip' + (String(filter) === String(i) ? ' y' : '') + '" href="#/diary/stage/' + i + '" style="text-decoration:none;color:inherit">' + esc(T(s.name)) + ' (' + n + ')</a>' : '';
    }).join('') + '</div>';
    if (!list.length) h += '<div class="card empty">' + ic('image', 40, '#9AA0A6', 1.6) + '<div>' + L('Har stage ki photo date ke saath yahan rahegi. Plaster se pehle sariya, pipe aur wiring ki photo zaroor lo.', 'हर स्टेज की फ़ोटो तारीख़ के साथ यहाँ रहेगी। प्लास्टर से पहले सरिया, पाइप और वायरिंग की फ़ोटो ज़रूर लें।') + '</div></div>';
    else h += list.map(function (d) {
      return '<div class="card stack" style="padding:12px"><img class="hero-photo" data-photo="' + esc(d.photo) + '" alt=""><div class="between"><div class="grow"><div class="bold">' + esc(d.caption || T(C.STAGES[+d.stage] ? C.STAGES[+d.stage].name : '')) + '</div><div class="tiny muted">' + esc(C.STAGES[+d.stage] ? T(C.STAGES[+d.stage].name) : '') + ' · ' + SHO.fmtDate(d.date) + ' ' + esc(d.time || '') + '</div></div>' + (d.lat ? '<a class="icon-btn" href="https://maps.google.com/?q=' + d.lat + ',' + d.lng + '" target="_blank" rel="noopener" aria-label="' + L('Map par dekho', 'मैप पर देखें') + '">' + ic('pin', 20) + '</a>' : '') + '<button class="icon-btn" data-a="diary-del" data-id="' + d.id + '" aria-label="' + L('Hatao', 'हटाएँ') + '" style="color:#9AA0A6">' + ic('trash', 20) + '</button></div></div>';
    }).join('');
    return { title: L('Photo diary', 'फ़ोटो डायरी'), back: '#/more', body: h };
  };

  /* ---------------- Daily log ---------------- */
  V.log = function () {
    var S = SHO.S;
    var h = '<form class="card stack" data-f="log"><h3>' + L('Aaj ka kaam', 'आज का काम') + '</h3><div class="grid3"><label class="f">' + L('Date', 'तारीख़') + '<input class="in" type="date" name="date" value="' + SHO.today() + '"></label><label class="f">' + L('Mistri', 'मिस्त्री') + '<input class="in" name="mistri" inputmode="numeric" value="0"></label><label class="f">' + L('Labour', 'मज़दूर') + '<input class="in" name="labour" inputmode="numeric" value="0"></label></div>' +
      '<label class="f">' + L('Kya kaam hua', 'क्या काम हुआ') + '<input class="in" name="work" placeholder="' + L('jaise: pehli manzil ke column', 'जैसे: पहली मंज़िल के कॉलम') + '"></label>' +
      '<label class="f">' + L('Material aaya', 'मटेरियल आया') + '<input class="in" name="material" placeholder="' + L('jaise: 100 bori cement', 'जैसे: 100 बोरी सीमेंट') + '"></label>' +
      '<label class="f">' + L('Note', 'नोट') + '<input class="in" name="note"></label><button class="btn" type="submit">' + ic('plus', 18) + L('Save karo', 'सेव करें') + '</button></form>';
    var list = S.logs.slice().sort(function (a, b) { return a.date < b.date ? 1 : -1; });
    var md = 0, ld = 0; S.logs.forEach(function (x) { md += SHO.num(x.mistri); ld += SHO.num(x.labour); });
    if (list.length) h += '<div class="grid3"><div class="stat"><div class="n">' + list.length + '</div><div class="l">' + L('din likhe', 'दिन लिखे') + '</div></div><div class="stat"><div class="n">' + md + '</div><div class="l">' + L('mistri-din', 'मिस्त्री-दिन') + '</div></div><div class="stat"><div class="n">' + ld + '</div><div class="l">' + L('labour-din', 'मज़दूर-दिन') + '</div></div></div>';
    h += list.length ? '<div class="card"><div class="list">' + list.map(function (x) {
      return '<div class="list-item" style="align-items:flex-start"><span class="ic">' + ic('note', 18) + '</span><span class="grow"><span class="bold" style="display:block">' + SHO.fmtDate(x.date) + ' · ' + L('Mistri ', 'मिस्त्री ') + esc(x.mistri) + ', ' + L('Labour ', 'मज़दूर ') + esc(x.labour) + '</span>' + (x.work ? '<span class="small" style="display:block">' + esc(x.work) + '</span>' : '') + (x.material ? '<span class="tiny muted" style="display:block">' + L('Material: ', 'मटेरियल: ') + esc(x.material) + '</span>' : '') + (x.note ? '<span class="tiny muted" style="display:block">' + esc(x.note) + '</span>' : '') + '</span><button class="icon-btn" data-a="log-del" data-id="' + x.id + '" aria-label="' + L('Hatao', 'हटाएँ') + '" style="color:#9AA0A6">' + ic('trash', 18) + '</button></div>';
    }).join('') + '</div></div>' : '<div class="card empty">' + L('Roz 1 minute me likho: kitne log aaye aur kya kaam hua. Thekedar ke hisaab me kaam aayega.', 'रोज़ 1 मिनट में लिखें: कितने लोग आए और क्या काम हुआ। ठेकेदार के हिसाब में काम आएगा।') + '</div>';
    return { title: L('Roz ka kaam', 'रोज़ का काम'), back: '#/more', body: h };
  };

  /* ---------------- Reminders ---------------- */
  V.reminders = function () {
    var S = SHO.S, today = SHO.today();
    var h = '';
    if ('Notification' in window && Notification.permission !== 'granted') h += '<button class="btn dark block" data-a="notif">' + ic('bell', 18) + L('Notification chalu karo', 'नोटिफ़िकेशन चालू करें') + '</button>';
    h += '<form class="card stack" data-f="rem-template"><h3>' + L('Jaldi se reminder', 'जल्दी से रिमाइंडर') + '</h3><label class="f">' + L('Kya', 'क्या') + '<select class="in" name="tpl">' + C.REMINDER_TEMPLATES.map(function (t, k) { return '<option value="' + k + '">' + esc(T(t.title)) + '</option>'; }).join('') + '</select></label><label class="f">' + L('Kaam kis din hua (casting / shuruaat)', 'काम किस दिन हुआ (ढलाई / शुरुआत)') + '<input class="in" type="date" name="from" value="' + today + '"></label><button class="btn" type="submit">' + ic('plus', 18) + L('Reminder lagao', 'रिमाइंडर लगाएँ') + '</button></form>';
    h += '<form class="card stack" data-f="rem-custom"><h3>' + L('Apna reminder', 'अपना रिमाइंडर') + '</h3><label class="f">' + L('Kya yaad dilana hai', 'क्या याद दिलाना है') + '<input class="in" name="title" required></label><label class="f">' + L('Date', 'तारीख़') + '<input class="in" type="date" name="date" value="' + SHO.addDays(today, 1) + '"></label><button class="btn ghost" type="submit">' + ic('plus', 18) + L('Jodo', 'जोड़ें') + '</button></form>';
    var open = S.reminders.filter(function (r) { return !r.done; }).sort(function (a, b) { return a.date < b.date ? -1 : 1; });
    var done = S.reminders.filter(function (r) { return r.done; }).length;
    h += open.length ? '<div class="card"><h3>' + L('Aane wale', 'आने वाले') + '</h3><div class="list">' + open.map(function (r) {
      var dd = SHO.daysBetween(today, r.date);
      var when = dd < 0 ? '<span style="color:#B42318;font-weight:600">' + L(-dd + ' din late', -dd + ' दिन देर') + '</span>' : dd === 0 ? '<b>' + L('Aaj', 'आज') + '</b>' : dd === 1 ? L('Kal', 'कल') : L(dd + ' din baad', dd + ' दिन बाद');
      return '<div class="list-item" style="align-items:flex-start"><span class="ic">' + ic('bell', 18) + '</span><span class="grow"><span class="bold" style="display:block">' + esc(r.title) + '</span><span class="tiny">' + SHO.fmtDate(r.date) + ' · ' + when + '</span><span class="row-wrap" style="margin-top:6px"><button class="btn small green" data-a="rem-done" data-id="' + r.id + '">' + L('Ho gaya', 'हो गया') + '</button><a class="btn small ghost" href="' + esc(SHO.gcal(r.title, r.date, 'Smart House Owner')) + '" target="_blank" rel="noopener">' + ic('cal', 16) + 'Google Calendar</a>' + (r.link ? '<a class="btn small ghost" href="#/' + esc(r.link) + '">' + L('Kholo', 'खोलें') + '</a>' : '') + '<button class="btn small ghost" data-a="rem-del" data-id="' + r.id + '" aria-label="' + L('Hatao', 'हटाएँ') + '">' + ic('trash', 16) + '</button></span></span></div>';
    }).join('') + '</div></div>' : '<div class="card empty">' + L('Koi reminder nahi. Casting ke din curing aur shuttering ka reminder zaroor lagao.', 'कोई रिमाइंडर नहीं। ढलाई के दिन क्यूरिंग और शटरिंग का रिमाइंडर ज़रूर लगाएँ।') + '</div>';
    if (done) h += '<p class="tiny muted">' + L(done + ' reminder poore ho chuke', done + ' रिमाइंडर पूरे हो चुके') + '</p>';
    return { title: L('Reminders', 'रिमाइंडर'), back: '#/more', body: h };
  };

  /* ---------------- House health card ---------------- */
  V.report = function () {
    var S = SHO.S, p = S.profile;
    var spent = S.expenses.reduce(function (a, x) { return a + SHO.num(x.amount); }, 0);
    var paid = S.payments.filter(function (x) { return x.status === 'paid'; }).reduce(function (a, x) { return a + SHO.num(x.amount); }, 0);
    var o = SHO.overall(), flags = SHO.flags();
    var h = '<div class="no-print fab-row"><button class="btn dark" data-a="print">' + ic('download', 18) + L('PDF save / print', 'PDF सेव / प्रिंट') + '</button></div>';
    h += '<div class="report stack">';
    h += '<div class="card stack"><div class="between"><div><div class="eyebrow">House Health Card</div><h1>' + esc(p.house || L('Mera Ghar', 'मेरा घर')) + '</h1><div class="small muted">' + esc(p.name) + (p.city ? ' · ' + esc(p.city) : '') + '</div></div><div class="logo" style="width:48px;height:48px">' + ic('home', 26, '#1B1F24') + '</div></div>' +
      '<div class="grid3"><div class="stat"><div class="n">' + o.pct + '%</div><div class="l">' + L('inspection', 'जाँच') + '</div></div><div class="stat' + (flags.length ? ' r' : '') + '"><div class="n">' + flags.length + '</div><div class="l">' + L('khule red flag', 'खुले रेड फ़्लैग') + '</div></div><div class="stat"><div class="n">' + S.photoChecks.length + '</div><div class="l">' + L('photo checks', 'फ़ोटो जाँच') + '</div></div></div>' +
      '<div class="tiny muted">' + L('Report date', 'रिपोर्ट तारीख़') + ': ' + SHO.fmtDate(SHO.today()) + (p.start ? ' · ' + L('Kaam shuru', 'काम शुरू') + ': ' + SHO.fmtDate(p.start) : '') + '</div></div>';
    h += '<div class="card stack"><h2>' + L('Stage-wise inspection', 'स्टेज-वार जाँच') + '</h2><table><thead><tr><th>' + L('Stage', 'स्टेज') + '</th><th>' + L('Sahi', 'सही') + '</th><th>' + L('Galat', 'ग़लत') + '</th><th>' + L('Status', 'स्थिति') + '</th></tr></thead><tbody>' + C.STAGES.map(function (s, i) {
      var st = SHO.stageStat(i);
      return '<tr><td>' + esc(T(s.name)) + '</td><td>' + st.ok + '/' + st.n + '</td><td style="' + (st.bad ? 'color:#B42318;font-weight:700' : '') + '">' + st.bad + '</td><td>' + (st.done ? L('Poora', 'पूरा') : st.pass ? L('Pass', 'पास') : st.ok + st.bad ? L('Chal raha', 'चल रहा') : '–') + '</td></tr>';
    }).join('') + '</tbody></table></div>';
    if (S.photoChecks.length) h += '<div class="card stack"><h2>' + L('Photo checks', 'फ़ोटो जाँच') + '</h2><table><tbody>' + S.photoChecks.map(function (c) {
      var r = SHO.analyze(c.ans);
      return '<tr><td>' + SHO.fmtDate(c.date) + '</td><td>' + esc(r.title) + '</td><td>' + (c.sev === 3 ? L('Engineer', 'इंजीनियर') : c.sev === 2 ? L('Dhyan', 'ध्यान') : L('Normal', 'सामान्य')) + '</td><td>' + (c.resolved ? L('Theek', 'ठीक') : L('Khula', 'खुला')) + '</td></tr>';
    }).join('') + '</tbody></table></div>';
    h += '<div class="card stack"><h2>' + L('Paisa', 'पैसा') + '</h2><table><tbody><tr><td>' + L('Kul kharch', 'कुल ख़र्च') + '</td><td class="amount-r">' + SHO.rupee(spent) + '</td></tr>' + (SHO.num(p.budget) ? '<tr><td>' + L('Budget', 'बजट') + '</td><td class="amount-r">' + SHO.rupee(p.budget) + '</td></tr>' : '') + '<tr><td>' + L('Thekedar ko diya', 'ठेकेदार को दिया') + '</td><td class="amount-r">' + SHO.rupee(paid) + '</td></tr><tr><td>' + L('Bills ki photo', 'बिलों की फ़ोटो') + '</td><td class="amount-r">' + S.expenses.filter(function (x) { return x.photo; }).length + '</td></tr></tbody></table></div>';
    var dp = S.diary.slice().sort(function (a, b) { return a.created < b.created ? -1 : 1; });
    if (dp.length) h += '<div class="card stack"><h2>' + L('Photo diary', 'फ़ोटो डायरी') + ' (' + dp.length + ')</h2><div class="rp-photos">' + dp.slice(0, 24).map(function (d) { return '<img data-photo="' + esc(d.photo) + '" alt="">'; }).join('') + '</div></div>';
    h += '<div class="card stack"><div class="small">' + L('Report banaya: Smart House Owner app. Engineer: ', 'रिपोर्ट बनाई: Smart House Owner ऐप। इंजीनियर: ') + esc(T(SHO.ENG.name)) + ', ' + esc(SHO.ENG.firm) + ', ' + SHO.ENG.phoneShow + '</div><div class="tiny muted">' + L('Ye report owner ke apne records par aadharit hai. Ye engineer ka certificate nahi hai.', 'यह रिपोर्ट मालिक के अपने रिकॉर्ड पर आधारित है। यह इंजीनियर का प्रमाणपत्र नहीं है।') + '</div></div>';
    h += '</div>';
    return { title: L('House health card', 'हाउस हेल्थ कार्ड'), back: '#/more', body: h };
  };

  /* ---------------- More ---------------- */
  V.more = function () {
    var h = '<div class="grid3">' +
      tile('#/flags', 'flag', L('Red flags', 'रेड फ़्लैग')) +
      tile('#/engineer', 'hard', L('Engineer', 'इंजीनियर')) +
      tile('#/calc', 'calc', L('Material calculator', 'मटेरियल कैलकुलेटर')) +
      tile('#/quality', 'shield', L('Material quality', 'मटेरियल क्वालिटी')) +
      tile('#/diary', 'image', L('Photo diary', 'फ़ोटो डायरी')) +
      tile('#/log', 'note', L('Roz ka kaam', 'रोज़ का काम')) +
      tile('#/reminders', 'bell', L('Reminders', 'रिमाइंडर')) +
      tile('#/learn', 'book', L('Aam galtiyan', 'आम ग़लतियाँ')) +
      tile('#/report', 'report', L('House health card', 'हाउस हेल्थ कार्ड')) +
      tile('#/money/pay', 'rupee', L('Thekedar payment', 'ठेकेदार पेमेंट')) +
      tile('#/settings', 'settings', L('Settings / backup', 'सेटिंग / बैकअप')) +
      '</div>';
    if (SHO.installEvt) h += '<button class="btn dark block" data-a="install">' + ic('install', 20) + L('App phone me install karo', 'ऐप फ़ोन में इंस्टॉल करें') + '</button>';
    h += engineerMini();
    return { title: L('Aur', 'और'), body: h };
  };

  /* ---------------- Settings ---------------- */
  V.settings = function () {
    var p = SHO.S.profile;
    var h = '<div class="card stack"><div class="between"><div><div class="bold">' + esc(p.name) + '</div><div class="small muted">' + esc(p.house || '') + (p.city ? ' · ' + esc(p.city) : '') + '</div></div><a class="btn small ghost" href="#/setup">' + L('Badlo', 'बदलें') + '</a></div></div>';
    h += '<div class="card stack"><h3>' + L('Bhasha', 'भाषा') + '</h3><div class="tabs"><button class="' + (!SHO.hi() ? 'on' : '') + '" data-a="lang" data-v="en">Hinglish</button><button class="' + (SHO.hi() ? 'on' : '') + '" data-a="lang" data-v="hi">हिंदी</button></div></div>';
    h += '<div class="card stack"><h3>' + L('Backup', 'बैकअप') + '</h3><p class="small muted">' + L('Aapka saara data sirf is phone me hai. Phone badalne se pehle backup file bana lo aur naye phone me daal do.', 'आपका सारा डेटा सिर्फ़ इस फ़ोन में है। फ़ोन बदलने से पहले बैकअप फ़ाइल बना लें और नए फ़ोन में डाल दें।') + '</p><button class="btn ghost" data-a="backup">' + ic('download', 18) + L('Backup file banao', 'बैकअप फ़ाइल बनाएँ') + '</button><label class="btn ghost" style="position:relative">' + ic('upload', 18) + L('Backup se wapas laao', 'बैकअप से वापस लाएँ') + '<input type="file" accept="application/json,.json" data-c="restore" style="position:absolute;inset:0;opacity:0;cursor:pointer" aria-label="' + L('Backup file chuno', 'बैकअप फ़ाइल चुनें') + '"></label></div>';
    h += '<div class="card stack"><h3>' + L('Disclaimer', 'अस्वीकरण') + '</h3><p class="small muted">' + L('Smart House Owner jaankari aur jagrukta ke liye hai. Ye licensed engineer ki salah aur site inspection ki jagah nahi leta. Photo check ka jawab andaza hai. Structure se judi har problem ki jaanch engineer se karwayein. YouTube videos teesre paksh ke hain.', 'Smart House Owner जानकारी और जागरूकता के लिए है। यह लाइसेंसधारी इंजीनियर की सलाह और साइट जाँच की जगह नहीं लेता। फ़ोटो जाँच का जवाब अंदाज़ा है। ढाँचे से जुड़ी हर समस्या की जाँच इंजीनियर से करवाएँ। YouTube वीडियो तीसरे पक्ष के हैं।') + '</p><p class="small muted">' + L('Privacy: aapki photos aur data sirf aapke phone me save hote hain, kisi server par nahi jaate.', 'गोपनीयता: आपकी फ़ोटो और डेटा सिर्फ़ आपके फ़ोन में सेव होते हैं, किसी सर्वर पर नहीं जाते।') + '</p><p class="tiny muted">' + esc(SHO.ENG.firm) + ' · ' + SHO.ENG.phoneShow + ' · ' + SHO.ENG.email + '</p></div>';
    h += '<button class="btn ghost block" data-a="wipe" style="color:#B42318;border-color:#F0C4BF">' + ic('trash', 18) + L('Saara data mitao', 'सारा डेटा मिटाएँ') + '</button>';
    h += '<p class="tiny muted" style="text-align:center">Smart House Owner v1.0</p>';
    return { title: L('Settings', 'सेटिंग'), back: '#/more', body: h };
  };
})();
