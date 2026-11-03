let seconds = 0;
let milliseconds = 0;
let timerBottomBarMilliseconds = 0;
let timerBarSeconds = 0;
let timerBarMilliSeconds = 0;
let timerBottomBarLength = seconds;
let tierSetting = 0;
let timerInterval;
let timerBarInterval;
let timerBottomBarInterval;

function countTimer(){
	if(milliseconds < 1){
		subtractSecond();
		milliseconds = 99.5;
	}
	else{
		subtractMilliSecond();
		timerBarUpdate();
	}
}

function countBarFrame(){
	if(timerBarMilliSeconds < 1){
		subtractTimerBarSecond();
		setTimerBarMilliSeconds();
	}
	else{
		subtractTimerBarMilliSecond();
	}
}

function countBottomBarLength(){
	let progressPercentage = (0 - (timerBottomBarLength / timerBottomBarMilliseconds)) * 101;
	document.querySelector('.timerBarFillDiv').style.scale = progressPercentage + '% 1';
}

function subtractMilliSecond(){
	milliseconds -= 1;
	timerBottomBarLength -= 1;
}

function subtractSecond(){
	if(seconds < 2){
		clearInterval(timerInterval);
		$('.timerSecondsDiv>span').text(new Intl.NumberFormat('en', { numberingSystem: window.GameVariables.TimerNumberingSystem }).format(0));
		$('#timerBar59Img').css('opacity', 0);
		$('#timerBar60Img').css('opacity', 1);
		document.querySelector('.timerBarFillDiv').style.scale = '100% 1';
		stopLifelineActiveSound();
		startGeneralSound("time_up.mp3");
		fadeOutLongPassiveSound(1);
		window.GameVariables.IsWalkingAway = true;
		window.GameVariables.QuestionSequenceCounter = 10;
	}
	else{
		$('.timerSecondsDiv>span').text(new Intl.NumberFormat('en', { numberingSystem: window.GameVariables.TimerNumberingSystem }).format(seconds -= 1));
	}
}

function subtractTimerBarMilliSecond(){
	timerBarMilliSeconds -= 1;
}

function subtractTimerBarSecond(){
	if(timerBarSeconds < 1){
		clearInterval(timerBarInterval);
	}
	else{
		timerBarSeconds -= 1;
	}
}

function startTimer(){
	timerInterval = setInterval(function (){
		countTimer();
	}, 10);
	timerBarInterval = setInterval(function (){
		countBarFrame();
	}, 10);
	timerBottomBarInterval = setInterval(function (){
		countBottomBarLength();
	}, 10);
	startLifelineActiveSound("timer_bed.mp3");
	window.GameVariables.TimerPaused = false;
}

function pauseTimer(){
	clearInterval(timerInterval);
	clearInterval(timerBarInterval);
	clearInterval(timerBottomBarInterval);
	stopLifelineActiveSound();
	window.GameVariables.TimerPaused = true;
}

function hideTimer(){
	$('.timerStrapDiv').transition({perspective:0, opacity: 0}, 0);
}

function showTimer(){
	$('.timerStrapDiv').transition({perspective:0, opacity: 1}, 0);
}

function slideTimerDown(){
	$('.timerStrapDiv').transition({perspective:0, 'bottom':'269px'}, 125, 'linear');
}

function slideTimerUp(){
	$('.timerStrapDiv').transition({perspective:0, 'bottom':'399px'}, 125, 'linear');
}

function resetTimer(){
	milliseconds = 99.5;
	timerBarSeconds = 60;
	timerBottomBarLength = 0;
	document.querySelector('.timerBarFillDiv').style.scale = '0% 1';
	$('#timerBar60Img').css('opacity', 0);
	$('#timerBar59Img').css('opacity', 0);
	$('#timerBar58Img').css('opacity', 0);
	$('#timerBar57Img').css('opacity', 0);
	$('#timerBar56Img').css('opacity', 0);
	$('#timerBar55Img').css('opacity', 0);
	$('#timerBar54Img').css('opacity', 0);
	$('#timerBar53Img').css('opacity', 0);
	$('#timerBar52Img').css('opacity', 0);
	$('#timerBar51Img').css('opacity', 0);
	$('#timerBar50Img').css('opacity', 0);
	$('#timerBar49Img').css('opacity', 0);
	$('#timerBar48Img').css('opacity', 0);
	$('#timerBar47Img').css('opacity', 0);
	$('#timerBar46Img').css('opacity', 0);
	$('#timerBar45Img').css('opacity', 0);
	$('#timerBar44Img').css('opacity', 0);
	$('#timerBar43Img').css('opacity', 0);
	$('#timerBar42Img').css('opacity', 0);
	$('#timerBar41Img').css('opacity', 0);
	$('#timerBar40Img').css('opacity', 0);
	$('#timerBar39Img').css('opacity', 0);
	$('#timerBar38Img').css('opacity', 0);
	$('#timerBar37Img').css('opacity', 0);
	$('#timerBar36Img').css('opacity', 0);
	$('#timerBar35Img').css('opacity', 0);
	$('#timerBar34Img').css('opacity', 0);
	$('#timerBar33Img').css('opacity', 0);
	$('#timerBar32Img').css('opacity', 0);
	$('#timerBar31Img').css('opacity', 0);
	$('#timerBar30Img').css('opacity', 0);
	$('#timerBar29Img').css('opacity', 0);
	$('#timerBar28Img').css('opacity', 0);
	$('#timerBar27Img').css('opacity', 0);
	$('#timerBar26Img').css('opacity', 0);
	$('#timerBar25Img').css('opacity', 0);
	$('#timerBar24Img').css('opacity', 0);
	$('#timerBar23Img').css('opacity', 0);
	$('#timerBar22Img').css('opacity', 0);
	$('#timerBar21Img').css('opacity', 0);
	$('#timerBar20Img').css('opacity', 0);
	$('#timerBar19Img').css('opacity', 0);
	$('#timerBar18Img').css('opacity', 0);
	$('#timerBar17Img').css('opacity', 0);
	$('#timerBar16Img').css('opacity', 0);
	$('#timerBar15Img').css('opacity', 0);
	$('#timerBar14Img').css('opacity', 0);
	$('#timerBar13Img').css('opacity', 0);
	$('#timerBar12Img').css('opacity', 0);
	$('#timerBar11Img').css('opacity', 0);
	$('#timerBar10Img').css('opacity', 0);
	$('#timerBar9Img').css('opacity', 0);
	$('#timerBar8Img').css('opacity', 0);
	$('#timerBar7Img').css('opacity', 0);
	$('#timerBar6Img').css('opacity', 0);
	$('#timerBar5Img').css('opacity', 0);
	$('#timerBar4Img').css('opacity', 0);
	$('#timerBar3Img').css('opacity', 0);
	$('#timerBar2Img').css('opacity', 0);
	$('#timerBar1Img').css('opacity', 0);
}

function timerBarUpdate(){
	if(timerBarSeconds == 0){
		$('#timerBar60Img').css('opacity', 1);
		$('#timerBar59Img').css('opacity', 0);
	}
	else if(timerBarSeconds == 1){
		$('#timerBar59Img').css('opacity', 1);
		$('#timerBar58Img').css('opacity', 0);
	}
	else if(timerBarSeconds == 2){
		$('#timerBar58Img').css('opacity', 1);
		$('#timerBar57Img').css('opacity', 0);
	}
	else if(timerBarSeconds == 3){
		$('#timerBar57Img').css('opacity', 1);
		$('#timerBar56Img').css('opacity', 0);
	}
	else if(timerBarSeconds == 4){
		$('#timerBar56Img').css('opacity', 1);
		$('#timerBar55Img').css('opacity', 0);
	}
	else if(timerBarSeconds == 5){
		$('#timerBar55Img').css('opacity', 1);
		$('#timerBar54Img').css('opacity', 0);
	}
	else if(timerBarSeconds == 6){
		$('#timerBar54Img').css('opacity', 1);
		$('#timerBar53Img').css('opacity', 0);
	}
	else if(timerBarSeconds == 7){
		$('#timerBar53Img').css('opacity', 1);
		$('#timerBar52Img').css('opacity', 0);
	}
	else if(timerBarSeconds == 8){
		$('#timerBar52Img').css('opacity', 1);
		$('#timerBar51Img').css('opacity', 0);
	}
	else if(timerBarSeconds == 9){
		$('#timerBar51Img').css('opacity', 1);
		$('#timerBar50Img').css('opacity', 0);
	}
	else if(timerBarSeconds == 10){
		$('#timerBar50Img').css('opacity', 1);
		$('#timerBar49Img').css('opacity', 0);
	}
	else if(timerBarSeconds == 11){
		$('#timerBar49Img').css('opacity', 1);
		$('#timerBar48Img').css('opacity', 0);
	}
	else if(timerBarSeconds == 12){
		$('#timerBar48Img').css('opacity', 1);
		$('#timerBar47Img').css('opacity', 0);
	}
	else if(timerBarSeconds == 13){
		$('#timerBar47Img').css('opacity', 1);
		$('#timerBar46Img').css('opacity', 0);
	}
	else if(timerBarSeconds == 14){
		$('#timerBar46Img').css('opacity', 1);
		$('#timerBar45Img').css('opacity', 0);
	}
	else if(timerBarSeconds == 15){
		$('#timerBar45Img').css('opacity', 1);
		$('#timerBar44Img').css('opacity', 0);
	}
	else if(timerBarSeconds == 16){
		$('#timerBar44Img').css('opacity', 1);
		$('#timerBar43Img').css('opacity', 0);
	}
	else if(timerBarSeconds == 17){
		$('#timerBar43Img').css('opacity', 1);
		$('#timerBar42Img').css('opacity', 0);
	}
	else if(timerBarSeconds == 18){
		$('#timerBar42Img').css('opacity', 1);
		$('#timerBar41Img').css('opacity', 0);
	}
	else if(timerBarSeconds == 19){
		$('#timerBar41Img').css('opacity', 1);
		$('#timerBar40Img').css('opacity', 0);
	}
	else if(timerBarSeconds == 20){
		$('#timerBar40Img').css('opacity', 1);
		$('#timerBar39Img').css('opacity', 0);
	}
	else if(timerBarSeconds == 21){
		$('#timerBar39Img').css('opacity', 1);
		$('#timerBar38Img').css('opacity', 0);
	}
	else if(timerBarSeconds == 22){
		$('#timerBar38Img').css('opacity', 1);
		$('#timerBar37Img').css('opacity', 0);
	}
	else if(timerBarSeconds == 23){
		$('#timerBar37Img').css('opacity', 1);
		$('#timerBar36Img').css('opacity', 0);
	}
	else if(timerBarSeconds == 24){
		$('#timerBar36Img').css('opacity', 1);
		$('#timerBar35Img').css('opacity', 0);
	}
	else if(timerBarSeconds == 25){
		$('#timerBar35Img').css('opacity', 1);
		$('#timerBar34Img').css('opacity', 0);
	}
	else if(timerBarSeconds == 26){
		$('#timerBar34Img').css('opacity', 1);
		$('#timerBar33Img').css('opacity', 0);
	}
	else if(timerBarSeconds == 27){
		$('#timerBar33Img').css('opacity', 1);
		$('#timerBar32Img').css('opacity', 0);
	}
	else if(timerBarSeconds == 28){
		$('#timerBar32Img').css('opacity', 1);
		$('#timerBar31Img').css('opacity', 0);
	}
	else if(timerBarSeconds == 29){
		$('#timerBar31Img').css('opacity', 1);
		$('#timerBar30Img').css('opacity', 0);
	}
	else if(timerBarSeconds == 30){
		$('#timerBar30Img').css('opacity', 1);
		$('#timerBar29Img').css('opacity', 0);
	}
	else if(timerBarSeconds == 31){
		$('#timerBar29Img').css('opacity', 1);
		$('#timerBar28Img').css('opacity', 0);
	}
	else if(timerBarSeconds == 32){
		$('#timerBar28Img').css('opacity', 1);
		$('#timerBar27Img').css('opacity', 0);
	}
	else if(timerBarSeconds == 33){
		$('#timerBar27Img').css('opacity', 1);
		$('#timerBar26Img').css('opacity', 0);
	}
	else if(timerBarSeconds == 34){
		$('#timerBar26Img').css('opacity', 1);
		$('#timerBar25Img').css('opacity', 0);
	}
	else if(timerBarSeconds == 35){
		$('#timerBar25Img').css('opacity', 1);
		$('#timerBar24Img').css('opacity', 0);
	}
	else if(timerBarSeconds == 36){
		$('#timerBar24Img').css('opacity', 1);
		$('#timerBar23Img').css('opacity', 0);
	}
	else if(timerBarSeconds == 37){
		$('#timerBar23Img').css('opacity', 1);
		$('#timerBar22Img').css('opacity', 0);
	}
	else if(timerBarSeconds == 38){
		$('#timerBar22Img').css('opacity', 1);
		$('#timerBar21Img').css('opacity', 0);
	}
	else if(timerBarSeconds == 39){
		$('#timerBar21Img').css('opacity', 1);
		$('#timerBar20Img').css('opacity', 0);
	}
	else if(timerBarSeconds == 40){
		$('#timerBar20Img').css('opacity', 1);
		$('#timerBar19Img').css('opacity', 0);
	}
	else if(timerBarSeconds == 41){
		$('#timerBar19Img').css('opacity', 1);
		$('#timerBar18Img').css('opacity', 0);
	}
	else if(timerBarSeconds == 42){
		$('#timerBar18Img').css('opacity', 1);
		$('#timerBar17Img').css('opacity', 0);
	}
	else if(timerBarSeconds == 43){
		$('#timerBar17Img').css('opacity', 1);
		$('#timerBar16Img').css('opacity', 0);
	}
	else if(timerBarSeconds == 44){
		$('#timerBar16Img').css('opacity', 1);
		$('#timerBar15Img').css('opacity', 0);
	}
	else if(timerBarSeconds == 45){
		$('#timerBar15Img').css('opacity', 1);
		$('#timerBar14Img').css('opacity', 0);
	}
	else if(timerBarSeconds == 46){
		$('#timerBar14Img').css('opacity', 1);
		$('#timerBar13Img').css('opacity', 0);
	}
	else if(timerBarSeconds == 47){
		$('#timerBar13Img').css('opacity', 1);
		$('#timerBar12Img').css('opacity', 0);
	}
	else if(timerBarSeconds == 48){
		$('#timerBar12Img').css('opacity', 1);
		$('#timerBar11Img').css('opacity', 0);
	}
	else if(timerBarSeconds == 49){
		$('#timerBar11Img').css('opacity', 1);
		$('#timerBar10Img').css('opacity', 0);
	}
	else if(timerBarSeconds == 50){
		$('#timerBar10Img').css('opacity', 1);
		$('#timerBar9Img').css('opacity', 0);
	}
	else if(timerBarSeconds == 51){
		$('#timerBar9Img').css('opacity', 1);
		$('#timerBar8Img').css('opacity', 0);
	}
	else if(timerBarSeconds == 52){
		$('#timerBar8Img').css('opacity', 1);
		$('#timerBar7Img').css('opacity', 0);
	}
	else if(timerBarSeconds == 53){
		$('#timerBar7Img').css('opacity', 1);
		$('#timerBar6Img').css('opacity', 0);
	}
	else if(timerBarSeconds == 54){
		$('#timerBar6Img').css('opacity', 1);
		$('#timerBar5Img').css('opacity', 0);
	}
	else if(timerBarSeconds == 55){
		$('#timerBar5Img').css('opacity', 1);
		$('#timerBar4Img').css('opacity', 0);
	}
	else if(timerBarSeconds == 56){
		$('#timerBar4Img').css('opacity', 1);
		$('#timerBar3Img').css('opacity', 0);
	}
	else if(timerBarSeconds == 57){
		$('#timerBar3Img').css('opacity', 1);
		$('#timerBar2Img').css('opacity', 0);
	}
	else if(timerBarSeconds == 58){
		$('#timerBar2Img').css('opacity', 1);
		$('#timerBar1Img').css('opacity', 0);
	}
	else if(timerBarSeconds == 59){
		$('#timerBar1Img').css('opacity', 1);
	}
}

function tier1Timer(){
	$('.timerSecondsDiv>span').text(new Intl.NumberFormat('en', { numberingSystem: window.GameVariables.TimerNumberingSystem }).format(15));
	seconds = 15;
	tierSetting = 1;
	resetTimer();
	setTimerBarMilliSeconds();
}

function tier2Timer(){
	$('.timerSecondsDiv>span').text(new Intl.NumberFormat('en', { numberingSystem: window.GameVariables.TimerNumberingSystem }).format(30));
	seconds = 30;
	tierSetting = 2;
	resetTimer();
	setTimerBarMilliSeconds();
}

function tier3Timer(){
	$('.timerSecondsDiv>span').text(new Intl.NumberFormat('en', { numberingSystem: window.GameVariables.TimerNumberingSystem }).format(45));
	seconds = 45;
	tierSetting = 3;
	resetTimer();
	setTimerBarMilliSeconds();
}

function tier4Timer(){
	$('.timerSecondsDiv>span').text(new Intl.NumberFormat('en', { numberingSystem: window.GameVariables.TimerNumberingSystem }).format(60));
	seconds = 60;
	tierSetting = 4;
	resetTimer();
	setTimerBarMilliSeconds();
}

function setTimerBarMilliSeconds(){
	if(tierSetting == 1){
		timerBarMilliSeconds = 24.9;/* 25 - 0.1 */
		timerBottomBarMilliseconds = 1500;
	}
	else if(tierSetting == 2){
		timerBarMilliSeconds = 49.9;/* 50 - 0.1 */
		timerBottomBarMilliseconds = 3000;
	}
	else if(tierSetting == 3){
		timerBarMilliSeconds = 74.9;/* 75 - 0.1 */
		timerBottomBarMilliseconds = 4500;
	}
	else if(tierSetting == 4){
		timerBarMilliSeconds = 99.9;/* 100 - 0.1 */
		timerBottomBarMilliseconds = 6000;
	}
	else{
		timerBarMilliSeconds = 0;
		timerBottomBarMilliseconds = 0;
	}
}