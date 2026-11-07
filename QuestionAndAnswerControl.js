function setQuestion(isSettingSwitchQuestion){
	var targetQuestion = null;
	
	if(isSettingSwitchQuestion == false){
		targetQuestion = window.GameVariables.QuestionsAndAnswers[window.GameVariables.QuestionLevel - 1];
	}
	else{
		targetQuestion = window.GameVariables.SwitchQuestionsAndAnswers[window.GameVariables.QuestionLevel - 1];
	}
	
	window.GameVariables.CurrentCorrectAnswer = targetQuestion.CorrectAnswer;
	
	$('.questionTd').html(targetQuestion.Question);
	$('#answerA .answerP').html(targetQuestion.AnswerA);
	$('#answerB .answerP').html(targetQuestion.AnswerB);
	$('#answerC .answerP').html(targetQuestion.AnswerC);
	$('#answerD .answerP').html(targetQuestion.AnswerD);

	if(typeof window.displayQuestionImage === 'function'){
		window.displayQuestionImage(targetQuestion.ImageUrl);
	}
}

function revealQuestionAndAnswerStraps(){
	$('.answerStrapDiv').css('opacity', 1);
	$('.questionStrapDiv').css('opacity', 1);
	
	if(window.GameVariables.IsSTQLifeLineActiveAtStart == true){
		window.GameVariables.IsSTQLifeLineActiveAtStart = false;
		showLifeLineCentered('#stqLifeLineCenterImg');
	}
}

function hideQuestionAndAnswerStraps(){
	$('.answerStrapDiv').css('opacity', 0);
	$('.questionStrapDiv').css('opacity', 0);
	clearTimeout(window.GameVariables.ShowAnswerTimeout);

	if(typeof window.hideQuestionImage === 'function'){
		window.hideQuestionImage();
	}
}

function revealAnswersOneByOne(){
	window.GameVariables.RevealAnswerCounter++;
	
	if(window.GameVariables.RevealAnswerCounter == 1){
		$('#answerA .letterP').css('opacity', 1);
		$('#answerA .answerP').css('opacity', 1);
		$('#answerA .diagonalImg').css('opacity', 1);
	}
	else if(window.GameVariables.RevealAnswerCounter == 2){
		$('#answerB .letterP').css('opacity', 1);
		$('#answerB .answerP').css('opacity', 1);
		$('#answerB .diagonalImg').css('opacity', 1);
	}
	else if(window.GameVariables.RevealAnswerCounter == 3){
		$('#answerC .letterP').css('opacity', 1);
		$('#answerC .answerP').css('opacity', 1);
		$('#answerC .diagonalImg').css('opacity', 1);		
	}
	else if(window.GameVariables.RevealAnswerCounter == 4){
		$('#answerD .letterP').css('opacity', 1);
		$('#answerD .answerP').css('opacity', 1);
		$('#answerD .diagonalImg').css('opacity', 1);
		window.GameVariables.RevealAnswerCounter = 0;
	}
}

function revealAllAnswersAtOnce(){
	$('#answerA .letterP, #answerB .letterP, #answerC .letterP, #answerD .letterP').css('opacity', 1);
	$('#answerA .answerP, #answerB .answerP, #answerC .answerP, #answerD .answerP').css('opacity', 1);
	$('#answerA .diagonalImg, #answerB .diagonalImg, #answerC .diagonalImg, #answerD .diagonalImg').css('opacity', 1);
}

function lockInFinalAnswer(answer){
	$('#answer' + answer + ' .finalImg').css('opacity', 1);
	$('#answer' + answer + ' .letterP').css('color', '#000000');
	$('#answer' + answer + ' .answerP').css('color', '#000000');
	$('#answer' + answer + ' .letterP').css('text-shadow','0px 0px 0px transparent');
	$('#answer' + answer + ' .answerP').css('text-shadow','0px 0px 0px transparent');
	window.GameVariables.QuestionSequenceCounter = 7;
}

function showFinalToCorrectAnswerStep1(answer){
	$('#answer' + answer + ' .correctImg').css('opacity', 1);
	window.GameVariables.ShowAnswerTimeout = setTimeout(function(){
		showFinalToCorrectAnswerStep2(answer);
	}, 200);
}

function showFinalToCorrectAnswerStep2(answer){
	$('#answer' + answer + ' .correctImg').css('opacity', 0);
	window.GameVariables.ShowAnswerTimeout = setTimeout(function(){
		showFinalToCorrectAnswerStep3(answer);
	}, 200);
}

function showFinalToCorrectAnswerStep3(answer){
	$('#answer' + answer + ' .correctImg').css('opacity', 1);
	window.GameVariables.ShowAnswerTimeout = setTimeout(function(){
		showFinalToCorrectAnswerStep4(answer);
	}, 200);
}

function showFinalToCorrectAnswerStep4(answer){
	$('#answer' + answer + ' .correctImg').css('opacity', 0);
	window.GameVariables.ShowAnswerTimeout = setTimeout(function(){
		showFinalToCorrectAnswerStep5(answer);
	}, 200);
}

function showFinalToCorrectAnswerStep5(answer){
	$('#answer' + answer + ' .correctImg').css('opacity', 1);
}

function revealNormalToCorrectAnswerStep1(answer){
	$('#answer' + answer + ' .correctImg').css('opacity', 1);
	$('#answer' + answer + ' .letterP').css('color', '#000000');
	$('#answer' + answer + ' .answerP').css('color', '#000000');
	$('#answer' + answer + ' .letterP').css('text-shadow','0px 0px 0px transparent');
	$('#answer' + answer + ' .answerP').css('text-shadow','0px 0px 0px transparent');
	window.GameVariables.ShowAnswerTimeout = setTimeout(function(){
		revealNormalToCorrectAnswerStep2(answer);
	}, 200);
}

function revealNormalToCorrectAnswerStep2(answer){
	$('#answer' + answer + ' .correctImg').css('opacity', 0);
	$('#answer' + answer + ' .letterP').css('color', '#EA932C');
	$('#answer' + answer + ' .answerP').css('color', '#FFFFFF');
	$('#answer' + answer + ' .letterP').css('text-shadow','2px 2px 0px black');
	$('#answer' + answer + ' .answerP').css('text-shadow','2px 2px 0px black');
	window.GameVariables.ShowAnswerTimeout = setTimeout(function(){
		revealNormalToCorrectAnswerStep3(answer);
	}, 200);
}

function revealNormalToCorrectAnswerStep3(answer){
	$('#answer' + answer + ' .correctImg').css('opacity', 1);
	$('#answer' + answer + ' .letterP').css('color', '#000000');
	$('#answer' + answer + ' .answerP').css('color', '#000000');
	$('#answer' + answer + ' .letterP').css('text-shadow','0px 0px 0px transparent');
	$('#answer' + answer + ' .answerP').css('text-shadow','0px 0px 0px transparent');
	window.GameVariables.ShowAnswerTimeout = setTimeout(function(){
		revealNormalToCorrectAnswerStep4(answer);
	}, 200);
}

function revealNormalToCorrectAnswerStep4(answer){
	$('#answer' + answer + ' .correctImg').css('opacity', 0);
	$('#answer' + answer + ' .letterP').css('color', '#EA932C');
	$('#answer' + answer + ' .answerP').css('color', '#FFFFFF');
	$('#answer' + answer + ' .letterP').css('text-shadow','2px 2px 0px black');
	$('#answer' + answer + ' .answerP').css('text-shadow','2px 2px 0px black');
	window.GameVariables.ShowAnswerTimeout = setTimeout(function(){
		revealNormalToCorrectAnswerStep5(answer);
	}, 200);
}

function revealNormalToCorrectAnswerStep5(answer){
	$('#answer' + answer + ' .correctImg').css('opacity', 1);
	$('#answer' + answer + ' .letterP').css('color', '#000000');
	$('#answer' + answer + ' .answerP').css('color', '#000000');
	$('#answer' + answer + ' .letterP').css('text-shadow','0px 0px 0px transparent');
	$('#answer' + answer + ' .answerP').css('text-shadow','0px 0px 0px transparent');
}

function resetAnswerStraps(){
	$('#answerA .letterP, #answerA .answerP').css('opacity', 0);
	$('#answerB .letterP, #answerB .answerP').css('opacity', 0);
	$('#answerC .letterP, #answerC .answerP').css('opacity', 0);
	$('#answerD .letterP, #answerD .answerP').css('opacity', 0);
	$('.finalImg, .correctImg, .diagonalImg').css('opacity', 0);
	$('.answerP').css('color','#FFFFFF');
	$('.letterP').css('color','#EA932C');
	$('.answerP').css('text-shadow','2px 2px 0px black');
	$('.letterP').css('text-shadow','2px 2px 0px black');
	$('#ataPercentStrapA').parent().transition({perspective:0, opacity:0}, 250, 'linear');
	$('#ataPercentStrapB').parent().transition({perspective:0, opacity:0}, 250, 'linear');
	$('#ataPercentStrapC').parent().transition({perspective:0, opacity:0}, 250, 'linear');
	$('#ataPercentStrapD').parent().transition({perspective:0, opacity:0}, 250, 'linear');
	window.GameVariables.AnswerAIsOut = false;
	window.GameVariables.AnswerBIsOut = false;
	window.GameVariables.AnswerCIsOut = false;
	window.GameVariables.AnswerDIsOut = false;
	window.GameVariables.CurrentTargetAnswer = "";
}

function undoFinaledAnswer(){
	window.GameVariables.CurrentTargetAnswer = "";
	
	if(window.GameVariables.AnswerAIsOut == false){
		$('#answerA .finalImg').css('opacity', 0);
		$('#answerA .answerP').css('color','#FFFFFF');
		$('#answerA .letterP').css('color','#EA932C');
		$('#answerA .answerP').css('text-shadow','2px 2px 0px black');
		$('#answerA .letterP').css('text-shadow','2px 2px 0px black');
	}
	
	if(window.GameVariables.AnswerBIsOut == false){
		$('#answerB .finalImg').css('opacity', 0);
		$('#answerB .answerP').css('color','#FFFFFF');
		$('#answerB .letterP').css('color','#EA932C');
		$('#answerB .answerP').css('text-shadow','2px 2px 0px black');
		$('#answerB .letterP').css('text-shadow','2px 2px 0px black');
	}
	
	if(window.GameVariables.AnswerCIsOut == false){
		$('#answerC .finalImg').css('opacity', 0);
		$('#answerC .answerP').css('color','#FFFFFF');
		$('#answerC .letterP').css('color','#EA932C');
		$('#answerC .answerP').css('text-shadow','2px 2px 0px black');
		$('#answerC .letterP').css('text-shadow','2px 2px 0px black');
	}
	
	if(window.GameVariables.AnswerDIsOut == false){
		$('#answerD .finalImg').css('opacity', 0);
		$('#answerD .answerP').css('color','#FFFFFF');
		$('#answerD .letterP').css('color','#EA932C');
		$('#answerD .answerP').css('text-shadow','2px 2px 0px black');
		$('#answerD .letterP').css('text-shadow','2px 2px 0px black');
	}
}

















