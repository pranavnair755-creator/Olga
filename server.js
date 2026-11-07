import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const HOST = '0.0.0.0';

// Custom MIME mapping for any edge-case extensions
const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.eot': 'application/vnd.ms-fontobject',
};

function serveFileWithMime(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (mimeTypes[ext]) {
    res.setHeader('Content-Type', mimeTypes[ext]);
  }
  return res.sendFile(filePath);
}

const ai = new GoogleGenAI();

app.use(express.json());

// Rich multi-tier curated trivia bank
const tier1Pool = [
  { category: "Indian Geography", question: "Which city is known as the 'Pink City' of India?", a: "Udaipur", b: "Jaipur", c: "Jodhpur", d: "Bikaner", correct: "b" },
  { category: "Science", question: "What chemical element is represented by the symbol 'Au' on the periodic table?", a: "Silver", b: "Aluminum", c: "Gold", d: "Argon", correct: "c" },
  { category: "Indian Cinema", question: "Which song from the movie RRR won the Academy Award for Best Original Song in 2023?", a: "Jai Ho", b: "Naatu Naatu", c: "Chaiyya Chaiyya", d: "Kesariya", correct: "b" },
  { category: "Sports", question: "In cricket, how many runs are scored if a batsman hits the ball over the boundary rope without it touching the ground?", a: "4 runs", b: "5 runs", c: "6 runs", d: "8 runs", correct: "c" },
  { category: "Indian Culture", question: "The traditional classical dance form 'Kathakali' originated in which Indian state?", a: "Tamil Nadu", b: "Kerala", c: "Odisha", d: "Karnataka", correct: "b" },
  { category: "National Symbols", question: "What is the national animal of India?", a: "Asiatic Lion", b: "Royal Bengal Tiger", c: "Indian Elephant", d: "Snow Leopard", correct: "b" },
  { category: "World Geography", question: "Which is the smallest continent by land area?", a: "Antarctica", b: "Europe", c: "Australia", d: "South America", correct: "c" },
  { category: "General Science", question: "Which gas do plants primarily absorb from the atmosphere during photosynthesis?", a: "Oxygen", b: "Nitrogen", c: "Carbon Dioxide", d: "Hydrogen", correct: "c" },
  { category: "Pop Culture", question: "Which superhero is popularly known as the 'Caped Crusader'?", a: "Superman", b: "Batman", c: "Spider-Man", d: "Iron Man", correct: "b" },
  { category: "Indian Heritage", question: "In which city is the famous India Gate war memorial located?", a: "Mumbai", b: "Kolkata", c: "New Delhi", d: "Chennai", correct: "c" },
  { category: "Astronomy", question: "Which planet in our solar system is known as the 'Red Planet'?", a: "Venus", b: "Jupiter", c: "Mars", d: "Saturn", correct: "c" },
  { category: "Sports", question: "How many players are on the field for one team in a standard soccer (football) match?", a: "9", b: "10", c: "11", d: "12", correct: "c" },
  { category: "Food & Nature", question: "What sweet substance do honeybees produce from flower nectar?", a: "Molasses", b: "Honey", c: "Maple syrup", d: "Caramel", correct: "b" },
  { category: "Human Body", question: "Which muscular organ pumps blood throughout the human body?", a: "Lungs", b: "Liver", c: "Heart", d: "Brain", correct: "c" },
  { category: "Indian Festivals", question: "Which popular Indian festival is celebrated with colorful powders and water?", a: "Diwali", b: "Holi", c: "Navratri", d: "Eid", correct: "b" },
  { category: "Board Games", question: "How many squares are on a standard international chessboard?", a: "48", b: "56", c: "64", d: "72", correct: "c" },
  { category: "Currencies", question: "What is the official currency of Japan?", a: "Yuan", b: "Won", c: "Yen", d: "Ringgit", correct: "c" },
  { category: "Music", question: "How many strings does a standard classical acoustic guitar typically have?", a: "4", b: "5", c: "6", d: "7", correct: "c" },
  { category: "World Wonders", question: "In which country can you visit the ancient Great Pyramids of Giza?", a: "Greece", b: "Egypt", c: "Jordan", d: "Morocco", correct: "b" },
  { category: "Technology", question: "What does the abbreviation 'PC' commonly stand for in consumer electronics?", a: "Private Computer", b: "Personal Computer", c: "Public Core", d: "Power Channel", correct: "b" }
];

const tier2Pool = [
  { category: "World Heritage", question: "The ancient rock-cut caves of Ajanta and Ellora are situated in which district of Maharashtra?", a: "Pune", b: "Chhatrapati Sambhaji Nagar (Aurangabad)", c: "Nashik", d: "Kolhapur", correct: "b" },
  { category: "Space Science", question: "What was the name of the landing site near the South Pole of the Moon chosen for Chandrayaan-3's Vikram lander?", a: "Tiranga Point", b: "Shiv Shakti Point", c: "Jawahar Point", d: "Aryabhata Point", correct: "b" },
  { category: "Literature", question: "Who was the first Asian and Indian to be awarded the Nobel Prize in Literature in 1913?", a: "C. V. Raman", b: "Rabindranath Tagore", c: "Sarojini Naidu", d: "Sri Aurobindo", correct: "b" },
  { category: "Indian Polity", question: "Who is known as the 'Father of the Indian Constitution' and was Chairman of the Drafting Committee?", a: "Dr. B. R. Ambedkar", b: "Dr. Rajendra Prasad", c: "Sardar Vallabhbhai Patel", d: "Jawaharlal Nehru", correct: "a" },
  { category: "World Geography", question: "Which is the highest plateau in the world, often referred to as the 'Roof of the World'?", a: "Deccan Plateau", b: "Colorado Plateau", c: "Tibetan Plateau", d: "Anatolian Plateau", correct: "c" },
  { category: "Ancient History", question: "The Ashoka Pillar capital at Sarnath, adopted as India's national emblem, features how many Asiatic lions standing back to back?", a: "Three", b: "Four", c: "Five", d: "Six", correct: "b" },
  { category: "Physics & Chemistry", question: "Which noble gas was discovered during a total solar eclipse in Guntur, India in 1868 by astronomer Pierre Janssen?", a: "Neon", b: "Krypton", c: "Helium", d: "Xenon", correct: "c" },
  { category: "Indian Railways", question: "Between which two stations did India's first commercial passenger train run on April 16, 1853?", a: "Bori Bunder to Thane", b: "Howrah to Hooghly", c: "Royapuram to Wallajah Road", d: "Delhi to Agra", correct: "a" },
  { category: "Economics & Currency", question: "Who designed the official Indian Rupee currency symbol (₹) adopted by the Government of India in 2010?", a: "R. K. Laxman", b: "D. Udaya Kumar", c: "Nandan Nilekani", d: "B. V. Doshi", correct: "b" },
  { category: "Indian Geography", question: "Which is the largest freshwater lake in India, located in Jammu and Kashmir?", a: "Dal Lake", b: "Wular Lake", c: "Chilika Lake", d: "Loktak Lake", correct: "b" },
  { category: "Space Technology", question: "Where is the headquarters of the Indian Space Research Organisation (ISRO) located?", a: "Hyderabad", b: "Thiruvananthapuram", c: "Bengaluru", d: "Sriharikota", correct: "c" },
  { category: "Modern History", question: "Which boundary line between India and Pakistan was demarcated by a British lawyer in August 1947?", a: "Durand Line", b: "Radcliffe Line", c: "McMahon Line", d: "Curzon Line", correct: "b" },
  { category: "Biology & Genetics", question: "Who is known as the 'Father of Modern Genetics' for his pioneering experiments with pea plants?", a: "Charles Darwin", b: "Gregor Mendel", c: "Louis Pasteur", d: "James Watson", correct: "b" },
  { category: "Indian Epics", question: "In the Hindu epic Ramayana, which bird hero fought valiantly against Ravana to rescue Sita?", a: "Garuda", b: "Jatayu", c: "Sampati", d: "Sugriva", correct: "b" },
  { category: "World History", question: "Which ancient civilization constructed the cliff citadel of Machu Picchu high in the Andes?", a: "Aztec", b: "Inca", c: "Maya", d: "Toltec", correct: "b" },
  { category: "Indian Cinema", question: "Who directed India's first indigenous full-length silent feature film, 'Raja Harishchandra', released in 1913?", a: "V. Shantaram", b: "Dadasaheb Phalke", c: "Satyajit Ray", d: "Ardeshir Irani", correct: "b" },
  { category: "Inventions", question: "Who is widely credited with inventing the World Wide Web in 1989 at CERN?", a: "Steve Jobs", b: "Tim Berners-Lee", c: "Bill Gates", d: "Alan Turing", correct: "b" },
  { category: "Indian Banking", question: "In which year was the Reserve Bank of India (RBI) established based on the Hilton Young Commission?", a: "1928", b: "1935", c: "1947", d: "1950", correct: "b" },
  { category: "Classical Music", question: "Which Indian maestro is universally revered as the 'Father of Carnatic Music'?", a: "Tyagaraja", b: "Purandara Dasa", c: "Muthuswami Dikshitar", d: "Syama Sastri", correct: "b" },
  { category: "Ecology", question: "What is the national aquatic animal of India, recognized in 2009?", a: "Ganges River Dolphin", b: "Gharial", c: "Olive Ridley Turtle", d: "Dugong", correct: "a" }
];

const tier3Pool = [
  { category: "1 CRORE Grand Finale", question: "In 1911, which historic British monarch visited India and laid the foundation stone of New Delhi during the Delhi Durbar?", a: "King George V", b: "King Edward VII", c: "Queen Victoria", d: "King George VI", correct: "a" },
  { category: "Aviation History", question: "Who was the first licensed pilot in India, obtaining commercial license No. 1 in 1929?", a: "J. R. D. Tata", b: "Subroto Mukherjee", c: "Air Marshal Aspy Engineer", d: "Rakesh Sharma", correct: "a" },
  { category: "Fine Arts", question: "Who painted the iconic Indian national portrait 'Bharat Mata' depicting her as a four-armed saffron goddess in 1905?", a: "Raja Ravi Varma", b: "Abanindranath Tagore", c: "Nandalal Bose", d: "Amrita Sher-Gil", correct: "b" },
  { category: "Ancient Mathematics", question: "Which ancient Indian mathematician-astronomer first approximated Pi to 3.1416 in his 499 CE treatise?", a: "Aryabhata", b: "Brahmagupta", c: "Bhaskara II", d: "Varahamihira", correct: "a" },
  { category: "Nobel Peace Prize", question: "In which year was Mother Teresa awarded the Nobel Peace Prize for her work in Kolkata?", a: "1971", b: "1979", c: "1984", d: "1989", correct: "b" },
  { category: "Classical Literature", question: "Who authored the famous Sanskrit lyric poem 'Meghaduta' (The Cloud Messenger)?", a: "Bhasa", b: "Kalidasa", c: "Bhavabhuti", d: "Banabhatta", correct: "b" },
  { category: "Colonial History", question: "The Battle of Plassey, which established British East India Company dominance in Bengal, took place in which year?", a: "1748", b: "1757", c: "1764", d: "1772", correct: "b" },
  { category: "Olympic Milestone", question: "Who was the first Indian woman to win an individual Olympic medal, securing bronze at the 2000 Sydney Games?", a: "P. T. Usha", b: "Karnam Malleswari", c: "Mary Kom", d: "Saina Nehwal", correct: "b" },
  { category: "Indian Astronomy", question: "Which historic 18th-century Rajput king designed and built the five stone astronomical observatories known as Jantar Mantar?", a: "Maharaja Man Singh", b: "Sawai Jai Singh II", c: "Rana Kumbha", d: "Prithviraj Chauhan", correct: "b" },
  { category: "Ancient Universities", question: "The ruins of the ancient Buddhist monastic university of Nalanda are situated in which present-day state?", a: "Uttar Pradesh", b: "Bihar", c: "Madhya Pradesh", d: "West Bengal", correct: "b" },
  { category: "Indian Science", question: "Sir C. V. Raman won the Nobel Prize in Physics in 1930 for discovering what optical phenomenon?", a: "Raman Effect (inelastic light scattering)", b: "Photoelectric Effect", c: "Nuclear Fission", d: "Superconductivity", correct: "a" },
  { category: "Freedom Movement", question: "In 1930, Mahatma Gandhi led the historic Salt March from Sabarmati Ashram to which coastal village?", a: "Porbandar", b: "Dandi", c: "Surat", d: "Navsari", correct: "b" },
  { category: "Military History", question: "What was the codename of the Indian Army's military operation to reclaim the heights of Kargil in 1999?", a: "Operation Meghdoot", b: "Operation Vijay", c: "Operation Cactus", d: "Operation Parakram", correct: "b" },
  { category: "Indian Architecture", question: "The majestic Brihadisvara Temple at Thanjavur was commissioned by which illustrious Chola monarch?", a: "Rajendra Chola I", b: "Raja Raja Chola I", c: "Kulothunga Chola", d: "Karikala Chola", correct: "b" },
  { category: "1 CRORE Summit", question: "During the 1857 Indian Revolt, which last Mughal emperor was declared the ceremonial Emperor of Hindustan by the rebel soldiers?", a: "Shah Alam II", b: "Bahadur Shah Zafar", c: "Akbar II", d: "Farrukhsiyar", correct: "b" },
  { category: "Geographic Peaks", question: "Which is the highest mountain peak situated entirely within the political borders of the Republic of India?", a: "K2 (Godwin-Austen)", b: "Nanda Devi", c: "Kangchenjunga", d: "Kamet", correct: "b" },
  { category: "Constitutional Lore", question: "Who was the chief calligrapher who handwritten the original Constitution of India in flowing italic style?", a: "Prem Behari Narain Raizada", b: "Nandalal Bose", c: "Beohar Rammanohar Sinha", d: "Sachchidananda Sinha", correct: "a" },
  { category: "Indian Cinema Lore", question: "Which was the first Indian film ever to be officially nominated for the Academy Award for Best Foreign Language Film in 1958?", a: "Mughal-e-Azam", b: "Mother India", c: "Pather Panchali", d: "Awaara", correct: "b" },
  { category: "Botany & Agriculture", question: "The world's oldest operating commercial tea garden, established in 1839, is located in which state?", a: "West Bengal", b: "Assam", c: "Tamil Nadu", d: "Kerala", correct: "b" },
  { category: "1 CRORE Grand Finale", question: "Which Indian mathematician communicated the mock theta functions to G. H. Hardy on his deathbed in 1920?", a: "P. C. Mahalanobis", b: "Srinivasa Ramanujan", c: "Satyendra Nath Bose", d: "Harish-Chandra", correct: "b" }
];

const switchPool = [
  { category: "Pop Culture", question: "Which superhero is known as the 'Caped Crusader'?", a: "Superman", b: "Batman", c: "Spider-Man", d: "Iron Man", correct: "b" },
  { category: "Nature", question: "What is the national tree of India?", a: "Neem", b: "Banyan Tree", c: "Peepal", d: "Mango Tree", correct: "b" },
  { category: "Food & Drink", question: "Which spice is often called the 'King of Spices' and is indigenous to the Western Ghats of India?", a: "Cardamom", b: "Black Pepper", c: "Clove", d: "Cinnamon", correct: "b" },
  { category: "Sports", question: "How many grand slam singles titles did Roger Federer win in his tennis career?", a: "18", b: "20", c: "22", d: "24", correct: "b" },
  { category: "Astronomy", question: "Which planet in our solar system has the most prominent ring system visible through telescopes?", a: "Jupiter", b: "Saturn", c: "Uranus", d: "Neptune", correct: "b" },
  { category: "Inventions", question: "Who is traditionally credited with inventing the telephone in 1876?", a: "Thomas Edison", b: "Alexander Graham Bell", c: "Nikola Tesla", d: "Guglielmo Marconi", correct: "b" },
  { category: "Monuments", question: "The Gateway of India in Mumbai was built to commemorate the landing of which royal couple in 1911?", a: "King George V and Queen Mary", b: "King Edward VII and Queen Alexandra", c: "Prince Charles and Princess Diana", d: "Queen Elizabeth II and Prince Philip", correct: "a" },
  { category: "Biology", question: "Which organelle is universally referred to as the 'powerhouse of the cell'?", a: "Ribosome", b: "Mitochondria", c: "Nucleus", d: "Golgi body", correct: "b" },
  { category: "World History", question: "Which European country was ruled by the Sun King, Louis XIV?", a: "Spain", b: "France", c: "England", d: "Austria", correct: "b" },
  { category: "Geography", question: "Which is the longest freshwater river flowing entirely within India?", a: "Yamuna", b: "Ganga", c: "Godavari", d: "Brahmaputra", correct: "b" },
  { category: "Literature", question: "Who wrote the timeless fantasy adventure 'The Hobbit'?", a: "C. S. Lewis", b: "J. R. R. Tolkien", c: "George R. R. Martin", d: "Philip Pullman", correct: "b" },
  { category: "Nobel Laureates", question: "In which discipline did Amartya Sen receive the Nobel Memorial Prize in 1998?", a: "Physics", b: "Economic Sciences", c: "Literature", d: "Peace", correct: "b" },
  { category: "Indian Wildlife", question: "Kaziranga National Park in Assam is famous worldwide as the sanctuary for which species?", a: "Snow Leopard", b: "Great One-Horned Rhinoceros", c: "Wild Water Buffalo", d: "Gaur", correct: "b" },
  { category: "Modern Science", question: "Which particle discovered at CERN's Large Hadron Collider in 2012 is nicknamed the 'God Particle'?", a: "Top Quark", b: "Higgs Boson", c: "Tau Neutrino", d: "Gluon", correct: "b" },
  { category: "Music Lore", question: "Which classical Indian instrument did the maestro Pandit Ravi Shankar master and popularize globally?", a: "Sarod", b: "Sitar", c: "Santoor", d: "Shehnai", correct: "b" },
  { category: "Indian Rivers", question: "Which major Indian river originates from the holy glacial lake of Mansarovar in Tibet?", a: "Narmada", b: "Brahmaputra", c: "Mahanadi", d: "Krishna", correct: "b" },
  { category: "Cinema Lore", question: "Which legendary playback singer recorded over 25,000 songs and was awarded the Bharat Ratna in 2001?", a: "Asha Bhosle", b: "Lata Mangeshkar", c: "M. S. Subbulakshmi", d: "Geeta Dutt", correct: "b" },
  { category: "World Capitals", question: "What is the capital city of Australia?", a: "Sydney", b: "Melbourne", c: "Canberra", d: "Brisbane", correct: "c" },
  { category: "Maritime History", question: "In which year did the ill-fated ocean liner Titanic sink in the North Atlantic?", a: "1905", b: "1912", c: "1918", d: "1923", correct: "b" },
  { category: "Deep Space", question: "What is the name of the nearest major spiral galaxy to our own Milky Way galaxy?", a: "Triangulum", b: "Andromeda", c: "Whirlpool", d: "Sombrero", correct: "b" }
];

// Helper: Shuffle array randomly
function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Helper: Randomize options A, B, C, D order so correct answer is unpredictably distributed
function randomizeQuestionOptions(rawQ) {
  const options = [
    { text: rawQ.a, isCorrect: rawQ.correct.toLowerCase() === 'a' },
    { text: rawQ.b, isCorrect: rawQ.correct.toLowerCase() === 'b' },
    { text: rawQ.c, isCorrect: rawQ.correct.toLowerCase() === 'c' },
    { text: rawQ.d, isCorrect: rawQ.correct.toLowerCase() === 'd' },
  ];
  const shuffled = shuffleArray(options);
  const keys = ['a', 'b', 'c', 'd'];
  const newQ = {
    category: rawQ.category,
    question: rawQ.question,
  };
  let newCorrect = 'a';
  keys.forEach((k, idx) => {
    newQ[k] = shuffled[idx].text;
    if (shuffled[idx].isCorrect) {
      newCorrect = k;
    }
  });
  newQ.correct = newCorrect;
  return newQ;
}

// Generates a brand new, randomized 15-question game + 15 switch questions
function generateDynamicGameQuestions() {
  const t1 = shuffleArray(tier1Pool).slice(0, 5).map(randomizeQuestionOptions);
  const t2 = shuffleArray(tier2Pool).slice(0, 5).map(randomizeQuestionOptions);
  const t3 = shuffleArray(tier3Pool).slice(0, 5).map(randomizeQuestionOptions);
  const sw = shuffleArray(switchPool).slice(0, 15).map(randomizeQuestionOptions);

  return {
    questions: [...t1, ...t2, ...t3],
    switchQuestions: sw
  };
}

// POST /api/generate-questions - Generates 15 progressive questions + 15 switch questions
app.post('/api/generate-questions', async (req, res) => {
  try {
    // If Gemini API Key is provided, attempt live AI question generation
    if (process.env.GEMINI_API_KEY) {
      try {
        const prompt = `Generate a brand new set of 15 Who Wants To Be A Millionaire questions with ascending difficulty, plus 15 alternative switch questions for the "Switch the Question" lifeline.
The game is played in Indian Rupees (from Rs. 1,000 up to Rs. 1 CRORE).
The questions should cover diverse trivia: Indian & world history, geography, science & technology, cinema & pop culture, sports, literature, and nature.
Progressive Difficulty:
- Q1 to Q5: Tier 1 (Fun, accessible trivia)
- Q6 to Q10: Tier 2 (Intermediate general knowledge)
- Q11 to Q15: Tier 3 (Mastery level, high stakes up to Rs. 1 CRORE)
Return JSON:
{
  "questions": [ { "category": "...", "question": "...", "a": "...", "b": "...", "c": "...", "d": "...", "correct": "a" } ],
  "switchQuestions": [ { "category": "...", "question": "...", "a": "...", "b": "...", "c": "...", "d": "...", "correct": "b" } ]
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.9,
          }
        });

        const cleaned = (response.text || '').replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
        const parsed = JSON.parse(cleaned);

        if (parsed && Array.isArray(parsed.questions) && parsed.questions.length >= 15) {
          return res.json({
            success: true,
            source: 'gemini',
            questions: parsed.questions.slice(0, 15).map(randomizeQuestionOptions),
            switchQuestions: (Array.isArray(parsed.switchQuestions) && parsed.switchQuestions.length >= 15) 
              ? parsed.switchQuestions.slice(0, 15).map(randomizeQuestionOptions)
              : shuffleArray(switchPool).slice(0, 15).map(randomizeQuestionOptions)
          });
        }
      } catch (apiError) {
        console.warn("Gemini question generation error, using dynamic multi-tier sampling:", apiError.message);
      }
    }

    // Generate brand new dynamic game questions from curated multi-tier pools
    const dynamicGame = generateDynamicGameQuestions();
    return res.json({
      success: true,
      source: 'dynamic_engine',
      questions: dynamicGame.questions,
      switchQuestions: dynamicGame.switchQuestions
    });
  } catch (err) {
    console.error("Generate questions error:", err);
    const dynamicGame = generateDynamicGameQuestions();
    return res.json({
      success: true,
      source: 'dynamic_fallback',
      questions: dynamicGame.questions,
      switchQuestions: dynamicGame.switchQuestions
    });
  }
});

// Entrypoint
app.get(['/', '/index.html', '/default.html'], (req, res) => {
  const indexHtml = path.join(__dirname, 'index.html');
  if (fs.existsSync(indexHtml)) {
    return serveFileWithMime(res, indexHtml);
  }
  return serveFileWithMime(res, path.join(__dirname, 'default.html'));
});

// Smart static asset handler
app.use((req, res, next) => {
  let decodedPath = '';
  try {
    decodedPath = decodeURIComponent(req.path);
  } catch (err) {
    decodedPath = req.path;
  }

  // 1. Direct path from root
  const directPath = path.join(__dirname, decodedPath);
  if (fs.existsSync(directPath)) {
    try {
      const stat = fs.statSync(directPath);
      if (stat.isFile()) {
        return serveFileWithMime(res, directPath);
      }
    } catch (e) {
      // Ignore stat error and continue
    }
  }

  // 2. Basename resolution (maps /Images/foo.png or /Images/timer/bar/clockbar1.png -> /clockbar1.png)
  const baseName = path.basename(decodedPath);
  if (baseName && baseName !== '.') {
    let rootPath = path.join(__dirname, baseName);
    if (fs.existsSync(rootPath)) {
      try {
        const stat = fs.statSync(rootPath);
        if (stat.isFile()) {
          return serveFileWithMime(res, rootPath);
        }
      } catch (e) {
        // Ignore stat error and continue
      }
    }
    // Also check for SVG alternative if PNG was requested
    if (baseName.endsWith('.png')) {
      const svgAlternative = path.join(__dirname, baseName.replace(/\.png$/, '.svg'));
      if (fs.existsSync(svgAlternative)) {
        return serveFileWithMime(res, svgAlternative);
      }
    }
  }

  next();
});

// Fallback to Express static
app.use(express.static(__dirname));

// Start server
app.listen(PORT, HOST, () => {
  console.log(`Who Wants To Be A Millionaire server running at http://${HOST}:${PORT}`);
});
