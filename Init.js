$(document).ready(function(){
	init();
});

function init(){
	/* ***DO NOT TAMPER WITH ANYTHING IS THIS FILE UNLESS YOU KNOW WHAT IT DOES OR IS DOING!*** */
	getContestantsForGame();
	renderMoneyTreeTable();
	setStartingQuestionLevel(window.GameVariables.StartingQuestionLevel);
	setLevelOnMoneyTree(window.GameVariables.QuestionLevel);
	
	if(window.GameVariables.displaySecondsAndTimerBar == true){
		document.querySelector('.timerBaseDiv').style.opacity = 1;
	}
	else{
		document.querySelector('.timerBaseDiv').style.opacity = 0;
	}
	
	$('.totalPrizeMoneyWonDiv').html(accounting.formatMoney(window.GameVariables.PrizeAmounts[window.GameVariables.QuestionLevel - 2] || 0, "$", 0));
	
	/* Set initial transitions on certain elements */
	$('.answerStrapLifeLineCenterContainerDiv').transition({perspective:0, scale:[0.2, 0.2], opacity:0}, 1);
	$('#logoBeam1Img').transition({perspective:0, rotate:"-=11.25"}, 1, 'linear');
	
	getAllQuestionsForGame();
	showMillionaireLogo();
	
	if(window.GameVariables.IsPAFLifeLineUsed == true){
		pafLifeLineDisable();
	}
	
	if(window.GameVariables.IsFFLifeLineUsed == true){
		ffLifeLineDisable();
	}
	
	if(window.GameVariables.IsATALifeLineUsed == true){
		ataLifeLineDisable();
	}
	
	if(window.GameVariables.IsSTQLifeLineUsed == true || window.GameVariables.IsSTQLifeLineActiveAtStart == true){
		stqLifeLineSlideIn();
		stqLifeLineDisable();
		setQuestion(true);
	}
	else if(window.GameVariables.QuestionLevel >= window.GameVariables.STQUnlockedLevel){
		stqLifeLineSlideIn();
	}
	
	if(window.GameVariables.ContestantFirstName != ""){
		$('.contestantNameAndLocationDiv .contestantNameP').html(window.GameVariables.ContestantFirstName + " " + window.GameVariables.ContestantLastName);
		$('.contestantNameAndLocationDiv .contestantLocationP').html(window.GameVariables.ContestantLocation);
		$('.millionaireWinnerNameDiv').html(window.GameVariables.ContestantFirstName + " " + window.GameVariables.ContestantLastName);
	}
	
	$('.totalPrizeDiv').html(window.GameVariables.TotalPrizeText);
	$('.millionaireWinnerDiv').html(window.GameVariables.MillionaireText);
	$('.pafClockTimeDiv>span').html(new Intl.NumberFormat('en', { numberingSystem: window.GameVariables.PaFNumberingSystem }).format(30));
	
	document.querySelector('.moneyTreeTable').style.scale = window.GameVariables.TreeScale + '% 100%';
	$('.moneyTreeAmountTd').css({'background-position-x':window.GameVariables.TreeBackgroundPosition});
	$('.moneyTreeAmountWhiteTd').css({'background-position-x':window.GameVariables.TreeBackgroundPosition});
	document.querySelector('.winningsP').style.scale = window.GameVariables.WinTextScale + '% 100%';
	document.querySelector('.totalPrizeMoneyWonDiv').style.scale = window.GameVariables.TPMTextScale + '% 100%';
	
	pafPulseLifeLine();
	
	startGeneralSound("main_theme.mp3", true);
}

function QuestionAndAnswer(){
	this.Category = null;
	this.Question = null;
	this.AnswerA = null;
	this.AnswerB = null;
	this.AnswerC = null;
	this.AnswerD = null;
	this.CorrectAnswer = null;
	this.ImageUrl = null;
}

function setStartingQuestionLevel(level){
	window.GameVariables.QuestionLevel = level;
}

function getAllQuestionsForGame(){
	var initRunId = window.GameVariables.SoloRunId;
	fetchAndLoadQuestions(function(){
		if(window.GameVariables.SoloRunId === initRunId && (!window.TournamentEngine || !window.TournamentEngine.isActive)){
			setQuestion(false);
		}
	});
}

function fetchAndLoadQuestions(callback){
	var isTenQ = !!(window.GameVariables && ((window.GameVariables.PrizeAmounts && window.GameVariables.PrizeAmounts.length === 10) || window.GameVariables.IsTenQuestionFormat));
	$.ajax({
		type: "POST",
		url: "/api/generate-questions?t=" + new Date().getTime(),
		contentType: "application/json; charset=utf-8",
		data: JSON.stringify({
			mode: isTenQ ? "tournament_finale" : "solo",
			format: isTenQ ? "10q" : "15q",
			difficulty: isTenQ ? "hard" : "standard",
			roundId: Date.now()
		}),
		dataType: "json",
		success: function(data){
			if(data && Array.isArray(data.questions) && data.questions.length >= 10){
				window.GameVariables.QuestionsAndAnswers = data.questions.map(function(q){
					var qAndA = new QuestionAndAnswer();
					qAndA.Category = q.category || "General Knowledge";
					qAndA.Question = (q.question || "").replace(/\\n/g, "<br />");
					qAndA.AnswerA = q.a || "";
					qAndA.AnswerB = q.b || "";
					qAndA.AnswerC = q.c || "";
					qAndA.AnswerD = q.d || "";
					qAndA.CorrectAnswer = (q.correct || "a").toLowerCase();
					qAndA.ImageUrl = q.imageUrl || null;
					return qAndA;
				});

				if(Array.isArray(data.switchQuestions) && data.switchQuestions.length >= 15){
					window.GameVariables.SwitchQuestionsAndAnswers = data.switchQuestions.map(function(q){
						var qAndA = new QuestionAndAnswer();
						qAndA.Category = q.category || "General Knowledge";
						qAndA.Question = (q.question || "").replace(/\\n/g, "<br />");
						qAndA.AnswerA = q.a || "";
						qAndA.AnswerB = q.b || "";
						qAndA.AnswerC = q.c || "";
						qAndA.AnswerD = q.d || "";
						qAndA.CorrectAnswer = (q.correct || "a").toLowerCase();
						qAndA.ImageUrl = q.imageUrl || null;
						return qAndA;
					});
				}
			} else {
				getAllQuestionsFromXmlFallback();
			}
			if(typeof callback === 'function') callback();
		},
		error: function(){
			getAllQuestionsFromXmlFallback();
			if(typeof callback === 'function') callback();
		}
	});
}

function getAllQuestionsFromXmlFallback(){
	$.ajax({
        type: "GET",
        url: "Questions/questions.xml",
        dataType: "xml",
		async: false,
        success: function(xml) {
			window.GameVariables.QuestionsAndAnswers = [];
			$(xml).find('question').each(function(){
				var qAndA = new QuestionAndAnswer();
				qAndA.Category = $(this).find('category')[0].textContent;
				qAndA.Question = $(this).find('text')[0].textContent.replace("++++","<br />");
				qAndA.AnswerA = $(this).find('a')[0].textContent;
				qAndA.AnswerB = $(this).find('b')[0].textContent;
				qAndA.AnswerC = $(this).find('c')[0].textContent;
				qAndA.AnswerD = $(this).find('d')[0].textContent;
				
				if($(this).find('a')[0].attributes[0].value == "yes"){
					qAndA.CorrectAnswer = "a";
				}
				else if($(this).find('b')[0].attributes[0].value == "yes"){
					qAndA.CorrectAnswer = "b";
				}
				else if($(this).find('c')[0].attributes[0].value == "yes"){
					qAndA.CorrectAnswer = "c";
				}
				else if($(this).find('d')[0].attributes[0].value == "yes"){
					qAndA.CorrectAnswer = "d";
				}
				window.GameVariables.QuestionsAndAnswers.push(qAndA);
			});
        }
    });
	
	$.ajax({
        type: "GET",
        url: "Questions/switchQuestions.xml",
        dataType: "xml",
		async: false,
        success: function(xml) {
			window.GameVariables.SwitchQuestionsAndAnswers = [];
			$(xml).find('question').each(function(){
				var qAndA = new QuestionAndAnswer();
				qAndA.Category = $(this).find('category')[0].textContent;
				qAndA.Question = $(this).find('text')[0].textContent.replace("++++","<br />");
				qAndA.AnswerA = $(this).find('a')[0].textContent;
				qAndA.AnswerB = $(this).find('b')[0].textContent;
				qAndA.AnswerC = $(this).find('c')[0].textContent;
				qAndA.AnswerD = $(this).find('d')[0].textContent;
				
				if($(this).find('a')[0].attributes[0].value == "yes"){
					qAndA.CorrectAnswer = "a";
				}
				else if($(this).find('b')[0].attributes[0].value == "yes"){
					qAndA.CorrectAnswer = "b";
				}
				else if($(this).find('c')[0].attributes[0].value == "yes"){
					qAndA.CorrectAnswer = "c";
				}
				else if($(this).find('d')[0].attributes[0].value == "yes"){
					qAndA.CorrectAnswer = "d";
				}
				window.GameVariables.SwitchQuestionsAndAnswers.push(qAndA);
			});
        }
    });
}

function resetAndStartNewGame(onComplete){
	showToastNotification("🔄 Generating brand new questions & resetting game...");
	
	window.GameVariables.SoloRunId = (window.GameVariables.SoloRunId || 0) + 1;
	var resetRunId = window.GameVariables.SoloRunId;

	clearTimeout(window.GameVariables.ShowAnswerTimeout);
	clearTimeout(window.GameVariables.ShowWinnerTimeout);
	clearTimeout(window.GameVariables.ScaleTreeTimeout);
	clearTimeout(window.GameVariables.PAFClockTimeout);
	clearTimeout(window.__ataVoteTimeout);
	clearTimeout(window.__ataDoneTimeout);

	try {
		if(typeof pauseTimer === 'function') pauseTimer();
	} catch(e) {}
	try {
		if(typeof hideTimer === 'function') hideTimer();
	} catch(e) {}
	try {
		if(typeof stopGeneralSound === 'function') stopGeneralSound();
	} catch(e) {}
	try {
		if(typeof stopLongPassiveSound === 'function') stopLongPassiveSound();
	} catch(e) {}
	try {
		if(typeof stopLongActiveSound === 'function') stopLongActiveSound();
	} catch(e) {}
	try {
		if(typeof stopShortActiveSound === 'function') stopShortActiveSound();
	} catch(e) {}
	try {
		if(typeof stopShortPassiveSound === 'function') stopShortPassiveSound();
	} catch(e) {}
	try {
		if(typeof stopLifelineActiveSound === 'function') stopLifelineActiveSound();
	} catch(e) {}
	try {
		if(typeof stopLifelinePassiveSound === 'function') stopLifelinePassiveSound();
	} catch(e) {}
	try {
		if(window.GameVariables && window.GameVariables.GeneralSound) window.GameVariables.GeneralSound.pause();
	} catch(e) {}

	if(window.TournamentEngine && window.TournamentEngine.isActive){
		window.TournamentEngine.exitToSoloMode(false);
	}

	$('#stageWelcomeOverlay').stop(true, true).hide();
	$('.logoContainerDiv').stop(true, true).css({ transition: 'none', opacity: 0 }).hide();
	
	// Reset question levels & game state counters
	window.GameVariables.QuestionLevel = 1;
	window.GameVariables.StartingQuestionLevel = 1;
	window.GameVariables.QuestionSequenceCounter = -1;
	window.GameVariables.MoneyTreeSequenceCounter = 0;
	window.GameVariables.RevealAnswerCounter = 0;
	window.GameVariables.commericalSequenceCounter = 0;
	window.GameVariables.pafLifeLineSequenceCounter = 0;
	window.GameVariables.ataLifeLineSequenceCounter = 0;
	window.GameVariables.stqLifeLineSequenceCounter = 0;
	window.GameVariables.walkAwaySequenceCounter = 0;
	window.GameVariables.IsPlayingFasestFinger = false;
	window.GameVariables.IsLogoShowing = false;
	window.GameVariables.IsWalkingAway = false;
	window.GameVariables.QuestionInProgress = false;
	window.GameVariables.IsInCommercial = false;
	window.GameVariables.IsFirstQuestionOfGame = true;
	window.GameVariables.FirstTierBackgroundSoundPlaying = false;
	window.GameVariables.CannotLockInFinalAnswer = false;
	window.GameVariables.CurrentTargetAnswer = "";
	window.GameVariables.CurrentCorrectAnswer = "";
	window.GameVariables.IsTotalPrizeMoneyShowing = false;
	window.GameVariables.IsLevelStrapShowing = false;

	window.GameVariables.AnswerAIsOut = false;
	window.GameVariables.AnswerBIsOut = false;
	window.GameVariables.AnswerCIsOut = false;
	window.GameVariables.AnswerDIsOut = false;

	// Reset all lifelines
	window.GameVariables.IsPAFLifeLineUsed = false;
	window.GameVariables.IsFFLifeLineUsed = false;
	window.GameVariables.IsATALifeLineUsed = false;
	window.GameVariables.IsSTQLifeLineUsed = false;
	window.GameVariables.IsSTQLifeLineActiveAtStart = false;

	// Reset lifeline visuals & control deck states
	$('.lifelineUsedImg').css('opacity', 0);
	$('.lifelineUsedStrapImg').css('opacity', 0);
	$('#btn5050, #btnPAF, #btnATA').removeClass('btn-used');
	$('.ataGraphDiv').stop(true, true).css('right', '-330px');
	$('.pafClockDiv').stop(true, true).css('right', '-400px');

	// Reset money tree & winnings
	if(typeof slideOutMoneyTree === 'function') slideOutMoneyTree();
	if(typeof stqLifeLineSlideOut === 'function') stqLifeLineSlideOut();
	renderMoneyTreeTable();
	setLevelOnMoneyTree(1);
	$('.totalPrizeMoneyWonDiv').html("$0");
	$('.winningsP').html("$0");
	hideTotalPrizeMoneyStrap();
	hideMillionaireTitleStrap();
	hideLevelStrap();
	hideQuestionAndAnswerStraps();
	resetAnswerStraps();
	hideLifeLineCentered();

	// Fetch fresh questions from backend API
	fetchAndLoadQuestions(function(){
		if(window.GameVariables.SoloRunId !== resetRunId || (window.TournamentEngine && window.TournamentEngine.isActive)){
			return;
		}
		if(typeof window.launchSoloGame === 'function'){
			window.launchSoloGame();
		} else {
			setQuestion(false);
			showToastNotification("✨ New game loaded with fresh questions! Ready for Question 1 ($100)");
		}
		if(typeof onComplete === 'function') onComplete();
	});
}