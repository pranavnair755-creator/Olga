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

// High-quality fallback questions in case API is unavailable
const fallbackQuestionsTiered = [
  {
    category: "Indian Geography",
    question: "Which city is known as the 'Pink City' of India?",
    a: "Udaipur",
    b: "Jaipur",
    c: "Jodhpur",
    d: "Bikaner",
    correct: "b"
  },
  {
    category: "Science",
    question: "What chemical element is represented by the symbol 'Au' on the periodic table?",
    a: "Silver",
    b: "Aluminum",
    c: "Gold",
    d: "Argon",
    correct: "c"
  },
  {
    category: "Indian Cinema",
    question: "Which song from the movie RRR won the Academy Award for Best Original Song in 2023?",
    a: "Jai Ho",
    b: "Naatu Naatu",
    c: "Chaiyya Chaiyya",
    d: "Kesariya",
    correct: "b"
  },
  {
    category: "Sports",
    question: "In cricket, how many runs are scored if a batsman hits the ball over the boundary rope without it touching the ground?",
    a: "4 runs",
    b: "5 runs",
    c: "6 runs",
    d: "8 runs",
    correct: "c"
  },
  {
    category: "Indian Culture",
    question: "The traditional classical dance form 'Kathakali' originated in which Indian state?",
    a: "Tamil Nadu",
    b: "Kerala",
    c: "Odisha",
    d: "Karnataka",
    correct: "b"
  },
  {
    category: "World Heritage",
    question: "The ancient rock-cut caves of Ajanta and Ellora are situated in which district of Maharashtra?",
    a: "Pune",
    b: "Chhatrapati Sambhaji Nagar (Aurangabad)",
    c: "Nashik",
    d: "Kolhapur",
    correct: "b"
  },
  {
    category: "Space Science",
    question: "What was the name of the landing site near the South Pole of the Moon chosen for Chandrayaan-3's Vikram lander?",
    a: "Tiranga Point",
    b: "Shiv Shakti Point",
    c: "Jawahar Point",
    d: "Aryabhata Point",
    correct: "b"
  },
  {
    category: "Literature",
    question: "Who was the first Asian and Indian to be awarded the Nobel Prize in Literature in 1913?",
    a: "C. V. Raman",
    b: "Rabindranath Tagore",
    c: "Sarojini Naidu",
    d: "Sri Aurobindo",
    correct: "b"
  },
  {
    category: "Indian Polity",
    question: "Who is known as the 'Father of the Indian Constitution' and was Chairman of the Drafting Committee?",
    a: "Dr. B. R. Ambedkar",
    b: "Dr. Rajendra Prasad",
    c: "Sardar Vallabhbhai Patel",
    d: "Jawaharlal Nehru",
    correct: "a"
  },
  {
    category: "World Geography",
    question: "Which is the highest plateau in the world, often referred to as the 'Roof of the World'?",
    a: "Deccan Plateau",
    b: "Colorado Plateau",
    c: "Tibetan Plateau",
    d: "Anatolian Plateau",
    correct: "c"
  },
  {
    category: "Ancient History",
    question: "The Ashoka Pillar capital at Sarnath, adopted as India's national emblem, features how many Asiatic lions standing back to back?",
    a: "Three",
    b: "Four",
    c: "Five",
    d: "Six",
    correct: "b"
  },
  {
    category: "Physics & Chemistry",
    question: "Which noble gas was discovered during a total solar eclipse in Guntur, India in 1868 by astronomer Pierre Janssen?",
    a: "Neon",
    b: "Krypton",
    c: "Helium",
    d: "Xenon",
    correct: "c"
  },
  {
    category: "Indian Railways",
    question: "Between which two stations did India's first commercial passenger train run on April 16, 1853?",
    a: "Bori Bunder to Thane",
    b: "Howrah to Hooghly",
    c: "Royapuram to Wallajah Road",
    d: "Delhi to Agra",
    correct: "a"
  },
  {
    category: "Economics & Currency",
    question: "Who designed the official Indian Rupee currency symbol (₹) adopted by the Government of India in 2010?",
    a: "R. K. Laxman",
    b: "D. Udaya Kumar",
    c: "Nandan Nilekani",
    d: "B. V. Doshi",
    correct: "b"
  },
  {
    category: "1 CRORE Grand Finale",
    question: "In 1911, which historic British monarch visited India and laid the foundation stone of New Delhi during the Delhi Durbar?",
    a: "King George V",
    b: "King Edward VII",
    c: "Queen Victoria",
    d: "King George VI",
    correct: "a"
  }
];

const fallbackSwitchQuestionsTiered = [
  { category: "Pop Culture", question: "Which superhero is known as the 'Caped Crusader'?", a: "Superman", b: "Batman", c: "Spider-Man", d: "Iron Man", correct: "b" },
  { category: "Nature", question: "What is the national aquatic animal of India?", a: "Ganges River Dolphin", b: "Gharial", c: "Olive Ridley Turtle", d: "Golden Mahseer", correct: "a" },
  { category: "Food & Drink", question: "Which spice is often called the 'King of Spices' and is indigenous to the Western Ghats of India?", a: "Cardamom", b: "Black Pepper", c: "Clove", d: "Cinnamon", correct: "b" },
  { category: "Sports", question: "How many grand slam singles titles did Roger Federer win in his tennis career?", a: "18", b: "20", c: "22", d: "24", correct: "b" },
  { category: "Astronomy", question: "Which planet in our solar system has the most prominent ring system visible through telescopes?", a: "Jupiter", b: "Saturn", c: "Uranus", d: "Neptune", correct: "b" },
  { category: "Inventions", question: "Who is traditionally credited with inventing the World Wide Web in 1989?", a: "Bill Gates", b: "Tim Berners-Lee", c: "Steve Jobs", d: "Vint Cerf", correct: "b" },
  { category: "Monuments", question: "The Gateway of India in Mumbai was built to commemorate the landing of which royal couple in 1911?", a: "King George V and Queen Mary", b: "King Edward VII and Queen Alexandra", c: "Prince Charles and Princess Diana", d: "Queen Elizabeth II and Prince Philip", correct: "a" },
  { category: "Biology", question: "Which organelle is universally referred to as the 'powerhouse of the cell'?", a: "Ribosome", b: "Mitochondria", c: "Nucleus", d: "Golgi body", correct: "b" },
  { category: "World History", question: "Which ancient civilization constructed the famous Machu Picchu high in the Andes Mountains?", a: "Aztec", b: "Inca", c: "Maya", d: "Olmec", correct: "b" },
  { category: "Geography", question: "Which is the longest freshwater river flowing entirely within India?", a: "Yamuna", b: "Ganga", c: "Godavari", d: "Brahmaputra", correct: "b" },
  { category: "Literature", question: "Who authored the famous Sanskrit epic 'Meghaduta' and the play 'Abhijnanasakuntalam'?", a: "Bhasa", b: "Kalidasa", c: "Bhavabhuti", d: "Banabhatta", correct: "b" },
  { category: "Nobel Laureates", question: "In which year did Mother Teresa receive the Nobel Peace Prize?", a: "1971", b: "1979", c: "1983", d: "1989", correct: "b" },
  { category: "Aviation", question: "Who was the first licensed pilot in India, obtaining commercial license No. 1 in 1929?", a: "J. R. D. Tata", b: "Subroto Mukherjee", c: "Air Marshal Aspy Engineer", d: "Rakesh Sharma", correct: "a" },
  { category: "Fine Arts", question: "Who painted the famous Indian national portrait 'Bharat Mata' in 1905?", a: "Raja Ravi Varma", b: "Abanindranath Tagore", c: "Nandalal Bose", d: "Amrita Sher-Gil", correct: "b" },
  { category: "Deep History", question: "Which ancient Indian mathematician and astronomer first approximated Pi to four decimal places (3.1416) in 499 CE?", a: "Aryabhata", b: "Brahmagupta", c: "Bhaskara II", d: "Varahamihira", correct: "a" }
];

// POST /api/chat - Hint Help multi-turn chatbot lifeline
app.post('/api/chat', async (req, res) => {
  try {
    const { messages = [], currentQuestion = {}, questionLevel = 1, prizeAmount = 'Rs. 1,000' } = req.body;

    const qText = currentQuestion.question || 'Unknown question';
    const optA = currentQuestion.a || '';
    const optB = currentQuestion.b || '';
    const optC = currentQuestion.c || '';
    const optD = currentQuestion.d || '';
    const correctLetter = (currentQuestion.correct || '').toUpperCase();
    const category = currentQuestion.category || 'General Knowledge';

    const systemInstruction = `You are the official "Hint Help" lifeline on "Who Wants To Be A Millionaire" (Kaun Banega Crorepati broadcast format).
The contestant has summoned you for tactical assistance on Question #${questionLevel} for ${prizeAmount}.

CURRENT QUESTION ON SCREEN:
Category: ${category}
Question: ${qText}
[A]: ${optA}
[B]: ${optB}
[C]: ${optC}
[D]: ${optD}
The correct answer is Option [${correctLetter}].

LIFELINE RULES & PERSONA:
1. You are brilliant, witty, sharp, supportive, and immersed in high-stakes game show suspense.
2. DO NOT immediately blurt out "The answer is ${correctLetter}" or give the final answer away on the very first message, unless the contestant explicitly insists ("Just tell me the answer!", "What is your final verdict?", "Give me the answer directly").
3. Your primary duty as "Hint Help" is to give strategic guidance:
   - Provide historical, scientific, or etymological context that points in the right direction.
   - Point out traps or suspicious distractors among the four options.
   - Eliminate 1 or 2 wrong answers if the contestant asks for eliminations or looks stuck.
   - Give an honest confidence estimate if asked (e.g., "I'm about 80% confident...").
4. Keep answers concise, high-impact, and easy to read quickly on studio screens (2-4 punchy sentences or clear bullet points).
5. Address the contestant directly and maintain TV broadcast character at all times.`;

    // Format chat history for @google/genai
    const contents = [];
    for (const msg of messages) {
      if (!msg.text) continue;
      const role = (msg.role === 'model' || msg.role === 'assistant') ? 'model' : 'user';
      contents.push({
        role,
        parts: [{ text: String(msg.text) }]
      });
    }

    // If no user messages provided yet, generate an opening hint
    if (contents.length === 0) {
      contents.push({
        role: 'user',
        parts: [{ text: "I have activated the Hint Help lifeline! Give me an opening clue about this question." }]
      });
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      return res.json({ reply: response.text || "Hint Help says: Focus closely on the root meanings and dates of the options provided." });
    } catch (apiError) {
      console.warn("Gemini chat API error, falling back to heuristic hint:", apiError.message);
      // Smart heuristic fallback if no API key or quota issue
      const correctText = currentQuestion[currentQuestion.correct] || 'the key option';
      return res.json({
        reply: `Hint Help here! Look closely at the details: consider which options can be eliminated first. Option "${correctText}" has compelling historical and contextual evidence behind it. Trust your instincts!`
      });
    }
  } catch (err) {
    console.error("Chat endpoint error:", err);
    return res.status(500).json({ error: "Failed to process Hint Help request", reply: "Hint Help is experiencing a temporary studio glitch. Double check the options!" });
  }
});

// POST /api/generate-questions - Generates 15 progressive questions + 15 switch questions
app.post('/api/generate-questions', async (req, res) => {
  try {
    const prompt = `Generate a brand new set of 15 Who Wants To Be A Millionaire questions with ascending difficulty, plus 15 alternative switch questions for the "Switch the Question" lifeline.
The game is played in Indian Rupees (from Rs. 1,000 up to Rs. 1 CRORE).
The questions should cover diverse trivia: Indian & world history, geography, science & technology, cinema & pop culture, sports, literature, and nature.

Difficulty progression for the 15 questions:
- Q1 to Q5: Tier 1 (Warm-up, fun, accessible trivia for amounts Rs. 1,000 to Rs. 10,000)
- Q6 to Q10: Tier 2 (Intermediate, intriguing general knowledge for amounts Rs. 20,000 to Rs. 3,20,000)
- Q11 to Q15: Tier 3 (Mastery level, challenging, nuanced, deserving of Rs. 6,40,000 up to Rs. 1 CRORE)

Requirements:
- Each question must have:
  - "category": Short string
  - "question": Clear, engaging question string (avoid overly long paragraphs)
  - "a": Option A text
  - "b": Option B text
  - "c": Option C text
  - "d": Option D text
  - "correct": exactly one lowercase letter: "a", "b", "c", or "d"

Return ONLY a valid JSON object matching this exact structure:
{
  "questions": [
    { "category": "...", "question": "...", "a": "...", "b": "...", "c": "...", "d": "...", "correct": "a" }
  ],
  "switchQuestions": [
    { "category": "...", "question": "...", "a": "...", "b": "...", "c": "...", "d": "...", "correct": "b" }
  ]
}
Make sure both lists contain exactly 15 questions.`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.8,
        }
      });

      let parsed = null;
      try {
        const cleaned = (response.text || '').replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
        parsed = JSON.parse(cleaned);
      } catch (jsonErr) {
        console.warn("JSON parse warning:", jsonErr.message);
      }

      if (parsed && Array.isArray(parsed.questions) && parsed.questions.length >= 15) {
        return res.json({
          success: true,
          source: 'gemini',
          questions: parsed.questions.slice(0, 15),
          switchQuestions: (Array.isArray(parsed.switchQuestions) && parsed.switchQuestions.length >= 15) 
            ? parsed.switchQuestions.slice(0, 15) 
            : fallbackSwitchQuestionsTiered
        });
      }
    } catch (apiError) {
      console.warn("Gemini question generation error, using curated tiered questions:", apiError.message);
    }

    // Return fallback curated questions
    return res.json({
      success: true,
      source: 'fallback',
      questions: fallbackQuestionsTiered,
      switchQuestions: fallbackSwitchQuestionsTiered
    });
  } catch (err) {
    console.error("Generate questions error:", err);
    return res.json({
      success: true,
      source: 'fallback',
      questions: fallbackQuestionsTiered,
      switchQuestions: fallbackSwitchQuestionsTiered
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
