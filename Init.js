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
	
	$('.totalPrizeMoneyWonDiv').html(accounting.formatMoney(window.GameVariables.PrizeAmounts[window.GameVariables.QuestionLevel - 2], "$", 0));
	
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
	
	startGeneralSound("main_theme.mp3");
}

function QuestionAndAnswer(){
	this.Category = null;
	this.Question = null;
	this.AnswerA = null;
	this.AnswerB = null;
	this.AnswerC = null;
	this.AnswerD = null;
	this.CorrectAnswer = null;
}

function setStartingQuestionLevel(level){
	window.GameVariables.QuestionLevel = level;
}

function getAllQuestionsForGame(){
	$.ajax({
        type: "GET",
        url: "Questions/questions.xml",
        dataType: "xml",
		async: false,
        success: function(xml) {
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
			
			/*for(var i = 0; i < 15; i++){
				var targetCategoryP = ".categoryP" + (i+1);
				$(targetCategoryP).html(window.GameVariables.QuestionsCategoriesAndAnswers[i].Category);
			}*/
        },
		error: function(e){
			var error = e;
		}
    });
	
	$.ajax({
        type: "GET",
        url: "Questions/switchQuestions.xml",
        dataType: "xml",
		async: false,
        success: function(xml) {
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
			
			/*for(var i = 0; i < 15; i++){
				var targetCategoryP = ".categoryP" + (i+1);
				$(targetCategoryP).html(window.GameVariables.QuestionsCategoriesAndAnswers[i].Category);
			}*/
        }
    });

	/*
	* The commented out section of code is use to call to a server to obtain a dataset of questions.
	* You must know how to do this own your own. There is no perfect way that I can develope code (nor will I)
	* that obtains your questions for you from a server. If you are unsure on how to do this then you will have to
	* stick with the original method above using XML files.
	*/
	/*$.ajax({
		type: "POST",
		url: "",
		data: data,
		async: true,
		contentType: "application/json; charset=utf-8",
        dataType: "json",
		success: function(response){
			
		},
		error: function(e){
			if(e.message === null || e.message === undefined){
				alert(e.Message);
			}
			else{
				alert(e.message);
			}
		}
	});*/
}