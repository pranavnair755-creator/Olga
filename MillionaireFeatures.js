/**
 * MillionaireFeatures.js
 * 
 * 1. Soundtrack Remix Studio & Jukebox (Lyria Music via lyria-3-clip-preview & Audio Presets)
 * 2. Picture Questions & Visual Trivia HUD (gemini-nano-banana-2.1)
 * 3. Voice Answer / Microphone Transcription (gemini-3.5-transcribe)
 * 4. Persistent Gameplay Storage & Auth (Firebase Firestore & Google Auth)
 */

(function() {
  'use strict';

  window.MillionaireFeatures = {
    activeRemixStyle: 'classic',
    activeTrackTitle: 'Classic Orchestral (Original 1998)',
    currentRemixAudio: null,
    isPlayingRemix: false,
    masterVolume: 0.85,
    firebase: {
      isReady: false,
      user: null,
      db: null,
      auth: null
    }
  };

  /* =========================================================================
   * 1. PICTURE QUESTIONS & VISUAL TRIVIA HUD (gemini-nano-banana-2.1)
   * ========================================================================= */
  window.displayQuestionImage = function(imageUrl) {
    var $frame = $('#questionImageFrame');
    if (!$frame.length) return;

    if (imageUrl) {
      $('#questionImageElement').attr('src', imageUrl);
      $frame.stop(true, true).css({ opacity: 0, transform: 'translateX(-50%) scale(0.92)' }).show().animate({
        opacity: 1
      }, {
        duration: 400,
        step: function(now, fx) {
          if (fx.prop === 'opacity') {
            var scale = 0.92 + (0.08 * now);
            $frame.css('transform', 'translateX(-50%) scale(' + scale + ')');
          }
        }
      });
    } else {
      window.hideQuestionImage();
    }
  };

  window.hideQuestionImage = function() {
    var $frame = $('#questionImageFrame');
    if ($frame.is(':visible')) {
      $frame.stop(true, true).animate({
        opacity: 0
      }, {
        duration: 250,
        complete: function() {
          $frame.hide();
        }
      });
    }
  };

  window.generateAIPictureQuestion = function() {
    if (typeof showToastNotification === 'function') {
      showToastNotification("🎨 Generating AI Picture Question via Gemini Nano Banana...");
    }
    fetch('/api/generate-image-question', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic: "world landmarks and wonders of science" })
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
      if (data && data.success && data.question) {
        var q = data.question;
        var currentLevel = window.GameVariables.QuestionLevel || 1;
        var newQ = new QuestionAndAnswer();
        newQ.Category = q.category || "AI Picture Question";
        newQ.Question = q.question;
        newQ.AnswerA = q.a;
        newQ.AnswerB = q.b;
        newQ.AnswerC = q.c;
        newQ.AnswerD = q.d;
        newQ.CorrectAnswer = (q.correct || 'a').toLowerCase();
        newQ.ImageUrl = q.imageUrl;

        window.GameVariables.QuestionsAndAnswers[currentLevel - 1] = newQ;
        setQuestion(false);
        if (typeof showToastNotification === 'function') {
          showToastNotification("✨ Picture Question Loaded: " + (q.question.substring(0, 42)) + "...");
        }
      }
    })
    .catch(function(err) {
      console.error("AI picture question failed:", err);
    });
  };

  /* =========================================================================
   * 2. SOUNDTRACK REMIX STUDIO & JUKEBOX (Lyria Music Models)
   * ========================================================================= */
  var trackProfiles = {
    'classic': {
      title: 'Classic Orchestral (Original 1998)',
      desc: 'Keith Strachan suspense arrangement with low synth heartbeat and orchestral swells.',
      bpm: '96 BPM',
      vibe: 'Classic TV Tension',
      playbackRate: 1.0
    },
    'synthwave': {
      title: '80s Synthwave Suspense Remix',
      desc: 'Driving analog synth arpeggios, retro neon pads, and pulse drum grooves.',
      bpm: '108 BPM',
      vibe: 'Cyber Neon Retrowave',
      playbackRate: 1.05
    },
    'cyberpunk': {
      title: 'Cyberpunk 2077 Bass Pulse',
      desc: 'Aggressive dark-electro bass, industrial percussion, and high-stakes futuristic tension.',
      bpm: '116 BPM',
      vibe: 'High-Tech Dystopian',
      playbackRate: 1.12
    },
    'cinematic': {
      title: 'Cinematic Hybrid Orchestral',
      desc: 'Rolling war-drums, Hans Zimmer-style brass risers, and sub-bass impact.',
      bpm: '92 BPM',
      vibe: 'Epic Hollywood Blockbuster',
      playbackRate: 0.95
    },
    'desi_fusion': {
      title: 'Desi Sitar & Tabla Tension Fusion',
      desc: 'Indian classical drone with fast acoustic tabla groove and haunting sitar harmonics.',
      bpm: '102 BPM',
      vibe: 'Indian Classical Fusion',
      playbackRate: 1.0
    },
    'slowed_reverb': {
      title: 'Slowed + Atmospheric Reverb',
      desc: 'Dreamy low-frequency echo chamber with spatial suspense and deep sub tones.',
      bpm: '82 BPM',
      vibe: 'Ethereal Spatial Suspense',
      playbackRate: 0.86
    }
  };

  window.setSoundtrackRemix = function(styleKey) {
    var profile = trackProfiles[styleKey] || trackProfiles['classic'];
    window.MillionaireFeatures.activeRemixStyle = styleKey;
    window.MillionaireFeatures.activeTrackTitle = profile.title;

    // Update active UI cards
    $('.remix-card').removeClass('active');
    $('.remix-card[data-style="' + styleKey + '"]').addClass('active');
    $('#nowPlayingTitle').text(profile.title);
    $('#nowPlayingMeta').text(profile.bpm + ' • ' + profile.vibe);
    $('#waveformVisualizer').addClass('active');

    // If an AI Lyria audio clip was playing, pause it if switching to preset
    if (styleKey !== 'lyria' && window.MillionaireFeatures.currentRemixAudio) {
      window.MillionaireFeatures.currentRemixAudio.pause();
      window.MillionaireFeatures.isPlayingRemix = false;
    }

    // Apply speed and pitch adjustment to main game background audio
    if (window.GameVariables && window.GameVariables.GeneralSound) {
      window.GameVariables.GeneralSound.playbackRate = profile.playbackRate || 1.0;
    }

    if (typeof showToastNotification === 'function') {
      showToastNotification("🎧 Active Soundtrack: " + profile.title);
    }
  };

  window.generateLyriaMusicRemix = function() {
    var promptInput = $('#lyriaPromptInput').val() || "Epic dramatic modern electronic orchestral remix of Who Wants To Be A Millionaire with intense heartbeat pulse and soaring brass";
    var $genBtn = $('#btnGenerateLyria');
    $genBtn.prop('disabled', true).html('<span class="pulse-red"></span> Generating with Lyria AI...');

    if (typeof showToastNotification === 'function') {
      showToastNotification("🎶 Composing 30s Soundtrack Remix via Google Lyria Music...");
    }

    fetch('/api/remix-soundtrack', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        style: promptInput,
        track: "main_theme"
      })
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
      $genBtn.prop('disabled', false).html('<span>✨ Generate Custom Track with Lyria</span>');
      if (data && data.success && data.audioDataUrl) {
        if (window.MillionaireFeatures.currentRemixAudio) {
          window.MillionaireFeatures.currentRemixAudio.pause();
        }
        window.MillionaireFeatures.currentRemixAudio = new Audio(data.audioDataUrl);
        window.MillionaireFeatures.currentRemixAudio.loop = true;
        window.MillionaireFeatures.currentRemixAudio.volume = window.MillionaireFeatures.masterVolume;
        window.MillionaireFeatures.currentRemixAudio.play();
        window.MillionaireFeatures.isPlayingRemix = true;

        window.MillionaireFeatures.activeRemixStyle = 'lyria';
        window.MillionaireFeatures.activeTrackTitle = 'AI Lyria Live Generation: "' + (promptInput.substring(0, 32)) + '..."';
        
        $('.remix-card').removeClass('active');
        $('#nowPlayingTitle').text(window.MillionaireFeatures.activeTrackTitle);
        $('#nowPlayingMeta').text('Generated AI Audio • 30s Clip • Active Loop');
        $('#waveformVisualizer').addClass('active');

        // Mute original game sound while Lyria track is actively looping
        if (window.GameVariables && window.GameVariables.GeneralSound) {
          window.GameVariables.GeneralSound.pause();
        }

        if (typeof showToastNotification === 'function') {
          showToastNotification("🎵 Lyria AI Soundtrack Remix is now playing!");
        }
      } else {
        if (typeof showToastNotification === 'function') {
          showToastNotification("⚡ Playing High-Tension Synthwave Extended Mix");
        }
        window.setSoundtrackRemix('synthwave');
      }
    })
    .catch(function(err) {
      $genBtn.prop('disabled', false).html('<span>✨ Generate Custom Track with Lyria</span>');
      console.warn("Lyria generation error:", err);
      window.setSoundtrackRemix('synthwave');
    });
  };

  window.toggleSoundtrackPlayback = function() {
    var $btn = $('#btnToggleRemixPlay');
    if (window.MillionaireFeatures.currentRemixAudio && !window.MillionaireFeatures.currentRemixAudio.paused) {
      window.MillionaireFeatures.currentRemixAudio.pause();
      $btn.html('<span>▶️ Play</span>');
      $('#waveformVisualizer').removeClass('active');
    } else if (window.MillionaireFeatures.currentRemixAudio) {
      window.MillionaireFeatures.currentRemixAudio.play();
      $btn.html('<span>⏸️ Pause</span>');
      $('#waveformVisualizer').addClass('active');
    } else if (window.GameVariables && window.GameVariables.GeneralSound) {
      if (window.GameVariables.GeneralSound.paused) {
        window.GameVariables.GeneralSound.play();
        $btn.html('<span>⏸️ Pause</span>');
        $('#waveformVisualizer').addClass('active');
      } else {
        window.GameVariables.GeneralSound.pause();
        $btn.html('<span>▶️ Play</span>');
        $('#waveformVisualizer').removeClass('active');
      }
    }
  };

  window.setRemixMasterVolume = function(val) {
    var volume = Math.max(0, Math.min(1, parseFloat(val)));
    window.MillionaireFeatures.masterVolume = volume;
    if (window.MillionaireFeatures.currentRemixAudio) {
      window.MillionaireFeatures.currentRemixAudio.volume = volume;
    }
    if (window.GameVariables && window.GameVariables.GeneralSound) {
      window.GameVariables.GeneralSound.volume = volume;
    }
    $('#volumeDisplayVal').text(Math.round(volume * 100) + '%');
  };

  /* =========================================================================
   * 3. MICROPHONE VOICE INPUT (gemini-3.5-transcribe)
   * ========================================================================= */
  var mediaRecorder = null;
  var audioChunks = [];
  var isRecordingVoice = false;

  window.toggleVoiceRecognition = function() {
    if (isRecordingVoice) {
      stopVoiceRecording();
    } else {
      startVoiceRecording();
    }
  };

  function startVoiceRecording() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      fallbackWebSpeechRecognition();
      return;
    }

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(function(stream) {
        audioChunks = [];
        isRecordingVoice = true;
        $('#btnVoiceAnswer').addClass('recording').html('<span class="pulse-red"></span> Listening...');
        if (typeof showToastNotification === 'function') {
          showToastNotification("🎙️ Listening... Say 'Option A', 'Final Answer B', or '50:50'");
        }

        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = function(e) {
          if (e.data.size > 0) {
            audioChunks.push(e.data);
          }
        };

        mediaRecorder.onstop = function() {
          isRecordingVoice = false;
          $('#btnVoiceAnswer').removeClass('recording').html('<span class="btn-icon">🎙️</span><span class="btn-text">Voice Input</span>');
          var audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
          sendAudioForTranscription(audioBlob);
          stream.getTracks().forEach(function(track) { track.stop(); });
        };

        mediaRecorder.start();
        setTimeout(function() {
          if (isRecordingVoice) {
            stopVoiceRecording();
          }
        }, 4000);
      })
      .catch(function(err) {
        console.warn("Microphone access notice:", err);
        fallbackWebSpeechRecognition();
      });
  }

  function stopVoiceRecording() {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
  }

  function sendAudioForTranscription(blob) {
    if (typeof showToastNotification === 'function') {
      showToastNotification("🧠 Transcribing voice via Gemini 3.5 Transcribe...");
    }
    var reader = new FileReader();
    reader.onloadend = function() {
      var base64data = reader.result.split(',')[1];
      fetch('/api/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base64Audio: base64data, mimeType: 'audio/webm' })
      })
      .then(function(res) { return res.json(); })
      .then(function(data) {
        if (data && data.success && data.transcript) {
          handleVoiceCommand(data.transcript);
        } else {
          fallbackWebSpeechRecognition();
        }
      })
      .catch(function() {
        fallbackWebSpeechRecognition();
      });
    };
    reader.readAsDataURL(blob);
  }

  function fallbackWebSpeechRecognition() {
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      if (typeof showToastNotification === 'function') {
        showToastNotification("⚠️ Speech Recognition unavailable in browser.");
      }
      return;
    }

    var recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    $('#btnVoiceAnswer').addClass('recording').html('<span class="pulse-red"></span> Listening...');
    if (typeof showToastNotification === 'function') {
      showToastNotification("🎙️ Listening... Say 'Option A', 'B', 'C', 'D' or '50 50'");
    }

    recognition.onresult = function(event) {
      var transcript = event.results[0][0].transcript;
      handleVoiceCommand(transcript);
    };

    recognition.onend = function() {
      $('#btnVoiceAnswer').removeClass('recording').html('<span class="btn-icon">🎙️</span><span class="btn-text">Voice Input</span>');
    };

    recognition.onerror = function(err) {
      $('#btnVoiceAnswer').removeClass('recording').html('<span class="btn-icon">🎙️</span><span class="btn-text">Voice Input</span>');
      console.warn("Speech recognition error:", err);
    };

    recognition.start();
  }

  function handleVoiceCommand(transcript) {
    var text = transcript.toLowerCase();
    if (typeof showToastNotification === 'function') {
      showToastNotification('🗣️ You said: "' + transcript + '"');
    }

    if (text.includes('final a') || text.includes('lock in a') || text.includes('option a') || text.trim() === 'a') {
      pressKey(49);
    } else if (text.includes('final b') || text.includes('lock in b') || text.includes('option b') || text.trim() === 'b') {
      pressKey(50);
    } else if (text.includes('final c') || text.includes('lock in c') || text.includes('option c') || text.trim() === 'c') {
      pressKey(51);
    } else if (text.includes('final d') || text.includes('lock in d') || text.includes('option d') || text.trim() === 'd') {
      pressKey(52);
    } else if (text.includes('fifty') || text.includes('50')) {
      pressKey(70);
    } else if (text.includes('phone') || text.includes('friend')) {
      pressKey(80);
    } else if (text.includes('audience') || text.includes('ask')) {
      pressKey(65);
    } else if (text.includes('next') || text.includes('continue')) {
      pressKey(39);
    } else if (text.includes('tree') || text.includes('money')) {
      pressKey(37);
    }
  }

  /* =========================================================================
   * 4. FIREBASE GAMEPLAY PERSISTENCE & GOOGLE AUTH (Firestore)
   * ========================================================================= */
  window.initFirebaseServices = async function() {
    try {
      var configRes = await fetch('/firebase-applet-config.json');
      var firebaseConfig = await configRes.json();

      var { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js');
      var { getAuth, signInWithPopup, GoogleAuthProvider, signInAnonymously, onAuthStateChanged, signOut } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js');
      var { getFirestore, doc, setDoc, getDoc, getDocFromServer, collection, query, where, getDocs } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');

      var app = initializeApp(firebaseConfig);
      var auth = getAuth(app);
      var db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

      window.MillionaireFeatures.firebase.db = db;
      window.MillionaireFeatures.firebase.auth = auth;
      window.MillionaireFeatures.firebase.isReady = true;

      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (connErr) {
        // Connection test completed
      }

      onAuthStateChanged(auth, function(user) {
        window.MillionaireFeatures.firebase.user = user;
        updateUserUI(user);
        if (user) {
          syncUserProfile(user);
          loadUserGameHistory(user.uid);
        }
      });

      if (!auth.currentUser) {
        signInAnonymously(auth).catch(function() {});
      }

      console.log("Firebase initialized successfully with Firestore & Auth");
    } catch (err) {
      console.warn("Firebase client init notice:", err.message);
    }
  };

  async function syncUserProfile(user) {
    if (!window.MillionaireFeatures.firebase.db || !user) return;
    var { doc, getDoc, setDoc } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');
    var db = window.MillionaireFeatures.firebase.db;
    var userRef = doc(db, 'users', user.uid);

    try {
      var snap = await getDoc(userRef);
      if (!snap.exists()) {
        await setDoc(userRef, {
          userId: user.uid,
          displayName: user.displayName || 'Champion Contestant',
          email: user.email || '',
          photoURL: user.photoURL || '',
          createdAt: new Date().toISOString(),
          gamesPlayed: 0,
          highestPrize: 0
        });
      }
    } catch (e) {
      console.warn("User profile sync notice:", e);
    }
  }

  window.saveGameplaySession = async function(isFinished, isWalkAway) {
    if (!window.MillionaireFeatures.firebase.isReady || !window.MillionaireFeatures.firebase.user) return;
    var user = window.MillionaireFeatures.firebase.user;
    var db = window.MillionaireFeatures.firebase.db;
    var level = (window.GameVariables && window.GameVariables.QuestionLevel) || 1;
    var prize = (window.GameVariables && window.GameVariables.PrizeAmounts) ? window.GameVariables.PrizeAmounts[Math.max(0, level - 2)] : 0;
    if (level === 15 && isFinished && !isWalkAway) {
      prize = 10000000;
    }

    try {
      var { doc, setDoc } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');
      var gameId = 'game_' + user.uid + '_' + (isFinished ? Date.now() : 'active');
      var gameRef = doc(db, 'games', gameId);

      var payload = {
        userId: user.uid,
        userName: user.displayName || 'Contestant',
        currentQuestionIndex: level,
        currentPrize: prize || 0,
        isGameOver: !!isFinished,
        isWalkAway: !!isWalkAway,
        score: level - 1,
        updatedAt: new Date().toISOString()
      };

      if (isFinished) {
        payload.createdAt = new Date().toISOString();
      }

      await setDoc(gameRef, payload, { merge: true });

      if (isFinished) {
        updateUserStatsOnFinish(user.uid, prize);
      }
    } catch (saveErr) {
      console.warn("Gameplay session save notice:", saveErr);
    }
  };

  async function updateUserStatsOnFinish(userId, prize) {
    if (!window.MillionaireFeatures.firebase.db) return;
    try {
      var { doc, getDoc, setDoc } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');
      var db = window.MillionaireFeatures.firebase.db;
      var userRef = doc(db, 'users', userId);
      var snap = await getDoc(userRef);
      if (snap.exists()) {
        var data = snap.data();
        var played = (data.gamesPlayed || 0) + 1;
        var highest = Math.max(data.highestPrize || 0, prize || 0);
        await setDoc(userRef, { gamesPlayed: played, highestPrize: highest }, { merge: true });
      }
    } catch (e) {
      console.warn("User stats update notice:", e);
    }
  }

  async function loadUserGameHistory(userId) {
    if (!window.MillionaireFeatures.firebase.db) return;
    try {
      var { collection, query, where, getDocs } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');
      var db = window.MillionaireFeatures.firebase.db;
      var gamesRef = collection(db, 'games');
      var q = query(gamesRef, where('userId', '==', userId));
      var snap = await getDocs(q);

      var list = [];
      snap.forEach(function(doc) {
        list.push(doc.data());
      });

      renderHistoryTable(list);
    } catch (e) {
      console.warn("Load history notice:", e);
    }
  }

  function renderHistoryTable(games) {
    var $tbody = $('#historyTableBody');
    if (!$tbody.length) return;
    $tbody.empty();

    if (!games || games.length === 0) {
      $tbody.append('<tr><td colspan="4" style="text-align:center;padding:16px;color:#94a3b8;">No stored games yet. Play now to save your record!</td></tr>');
      return;
    }

    games.sort(function(a, b) {
      return (b.updatedAt || '').localeCompare(a.updatedAt || '');
    });

    games.slice(0, 10).forEach(function(g, idx) {
      var prizeStr = g.currentPrize >= 10000000 ? 'Rs. 1 CRORE' : 'Rs. ' + (g.currentPrize || 0).toLocaleString('en-IN');
      var statusStr = g.currentPrize >= 10000000 ? '🏆 MILLIONAIRE' : (g.isWalkAway ? '🚶 Walked Away' : (g.isGameOver ? '❌ Game Over' : '⏳ In Progress'));
      var dateStr = g.updatedAt ? new Date(g.updatedAt).toLocaleDateString() : 'Today';

      $tbody.append(
        '<tr>' +
          '<td style="padding:8px 12px;color:#f8fafc;font-weight:600;">' + (idx + 1) + '</td>' +
          '<td style="padding:8px 12px;color:#fbbf24;font-weight:700;">' + prizeStr + '</td>' +
          '<td style="padding:8px 12px;color:#cbd5e1;">Q' + g.currentQuestionIndex + ' (' + statusStr + ')</td>' +
          '<td style="padding:8px 12px;color:#94a3b8;font-size:11px;">' + dateStr + '</td>' +
        '</tr>'
      );
    });
  }

  window.loginWithGoogle = async function() {
    if (!window.MillionaireFeatures.firebase.auth) return;
    var { signInWithPopup, GoogleAuthProvider } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js');
    var provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(window.MillionaireFeatures.firebase.auth, provider);
      if (typeof showToastNotification === 'function') {
        showToastNotification("✅ Signed in with Google! Cloud gameplay syncing is active.");
      }
    } catch (err) {
      console.warn("Google sign-in popup notice:", err.message);
    }
  };

  window.logoutFirebase = async function() {
    if (!window.MillionaireFeatures.firebase.auth) return;
    var { signOut } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js');
    await signOut(window.MillionaireFeatures.firebase.auth);
    if (typeof showToastNotification === 'function') {
      showToastNotification("Signed out of Google account");
    }
  };

  function updateUserUI(user) {
    if (user && !user.isAnonymous) {
      $('#userAuthBtn').html('<img src="' + (user.photoURL || 'follower.png') + '" class="user-avatar-mini" /> ' + (user.displayName || 'Player')).attr('title', 'Click to view Cloud History & Sign Out');
      $('#userStatusBadge').text('Cloud Saved ☁️').addClass('synced');
    } else {
      $('#userAuthBtn').html('🔑 Sign in with Google').attr('title', 'Connect Google account to sync gameplay history');
      $('#userStatusBadge').text('Guest Mode (Local)').removeClass('synced');
    }
  }

  $(document).ready(function() {
    window.initFirebaseServices();
  });

})();
