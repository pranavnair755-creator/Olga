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

var fastestFingerQuestionsList = [
	{
		question: "Starting with the earliest, arrange these historic Indian milestones in chronological order:",
		a: "Battle of Plassey",
		b: "First War of Independence",
		c: "Quit India Movement",
		d: "India's Independence",
		order: [
			{ letter: "A:", text: "Battle of Plassey (1757)" },
			{ letter: "B:", text: "First War of Independence (1857)" },
			{ letter: "C:", text: "Quit India Movement (1942)" },
			{ letter: "D:", text: "India's Independence (1947)" }
		]
	},
	{
		question: "Arrange these Indian monuments from North to South by geographic location:",
		a: "India Gate",
		b: "Taj Mahal",
		c: "Charminar",
		d: "Meenakshi Temple",
		order: [
			{ letter: "A:", text: "India Gate (New Delhi)" },
			{ letter: "B:", text: "Taj Mahal (Agra)" },
			{ letter: "C:", text: "Charminar (Hyderabad)" },
			{ letter: "D:", text: "Meenakshi Temple (Madurai)" }
		]
	},
	{
		question: "Starting with the closest to the Sun, arrange these planets in order of orbital distance:",
		a: "Earth",
		b: "Venus",
		c: "Mercury",
		d: "Mars",
		order: [
			{ letter: "C:", text: "Mercury" },
			{ letter: "B:", text: "Venus" },
			{ letter: "A:", text: "Earth" },
			{ letter: "D:", text: "Mars" }
		]
	},
	{
		question: "Starting from the smallest, arrange these units of computer digital storage in ascending order:",
		a: "Gigabyte",
		b: "Kilobyte",
		c: "Terabyte",
		d: "Megabyte",
		order: [
			{ letter: "B:", text: "Kilobyte" },
			{ letter: "D:", text: "Megabyte" },
			{ letter: "A:", text: "Gigabyte" },
			{ letter: "C:", text: "Terabyte" }
		]
	}
];

function prepareFastestFingerQuestion(){
	var q = fastestFingerQuestionsList[Math.floor(Math.random() * fastestFingerQuestionsList.length)];
	window.GameVariables.CurrentFastestFingerQ = q;

	// Populate question strap
	$('.questionTd').html(q.question);
	$('#answerA .answerP').html(q.a);
	$('#answerB .answerP').html(q.b);
	$('#answerC .answerP').html(q.c);
	$('#answerD .answerP').html(q.d);

	// Populate reveal answer tree
	$('.fastestFingerTreeQuestionP').html(q.question);
	for(var i = 0; i < 4; i++){
		var item = q.order[i];
		var orderDiv = '#fastestAnswerOrder' + (i + 1);
		$(orderDiv + ' .fastestTreeLetterP').html(item.letter);
		$(orderDiv + ' .fastestTreeAnswerP').html(item.text);
	}
}

function activateFastestFinger(){
	try { stopGeneralSound(); } catch(e){}
	try { stopLongPassiveSound(); } catch(e){}
	try { stopShortPassiveSound(); } catch(e){}

	window.GameVariables.IsPlayingFasestFinger = true;
	window.GameVariables.FastestFingerSequenceCounter = 0;
	window.GameVariables.RevealFastestFingerContestantCounter = 0;
	window.GameVariables.FastestFingerRevealAnswerCounter = 0;
	window.GameVariables.RevealFastestFingerWinnersCounter = 0;
	window.GameVariables.IsLogoShowing = false;
	window.GameVariables.IsInCommercial = false;
	window.GameVariables.QuestionInProgress = false;
	window.GameVariables.IsMoneyTreeShowing = false;

	getContestantsForGame();
	prepareFastestFingerQuestion();

	hideMillionaireLogo();
	hideLevelStrap();
	hideQuestionAndAnswerStraps();
	hideTotalPrizeMoneyStrap();
	hideFastestFingerContestants();
	hideFastestFingerAnswerTree();
	hideTheFastestFingerWinner();
	hideContestantNameAndLocation();

	if(typeof showToastNotification === 'function'){
		showToastNotification("⚡ Fastest Finger First Activated! Click [Step FFF] or press [←] to reveal contestants (Step 1/28)");
	}
}

function stepFastestFinger(){
	if(!window.GameVariables.IsPlayingFasestFinger){
		activateFastestFinger();
	} else {
		// Trigger left arrow event to step through sequence
		$(document).trigger($.Event('keydown', { keyCode: 37 }));
	}
}