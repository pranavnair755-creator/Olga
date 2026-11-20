import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

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
  '.ogg': 'audio/ogg',
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

let ai = null;
let isGeminiAvailable = false;

const rawKey = (process.env.GEMINI_API_KEY || '').trim();
if (rawKey && rawKey.length > 10 && !/^(placeholder|undefined|null|your_api_key)$/i.test(rawKey)) {
  try {
    ai = new GoogleGenAI({
      apiKey: rawKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    isGeminiAvailable = true;
  } catch (err) {
    ai = null;
    isGeminiAvailable = false;
  }
}

function handleGeminiError(err) {
  if (!err) return;
  const msg = (err.message || String(err));
  if (/API key not valid|API_KEY_INVALID|INVALID_ARGUMENT|unauthorized|forbidden|400|403|PERMISSION_DENIED|quota/i.test(msg)) {
    isGeminiAvailable = false;
  }
}

app.use(express.json({ limit: '25mb' }));

// Rich multi-tier curated trivia bank
const tier1Pool = [
  { category: "Indian Geography", question: "Which city is known as the 'Pink City' of India?", a: "Udaipur", b: "Jaipur", c: "Jodhpur", d: "Bikaner", correct: "b" },
  { category: "World Heritage (Picture Question)", question: "Which iconic white marble mausoleum, built by Emperor Shah Jahan in Agra, is depicted in this image?", imageUrl: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80", a: "Taj Mahal", b: "Red Fort", c: "Humayun's Tomb", d: "Qutub Minar", correct: "a" },
  { category: "Astronomy (Picture Question)", question: "Which planet in our solar system, captured here with its prominent ring system, is shown?", imageUrl: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800&auto=format&fit=crop&q=80", a: "Jupiter", b: "Saturn", c: "Uranus", d: "Neptune", correct: "b" },
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
  { category: "Archaeology (Picture Question)", question: "Which ancient Incan citadel set high in the Andes Mountains of Peru is depicted in this image?", imageUrl: "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800&auto=format&fit=crop&q=80", a: "Chichen Itza", b: "Machu Picchu", c: "Tikal", d: "Teotihuacan", correct: "b" },
  { category: "Wildlife (Picture Question)", question: "Which majestic animal, recognized as the national animal of India, is shown in this picture?", imageUrl: "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=800&auto=format&fit=crop&q=80", a: "Asiatic Lion", b: "Royal Bengal Tiger", c: "Indian Leopard", d: "Snow Leopard", correct: "b" },
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
  { category: "Deep Space (Picture Question)", question: "Which spiral galaxy, the nearest major galactic neighbor to our Milky Way, is captured here by astrophotography?", imageUrl: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&auto=format&fit=crop&q=80", a: "Triangulum Galaxy", b: "Andromeda Galaxy", c: "Whirlpool Galaxy", d: "Sombrero Galaxy", correct: "b" },
  { category: "Architecture (Picture Question)", question: "Which historic Roman amphitheatre, known worldwide for gladiatorial contests, is depicted in this photo?", imageUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&auto=format&fit=crop&q=80", a: "The Colosseum", b: "The Pantheon", c: "Roman Forum", d: "Circus Maximus", correct: "a" },
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
    imageUrl: rawQ.imageUrl || null,
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

// Track recently served questions so consecutive rounds never repeat
const recentQuestionTexts = [];
const MAX_RECENT_QUESTIONS = 120;

function recordRecentQuestions(questions) {
  if (!Array.isArray(questions)) return;
  for (const q of questions) {
    const text = (q && (q.question || q.q) || '').trim();
    if (text && !recentQuestionTexts.includes(text)) {
      recentQuestionTexts.push(text);
    }
  }
  while (recentQuestionTexts.length > MAX_RECENT_QUESTIONS) {
    recentQuestionTexts.shift();
  }
}

function pickNonRepeating(pool, count) {
  const fresh = pool.filter(q => !recentQuestionTexts.includes((q.question || '').trim()));
  const selected = shuffleArray(fresh).slice(0, count);
  if (selected.length < count) {
    const usedSet = new Set(selected.map(q => q.question));
    const remainder = shuffleArray(pool.filter(q => !usedSet.has(q.question))).slice(0, count - selected.length);
    selected.push(...remainder);
  }
  return selected.map(randomizeQuestionOptions);
}

// Generates a brand new, randomized game + switch questions with ascending difficulty
function generateDynamicGameQuestions(mode = 'solo') {
  if (mode === 'tournament_elimination') {
    const t1 = pickNonRepeating(tier1Pool, 3);
    const t2 = pickNonRepeating(tier2Pool, 4);
    const t3 = pickNonRepeating(tier3Pool, 3);
    const questions = [...t1, ...t2, ...t3];
    recordRecentQuestions(questions);
    return {
      questions,
      switchQuestions: pickNonRepeating(switchPool, 10)
    };
  }
  if (mode === 'tournament_finale') {
    const t2 = pickNonRepeating(tier2Pool, 5);
    const t3 = pickNonRepeating(tier3Pool, 10);
    const questions = [...t2, ...t3];
    recordRecentQuestions(questions);
    return {
      questions,
      switchQuestions: pickNonRepeating(tier3Pool, 15)
    };
  }
  const t1 = pickNonRepeating(tier1Pool, 5);
  const t2 = pickNonRepeating(tier2Pool, 5);
  const t3 = pickNonRepeating(tier3Pool, 5);
  const questions = [...t1, ...t2, ...t3];
  recordRecentQuestions(questions);
  return {
    questions,
    switchQuestions: pickNonRepeating(switchPool, 15)
  };
}

const questionItemSchema = {
  type: Type.OBJECT,
  properties: {
    category: { type: Type.STRING, description: "Short trivia category name." },
    question: { type: Type.STRING, description: "Clear, factual trivia question." },
    a: { type: Type.STRING, description: "Option A text." },
    b: { type: Type.STRING, description: "Option B text." },
    c: { type: Type.STRING, description: "Option C text." },
    d: { type: Type.STRING, description: "Option D text." },
    correct: { type: Type.STRING, description: "Correct option letter: 'a', 'b', 'c', or 'd'." },
  },
  required: ["category", "question", "a", "b", "c", "d", "correct"],
};

// Decode HTML entities returned by OpenTDB
function decodeHtmlEntities(str) {
  if (!str || typeof str !== 'string') return '';
  const named = {
    '&quot;': '"', '&amp;': '&', '&lt;': '<', '&gt;': '>', '&apos;': "'",
    '&#039;': "'", '&nbsp;': ' ', '&ndash;': '–', '&mdash;': '—',
    '&lsquo;': '‘', '&rsquo;': '’', '&ldquo;': '“', '&rdquo;': '”',
    '&hellip;': '…', '&deg;': '°', '&eacute;': 'é', '&egrave;': 'è',
    '&aacute;': 'á', '&iacute;': 'í', '&oacute;': 'ó', '&uacute;': 'ú',
    '&ntilde;': 'ñ', '&uuml;': 'ü', '&ouml;': 'ö', '&auml;': 'ä',
    '&ccedil;': 'ç', '&szlig;': 'ß', '&pi;': 'π', '&times;': '×',
  };
  return str
    .replace(/&[a-zA-Z0-9#]+;/g, (entity) => {
      if (named[entity]) return named[entity];
      if (entity.startsWith('&#x') || entity.startsWith('&#X')) {
        const code = parseInt(entity.slice(3, -1), 16);
        return isNaN(code) ? entity : String.fromCharCode(code);
      }
      if (entity.startsWith('&#')) {
        const code = parseInt(entity.slice(2, -1), 10);
        return isNaN(code) ? entity : String.fromCharCode(code);
      }
      return entity;
    });
}

// Persistent OpenTDB session token so live trivia questions never repeat across rounds
let openTdbSessionToken = null;

async function getOpenTdbToken(forceNew = false) {
  if (openTdbSessionToken && !forceNew) return openTdbSessionToken;
  try {
    const resp = await fetch('https://opentdb.com/api_token.php?command=request');
    const data = await resp.json();
    if (data && data.response_code === 0 && data.token) {
      openTdbSessionToken = data.token;
      return openTdbSessionToken;
    }
  } catch (e) {
    // Ignore token request error
  }
  return null;
}

async function fetchOpenTdbBatch(amount, difficulty) {
  const token = await getOpenTdbToken(false);
  const buildUrl = (tok) => {
    let url = `https://opentdb.com/api.php?amount=${amount}&type=multiple`;
    if (difficulty) url += `&difficulty=${difficulty}`;
    if (tok) url += `&token=${encodeURIComponent(tok)}`;
    return url;
  };

  let resp = await fetch(buildUrl(token));
  let data = await resp.json();

  // If session token is exhausted (code 4) or invalid (code 3), request a fresh token and retry once
  if (data && (data.response_code === 3 || data.response_code === 4)) {
    const freshToken = await getOpenTdbToken(true);
    resp = await fetch(buildUrl(freshToken));
    data = await resp.json();
  }

  if (!data || data.response_code !== 0 || !Array.isArray(data.results)) {
    return [];
  }

  return data.results.map((item) => {
    const raw = {
      category: decodeHtmlEntities(item.category || 'General Knowledge').replace(/^Entertainment:\s*|^Science:\s*/i, ''),
      question: decodeHtmlEntities(item.question || ''),
      a: decodeHtmlEntities(item.correct_answer || ''),
      b: decodeHtmlEntities((item.incorrect_answers && item.incorrect_answers[0]) || ''),
      c: decodeHtmlEntities((item.incorrect_answers && item.incorrect_answers[1]) || ''),
      d: decodeHtmlEntities((item.incorrect_answers && item.incorrect_answers[2]) || ''),
      correct: 'a',
    };
    return randomizeQuestionOptions(raw);
  });
}

async function generateLiveOpenTdbQuestions(mode = 'solo') {
  try {
    if (mode === 'tournament_finale') {
      // 10-question Finale: 100% HARD questions — significantly tougher than the Elimination Round
      const [hardMain, hardSwitch] = await Promise.all([
        fetchOpenTdbBatch(15, 'hard'),
        fetchOpenTdbBatch(15, 'hard'),
      ]);
      if (hardMain.length >= 10) {
        recordRecentQuestions(hardMain);
        return {
          questions: hardMain.slice(0, 15),
          switchQuestions: hardSwitch.length >= 10 ? hardSwitch.slice(0, 15) : pickNonRepeating(tier3Pool, 15),
        };
      }
    } else if (mode === 'tournament_elimination') {
      // Elimination Round: progressive easy (3) -> medium (4) -> hard (3)
      const [easy, medium, hard] = await Promise.all([
        fetchOpenTdbBatch(3, 'easy'),
        fetchOpenTdbBatch(4, 'medium'),
        fetchOpenTdbBatch(3, 'hard'),
      ]);
      const combined = [...easy, ...medium, ...hard];
      if (combined.length >= 10) {
        recordRecentQuestions(combined);
        return {
          questions: combined.slice(0, 10),
          switchQuestions: pickNonRepeating(switchPool, 10),
        };
      }
    } else {
      // Solo 15-question mode: progressive easy (5) -> medium (5) -> hard (5) + 15 switch
      const [easy, medium, hard, sw] = await Promise.all([
        fetchOpenTdbBatch(5, 'easy'),
        fetchOpenTdbBatch(5, 'medium'),
        fetchOpenTdbBatch(5, 'hard'),
        fetchOpenTdbBatch(15, 'medium'),
      ]);
      const combined = [...easy, ...medium, ...hard];
      if (combined.length >= 15) {
        recordRecentQuestions(combined);
        return {
          questions: combined.slice(0, 15),
          switchQuestions: sw.length >= 10 ? sw.slice(0, 15) : pickNonRepeating(switchPool, 15),
        };
      }
    }
  } catch (e) {
    // Fall through to local pool if offline
  }
  return null;
}

// POST /api/generate-questions - Generates a brand new progressively tougher set of questions for Solo, Tournament Elimination, or 10Q Finale
app.post('/api/generate-questions', async (req, res) => {
  const body = req.body || {};
  const isHard10Q = !!(body.format === '10q' || body.difficulty === 'hard');
  const mode = body.mode || (isHard10Q ? 'tournament_finale' : 'solo');
  const roundNonce = `${Date.now()}-${Math.floor(Math.random() * 1e9)}`;
  const avoidList = recentQuestionTexts.slice(-60);
  const avoidInstruction = avoidList.length > 0
    ? `\nDo NOT repeat or closely paraphrase any of these recently asked questions:\n- ${avoidList.join('\n- ')}\n`
    : '';

  try {
    // Priority 1: Gemini AI live generation (when GEMINI_API_KEY is configured)
    if (isGeminiAvailable && ai) {
      try {
        let prompt = '';
        let expectedMin = 15;
        let needSwitch = true;

        if (mode === 'tournament_elimination') {
          expectedMin = 10;
          needSwitch = false;
          prompt = `Round Session ID: ${roundNonce}
Generate a BRAND NEW set of 10 Who Wants To Be A Millionaire Tournament Elimination questions.
Every single question must be fresh, factually verified, unambiguous, and cover diverse topics (world history, science, geography, literature, arts, sports, economics, space, technology, culture).
STRICTLY ESCALATING DIFFICULTY:
- Q1 to Q3: Accessible warmup trivia.
- Q4 to Q6: Moderate-to-challenging general knowledge.
- Q7 to Q8: Challenging intermediate trivia.
- Q9 to Q10: Hard specialist knockout questions.${avoidInstruction}
Return a JSON object with a "questions" array of exactly 10 items.`;
        } else if (mode === 'tournament_finale') {
          expectedMin = 10;
          prompt = `Round Session ID: ${roundNonce}
Generate a BRAND NEW set of 15 BRUTALLY TOUGH, championship-level Who Wants To Be A Millionaire questions (10 for the $1 Million Finale + 5 reserve) and 15 equally hard alternative switch questions.
These 10-question Finale questions MUST be SIGNIFICANTLY TOUGHER than the Elimination Round — zero easy or moderate warmups!
The game is played in US Dollars (from $1,000 up to $1,000,000 in 10 questions).
STRICTLY ESCALATING GRANDMASTER DIFFICULTY:
- Q1 to Q3 ($1,000 – $5,000): Already hard specialist trivia (deep world history, advanced science, niche geography, economics, classical literature).
- Q4 to Q6 ($10,000 – $50,000): Very hard expert trivia (lesser-known historical treaties, Nobel laureates, astrophysics, rare biological/chemical facts).
- Q7 to Q8 ($100,000 – $250,000): Elite championship difficulty requiring deep academic/encyclopedic knowledge.
- Q9 to Q10 & reserve ($500,000 – $1 MILLION): Grandmaster / $1 MILLION finale difficulty — genuinely formidable, obscure-yet-unambiguous facts.${avoidInstruction}
Return a JSON object with "questions" (15 items) and "switchQuestions" (15 items).`;
        } else {
          expectedMin = 15;
          prompt = `Round Session ID: ${roundNonce}
Generate a BRAND NEW set of 15 Who Wants To Be A Millionaire Solo Hot Seat questions and 15 alternative switch questions for the "Switch the Question" lifeline.
The game is played in US Dollars (from $100 up to $1,000,000).
Cover diverse trivia: world & Indian history, geography, science & technology, cinema & arts, sports, literature, economics, and nature.
STRICTLY ESCALATING DIFFICULTY as the player climbs the money tree:
- Q1 to Q3 ($100 – $300): Easy, fun, accessible trivia.
- Q4 to Q5 ($500 – $1,000): Moderate general knowledge.
- Q6 to Q8 ($2,000 – $8,000): Challenging intermediate trivia.
- Q9 to Q11 ($16,000 – $64,000): Hard specialist knowledge.
- Q12 to Q15 ($125,000 – $1,000,000): Very hard to brutal grandmaster / $1 MILLION difficulty.${avoidInstruction}
Return a JSON object with "questions" (15 items) and "switchQuestions" (15 items).`;
        }

        const schemaProperties = {
          questions: {
            type: Type.ARRAY,
            items: questionItemSchema,
          }
        };
        const requiredFields = ["questions"];
        if (needSwitch) {
          schemaProperties.switchQuestions = {
            type: Type.ARRAY,
            items: questionItemSchema,
          };
          requiredFields.push("switchQuestions");
        }

        const response = await ai.models.generateContent({
          model: 'gemini-4-hydrogen',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: schemaProperties,
              required: requiredFields,
            },
          }
        });

        const cleaned = (response.text || '').replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
        const parsed = JSON.parse(cleaned);

        if (parsed && Array.isArray(parsed.questions) && parsed.questions.length >= expectedMin) {
          const finalQuestions = parsed.questions.slice(0, mode === 'tournament_elimination' ? 10 : 15).map(randomizeQuestionOptions);
          recordRecentQuestions(finalQuestions);
          const finalSwitch = (Array.isArray(parsed.switchQuestions) && parsed.switchQuestions.length >= 10)
            ? parsed.switchQuestions.slice(0, 15).map(randomizeQuestionOptions)
            : pickNonRepeating(mode === 'tournament_finale' ? tier3Pool : switchPool, 15);
          return res.json({
            success: true,
            source: 'gemini-4-hydrogen',
            mode,
            questions: finalQuestions,
            switchQuestions: finalSwitch
          });
        }
      } catch (apiError) {
        handleGeminiError(apiError);
      }
    }

    // Priority 2: Live OpenTDB API with session token (brand new, non-repeating questions every round)
    const liveOpenTdb = await generateLiveOpenTdbQuestions(mode);
    if (liveOpenTdb) {
      return res.json({
        success: true,
        source: mode === 'tournament_finale' ? 'opentdb_hard_10q' : 'opentdb_live',
        mode,
        questions: liveOpenTdb.questions,
        switchQuestions: liveOpenTdb.switchQuestions
      });
    }

    // Priority 3: Offline fallback from curated multi-tier pools
    const dynamicGame = generateDynamicGameQuestions(mode);
    return res.json({
      success: true,
      source: mode === 'tournament_finale' ? 'dynamic_hard_10q' : 'dynamic_engine',
      mode,
      questions: dynamicGame.questions,
      switchQuestions: dynamicGame.switchQuestions
    });
  } catch (err) {
    handleGeminiError(err);
    const dynamicGame = generateDynamicGameQuestions(mode);
    return res.json({
      success: true,
      source: 'dynamic_fallback',
      mode,
      questions: dynamicGame.questions,
      switchQuestions: dynamicGame.switchQuestions
    });
  }
});


// POST /api/remix-soundtrack - Generate music remixes using lyria-3-clip-preview / lyria-3-pro-preview
app.post('/api/remix-soundtrack', async (req, res) => {
  try {
    const { style = "synthwave", track = "main_theme" } = req.body;
    const prompt = `A 30-second tense and dramatic ${style} remix of the iconic Who Wants To Be A Millionaire ${track} soundtrack, featuring driving bass pulses, atmospheric synth arpeggios, and suspenseful game show orchestral tension.`;

    if (isGeminiAvailable && ai) {
      try {
        const response = await ai.models.generateContentStream({
          model: "lyria-3-clip-preview",
          contents: prompt,
        });

        const audioChunks = [];
        let mimeType = "audio/mpeg";

        for await (const chunk of response) {
          const parts = chunk.candidates?.[0]?.content?.parts;
          if (!parts) continue;
          for (const part of parts) {
            if (part.inlineData?.data) {
              if (audioChunks.length === 0 && part.inlineData.mimeType) {
                mimeType = part.inlineData.mimeType;
              }
              audioChunks.push(Buffer.from(part.inlineData.data, "base64"));
            }
          }
        }

        if (audioChunks.length > 0) {
          const audioBase64 = Buffer.concat(audioChunks).toString("base64");
          return res.json({
            success: true,
            audioDataUrl: `data:${mimeType};base64,${audioBase64}`,
            source: 'lyria-3-clip-preview',
            style: style
          });
        }
      } catch (lyriaErr) {
        handleGeminiError(lyriaErr);
      }
    }

    return res.json({
      success: true,
      source: 'preset_remix',
      style: style,
      message: `Activated ${style} sound profile`
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/generate-image-question - Generate picture question with gemini-nano-banana-2.1 or gemini-3.1-flash-lite-image
app.post('/api/generate-image-question', async (req, res) => {
  try {
    const { topic = "world monuments and astronomy" } = req.body;

    if (isGeminiAvailable && ai) {
      try {
        const textPrompt = `Generate a high-stakes Picture Question for Who Wants to Be a Millionaire about ${topic}.
Provide a vivid image generation prompt, question text referring directly to the image ("Which... is shown in this image?"), four distinct options a, b, c, d, and the correct option letter ('a','b','c', or 'd').
Return JSON:
{
  "imagePrompt": "A photorealistic detailed shot of...",
  "question": "Which...",
  "category": "Picture Question",
  "a": "...", "b": "...", "c": "...", "d": "...",
  "correct": "a"
}`;
        const textRes = await ai.models.generateContent({
          model: 'gemini-4-hydrogen',
          contents: textPrompt,
          config: { responseMimeType: 'application/json' }
        });

        const qData = JSON.parse(textRes.text || "{}");
        let generatedImageUrl = null;

        if (qData.imagePrompt) {
          try {
            const imgRes = await ai.models.generateContent({
              model: 'gemini-nano-banana-2.1',
              contents: { parts: [{ text: qData.imagePrompt }] },
              config: { imageConfig: { aspectRatio: "16:9", imageSize: "1K" } }
            });
            for (const part of imgRes.candidates?.[0]?.content?.parts ?? []) {
              if (part.inlineData?.data) {
                generatedImageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
                break;
              }
            }
          } catch (nanoErr) {
            handleGeminiError(nanoErr);
            try {
              const imgRes2 = await ai.models.generateContent({
                model: 'gemini-3.1-flash-lite-image',
                contents: { parts: [{ text: qData.imagePrompt }] },
                config: { imageConfig: { aspectRatio: "16:9" } }
              });
              for (const part of imgRes2.candidates?.[0]?.content?.parts ?? []) {
                if (part.inlineData?.data) {
                  generatedImageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
                  break;
                }
              }
            } catch (liteImgErr) {
              handleGeminiError(liteImgErr);
            }
          }
        }

        if (generatedImageUrl && qData.question) {
          qData.imageUrl = generatedImageUrl;
          return res.json({
            success: true,
            source: 'gemini-nano-banana',
            question: qData
          });
        }
      } catch (aiImgQErr) {
        handleGeminiError(aiImgQErr);
      }
    }

    const curatedBackup = [
      {
        category: "World Heritage (Picture Question)",
        question: "Which iconic white marble mausoleum, built by Emperor Shah Jahan in Agra, is depicted in this image?",
        imageUrl: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80",
        a: "Taj Mahal", b: "Red Fort", c: "Humayun's Tomb", d: "Qutub Minar",
        correct: "a"
      },
      {
        category: "Astronomy (Picture Question)",
        question: "Which planet in our solar system, captured here with its prominent ring system, is shown?",
        imageUrl: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800&auto=format&fit=crop&q=80",
        a: "Jupiter", b: "Saturn", c: "Uranus", d: "Neptune",
        correct: "b"
      },
      {
        category: "Archaeology (Picture Question)",
        question: "Which ancient Incan citadel set high in the Andes Mountains of Peru is depicted in this image?",
        imageUrl: "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800&auto=format&fit=crop&q=80",
        a: "Chichen Itza", b: "Machu Picchu", c: "Tikal", d: "Teotihuacan",
        correct: "b"
      },
      {
        category: "Wildlife (Picture Question)",
        question: "Which majestic animal, recognized as the national animal of India, is shown in this picture?",
        imageUrl: "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=800&auto=format&fit=crop&q=80",
        a: "Asiatic Lion", b: "Royal Bengal Tiger", c: "Indian Leopard", d: "Snow Leopard",
        correct: "b"
      }
    ];

    const pick = curatedBackup[Math.floor(Math.random() * curatedBackup.length)];
    return res.json({
      success: true,
      source: 'curated_picture_library',
      question: pick
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/transcribe - Audio speech-to-text using gemini-3.5-transcribe
app.post('/api/transcribe', async (req, res) => {
  try {
    const { base64Audio, mimeType = "audio/webm" } = req.body;
    if (!base64Audio) {
      return res.status(400).json({ error: "Missing base64Audio parameter" });
    }

    if (isGeminiAvailable && ai) {
      try {
        const audioPart = {
          inlineData: {
            mimeType: mimeType,
            data: base64Audio,
          },
        };

        const response = await ai.models.generateContent({
          model: "gemini-3.5-transcribe",
          contents: { parts: [audioPart, { text: "Transcribe this audio precisely. Extract any mention of choice A, B, C, or D, 'final answer', 'lock in', or lifelines like '50:50', 'phone a friend', or 'ask the audience'." }] },
        });

        return res.json({
          success: true,
          transcript: (response.text || "").trim(),
          source: 'gemini-3.5-transcribe'
        });
      } catch (transcribeErr) {
        handleGeminiError(transcribeErr);
      }
    }

    return res.json({
      success: false,
      error: "Transcription unavailable, check API key"
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
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
