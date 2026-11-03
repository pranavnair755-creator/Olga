function hideMillionaireLogo(){
	window.GameVariables.IsLogoShowing = false;
	$('.logoContainerDiv').transition({perspective:0,opacity:0}, 1000, 'linear');
}

function showMillionaireLogo(){
	window.GameVariables.IsLogoShowing = true;
	$('.logoContainerDiv').transition({perspective:0,opacity:1}, 1000, 'linear');
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
	if(window.GameVariables.QuestionLevel < 6){
		startGeneralSound(window.GameVariables.CorrectAnswerSounds[window.GameVariables.QuestionLevel - 1]);
		
		if(window.GameVariables.QuestionLevel == 5){
			setTimeout(stopLongPassiveSound, 1000);
		}
	}
	else if(window.GameVariables.QuestionLevel == 10 || window.GameVariables.QuestionLevel == 15){
		startLongPassiveSound(window.GameVariables.CorrectAnswerSounds[window.GameVariables.QuestionLevel - 1]);
		setTimeout(stopLongActiveSound, 1000);
	}
	else{
		startLongPassiveSound(window.GameVariables.CorrectAnswerSounds[window.GameVariables.QuestionLevel - 1]);
		setTimeout(stopLongActiveSound, 200);
	}
}

function playWrongAnswerSound(){
	if(window.GameVariables.QuestionLevel < 6){
		startGeneralSound(window.GameVariables.WrongAnswerSounds[window.GameVariables.QuestionLevel - 1]);
		setTimeout(stopLongPassiveSound, 200);
	}
	else if(window.GameVariables.QuestionLevel == 6 || window.GameVariables.QuestionLevel == 11){
		startLongPassiveSound(window.GameVariables.WrongAnswerSounds[window.GameVariables.QuestionLevel - 1]);
		setTimeout(stopLongActiveSound, 1000);
	}
	else{
		startLongPassiveSound(window.GameVariables.WrongAnswerSounds[window.GameVariables.QuestionLevel - 1]);
		setTimeout(stopLongActiveSound, 200);
	}
}