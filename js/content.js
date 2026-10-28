/* Smart House Owner – app content. Every text is [Hinglish, हिंदी]. */
(function () {
  var yt = function (q) { return 'https://www.youtube.com/results?search_query=' + encodeURIComponent(q); };

  var STAGES = [
    { id: 'foundation', name: ['Foundation', 'नींव'], intro: ['Neev ghar ka sabse zaroori hissa hai. Baad me sudhaarna lagbhag namumkin.', 'नींव घर का सबसे ज़रूरी हिस्सा है। बाद में सुधारना लगभग नामुमकिन।'],
      items: [
        ['Soil test hua hai aur foundation design engineer ne banaya hai', 'मिट्टी की जाँच हुई है और नींव का डिज़ाइन इंजीनियर ने बनाया है'],
        ['Gaddhe ki gehraai aur chaudai naksha ke hisaab se hai', 'गड्ढे की गहराई और चौड़ाई नक्शे के अनुसार है'],
        ['PCC (base concrete) bichhaya gaya, mitti par seedha sariya nahi', 'PCC (बेस कंक्रीट) बिछाया गया, मिट्टी पर सीधे सरिया नहीं'],
        ['Footing ke sariya ki spacing aur size drawing se milta hai', 'फ़ुटिंग के सरिया की दूरी और साइज़ ड्रॉइंग से मिलते हैं'],
        ['Sariya ke neeche cover block (lagbhag 50 mm) lage hain', 'सरिया के नीचे कवर ब्लॉक (लगभग 50 मिमी) लगे हैं'],
        ['Anti-termite (deemak) treatment hua hai', 'दीमक-रोधी ट्रीटमेंट हुआ है']
      ],
      ask: [
        ['Soil test ki report kahan hai?', 'मिट्टी की जाँच की रिपोर्ट कहाँ है?'],
        ['Footing ki gehraai kitni rakhi hai aur kis drawing se?', 'फ़ुटिंग की गहराई कितनी रखी है और किस ड्रॉइंग से?'],
        ['Deemak ka treatment kab aur kaunsi dawa se hoga?', 'दीमक का ट्रीटमेंट कब और कौन-सी दवा से होगा?']
      ],
      videos: [[['Foundation kaise check karein', 'नींव कैसे जाँचें'], 'house foundation checking hindi'], [['Footing sariya aur cover block', 'फ़ुटिंग सरिया और कवर ब्लॉक'], 'footing reinforcement cover block hindi']] },

    { id: 'column', name: ['Column', 'कॉलम'], intro: ['Column seedha aur majboot hona chahiye, poora bhaar isi par hai.', 'कॉलम सीधा और मज़बूत होना चाहिए, पूरा भार इसी पर है।'],
      items: [
        ['Column ka sariya bilkul seedha khada hai (sahul se check)', 'कॉलम का सरिया बिल्कुल सीधा खड़ा है (साहुल से जाँचें)'],
        ['Stirrups (ring) ki spacing drawing ke hisaab se hai', 'रिंग (स्टिरप) की दूरी ड्रॉइंग के अनुसार है'],
        ['Ring ke hook 135° mude hue hain, khule nahi', 'रिंग के हुक 135° मुड़े हुए हैं, खुले नहीं'],
        ['Cover block lage hain (lagbhag 40 mm)', 'कवर ब्लॉक लगे हैं (लगभग 40 मिमी)'],
        ['Shuttering tight aur seedhi hai, kahin gap nahi', 'शटरिंग टाइट और सीधी है, कहीं गैप नहीं'],
        ['Concrete daalte waqt vibrator use hua', 'कंक्रीट डालते समय वाइब्रेटर इस्तेमाल हुआ']
      ],
      ask: [
        ['Column ka size aur sariya kitne mm ka hai, drawing dikhao', 'कॉलम का साइज़ और सरिया कितने मिमी का है, ड्रॉइंग दिखाइए'],
        ['Vibrator site par hai ya kiraye par aayega?', 'वाइब्रेटर साइट पर है या किराये पर आएगा?'],
        ['Shuttering kitne din baad khologe?', 'शटरिंग कितने दिन बाद खोलेंगे?']
      ],
      videos: [[['Column sariya aur ring check', 'कॉलम सरिया और रिंग जाँच'], 'column reinforcement stirrups checking hindi'], [['Column shuttering aur casting', 'कॉलम शटरिंग और ढलाई'], 'column shuttering casting hindi']] },

    { id: 'beam', name: ['Beam', 'बीम'], intro: ['Beam slab ka bhaar column tak le jaati hai.', 'बीम स्लैब का भार कॉलम तक ले जाती है।'],
      items: [
        ['Neeche aur side me cover block lage hain', 'नीचे और साइड में कवर ब्लॉक लगे हैं'],
        ['Main sariya ki ginti aur size drawing se milta hai', 'मुख्य सरिया की गिनती और साइज़ ड्रॉइंग से मिलते हैं'],
        ['Support (column) ke paas ring paas-paas lagi hain', 'सपोर्ट (कॉलम) के पास रिंग पास-पास लगी हैं'],
        ['Sabhi sariya ka jod (lap) ek hi jagah nahi hai', 'सभी सरियों का जोड़ (लैप) एक ही जगह नहीं है'],
        ['Beam ki shuttering level me hai, jhuki nahi', 'बीम की शटरिंग लेवल में है, झुकी नहीं']
      ],
      ask: [
        ['Lap kahan diya hai aur kitni lambai ka?', 'लैप कहाँ दिया है और कितनी लंबाई का?'],
        ['Beam ke neeche ke prop (balli) kitne paas hain?', 'बीम के नीचे के प्रॉप (बल्ली) कितने पास हैं?'],
        ['Beam ki side shuttering aur neeche ki shuttering kab khulegi?', 'बीम की साइड और नीचे की शटरिंग कब खुलेगी?']
      ],
      videos: [[['Beam reinforcement check', 'बीम सरिया जाँच'], 'beam reinforcement checking hindi'], [['Lap length kya hoti hai', 'लैप लेंथ क्या होती है'], 'lap length beam hindi']] },

    { id: 'slab', name: ['Slab', 'स्लैब'], intro: ['Chhat ki casting se pehle ye sab zaroor dekho.', 'छत की ढलाई से पहले यह सब ज़रूर देखें।'],
      items: [
        ['Sariya spacing drawing ke hisaab se hai', 'सरिया की दूरी ड्रॉइंग के अनुसार है'],
        ['Cover block neeche lage hain (lagbhag 20 mm)', 'नीचे कवर ब्लॉक लगे हैं (लगभग 20 मिमी)'],
        ['Chair bar se upar ka jaal utha hua hai', 'चेयर बार से ऊपर का जाल उठा हुआ है'],
        ['Shuttering me koi gap ya jhol nahi', 'शटरिंग में कोई गैप या झोल नहीं'],
        ['Bijli ke pipe aur box casting se pehle lag gaye', 'बिजली के पाइप और बॉक्स ढलाई से पहले लग गए'],
        ['Curing ka plan hai (kam se kam 7-14 din)', 'क्यूरिंग का प्लान है (कम से कम 7-14 दिन)']
      ],
      ask: [
        ['Concrete ka mix (M20) kaise banega, machine ya haath se?', 'कंक्रीट का मिक्स (M20) कैसे बनेगा, मशीन से या हाथ से?'],
        ['Cube test ke liye namune (cube) bharoge?', 'क्यूब टेस्ट के लिए नमूने (क्यूब) भरेंगे?'],
        ['Curing ka paani roz kaun daalega?', 'क्यूरिंग का पानी रोज़ कौन डालेगा?']
      ],
      videos: [[['Slab casting se pehle checklist', 'स्लैब ढलाई से पहले चेकलिस्ट'], 'slab casting checklist hindi'], [['Slab curing kaise karein', 'स्लैब की क्यूरिंग कैसे करें'], 'slab curing kaise kare']] },

    { id: 'brick', name: ['Brickwork', 'ईंट की चिनाई'], intro: ['Deewar seedhi aur joint barabar hone chahiye.', 'दीवार सीधी और जोड़ बराबर होने चाहिए।'],
      items: [
        ['Eent lagane se pehle bhigoi gayi', 'ईंट लगाने से पहले भिगोई गई'],
        ['Mortar joint lagbhag 10 mm, barabar', 'मसाले का जोड़ लगभग 10 मिमी, बराबर'],
        ['Deewar sahul aur level me hai', 'दीवार साहुल और लेवल में है'],
        ['Upar-neeche ke vertical joint ek line me nahi', 'ऊपर-नीचे के खड़े जोड़ एक लाइन में नहीं'],
        ['Darwaze-khidki ke upar lintel daala gaya', 'दरवाज़े-खिड़की के ऊपर लिंटल डाला गया'],
        ['Deewar ki curing 7 din tak', 'दीवार की क्यूरिंग 7 दिन तक']
      ],
      ask: [
        ['Mortar ka mix kya hai (1:6 ya 1:4)?', 'मसाले का मिक्स क्या है (1:6 या 1:4)?'],
        ['Ek din me kitni oonchai tak chinai karoge?', 'एक दिन में कितनी ऊँचाई तक चिनाई करेंगे?'],
        ['Eent kis bhatte se aur kaunsi class ki hai?', 'ईंट किस भट्टे से और कौन-सी क्लास की है?']
      ],
      videos: [[['Brickwork quality check', 'चिनाई की क्वालिटी जाँच'], 'brickwork quality check hindi'], [['Eent ki chunai ke niyam', 'ईंट की चिनाई के नियम'], 'brick masonry rules hindi']] },

    { id: 'plaster', name: ['Plaster', 'प्लास्टर'], intro: ['Plaster se pehle aur baad me ye check karo.', 'प्लास्टर से पहले और बाद में यह जाँचें।'],
      items: [
        ['Plaster se pehle surface geela kiya gaya', 'प्लास्टर से पहले सतह गीली की गई'],
        ['RCC aur eent ke jod par jaali (chicken mesh) lagi hai', 'RCC और ईंट के जोड़ पर जाली (चिकन मेश) लगी है'],
        ['Thickness barabar hai, kahin bahut mota nahi', 'मोटाई बराबर है, कहीं बहुत मोटा नहीं'],
        ['Hathodi se thokne par khokhli awaaz nahi aati', 'हथौड़ी से ठोकने पर खोखली आवाज़ नहीं आती'],
        ['Plaster ki curing 7 din tak', 'प्लास्टर की क्यूरिंग 7 दिन तक']
      ],
      ask: [
        ['Andar aur bahar ka plaster kitna mota hoga?', 'अंदर और बाहर का प्लास्टर कितना मोटा होगा?'],
        ['Plumbing aur wiring ka kaam plaster se pehle poora hai?', 'प्लंबिंग और वायरिंग का काम प्लास्टर से पहले पूरा है?'],
        ['Jaali kahan-kahan lagaoge?', 'जाली कहाँ-कहाँ लगाएँगे?']
      ],
      videos: [[['Plaster quality kaise check karein', 'प्लास्टर की क्वालिटी कैसे जाँचें'], 'plaster quality check hindi'], [['Plaster me crack kyun aata hai', 'प्लास्टर में दरार क्यों आती है'], 'plaster crack reason hindi']] },

    { id: 'plumbing', name: ['Plumbing', 'प्लंबिंग'], intro: ['Deewar me chhupne se pehle pipes ko test karo.', 'दीवार में छिपने से पहले पाइपों को टेस्ट करें।'],
      items: [
        ['ISI mark wale pipe aur fitting', 'ISI मार्क वाले पाइप और फ़िटिंग'],
        ['Plaster se pehle pressure test hua', 'प्लास्टर से पहले प्रेशर टेस्ट हुआ'],
        ['Drain pipe me sahi dhalaan (slope) hai', 'ड्रेन पाइप में सही ढलान है'],
        ['Pipe ke raaste ki photo li gayi', 'पाइप के रास्ते की फ़ोटो ली गई'],
        ['Bathroom floor ka slope drain ki taraf', 'बाथरूम फ़र्श का ढलान नाली की तरफ़']
      ],
      ask: [
        ['Pipe kis brand ke aur kitne mm ke hain?', 'पाइप किस ब्रांड के और कितने मिमी के हैं?'],
        ['Pressure test kab karoge, main saamne rahunga', 'प्रेशर टेस्ट कब करेंगे, मैं सामने रहूँगा'],
        ['Gate valve har bathroom me lagega?', 'गेट वाल्व हर बाथरूम में लगेगा?']
      ],
      videos: [[['Plumbing pressure test', 'प्लंबिंग प्रेशर टेस्ट'], 'plumbing pressure test hindi'], [['Bathroom plumbing galtiyan', 'बाथरूम प्लंबिंग की ग़लतियाँ'], 'bathroom plumbing mistakes hindi']] },

    { id: 'electrical', name: ['Electrical', 'बिजली'], intro: ['Safety sabse pehle. Wiring chhupne se pehle check karo.', 'सुरक्षा सबसे पहले। वायरिंग छिपने से पहले जाँचें।'],
      items: [
        ['ISI mark wali wire, sahi mota-pan (AC, geyser ke liye alag)', 'ISI मार्क वाली तार, सही मोटाई (AC, गीज़र के लिए अलग)'],
        ['Wire conduit pipe ke andar hai', 'तार कंड्यूट पाइप के अंदर है'],
        ['Earthing ki gayi hai', 'अर्थिंग की गई है'],
        ['MCB / distribution board laga hai', 'MCB / डिस्ट्रीब्यूशन बोर्ड लगा है'],
        ['Wiring ke raaste ki photo li gayi', 'वायरिंग के रास्ते की फ़ोटो ली गई']
      ],
      ask: [
        ['Kis kamre me kitne point aur socket honge, list do', 'किस कमरे में कितने पॉइंट और सॉकेट होंगे, सूची दीजिए'],
        ['AC aur geyser ke liye kitne sq.mm ki wire?', 'AC और गीज़र के लिए कितने वर्ग मिमी की तार?'],
        ['Earthing kitni gehri aur kahan karoge?', 'अर्थिंग कितनी गहरी और कहाँ करेंगे?']
      ],
      videos: [[['House wiring check', 'घर की वायरिंग जाँच'], 'house wiring checking hindi'], [['Earthing kaise hoti hai', 'अर्थिंग कैसे होती है'], 'earthing kaise kare ghar hindi']] },

    { id: 'waterproof', name: ['Waterproofing', 'वॉटरप्रूफ़िंग'], intro: ['Seelan ki problem yahi se rokni hai.', 'सीलन की समस्या यहीं से रोकनी है।'],
      items: [
        ['Chhat par paani ke nikaas ki taraf slope hai', 'छत पर पानी निकासी की तरफ़ ढलान है'],
        ['Bathroom me 24-48 ghante paani bhar kar test hua', 'बाथरूम में 24-48 घंटे पानी भरकर टेस्ट हुआ'],
        ['Kono par gola (coving) banaya gaya', 'कोनों पर गोला (कोविंग) बनाया गया'],
        ['Pipe ke chhed ke aas-paas sealing', 'पाइप के छेद के आस-पास सीलिंग'],
        ['Parapet aur chhat ke jod par treatment', 'मुंडेर और छत के जोड़ पर ट्रीटमेंट']
      ],
      ask: [
        ['Waterproofing ka kaunsa product aur kitni coat?', 'वॉटरप्रूफ़िंग का कौन-सा प्रोडक्ट और कितनी कोट?'],
        ['Ponding test kitne ghante ka hoga?', 'पॉन्डिंग टेस्ट कितने घंटे का होगा?'],
        ['Waterproofing ki guarantee kitne saal?', 'वॉटरप्रूफ़िंग की गारंटी कितने साल?']
      ],
      videos: [[['Chhat waterproofing', 'छत की वॉटरप्रूफ़िंग'], 'terrace waterproofing hindi'], [['Bathroom ponding test', 'बाथरूम पॉन्डिंग टेस्ट'], 'bathroom waterproofing ponding test hindi']] },

    { id: 'finishing', name: ['Finishing', 'फ़िनिशिंग'], intro: ['Aakhri stage, par galtiyan yahan bhi mehengi.', 'आख़िरी स्टेज, पर ग़लतियाँ यहाँ भी महँगी।'],
      items: [
        ['Tile level me hai, thokne par khokhli nahi', 'टाइल लेवल में है, ठोकने पर खोखली नहीं'],
        ['Darwaze-khidki aasani se band hote hain', 'दरवाज़े-खिड़की आसानी से बंद होते हैं'],
        ['Paint se pehle deewar sookh chuki thi', 'पेंट से पहले दीवार सूख चुकी थी'],
        ['Saare nal, switch, flush chal rahe hain', 'सभी नल, स्विच, फ़्लश चल रहे हैं'],
        ['Paani daal kar final leak check', 'पानी डालकर अंतिम लीक जाँच']
      ],
      ask: [
        ['Tile kis adhesive se lagegi, cement ya tile adhesive?', 'टाइल किस चिपकने वाले से लगेगी, सीमेंट या टाइल एडहेसिव?'],
        ['Kaam ke baad kitne mahine tak kharabi ki zimmedari loge?', 'काम के बाद कितने महीने तक ख़राबी की ज़िम्मेदारी लेंगे?'],
        ['Bachi hui tiles aur paint ka kya hoga?', 'बची हुई टाइलें और पेंट का क्या होगा?']
      ],
      videos: [[['Tile laying check', 'टाइल लगाने की जाँच'], 'tile hollow check hindi'], [['Naye ghar ki final inspection', 'नए घर की अंतिम जाँच'], 'new house final inspection hindi']] }
  ];
  STAGES.forEach(function (s) { s.videos = s.videos.map(function (v) { return { title: v[0], url: yt(v[1]) }; }); });

  var MISTAKES = [
    { title: ['Kaagaz aur permission', 'काग़ज़ और अनुमति'], items: [
      [['Plot ke papers check kiye bina kaam', 'प्लॉट के काग़ज़ जाँचे बिना काम'], ['Registry, naamantaran, khasra/khatauni aur encumbrance (koi loan ya case) pehle check karo.', 'रजिस्ट्री, नामांतरण, खसरा/खतौनी और एन्कम्ब्रेंस (कोई लोन या केस) पहले जाँचें।']],
      [['Naksha pass kiye bina banana', 'नक्शा पास कराए बिना बनाना'], ['Baad me penalty ya todne ka notice aa sakta hai. Building permission pehle lo.', 'बाद में जुर्माना या तोड़ने का नोटिस आ सकता है। बिल्डिंग परमिशन पहले लें।']],
      [['Pass naksha se zyada manzil ya area', 'पास नक्शे से ज़्यादा मंज़िल या एरिया'], ['Loan, resale aur completion certificate me dikkat hoti hai.', 'लोन, रीसेल और कम्प्लीशन सर्टिफ़िकेट में दिक्कत होती है।']],
      [['Setback ka dhyan na rakhna', 'सेटबैक का ध्यान न रखना'], ['Aage-peeche aur side me chhodi jaane wali jagah naksha ke hisaab se chhodo.', 'आगे-पीछे और साइड में छोड़ी जाने वाली जगह नक्शे के अनुसार छोड़ें।']],
      [['Bijli-paani connection der se apply', 'बिजली-पानी कनेक्शन देर से अप्लाई'], ['Construction ke liye temporary connection aur baad ka permanent connection pehle se apply karo.', 'निर्माण के लिए अस्थायी कनेक्शन और बाद का स्थायी कनेक्शन पहले से अप्लाई करें।']]
    ] },
    { title: ['Thekedar ke saath', 'ठेकेदार के साथ'], items: [
      [['Likhit agreement na hona', 'लिखित एग्रीमेंट न होना'], ['Kaam, rate, material, samay aur payment stages sab likhit me lo, dono ke sign ke saath.', 'काम, रेट, मटेरियल, समय और पेमेंट स्टेज सब लिखित में लें, दोनों के हस्ताक्षर के साथ।']],
      [['Material ka brand aur grade na likhna', 'मटेरियल का ब्रांड और ग्रेड न लिखना'], ['Cement, sariya, pipe, wire ka brand aur grade agreement me likho.', 'सीमेंट, सरिया, पाइप, तार का ब्रांड और ग्रेड एग्रीमेंट में लिखें।']],
      [['Labour rate vs material ke saath rate', 'लेबर रेट बनाम मटेरियल के साथ रेट'], ['Sq.ft rate me kya-kya shaamil hai, saaf likhwao.', 'स्क्वेयर फ़ीट रेट में क्या-क्या शामिल है, साफ़ लिखवाएँ।']],
      [['Advance zyada de dena', 'एडवांस ज़्यादा दे देना'], ['Payment kaam ke stage ke hisaab se do, kaam se aage nahi.', 'पेमेंट काम के स्टेज के हिसाब से दें, काम से आगे नहीं।']],
      [['Deri par penalty na likhna', 'देरी पर पेनल्टी न लिखना'], ['Kaam khatam hone ki date aur deri ka niyam agreement me rakho.', 'काम ख़त्म होने की तारीख़ और देरी का नियम एग्रीमेंट में रखें।']],
      [['Extra kaam ka rate tay na karna', 'अतिरिक्त काम का रेट तय न करना'], ['Koi bhi extra kaam shuru hone se pehle rate likhit me tay karo.', 'कोई भी अतिरिक्त काम शुरू होने से पहले रेट लिखित में तय करें।']]
    ] },
    { title: ['Material me dhokha', 'मटेरियल में धोखा'], items: [
      [['Purani cement', 'पुरानी सीमेंट'], ['Bori par manufacturing date dekho. 3 mahine se purani cement kamzor hoti hai.', 'बोरी पर बनने की तारीख़ देखें। 3 महीने से पुरानी सीमेंट कमज़ोर होती है।']],
      [['Patla ya local sariya', 'पतला या लोकल सरिया'], ['ISI mark, brand aur grade (Fe 500) dekho. Ek metre ka vazan D²/162 kg se milao.', 'ISI मार्क, ब्रांड और ग्रेड (Fe 500) देखें। एक मीटर का वज़न D²/162 किलो से मिलाएँ।']],
      [['Ret me mitti', 'रेत में मिट्टी'], ['Bottle test karo: ret aur paani hila kar 3 ghante rakho, mitti ki parat 8% se kam ho.', 'बोतल टेस्ट करें: रेत और पानी हिलाकर 3 घंटे रखें, मिट्टी की परत 8% से कम हो।']],
      [['Kachchi eent', 'कच्ची ईंट'], ['Do eent takrao to dhaatu jaisi awaaz aaye. Nakhun se nishan na pade.', 'दो ईंट टकराएँ तो धातु जैसी आवाज़ आए। नाख़ून से निशान न पड़े।']],
      [['Bill aur site ka milaan na karna', 'बिल और साइट का मिलान न करना'], ['Har gaadi ka material gin kar bill se milao aur photo lo.', 'हर गाड़ी का मटेरियल गिनकर बिल से मिलाएँ और फ़ोटो लें।']]
    ] },
    { title: ['Kaam ki quality', 'काम की क्वालिटी'], items: [
      [['Soil test na karwana', 'मिट्टी की जाँच न करवाना'], ['Foundation andaze se banegi to baad me crack aur dhansaav ho sakta hai.', 'नींव अंदाज़े से बनेगी तो बाद में दरार और धँसाव हो सकता है।']],
      [['Structural drawing ke bina kaam', 'स्ट्रक्चरल ड्रॉइंग के बिना काम'], ['Column, beam, slab ka sariya engineer ki drawing se hi lagao, mistri ke andaze se nahi.', 'कॉलम, बीम, स्लैब का सरिया इंजीनियर की ड्रॉइंग से ही लगाएँ, मिस्त्री के अंदाज़े से नहीं।']],
      [['Curing kam karna', 'क्यूरिंग कम करना'], ['Sabse aam galti. Slab me 14 din, deewar aur plaster me 7 din tak paani do.', 'सबसे आम ग़लती। स्लैब में 14 दिन, दीवार और प्लास्टर में 7 दिन तक पानी दें।']],
      [['Shuttering jaldi kholna', 'शटरिंग जल्दी खोलना'], ['Slab ke neeche ki shuttering aam taur par 14 din se pehle na kholo (engineer ki salah lo).', 'स्लैब के नीचे की शटरिंग आम तौर पर 14 दिन से पहले न खोलें (इंजीनियर की सलाह लें)।']],
      [['Vibrator na lagana', 'वाइब्रेटर न लगाना'], ['Concrete me khokhlapan (honeycombing) aata hai aur majbooti ghatti hai.', 'कंक्रीट में खोखलापन (हनीकॉम्बिंग) आता है और मज़बूती घटती है।']],
      [['Waterproofing me kanjoosi', 'वॉटरप्रूफ़िंग में कंजूसी'], ['Baad me seelan theek karna kai guna mehenga padta hai.', 'बाद में सीलन ठीक करना कई गुना महँगा पड़ता है।']],
      [['Pipe aur wiring ki photo na lena', 'पाइप और वायरिंग की फ़ोटो न लेना'], ['Plaster se pehle photo lo, baad me deewar me keel ya repair me kaam aayegi.', 'प्लास्टर से पहले फ़ोटो लें, बाद में दीवार में कील या मरम्मत में काम आएगी।']]
    ] },
    { title: ['Paisa aur budget', 'पैसा और बजट'], items: [
      [['Budget me extra na rakhna', 'बजट में अतिरिक्त न रखना'], ['Kul budget ka 10-15% alag rakho, beech me paisa khatam na ho.', 'कुल बजट का 10-15% अलग रखें, बीच में पैसा ख़त्म न हो।']],
      [['Bina hisaab ke payment', 'बिना हिसाब के पेमेंट'], ['Har payment app me likho, receipt ki photo ke saath.', 'हर पेमेंट ऐप में लिखें, रसीद की फ़ोटो के साथ।']],
      [['Home loan ki kisht ka stage na samajhna', 'होम लोन की किश्त का स्टेज न समझना'], ['Bank stage ke hisaab se paisa deta hai. Kaam ka plan usi se milao.', 'बैंक स्टेज के हिसाब से पैसा देता है। काम का प्लान उसी से मिलाएँ।']],
      [['Sab cash me dena', 'सब कैश में देना'], ['Bank transfer ya UPI se do, record rehta hai.', 'बैंक ट्रांसफ़र या UPI से दें, रिकॉर्ड रहता है।']]
    ] },
    { title: ['Design aur planning', 'डिज़ाइन और प्लानिंग'], items: [
      [['Bhavishya ki manzil ka plan na karna', 'भविष्य की मंज़िल का प्लान न करना'], ['Upar banana hai to foundation aur column pehle se usi hisaab se design karwao.', 'ऊपर बनाना है तो नींव और कॉलम पहले से उसी हिसाब से डिज़ाइन करवाएँ।']],
      [['Vaastu ke liye structure se samjhauta', 'वास्तु के लिए ढाँचे से समझौता'], ['Column ya beam hatana ya khisakana engineer se poochhe bina mat karo.', 'कॉलम या बीम हटाना या खिसकाना इंजीनियर से पूछे बिना मत करें।']],
      [['Drain slope galat', 'नाली का ढलान ग़लत'], ['Bathroom, kitchen aur chhat ka paani kidhar jayega, pehle tay karo.', 'बाथरूम, किचन और छत का पानी किधर जाएगा, पहले तय करें।']],
      [['Bijli ke point kam', 'बिजली के पॉइंट कम'], ['Har kamre ki zaroorat soch kar socket aur point pehle tay karo.', 'हर कमरे की ज़रूरत सोचकर सॉकेट और पॉइंट पहले तय करें।']],
      [['Tanki ka load soche bina', 'टंकी का भार सोचे बिना'], ['Paani ki tanki column ya beam ke upar rakho, beech slab par nahi.', 'पानी की टंकी कॉलम या बीम के ऊपर रखें, बीच स्लैब पर नहीं।']]
    ] },
    { title: ['Baad ki pareshani', 'बाद की परेशानी'], items: [
      [['Completion certificate na lena', 'कम्प्लीशन सर्टिफ़िकेट न लेना'], ['Bijli-paani connection, loan aur resale me iski zaroorat padti hai.', 'बिजली-पानी कनेक्शन, लोन और रीसेल में इसकी ज़रूरत पड़ती है।']],
      [['Property tax me naam na chadhwana', 'प्रॉपर्टी टैक्स में नाम न चढ़वाना'], ['Ghar banne ke baad nagar nigam/panchayat me record update karao.', 'घर बनने के बाद नगर निगम/पंचायत में रिकॉर्ड अपडेट कराएँ।']],
      [['Drawings aur bills na sambhalna', 'ड्रॉइंग और बिल न सँभालना'], ['App ki House health card report me sab ek jagah rakho.', 'ऐप की हाउस हेल्थ कार्ड रिपोर्ट में सब एक जगह रखें।']],
      [['Defect warranty na lena', 'डिफ़ेक्ट वारंटी न लेना'], ['Thekedar se kam se kam 6-12 mahine ki kharabi ki zimmedari likhit me lo.', 'ठेकेदार से कम से कम 6-12 महीने की ख़राबी की ज़िम्मेदारी लिखित में लें।']]
    ] }
  ];

  var QUALITY = [
    { name: ['Cement', 'सीमेंट'], tests: [
      ['Bori par manufacturing date dekho, 3 mahine se purani na ho', 'बोरी पर बनने की तारीख़ देखें, 3 महीने से पुरानी न हो'],
      ['Haath daalo to thanda lage, gaanth (lumps) na ho', 'हाथ डालें तो ठंडा लगे, गाँठ न हो'],
      ['Chutki bhar paani me daalo to kuch der tairne ke baad doobe', 'चुटकी भर पानी में डालें तो कुछ देर तैरने के बाद डूबे'],
      ['Ungliyon me masalne par chikna lage, ret jaisa nahi', 'उँगलियों में मसलने पर चिकना लगे, रेत जैसा नहीं'],
      ['Bori sil hui ho aur ISI mark ho', 'बोरी सिली हुई हो और ISI मार्क हो']
    ] },
    { name: ['Sariya (Steel)', 'सरिया (स्टील)'], tests: [
      ['ISI mark, brand aur grade (Fe 500 / Fe 500D) sariya par chhapa ho', 'ISI मार्क, ब्रांड और ग्रेड (Fe 500 / Fe 500D) सरिया पर छपा हो'],
      ['1 metre ka vazan = D×D÷162 kg. Jaise 12 mm = 0.89 kg/m', '1 मीटर का वज़न = D×D÷162 किलो। जैसे 12 मिमी = 0.89 किलो/मीटर'],
      ['Mota jung (parat utarne wala) na ho, halka laal rang chalta hai', 'मोटा जंग (परत उतरने वाला) न हो, हल्का लाल रंग चलता है'],
      ['Moda kar dekho, mod par darar na aaye', 'मोड़कर देखें, मोड़ पर दरार न आए'],
      ['Ribs (dhaariyan) saaf aur barabar hon', 'रिब्स (धारियाँ) साफ़ और बराबर हों']
    ] },
    { name: ['Ret (Sand)', 'रेत'], tests: [
      ['Bottle test: kaanch ki bottle me ret aur paani hilao, 3 ghante baad mitti ki parat 8% se kam ho', 'बोतल टेस्ट: काँच की बोतल में रेत और पानी हिलाएँ, 3 घंटे बाद मिट्टी की परत 8% से कम हो'],
      ['Mutthi me daba kar chhodo, haath par mitti na chipke', 'मुट्ठी में दबाकर छोड़ें, हाथ पर मिट्टी न चिपके'],
      ['Kankad, patte aur kachra na ho', 'कंकड़, पत्ते और कचरा न हो'],
      ['Plaster ke liye mahin, concrete ke liye mota ret', 'प्लास्टर के लिए महीन, कंक्रीट के लिए मोटी रेत']
    ] },
    { name: ['Eent (Brick)', 'ईंट'], tests: [
      ['Do eent takrao to khanakti (dhaatu jaisi) awaaz aaye', 'दो ईंट टकराएँ तो खनकती (धातु जैसी) आवाज़ आए'],
      ['Nakhun se khurachne par nishan na pade', 'नाख़ून से खुरचने पर निशान न पड़े'],
      ['1 metre oonchai se girane par na toote', '1 मीटर ऊँचाई से गिराने पर न टूटे'],
      ['Rang ek jaisa, kinaare seedhe, size barabar', 'रंग एक जैसा, किनारे सीधे, साइज़ बराबर'],
      ['24 ghante paani me rakhne ke baad vazan 20% se zyada na badhe', '24 घंटे पानी में रखने के बाद वज़न 20% से ज़्यादा न बढ़े']
    ] },
    { name: ['Gitti (Aggregate)', 'गिट्टी'], tests: [
      ['Size lagbhag 20 mm, ek jaisi', 'साइज़ लगभग 20 मिमी, एक जैसी'],
      ['Dhool aur mitti na ho, zarurat ho to dho lo', 'धूल और मिट्टी न हो, ज़रूरत हो तो धो लें'],
      ['Patli-chapti gitti kam ho, kone wali achhi', 'पतली-चपटी गिट्टी कम हो, कोने वाली अच्छी'],
      ['Haath se na toote', 'हाथ से न टूटे']
    ] },
    { name: ['Paani', 'पानी'], tests: [
      ['Pine layak saaf paani hi concrete aur curing me', 'पीने लायक साफ़ पानी ही कंक्रीट और क्यूरिंग में'],
      ['Khaara ya ganda paani sariya me jung lagata hai', 'खारा या गंदा पानी सरिया में जंग लगाता है']
    ] }
  ];

  var EXP_CATS = [
    ['material', ['Material', 'मटेरियल']],
    ['labour', ['Labour / Thekedar', 'मज़दूरी / ठेकेदार']],
    ['engineer', ['Engineer / Naksha', 'इंजीनियर / नक्शा']],
    ['permission', ['Permission / Fees', 'अनुमति / फ़ीस']],
    ['fitting', ['Fitting / Fixtures', 'फ़िटिंग']],
    ['other', ['Other', 'अन्य']]
  ];

  var REMINDER_TEMPLATES = [
    { title: ['Slab ki curing (roz paani)', 'स्लैब की क्यूरिंग (रोज़ पानी)'], days: 1, repeat: 14 },
    { title: ['Slab ki neeche ki shuttering kholna', 'स्लैब के नीचे की शटरिंग खोलना'], days: 14 },
    { title: ['Beam ki side shuttering kholna', 'बीम की साइड शटरिंग खोलना'], days: 2 },
    { title: ['Column ki shuttering kholna', 'कॉलम की शटरिंग खोलना'], days: 1 },
    { title: ['Deewar / plaster ki curing', 'दीवार / प्लास्टर की क्यूरिंग'], days: 1, repeat: 7 },
    { title: ['Cube test (7 din)', 'क्यूब टेस्ट (7 दिन)'], days: 7 },
    { title: ['Cube test (28 din)', 'क्यूब टेस्ट (28 दिन)'], days: 28 },
    { title: ['Dobara photo lo (problem badhi ya nahi)', 'दोबारा फ़ोटो लें (समस्या बढ़ी या नहीं)'], days: 7 }
  ];

  window.SHO_CONTENT = { STAGES: STAGES, MISTAKES: MISTAKES, QUALITY: QUALITY, EXP_CATS: EXP_CATS, REMINDER_TEMPLATES: REMINDER_TEMPLATES, yt: yt };
})();
