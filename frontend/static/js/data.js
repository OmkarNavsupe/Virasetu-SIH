/**
 * Virasetu Client-side Data Preset
 * Provides fast initial state & fallback data for seamless offline demonstration.
 */

const PRESET_SITES = [
  {
    id: 1,
    slug: "shaniwar-wada",
    name: "Shaniwar Wada",
    location: "Pune, Maharashtra",
    state: "Maharashtra",
    latitude: 18.5195,
    longitude: 73.8553,
    built_by: "Peshwa Baji Rao I",
    built_year: "1732 CE",
    history: "Shaniwar Wada was the historic seven-story fortified palace and administrative headquarters of the Peshwas of the Maratha Empire. Founded on Saturday (Shaniwar), 10 January 1730 by Peshwa Baji Rao I, it became the nerve center of Indian politics during the 18th century.",
    architecture: "A blend of Maratha and Mughal defensive architecture. Heavy stone masonry base with spiked teakwood gates, carved pillars, and the 16-petaled Hazari Karanje fountain.",
    historical_importance: "Political heart of the Maratha Confederacy. Symbolizes the zenith of Peshwa statecraft and administration.",
    famous_events: "Tragic 1773 assassination of fifth Peshwa Narayanrao; welcoming of Chimaji Appa and Mastani; great fire of 1828.",
    interesting_facts: "Foundation stone ceremoniously laid on a Saturday (Shaniwar). The Hazari Karanje fountain had a thousand synchronized water jets.",
    image_url: "/static/images/shaniwar_wada.svg"
  },
  {
    id: 2,
    slug: "sinhagad-fort",
    name: "Sinhagad Fort",
    location: "Pune, Maharashtra",
    state: "Maharashtra",
    latitude: 18.3663,
    longitude: 73.7558,
    built_by: "Sage Kaundinya / Fortified by Shivaji Maharaj",
    built_year: "14th Century CE (Fortified 1670 CE)",
    history: "Perched dramatically on a 1,312-meter Sahyadri ridge, Sinhagad ('Lion's Fort') was recaptured by Maratha warrior Tanaji Malusare in 1670, who scaled its vertical basalt cliffs at midnight.",
    architecture: "Sahyadri hill fortress architecture utilizing sheer basalt cliffs. Features Kalyan Darwaza, Pune Darwaza, and ancient subterranean Devtake water cisterns.",
    historical_importance: "Strategic bastion guarding the Deccan plateau. Immortalized by Shivaji Maharaj's words: 'Gad aala, pan Sinha gela' (The fort is won, but the Lion is gone).",
    famous_events: "Battle of Sinhagad in 1670; meeting site of Lokmanya Tilak and Mahatma Gandhi in 1915.",
    interesting_facts: "Natural rock-cut cisterns (Devtake) keep mineral water naturally chilled even in peak summer.",
    image_url: "/static/images/sinhagad_fort.svg"
  },
  {
    id: 3,
    slug: "aga-khan-palace",
    name: "Aga Khan Palace",
    location: "Pune, Maharashtra",
    state: "Maharashtra",
    latitude: 18.5524,
    longitude: 73.9015,
    built_by: "Sultan Muhammed Shah Aga Khan III",
    built_year: "1892 CE",
    history: "Built in 1892 as a famine relief project to provide wage employment to local villagers. Served as the internment camp for Mahatma Gandhi and Kasturba Gandhi during the 1942 Quit India Movement.",
    architecture: "Italianate colonial arches, spacious verandas, red-tiled roofs, and 19 acres of tranquil gardens preserving Gandhiji's living quarters.",
    historical_importance: "Sanctuary of India's Freedom Movement. Holds the sacred marble samadhis of Kasturba Gandhi and Mahadev Desai.",
    famous_events: "Mahatma Gandhi's 21-day fast in 1943; Kasturba Gandhi passed away in captivity here on 22 February 1944.",
    interesting_facts: "Donated to the Indian nation in 1969 by Aga Khan IV as a tribute to Gandhian non-violence.",
    image_url: "/static/images/aga_khan_palace.svg"
  },
  {
    id: 4,
    slug: "gateway-of-india",
    name: "Gateway of India",
    location: "Mumbai, Maharashtra",
    state: "Maharashtra",
    latitude: 18.9220,
    longitude: 72.8347,
    built_by: "George Wittet (Architect)",
    built_year: "1924 CE",
    history: "Erected on Mumbai's Apollo Bunder waterfront to commemorate the 1911 visit of King George V and Queen Mary. Later became the ceremonial exit point for the last British troops in 1948.",
    architecture: "Indo-Saracenic architectural triumph combining 16th-century Gujarati decorative latticework with a 26-meter Roman triumphal dome in yellow basalt.",
    historical_importance: "Iconic maritime gateway of Mumbai. Symbol of India's independence when the last British battalion departed through its arch.",
    famous_events: "Ceremonial departure of the Somerset Light Infantry on 28 February 1948 ending British military presence in India.",
    interesting_facts: "The central dome is 15 meters in diameter and constructed with locally quarried yellow basalt stone.",
    image_url: "/static/images/gateway_of_india.svg"
  },
  {
    id: 5,
    slug: "red-fort",
    name: "Red Fort (Lal Qila)",
    location: "Old Delhi, Delhi",
    state: "Delhi",
    latitude: 28.6562,
    longitude: 77.2410,
    built_by: "Mughal Emperor Shah Jahan",
    built_year: "1648 CE",
    history: "Commissioned in 1638 when Shah Jahan relocated the Mughal capital to Delhi (Shahjahanabad). Enclosed by massive red sandstone walls along the Yamuna.",
    architecture: "Octagonal fortress design with Lahori and Delhi gates, marble Diwan-i-Khas featuring pietra dura floral inlays, and the Nahr-i-Bihisht stream.",
    historical_importance: "National symbol of Indian sovereignty. First Prime Minister Jawaharlal Nehru unfurled the tricolor here on 15 August 1947.",
    famous_events: "1857 First War of Independence; annual Independence Day address by the Prime Minister from the Lahori Gate ramparts.",
    interesting_facts: "Amir Khusrau's gold verse in Diwan-i-Khas: 'If there is a paradise on earth, it is this, it is this, it is this'.",
    image_url: "/static/images/red_fort.svg"
  },
  {
    id: 6,
    slug: "taj-mahal",
    name: "Taj Mahal",
    location: "Agra, Uttar Pradesh",
    state: "Uttar Pradesh",
    latitude: 27.1751,
    longitude: 78.0421,
    built_by: "Mughal Emperor Shah Jahan",
    built_year: "1653 CE",
    history: "UNESCO World Heritage site and Seven Wonders of the World monument. Commissioned by Shah Jahan in memory of Mumtaz Mahal.",
    architecture: "Supreme symmetry in Makrana white marble, inlaid with 28 semi-precious stone varieties (pietra dura), Charbagh Persian gardens, and 4 minarets.",
    historical_importance: "Universal masterpiece of Indo-Islamic art attracting millions from across the globe.",
    famous_events: "Shah Jahan spent his final years gazing across the Yamuna at the Taj Mahal from Agra Fort.",
    interesting_facts: "The white marble reflects changing daylight hues: pinkish at dawn, pristine white in noon, and golden by moonlight.",
    image_url: "/static/images/taj_mahal.svg"
  }
];

const PRESET_ARTS = [
  {
    id: 1,
    slug: "warli-painting",
    name: "Warli Painting",
    origin: "North Sahyadri Range, Maharashtra",
    short_description: "Ancient tribal folk art composed of simple geometric shapes celebrating communion with nature, village folklore, and the circle of life.",
    about: "Warli painting is one of the oldest living art forms in the world, dating back to 2500 BCE. Practiced by the Warli tribe in coastal Maharashtra on mud and cow-dung walls using ground rice paste.",
    cultural_importance: "A sacred social language honoring Mother Nature (Hirva Dev) and fertility (Palghat Devi). Depicts village Tarpa dances, harvest, and animals.",
    current_status: "GI-tagged thriving revival, needing continuous youth apprenticeship to preserve authentic ritual knowledge.",
    traditional_methods: "Rice powder paint, gum water, bamboo reed brush applied to red ochre (geru) backgrounds.",
    image_url: "/static/images/warli_art.svg"
  },
  {
    id: 2,
    slug: "paithani-weaving",
    name: "Paithani Weaving",
    origin: "Paithan, Maharashtra",
    short_description: "Regal hand-woven silk sarees characterized by pure gold and silver zari borders and kaleidoscopic peacock motifs.",
    about: "The 'Queen of Sarees', Paithani has flourished for over 2,000 years dating back to the Satavahana Empire when ancient Pratishthana traded luxury silks with Rome.",
    cultural_importance: "Sacred heirloom in Maharashtrian weddings and court ceremonies, taking 1 to 6 months of handcrafting per saree.",
    current_status: "GI protected; facing competition from machine-made power-loom imitations.",
    traditional_methods: "Pure natural mulberry silk, electroplated silver/gold zari, hand-interlocked tapestry weave bobbins.",
    image_url: "/static/images/paithani_art.svg"
  },
  {
    id: 3,
    slug: "chitrakathi",
    name: "Chitrakathi",
    origin: "Pinguli, Sindhudurg, Maharashtra",
    short_description: "Endangered visual storytelling tradition blending handmade narrative paintings, leather shadow puppetry, and musical folklore.",
    about: "Practiced by the Thakar community of Pinguli. Traveling balladeers display sets of 40-50 story paintings to chant episodes from Indian epics.",
    cultural_importance: "500-year unbroken oral storytelling tradition once patronized by Shivaji Maharaj and Sawantwadi royalty.",
    current_status: "Critically Endangered. Preserved today by only a handful of dedicated artisan families.",
    traditional_methods: "Natural mineral dyes from stone, lamp black and turmeric on handmade paper and buffalo hide puppets.",
    image_url: "/static/images/chitrakathi_art.svg"
  },
  {
    id: 4,
    slug: "lavani",
    name: "Lavani",
    origin: "Maharashtra",
    short_description: "Vibrant traditional folk dance accompanied by rhythmic Dholki percussion and expressive theatrical poetry.",
    about: "Lavani blends rhythm, poetry, and histrionics. Originating during the Maratha Peshwa era, it served both as entertainment for soldiers and social critique.",
    cultural_importance: "Dancers wear traditional 9-yard Nauvari sarees, brass ghungroos, and perform fast-paced footwork synchronized to the Dholki.",
    current_status: "Popular across cultural stages with growing interest in youth workshops.",
    traditional_methods: "Guru-shishya parampara emphasizing vocal melody, Dholki taal variations, and facial Abhinaya.",
    image_url: "/static/images/lavani_art.svg"
  },
  {
    id: 5,
    slug: "kalamkari",
    name: "Kalamkari",
    origin: "Srikalahasti, Andhra Pradesh",
    short_description: "Ancient hand-drawn organic textile art using fine bamboo pens and 100% natural vegetable dyes.",
    about: "Derived from 'Kalam' (pen) and 'Kari' (craftsmanship). Over 3,000 years old, depicting mythological epics on temple cloth.",
    cultural_importance: "Every color is organic and non-toxic. Requires a rigorous 17-step treatment with milk, myrobalan nuts, and fermented iron rust.",
    current_status: "Internationally acclaimed with GI certification, supporting thousands of artisan households.",
    traditional_methods: "Bamboo reed pen drawing, cow milk wash, natural vegetable boiling with madder and indigo.",
    image_url: "/static/images/kalamkari_art.svg"
  },
  {
    id: 6,
    slug: "traditional-pottery",
    name: "Traditional Pottery & Terracotta",
    origin: "Pan-India Craft Guilds",
    short_description: "Earthy, sustainable terracotta sculpting and wheel-thrown earthenware preserving centuries of indigenous pottery traditions.",
    about: "One of humanity's earliest arts, dating back to Mohenjo-daro. Village potters (Kumbhars) shape local river clay into cooling matkas, diyas, and planters.",
    cultural_importance: "100% organic, biodegradable, and sustainable craft embodying the mother earth (Prithvi).",
    current_status: "Active nationwide with modern innovations in studio pottery and eco-friendly cookware.",
    traditional_methods: "Manual potter's wheel (Chak), wooden paddle shaping, red slip glaze, low-temperature chaff firing.",
    image_url: "/static/images/pottery_art.svg"
  }
];
