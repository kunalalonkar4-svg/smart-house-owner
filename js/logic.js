/* Smart House Owner – logic: stage progress, red flags, photo analysis, calculators. */
(function () {
  var SHO = window.SHO, C = window.SHO_CONTENT;

  /* ---------- Stage progress ---------- */
  SHO.stageStat = function (i) {
    var st = C.STAGES[i], ok = 0, bad = 0;
    st.items.forEach(function (_, j) {
      var v = SHO.S.checks[i + '-' + j];
      if (v === 'ok') ok++; else if (v === 'bad') bad++;
    });
    var n = st.items.length;
    return { n: n, ok: ok, bad: bad, left: n - ok - bad, pct: Math.round((ok + bad) / n * 100), pass: ok === n, done: !!SHO.S.stageDone[i] };
  };
  SHO.overall = function () {
    var tot = 0, ok = 0, bad = 0;
    C.STAGES.forEach(function (_, i) { var s = SHO.stageStat(i); tot += s.n; ok += s.ok; bad += s.bad; });
    return { tot: tot, ok: ok, bad: bad, pct: Math.round((ok + bad) / tot * 100) };
  };
  SHO.currentStage = function () {
    for (var i = 0; i < C.STAGES.length; i++) { if (!SHO.S.stageDone[i]) return i; }
    return C.STAGES.length - 1;
  };

  /* ---------- Red flags ---------- */
  SHO.flags = function () {
    var out = [];
    C.STAGES.forEach(function (st, i) {
      st.items.forEach(function (it, j) {
        if (SHO.S.checks[i + '-' + j] === 'bad') out.push({ kind: 'check', sev: 3, key: i + '-' + j, stage: i, title: SHO.T(it), sub: SHO.T(st.name) });
      });
    });
    SHO.S.photoChecks.forEach(function (c) {
      if (!c.resolved && c.sev >= 2) {
        var r = SHO.analyze(c.ans);
        out.push({ kind: 'photo', sev: c.sev, id: c.id, title: r.title, sub: SHO.fmtDate(c.date) });
      }
    });
    out.sort(function (a, b) { return b.sev - a.sev; });
    return out;
  };

  /* ---------- Photo check: questions & analysis ---------- */
  SHO.PARTS = [
    ['slab', ['Slab / Chhat', 'स्लैब / छत'], ['Slab', 'स्लैब']],
    ['column', ['Column', 'कॉलम'], ['Column', 'कॉलम']],
    ['beam', ['Beam', 'बीम'], ['Beam', 'बीम']],
    ['wall', ['Deewar', 'दीवार'], ['Deewar', 'दीवार']],
    ['floor', ['Floor / Tile', 'फ़र्श / टाइल'], ['Floor', 'फ़र्श']],
    ['bath', ['Bathroom', 'बाथरूम'], ['Bathroom', 'बाथरूम']],
    ['found', ['Foundation / Plinth', 'नींव / प्लिंथ'], ['Foundation', 'नींव']]
  ];
  SHO.STAGEQ = [
    ['ongoing', ['Abhi kaam chal raha hai', 'अभी काम चल रहा है']],
    ['plastered', ['Plaster ho chuka hai', 'प्लास्टर हो चुका है']],
    ['ready', ['Ghar ready hai', 'घर तैयार है']],
    ['old', ['Purana ghar (5+ saal)', 'पुराना घर (5+ साल)']]
  ];
  SHO.PROBS = [
    ['crack', ['Crack / darar', 'दरार']],
    ['seelan', ['Seelan / leakage', 'सीलन / लीकेज']],
    ['hollow', ['Khokhli awaaz', 'खोखली आवाज़']],
    ['tilt', ['Tedha / jhuka hua', 'टेढ़ा / झुका हुआ']],
    ['honey', ['Concrete me chhed / gitti dikh rahi', 'कंक्रीट में छेद / गिट्टी दिख रही']],
    ['rust', ['Sariya dikh raha / jung', 'सरिया दिख रहा / जंग']],
    ['unknown', ['Pata nahi', 'पता नहीं']]
  ];
  SHO.WIDTHS = [
    ['hair', ['Baal jaisi patli', 'बाल जैसी पतली'], ['0.3 mm se kam', '0.3 मिमी से कम']],
    ['card', ['Card ghus jata hai', 'कार्ड घुस जाता है'], ['lagbhag 1 mm', 'लगभग 1 मिमी']],
    ['coin', ['Sikka ghus jata hai', 'सिक्का घुस जाता है'], ['lagbhag 2-3 mm', 'लगभग 2-3 मिमी']],
    ['finger', ['Pencil / ungli ghus jati hai', 'पेंसिल / उँगली घुस जाती है'], ['5 mm se zyada', '5 मिमी से ज़्यादा']]
  ];
  SHO.SINCE = [
    ['new', ['Abhi dikha', 'अभी दिखा']],
    ['weeks', ['Kuch hafte se', 'कुछ हफ़्तों से']],
    ['growing', ['Mahino se badh raha hai', 'महीनों से बढ़ रहा है']]
  ];
  SHO.TREND = [
    ['more', ['Badh gaya hai', 'बढ़ गया है']],
    ['same', ['Waisa hi hai', 'वैसा ही है']],
    ['less', ['Kam hua / theek hua', 'कम हुआ / ठीक हुआ']]
  ];
  SHO.optLabel = function (list, key) { for (var i = 0; i < list.length; i++) { if (list[i][0] === key) return SHO.T(list[i][1]); } return ''; };

  SHO.questions = function (ans, isFollow) {
    var q = [
      { key: 'part', q: ['Ye kis hisse ki photo hai?', 'यह किस हिस्से की फ़ोटो है?'], opts: SHO.PARTS },
      { key: 'stage', q: ['Kaam kis stage par hai?', 'काम किस स्टेज पर है?'], opts: SHO.STAGEQ },
      { key: 'prob', q: ['Problem kya lag rahi hai?', 'समस्या क्या लग रही है?'], opts: SHO.PROBS }
    ];
    if (ans.prob === 'crack') q.push({ key: 'width', q: ['Crack kitna chauda hai?', 'दरार कितनी चौड़ी है?'], hint: ['Crack me card ya sikka daal kar dekho', 'दरार में कार्ड या सिक्का डालकर देखें'], opts: SHO.WIDTHS });
    q.push({ key: 'since', q: ['Ye kab se hai?', 'यह कब से है?'], opts: SHO.SINCE });
    if (isFollow) q.push({ key: 'trend', q: ['Pichhli photo se tulna karo: problem...', 'पिछली फ़ोटो से तुलना करें: समस्या...'], opts: SHO.TREND, compare: true });
    return q;
  };

  SHO.analyze = function (ans, forceLang) {
    var hi = forceLang ? forceLang === 'hi' : SHO.hi();
    var L = function (a, b) { return hi ? b : a; };
    var partIdx = 3;
    SHO.PARTS.forEach(function (p, i) { if (p[0] === ans.part) partIdx = i; });
    var part = SHO.PARTS[partIdx][0];
    var pn = SHO.PARTS[partIdx][2][hi ? 1 : 0];
    var pe = SHO.PARTS[partIdx][2][0];
    var structural = ['slab', 'column', 'beam', 'found'].indexOf(part) >= 0;
    var prob = ans.prob || 'unknown';
    var r = { sev: 2, title: '', desc: '', cause: [], checks: [], repair: [], dont: '', videos: [], query: '' };
    var yt = C.yt;

    if (prob === 'crack') {
      r.sev = structural ? 3 : (part === 'wall' ? 2 : 1);
      if (ans.width === 'hair') r.sev = structural ? 2 : 1;
      else if (ans.width === 'card') r.sev = structural ? 3 : 2;
      else if (ans.width === 'coin') r.sev = structural ? 3 : 2;
      else if (ans.width === 'finger') r.sev = 3;
      r.title = L(pn + ' me crack', pn + ' में दरार');
      r.desc = structural
        ? L('Structure wale hisse (' + pn + ') me crack ko halke me nahi lena chahiye. Ye load, sariya ya design ki problem ka sanket ho sakta hai.', 'ढाँचे वाले हिस्से (' + pn + ') में दरार को हल्के में नहीं लेना चाहिए। यह भार, सरिया या डिज़ाइन की समस्या का संकेत हो सकता है।')
        : L('Deewar, floor ya plaster me crack aksar sookhne (shrinkage) ya halke settlement se aata hai. Zyada tar theek ho jata hai, par nazar rakhni hai.', 'दीवार, फ़र्श या प्लास्टर में दरार अक्सर सूखने (श्रिंकेज) या हल्के धँसाव से आती है। ज़्यादातर ठीक हो जाती है, पर नज़र रखनी है।');
      r.cause = structural
        ? [L('Zyada load ya galat design', 'ज़्यादा भार या ग़लत डिज़ाइन'), L('Sariya kam ya galat jagah', 'सरिया कम या ग़लत जगह'), L('Shuttering jaldi khulna ya curing kam', 'शटरिंग जल्दी खुलना या क्यूरिंग कम'), L('Neev ka dhansna', 'नींव का धँसना')]
        : [L('Plaster ka jaldi sookhna (curing kam)', 'प्लास्टर का जल्दी सूखना (क्यूरिंग कम)'), L('RCC aur eent ke jod par jaali na lagna', 'RCC और ईंट के जोड़ पर जाली न लगना'), L('Garmi-sardi me failna-sikudna', 'गर्मी-सर्दी में फैलना-सिकुड़ना'), L('Halka settlement', 'हल्का धँसाव')];
      r.checks = [L('Crack me card ya sikka ghusta hai ya nahi (chaudai)', 'दरार में कार्ड या सिक्का घुसता है या नहीं (चौड़ाई)'), L('Pencil se dono siron par nishan aur date likho, 7 din baad dekho', 'पेंसिल से दोनों सिरों पर निशान और तारीख़ लिखें, 7 दिन बाद देखें'), L('Crack seedha hai, tirchha hai ya jaal jaisa', 'दरार सीधी है, तिरछी है या जाल जैसी'), L('Dusri taraf (bahar ya neeche) bhi wahi crack hai ya nahi', 'दूसरी तरफ़ (बाहर या नीचे) भी वही दरार है या नहीं'), L('Darwaze-khidki band hone me atakte hain ya nahi', 'दरवाज़े-खिड़की बंद होने में अटकते हैं या नहीं')];
      r.repair = r.sev === 3
        ? [L('Pehle engineer se jaanch, wajah samjho', 'पहले इंजीनियर से जाँच, कारण समझें'), L('Structure ka crack: epoxy injection ya jacketing (engineer ki salah se)', 'ढाँचे की दरार: इपॉक्सी इंजेक्शन या जैकेटिंग (इंजीनियर की सलाह से)')]
        : [L('Crack ko V shape me khol kar saaf karo', 'दरार को V आकार में खोलकर साफ़ करें'), L('Crack filler ya polymer mortar bharo, upar jaali (fibre mesh) lagao', 'क्रैक फ़िलर या पॉलिमर मोर्टार भरें, ऊपर जाली (फ़ाइबर मेश) लगाएँ'), L('7 din curing, phir putty-paint', '7 दिन क्यूरिंग, फिर पुट्टी-पेंट')];
      r.dont = L('Sirf putty ya paint se crack mat chhupao, pehle wajah samjho.', 'सिर्फ़ पुट्टी या पेंट से दरार मत छिपाएँ, पहले कारण समझें।');
      r.videos = [{ title: L(pn + ' crack kaise check karein', pn + ' की दरार कैसे जाँचें'), url: yt(pe + ' crack check hindi') }, { title: L('Crack repair ka sahi tarika', 'दरार ठीक करने का सही तरीका'), url: yt('crack repair kaise kare hindi') }];
      r.query = pe.toLowerCase() + ' crack kaise check kare repair hindi';
    } else if (prob === 'seelan') {
      r.sev = 2;
      r.title = L(pn + ' me seelan', pn + ' में सीलन');
      r.desc = L('Seelan aksar upar ki chhat, bathroom ya kisi pipe ke leak se aati hai. Lambe samay tak rahe to sariya me jung lag sakti hai.', 'सीलन अक्सर ऊपर की छत, बाथरूम या किसी पाइप के लीक से आती है। लंबे समय तक रहे तो सरिया में जंग लग सकती है।');
      r.cause = [L('Chhat par paani rukna ya slope galat', 'छत पर पानी रुकना या ढलान ग़लत'), L('Bathroom ki waterproofing kharab', 'बाथरूम की वॉटरप्रूफ़िंग ख़राब'), L('Deewar ke andar pipe leak', 'दीवार के अंदर पाइप लीक'), L('Zameen se nami (DPC na hona)', 'ज़मीन से नमी (DPC न होना)')];
      r.checks = [L('Seelan baarish ke baad badhti hai ya roz rehti hai', 'सीलन बारिश के बाद बढ़ती है या रोज़ रहती है'), L('Upar ya bagal me bathroom ya pipe line hai ya nahi', 'ऊपर या बगल में बाथरूम या पाइप लाइन है या नहीं'), L('Chhat par paani rukta hai ya nahi', 'छत पर पानी रुकता है या नहीं'), L('Saare nal band karke meter chalta hai ya nahi (leak test)', 'सभी नल बंद करके मीटर चलता है या नहीं (लीक टेस्ट)'), L('Daag ke kinaare par pencil se nishan, 7 din baad dekho', 'दाग के किनारे पर पेंसिल से निशान, 7 दिन बाद देखें')];
      r.repair = [L('Pehle paani ka source band karo (leak, slope, bathroom)', 'पहले पानी का स्रोत बंद करें (लीक, ढलान, बाथरूम)'), L('Chhat/bathroom me sahi waterproofing coat', 'छत/बाथरूम में सही वॉटरप्रूफ़िंग कोट'), L('Deewar poori sookhne ke baad hi plaster-paint', 'दीवार पूरी सूखने के बाद ही प्लास्टर-पेंट')];
      r.dont = L('Gile hisse par seedha paint ya putty mat karo.', 'गीले हिस्से पर सीधे पेंट या पुट्टी मत करें।');
      r.videos = [{ title: L('Seelan ki wajah kaise dhundhein', 'सीलन का कारण कैसे खोजें'), url: yt('deewar me seelan ka karan hindi') }, { title: L('Waterproofing solution', 'वॉटरप्रूफ़िंग समाधान'), url: yt('seelan waterproofing solution hindi') }];
      r.query = pe.toLowerCase() + ' seelan leakage solution hindi';
    } else if (prob === 'hollow') {
      r.sev = structural ? 2 : 1;
      r.title = L(pn + ' me khokhla hissa', pn + ' में खोखला हिस्सा');
      r.desc = L('Thokne par khokhli awaaz ka matlab hai plaster ya tile neeche se theek se chipka nahi. Aam taur par structure ke liye khatra nahi.', 'ठोकने पर खोखली आवाज़ का मतलब है प्लास्टर या टाइल नीचे से ठीक से चिपका नहीं। आम तौर पर ढाँचे के लिए ख़तरा नहीं।');
      r.cause = [L('Surface geela kiye bina plaster/tile', 'सतह गीली किए बिना प्लास्टर/टाइल'), L('Masala kam ya kamzor', 'मसाला कम या कमज़ोर'), L('Curing kam', 'क्यूरिंग कम')];
      r.checks = [L('Sikke ya hathodi se halka thok kar khokhla area mark karo', 'सिक्के या हथौड़ी से हल्का ठोककर खोखला हिस्सा मार्क करें'), L('Kinaare tootne ya uthne lage hain ya nahi', 'किनारे टूटने या उठने लगे हैं या नहीं'), L('Area time ke saath badh raha hai ya nahi', 'हिस्सा समय के साथ बढ़ रहा है या नहीं'), L('Neeche ya peeche seelan to nahi', 'नीचे या पीछे सीलन तो नहीं')];
      r.repair = [L('Khokhla plaster/tile nikalwao', 'खोखला प्लास्टर/टाइल निकलवाएँ'), L('Surface saaf aur geela karke naya masala ya tile adhesive', 'सतह साफ़ और गीली करके नया मसाला या टाइल एडहेसिव'), L('Bond agent (bonding chemical) use karo', 'बॉन्ड एजेंट (बॉन्डिंग केमिकल) इस्तेमाल करें')];
      r.dont = L('Khokhle hisse ke upar se naya plaster mat chadhao.', 'खोखले हिस्से के ऊपर नया प्लास्टर मत चढ़ाएँ।');
      r.videos = [{ title: L('Khokhla plaster check', 'खोखला प्लास्टर जाँच'), url: yt('hollow plaster check hindi') }, { title: L('Khokhli tile repair', 'खोखली टाइल की मरम्मत'), url: yt('hollow tile repair hindi') }];
      r.query = pe.toLowerCase() + ' hollow plaster tile repair hindi';
    } else if (prob === 'tilt') {
      r.sev = structural ? 3 : 2;
      r.title = L(pn + ' tedha ya jhuka hua', pn + ' टेढ़ा या झुका हुआ');
      r.desc = L('Kisi hisse ka tedha hona shuttering ki galti ya load ki problem ho sakti hai. Structure me ho to turant dikhwana chahiye.', 'किसी हिस्से का टेढ़ा होना शटरिंग की ग़लती या भार की समस्या हो सकती है। ढाँचे में हो तो तुरंत दिखवाना चाहिए।');
      r.cause = [L('Shuttering hilna ya kamzor', 'शटरिंग हिलना या कमज़ोर'), L('Prop (balli) jaldi hatana', 'प्रॉप (बल्ली) जल्दी हटाना'), L('Neev ka asmaan dhansna', 'नींव का असमान धँसना')];
      r.checks = [L('Sahul (plumb bob) ya spirit level se jhukav check karo', 'साहुल (प्लंब बॉब) या स्पिरिट लेवल से झुकाव जाँचें'), L('Jhukav tape se naap kar photo lo', 'झुकाव टेप से नापकर फ़ोटो लें'), L('Aas-paas koi crack to nahi', 'आस-पास कोई दरार तो नहीं'), L('Shuttering khulne ke baad hua ya pehle se tha', 'शटरिंग खुलने के बाद हुआ या पहले से था')];
      r.repair = [L('Engineer se jaanch, structure safe hai ya nahi', 'इंजीनियर से जाँच, ढाँचा सुरक्षित है या नहीं'), L('Zarurat ho to support (prop) lagao', 'ज़रूरत हो तो सपोर्ट (प्रॉप) लगाएँ'), L('Chhota jhukav: plaster se seedha (engineer ki haan ke baad)', 'छोटा झुकाव: प्लास्टर से सीधा (इंजीनियर की हाँ के बाद)')];
      r.dont = L('Is hisse par aur bhaar (nayi manzil, tanki, saamaan) mat daalo.', 'इस हिस्से पर और भार (नई मंज़िल, टंकी, सामान) मत डालें।');
      r.videos = [{ title: L(pn + ' seedha hai kaise check karein', pn + ' सीधा है, कैसे जाँचें'), url: yt(pe + ' plumb level check hindi') }, { title: L('Spirit level use karna', 'स्पिरिट लेवल का उपयोग'), url: yt('spirit level kaise use kare hindi') }];
      r.query = pe.toLowerCase() + ' tedha jhuka kaise check kare hindi';
    } else if (prob === 'honey') {
      r.sev = (part === 'column' || part === 'beam' || part === 'found') ? 3 : 2;
      r.title = L(pn + ' me honeycombing (khokhla concrete)', pn + ' में हनीकॉम्बिंग (खोखला कंक्रीट)');
      r.desc = L('Concrete me chhed ya gitti dikhna batata hai ki concrete theek se bhara ya dabaya (vibrate) nahi gaya. Isse majbooti ghatti hai aur sariya me jung lag sakti hai.', 'कंक्रीट में छेद या गिट्टी दिखना बताता है कि कंक्रीट ठीक से भरा या दबाया (वाइब्रेट) नहीं गया। इससे मज़बूती घटती है और सरिया में जंग लग सकती है।');
      r.cause = [L('Vibrator na lagana', 'वाइब्रेटर न लगाना'), L('Shuttering se masala bah jana (gap)', 'शटरिंग से मसाला बह जाना (गैप)'), L('Concrete bahut sookha ya oonchai se girana', 'कंक्रीट बहुत सूखा या ऊँचाई से गिराना')];
      r.checks = [L('Chhed kitna gehra hai, sariya dikh raha hai ya nahi', 'छेद कितना गहरा है, सरिया दिख रहा है या नहीं'), L('Kitne area me hai (photo me tape rakh kar)', 'कितने हिस्से में है (फ़ोटो में टेप रखकर)'), L('Aur column/beam me bhi aisa hai ya nahi', 'और कॉलम/बीम में भी ऐसा है या नहीं')];
      r.repair = [L('Chhota: dheela concrete nikal kar polymer mortar se bharo', 'छोटा: ढीला कंक्रीट निकालकर पॉलिमर मोर्टार से भरें'), L('Gehra ya sariya dikhe: engineer ki salah se grouting/jacketing', 'गहरा या सरिया दिखे: इंजीनियर की सलाह से ग्राउटिंग/जैकेटिंग')];
      r.dont = L('Sirf upar se plaster karke mat chhupao.', 'सिर्फ़ ऊपर से प्लास्टर करके मत छिपाएँ।');
      r.videos = [{ title: L('Honeycombing kya hai aur repair', 'हनीकॉम्बिंग क्या है और मरम्मत'), url: yt('honeycombing in concrete repair hindi') }];
      r.query = pe.toLowerCase() + ' honeycombing concrete repair hindi';
    } else if (prob === 'rust') {
      r.sev = structural ? 3 : 2;
      r.title = L(pn + ' me sariya dikh raha / jung', pn + ' में सरिया दिख रहा / जंग');
      r.desc = L('Sariya ka bahar dikhna ya jung lagna batata hai ki cover kam tha ya nami andar ja rahi hai. Jung se sariya patla aur concrete kamzor hota jata hai.', 'सरिया का बाहर दिखना या जंग लगना बताता है कि कवर कम था या नमी अंदर जा रही है। जंग से सरिया पतला और कंक्रीट कमज़ोर होता जाता है।');
      r.cause = [L('Cover block na lagna', 'कवर ब्लॉक न लगना'), L('Lagatar seelan ya nami', 'लगातार सीलन या नमी'), L('Khaara paani ya kharab concrete', 'खारा पानी या ख़राब कंक्रीट')];
      r.checks = [L('Sariya kitna patla hua hai, jung ki parat utar rahi hai ya nahi', 'सरिया कितना पतला हुआ है, जंग की परत उतर रही है या नहीं'), L('Aas-paas concrete phool ya toot raha hai ya nahi', 'आस-पास कंक्रीट फूल या टूट रहा है या नहीं'), L('Upar se paani ya seelan aa rahi hai ya nahi', 'ऊपर से पानी या सीलन आ रही है या नहीं')];
      r.repair = [L('Dheela concrete hatao, sariya ki jung saaf karo', 'ढीला कंक्रीट हटाएँ, सरिया की जंग साफ़ करें'), L('Anti-rust coat lagao, phir polymer mortar se cover', 'एंटी-रस्ट कोट लगाएँ, फिर पॉलिमर मोर्टार से कवर'), L('Sariya kaafi patla ho to engineer extra sariya ki salah dega', 'सरिया काफ़ी पतला हो तो इंजीनियर अतिरिक्त सरिया की सलाह देगा')];
      r.dont = L('Jung lage sariya par seedha plaster mat karo.', 'जंग लगे सरिया पर सीधे प्लास्टर मत करें।');
      r.videos = [{ title: L('Sariya jung repair', 'सरिया जंग की मरम्मत'), url: yt('rusted rebar repair hindi') }];
      r.query = pe.toLowerCase() + ' sariya jung repair hindi';
    } else {
      r.sev = 2;
      r.title = L(pn + ' me problem', pn + ' में समस्या');
      r.desc = L('Photo aur jawab se problem saaf nahi ho rahi. Paas se aur door se 2-3 photo aur lo, taaki sahi andaza lag sake.', 'फ़ोटो और जवाब से समस्या साफ़ नहीं हो रही। पास से और दूर से 2-3 फ़ोटो और लें, ताकि सही अंदाज़ा लग सके।');
      r.cause = [L('Abhi pakka kehna mushkil', 'अभी पक्का कहना मुश्किल')];
      r.checks = [L('Problem wali jagah ki paas se saaf photo lo', 'समस्या वाली जगह की पास से साफ़ फ़ोटो लें'), L('Poori deewar ya chhat ki door se photo lo', 'पूरी दीवार या छत की दूर से फ़ोटो लें'), L('Kab se hai aur badh raha hai ya nahi, note karo', 'कब से है और बढ़ रहा है या नहीं, नोट करें'), L('Aas-paas seelan ya crack dekho', 'आस-पास सीलन या दरार देखें')];
      r.repair = [L('Engineer ko photo bhej kar salah lo', 'इंजीनियर को फ़ोटो भेजकर सलाह लें')];
      r.dont = L('Andaze se repair mat karwao.', 'अंदाज़े से मरम्मत मत करवाएँ।');
      r.videos = [{ title: L(pn + ' ki common problems', pn + ' की आम समस्याएँ'), url: yt(pe + ' common problems hindi') }];
      r.query = pe.toLowerCase() + ' problem solution hindi';
    }
    var notes = [];
    if (ans.since === 'growing' && r.sev < 3) { r.sev++; notes.push(L('Problem mahino se badh rahi hai, isliye severity badhai gayi.', 'समस्या महीनों से बढ़ रही है, इसलिए गंभीरता बढ़ाई गई।')); }
    if (ans.trend === 'more' && r.sev < 3) { r.sev++; notes.push(L('Pichhli photo se problem badhi hai, isliye severity badhai gayi.', 'पिछली फ़ोटो से समस्या बढ़ी है, इसलिए गंभीरता बढ़ाई गई।')); }
    if (ans.trend === 'less' && r.sev > 1) { r.sev--; notes.push(L('Pichhli photo se problem kam hui hai, achha sanket.', 'पिछली फ़ोटो से समस्या कम हुई है, अच्छा संकेत।')); }
    if (ans.trend === 'same') notes.push(L('Problem pichhli baar jaisi hi hai, nazar rakhte raho.', 'समस्या पिछली बार जैसी ही है, नज़र रखते रहें।'));
    if (ans.stage === 'ongoing' && r.sev >= 2) notes.push(L('Kaam chal raha hai: is hisse ke upar aage ka kaam rukwao jab tak problem samajh na aaye.', 'काम चल रहा है: इस हिस्से के ऊपर आगे का काम रुकवाएँ जब तक समस्या समझ न आए।'));
    r.notes = notes;
    return r;
  };

  SHO.resultText = function (c, lang) {
    var r = SHO.analyze(c.ans, lang);
    var hi = lang ? lang === 'hi' : SHO.hi();
    var L = function (a, b) { return hi ? b : a; };
    var sevT = r.sev === 3 ? L('Engineer bulao', 'इंजीनियर बुलाएँ') : r.sev === 2 ? L('Dhyan do', 'ध्यान दें') : L('Normal', 'सामान्य');
    var t = r.title + '. ' + L('Gambhirta', 'गंभीरता') + ': ' + sevT + '. ' + r.desc + ' ';
    t += L('Ye check karo: ', 'यह जाँचें: ') + r.checks.join('. ') + '. ';
    t += L('Theek kaise hoga: ', 'ठीक कैसे होगा: ') + r.repair.join('. ') + '. ';
    t += L('Kya na karein: ', 'क्या न करें: ') + r.dont;
    return t;
  };

  /* ---------- Calculators ---------- */
  var FT3_PER_M3 = 35.3147, BAG_M3 = 0.0347;
  SHO.MIXES = { M20: [1, 1.5, 3], M15: [1, 2, 4], M10: [1, 3, 6] };
  SHO.toM = function (v, unit) { return unit === 'ft' ? v * 0.3048 : v; };
  SHO.calcConcrete = function (l, w, t, unit, mix, count) {
    var vol = SHO.toM(l, unit) * SHO.toM(w, unit) * SHO.toM(t, unit) * (count || 1);
    var m = SHO.MIXES[mix] || SHO.MIXES.M20, sum = m[0] + m[1] + m[2];
    var dry = vol * 1.54;
    var cement = dry * m[0] / sum, sand = dry * m[1] / sum, agg = dry * m[2] / sum;
    return { vol: vol, volFt: vol * FT3_PER_M3, bags: cement / BAG_M3, sandFt: sand * FT3_PER_M3, aggFt: agg * FT3_PER_M3, water: cement / BAG_M3 * 50 * 0.5 };
  };
  SHO.calcBrick = function (l, h, thick, unit, ratio) {
    var tm = thick === '4.5' ? 0.115 : 0.23;
    var vol = SHO.toM(l, unit) * SHO.toM(h, unit) * tm;
    var bricks = vol * 500 * 1.05;
    var dryMortar = vol * 0.30;
    var r = ratio || 6;
    return { vol: vol, bricks: bricks, bags: dryMortar / (r + 1) / BAG_M3, sandFt: dryMortar * r / (r + 1) * FT3_PER_M3 };
  };
  SHO.calcPlaster = function (l, h, unit, mm, ratio) {
    var area = SHO.toM(l, unit) * SHO.toM(h, unit);
    var dry = area * (mm / 1000) * 1.2 * 1.27;
    var r = ratio || 4;
    return { area: area, areaFt: area * 10.7639, bags: dry / (r + 1) / BAG_M3, sandFt: dry * r / (r + 1) * FT3_PER_M3 };
  };
  SHO.STEEL_RULE = { slab: [80, 100], beam: [120, 160], column: [160, 200], footing: [70, 100] };
  SHO.barWeight = function (d) { return d * d / 162; };
})();
