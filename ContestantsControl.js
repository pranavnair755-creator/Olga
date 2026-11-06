function getContestantsForGame(){
	var sampleContestants = [
		{ firstName: "Rajesh", lastName: "Sharma", location: "Mumbai" },
		{ firstName: "Pooja", lastName: "Patel", location: "Ahmedabad" },
		{ firstName: "Amit", lastName: "Verma", location: "New Delhi" },
		{ firstName: "Sneha", lastName: "Reddy", location: "Hyderabad" },
		{ firstName: "Vikram", lastName: "Malhotra", location: "Bengaluru" },
		{ firstName: "Ananya", lastName: "Sen", location: "Kolkata" },
		{ firstName: "Rohan", lastName: "Gupta", location: "Lucknow" },
		{ firstName: "Meera", lastName: "Nair", location: "Kochi" },
		{ firstName: "Karan", lastName: "Singh", location: "Chandigarh" },
		{ firstName: "Divya", lastName: "Iyer", location: "Chennai" }
	];

	window.GameVariables.FastestFingerContestants = [];
	for(var i = 0; i < 10; i++){
		var data = sampleContestants[i] || { firstName: "Contestant", lastName: String(i + 1), location: "India" };
		var contestant = new Contestant(data.firstName, data.lastName, data.location);
		window.GameVariables.FastestFingerContestants.push(contestant);
		
		var targetId = '#fastestContestant' + (i + 1);
		$(targetId + ' .fastestContestantNameP').html(contestant.FirstName + ' ' + contestant.LastName);
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