function revealFastestFingerQuestion(){
	revealQuestionAndAnswerStraps();
}

function revealFastestFingerContestants(){
	$('.contestantNameAndLocationDiv').css('opacity', 1);
	$('.contestantNameP').html(window.GameVariables.FastestFingerContestants[window.GameVariables.RevealFastestFingerContestantCounter].FirstName + ' ' + window.GameVariables.FastestFingerContestants[window.GameVariables.RevealFastestFingerContestantCounter].LastName);
	$('.contestantLocationP').html(window.GameVariables.FastestFingerContestants[window.GameVariables.RevealFastestFingerContestantCounter].Location);
	window.GameVariables.RevealFastestFingerContestantCounter++;
}
function hideContestantNameAndLocation(){
	$('.contestantNameAndLocationDiv').css('opacity', 0);
}

function hideFastestFingerQuestionAndAnswers(){
	$('.answerStrapDiv').css('opacity', 0);
	$('.questionStrapDiv').css('opacity', 0);
	$('#answerA .letterP, #answerB .letterP, #answerC .letterP, #answerD .letterP').css('opacity', 0);
	$('#answerA .answerP, #answerB .answerP, #answerC .answerP, #answerD .answerP').css('opacity', 0);
	$('#answerA .diagonalImg, #answerB .diagonalImg, #answerC .diagonalImg, #answerD .diagonalImg').css('opacity', 0);
}

function showFastestFingerAnswerTree(){
	$('.fastestFingerRevealOrderDiv').transition({perspective:0, 'right': '-52px'}, 750, 'ease-out');
}

function hideFastestFingerAnswerTree(){
	$('.fastestFingerRevealOrderDiv').css('right','-760px');
	$('.fastestFingerTreeAnswerDiv').css('left','760px');
}

function revealFastestFingerAnswersinCorrectOrder(){
	window.GameVariables.FastestFingerRevealAnswerCounter++;
	
	var targetId = '#fastestAnswerOrder' + window.GameVariables.FastestFingerRevealAnswerCounter;
	$(targetId).transition({perspective:0,'left':'-70px'}, 500);
	
	if(window.GameVariables.FastestFingerRevealAnswerCounter == 4){
		window.GameVariables.FastestFingerRevealAnswerCounter = 0;
	}
}

function showFastestFingerContestants(){
	for(var i = 0; i < 10; i++){
		var targetId = '#fastestContestant' + (i + 1);
		$(targetId + ' .fastestContestantNameP').css('color', 'white');
		$(targetId + ' .fastestContestantTimeP').css({'opacity':0, 'color':'white'});
		$(targetId + ' .fastestContestantTimeP').html(window.GameVariables.FastestFingerContestantTimes[i]);
	}
	
	$('.fastestFingerContestantsDiv').css('opacity', 1);
	$('#stageBackgroundImg').css('opacity', 1);
}

function hideFastestFingerContestants(){
	$('.fastestFingerContestantsDiv').css('opacity', 0);
	$('#stageBackgroundImg').css('opacity', 0);
}

function revealFastestFingerWinnersAndTimes(){
	window.GameVariables.RevealFastestFingerWinnersCounter++;
	
	if(window.GameVariables.RevealFastestFingerWinnersCounter <= 10){
		if(window.GameVariables.FastestFingerContestantWinners[window.GameVariables.RevealFastestFingerWinnersCounter - 1] == true){
			var targetId = '#fastestContestant' + window.GameVariables.RevealFastestFingerWinnersCounter;
			
			$(targetId + ' .fastestTimeCorrectFillImg').transition({perspective:0, 'opacity': 1}, 1000, 'linear');
			$(targetId + ' .fastestContestantTimeP').css('opacity', 1);
		}
		
		setTimeout(revealFastestFingerWinnersAndTimes, 100);
	}else{
		window.GameVariables.RevealFastestFingerWinnersCounter = 0;
	}
}

function flashFastestTimeStep1(){
	var targetId = '#fastestContestant' + window.GameVariables.FastestFingerConstestantWinner;
	$(targetId + ' .fastestTimeCorrectFillImg').transition({perspective:0, 'opacity': 0.5}, 500, 'linear');
	window.GameVariables.ShowWinnerTimeout = setTimeout(flashFastestTimeStep2, 500);
}

function flashFastestTimeStep2(){
	var targetId = '#fastestContestant' + window.GameVariables.FastestFingerConstestantWinner;
	$(targetId + ' .fastestTimeCorrectFillImg').transition({perspective:0, 'opacity': 1}, 500, 'linear');
	window.GameVariables.ShowWinnerTimeout = setTimeout(flashFastestTimeStep1, 500);
}

function showTheFastestFingerWinner(){
	$('.fastestFingerContestantsDiv').css('opacity', 0);
	$('#stageBackgroundImg').css('opacity', 0);
	$('#fastestContestant').css('opacity', 1);
	clearTimeout(window.GameVariables.ShowWinnerTimeout);
	$('#fastestContestant .fastestContestantNameP').html(window.GameVariables.FastestFingerContestants[window.GameVariables.FastestFingerConstestantWinner - 1].FirstName + ' ' + window.GameVariables.FastestFingerContestants[window.GameVariables.FastestFingerConstestantWinner - 1].LastName);
	$('#fastestContestant .fastestContestantTimeP').html(window.GameVariables.FastestFingerContestantTimes[window.GameVariables.FastestFingerConstestantWinner - 1]);
	$('.millionaireWinnerNameDiv').html(window.GameVariables.FastestFingerContestants[window.GameVariables.FastestFingerConstestantWinner - 1].FirstName + ' ' + window.GameVariables.FastestFingerContestants[window.GameVariables.FastestFingerConstestantWinner - 1].LastName);
	$('.contestantNameP').html(window.GameVariables.FastestFingerContestants[window.GameVariables.FastestFingerConstestantWinner - 1].FirstName + ' ' + window.GameVariables.FastestFingerContestants[window.GameVariables.FastestFingerConstestantWinner - 1].LastName)
	$('.contestantLocationP').html(window.GameVariables.FastestFingerContestants[window.GameVariables.FastestFingerConstestantWinner - 1].Location);
}

function hideTheFastestFingerWinner(){
	$('#fastestContestant').css('opacity', 0);
}