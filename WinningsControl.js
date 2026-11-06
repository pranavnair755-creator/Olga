function showAmountWon(){
	var level = window.GameVariables.QuestionLevel || 1;
	var amount = (window.GameVariables.PrizeAmounts && window.GameVariables.PrizeAmounts[level - 1]) ? window.GameVariables.PrizeAmounts[level - 1] : 1000;
	var text = "Rs. " + (amount >= 10000000 ? "1 CRORE" : new Intl.NumberFormat('en-IN').format(amount));
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
	var wonText = "Rs. 0";
	if(level <= 5){
		wonText = "Rs. 0";
	}
	else if(level <= 10){
		wonText = "Rs. 10,000";
	}
	else {
		wonText = "Rs. 3,20,000";
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