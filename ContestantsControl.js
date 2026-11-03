function getContestantsForGame(){
	for(var i = 0; i < 10; i++){
		var contestant = new Contestant("Contestant", (i + 1), "n/a");
		window.GameVariables.FastestFingerContestants.push(contestant);
		
		var targetId = '#fastestContestant' + (i + 1);
		$(targetId + ' .fastestContestantNameP').html(window.GameVariables.FastestFingerContestants[i].FirstName + ' ' + window.GameVariables.FastestFingerContestants[i].LastName)
	}
}

function Contestant(firstName, lastName, location){
	this.FirstName = firstName;
	this.LastName = lastName;
	this.Location = location;
}

function showNameStrap(){
	$('.contestantNameAndLocationDiv').css('opacity', 1);
}

function hideNameStrap(){
	$('.contestantNameAndLocationDiv').css('opacity', 0);
}