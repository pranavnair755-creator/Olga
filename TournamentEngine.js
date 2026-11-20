/**
 * TournamentEngine.js
 * 
 * Interactive On-Stage Tournament Mode for "Who Wants to Be a Millionaire: The Tournament"
 * Plays directly on the iconic TV studio stage with live broadcast HUD, stage question lozenges,
 * answer boxes, reaction timer, knockout cuts, and Hot Seat Finale qualification.
 */

(function() {
  'use strict';

  var AI_CONTESTANTS = [
    { id: 'c1', name: 'Aarav Sharma', location: 'Mumbai', baseSkill: 0.88, speedMin: 2.1, speedMax: 4.5 },
    { id: 'c2', name: 'Priya Patel', location: 'Ahmedabad', baseSkill: 0.84, speedMin: 2.3, speedMax: 4.8 },
    { id: 'c3', name: 'Rohan Mehta', location: 'New Delhi', baseSkill: 0.82, speedMin: 2.5, speedMax: 5.2 },
    { id: 'c4', name: 'Ananya Iyer', location: 'Bengaluru', baseSkill: 0.85, speedMin: 2.0, speedMax: 4.6 },
    { id: 'c5', name: 'Vikram Singh', location: 'Jaipur', baseSkill: 0.78, speedMin: 2.8, speedMax: 5.8 },
    { id: 'c6', name: 'Sneha Rao', location: 'Hyderabad', baseSkill: 0.76, speedMin: 2.9, speedMax: 6.0 },
    { id: 'c7', name: 'Kabir Sen', location: 'Kolkata', baseSkill: 0.79, speedMin: 2.7, speedMax: 5.5 },
    { id: 'c8', name: 'Devika Nair', location: 'Kochi', baseSkill: 0.81, speedMin: 2.4, speedMax: 5.0 },
    { id: 'c9', name: 'Arjun Kapoor', location: 'Chandigarh', baseSkill: 0.72, speedMin: 3.2, speedMax: 6.5 }
  ];

  var TOURNAMENT_QUESTIONS = [
    {
      q: "Which 19th-century Treaty, signed in 1809 between Maharaja Ranjit Singh and the British East India Company, fixed the Sutlej River as the boundary of the Sikh Empire?",
      a: "Treaty of Amritsar", b: "Treaty of Lahore", c: "Treaty of Sugauli", d: "Treaty of Salbai",
      correct: "a", category: "Indian History"
    },
    {
      q: "In quantum mechanics, which principle states that no two identical fermions can simultaneously occupy the same quantum state within a quantum system?",
      a: "Heisenberg Uncertainty Principle", b: "Pauli Exclusion Principle", c: "Hund's Rule of Maximum Multiplicity", d: "Aufbau Principle",
      correct: "b", category: "Theoretical Physics"
    },
    {
      q: "Which strait separates the North and South Islands of New Zealand?",
      a: "Bass Strait", b: "Torres Strait", c: "Cook Strait", d: "Foveaux Strait",
      correct: "c", category: "World Geography"
    },
    {
      q: "Who was the first Indian woman to preside over the Indian National Congress at its Kanpur session in 1925?",
      a: "Annie Besant", b: "Sarojini Naidu", c: "Nellie Sengupta", d: "Vijaya Lakshmi Pandit",
      correct: "b", category: "Freedom Movement"
    },
    {
      q: "Which element, with atomic number 74, has the highest melting point of all pure metals and is denoted by the chemical symbol 'W'?",
      a: "Osmium", b: "Rhenium", c: "Tungsten", d: "Tantalum",
      correct: "c", category: "Chemistry"
    },
    {
      q: "Which ancient Indian treatise on statecraft, economic policy, and military strategy was discovered in manuscript form by R. Shamasastry in 1905?",
      a: "Arthashastra", b: "Manusmriti", c: "Nitisara", d: "Rajatarangini",
      correct: "a", category: "Classical Literature"
    },
    {
      q: "In international finance, the 'Bretton Woods Conference' of 1944 led to the creation of the IMF and which other major global institution?",
      a: "World Trade Organization", b: "International Bank for Reconstruction and Development", c: "Bank for International Settlements", d: "Asian Development Bank",
      correct: "b", category: "Global Economics"
    },
    {
      q: "Which spacecraft became the first human-made object to enter interstellar space in August 2012?",
      a: "Pioneer 10", b: "New Horizons", c: "Voyager 1", d: "Voyager 2",
      correct: "c", category: "Space Exploration"
    },
    {
      q: "Which Chola king launched a historic naval expedition across the Bay of Bengal in 1025 CE against the Srivijaya Empire in Southeast Asia?",
      a: "Raja Raja Chola I", b: "Kulothunga Chola I", c: "Rajendra Chola I", d: "Parantaka Chola I",
      correct: "c", category: "Medieval History"
    },
    {
      q: "Which mathematician proved Fermat's Last Theorem in 1994, solving a 358-year-old conjecture in number theory?",
      a: "Andrew Wiles", b: "Grigori Perelman", c: "Terence Tao", d: "Srinivasa Ramanujan",
      correct: "a", category: "Mathematics"
    }
  ];

  var TOURNAMENT_ELIMINATION_CUE = "/public/assets/aistudio/30sec_UK_41885c7f.wav";
  var FINALE_10Q_CUE = "/public/assets/aistudio/45sec_UK_1eea5d72.wav";

  // Elimination Round (Q1-Q10): 30sec UK cue for every question, plays until answer is revealed, Q1-Q5 right answer tune on reveal
  var TOURNAMENT_AUDIO_MAP = [
    { correct: "q1_to_q4_correct.mp3", lose: "q1_to_q5_lose.mp3" }, // Q1
    { correct: "q1_to_q4_correct.mp3", lose: "q1_to_q5_lose.mp3" }, // Q2
    { correct: "q1_to_q4_correct.mp3", lose: "q1_to_q5_lose.mp3" }, // Q3
    { correct: "q1_to_q4_correct.mp3", lose: "q1_to_q5_lose.mp3" }, // Q4
    { correct: "q1_to_q4_correct.mp3", lose: "q1_to_q5_lose.mp3" }, // Q5
    { correct: "q1_to_q4_correct.mp3", lose: "q1_to_q5_lose.mp3" }, // Q6
    { correct: "q1_to_q4_correct.mp3", lose: "q1_to_q5_lose.mp3" }, // Q7
    { correct: "q1_to_q4_correct.mp3", lose: "q1_to_q5_lose.mp3" }, // Q8
    { correct: "q1_to_q4_correct.mp3", lose: "q1_to_q5_lose.mp3" }, // Q9
    { correct: "q1_to_q4_correct.mp3", lose: "q1_to_q5_lose.mp3" }  // Q10
  ];

  window.TournamentEngine = {
    isActive: false,
    currentQuestionIndex: 0,
    questionStartTime: 0,
    timerInterval: null,
    userAnswered: false,
    waitingForNext: false,
    stageStep: 'idle', // 'question' | 'options' | 'answered' | 'revealed'
    pendingReveal: null,
    activeQuestions: [],
    players: [],
    
    // Entry point: starts the tournament as a real game on stage
    init: function() {
      this.startTournamentGame();
    },

    startTournamentGame: function() {
      // Cancel any pending Solo mode async timeouts or fetches
      if (window.GameVariables) {
        window.GameVariables.SoloRunId = (window.GameVariables.SoloRunId || 0) + 1;
        window.GameVariables.QuestionInProgress = false;
        window.GameVariables.IsPlayingFasestFinger = false;
        window.GameVariables.IsInCommercial = false;
        window.GameVariables.IsMoneyTreeShowing = false;
        window.GameVariables.IsTotalPrizeMoneyShowing = false;
        window.GameVariables.IsLogoShowing = false;
        window.GameVariables.QuestionSequenceCounter = -1;
        window.GameVariables.CannotLockInFinalAnswer = false;
        window.GameVariables.CurrentTargetAnswer = "";
        window.GameVariables.AnswerAIsOut = false;
        window.GameVariables.AnswerBIsOut = false;
        window.GameVariables.AnswerCIsOut = false;
        window.GameVariables.AnswerDIsOut = false;
        clearTimeout(window.GameVariables.ShowAnswerTimeout);
        clearTimeout(window.GameVariables.ShowWinnerTimeout);
        clearTimeout(window.GameVariables.ScaleTreeTimeout);
        clearTimeout(window.GameVariables.PAFClockTimeout);
      }
      this._tourneyRunId = (this._tourneyRunId || 0) + 1;
      clearTimeout(window.__ataVoteTimeout);
      clearTimeout(window.__ataDoneTimeout);

      // Stop all Solo audio channels
      try { if (typeof pauseTimer === 'function') pauseTimer(); } catch (e) {}
      try { if (typeof hideTimer === 'function') hideTimer(); } catch (e) {}
      try { if (typeof stopLongActiveSound === 'function') stopLongActiveSound(); } catch (e) {}
      try { if (typeof stopLongPassiveSound === 'function') stopLongPassiveSound(); } catch (e) {}
      try { if (typeof stopShortActiveSound === 'function') stopShortActiveSound(); } catch (e) {}
      try { if (typeof stopShortPassiveSound === 'function') stopShortPassiveSound(); } catch (e) {}
      try { if (typeof stopLifelineActiveSound === 'function') stopLifelineActiveSound(); } catch (e) {}
      try { if (typeof stopLifelinePassiveSound === 'function') stopLifelinePassiveSound(); } catch (e) {}
      try {
        if (window.GameVariables && window.GameVariables.GeneralSound) {
          window.GameVariables.GeneralSound.pause();
        }
      } catch (e) {}

      // Close any modal or welcome overlay & clear all Solo stage overlays immediately
      $('#tournamentModal').removeClass('open').hide();
      $('#stageWelcomeOverlay').stop(true, true).hide();
      $('.logoContainerDiv').stop(true, true).css({ transition: 'none', opacity: 0 }).hide();
      $('.timerStrapDiv').stop(true, true).css({ transition: 'none', opacity: 0 }).hide();
      $('.winStrapDiv').stop(true, true).css('opacity', 0);
      $('.ataGraphDiv').stop(true, true).css('right', '-330px');
      $('.pafClockDiv').stop(true, true).css('right', '-400px');
      $('.fastestFingerContestantsDiv').stop(true, true).css('opacity', 0);
      $('.fastestFingerRevealOrderDiv').stop(true, true).css('right', '-760px');
      $('#fastestContestant').stop(true, true).css('opacity', 0);
      $('.contestantNameAndLocationDiv').stop(true, true).css('opacity', 0);
      $('.lifeLinesLeftStrapDiv').stop(true, true).css('opacity', 0);

      if (typeof hideTotalPrizeMoneyStrap === 'function') {
        hideTotalPrizeMoneyStrap();
      }
      if (typeof hideMillionaireTitleStrap === 'function') {
        hideMillionaireTitleStrap();
      }
      if (typeof hideLevelStrap === 'function') {
        hideLevelStrap();
      }
      if (typeof hideLifeLineCentered === 'function') {
        hideLifeLineCentered();
      }

      var userName = 'You (Contestant)';
      if (window.MillionaireFeatures && window.MillionaireFeatures.firebase && window.MillionaireFeatures.firebase.user && window.MillionaireFeatures.firebase.user.displayName) {
        userName = window.MillionaireFeatures.firebase.user.displayName + ' (You)';
      }

      this.players = [
        { id: 'user', name: userName, location: 'India', isUser: true, score: 0, totalTime: 0, lastTime: 0, isEliminated: false, lastAnswerCorrect: null }
      ];

      for (var i = 0; i < AI_CONTESTANTS.length; i++) {
        var c = AI_CONTESTANTS[i];
        this.players.push({
          id: c.id,
          name: c.name,
          location: c.location,
          isUser: false,
          baseSkill: c.baseSkill,
          speedMin: c.speedMin,
          speedMax: c.speedMax,
          score: 0,
          totalTime: 0,
          lastTime: 0,
          isEliminated: false,
          lastAnswerCorrect: null
        });
      }

      this.currentQuestionIndex = 0;
      this.isActive = true;
      this.waitingForNext = false;
      this.userAnswered = false;

      // Close money tree if visible
      if (typeof slideOutMoneyTree === 'function') {
        slideOutMoneyTree();
      }

      // Hide picture question frame if open
      if (typeof window.hideQuestionImage === 'function') {
        window.hideQuestionImage();
      }

      // Show stage HUD and Banner
      $('#tournamentStageHUD').stop(true, true).fadeIn(250);
      $('#tournamentStageBanner').stop(true, true).fadeIn(250);
      $('#tournamentStageCoronation').hide();

      // Update Host Control Panel & Top Bar UI indicator
      $('#btnHostTournament').addClass('active').html('<span class="btn-icon">⚡</span><span class="btn-text">Tournament: ON</span>');
      $('#btnTopTournament').html('<span>⚡ Exit Tournament</span>');

      if (typeof showToastNotification === 'function') {
        showToastNotification("🏆 TOURNAMENT STARTED: Generating brand new progressive questions...");
      }

      this.activeQuestions = [];
      this.stageStep = 'loading';
      $('#tourneyStageBannerQText').html('ELIMINATION ROUND • GENERATING BRAND NEW PROGRESSIVE QUESTIONS...');
      $('#tourneyStageFeedback').html('<span style="color:#7dd3fc;">Preparing a fresh set of 10 escalating tournament questions...</span>');
      $('#tourneyStageNextBtn').hide();
      this.updateLeaderboardUI();

      var self = this;
      var runId = this._tourneyRunId;
      $.ajax({
        type: "POST",
        url: "/api/generate-questions?t=" + new Date().getTime(),
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ mode: "tournament_elimination", format: "10q", roundId: Date.now() }),
        dataType: "json",
        success: function(data) {
          if (!self.isActive || self._tourneyRunId !== runId) return;
          if (data && Array.isArray(data.questions) && data.questions.length >= 10) {
            self.activeQuestions = data.questions.slice(0, 10).map(function(item) {
              return {
                q: (item.question || "").replace(/\\n/g, "<br />"),
                a: item.a || "",
                b: item.b || "",
                c: item.c || "",
                d: item.d || "",
                correct: (item.correct || "a").toLowerCase(),
                category: item.category || "General Knowledge"
              };
            });
          } else {
            self.activeQuestions = TOURNAMENT_QUESTIONS.slice();
          }
          self.loadStageQuestion(0);
        },
        error: function() {
          if (!self.isActive || self._tourneyRunId !== runId) return;
          self.activeQuestions = TOURNAMENT_QUESTIONS.slice();
          self.loadStageQuestion(0);
        }
      });
    },

    loadStageQuestion: function(index) {
      var qList = (this.activeQuestions && this.activeQuestions.length > 0) ? this.activeQuestions : TOURNAMENT_QUESTIONS;
      if (index >= qList.length) {
        this.finishTournament();
        return;
      }

      this.currentQuestionIndex = index;
      this.userAnswered = false;
      this.waitingForNext = false;
      this.pendingReveal = null;
      this.stageStep = 'question';
      clearInterval(this.timerInterval);
      var q = qList[index];

      // Hide coronation overlay
      $('#tournamentStageCoronation').hide();

      // Reset stage answer lozenge styling & hide options off-screen first
      if (typeof resetAnswerStraps === 'function') {
        resetAnswerStraps();
      }
      $('.finalImg, .correctImg, .diagonalImg').css('opacity', 0);
      $('.answerP').css({ 'color': '#FFFFFF', 'text-shadow': '2px 2px 0px black', 'opacity': 0 });
      $('.letterP').css({ 'color': '#EA932C', 'text-shadow': '2px 2px 0px black', 'opacity': 0 });

      // Position straps off-screen for classic reveal animation (Question first, then Options)
      $('.answerGroupBDiv').stop(true, true).transition({ perspective: 4096, bottom: '-331px' }, 0);
      $('.answerGroupADiv').stop(true, true).transition({ perspective: 4096, bottom: '-256px' }, 0);
      $('.questionStrapDiv').stop(true, true).transition({ perspective: 4096, bottom: '-192px', rotateX: '0deg' }, 0);

      // Populate stage question & answers
      $('.questionTd').html(q.q);
      $('#answerA .answerP').html(q.a);
      $('#answerB .answerP').html(q.b);
      $('#answerC .answerP').html(q.c);
      $('#answerD .answerP').html(q.d);

      // Animate ONLY the Question Strap onto stage first
      if (typeof revealQuestionAndAnswerStraps === 'function') {
        revealQuestionAndAnswerStraps();
      } else {
        $('.questionStrapDiv, .answerStrapDiv').css('opacity', 1);
      }
      $('.questionStrapDiv').transition({ perspective: 4096, bottom: '62px' }, 700, 'cubic-bezier(0.5, 2, 0.5, 1)');

      // Update stage tournament banner & let user control when to reveal options
      $('#tourneyStageBannerQText').html('ELIMINATION ROUND • QUESTION ' + (index + 1) + ' OF 10 • ' + q.category.toUpperCase() + ' • SPEED BONUS ACTIVE');
      $('#tourneyStageFeedback').html('<span style="color:#7dd3fc;">Press <strong>→ (Next)</strong> or click <strong>Reveal Options</strong> when ready!</span>');
      $('#tourneyStageNextBtn').show().text('Reveal Options →');
      $('#tourneyStageTimerDisplay').text('0.00s');
      $('#tourneyStageBannerTimer').text('0.00s');

      // Ensure solo timer remains hidden during Tournament questions
      $('.timerStrapDiv').stop(true, true).css({ transition: 'none', opacity: 0 }).hide();

      // Play 30sec UK cue for every question in the Elimination Round until answer is revealed
      if (typeof startLongPassiveSound === 'function') {
        var curSrc = (window.GameVariables && window.GameVariables.LongPassiveSound && window.GameVariables.LongPassiveSound.src) || '';
        var isPlayingCue = curSrc.indexOf('30sec_UK_41885c7f.wav') !== -1 && !window.GameVariables.LongPassiveSound.paused;
        if (!isPlayingCue) {
          startLongPassiveSound(TOURNAMENT_ELIMINATION_CUE, true);
        }
      }

      this.updateLeaderboardUI();
    },

    revealStageOptions: function() {
      if (!this.isActive || this.stageStep !== 'question') return;
      this.stageStep = 'options';

      // Classic broadcast animation: slide Question up, then slide Answer Groups A & B in
      $('.questionStrapDiv').transition({ perspective: 4096, bottom: '229px' }, 250, 'linear', function() {
        $('.questionStrapDiv').transition({ perspective: 4096, bottom: '220px' }, 375, 'linear');
      });
      setTimeout(function() {
        $('.answerGroupADiv').transition({ perspective: 4096, bottom: '0px' }, 500, 'cubic-bezier(0.5, 1.35, 0.5, 1)');
      }, 0);
      setTimeout(function() {
        $('.answerGroupBDiv').transition({ perspective: 4096, bottom: '0px' }, 500, 'cubic-bezier(0.5, 1.25, 0.5, 1)');
      }, 80);

      if (typeof revealAllAnswersAtOnce === 'function') {
        revealAllAnswersAtOnce();
      } else {
        $('.answerP, .letterP, .diagonalImg').css('opacity', 1);
      }

      $('#tourneyStageFeedback').html('<span style="color:#94a3b8;">Choose Answer A, B, C, or D (or press 1-4)!</span>');
      $('#tourneyStageNextBtn').hide();

      // Start reaction timer once options are revealed
      this.questionStartTime = Date.now();
      var self = this;
      clearInterval(this.timerInterval);
      this.timerInterval = setInterval(function() {
        var elapsed = ((Date.now() - self.questionStartTime) / 1000).toFixed(2);
        $('#tourneyStageTimerDisplay').text(elapsed + 's');
        $('#tourneyStageBannerTimer').text(elapsed + 's');
      }, 50);
    },

    handleStageAnswer: function(optLetter) {
      if (!this.isActive || this.userAnswered) return;
      if (this.stageStep === 'question') {
        if (typeof showToastNotification === 'function') {
          showToastNotification("👉 Reveal the options first (press → or click Reveal Options)!");
        }
        return;
      }
      this.userAnswered = true;
      this.stageStep = 'answered';
      clearInterval(this.timerInterval);

      var opt = (optLetter || '').toLowerCase();
      var optUpper = opt.toUpperCase();
      var elapsed = parseFloat(((Date.now() - this.questionStartTime) / 1000).toFixed(2));
      $('#tourneyStageTimerDisplay').text(elapsed.toFixed(2) + 's');
      $('#tourneyStageBannerTimer').text(elapsed.toFixed(2) + 's');

      var qList = (this.activeQuestions && this.activeQuestions.length > 0) ? this.activeQuestions : TOURNAMENT_QUESTIONS;
      var q = qList[this.currentQuestionIndex];
      var isCorrect = (opt === q.correct.toLowerCase());

      // Lock in answer on stage lozenge (Orange Highlight) — keep Elimination cue playing until answer is revealed
      $('#answer' + optUpper + ' .finalImg').css('opacity', 1);
      $('#answer' + optUpper + ' .letterP, #answer' + optUpper + ' .answerP').css({ 'color': '#000000', 'text-shadow': 'none' });

      // Update User stats
      var user = this.players.find(function(p) { return p.isUser; });
      user.lastTime = elapsed;
      user.totalTime = parseFloat((user.totalTime + elapsed).toFixed(2));
      user.lastAnswerCorrect = isCorrect;
      if (isCorrect) {
        var speedBonus = Math.max(10, Math.round(100 - (elapsed * 10)));
        user.score += (100 + speedBonus);
      }

      // Simulate AI Contestant answers
      for (var i = 0; i < this.players.length; i++) {
        var p = this.players[i];
        if (p.isUser || p.isEliminated) continue;

        var aiCorrect = Math.random() < p.baseSkill;
        var randSpeed = parseFloat((p.speedMin + Math.random() * (p.speedMax - p.speedMin)).toFixed(2));
        p.lastTime = randSpeed;
        p.totalTime = parseFloat((p.totalTime + randSpeed).toFixed(2));
        p.lastAnswerCorrect = aiCorrect;
        if (aiCorrect) {
          var aiBonus = Math.max(10, Math.round(100 - (randSpeed * 10)));
          p.score += (100 + aiBonus);
        }
      }

      // Wait for user to manually trigger the answer reveal via controls
      this.pendingReveal = { optUpper: optUpper, isCorrect: isCorrect, q: q, elapsed: elapsed };
      $('#tourneyStageFeedback').html('<span style="color:#fbbf24;font-weight:700;">🔒 Option (' + optUpper + ') locked! Press <strong>→ (Next)</strong> or click <strong>Reveal Answer</strong>.</span>');
      $('#tourneyStageNextBtn').show().text('Reveal Answer →');
    },

    revealStageAnswerResult: function(optUpper, isCorrect, q, elapsed) {
      this.stageStep = 'revealed';
      this.pendingReveal = null;
      var correctUpper = q.correct.toUpperCase();
      var audioSpecRes = TOURNAMENT_AUDIO_MAP[this.currentQuestionIndex] || TOURNAMENT_AUDIO_MAP[0];

      if (typeof stopLongActiveSound === 'function') {
        stopLongActiveSound();
      }
      if (typeof stopLongPassiveSound === 'function') {
        stopLongPassiveSound();
      }

      if (isCorrect) {
        // Flash answer green (correct); play right answer cue in Round 2 (Q6-Q10)
        if (typeof showFinalToCorrectAnswerStep1 === 'function') {
          showFinalToCorrectAnswerStep1(optUpper);
        } else {
          $('#answer' + optUpper + ' .correctImg').css('opacity', 1);
        }
        if (audioSpecRes.correct && typeof startGeneralSound === 'function') {
          startGeneralSound(audioSpecRes.correct, false);
        }
        $('#tourneyStageFeedback').html('<span style="color:#10b981;font-weight:700;">✨ CORRECT! Response Time: ' + elapsed.toFixed(2) + 's. Points awarded!</span>');
      } else {
        // Flash correct answer green, keep user wrong answer highlighted
        if (typeof revealNormalToCorrectAnswerStep1 === 'function') {
          revealNormalToCorrectAnswerStep1(correctUpper);
        } else {
          $('#answer' + correctUpper + ' .correctImg').css('opacity', 1);
        }
        if (typeof startGeneralSound === 'function') {
          startGeneralSound(audioSpecRes.lose || "q1_to_q5_lose.mp3", false);
        }
        $('#tourneyStageFeedback').html('<span style="color:#ef4444;font-weight:700;">❌ INCORRECT! Correct answer was (' + correctUpper + '). Speed counts!</span>');
      }

      // Check Knockout Cuts
      var cutNotice = '';
      if (this.currentQuestionIndex === 4) { // End of Q5 (First cut)
        this.performEliminationCut(3, "KNOCKOUT CUT #1 (After Question 5): Bottom 3 contestants are eliminated!");
        cutNotice = ' <span style="color:#f87171;font-weight:700;">• 🚨 KNOCKOUT CUT 1: Bottom 3 eliminated!</span>';
      } else if (this.currentQuestionIndex === 9) { // End of Q10 (Second cut)
        this.performEliminationCut(3, "KNOCKOUT CUT #2 (After Question 10): Another 3 contestants eliminated!");
        cutNotice = ' <span style="color:#facc15;font-weight:700;">• ⚡ FINAL CUT: Top 4 qualify!</span>';
      }

      if (cutNotice) {
        $('#tourneyStageFeedback').append(cutNotice);
      }

      this.updateLeaderboardUI();
      this.waitingForNext = true;

      // Show on-stage next button
      if (this.currentQuestionIndex < 9) {
        $('#tourneyStageNextBtn').show().text('Next Question (Q' + (this.currentQuestionIndex + 2) + ') →');
      } else {
        $('#tourneyStageNextBtn').show().text('CROWN TOURNAMENT CHAMPION 🏆 →');
      }
    },

    advanceStageStep: function() {
      if (!this.isActive) return;
      if (this.stageStep === 'question') {
        this.revealStageOptions();
      } else if (this.stageStep === 'answered' && this.pendingReveal) {
        var r = this.pendingReveal;
        this.revealStageAnswerResult(r.optUpper, r.isCorrect, r.q, r.elapsed);
      } else if (this.stageStep === 'revealed' || this.waitingForNext) {
        this.loadStageQuestion(this.currentQuestionIndex + 1);
      } else if (this.stageStep === 'options' && typeof showToastNotification === 'function') {
        showToastNotification("⏳ Choose Answer A, B, C, or D (or press 1-4) first!");
      }
    },

    performEliminationCut: function(countToEliminate, message) {
      var active = this.players.filter(function(p) { return !p.isEliminated; });
      active.sort(function(a, b) {
        if (b.score !== a.score) return b.score - a.score;
        return a.totalTime - b.totalTime;
      });

      var eliminatedList = active.slice(active.length - countToEliminate);
      for (var i = 0; i < eliminatedList.length; i++) {
        eliminatedList[i].isEliminated = true;
      }

      if (typeof showToastNotification === 'function') {
        showToastNotification(message);
      }
    },

    updateLeaderboardUI: function() {
      var sorted = this.players.slice().sort(function(a, b) {
        if (a.isEliminated !== b.isEliminated) {
          return a.isEliminated ? 1 : -1;
        }
        if (b.score !== a.score) return b.score - a.score;
        return a.totalTime - b.totalTime;
      });

      var $tbody = $('#tourneyStageLeaderboardBody');
      $tbody.empty();

      for (var i = 0; i < sorted.length; i++) {
        var p = sorted[i];
        var rankStr = (i + 1);
        var statusHtml = p.isEliminated ? 
          '<span style="color:#ef4444;font-weight:700;font-size:10px;">OUT</span>' : 
          '<span style="color:#10b981;font-weight:700;font-size:10px;">IN</span>';

        var rowClass = p.isUser ? 'user-row' : (p.isEliminated ? 'eliminated-row' : '');
        var nameDisplay = p.isUser ? '<strong>' + p.name + '</strong>' : p.name;

        $tbody.append(
          '<tr class="' + rowClass + '">' +
            '<td style="text-align:center;font-weight:800;color:' + (i === 0 ? '#fbbf24' : '#94a3b8') + ';">#' + rankStr + '</td>' +
            '<td style="font-weight:600;">' + nameDisplay + '<br/><span style="font-size:9.5px;color:#94a3b8;">' + p.location + '</span></td>' +
            '<td style="text-align:right;font-weight:700;color:#fbbf24;">' + p.score + '</td>' +
            '<td style="text-align:right;font-family:monospace;font-size:10.5px;color:#cbd5e1;">' + p.totalTime.toFixed(2) + 's</td>' +
            '<td style="text-align:center;">' + statusHtml + '</td>' +
          '</tr>'
        );
      }

      // Also update the modal table if someone opens the old modal view
      var $modalBody = $('#tourneyLeaderboardBody');
      if ($modalBody.length) {
        $modalBody.html($tbody.html());
      }
    },

    nextQuestion: function() {
      this.advanceStageStep();
    },

    finishTournament: function() {
      clearInterval(this.timerInterval);
      var sorted = this.players.filter(function(p) { return !p.isEliminated; }).sort(function(a, b) {
        if (b.score !== a.score) return b.score - a.score;
        return a.totalTime - b.totalTime;
      });

      var winner = sorted[0];
      var isUserWinner = winner && winner.isUser;

      // Play victory fanfare
      if (typeof startLongActiveSound === 'function') {
        startLongActiveSound("q10_correct.mp3");
      }

      $('#tournamentStageBanner').hide();
      var $coronation = $('#tournamentStageCoronation');
      $coronation.stop(true, true).fadeIn(300);

      if (isUserWinner) {
        $('#stageCoronationTitle').html('👑 CONGRATULATIONS! YOU WON THE TOURNAMENT HOT SEAT!');
        $('#stageCoronationDesc').html('You scored <strong>' + winner.score + ' pts</strong> with a lightning total speed of <strong>' + winner.totalTime.toFixed(2) + 's</strong>, finishing <strong>#1 on the Leaderboard</strong>!<br/>You have officially qualified for the Grand Finale Hot Seat to play for <strong>$1 MILLION</strong>!');
        $('#btnStageEnterHotSeat').show().text('Enter $1 Million Hot Seat Grand Finale (10 Questions) →');
      } else {
        var wName = winner ? winner.name : 'Aarav Sharma';
        var wScore = winner ? winner.score : '940';
        $('#stageCoronationTitle').html('⚡ Tournament Knockout Concluded');
        $('#stageCoronationDesc').html('Contestant <strong>' + wName + '</strong> won the Hot Seat with ' + wScore + ' pts.<br/>You finished strong! You can now challenge the Hot Seat for $1 Million or replay the tournament.');
        $('#btnStageEnterHotSeat').show().text('Enter Hot Seat as Challenger ($1 Million Finale) →');
      }

      if (typeof window.saveGameplaySession === 'function') {
        window.saveGameplaySession(true, false);
      }
    },

    launchFinaleHotSeat: function() {
      this.exitToSoloMode(false);

      // Configure game variables for 10-Question Finale Money Tree in USD ($)
      if (window.GameVariables) {
        window.GameVariables.IsTenQuestionFormat = true;
        window.GameVariables.PrizeAmounts = [
          1000, 2000, 5000, 10000, 25000, 50000, 100000, 250000, 500000, 1000000
        ];
        window.GameVariables.NumberPrefix = "$";
        window.GameVariables.TopPrizeQuestionNumber = 10;
        window.GameVariables.STQUnlockedLevel = 6;
        window.GameVariables.FirstTierTimer = 4;  // 60 seconds for Q1-Q5
        window.GameVariables.SecondTierTimer = 5; // 90 seconds for Q6-Q10
        window.GameVariables.TopPrizeText = [
          "$1,000", "$2,000", "$5,000", "$10,000", "$25,000",
          "$50,000", "$100,000", "$250,000", "$500,000", "$1 MILLION"
        ];
        window.GameVariables.LightsDownSounds = [
          "q1_to_q5_lights_down.mp3", "", "", "", "",
          "lights_down_1.mp3", "lights_down_2.mp3", "lights_down_3.mp3", "lights_down_4.mp3", "lights_down_5.mp3"
        ];
        window.GameVariables.RoundBackgroundSounds = [
          FINALE_10Q_CUE, FINALE_10Q_CUE, FINALE_10Q_CUE, FINALE_10Q_CUE, FINALE_10Q_CUE,
          FINALE_10Q_CUE, FINALE_10Q_CUE, FINALE_10Q_CUE, FINALE_10Q_CUE, FINALE_10Q_CUE
        ];
        window.GameVariables.FinalAnswerSounds = [
          "", "", "", "", "",
          "final_answer_1.mp3", "final_answer_2.mp3", "final_answer_3.mp3", "final_answer_4.mp3", "final_answer_5.mp3"
        ];
        window.GameVariables.CorrectAnswerSounds = [
          "q1_to_q4_correct.mp3", "q1_to_q4_correct.mp3", "q1_to_q4_correct.mp3", "q1_to_q4_correct.mp3", "q5_correct.mp3",
          "q6_correct.mp3", "q7_correct.mp3", "q8_correct.mp3", "q9_correct.mp3", "q15_correct.mp3"
        ];
        window.GameVariables.WrongAnswerSounds = [
          "q1_to_q5_lose.mp3", "q1_to_q5_lose.mp3", "q1_to_q5_lose.mp3", "q1_to_q5_lose.mp3", "q1_to_q5_lose.mp3",
          "q6_lose.mp3", "q7_lose.mp3", "q8_lose.mp3", "q9_lose.mp3", "q15_lose.mp3"
        ];
      }

      if (typeof resetAndStartNewGame === 'function') {
        resetAndStartNewGame();
      }

      if (typeof showToastNotification === 'function') {
        showToastNotification("🌟 FINALE HOT SEAT ACTIVE: 10 Tough Questions • 60s (Q1–Q5) / 90s (Q6–Q10)!");
      }
    },

    exitToSoloMode: function(resetGame) {
      clearInterval(this.timerInterval);
      this._tourneyRunId = (this._tourneyRunId || 0) + 1;
      this.isActive = false;
      this.waitingForNext = false;
      this.userAnswered = false;

      $('#tournamentStageHUD').stop(true, true).hide();
      $('#tournamentStageBanner').stop(true, true).hide();
      $('#tournamentStageCoronation').stop(true, true).hide();
      $('#tournamentModal').removeClass('open').hide();

      $('#btnHostTournament').removeClass('active').html('<span class="btn-icon">⚡</span><span class="btn-text">Tournament</span>');
      $('#btnTopTournament').html('<span>⚡ Tournament Mode</span>');

      if (resetGame !== false && typeof resetAndStartNewGame === 'function') {
        resetAndStartNewGame();
        if (typeof showToastNotification === 'function') {
          showToastNotification("🎮 Returned to Classic Solo Hot Seat Mode.");
        }
      }
    },

    // Backward-compatible stubs in case called from legacy buttons
    closeTournamentModal: function() {
      this.exitToSoloMode();
    },

    renderTournamentModal: function() {
      this.startTournamentGame();
    }
  };

  /* =========================================================================
   * ASK THE HOST LIFELINE IMPLEMENTATION
   * ========================================================================= */
  window.askTheHostLifeline = function() {
    var $modal = $('#askTheHostModal');
    if (!$modal.length) return;

    var currentQ = null;
    if (window.TournamentEngine && window.TournamentEngine.isActive) {
      var tList = (window.TournamentEngine.activeQuestions && window.TournamentEngine.activeQuestions.length > 0)
        ? window.TournamentEngine.activeQuestions
        : TOURNAMENT_QUESTIONS;
      currentQ = tList[window.TournamentEngine.currentQuestionIndex];
    } else if (window.GameVariables && window.GameVariables.QuestionInProgress && window.GameVariables.QuestionsAndAnswers && window.GameVariables.QuestionLevel) {
      currentQ = window.GameVariables.QuestionsAndAnswers[window.GameVariables.QuestionLevel - 1];
    } else {
      if (typeof showToastNotification === 'function') {
        showToastNotification("🎙️ Start or reveal a question first to Ask The Host!");
      }
      return;
    }

    var hostCommentary = "Here is my advice as your Host: Trust your first instinct. Take a deep breath!";
    var correctLetter = (currentQ && (currentQ.correct || currentQ.CorrectAnswer)) ? 
      (currentQ.correct || currentQ.CorrectAnswer).toUpperCase() : 'B';
    var confidence = 85 + Math.floor(Math.random() * 12);

    if (currentQ) {
      hostCommentary = "This is a pivotal moment in the hot seat. Looking closely at the question, I am strongly leaning toward <strong>Option (" + correctLetter + ")</strong> with roughly " + confidence + "% confidence. Don't rush your final answer!";
    }

    $('#hostAdviceText').html(hostCommentary);
    $('#hostConfidenceBar').css('width', confidence + '%').text(confidence + '% Confident');

    $modal.css('display', 'flex').hide().fadeIn(200);

    if (typeof startLifelineActiveSound === 'function') {
      startLifelineActiveSound("lifeline_1_on.mp3");
    }

    if (typeof showToastNotification === 'function') {
      showToastNotification("🎙️ Host Lifeline Consulted: Amitabh Bachchan / Jeremy Clarkson advice received.");
    }
  };

  /* =========================================================================
   * KEYBOARD HELP & SHORTCUTS GUIDE
   * ========================================================================= */
  window.toggleKeyboardHelpModal = function() {
    var $m = $('#keyboardHelpModal');
    if ($m.is(':visible')) {
      $m.fadeOut(200);
    } else {
      $m.css('display', 'flex').hide().fadeIn(200);
    }
  };

})();
