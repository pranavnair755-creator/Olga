function showAmountWon(){
	var level = window.GameVariables.QuestionLevel || 1;
	var amount = (window.GameVariables.PrizeAmounts && window.GameVariables.PrizeAmounts[level - 1]) ? window.GameVariables.PrizeAmounts[level - 1] : 100;
	var text = amount >= 1000000 ? "$1 MILLION" : ("$" + new Intl.NumberFormat('en-US').format(amount));
	$('.winningsP').html(text);
	$('.totalPrizeMoneyWonDiv').html(text);
	$('.winStrapDiv').css('opacity', 1);
	return text;
}

function hideAmountWon(){
	$('.winStrapDiv').css('opacity', 0);
}

function reduceAmountWon(){
	var level = window.GameVariables.QuestionLevel || 1;
	var amounts = (window.GameVariables && window.GameVariables.PrizeAmounts) ? window.GameVariables.PrizeAmounts : [];
	var q5Safe = amounts[4] || 1000;
	var q10Safe = amounts[9] || 32000;
	var wonText = "$0";
	if(level <= 5){
		wonText = "$0";
	}
	else if(level <= 10){
		wonText = "$" + new Intl.NumberFormat('en-US').format(q5Safe);
	}
	else {
		wonText = "$" + new Intl.NumberFormat('en-US').format(q10Safe);
	}
	$('.totalPrizeMoneyWonDiv').html(wonText);
	$('.winningsP').html(wonText);
	return wonText;
}

function showMillionaireTitleStrap(){
	$('.millionaireWinnerTitleDiv').transition({perspective:0, 'bottom':'0px'}, 500, 'ease-out');
}

function hideMillionaireTitleStrap(){
	$('.millionaireWinnerTitleDiv').transition({perspective:0, 'bottom':'-300px'}, 500, 'ease-in');
}

function showTotalPrizeMoneyStrap(){
	window.GameVariables.IsTotalPrizeMoneyShowing = true;
	$('.totalPrizeMoneyDiv').css({'display': 'block', 'visibility': 'visible'}).transition({perspective:0, 'bottom':'0px'}, 500, 'ease-out');
}

function hideTotalPrizeMoneyStrap(){
	window.GameVariables.IsTotalPrizeMoneyShowing = false;
	$('.totalPrizeMoneyDiv').transition({perspective:0, 'bottom':'-450px'}, 500, 'ease-in');
}