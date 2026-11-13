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
      q: "Which Indian monument was commissioned by Mughal Emperor Shah Jahan as a mausoleum for his beloved wife?",
      a: "Taj Mahal", b: "Red Fort", c: "Qutub Minar", d: "Fatehpur Sikri",
      correct: "a", category: "Indian Heritage"
    },
    {
      q: "In international cricket, how many total deliveries are bowled in a standard 6-ball over?",
      a: "5 balls", b: "6 balls", c: "8 balls", d: "10 balls",
      correct: "b", category: "Sports"
    },
    {
      q: "What is the chemical symbol for Gold on the periodic table of elements?",
      a: "Ag", b: "Fe", c: "Au", d: "Pb",
      correct: "c", category: "Science"
    },
    {
      q: "Which state in India is internationally famous for its tranquil backwaters and houseboats in Alappuzha?",
      a: "Goa", b: "Kerala", c: "Odisha", d: "Assam",
      correct: "b", category: "Geography"
    },
    {
      q: "Which energetic dance number from the blockbuster film 'RRR' won the Oscar for Best Original Song in 2023?",
      a: "Chaiyya Chaiyya", b: "Jai Ho", c: "Naatu Naatu", d: "Kesariya",
      correct: "c", category: "Cinema"
    },
    {
      q: "Who was the legendary Chairman of the Drafting Committee of the Indian Constitution, honored as its chief architect?",
      a: "Dr. B. R. Ambedkar", b: "Sardar Vallabhbhai Patel", c: "Dr. Rajendra Prasad", d: "Jawaharlal Nehru",
      correct: "a", category: "Indian Polity"
    },
    {
      q: "What is the official currency of the United Kingdom?",
      a: "Euro", b: "British Pound", c: "Franc", d: "Krona",
      correct: "b", category: "World Currencies"
    },
    {
      q: "Which planet in our solar system is nicknamed the 'Red Planet' due to iron oxide on its surface?",
      a: "Venus", b: "Mercury", c: "Mars", d: "Jupiter",
      correct: "c", category: "Astronomy"
    },
    {
      q: "Which Indian space mission achieved a historic soft landing near the lunar South Pole on August 23, 2023?",
      a: "Mangalyaan", b: "Aditya-L1", c: "Chandrayaan-3", d: "Gaganyaan",
      correct: "c", category: "Space Science"
    },
    {
      q: "Who is celebrated as the legendary author of the timeless Sanskrit epic 'Abhijnanasakuntalam' and 'Meghaduta'?",
      a: "Kalidasa", b: "Bhasa", c: "Banabhatta", d: "Tulsidas",
      correct: "a", category: "Literature"
    }
  ];

  window.TournamentEngine = {
    isActive: false,
    currentQuestionIndex: 0,
    questionStartTime: 0,
    timerInterval: null,
    userAnswered: false,
    waitingForNext: false,
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
        showToastNotification("🏆 TOURNAMENT GAME STARTED: 10 Contestants competing on the main stage!");
      }

      this.loadStageQuestion(0);
    },

    loadStageQuestion: function(index) {
      if (index >= TOURNAMENT_QUESTIONS.length) {
        this.finishTournament();
        return;
      }

      this.currentQuestionIndex = index;
      this.userAnswered = false;
      this.waitingForNext = false;
      var q = TOURNAMENT_QUESTIONS[index];

      // Hide coronation overlay
      $('#tournamentStageCoronation').hide();

      // Ensure stage straps are positioned accurately above A/B/C/D options
      $('.answerGroupBDiv').stop(true, true).css({ perspective: 4096, bottom: '0px' });
      $('.answerGroupADiv').stop(true, true).css({ perspective: 4096, bottom: '0px' });
      $('.questionStrapDiv').stop(true, true).css({ perspective: 4096, bottom: '220px', rotateX: '0deg', opacity: 1 });

      // Reset stage answer lozenge styling
      if (typeof resetAnswerStraps === 'function') {
        resetAnswerStraps();
      }
      $('.finalImg, .correctImg, .diagonalImg').css('opacity', 0);
      $('.answerP').css({ 'color': '#FFFFFF', 'text-shadow': '2px 2px 0px black', 'opacity': 1 });
      $('.letterP').css({ 'color': '#EA932C', 'text-shadow': '2px 2px 0px black', 'opacity': 1 });

      // Populate stage question & answers
      $('.questionTd').html(q.q);
      $('#answerA .answerP').html(q.a);
      $('#answerB .answerP').html(q.b);
      $('#answerC .answerP').html(q.c);
      $('#answerD .answerP').html(q.d);

      // Reveal question & answer straps on stage
      if (typeof revealQuestionAndAnswerStraps === 'function') {
        revealQuestionAndAnswerStraps();
      } else {
        $('.questionStrapDiv, .answerStrapDiv').css('opacity', 1);
      }
      if (typeof revealAllAnswersAtOnce === 'function') {
        revealAllAnswersAtOnce();
      }

      // Update stage tournament banner
      $('#tourneyStageBannerQText').html('QUESTION ' + (index + 1) + ' OF 10 • ' + q.category.toUpperCase() + ' • SPEED BONUS ACTIVE');
      $('#tourneyStageFeedback').html('<span style="color:#94a3b8;">Choose Answer A, B, C, or D on the stage lozenges below!</span>');
      $('#tourneyStageNextBtn').hide();

      // Ensure solo timer remains hidden during Tournament questions
      $('.timerStrapDiv').stop(true, true).css({ transition: 'none', opacity: 0 }).hide();

      // Play suspense background bed
      if (typeof startLongPassiveSound === 'function') {
        startLongPassiveSound("q1_to_q5_bed.mp3", true);
      }

      // Start reaction timer
      this.questionStartTime = Date.now();
      $('#tourneyStageTimerDisplay').text('0.00s');
      $('#tourneyStageBannerTimer').text('0.00s');
      var self = this;
      clearInterval(this.timerInterval);
      this.timerInterval = setInterval(function() {
        var elapsed = ((Date.now() - self.questionStartTime) / 1000).toFixed(2);
        $('#tourneyStageTimerDisplay').text(elapsed + 's');
        $('#tourneyStageBannerTimer').text(elapsed + 's');
      }, 50);

      this.updateLeaderboardUI();
    },

    handleStageAnswer: function(optLetter) {
      if (!this.isActive || this.userAnswered) return;
      this.userAnswered = true;
      clearInterval(this.timerInterval);

      var opt = (optLetter || '').toLowerCase();
      var optUpper = opt.toUpperCase();
      var elapsed = parseFloat(((Date.now() - this.questionStartTime) / 1000).toFixed(2));
      $('#tourneyStageTimerDisplay').text(elapsed.toFixed(2) + 's');
      $('#tourneyStageBannerTimer').text(elapsed.toFixed(2) + 's');

      var q = TOURNAMENT_QUESTIONS[this.currentQuestionIndex];
      var isCorrect = (opt === q.correct.toLowerCase());

      // 1. Lock in answer on stage lozenge (Orange Highlight)
      $('#answer' + optUpper + ' .finalImg').css('opacity', 1);
      $('#answer' + optUpper + ' .letterP, #answer' + optUpper + ' .answerP').css({ 'color': '#000000', 'text-shadow': 'none' });

      // Play lock-in final answer sound
      if (typeof startLongActiveSound === 'function') {
        startLongActiveSound("final_answer_1.mp3");
      }

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

      var self = this;
      var runIdAtAnswer = this._tourneyRunId;
      // Dramatic reveal pause (650ms)
      setTimeout(function() {
        if (!self.isActive || self._tourneyRunId !== runIdAtAnswer) return;
        self.revealStageAnswerResult(optUpper, isCorrect, q, elapsed);
      }, 650);
    },

    revealStageAnswerResult: function(optUpper, isCorrect, q, elapsed) {
      var correctUpper = q.correct.toUpperCase();

      if (isCorrect) {
        // Flash answer green (correct)
        if (typeof showFinalToCorrectAnswerStep1 === 'function') {
          showFinalToCorrectAnswerStep1(optUpper);
        } else {
          $('#answer' + optUpper + ' .correctImg').css('opacity', 1);
        }
        if (typeof playCorrectAnswerSound === 'function') {
          playCorrectAnswerSound();
        } else if (typeof startGeneralSound === 'function') {
          startGeneralSound("q1_to_q4_correct.mp3", false);
        }
        $('#tourneyStageFeedback').html('<span style="color:#10b981;font-weight:700;">✨ CORRECT! Response Time: ' + elapsed.toFixed(2) + 's. Points awarded!</span>');
      } else {
        // Flash correct answer green, keep user wrong answer highlighted
        if (typeof revealNormalToCorrectAnswerStep1 === 'function') {
          revealNormalToCorrectAnswerStep1(correctUpper);
        } else {
          $('#answer' + correctUpper + ' .correctImg').css('opacity', 1);
        }
        if (typeof playWrongAnswerSound === 'function') {
          playWrongAnswerSound();
        } else if (typeof startGeneralSound === 'function') {
          startGeneralSound("q1_to_q5_lose.mp3", false);
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
      if (!this.isActive) return;
      this.loadStageQuestion(this.currentQuestionIndex + 1);
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
        $('#stageCoronationDesc').html('You scored <strong>' + winner.score + ' pts</strong> with a lightning total speed of <strong>' + winner.totalTime.toFixed(2) + 's</strong>, finishing <strong>#1 on the Leaderboard</strong>!<br/>You have officially qualified for the Grand Finale Hot Seat to play for <strong>₹1 CRORE</strong>!');
        $('#btnStageEnterHotSeat').show().text('Enter ₹1 Crore Hot Seat Grand Finale (10 Questions) →');
      } else {
        var wName = winner ? winner.name : 'Aarav Sharma';
        var wScore = winner ? winner.score : '940';
        $('#stageCoronationTitle').html('⚡ Tournament Knockout Concluded');
        $('#stageCoronationDesc').html('Contestant <strong>' + wName + '</strong> won the Hot Seat with ' + wScore + ' pts.<br/>You finished strong! You can now challenge the Hot Seat for ₹1 Crore or replay the tournament.');
        $('#btnStageEnterHotSeat').show().text('Enter Hot Seat as Challenger (₹1 Crore Finale) →');
      }

      if (typeof window.saveGameplaySession === 'function') {
        window.saveGameplaySession(true, false);
      }
    },

    launchFinaleHotSeat: function() {
      this.exitToSoloMode(false);

      // Configure game variables for 10-Question Finale Money Tree in INR (₹)
      if (window.GameVariables) {
        window.GameVariables.PrizeAmounts = [
          10000, 20000, 50000, 100000, 250000, 375000, 500000, 1000000, 5000000, 10000000
        ];
        window.GameVariables.NumberPrefix = "₹";
        window.GameVariables.TopPrizeText = [
          "₹10,000", "₹20,000", "₹50,000", "₹1,00,000", "₹2,50,000",
          "₹3,75,000", "₹5,00,000", "₹10,00,000", "₹50,00,000", "₹1 CRORE"
        ];
      }

      if (typeof resetAndStartNewGame === 'function') {
        resetAndStartNewGame();
      }

      if (typeof showToastNotification === 'function') {
        showToastNotification("🌟 FINALE HOT SEAT ACTIVE: 10 Questions to ₹1 Crore (₹2.5 Lakh Safe Haven)!");
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
      currentQ = TOURNAMENT_QUESTIONS[window.TournamentEngine.currentQuestionIndex];
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
