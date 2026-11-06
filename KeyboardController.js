$(document).ready(function(){
	$(document).on('keydown',function(e)
	{
		if($(e.target).is('input, textarea')) {
			if(e.keyCode == 27) {
				closeHintHelpLifeline();
			}
			return;
		}

		if(e.keyCode == 27) // Escape closes Hint Help modal
		{
			closeHintHelpLifeline();
		}
		else if(e.keyCode == 37) // key 'left arrow' for fastest-finger / money tree hide and show
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
						// reveal contestants one at a time
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
						setTimeout(startShortPassiveSound("fastest_finger_read_question.mp3"), 250);
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
						if(typeof showToastNotification === 'function'){
							showToastNotification("🎉 Contestant in Hot Seat! Press [→ Next Action] to play Question 1 (Rs. 1,000)");
						}
					}
					
					window.GameVariables.FastestFingerSequenceCounter++;
				}
				else if(window.GameVariables.QuestionInProgress == false && window.GameVariables.IsInCommercial == false && window.GameVariables.IsTotalPrizeMoneyShowing == false){
					// money tree animations
					if(window.GameVariables.MoneyTreeSequenceCounter == 0)
					{
						if(window.GameVariables.QuestionLevel < 8){
							startLongPassiveSound("explain_rules.mp3");
						}
						else{
							startLongPassiveSound("explain_rules_v2.mp3");
						}
					}
					else if(window.GameVariables.MoneyTreeSequenceCounter == 1)
					{
						slideInMoneyTree();
						window.GameVariables.IsMoneyTreeShowing = true;
					}
					else if(window.GameVariables.MoneyTreeSequenceCounter == 2)
					{
						scaleTreeLevels(window.GameVariables.QuestionLevel);
					}
					else if(window.GameVariables.MoneyTreeSequenceCounter == 3)
					{
						unscaleTreeLevels();
					}
					else if(window.GameVariables.MoneyTreeSequenceCounter >= 4)
					{
						
						window.GameVariables.IsMoneyTreeShowing == true ? hideMoneyTree() : showMoneyTree();
						window.GameVariables.IsMoneyTreeShowing == true ? setLevelOnMoneyTree(window.GameVariables.QuestionLevel) : null;
						window.GameVariables.STQUnlockedLevel > window.GameVariables.QuestionLevel ? stqLifeLineSlideOut() : null;
						window.GameVariables.IsMoneyTreeShowing = !window.GameVariables.IsMoneyTreeShowing;
						window.GameVariables.IsExplainingRules = false;
					}
					
					window.GameVariables.MoneyTreeSequenceCounter++;
				}
			}
		}
		else if(e.keyCode == 38) // key 'up arrow' to start the timer once all four answers have been revealed
		{
			if(window.GameVariables.TimerReady == true && window.GameVariables.RevealAllAnswersBeforeStartingTimer == false){
				startTimer();
				window.GameVariables.TimerReady = false;
			}
		}
		else if(e.keyCode == 39) // key 'right arrow' for question navigation
		{
			if(window.GameVariables.QuestionSequenceCounter == 99){
				showToastNotification("Game Over! Click [🔄 New Game] to start a brand new game.");
				return;
			}
			if(window.GameVariables.IsPlayingFasestFinger == false && window.GameVariables.IsMoneyTreeShowing == false && window.GameVariables.IsExplainingRules == false && window.GameVariables.IsInCommercial == false && window.GameVariables.IsNameStrapShowing == false && window.GameVariables.IsTotalPrizeMoneyShowing == false){
				if(window.GameVariables.QuestionSequenceCounter == -1){
					return;
				}			
				else if(window.GameVariables.QuestionSequenceCounter == 0){
					// play lights down sound
					playLightsDownSound();
					
				}
				else if(window.GameVariables.QuestionSequenceCounter == 1){
					setQuestion(false);
					window.GameVariables.QuestionInProgress = true;
					// setup question and answers
					$('.answerGroupBDiv').transition({perspective:4096, 'bottom':'-331px'}, 0);
					$('.answerGroupADiv').transition({perspective:4096, 'bottom':'-256px'}, 0);
					$('.questionStrapDiv').transition({perspective:4096, 'bottom':'-192px', 'rotateX':'0deg'}, 0);
					$('.timerStrapDiv').transition({perspective:0, opacity: 0, 'bottom':'241px'}, 0);
					revealQuestionAndAnswerStraps();
					playBackgroundSound();
					$('.questionStrapDiv').transition({perspective:4096, 'bottom':'62px'}, 700, 'cubic-bezier(0.5, 2, 0.5, 1)', function(){
						if(window.GameVariables.QuestionLevel < 6){
							if(window.GameVariables.FirstTierTimer == 1){
								tier1Timer();
							}
							else if(window.GameVariables.FirstTierTimer == 2){
								tier2Timer();
							}
							else if(window.GameVariables.FirstTierTimer == 3){
								tier3Timer();
							}
							else if(window.GameVariables.FirstTierTimer == 4){
								tier4Timer();
							}
							$('.timerStrapDiv').transition({perspective:0, opacity: 1, 'bottom':'241px'}, 500, 'linear');
						}
						else if(window.GameVariables.QuestionLevel < 11){
							if(window.GameVariables.SecondTierTimer == 1){
								tier1Timer();
							}
							else if(window.GameVariables.SecondTierTimer == 2){
								tier2Timer();
							}
							else if(window.GameVariables.SecondTierTimer == 3){
								tier3Timer();
							}
							else if(window.GameVariables.SecondTierTimer == 4){
								tier4Timer();
							}
							$('.timerStrapDiv').transition({perspective:0, opacity: 1, 'bottom':'241px'}, 500, 'linear');
						}
					});
				}
				else if(window.GameVariables.QuestionSequenceCounter == 2){
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
						$('.timerStrapDiv').transition({perspective:0, 'bottom':'408px'}, 250, 'linear', function(){
							$('.timerStrapDiv').transition({perspective:4096, 'bottom':'399px'}, 375, 'linear');
						});
						revealAllAnswersAtOnce();
						startTimer();
						window.GameVariables.QuestionSequenceCounter = 6;
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
						$('.timerStrapDiv').transition({perspective:0, 'bottom':'408px'}, 250, 'linear', function(){
							$('.timerStrapDiv').transition({perspective:4096, 'bottom':'399px'}, 375, 'linear');
						});
					}
					
					if(window.GameVariables.QuestionSequenceCounter == 6){
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
					if(window.GameVariables.CurrentCorrectAnswer == window.GameVariables.CurrentTargetAnswer){
						showFinalToCorrectAnswerStep1(window.GameVariables.CurrentTargetAnswer.toUpperCase());
						playCorrectAnswerSound();
						$('.timerStrapDiv').transition({perspective:0, 'bottom':'269px'}, 125, 'linear', function(){
							$('.timerStrapDiv').transition({perspective:0, opacity: 0, 'bottom':'269px'}, 0);
						});
					}
					else if(window.GameVariables.CurrentTargetAnswer != window.GameVariables.CurrentCorrectAnswer){
						revealNormalToCorrectAnswerStep1(window.GameVariables.CurrentCorrectAnswer.toUpperCase());
						playWrongAnswerSound();
						$('.timerStrapDiv').transition({perspective:0, 'bottom':'269px'}, 125, 'linear', function(){
							$('.timerStrapDiv').transition({perspective:0, opacity: 0, 'bottom':'269px'}, 0);
						});

						// Calculate guaranteed milestone winnings (Rs. 0, Rs. 10,000, or Rs. 3,20,000)
						var finalWonText = reduceAmountWon();
						window.GameVariables.QuestionInProgress = false;
						window.GameVariables.IsWalkingAway = true;
						window.GameVariables.QuestionSequenceCounter = 99;

						// After dramatic pause (1800ms), slide question straps away and show Total Winnings strap
						setTimeout(function(){
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
					if(window.GameVariables.QuestionLevel == 15){
						$('.answerGroupBDiv').transition({perspective:4096, 'bottom':'-412px'}, 375, 'linear');
						$('.answerGroupADiv').transition({perspective:4096, 'bottom':'-412px'}, 375, 'linear');
						$('.questionStrapDiv').transition({perspective:4096, 'bottom':'-192px'}, 375, 'linear', function(){
							showMillionaireTitleStrap();
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
					if(window.GameVariables.QuestionLevel == 15){
						hideMillionaireTitleStrap();
						window.GameVariables.IsWalkingAway = true;
					}
					else {
						$('.winStrapDiv').transition({perspective:4096, 'bottom':'-200px'}, 500, 'linear', function(){
							hideAmountWon();
						});
					}
					
					window.GameVariables.QuestionLevel++;
					setLevelOnMoneyTree(window.GameVariables.QuestionLevel);
					
					window.GameVariables.QuestionInProgress = false;
					
					if(window.GameVariables.QuestionLevel < 6){
						window.GameVariables.QuestionSequenceCounter = 0;
					}
					else{
						window.GameVariables.QuestionSequenceCounter = -1;
					}
					/* END OF CORRECT ANSWER GIVEN CONTROL */
				}
				else if(window.GameVariables.QuestionSequenceCounter == 10){
					/* START OF TIME UP GIVEN CONTROL */
					revealNormalToCorrectAnswerStep1(window.GameVariables.CurrentCorrectAnswer.toUpperCase());
					playWrongAnswerSound();
					var finalWonTimeUp = reduceAmountWon();
					window.GameVariables.QuestionInProgress = false;
					window.GameVariables.IsWalkingAway = true;
					window.GameVariables.QuestionSequenceCounter = 99;
					setTimeout(function(){
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
				else if(window.GameVariables.QuestionSequenceCounter == 99){
					/* GAME OVER STATE: Toggle Total Winnings Strap */
					if(window.GameVariables.IsTotalPrizeMoneyShowing == true){
						hideTotalPrizeMoneyStrap();
					} else {
						showTotalPrizeMoneyStrap();
					}
					return;
				}
				
				if(window.GameVariables.QuestionSequenceCounter !== 99){
					window.GameVariables.QuestionSequenceCounter++;
				}
			}
		}
		else if(e.keyCode == 40) // key 'down arrow' for total prize money
		{
			if(window.GameVariables.QuestionInProgress == false && window.GameVariables.IsMoneyTreeShowing == false  && window.GameVariables.IsNameStrapShowing == false){
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
			if(window.GameVariables.QuestionInProgress == true && window.GameVariables.TimerPaused == false){
				pauseTimer();
			}
			else{
				startTimer();
			}
		}
		else if(e.keyCode == 49) // key '1' to lock in 'A' as final
		{
			if(window.GameVariables.QuestionInProgress == true && window.GameVariables.CannotLockInFinalAnswer == false && window.GameVariables.AnswerAIsOut == false && window.GameVariables.CurrentTargetAnswer == "" && window.GameVariables.QuestionSequenceCounter == -1){
				lockInFinalAnswer('A');
				window.GameVariables.CurrentTargetAnswer = "a";
				pauseTimer();
				
				if(window.GameVariables.IsWalkingAway == false){
					playFinalAnswerSound();
				}
			}
		}
		else if(e.keyCode == 50) // key '2' to lock in 'B' as final
		{
			if(window.GameVariables.QuestionInProgress == true && window.GameVariables.CannotLockInFinalAnswer == false && window.GameVariables.AnswerBIsOut == false && window.GameVariables.CurrentTargetAnswer == "" && window.GameVariables.QuestionSequenceCounter == -1){
				lockInFinalAnswer('B');
				window.GameVariables.CurrentTargetAnswer = "b";
				pauseTimer();
				
				if(window.GameVariables.IsWalkingAway == false){
					playFinalAnswerSound();
				}
			}
		}
		else if(e.keyCode == 51) // key '3' to lock in 'C' as final
		{
			if(window.GameVariables.QuestionInProgress == true && window.GameVariables.CannotLockInFinalAnswer == false && window.GameVariables.AnswerCIsOut == false && window.GameVariables.CurrentTargetAnswer == "" && window.GameVariables.QuestionSequenceCounter == -1){
				lockInFinalAnswer('C');
				window.GameVariables.CurrentTargetAnswer = "c";
				pauseTimer();
				
				if(window.GameVariables.IsWalkingAway == false){
					playFinalAnswerSound();
				}
			}
		}
		else if(e.keyCode == 52) // key '4' to lock in 'D' as final
		{
			if(window.GameVariables.QuestionInProgress == true && window.GameVariables.CannotLockInFinalAnswer == false && window.GameVariables.AnswerDIsOut == false && window.GameVariables.CurrentTargetAnswer == "" && window.GameVariables.QuestionSequenceCounter == -1){
				lockInFinalAnswer('D');
				window.GameVariables.CurrentTargetAnswer = "d";
				pauseTimer();
				
				if(window.GameVariables.IsWalkingAway == false){
					playFinalAnswerSound();
				}
			}
		}
		else if(e.keyCode == 65) // key 'a' for ask the audience animations
		{
			if(window.GameVariables.IsMoneyTreeShowing == true){
				if(window.GameVariables.IsATALifeLineUsed == false){
					ataPulseLifeLine();
					startGeneralSound("lifeline_3_on.mp3");
				}
			}
			else if(window.GameVariables.QuestionInProgress == true){
				if(window.GameVariables.ataLifeLineSequenceCounter == 0){
					// play ata start sound
					window.GameVariables.CannotLockInFinalAnswer = true;
					startLifelineActiveSound("ata_start.mp3");
					setTimeout(stopLongPassiveSound, 200);
					window.GameVariables.FirstTierBackgroundSoundPlaying = false;
				}
				else if(window.GameVariables.ataLifeLineSequenceCounter == 1){
					slideInATAGraph();
				}
				else if(window.GameVariables.ataLifeLineSequenceCounter == 2){
					// play ata vote sound
					generateGraphPercentanges();
					startLifelinePassiveSound("ata_vote.mp3");
					setTimeout(stopLifelineActiveSound, 200);
				}
				else if(window.GameVariables.ataLifeLineSequenceCounter == 3){
					// play ata stop vote sound
					revealGraphPercentages();
					startLifelineActiveSound("ata_end.mp3");
					setTimeout(stopLifelinePassiveSound, 200);
					setTimeout(function(){
						playBackgroundSound();
					}, 400);
				}
				else if(window.GameVariables.ataLifeLineSequenceCounter == 4){
					slideOutATAGraph();
					window.GameVariables.CannotLockInFinalAnswer = false;
					window.GameVariables.ataLifeLineSequenceCounter = -1;
				}
				
				window.GameVariables.ataLifeLineSequenceCounter++;
			}
		}
		else if(e.keyCode == 67) // key 'c' for commerical in/out
		{
			if(window.GameVariables.IsMoneyTreeShowing == false){
				if(window.GameVariables.QuestionInProgress == false){
					if(window.GameVariables.IsInCommercial == true){
						hideMillionaireLogo();
						if(window.GameVariables.GeneralSound){
							try { window.GameVariables.GeneralSound.pause(); } catch(e){}
						}
						if(window.GameVariables.IsFirstQuestionOfGame == false){
							startShortActiveSound("commercial_out.mp3");
						}
						else{
							startShortActiveSound("hello_long.mp3");
						}
					}
					else{
						showMillionaireLogo();
						window.GameVariables.FirstTierBackgroundSoundPlaying = false;
						setTimeout(stopLongPassiveSound, 250);
						setTimeout(stopLongActiveSound, 250);
						startShortActiveSound("commercial_in.mp3");
					}
					
					window.GameVariables.IsInCommercial = !window.GameVariables.IsInCommercial;
				}
				else if(window.GameVariables.QuestionInProgress == true){
					if(window.GameVariables.commericalSequenceCounter == 0){
						hideQuestionAndAnswerStraps();
						$('.currentLevelStrapDiv').css('opacity', 0);
						window.GameVariables.CannotLockInFinalAnswer = true;
					}
					else if(window.GameVariables.commericalSequenceCounter == 1){
						showMillionaireLogo();
						window.GameVariables.FirstTierBackgroundSoundPlaying = false;
						setTimeout(stopLongPassiveSound, 250);
						setTimeout(stopLongActiveSound, 250);
						startShortActiveSound("commercial_in.mp3");
					}
					else if(window.GameVariables.commericalSequenceCounter == 2){
						hideMillionaireLogo();
						startShortActiveSound("commercial_out.mp3");
					}
					else if(window.GameVariables.commericalSequenceCounter == 3){
						revealQuestionAndAnswerStraps();
						$('.currentLevelStrapDiv').css('opacity', 1);
						window.GameVariables.CannotLockInFinalAnswer = false;
						if(window.GameVariables.QuestionSequenceCounter == -1){
							playBackgroundSound();
						}
						else if(window.GameVariables.QuestionSequenceCounter == 6){
							if(window.GameVariables.QuestionLevel > 5){
								playFinalAnswerSound();
							}
							else{
								playBackgroundSound();
							}
						}
						window.GameVariables.commericalSequenceCounter = -1;
					}
					
					window.GameVariables.commericalSequenceCounter++;
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
				if(window.GameVariables.AnswerAIsOut == false && window.GameVariables.AnswerBIsOut == false && window.GameVariables.AnswerCIsOut == false && window.GameVariables.AnswerDIsOut == false){
					ffRemoveTwoWrongAnswers();
					startLifelineActiveSound("fifty_fifty.mp3");
				}
			}
		}
		else if(e.keyCode == 71) // key 'g' for game over
		{
			if(window.GameVariables.QuestionInProgress == false){
				startGeneralSound("game_over.mp3");
				setTimeout(stopLongPassiveSound, 500);
				setTimeout(stopLifelineActiveSound, 500);
				setTimeout(function(){
					startShortPassiveSound("close_theme.mp3");
				}, 2000);
				window.GameVariables.QuestionSequenceCounter = 0;
				window.GameVariables.MoneyTreeSequenceCounter = 0;
				window.GameVariables.IsFirstQuestionOfGame = true;
				
				$('.moneyTreeDiv').transition({perspective:0, opacity:1, right:"-760px"}, 1)
			}
		}
		else if(e.keyCode == 72) // key 'h' for Hint Help lifeline (Gemini AI)
		{
			if(window.GameVariables.IsMoneyTreeShowing == true){
				if(window.GameVariables.IsHintHelpUsed == false){
					hintHelpPulseLifeLine();
					startGeneralSound("lifeline_4_on.mp3");
				}
			}
			else if(window.GameVariables.QuestionInProgress == true){
				openHintHelpLifeline();
			}
		}
		else if(e.keyCode == 76) // key 'l' for life line strap animations
		{
			if(window.GameVariables.QuestionInProgress == true){
				window.GameVariables.IsLifeLineStrapShowing == true ? slideLifeLineStrapOut() : slideLifeLineStrapIn();
				window.GameVariables.IsLifeLineStrapShowing = !window.GameVariables.IsLifeLineStrapShowing
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
		else if(e.keyCode == 80) // key 'p' for phone a friend animations
		{
			if(window.GameVariables.IsMoneyTreeShowing == true){
				if(window.GameVariables.IsPAFLifeLineUsed == false){
					pafPulseLifeLine();
					startGeneralSound("lifeline_1_on.mp3");
				}
			}
			else if(window.GameVariables.QuestionInProgress == true){
				if(window.GameVariables.pafLifeLineSequenceCounter == 0){
					startLifelineActiveSound("paf_start.mp3");
					//setTimeout(stopLongPassiveSound, 200);
					fadeOutLongPassiveSound(1);
					window.GameVariables.CannotLockInFinalAnswer = true;
					window.GameVariables.FirstTierBackgroundSoundPlaying = false;
				}
				else if(window.GameVariables.pafLifeLineSequenceCounter == 1){
					hideQuestionAndAnswerStraps();
					$('.currentLevelStrapDiv').css('opacity', 0);
					if(window.GameVariables.QuestionLevel < 11){
						hideTimer();
						slideTimerDown();
					}

					if(window.GameVariables.ShowLifeLineCenteredAnimation == true){
						hideJustLifeLineCenteredContainer();
					}
				}
				else if(window.GameVariables.pafLifeLineSequenceCounter == 2){
					revealQuestionAndAnswerStraps();
					$('.currentLevelStrapDiv').css('opacity', 1);
					if(window.GameVariables.QuestionLevel < 11){
						showTimer();
					}
					pafRevealClock();
					
					if(window.GameVariables.ShowLifeLineCenteredAnimation == true){
						showJustLifeLineCenteredContainer();
					}
				}
				else if(window.GameVariables.pafLifeLineSequenceCounter == 3){
					pafEndClockEarly();
					setTimeout(stopLifelinePassiveSound, 200);
				}
				
				window.GameVariables.pafLifeLineSequenceCounter++;
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
						$('.timerStrapDiv').transition({perspective:0, 'bottom':'408px'}, 250, 'linear', function(){
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
						$('.timerStrapDiv').transition({perspective:0, 'bottom':'408px'}, 250, 'linear', function(){
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

