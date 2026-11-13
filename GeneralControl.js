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
	if(window.GameVariables.IsFirstQuestionOfGame == true || window.GameVariables.QuestionLevel < 6){
		window.GameVariables.IsFirstQuestionOfGame = false;
		startGeneralSound(window.GameVariables.LightsDownSounds[0]);
		setTimeout(stopLongPassiveSound, 1000);
	}
	else if(window.GameVariables.QuestionLevel == 6 || window.GameVariables.QuestionLevel == 11){
		startLongActiveSound(window.GameVariables.LightsDownSounds[window.GameVariables.QuestionLevel - 1]);
		setTimeout(stopLongPassiveSound, 1000);
	}
	else{
		startLongActiveSound(window.GameVariables.LightsDownSounds[window.GameVariables.QuestionLevel - 1]);
		setTimeout(stopLongPassiveSound, 200);
	}
}

function playBackgroundSound(){
	if(window.GameVariables.QuestionLevel < 6 && window.GameVariables.FirstTierBackgroundSoundPlaying == false){
		window.GameVariables.FirstTierBackgroundSoundPlaying = true;
		startLongPassiveSound(window.GameVariables.RoundBackgroundSounds[window.GameVariables.QuestionLevel - 1]);
	}
	else if(window.GameVariables.QuestionLevel > 5){
		startLongPassiveSound(window.GameVariables.RoundBackgroundSounds[window.GameVariables.QuestionLevel - 1]);
		setTimeout(stopLongActiveSound, 200);
	}
}

function playFinalAnswerSound(){
	if(window.GameVariables.QuestionLevel > 5){
		startLongActiveSound(window.GameVariables.FinalAnswerSounds[window.GameVariables.QuestionLevel - 1]);
		setTimeout(stopLongPassiveSound, 200);
	}
}

function playCorrectAnswerSound(){
	// Stop any active suspense bed, active tension sound, or remix audio
	stopLongPassiveSound();
	stopLongActiveSound();
	stopShortActiveSound();
	if(window.MillionaireFeatures && window.MillionaireFeatures.currentRemixAudio){
		try { window.MillionaireFeatures.currentRemixAudio.pause(); } catch(e){}
	}

	var level = (window.GameVariables && window.GameVariables.QuestionLevel) ? window.GameVariables.QuestionLevel : 1;
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