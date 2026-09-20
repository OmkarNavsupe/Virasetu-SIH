"""
Virasetu Database Seeding Script
Initializes SQLite database with authentic Indian heritage sites, traditional arts,
teacher profiles, quizzes, and initial demo user.
"""

import os
import sqlite3

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, "database", "virasetu.db")
SCHEMA_PATH = os.path.join(BASE_DIR, "database", "schema.sql")

# Inline schema as fallback — used if schema.sql is not accessible at runtime
# (e.g. Vercel functions that don't bundle non-Python files).
SCHEMA_SQL = """
CREATE TABLE IF NOT EXISTS heritage_sites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    state TEXT NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    history TEXT NOT NULL,
    architecture TEXT NOT NULL,
    historical_importance TEXT NOT NULL,
    famous_events TEXT NOT NULL,
    interesting_facts TEXT NOT NULL,
    image_url TEXT NOT NULL,
    built_by TEXT,
    built_year TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS traditional_arts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    origin TEXT NOT NULL,
    short_description TEXT NOT NULL,
    about TEXT NOT NULL,
    cultural_importance TEXT NOT NULL,
    current_status TEXT NOT NULL,
    traditional_methods TEXT NOT NULL,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS teachers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    art_form_id INTEGER NOT NULL,
    experience_years INTEGER NOT NULL,
    location TEXT NOT NULL,
    teaching_mode TEXT NOT NULL,
    languages TEXT NOT NULL,
    rating REAL DEFAULT 4.8,
    reviews_count INTEGER DEFAULT 12,
    about TEXT NOT NULL,
    availability TEXT NOT NULL,
    email TEXT NOT NULL,
    photo_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(art_form_id) REFERENCES traditional_arts(id)
);
CREATE TABLE IF NOT EXISTS quizzes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    heritage_id INTEGER NOT NULL,
    question TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    correct_option TEXT NOT NULL,
    explanation TEXT NOT NULL,
    FOREIGN KEY(heritage_id) REFERENCES heritage_sites(id)
);
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS passport_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    entry_type TEXT NOT NULL,
    item_id INTEGER NOT NULL,
    item_name TEXT NOT NULL,
    extra_data TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
);
CREATE TABLE IF NOT EXISTS teacher_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    teacher_id INTEGER NOT NULL,
    teacher_name TEXT NOT NULL,
    art_form TEXT NOT NULL,
    student_name TEXT NOT NULL,
    student_email TEXT NOT NULL,
    learning_mode TEXT NOT NULL,
    preferred_timing TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(teacher_id) REFERENCES teachers(id)
);
"""

HERITAGE_SITES = [
    {
        "slug": "shaniwar-wada",
        "name": "Shaniwar Wada",
        "location": "Pune, Maharashtra",
        "state": "Maharashtra",
        "latitude": 18.5195,
        "longitude": 73.8553,
        "built_by": "Peshwa Baji Rao I",
        "built_year": "1732 CE",
        "history": "Shaniwar Wada was the historic seven-story fortified palace and administrative headquarters of the Peshwas of the Maratha Empire. Founded on Saturday (Shaniwar), 10 January 1730 by Peshwa Baji Rao I, it became the nerve center of Indian politics during the 18th century. It witnessed the zenith of Maratha military might and administration, but was tragically consumed by a mysterious fire in 1828 that burned for seven days.",
        "architecture": "A blend of Maratha and Mughal defensive architecture. The base walls are made of solid stone masonry, while the upper stories were constructed with teak wood and brick. The fortress features massive teak wood gates studded with heavy iron spikes to repel war elephants, fine carved pillars, a 16-petaled lotus fountain (Hazari Karanje), and five defensive bastions.",
        "historical_importance": "Served as the political capital of the vast Maratha Confederacy spanning across the Indian subcontinent. It symbolizes the rise of the Peshwas from prime ministers to de facto rulers of the empire.",
        "famous_events": "The fateful assassination of the young fifth Peshwa Narayanrao in August 1773 under political intrigue, inspiring enduring local folklore. The historic welcoming of warrior legends including Mastani, Chimaji Appa, and Madhavrao I.",
        "interesting_facts": "The foundation stone was laid on a Saturday, which is why it was christened 'Shaniwar' Wada. The Hazari Karanje (Fountain of a Thousand Jets) was one of the most intricate mechanical hydraulic wonders of 18th-century India.",
        "image_url": "/static/images/shaniwar_wada.svg"
    },
    {
        "slug": "sinhagad-fort",
        "name": "Sinhagad Fort",
        "location": "Pune, Maharashtra",
        "state": "Maharashtra",
        "latitude": 18.3663,
        "longitude": 73.7558,
        "built_by": "Sage Kaundinya / Rebuilt by Shivaji Maharaj",
        "built_year": "14th Century CE (Fortified 1670 CE)",
        "history": "Perched dramatically on an isolated cliff of the Sahyadri mountains at 1,312 meters above sea level, Sinhagad ('Lion's Fort') was previously known as Kondhana. It was captured by Chhatrapati Shivaji Maharaj in 1647. The fort earned its legendary place in Maratha history during the Battle of Sinhagad on 4 February 1670, when the fearless Maratha general Tanaji Malusare scaled the sheer precipice using a Bengal monitor lizard (Ghorpad) named Yashwanti and recaptured the fort from Mughal commander Udaybhan Rathod.",
        "architecture": "Classic Sahyadri hill fortress architecture utilizing sheer natural basalt cliffs as natural battlements. Features two main strategic entry gates: the Pune Darwaza on the north-east and Kalyan Darwaza on the south-east. Houses ancient rock-cut water cisterns (Devtake) holding sweet subterranean water year-round.",
        "historical_importance": "A premier defensive bastion guarding the strategic Deccan plateau. Following Tanaji's martyrdom in the recapture, Shivaji Maharaj famously lamented: 'Gad aala, pan Sinha gela' (The fort is won, but the Lion is gone), formally renaming Kondhana to Sinhagad.",
        "famous_events": "The midnight vertical ascent of the cliff in 1670; freedom fighter Lokmanya Bal Gangadhar Tilak used Sinhagad as a quiet retreat and met Mahatma Gandhi here in 1915.",
        "interesting_facts": "The natural basalt rock-cut cisterns (Devtake) provide naturally cooled, sweet mineral water that never dries up, even at the height of peak summer.",
        "image_url": "/static/images/sinhagad_fort.svg"
    },
    {
        "slug": "aga-khan-palace",
        "name": "Aga Khan Palace",
        "location": "Pune, Maharashtra",
        "state": "Maharashtra",
        "latitude": 18.5524,
        "longitude": 73.9015,
        "built_by": "Sultan Muhammed Shah Aga Khan III",
        "built_year": "1892 CE",
        "history": "Built in 1892 by Sultan Muhammed Shah Aga Khan III as a charitable act to provide employment to thousands of famine-stricken villagers across the Pune countryside. During the Quit India Movement in 1942, the British colonial government turned the palace into a high-security internment center for Mahatma Gandhi, his wife Kasturba Gandhi, and Gandhi's private secretary Mahadev Desai.",
        "architecture": "Graceful Italian arches, expansive manicured lawns, spacious colonnaded verandas, and red-tiled sloping roofs spread across 19 acres. The building houses authentic personal memorabilia, photographs, and the simple quarters where Gandhiji lived during his 21-month confinement.",
        "historical_importance": "A sanctified site of India's Freedom Movement. It preserves the marble samadhis (memorials) of Kasturba Gandhi and Mahadev Desai, both of whom passed away during their captivity inside the palace grounds.",
        "famous_events": "Mahatma Gandhi launched his 21-day hunger fast here in 1943. Kasturba Gandhi breathed her last in Gandhi's arms inside the palace on 22 February 1944.",
        "interesting_facts": "The palace was donated to the Indian people by Aga Khan IV in 1969 in honor of Mahatma Gandhi and his philosophy of Ahimsa (non-violence).",
        "image_url": "/static/images/aga_khan_palace.svg"
    },
    {
        "slug": "gateway-of-india",
        "name": "Gateway of India",
        "location": "Mumbai, Maharashtra",
        "state": "Maharashtra",
        "latitude": 18.9220,
        "longitude": 72.8347,
        "built_by": "George Wittet (Architect)",
        "built_year": "1924 CE",
        "history": "Erected on the waterfront overlooking the Arabian Sea at Apollo Bunder, the Gateway of India was built to commemorate the 1911 visit of King George V and Queen Mary to Mumbai (then Bombay). It served as the ceremonial entrance for British viceroys and governors entering India by sea.",
        "architecture": "Masterpiece of the Indo-Saracenic architectural style, synthesizing Islamic 16th-century Gujarati archways with European triumphal arch design. Constructed using golden-yellow basalt stone quarried locally from Kharodi and reinforced concrete.",
        "historical_importance": "While built to herald imperial dominion, it poignantly marked the formal end of the British Raj when the final British military battalion (First Battalion of the Somerset Light Infantry) marched through its arch onto waiting ships on 28 February 1948.",
        "famous_events": "The departure ceremony of the final British troops in 1948 marking the sovereign freedom of India. Today, it stands as the iconic symbol of Mumbai's maritime heritage.",
        "interesting_facts": "The central dome measures 15 meters (49 feet) in diameter and reaches a height of 26 meters (85 feet) above the Arabian sea waters.",
        "image_url": "/static/images/gateway_of_india.svg"
    },
    {
        "slug": "red-fort",
        "name": "Red Fort (Lal Qila)",
        "location": "Old Delhi, Delhi",
        "state": "Delhi",
        "latitude": 28.6562,
        "longitude": 77.2410,
        "built_by": "Mughal Emperor Shah Jahan",
        "built_year": "1648 CE",
        "history": "Commissioned in 1638 when Emperor Shah Jahan decided to shift the Mughal capital from Agra to Delhi (Shahjahanabad). For nearly two centuries, it served as the royal residence of the Mughal dynasty. On 15 August 1947, India's first Prime Minister, Jawaharlal Nehru, unfurled the Indian tricolor atop the Lahori Gate, establishing a national tradition celebrated every Independence Day.",
        "architecture": "Massive octagonal fortress enclosed by towering red sandstone walls spanning over 2.4 kilometers. Highlights include the Diwan-i-Aam (Hall of Public Audience), the Diwan-i-Khas (Hall of Private Audience) with delicate marble floral pietra dura inlay, the Nahr-i-Bihisht (Stream of Paradise), and the Pearl Mosque (Moti Masjid).",
        "historical_importance": "A supreme symbol of Indian sovereignty and historic statecraft. It embodies centuries of cultural synthesis in art, poetry, and civic architecture.",
        "famous_events": "Nadir Shah's raid in 1739; the pivotal 1857 First War of Independence where Bahadur Shah Zafar was proclaimed emperor by rebel sepoys; the annual Independence Day address to the nation by the Prime Minister.",
        "interesting_facts": "The famous Persian poet Amir Khusrau's verse is inscribed in gold lettering on the walls of Diwan-i-Khas: 'Agar firdaus bar roo-e zameen ast, hamin ast-o hamin ast-o hamin ast' (If there is a paradise on earth, it is this, it is this, it is this).",
        "image_url": "/static/images/red_fort.svg"
    },
    {
        "slug": "taj-mahal",
        "name": "Taj Mahal",
        "location": "Agra, Uttar Pradesh",
        "state": "Uttar Pradesh",
        "latitude": 27.1751,
        "longitude": 78.0421,
        "built_by": "Mughal Emperor Shah Jahan",
        "built_year": "1653 CE",
        "history": "A UNESCO World Heritage monument and one of the Seven Wonders of the World, the Taj Mahal is an ivory-white marble mausoleum on the southern bank of the Yamuna River. Shah Jahan commissioned it in 1631 in memory of his beloved chief empress, Mumtaz Mahal. Over 20,000 artisans, sculptors, and calligraphers laboured for over twenty years to complete this poetic testament of love.",
        "architecture": "The pinnacle of Mughal symmetry, engineering, and Persian-Indian design. Constructed from translucent Makrana white marble inlaid with 28 varieties of precious and semi-precious stones (pietra dura). Surrounded by a symmetrical Charbagh (four-quadrant Persian garden) and flanked by four 40-meter minarets subtly tilted outward to protect the central dome in case of earthquake.",
        "historical_importance": "Universally admired as the crown jewel of Indo-Islamic artistic achievement, attracting millions of world travelers, historians, and scholars annually.",
        "famous_events": "Shah Jahan spent his final years imprisoned in the nearby Agra Fort by his son Aurangzeb, gazing across the Yamuna River at the Taj Mahal.",
        "interesting_facts": "The marble changes hue throughout the day: a rosy pink blush at sunrise, milky white in bright daylight, and glittering golden under the full moonlight.",
        "image_url": "/static/images/taj_mahal.svg"
    }
]

TRADITIONAL_ARTS = [
    {
        "slug": "warli-painting",
        "name": "Warli Painting",
        "origin": "North Sahyadri Range, Maharashtra",
        "short_description": "Ancient tribal folk art composed of simple geometric shapes celebrating communion with nature, village folklore, and the circle of life.",
        "about": "Warli painting is one of the oldest living art forms in the world, dating back to 2500 BCE or earlier. Practiced by the indigenous Warli tribe living in the Sahyadri mountains of coastal Maharashtra, the paintings traditionally adorn the mud and cow-dung walls of tribal huts during weddings, harvests, and seasonal festivals.",
        "cultural_importance": "Warli art is not merely decorative; it is a sacred social language. It honors Mother Nature (Hirva Dev) and fertility (Palghat Devi). Unlike mythological murals, Warli depicts everyday human community life: sowing seeds, dancing in spirals (Tarpa dance), hunting, and living in gentle harmony with trees and birds.",
        "current_status": "Thriving modern revival, recognized with a Geographical Indication (GI) tag. However, traditional artisans require direct patronage and youth training to avoid commercial dilution.",
        "traditional_methods": "Uses a background made from mud, cow dung, and red ochre (geru). The white paint is formulated purely from ground rice powder mixed with water and edible tree gum. Painted using a chewed bamboo stick or chewed date-palm twig as a natural brush.",
        "image_url": "/static/images/warli_art.svg"
    },
    {
        "slug": "paithani-weaving",
        "name": "Paithani Weaving",
        "origin": "Paithan, Chhatrapati Sambhajinagar, Maharashtra",
        "short_description": "Regal hand-woven silk sarees characterized by pure gold and silver zari borders and kaleidoscopic peacock motifs.",
        "about": "Known as the 'Queen of Sarees', Paithani has flourished for over 2,000 years, dating back to the Satavahana Empire when Paithan (ancient Pratishthana) was a prosperous international silk and cotton trading port sending luxury fabrics to Rome.",
        "cultural_importance": "Considered an essential heirloom in Maharashtrian weddings and royal court ceremonies. Each authentic Paithani represents months of meticulous handcrafting on wooden pit looms without mechanical jacquards.",
        "current_status": "Geographical Indication (GI) protected. Facing severe competition from synthetic power-loom counterfeits, making authentic master weavers vital to preserve.",
        "traditional_methods": "Woven with pure natural mulberry silk and electroplated zari threads. The weaver passes colorful silk bobbins through shed threads entirely by hand, creating complex kaleidoscopic patterns such as the Morbangadi (peacock bangle) and Asawali (flowering vine).",
        "image_url": "/static/images/paithani_art.svg"
    },
    {
        "slug": "chitrakathi",
        "name": "Chitrakathi",
        "origin": "Pinguli, Sindhudurg, Maharashtra",
        "short_description": "Endangered visual storytelling tradition blending handmade narrative paintings, leather shadow puppetry, and musical folklore.",
        "about": "Practiced by the nomadic Thakar tribal community of Pinguli in the Konkan region of Maharashtra, Chitrakathi translates to 'storytelling through pictures' (Chitra = picture, Katha = story). Traveling artists carry series of 40-50 sequenced paintings to recount episodes from the Ramayana and Mahabharata.",
        "cultural_importance": "Preserves a 500-year-old unbroken oral history and puppetry tradition that once enjoyed royal patronage from Chhatrapati Shivaji Maharaj and the Sawantwadi rulers.",
        "current_status": "Critically Endangered. Only a handful of families in Pinguli village continue to practice and preserve the original scroll paintings and shadow puppets.",
        "traditional_methods": "Natural mineral and vegetable colors derived from stones, turmeric, lamp black, and tree bark painted on handmade paper or buffalo hide. Performed alongside vocal ballads accompanied by the Veena and Taal.",
        "image_url": "/static/images/chitrakathi_art.svg"
    },
    {
        "slug": "lavani",
        "name": "Lavani",
        "origin": "Maharashtra",
        "short_description": "Vibrant traditional folk dance accompanied by rhythmic Dholki percussion and expressive theatrical poetry.",
        "about": "Lavani comes from the word 'Lavanya', meaning grace and beauty. Originating in the 17th and 18th centuries during the Maratha Peshwa era, it served both as spirited entertainment for weary soldiers stationed in military encampments and as sharp social commentary.",
        "cultural_importance": "Lavani combines song, dance, rhythm, and expressive Abhinaya (histrionics). Performers wear traditional 9-yard Nauvari sarees, ghungroos (ankle bells), and perform intricate footwork synchronized to the pulsating beats of the Dholki.",
        "current_status": "Popular across regional theater and cultural festivals, with rising interest among youth seeking to learn classical folk rhythms and performance arts.",
        "traditional_methods": "Trained through oral guru-shishya parampara emphasizing breath control, Dholki taal mastery, fast-paced footwork, and subtle facial emoting.",
        "image_url": "/static/images/lavani_art.svg"
    },
    {
        "slug": "kalamkari",
        "name": "Kalamkari",
        "origin": "Srikalahasti & Machilipatnam, Andhra Pradesh",
        "short_description": "Ancient hand-drawn organic textile art using fine bamboo pens and 100% natural vegetable dyes.",
        "about": "Derived from Persian words 'Kalam' (pen) and 'Kari' (craftsmanship), Kalamkari dates back more than 3,000 years. It encompasses two distinct styles: the Srikalahasti style (free-hand religious narrative tapestries) and Machilipatnam style (intricate block printing).",
        "cultural_importance": "Used originally to decorate temple canopies, chariots, and sacred banners illustrating epics like the Ramayana and Bhagavata Purana. Every hue is extracted from nature without toxic chemicals.",
        "current_status": "Internationally acclaimed with GI certification, supporting thousands of cooperative artisan families in southern India.",
        "traditional_methods": "Involves a grueling 17-step organic process: treating raw cotton with cow milk and myrobalan nuts, drawing outlines with a sharp bamboo reed pen and fermented jaggery-iron rust ink, and dyeing with natural madder root, indigo, and pomegranate rind.",
        "image_url": "/static/images/kalamkari_art.svg"
    },
    {
        "slug": "traditional-pottery",
        "name": "Traditional Pottery & Terracotta",
        "origin": "Pan-India / Village Guilds (Maharashtra, Rajasthan, Bengal)",
        "short_description": "Earthy, sustainable terracotta sculpting and wheel-thrown earthenware preserving centuries of indigenous pottery traditions.",
        "about": "Pottery is one of humanity's earliest art forms, flourishing in India since the Indus Valley Civilization (Mohenjo-daro). Village potters (Kumbhars) shape local river clay into functional cooling matkas, oil lamps (diyas), ceremonial vessels, and intricate terracotta figurines.",
        "cultural_importance": "Represents the ultimate organic, zero-waste, eco-friendly craft. In Indian tradition, clay embodies the mother earth (Prithvi) and forms an essential part of rituals, festivals, and culinary storage.",
        "current_status": "Active nationwide with ongoing innovation in modern home decor, studio pottery, and sustainable culinary lifestyle products.",
        "traditional_methods": "Spinning on the wooden manual potter's wheel (Chak), paddling with wooden tools to thin walls, applying red slip (geru) clay glaze, and firing in low-temperature wood and chaff kilns (bhatti).",
        "image_url": "/static/images/pottery_art.svg"
    }
]

TEACHERS = [
    {
        "name": "Pandurang Ghorpade",
        "art_form_id": 1, # Warli Painting
        "experience_years": 22,
        "location": "Dahanu, Palghar, Maharashtra",
        "teaching_mode": "Hybrid",
        "languages": "Marathi, Hindi, English",
        "rating": 4.9,
        "reviews_count": 38,
        "about": "A celebrated Warli artist from the Dahanu tribal belt. Trained under village elders, Pandurang specializes in sacred Palghat wedding paintings and modern canvas interpretations. He has conducted workshops at the National Institute of Design and loves teaching beginners.",
        "availability": "Weekends & Evening Batches",
        "email": "pandurang.warli@virasetu.org",
        "photo_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&fit=crop&crop=faces"
    },
    {
        "name": "Sunita Kshirsagar",
        "art_form_id": 2, # Paithani Weaving
        "experience_years": 18,
        "location": "Paithan, Maharashtra",
        "teaching_mode": "Online & Offline",
        "languages": "Marathi, Hindi",
        "rating": 4.8,
        "reviews_count": 27,
        "about": "4th generation master weaver in historic Paithan. Sunita runs a community loom sanctuary preserving authentic peacock zari pallu techniques and teaches traditional textile drafting, color theory, and hand-bobbin knotting.",
        "availability": "Flexible Weekdays",
        "email": "sunita.paithani@virasetu.org",
        "photo_url": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&fit=crop&crop=faces"
    },
    {
        "name": "Parshuram Gangavane",
        "art_form_id": 3, # Chitrakathi
        "experience_years": 40,
        "location": "Pinguli, Sindhudurg, Maharashtra",
        "teaching_mode": "Offline Workshops & Online Lectures",
        "languages": "Marathi, Hindi",
        "rating": 5.0,
        "reviews_count": 45,
        "about": "Padma Shri awardee and custodian of the Thakar Adivasi art museum in Pinguli. Parshuram ji has dedicated four decades to preserving Chitrakathi scroll painting and leather puppetry. His masterclasses are deeply immersive cultural journeys.",
        "availability": "Monthly Masterclasses",
        "email": "parshuram.gangavane@virasetu.org",
        "photo_url": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&fit=crop&crop=faces"
    },
    {
        "name": "Rekha Jadhav",
        "art_form_id": 4, # Lavani
        "experience_years": 14,
        "location": "Pune, Maharashtra",
        "teaching_mode": "Online & Offline Studio",
        "languages": "Marathi, English, Hindi",
        "rating": 4.9,
        "reviews_count": 31,
        "about": "Classical folk dancer with a Master's in Performing Arts from Lalit Kala Kendra. Rekha teaches authentic Baithakichi Lavani and stage footwork with strict adherence to classical percussion taals and expressive Abhinaya.",
        "availability": "Tuesday, Thursday & Saturday Evenings",
        "email": "rekha.lavani@virasetu.org",
        "photo_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&fit=crop&crop=faces"
    },
    {
        "name": "Venkatesh Rao",
        "art_form_id": 5, # Kalamkari
        "experience_years": 25,
        "location": "Srikalahasti, Andhra Pradesh",
        "teaching_mode": "Online & Hybrid",
        "languages": "Telugu, English, Hindi",
        "rating": 4.9,
        "reviews_count": 52,
        "about": "Senior master artisan specializing in Srikalahasti freehand temple tapestries. Venkatesh teaches authentic bamboo pen carving, organic vegetable dye extraction, and classic epic composition across all skill levels.",
        "availability": "Morning & Weekend Sessions",
        "email": "venkatesh.kalamkari@virasetu.org",
        "photo_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&fit=crop&crop=faces"
    },
    {
        "name": "Mohan Kumbhar",
        "art_form_id": 6, # Traditional Pottery
        "experience_years": 16,
        "location": "Pune, Maharashtra",
        "teaching_mode": "Offline Studio & Online Consultations",
        "languages": "Hindi, Marathi",
        "rating": 4.8,
        "reviews_count": 29,
        "about": "Master potter operating a traditional and studio pottery center in Pune. Passionate about reviving terracotta clay cookware, kulhads, and sculptured planters using local natural river clays.",
        "availability": "Daily Morning Batches",
        "email": "mohan.pottery@virasetu.org",
        "photo_url": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&fit=crop&crop=faces"
    },
    {
        "name": "Ananya Sen",
        "art_form_id": 1, # Warli & Indian Folk Arts
        "experience_years": 9,
        "location": "Mumbai, Maharashtra",
        "teaching_mode": "Online",
        "languages": "English, Hindi, Bengali",
        "rating": 4.7,
        "reviews_count": 24,
        "about": "Folk arts educator and designer. Ananya works with urban youth and school curricula to make Warli art accessible, meditative, and fun through modern digital and hand-drawn mediums.",
        "availability": "Weekend Mornings",
        "email": "ananya.sen@virasetu.org",
        "photo_url": "https://images.unsplash.com/photo-1548142813-c348350df52b?w=300&fit=crop&crop=faces"
    }
]

QUIZZES = [
    # Shaniwar Wada
    {
        "heritage_id": 1,
        "question": "Which Maratha Prime Minister (Peshwa) founded the historic Shaniwar Wada in 1730 CE?",
        "option_a": "Peshwa Madhavrao",
        "option_b": "Peshwa Baji Rao I",
        "option_c": "Balaji Vishwanath",
        "option_d": "Nana Saheb Peshwa",
        "correct_option": "B",
        "explanation": "Shaniwar Wada was commissioned by the legendary military strategist Peshwa Baji Rao I in 1730 CE as the seat of the Peshwas."
    },
    {
        "heritage_id": 1,
        "question": "Why was this historic palace complex named 'Shaniwar' Wada?",
        "option_a": "It was situated on Shaniwar hill",
        "option_b": "It was built in memory of Lord Shani",
        "option_c": "Its foundation stone was ceremoniously laid on a Saturday (Shaniwar)",
        "option_d": "Its market only opened on Saturdays",
        "correct_option": "C",
        "explanation": "The foundational ceremony was performed on Saturday, January 10, 1730, giving it the name Shaniwar (Saturday) Wada (Palace)."
    },
    {
        "heritage_id": 1,
        "question": "What was the Hazari Karanje inside Shaniwar Wada famous for?",
        "option_a": "A thousand secret prison cells",
        "option_b": "A thousand stone arches",
        "option_c": "An intricate 16-petaled fountain of a thousand water jets",
        "option_d": "A gold-plated war cannon",
        "correct_option": "C",
        "explanation": "Hazari Karanje (Fountain of a Thousand Jets) was an advanced 16-petaled lotus hydraulic fountain created for the Peshwa's court."
    },

    # Sinhagad Fort
    {
        "heritage_id": 2,
        "question": "What was the original name of Sinhagad Fort before it was renamed by Shivaji Maharaj?",
        "option_a": "Raigad",
        "option_b": "Kondhana",
        "option_c": "Torna",
        "option_d": "Pratapgad",
        "correct_option": "B",
        "explanation": "The fort was originally named Kondhana after the sage Kaundinya before Shivaji Maharaj renamed it Sinhagad in honor of Tanaji Malusare."
    },
    {
        "heritage_id": 2,
        "question": "Which brave Maratha general scaled the sheer cliff of Sinhagad in the legendary 1670 battle?",
        "option_a": "Baji Prabhu Deshpande",
        "option_b": "Hambirao Mohite",
        "option_c": "Tanaji Malusare",
        "option_d": "Netaji Palkar",
        "correct_option": "C",
        "explanation": "Tanaji Malusare scaled the sheer cliff at midnight and heroically recaptured the fort, giving rise to the quote 'Gad aala, pan Sinha gela'."
    },
    {
        "heritage_id": 2,
        "question": "What are the natural rock-cut water cisterns at Sinhagad known as?",
        "option_a": "Amrut Kunda",
        "option_b": "Devtake",
        "option_c": "Ganga Sagar",
        "option_d": "Bawali",
        "correct_option": "B",
        "explanation": "Devtake are ancient rock-cut cisterns carved into the basalt mountain that keep water naturally chilled throughout the year."
    },

    # Aga Khan Palace
    {
        "heritage_id": 3,
        "question": "For what primary humanitarian reason was Aga Khan Palace constructed in 1892?",
        "option_a": "As a military outpost",
        "option_b": "To provide famine relief employment to local drought-hit villagers",
        "option_c": "As a British governor's residence",
        "option_d": "As a royal hunting lodge",
        "correct_option": "B",
        "explanation": "Sultan Muhammed Shah Aga Khan III built the palace to provide charitable wage employment to thousands suffering from famine in the Pune region."
    },
    {
        "heritage_id": 3,
        "question": "Whose sacred memorials (samadhis) are preserved on the grounds of Aga Khan Palace?",
        "option_a": "Lokmanya Tilak and Gokhale",
        "option_b": "Kasturba Gandhi and Mahadev Desai",
        "option_c": "Sardar Patel and Subhas Chandra Bose",
        "option_d": "Jawaharlal Nehru and Indira Gandhi",
        "correct_option": "B",
        "explanation": "Both Kasturba Gandhi and Mahatma Gandhi's trusted secretary Mahadev Desai passed away while imprisoned here and their memorials stand on the grounds."
    },

    # Gateway of India
    {
        "heritage_id": 4,
        "question": "In which architectural style is the Gateway of India built?",
        "option_a": "Gothic Revival",
        "option_b": "Indo-Saracenic",
        "option_c": "Baroque",
        "option_d": "Art Deco",
        "correct_option": "B",
        "explanation": "Architect George Wittet designed the Gateway of India in the Indo-Saracenic style, blending 16th-century Gujarati archways with European arches."
    },
    {
        "heritage_id": 4,
        "question": "What historic event occurred at the Gateway of India on 28 February 1948?",
        "option_a": "First flight between India and Britain",
        "option_b": "The final British military regiment departed from Indian soil",
        "option_c": "Arrival of the first UN delegation",
        "option_d": "Inauguration of Mumbai port trust",
        "correct_option": "B",
        "explanation": "The First Battalion of the Somerset Light Infantry marched through the Gateway's arch to their ship, formally ending British military presence in India."
    },

    # Red Fort
    {
        "heritage_id": 5,
        "question": "Which Mughal Emperor commissioned the construction of the Red Fort in Delhi?",
        "option_a": "Akbar",
        "option_b": "Jahangir",
        "option_c": "Shah Jahan",
        "option_d": "Babur",
        "correct_option": "C",
        "explanation": "Shah Jahan commissioned the Red Fort (Lal Qila) in 1638 when he shifted the imperial capital from Agra to Shahjahanabad (Delhi)."
    },
    {
        "heritage_id": 5,
        "question": "From which ceremonial gate of the Red Fort does the Prime Minister address the nation on Independence Day?",
        "option_a": "Delhi Gate",
        "option_b": "Lahori Gate",
        "option_c": "Kashmiri Gate",
        "option_d": "Ajmeri Gate",
        "correct_option": "B",
        "explanation": "The tricolor is hoisted atop the ramparts of the historic Lahori Gate facing Chandni Chowk."
    },

    # Taj Mahal
    {
        "heritage_id": 6,
        "question": "Which special translucent marble was used to build the Taj Mahal?",
        "option_a": "Carrara marble",
        "option_b": "Makrana white marble",
        "option_c": "Jodhpur pink stone",
        "option_d": "Belgaum grey granite",
        "correct_option": "B",
        "explanation": "The monument was constructed using pristine white Makrana marble quarried in Rajasthan."
    },
    {
        "heritage_id": 6,
        "question": "What is the ancient art of semi-precious stone inlay in marble called?",
        "option_a": "Meenakari",
        "option_b": "Pietra Dura (Parchin Kari)",
        "option_c": "Zardozi",
        "option_d": "Bidriware",
        "correct_option": "B",
        "explanation": "Pietra Dura (or Parchin Kari in Urdu/Hindi) is the exquisite stone inlay technique setting lapis lazuli, jade, and jasper into marble."
    }
]

DEMO_USERS = [
    {
        "username": "priya_sharma",
        "email": "priya.sharma@example.com",
        "full_name": "Priya Sharma",
        "role": "student"
    }
]

INITIAL_PASSPORT_ENTRIES = [
    {
        "user_id": 1,
        "entry_type": "site_explored",
        "item_id": 1,
        "item_name": "Shaniwar Wada",
        "extra_data": "AI Identified & Explored"
    },
    {
        "user_id": 1,
        "entry_type": "art_explored",
        "item_id": 1,
        "item_name": "Warli Painting",
        "extra_data": "Explored Tribal Heritage"
    },
    {
        "user_id": 1,
        "entry_type": "quiz_completed",
        "item_id": 1,
        "item_name": "Shaniwar Wada Quiz",
        "extra_data": "Score: 3/3"
    }
]


def init_db(force_reset=False, db_path=None):
    """Initialize and seed the database.

    Args:
        force_reset: If True, wipe all existing data before seeding.
        db_path: Override the DB file path (e.g. '/tmp/virasetu.db' on Vercel).
                 Falls back to the module-level DB_PATH (local dev default).
    """
    target_db = db_path or DB_PATH
    db_dir = os.path.dirname(target_db)
    # Only create the directory if it doesn't already exist and is non-empty
    # (/tmp always exists on Vercel so makedirs would fail with PermissionError)
    if db_dir and not os.path.exists(db_dir):
        os.makedirs(db_dir, exist_ok=True)
    conn = sqlite3.connect(target_db)
    cursor = conn.cursor()

    try:
        with open(SCHEMA_PATH, "r", encoding="utf-8") as f:
            schema = f.read()
    except (FileNotFoundError, OSError):
        schema = SCHEMA_SQL  # Use inline fallback (e.g. on Vercel)
    cursor.executescript(schema)

    # Check if data already seeded
    cursor.execute("SELECT COUNT(*) FROM heritage_sites")
    count = cursor.fetchone()[0]

    if count == 0 or force_reset:
        if force_reset:
            cursor.execute("DELETE FROM quizzes")
            cursor.execute("DELETE FROM teachers")
            cursor.execute("DELETE FROM traditional_arts")
            cursor.execute("DELETE FROM heritage_sites")
            cursor.execute("DELETE FROM passport_entries")
            cursor.execute("DELETE FROM teacher_requests")
            cursor.execute("DELETE FROM users")

        # Insert Heritage Sites
        for site in HERITAGE_SITES:
            cursor.execute("""
                INSERT OR REPLACE INTO heritage_sites 
                (slug, name, location, state, latitude, longitude, history, architecture, 
                 historical_importance, famous_events, interesting_facts, image_url, built_by, built_year)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                site["slug"], site["name"], site["location"], site["state"],
                site["latitude"], site["longitude"], site["history"], site["architecture"],
                site["historical_importance"], site["famous_events"], site["interesting_facts"],
                site["image_url"], site["built_by"], site["built_year"]
            ))

        # Insert Traditional Arts
        for art in TRADITIONAL_ARTS:
            cursor.execute("""
                INSERT OR REPLACE INTO traditional_arts
                (slug, name, origin, short_description, about, cultural_importance, current_status, traditional_methods, image_url)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                art["slug"], art["name"], art["origin"], art["short_description"],
                art["about"], art["cultural_importance"], art["current_status"],
                art["traditional_methods"], art["image_url"]
            ))

        # Insert Teachers
        for t in TEACHERS:
            cursor.execute("""
                INSERT INTO teachers
                (name, art_form_id, experience_years, location, teaching_mode, languages, rating, reviews_count, about, availability, email, photo_url)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                t["name"], t["art_form_id"], t["experience_years"], t["location"],
                t["teaching_mode"], t["languages"], t["rating"], t["reviews_count"],
                t["about"], t["availability"], t["email"], t["photo_url"]
            ))

        # Insert Quizzes
        for q in QUIZZES:
            cursor.execute("""
                INSERT INTO quizzes
                (heritage_id, question, option_a, option_b, option_c, option_d, correct_option, explanation)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                q["heritage_id"], q["question"], q["option_a"], q["option_b"],
                q["option_c"], q["option_d"], q["correct_option"], q["explanation"]
            ))

        # Insert Demo User
        for u in DEMO_USERS:
            cursor.execute("""
                INSERT OR IGNORE INTO users (username, email, full_name, role)
                VALUES (?, ?, ?, ?)
            """, (u["username"], u["email"], u["full_name"], u["role"]))

        # Insert Initial Passport Entries
        for p in INITIAL_PASSPORT_ENTRIES:
            cursor.execute("""
                INSERT INTO passport_entries (user_id, entry_type, item_id, item_name, extra_data)
                VALUES (?, ?, ?, ?, ?)
            """, (p["user_id"], p["entry_type"], p["item_id"], p["item_name"], p["extra_data"]))

        conn.commit()
        print(f"Database seeded successfully with {len(HERITAGE_SITES)} sites, {len(TRADITIONAL_ARTS)} arts, {len(TEACHERS)} teachers, and {len(QUIZZES)} quiz questions.")
    else:
        print(f"Database already contains {count} heritage sites. Seed skipped.")

    conn.close()


if __name__ == "__main__":
    init_db()
