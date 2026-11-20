$(document).ready(function(){
	$(document).on('keydown',function(e)
	{
		if($(e.target).is('input, textarea')) {
			return;
		}

		// Escape closes any open dialog modal before mode routing
		if(e.keyCode == 27) {
			var $openModal = $('#remixStudioModal, #gameHistoryModal, #askTheHostModal, #keyboardHelpModal, #pictureZoomModal').filter(':visible');
			if($openModal.length > 0) {
				$openModal.fadeOut(200);
				return;
			}
		}

		// TOURNAMENT MODE HOTKEY ROUTING (isolated from Solo handlers)
		if(window.TournamentEngine && window.TournamentEngine.isActive) {
			if(e.keyCode == 49 || e.keyCode == 97 || (!e.fromControlDeck && (e.key === 'a' || e.key === 'A'))) { // 1, Num1, keyboard A
				window.TournamentEngine.handleStageAnswer('a');
				return;
			}
			else if(e.keyCode == 50 || e.keyCode == 98 || (!e.fromControlDeck && (e.key === 'b' || e.key === 'B'))) { // 2, Num2, keyboard B
				window.TournamentEngine.handleStageAnswer('b');
				return;
			}
			else if(e.keyCode == 51 || e.keyCode == 99 || (!e.fromControlDeck && (e.key === 'c' || e.key === 'C'))) { // 3, Num3, keyboard C
				window.TournamentEngine.handleStageAnswer('c');
				return;
			}
			else if(e.keyCode == 52 || e.keyCode == 100 || (!e.fromControlDeck && (e.key === 'd' || e.key === 'D'))) { // 4, Num4, keyboard D
				window.TournamentEngine.handleStageAnswer('d');
				return;
			}
			else if(e.keyCode == 39 || e.keyCode == 13 || e.keyCode == 32) { // Right Arrow, Enter, Space
				window.TournamentEngine.advanceStageStep();
				return;
			}
			else if(e.keyCode == 27) { // Escape
				window.TournamentEngine.exitToSoloMode();
				return;
			}
			else if(e.keyCode == 72 || (!e.fromControlDeck && (e.key === 'h' || e.key === 'H'))) { // H - Ask The Host
				if(typeof window.askTheHostLifeline === 'function') {
					window.askTheHostLifeline();
				}
				return;
			}
			else if([37, 38, 40, 48, 65, 67, 69, 70, 71, 76, 77, 78, 80, 81, 83, 85, 87, 88].indexOf(e.keyCode) !== -1 || e.fromControlDeck) {
				if(typeof showToastNotification === 'function') {
					showToastNotification("⚡ Tournament Active: Press 1-4 / A-D to answer, H for Host, → Next, or Exit Tournament.");
				}
				return;
			}
			return;
		}

		function lockSoloAnswer(letterUpper, letterLower, isOutFlag) {
			if(!window.GameVariables.QuestionInProgress) {
				if(typeof showToastNotification === 'function') {
					showToastNotification("🎯 Start or reveal a question first!");
				}
				return;
			}
			if(window.GameVariables[isOutFlag]) {
				if(typeof showToastNotification === 'function') {
					showToastNotification("⚠️ Option " + letterUpper + " was eliminated by 50:50!");
				}
				return;
			}
			if(window.GameVariables.CannotLockInFinalAnswer) {
				if(typeof showToastNotification === 'function') {
					showToastNotification("⏳ Resume from break / finish lifeline before locking an answer.");
				}
				return;
			}
			if(window.GameVariables.CurrentTargetAnswer == "" && window.GameVariables.QuestionSequenceCounter == -1) {
				lockInFinalAnswer(letterUpper);
				window.GameVariables.CurrentTargetAnswer = letterLower;
				pauseTimer();

				if(window.GameVariables.IsWalkingAway == false){
					playFinalAnswerSound();
				}
				if(typeof showToastNotification === 'function') {
					showToastNotification("🔒 Option (" + letterUpper + ") locked! Press [→] Next to reveal answer.");
				}
			}
		}

		if(e.keyCode == 37) // key 'left arrow' for fastest-finger / money tree hide and show
		{
			if(window.GameVariables.IsLogoShowing == false && window.GameVariables.IsInCommercial == false)
			{
				if(window.GameVariables.IsPlayingFasestFinger == true)
				{
					if(window.GameVariables.FastestFingerSequenceCounter <= 9)
					{
						if(window.GameVariables.FastestFingerSequenceCounter == 0)
						{
							startShortActiveSound("fastest_finger_contestants.mp3");
						}
						revealFastestFingerContestants();
						if(typeof showToastNotification === 'function'){
							showToastNotification("⚡ Contestant " + (window.GameVariables.FastestFingerSequenceCounter + 1) + "/10 revealed! [←] Next");
						}
					}
					else if(window.GameVariables.FastestFingerSequenceCounter == 10)
					{
						hideContestantNameAndLocation();
						if(typeof showToastNotification === 'function'){
							showToastNotification("⚡ All 10 Contestants introduced. [←] Read Question");
						}
					}
					else if(window.GameVariables.FastestFingerSequenceCounter == 11)
					{
						startGeneralSound("game_resume_stop.mp3");
						setTimeout(stopLongPassiveSound, 10);
						setTimeout(function(){
							startShortPassiveSound("fastest_finger_read_question.mp3");
						}, 250);
						if(typeof showToastNotification === 'function'){
							showToastNotification("⚡ Lights down & reading question... [←] Reveal Question");
						}
					}
					else if(window.GameVariables.FastestFingerSequenceCounter == 12)
					{
						$('.answerGroupBDiv').transition({perspective:4096, 'bottom':'-331px'}, 0);
						$('.answerGroupADiv').transition({perspective:4096, 'bottom':'-256px'}, 0);
						$('.questionStrapDiv').transition({perspective:4096, 'bottom':'-192px', 'rotateX':'0deg'}, 0);
						revealFastestFingerQuestion();
						$('.questionStrapDiv').transition({perspective:4096, 'bottom':'62px'}, 700, 'cubic-bezier(0.5, 2, 0.5, 1)');
						if(typeof showToastNotification === 'function'){
							showToastNotification("⚡ Question displayed. [←] Reveal 3 Stabs");
						}
					}
					else if(window.GameVariables.FastestFingerSequenceCounter == 13)
					{
						startShortActiveSound("fastest_finger_3_stabs.mp3");
						setTimeout(stopShortPassiveSound, 200);
						if(typeof showToastNotification === 'function'){
							showToastNotification("⚡ 3 Stabs! Options ready. [←] Start Think Countdown");
						}
					}
					else if(window.GameVariables.FastestFingerSequenceCounter == 14)
					{
						$('.questionStrapDiv').transition({perspective:4096, 'bottom':'229px'}, 250, 'linear', function(){
							$('.questionStrapDiv').transition({perspective:4096, 'bottom':'220px'}, 375, 'linear');
						});
						setTimeout(function(){
							$('.answerGroupADiv').transition({perspective:4096, 'bottom':'0px'}, 500, 'cubic-bezier(0.5, 1.35, 0.5, 1)');
						}, 0);
						setTimeout(function(){
							$('.answerGroupBDiv').transition({perspective:4096, 'bottom':'0px'}, 500, 'cubic-bezier(0.5, 1.25, 0.5, 1)');
						}, 50);
						revealAllAnswersAtOnce();
						startShortPassiveSound("fastest_finger_think.mp3");
						if(typeof showToastNotification === 'function'){
							showToastNotification("⚡ Think countdown running! [←] Lock out question");
						}
					}
					else if(window.GameVariables.FastestFingerSequenceCounter == 15)
					{
						hideFastestFingerQuestionAndAnswers();
						if(typeof showToastNotification === 'function'){
							showToastNotification("⚡ Time up! [←] Read correct order");
						}
					}
					else if(window.GameVariables.FastestFingerSequenceCounter == 16)
					{
						startShortPassiveSound("fastest_finger_read_answer_order.mp3");
						if(typeof showToastNotification === 'function'){
							showToastNotification("⚡ Reading answer order... [←] Show answer tree");
						}
					}
					else if(window.GameVariables.FastestFingerSequenceCounter == 17)
					{
						showFastestFingerAnswerTree();
						if(typeof showToastNotification === 'function'){
							showToastNotification("⚡ Correct order tree displayed. [←] Reveal 1st Answer");
						}
					}
					else if(window.GameVariables.FastestFingerSequenceCounter <= 21)
					{
						var soundToPlay = "";
						revealFastestFingerAnswersinCorrectOrder();

						if(window.GameVariables.FastestFingerSequenceCounter == 18){
							soundToPlay = "fastest_finger_answer_correct_1.mp3";
						}
						else if(window.GameVariables.FastestFingerSequenceCounter == 19){
							soundToPlay = "fastest_finger_answer_correct_2.mp3";
						}
						else if(window.GameVariables.FastestFingerSequenceCounter == 20){
							soundToPlay = "fastest_finger_answer_correct_3.mp3";
						}
						else if(window.GameVariables.FastestFingerSequenceCounter == 21){
							soundToPlay = "fastest_finger_answer_correct_4.mp3";
						}

						startGeneralSound(soundToPlay);
						if(typeof showToastNotification === 'function'){
							showToastNotification("⚡ Correct order " + (window.GameVariables.FastestFingerSequenceCounter - 17) + "/4 revealed! [←] Next");
						}
					}
					else if(window.GameVariables.FastestFingerSequenceCounter == 22)
					{
						hideFastestFingerAnswerTree();
						showFastestFingerContestants();
						if(typeof showToastNotification === 'function'){
							showToastNotification("⚡ Contestants board shown. [←] Reveal Times");
						}
					}
					else if(window.GameVariables.FastestFingerSequenceCounter == 23)
					{
						revealFastestFingerWinnersAndTimes();
						startGeneralSound("fastest_finger_reveal_times.mp3");
						setTimeout(stopShortPassiveSound, 200);
						if(typeof showToastNotification === 'function'){
							showToastNotification("⚡ Response times revealed! [←] Highlight Winner");
						}
					}
					else if(window.GameVariables.FastestFingerSequenceCounter == 24)
					{
						flashFastestTimeStep1();
						startGeneralSound("fastest_finger_winner.mp3");
						if(typeof showToastNotification === 'function'){
							showToastNotification("🏆 Winner is flashing in gold! [←] Show Winner Spotlight");
						}
					}
					else if(window.GameVariables.FastestFingerSequenceCounter == 25)
					{
						showTheFastestFingerWinner();
						if(typeof showToastNotification === 'function'){
							showToastNotification("🏆 Winner spotlight strap! [←] Clear strap");
						}
					}
					else if(window.GameVariables.FastestFingerSequenceCounter == 26)
					{
						hideTheFastestFingerWinner();
						if(typeof showToastNotification === 'function'){
							showToastNotification("⚡ Welcome to the Hot Seat! [←] Invite to Hot Seat");
						}
					}
					else if(window.GameVariables.FastestFingerSequenceCounter == 27)
					{
						startShortActiveSound("hello_long.mp3");
						window.GameVariables.IsPlayingFasestFinger = false;
						window.GameVariables.QuestionLevel = 1;
						window.GameVariables.QuestionSequenceCounter = -1;
						window.GameVariables.IsInCommercial = false;
						window.GameVariables.IsLogoShowing = false;
						window.GameVariables.QuestionInProgress = false;
						if(typeof setLevelOnMoneyTree === 'function'){
							setLevelOnMoneyTree(1);
						}
						if(typeof showToastNotification === 'function'){
							showToastNotification("🎉 Contestant in Hot Seat! Press [→ Next Action] to play Question 1 (Rs. 1,000)");
						}
					}

					window.GameVariables.FastestFingerSequenceCounter++;
				}
				else if(typeof toggleMoneyTreeDisplay === 'function'){
					toggleMoneyTreeDisplay();
				}
			}
			else if(typeof toggleMoneyTreeDisplay === 'function'){
				toggleMoneyTreeDisplay();
			}
		}
		else if(e.keyCode == 38) // key 'up arrow' to start the timer once all four answers have been revealed
		{
			if(window.GameVariables.QuestionInProgress && window.GameVariables.QuestionLevel < 11){
				startTimer();
				window.GameVariables.TimerReady = false;
			}
		}
		else if(e.keyCode == 39) // key 'right arrow' for question navigation
		{
			if($('#stageWelcomeOverlay').is(':visible')){
				if(typeof window.launchSoloGame === 'function'){
					window.launchSoloGame();
				}
				return;
			}
			if(window.GameVariables.IsPlayingFasestFinger == true){
				if(typeof stepFastestFinger === 'function'){
					stepFastestFinger();
				}
				return;
			}
			if(window.GameVariables.IsMoneyTreeShowing == true){
				if(typeof slideOutMoneyTree === 'function'){
					slideOutMoneyTree();
				}
				return;
			}
			if(window.GameVariables.QuestionSequenceCounter == 99){
				if(typeof showToastNotification === 'function'){
					showToastNotification("Game Over! Click [🔄 New Game] to start a brand new game.");
				}
				return;
			}
			if(window.GameVariables.IsInCommercial == true){
				if(typeof hideMillionaireLogo === 'function') hideMillionaireLogo();
				window.GameVariables.IsInCommercial = false;
				if(!window.GameVariables.QuestionInProgress && window.GameVariables.QuestionSequenceCounter == -1 && typeof window.presentNextSoloQuestion === 'function'){
					window.presentNextSoloQuestion();
					return;
				}
			}
			if(window.GameVariables.IsExplainingRules == false && window.GameVariables.IsNameStrapShowing == false && window.GameVariables.IsTotalPrizeMoneyShowing == false){
				if(window.GameVariables.QuestionSequenceCounter == -1){
					if(window.GameVariables.QuestionInProgress){
						if(typeof showToastNotification === 'function'){
							showToastNotification("🎯 Select Answer A, B, C, or D (or press 1-4)!");
						}
						return;
					} else if(typeof window.presentNextSoloQuestion === 'function'){
						window.presentNextSoloQuestion();
						return;
					}
					return;
				}
				else if(window.GameVariables.QuestionSequenceCounter == 0){
					playLightsDownSound();
				}
				else if(window.GameVariables.QuestionSequenceCounter == 1){
					setQuestion(false);
					window.GameVariables.QuestionInProgress = true;
					$('.answerGroupBDiv').transition({perspective:4096, 'bottom':'-331px'}, 0);
					$('.answerGroupADiv').transition({perspective:4096, 'bottom':'-256px'}, 0);
					$('.questionStrapDiv').transition({perspective:4096, 'bottom':'-192px', 'rotateX':'0deg'}, 0);
					$('.timerStrapDiv').transition({perspective:0, opacity: 0, 'bottom':'241px'}, 0);
					revealQuestionAndAnswerStraps();
					playBackgroundSound();
					var runIdReveal = window.GameVariables.SoloRunId;
					$('.questionStrapDiv').transition({perspective:4096, 'bottom':'62px'}, 700, 'cubic-bezier(0.5, 2, 0.5, 1)', function(){
						if(window.GameVariables.SoloRunId !== runIdReveal || (window.TournamentEngine && window.TournamentEngine.isActive)) return;
						if(window.GameVariables.QuestionLevel < 6){
							if(window.GameVariables.FirstTierTimer == 1) tier1Timer();
							else if(window.GameVariables.FirstTierTimer == 2) tier2Timer();
							else if(window.GameVariables.FirstTierTimer == 3) tier3Timer();
							else if(window.GameVariables.FirstTierTimer == 4) tier4Timer();
							else if(window.GameVariables.FirstTierTimer == 5) tier5Timer();
							$('.timerStrapDiv').show().transition({perspective:0, opacity: 1, 'bottom':'241px'}, 500, 'linear');
						}
						else if(window.GameVariables.QuestionLevel < 11){
							if(window.GameVariables.SecondTierTimer == 1) tier1Timer();
							else if(window.GameVariables.SecondTierTimer == 2) tier2Timer();
							else if(window.GameVariables.SecondTierTimer == 3) tier3Timer();
							else if(window.GameVariables.SecondTierTimer == 4) tier4Timer();
							else if(window.GameVariables.SecondTierTimer == 5) tier5Timer();
							$('.timerStrapDiv').show().transition({perspective:0, opacity: 1, 'bottom':'241px'}, 500, 'linear');
						}
					});
				}
				else if(window.GameVariables.QuestionSequenceCounter == 2){
					$('.questionStrapDiv').transition({perspective:4096, 'bottom':'229px'}, 250, 'linear', function(){
						$('.questionStrapDiv').transition({perspective:4096, 'bottom':'220px'}, 375, 'linear');
					});
					setTimeout(function(){
						$('.answerGroupADiv').transition({perspective:4096, 'bottom':'0px'}, 500, 'cubic-bezier(0.5, 1.35, 0.5, 1)');
					}, 0);
					setTimeout(function(){
						$('.answerGroupBDiv').transition({perspective:4096, 'bottom':'0px'}, 500, 'cubic-bezier(0.5, 1.25, 0.5, 1)');
					}, 50);
					if(window.GameVariables.QuestionLevel < 11){
						$('.timerStrapDiv').show().transition({perspective:0, 'bottom':'408px'}, 250, 'linear', function(){
							$('.timerStrapDiv').transition({perspective:4096, 'bottom':'399px'}, 375, 'linear');
						});
					}
					if(window.GameVariables.RevealAllAnswersBeforeStartingTimer == true){
						revealAllAnswersAtOnce();
						if(window.GameVariables.QuestionLevel < 11){
							startTimer();
						}
						window.GameVariables.TimerReady = true;
						window.GameVariables.QuestionSequenceCounter = -1;
						return;
					}
				}
				else if(window.GameVariables.QuestionSequenceCounter <= 6){
					revealAnswersOneByOne();

					if(window.GameVariables.QuestionSequenceCounter == 6){
						window.GameVariables.QuestionSequenceCounter = -1;
						return;
					}
				}
				else if(window.GameVariables.QuestionSequenceCounter == 7){
					var runIdStep7 = window.GameVariables.SoloRunId;
					if(window.GameVariables.CurrentCorrectAnswer == window.GameVariables.CurrentTargetAnswer){
						showFinalToCorrectAnswerStep1(window.GameVariables.CurrentTargetAnswer.toUpperCase());
						playCorrectAnswerSound();
						if(typeof window.saveGameplaySession === 'function'){
							window.saveGameplaySession(false, false);
						}
						$('.timerStrapDiv').transition({perspective:0, 'bottom':'269px'}, 125, 'linear', function(){
							$('.timerStrapDiv').transition({perspective:0, opacity: 0, 'bottom':'269px'}, 0, function(){ $(this).hide(); });
						});
						if(typeof showToastNotification === 'function'){
							showToastNotification("✨ CORRECT! Press [→] Next to show winnings.");
						}
					}
					else if(window.GameVariables.CurrentTargetAnswer != window.GameVariables.CurrentCorrectAnswer){
						revealNormalToCorrectAnswerStep1(window.GameVariables.CurrentCorrectAnswer.toUpperCase());
						playWrongAnswerSound();
						$('.timerStrapDiv').transition({perspective:0, 'bottom':'269px'}, 125, 'linear', function(){
							$('.timerStrapDiv').transition({perspective:0, opacity: 0, 'bottom':'269px'}, 0, function(){ $(this).hide(); });
						});

						var finalWonText = reduceAmountWon();
						window.GameVariables.QuestionInProgress = false;
						window.GameVariables.IsWalkingAway = true;
						window.GameVariables.QuestionSequenceCounter = 99;

						if(typeof window.saveGameplaySession === 'function'){
							window.saveGameplaySession(true, false);
						}

						setTimeout(function(){
							if(window.GameVariables.SoloRunId !== runIdStep7 || (window.TournamentEngine && window.TournamentEngine.isActive)) return;
							$('.answerGroupBDiv').transition({perspective:4096, 'bottom':'-412px'}, 400, 'linear');
							$('.answerGroupADiv').transition({perspective:4096, 'bottom':'-412px'}, 400, 'linear');
							$('.questionStrapDiv').transition({perspective:4096, 'bottom':'-192px'}, 400, 'linear', function(){
								hideQuestionAndAnswerStraps();
								resetAnswerStraps();
							});
							showTotalPrizeMoneyStrap();
							showToastNotification("Game Over! Total Winnings: " + finalWonText + " • Press [🔄 New Game] to restart");
						}, 1800);
					}

					hideLifeLineCentered();

					if(window.GameVariables.IsLevelStrapShowing == true){
						hideLevelStrap();
						window.GameVariables.IsLevelStrapShowing = false;
					}
				}
				else if(window.GameVariables.QuestionSequenceCounter == 8){
					var maxLevelStep8 = (window.GameVariables.PrizeAmounts && window.GameVariables.PrizeAmounts.length) ? window.GameVariables.PrizeAmounts.length : 15;
					if(window.GameVariables.QuestionLevel == maxLevelStep8){
						if(typeof window.saveGameplaySession === 'function'){
							window.saveGameplaySession(true, false);
						}
						$('.answerGroupBDiv').transition({perspective:4096, 'bottom':'-412px'}, 375, 'linear');
						$('.answerGroupADiv').transition({perspective:4096, 'bottom':'-412px'}, 375, 'linear');
						$('.questionStrapDiv').transition({perspective:4096, 'bottom':'-192px'}, 375, 'linear', function(){
							hideQuestionAndAnswerStraps();
							showMillionaireTitleStrap();
							showToastNotification("🏆 CROREPATI! YOU WON RS. 1 CRORE! • Press [🔄 New Game] to play again");
						});
					}
					else{
						$('.winStrapDiv').transition({perspective:4096, 'bottom':'145px', 'rotateX':'90deg'}, 0);
						$('.answerGroupBDiv').transition({perspective:4096, 'bottom':'-256px'}, 500, 'linear');
						$('.answerGroupADiv').transition({perspective:4096, 'bottom':'-256px'}, 500, 'linear');
						$('.questionStrapDiv').transition({perspective:4096, 'bottom':'146px', 'rotateX':'-90deg'}, 200, 'ease-in', function(){
							$('.winStrapDiv').transition({perspective:4096, 'bottom':'71px', 'rotateX':'0deg'}, 300, 'ease-out', function(){
								hideQuestionAndAnswerStraps();
								resetAnswerStraps();
							});
						});
						showAmountWon();
					}
				}
				else if(window.GameVariables.QuestionSequenceCounter == 9){
					var maxLevelStep9 = (window.GameVariables.PrizeAmounts && window.GameVariables.PrizeAmounts.length) ? window.GameVariables.PrizeAmounts.length : 15;
					if(window.GameVariables.QuestionLevel == maxLevelStep9){
						hideMillionaireTitleStrap();
						window.GameVariables.IsWalkingAway = true;
						window.GameVariables.QuestionSequenceCounter = 99;
						window.GameVariables.QuestionInProgress = false;
					}
					else {
						$('.winStrapDiv').transition({perspective:4096, 'bottom':'-200px'}, 500, 'linear', function(){
							hideAmountWon();
						});
						window.GameVariables.QuestionLevel++;
						setLevelOnMoneyTree(window.GameVariables.QuestionLevel);
						window.GameVariables.QuestionInProgress = false;
						if(window.GameVariables.QuestionLevel >= window.GameVariables.STQUnlockedLevel && typeof stqLifeLineSlideIn === 'function'){
							stqLifeLineSlideIn();
						}
						window.GameVariables.QuestionSequenceCounter = -1;
					}
				}
				else if(window.GameVariables.QuestionSequenceCounter == 10){
					var runIdTimeUp = window.GameVariables.SoloRunId;
					revealNormalToCorrectAnswerStep1(window.GameVariables.CurrentCorrectAnswer.toUpperCase());
					playWrongAnswerSound();
					var finalWonTimeUp = reduceAmountWon();
					window.GameVariables.QuestionInProgress = false;
					window.GameVariables.IsWalkingAway = true;
					window.GameVariables.QuestionSequenceCounter = 99;
					setTimeout(function(){
						if(window.GameVariables.SoloRunId !== runIdTimeUp || (window.TournamentEngine && window.TournamentEngine.isActive)) return;
						$('.answerGroupBDiv').transition({perspective:4096, 'bottom':'-412px'}, 400, 'linear');
						$('.answerGroupADiv').transition({perspective:4096, 'bottom':'-412px'}, 400, 'linear');
						$('.questionStrapDiv').transition({perspective:4096, 'bottom':'-290px'}, 400, 'linear', function(){
							hideQuestionAndAnswerStraps();
							resetAnswerStraps();
						});
						showTotalPrizeMoneyStrap();
						showToastNotification("Time's Up! Game Over. Total Winnings: " + finalWonTimeUp);
					}, 1800);
				}

				if(window.GameVariables.QuestionSequenceCounter !== 99){
					window.GameVariables.QuestionSequenceCounter++;
				}
			} else if(window.GameVariables.IsExplainingRules == true){
				window.GameVariables.IsExplainingRules = false;
				if(window.GameVariables.QuestionSequenceCounter == -1 && !window.GameVariables.QuestionInProgress && typeof window.presentNextSoloQuestion === 'function'){
					window.presentNextSoloQuestion();
				}
			}
		}
		else if(e.keyCode == 40) // key 'down arrow' for total prize money
		{
			if($('#stageWelcomeOverlay').is(':visible')){
				$('#stageWelcomeOverlay').stop(true, true).hide();
			}
			if(window.GameVariables.QuestionInProgress == true){
				if(typeof showToastNotification === 'function'){
					showToastNotification("💰 Finish current question before showing Total Winnings.");
				}
				return;
			}
			if(window.GameVariables.IsMoneyTreeShowing == false && window.GameVariables.IsNameStrapShowing == false){
				if(window.GameVariables.QuestionLevel - 1 == 15){
					window.GameVariables.IsTotalPrizeMoneyShowing == true ? hideMillionaireTitleStrap() : showMillionaireTitleStrap();
				}
				else{
					window.GameVariables.IsTotalPrizeMoneyShowing == true ? hideTotalPrizeMoneyStrap() : showTotalPrizeMoneyStrap();
				}

				window.GameVariables.IsTotalPrizeMoneyShowing = !window.GameVariables.IsTotalPrizeMoneyShowing;

				if(window.GameVariables.IsWalkingAway == true){
					window.GameVariables.QuestionLevel > 10 == true ? startGeneralSound("walk_away_large.mp3") : startGeneralSound("walk_away_small.mp3");
					window.GameVariables.IsWalkingAway = false;
				}
			}
		}
		else if(e.keyCode == 48) // key '0' to pause and resume the timer
		{
			if(window.GameVariables.QuestionInProgress == true && window.GameVariables.QuestionLevel < 11){
				if(window.GameVariables.TimerPaused == false){
					pauseTimer();
					if(typeof showToastNotification === 'function') showToastNotification("⏸️ Timer Paused");
				} else {
					startTimer();
					if(typeof showToastNotification === 'function') showToastNotification("▶️ Timer Resumed");
				}
			} else if(window.GameVariables.QuestionInProgress == true && window.GameVariables.QuestionLevel >= 11){
				if(typeof showToastNotification === 'function'){
					showToastNotification("⏱️ Untimed Championship Round (Q11 – Q15).");
				}
			} else if(typeof showToastNotification === 'function'){
				showToastNotification("⏱️ Start a question first before controlling the timer.");
			}
		}
		else if(e.keyCode == 49 || e.keyCode == 97) // key '1' or Numpad 1 to lock in 'A' as final
		{
			lockSoloAnswer('A', 'a', 'AnswerAIsOut');
		}
		else if(e.keyCode == 50 || e.keyCode == 98) // key '2' or Numpad 2 to lock in 'B' as final
		{
			lockSoloAnswer('B', 'b', 'AnswerBIsOut');
		}
		else if(e.keyCode == 51 || e.keyCode == 99) // key '3' or Numpad 3 to lock in 'C' as final
		{
			lockSoloAnswer('C', 'c', 'AnswerCIsOut');
		}
		else if(e.keyCode == 52 || e.keyCode == 100) // key '4' or Numpad 4 to lock in 'D' as final
		{
			lockSoloAnswer('D', 'd', 'AnswerDIsOut');
		}
		else if(e.keyCode == 65) // key 'a' for ask the audience (single-click flow)
		{
			if(window.GameVariables.IsMoneyTreeShowing == true){
				if(window.GameVariables.IsATALifeLineUsed == false){
					ataPulseLifeLine();
					startGeneralSound("lifeline_3_on.mp3");
				}
			}
			else if(window.GameVariables.QuestionInProgress == true){
				if(window.GameVariables.ataLifeLineSequenceCounter == 0){
					if(window.GameVariables.IsATALifeLineUsed){
						if(typeof showToastNotification === 'function'){
							showToastNotification("⚠️ Ask The Audience lifeline already used!");
						}
						return;
					}
					window.GameVariables.IsATALifeLineUsed = true;
					$('#btnATA').addClass('btn-used');
					window.GameVariables.CannotLockInFinalAnswer = false;
					window.GameVariables.FirstTierBackgroundSoundPlaying = false;

					startLifelineActiveSound("ata_start.mp3");
					setTimeout(stopLongPassiveSound, 200);
					slideInATAGraph();
					window.GameVariables.ataLifeLineSequenceCounter = 1;
					if(typeof showToastNotification === 'function'){
						showToastNotification("📊 Polling Studio Audience...");
					}

					var runIdAtAta = window.GameVariables.SoloRunId;
					clearTimeout(window.__ataVoteTimeout);
					clearTimeout(window.__ataDoneTimeout);

					window.__ataVoteTimeout = setTimeout(function(){
						if(window.GameVariables.SoloRunId !== runIdAtAta || (window.TournamentEngine && window.TournamentEngine.isActive) || !window.GameVariables.QuestionInProgress) return;
						generateGraphPercentanges();
						startLifelinePassiveSound("ata_vote.mp3");
						setTimeout(stopLifelineActiveSound, 200);
					}, 750);

					window.__ataDoneTimeout = setTimeout(function(){
						if(window.GameVariables.SoloRunId !== runIdAtAta || (window.TournamentEngine && window.TournamentEngine.isActive) || !window.GameVariables.QuestionInProgress) return;
						revealGraphPercentages();
						startLifelineActiveSound("ata_end.mp3");
						setTimeout(stopLifelinePassiveSound, 200);
						$('#ataPercentStrapA, #ataPercentStrapB, #ataPercentStrapC, #ataPercentStrapD').parent().transition({perspective:0, opacity:1}, 250, 'linear');
						setTimeout(function(){
							if(window.GameVariables.SoloRunId === runIdAtAta && window.GameVariables.QuestionInProgress && (!window.TournamentEngine || !window.TournamentEngine.isActive)){
								playBackgroundSound();
							}
						}, 400);
						window.GameVariables.ataLifeLineSequenceCounter = 2;
					}, 2400);
				}
				else{
					clearTimeout(window.__ataVoteTimeout);
					clearTimeout(window.__ataDoneTimeout);
					if(window.GameVariables.ataLifeLineSequenceCounter == 1){
						generateGraphPercentanges();
						revealGraphPercentages();
						stopLifelinePassiveSound();
						stopLifelineActiveSound();
						playBackgroundSound();
					}
					slideOutATAGraph();
					window.GameVariables.CannotLockInFinalAnswer = false;
					window.GameVariables.ataLifeLineSequenceCounter = 0;
				}
			}
			else if(typeof showToastNotification === 'function'){
				showToastNotification("📊 Start a question first to Ask The Audience.");
			}
		}
		else if(e.keyCode == 67) // key 'c' for commercial break / resume
		{
			if($('#stageWelcomeOverlay').is(':visible')){
				if(typeof window.launchSoloGame === 'function'){
					window.launchSoloGame();
				}
				return;
			}
			if(window.GameVariables.IsMoneyTreeShowing == true && typeof slideOutMoneyTree === 'function'){
				slideOutMoneyTree();
			}
			if(window.GameVariables.QuestionInProgress == false){
				if(window.GameVariables.IsInCommercial == true){
					hideMillionaireLogo();
					if(window.GameVariables.GeneralSound){
						try { window.GameVariables.GeneralSound.pause(); } catch(err){}
					}
					if(window.GameVariables.IsFirstQuestionOfGame == false){
						startShortActiveSound("commercial_out.mp3");
					}
					else{
						startShortActiveSound("hello_long.mp3");
					}
					window.GameVariables.IsInCommercial = false;
					if(typeof showToastNotification === 'function'){
						showToastNotification("🎬 Studio Live! Press [→ Next Action] to continue.");
					}
				}
				else{
					showMillionaireLogo();
					window.GameVariables.FirstTierBackgroundSoundPlaying = false;
					setTimeout(stopLongPassiveSound, 250);
					setTimeout(stopLongActiveSound, 250);
					startShortActiveSound("commercial_in.mp3");
					window.GameVariables.IsInCommercial = true;
					if(typeof showToastNotification === 'function'){
						showToastNotification("📺 Commercial Break — press [C Resume] to return.");
					}
				}
			}
			else if(window.GameVariables.QuestionInProgress == true){
				if(window.GameVariables.commericalSequenceCounter == 0){
					pauseTimer();
					hideQuestionAndAnswerStraps();
					$('.currentLevelStrapDiv').css('opacity', 0);
					showMillionaireLogo();
					window.GameVariables.FirstTierBackgroundSoundPlaying = false;
					setTimeout(stopLongPassiveSound, 200);
					setTimeout(stopLongActiveSound, 200);
					startShortActiveSound("commercial_in.mp3");
					window.GameVariables.CannotLockInFinalAnswer = true;
					window.GameVariables.commericalSequenceCounter = 1;
					if(typeof showToastNotification === 'function'){
						showToastNotification("📺 Commercial Break — click [C Resume] to return to question.");
					}
				}
				else{
					hideMillionaireLogo();
					startShortActiveSound("commercial_out.mp3");
					revealQuestionAndAnswerStraps();
					$('.currentLevelStrapDiv').css('opacity', 1);
					window.GameVariables.CannotLockInFinalAnswer = false;
					playBackgroundSound();
					if(window.GameVariables.QuestionLevel < 11 && typeof startTimer === 'function'){
						startTimer();
					}
					window.GameVariables.commericalSequenceCounter = 0;
					if(typeof showToastNotification === 'function'){
						showToastNotification("🎬 Back Live in the Hot Seat!");
					}
				}
			}
		}
		else if(e.keyCode == 69) // key 'e' for explain rules sound
		{
			if(window.GameVariables.QuestionInProgress == false && window.GameVariables.IsInCommercial == false)
			{
				if(window.GameVariables.QuestionLevel < 8){
					startLongPassiveSound("explain_rules.mp3");
				}
				else{
					startLongPassiveSound("explain_rules_v2.mp3");
				}
			}
		}
		else if(e.keyCode == 70) // key 'f' for fifty-fifty animations
		{
			if(window.GameVariables.IsMoneyTreeShowing == true){
				if(window.GameVariables.IsFFLifeLineUsed == false){
					ffPulseLifeLine();
					startGeneralSound("lifeline_2_on.mp3");
				}
			}
			else if(window.GameVariables.QuestionInProgress == true){
				if(window.GameVariables.IsFFLifeLineUsed){
					if(typeof showToastNotification === 'function'){
						showToastNotification("⚠️ 50:50 lifeline already used!");
					}
					return;
				}
				if(window.GameVariables.AnswerAIsOut == false && window.GameVariables.AnswerBIsOut == false && window.GameVariables.AnswerCIsOut == false && window.GameVariables.AnswerDIsOut == false){
					if(ffRemoveTwoWrongAnswers()){
						startLifelineActiveSound("fifty_fifty.mp3");
						if(typeof showToastNotification === 'function'){
							showToastNotification("🎯 50:50: Two wrong options eliminated!");
						}
					}
				} else if(typeof showToastNotification === 'function'){
					showToastNotification("⚠️ Two options are already eliminated on this question!");
				}
			}
			else if(typeof showToastNotification === 'function'){
				showToastNotification("🎯 Start a question first to use 50:50.");
			}
		}
		else if(e.keyCode == 72) // key 'h' for Ask The Host lifeline
		{
			if(typeof window.askTheHostLifeline === 'function'){
				window.askTheHostLifeline();
			}
		}
		else if(e.keyCode == 71) // key 'g' for game over
		{
			if(window.GameVariables.QuestionInProgress == false){
				startGeneralSound("game_over.mp3");
				setTimeout(stopLongPassiveSound, 500);
				setTimeout(stopLifelineActiveSound, 500);
				var runIdGameOver = window.GameVariables.SoloRunId;
				setTimeout(function(){
					if(window.GameVariables.SoloRunId === runIdGameOver && (!window.TournamentEngine || !window.TournamentEngine.isActive)){
						startShortPassiveSound("close_theme.mp3");
					}
				}, 2000);
				window.GameVariables.QuestionSequenceCounter = 0;
				window.GameVariables.MoneyTreeSequenceCounter = 0;
				window.GameVariables.IsFirstQuestionOfGame = true;

				$('.moneyTreeDiv').transition({perspective:0, opacity:1, right:"-760px"}, 1);
			}
		}
		else if(e.keyCode == 76) // key 'l' for life line strap animations
		{
			if(window.GameVariables.QuestionInProgress == true){
				window.GameVariables.IsLifeLineStrapShowing == true ? slideLifeLineStrapOut() : slideLifeLineStrapIn();
				window.GameVariables.IsLifeLineStrapShowing = !window.GameVariables.IsLifeLineStrapShowing;
			}
		}
		else if(e.keyCode == 77) // key 'm' for money level amount strap animations
		{
			if(window.GameVariables.QuestionInProgress == true){
				window.GameVariables.IsLevelStrapShowing == true ? hideLevelStrap() : showLevelStrap();
				window.GameVariables.IsLevelStrapShowing = !window.GameVariables.IsLevelStrapShowing;
			}
		}
		else if(e.keyCode == 78) // key 'n' for name strap animations
		{
			if(window.GameVariables.QuestionInProgress == false && window.GameVariables.IsInCommercial == false && window.GameVariables.IsMoneyTreeShowing == false && window.GameVariables.IsTotalPrizeMoneyShowing == false){
				window.GameVariables.IsNameStrapShowing == true ? hideNameStrap() : showNameStrap();
				window.GameVariables.IsNameStrapShowing = !window.GameVariables.IsNameStrapShowing;
			}
		}
		else if(e.keyCode == 80) // key 'p' for phone a friend (single-click flow)
		{
			if(window.GameVariables.IsMoneyTreeShowing == true){
				if(window.GameVariables.IsPAFLifeLineUsed == false){
					pafPulseLifeLine();
					startGeneralSound("lifeline_1_on.mp3");
				}
			}
			else if(window.GameVariables.QuestionInProgress == true){
				if(window.GameVariables.pafLifeLineSequenceCounter == 0){
					if(window.GameVariables.IsPAFLifeLineUsed){
						if(typeof showToastNotification === 'function'){
							showToastNotification("⚠️ Phone-A-Friend lifeline already used!");
						}
						return;
					}
					window.GameVariables.IsPAFLifeLineUsed = true;
					$('#btnPAF').addClass('btn-used');
					pauseTimer();
					startLifelineActiveSound("paf_start.mp3");
					fadeOutLongPassiveSound(1);
					window.GameVariables.CannotLockInFinalAnswer = false;
					window.GameVariables.FirstTierBackgroundSoundPlaying = false;
					pafRevealClock();
					if(window.GameVariables.ShowLifeLineCenteredAnimation == true){
						showJustLifeLineCenteredContainer();
					}
					window.GameVariables.pafLifeLineSequenceCounter = 1;
					if(typeof showToastNotification === 'function'){
						showToastNotification("📞 Phone-A-Friend Active! Choose an answer anytime or click PAF to hang up early.");
					}
				}
				else{
					pafEndClockEarly();
					setTimeout(stopLifelinePassiveSound, 150);
					window.GameVariables.pafLifeLineSequenceCounter = 0;
					window.GameVariables.CannotLockInFinalAnswer = false;
					if(window.GameVariables.QuestionInProgress && window.GameVariables.QuestionLevel < 11 && typeof startTimer === 'function'){
						startTimer();
					}
					if(typeof showToastNotification === 'function'){
						showToastNotification("📞 Phone-A-Friend call ended.");
					}
				}
			}
			else if(typeof showToastNotification === 'function'){
				showToastNotification("📞 Start a question first to use Phone-A-Friend.");
			}
		}
		else if(e.keyCode == 81) // key 'q' for game resume
		{
			if(window.GameVariables.QuestionInProgress == false){
				startLongPassiveSound("game_resume.mp3");
			}
		}
		else if(e.keyCode == 83) // key 's' for switch the question animations
		{
			if(window.GameVariables.IsMoneyTreeShowing == true){
				if(window.GameVariables.QuestionLevel <= window.GameVariables.STQUnlockedLevel){
					if(window.GameVariables.LifeLineAnimationCounter == 0){
						setLevelOnMoneyTree(window.GameVariables.STQUnlockedLevel);
					}
					else if(window.GameVariables.LifeLineAnimationCounter == 1){
						stqLifeLineSlideIn();
					}
					else if(window.GameVariables.LifeLineAnimationCounter == 2){
						stqPulseLifeLine();
						startGeneralSound("lifeline_4_on.mp3");
						window.GameVariables.LifeLineAnimationCounter = -1;
					}

					window.GameVariables.LifeLineAnimationCounter++;
				}
				else if(window.GameVariables.IsSTQLifeLineUsed == false) {
					stqPulseLifeLine();
					startGeneralSound("lifeline_4_on.mp3");
				}
			}
			else if(window.GameVariables.QuestionInProgress == true){
				if(window.GameVariables.stqLifeLineSequenceCounter == 0){
					showLifeLineCentered('#stqLifeLineCenterImg');
					startGeneralSound("lifeline_4_on.mp3");
					window.GameVariables.CannotLockInFinalAnswer = true;
				}
				else if(window.GameVariables.stqLifeLineSequenceCounter == 1){
					revealNormalToCorrectAnswerStep1(window.GameVariables.CurrentCorrectAnswer.toUpperCase());
				}
				else if(window.GameVariables.stqLifeLineSequenceCounter == 2){
					hideLifeLineCentered();
					switchAnimation();
					startLifelinePassiveSound("stq_new_question_flip.mp3");
				}
				else if(window.GameVariables.stqLifeLineSequenceCounter == 3){
					switchOutToNewQuestion();
				}
				else if(window.GameVariables.stqLifeLineSequenceCounter == 4){
					if(window.GameVariables.QuestionLevel < 11 && window.GameVariables.RevealAllAnswersBeforeStartingTimer == true){
						$('.questionStrapDiv').transition({perspective:4096, 'bottom':'229px'}, 250, 'linear', function(){
							$('.questionStrapDiv').transition({perspective:4096, 'bottom':'220px'}, 375, 'linear');
						});
						setTimeout(function(){
							$('.answerGroupADiv').transition({perspective:4096, 'bottom':'0px'}, 500, 'cubic-bezier(0.5, 1.35, 0.5, 1)');
						}, 0);
						setTimeout(function(){
							$('.answerGroupBDiv').transition({perspective:4096, 'bottom':'0px'}, 500, 'cubic-bezier(0.5, 1.25, 0.5, 1)');
						}, 50);
						$('.timerStrapDiv').show().transition({perspective:0, 'bottom':'408px'}, 250, 'linear', function(){
							$('.timerStrapDiv').transition({perspective:4096, 'bottom':'399px'}, 375, 'linear');
						});
						revealAllAnswersAtOnce();
						startTimer();
						window.GameVariables.stqLifeLineSequenceCounter = 8;
					}
					else{
						$('.questionStrapDiv').transition({perspective:4096, 'bottom':'229px'}, 250, 'linear', function(){
							$('.questionStrapDiv').transition({perspective:4096, 'bottom':'220px'}, 375, 'linear');
						});
						setTimeout(function(){
							$('.answerGroupADiv').transition({perspective:4096, 'bottom':'0px'}, 500, 'cubic-bezier(0.5, 1.35, 0.5, 1)');
						}, 0);
						setTimeout(function(){
							$('.answerGroupBDiv').transition({perspective:4096, 'bottom':'0px'}, 500, 'cubic-bezier(0.5, 1.25, 0.5, 1)');
						}, 50);
						$('.timerStrapDiv').show().transition({perspective:0, 'bottom':'408px'}, 250, 'linear', function(){
							$('.timerStrapDiv').transition({perspective:4096, 'bottom':'399px'}, 375, 'linear');
						});
					}
				}
				else if(window.GameVariables.stqLifeLineSequenceCounter <= 8){
					revealAnswersOneByOne();

					if(window.GameVariables.stqLifeLineSequenceCounter == 8){
						window.GameVariables.CannotLockInFinalAnswer = false;
						window.GameVariables.TimerReady = true;
						window.GameVariables.stqLifeLineSequenceCounter = -1;
					}
				}

				window.GameVariables.stqLifeLineSequenceCounter++;
			}
		}
		else if(e.keyCode == 85) // key 'u' for undo final answer / restart question
		{
			if(window.GameVariables.QuestionSequenceCounter == 7 || window.GameVariables.IsWalkingAway == true){
				undoFinaledAnswer();
				setTimeout(stopLongActiveSound, 200);
				window.GameVariables.IsWalkingAway = false;
				window.GameVariables.walkAwaySequenceCounter = 0;
				window.GameVariables.QuestionSequenceCounter = -1;
			}

			if(window.GameVariables.QuestionInProgress){
				playBackgroundSound();
			}
		}
		else if(e.keyCode == 87) // key 'w' for walk away
		{
			if(window.GameVariables.QuestionInProgress == true){
				if(window.GameVariables.walkAwaySequenceCounter == 0){
					pauseTimer();
					fadeOutLongPassiveSound(1);
					window.GameVariables.IsWalkingAway = true;
				}
				else if(window.GameVariables.walkAwaySequenceCounter == 1){
					if(window.GameVariables.CurrentTargetAnswer == "" || (window.GameVariables.CurrentTargetAnswer != window.GameVariables.CurrentCorrectAnswer)){
						revealNormalToCorrectAnswerStep1(window.GameVariables.CurrentCorrectAnswer.toUpperCase());
					}
					else if(window.GameVariables.CurrentTargetAnswer == window.GameVariables.CurrentCorrectAnswer){
						showFinalToCorrectAnswerStep1(window.GameVariables.CurrentCorrectAnswer.toUpperCase());
					}

					hideLifeLineCentered();

					if(window.GameVariables.IsLevelStrapShowing == true){
						hideLevelStrap();
						window.GameVariables.IsLevelStrapShowing = false;
					}
				}
				else if(window.GameVariables.walkAwaySequenceCounter == 2){
					$('.answerGroupBDiv').transition({perspective:4096, 'bottom':'-390px'}, 375, 'linear');
					$('.answerGroupADiv').transition({perspective:4096, 'bottom':'-390px'}, 375, 'linear');
					$('.questionStrapDiv').transition({perspective:4096, 'bottom':'-170px'}, 375, 'linear');
					$('.timerStrapDiv').transition({perspective:0, opacity: 0, 'bottom':'-111px'}, 375, 'linear', function(){
						hideQuestionAndAnswerStraps();
						hideTimer();
					});
					window.GameVariables.QuestionInProgress = false;
					window.GameVariables.walkAwaySequenceCounter = -1;
				}

				window.GameVariables.walkAwaySequenceCounter++;
			}
		}
		else if(e.keyCode == 88) // key 'x' to activate / step Fastest Finger First
		{
			if(typeof stepFastestFinger === 'function'){
				stepFastestFinger();
			} else if(typeof activateFastestFinger === 'function'){
				activateFastestFinger();
			}
		}
	});
});
