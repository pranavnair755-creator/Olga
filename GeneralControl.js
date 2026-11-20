function hideMillionaireLogo(){
	window.GameVariables.IsLogoShowing = false;
	$('.logoContainerDiv').stop(true, true).transition({perspective:0,opacity:0}, 400, 'linear', function(){
		if(!window.GameVariables.IsLogoShowing){
			$(this).hide();
		}
	});
}

function showMillionaireLogo(){
	window.GameVariables.IsLogoShowing = true;
	$('.logoContainerDiv').stop(true, true).show().transition({perspective:0,opacity:1}, 600, 'linear');
	animateLogoBeams();
}

function animateLogoBeams(){
	$('#logoBeam1Img').transition({perspective:0, opacity:0.75}, 2000, 'linear', function(){
		$('#logoBeam1Img').transition({perspective:0, opacity:1}, 2000, 'linear');
	});
	
	$('#logoBeam2Img').transition({perspective:0, opacity:1}, 2000, 'linear', function(){
		$('#logoBeam2Img').transition({perspective:0, opacity:0.75}, 2000, 'linear', function(){
			if(window.GameVariables.IsLogoShowing == true){
				animateLogoBeams();
			}
		});
	});
}

function playLightsDownSound(){
	var level = (window.GameVariables && window.GameVariables.QuestionLevel) ? window.GameVariables.QuestionLevel : 1;
	if(level == 1 || window.GameVariables.IsFirstQuestionOfGame == true){
		window.GameVariables.IsFirstQuestionOfGame = false;
		startGeneralSound(window.GameVariables.LightsDownSounds[0], false);
		setTimeout(stopLongPassiveSound, 1000);
	}
	else if(level >= 2 && level <= 5){
		// No lights down for Q2-Q5: keep continuous Q1-Q5 flow
		return;
	}
	else if(level == 6 || level == 11){
		startLongActiveSound(window.GameVariables.LightsDownSounds[level - 1]);
		setTimeout(stopLongPassiveSound, 1000);
	}
	else{
		startLongActiveSound(window.GameVariables.LightsDownSounds[level - 1]);
		setTimeout(stopLongPassiveSound, 200);
	}
}

function playBackgroundSound(){
	var level = (window.GameVariables && window.GameVariables.QuestionLevel) ? window.GameVariables.QuestionLevel : 1;
	if(level < 6){
		if(window.GameVariables.FirstTierBackgroundSoundPlaying == false || !window.GameVariables.LongPassiveSound || window.GameVariables.LongPassiveSound.paused){
			window.GameVariables.FirstTierBackgroundSoundPlaying = true;
			startLongPassiveSound(window.GameVariables.RoundBackgroundSounds[level - 1] || "q1_to_q5_bed.mp3", true);
		}
	}
	else {
		window.GameVariables.FirstTierBackgroundSoundPlaying = false;
		startLongPassiveSound(window.GameVariables.RoundBackgroundSounds[level - 1] || "timer_bed.mp3", true);
		setTimeout(stopLongActiveSound, 200);
	}
}

function playFinalAnswerSound(){
	var level = (window.GameVariables && window.GameVariables.QuestionLevel) ? window.GameVariables.QuestionLevel : 1;
	if(level > 5){
		startLongActiveSound(window.GameVariables.FinalAnswerSounds[level - 1] || "final_answer_1.mp3");
		setTimeout(stopLongPassiveSound, 200);
	}
}

function playCorrectAnswerSound(){
	var level = (window.GameVariables && window.GameVariables.QuestionLevel) ? window.GameVariables.QuestionLevel : 1;
	var isTenQ = !!(window.GameVariables && ((window.GameVariables.PrizeAmounts && window.GameVariables.PrizeAmounts.length === 10) || window.GameVariables.IsTenQuestionFormat));
	// In 10-question round (45sec_UK cue), stop music when right answer is revealed so it plays again on next question.
	// In classic 15-question Q1-Q4, keep LongPassiveSound flowing continuously.
	if(isTenQ || level >= 5){
		stopLongPassiveSound();
		window.GameVariables.FirstTierBackgroundSoundPlaying = false;
	}
	stopLongActiveSound();
	stopShortActiveSound();
	if(window.MillionaireFeatures && window.MillionaireFeatures.currentRemixAudio){
		try { window.MillionaireFeatures.currentRemixAudio.pause(); } catch(e){}
	}

	var soundFile = "q1_to_q4_correct.mp3";
	if(window.GameVariables && window.GameVariables.CorrectAnswerSounds && window.GameVariables.CorrectAnswerSounds[level - 1]){
		soundFile = window.GameVariables.CorrectAnswerSounds[level - 1];
	}

	// Play win stinger once (never loop)
	startGeneralSound(soundFile, false);
	if(window.GameVariables && window.GameVariables.GeneralSound){
		window.GameVariables.GeneralSound.loop = false;
	}
}

function playWrongAnswerSound(){
	// Immediately stop all background suspense music, beds, and hot-seat cues
	stopLongPassiveSound();
	stopLongActiveSound();
	stopShortActiveSound();
	if(window.MillionaireFeatures && window.MillionaireFeatures.currentRemixAudio){
		try { window.MillionaireFeatures.currentRemixAudio.pause(); } catch(e){}
	}

	var level = (window.GameVariables && window.GameVariables.QuestionLevel) ? window.GameVariables.QuestionLevel : 1;
	var soundFile = "q1_to_q5_lose.mp3";
	if(window.GameVariables && window.GameVariables.WrongAnswerSounds && window.GameVariables.WrongAnswerSounds[level - 1]){
		soundFile = window.GameVariables.WrongAnswerSounds[level - 1];
	}

	// Play wrong answer sound strictly once (never loop)
	startGeneralSound(soundFile, false);
	if(window.GameVariables && window.GameVariables.GeneralSound){
		window.GameVariables.GeneralSound.loop = false;
	}
}