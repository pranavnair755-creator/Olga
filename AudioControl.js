/* Stop the long active sound */
function stopLongActiveSound(){
	try{
		if(window.GameVariables.RelieveActiveSound == false){
			window.GameVariables.LongActiveSound.pause();
		}
	}
	catch(e){
		console.log(e);
	}
}

/* Start the long active sound with the specified filename */
function startLongActiveSound(filename){
	try{
		stopLongActiveSound();
		window.GameVariables.LongActiveSound = new Audio("Sounds/" + filename);
		window.GameVariables.LongActiveSound.play();
		window.GameVariables.RelieveActiveSound = false;
	}
	catch(e){
		console.log(e);
	}
}
/**********************************************************************************************************/
/* Stop the long passive sound */
function stopLongPassiveSound(){
	try{
		window.GameVariables.LongPassiveSound.pause();
	}
	catch(e){
		console.log(e);
	}
}

function fadeOutLongPassiveSound(vol){
	if(vol < 0.05){
		vol = 0;
	}
	else {
		vol = vol - 0.05;
	}
	
	window.GameVariables.LongPassiveSound.volume = vol;
	
	if(vol > 0){
		setTimeout(function(){
			fadeOutLongPassiveSound(vol);
		}, 50);
	}
	else {
		stopLongPassiveSound();
		window.GameVariables.LongPassiveSound.volume = 0;
	}
}

/* Start the long passive sound with the specified filename */
function startLongPassiveSound(filename){
	try{
		stopLongPassiveSound();
		window.GameVariables.LongPassiveSound = new Audio("Sounds/" + filename);
		window.GameVariables.LongPassiveSound.play();
	}
	catch(e){
		console.log(e);
	}
}
/**********************************************************************************************************/
/* Stop the short active sound */
function stopShortActiveSound(){
	try{
		window.GameVariables.ShortActiveSound.pause();
	}
	catch(e){
		console.log(e);
	}
}

/* Start the short active sound with the specified filename */
function startShortActiveSound(filename){
	try{
		stopShortActiveSound();
		window.GameVariables.ShortActiveSound = new Audio("Sounds/" + filename);
		window.GameVariables.ShortActiveSound.play();
	}
	catch(e){
		console.log(e);
	}
}
/**********************************************************************************************************/
/* Stop the short passive sound */
function stopShortPassiveSound(){
	try{
		window.GameVariables.ShortPassiveSound.pause();
	}
	catch(e){
		console.log(e);
	}
}

/* Start the short passive sound with the specified filename */
function startShortPassiveSound(filename){
	try{
		stopShortPassiveSound();
		window.GameVariables.ShortPassiveSound = new Audio("Sounds/" + filename);
		window.GameVariables.ShortPassiveSound.play();
	}
	catch(e){
		console.log(e);
	}
}
/**********************************************************************************************************/
/* Stop the lifeline active sound */
function stopLifelineActiveSound(){
	try{
		window.GameVariables.LifelineActiveSound.pause();
	}
	catch(e){
		console.log(e);
	}
}

/* Start the lifeline active sound with the specified filename */
function startLifelineActiveSound(filename){
	try{
		stopLifelineActiveSound();
		window.GameVariables.LifelineActiveSound = new Audio("Sounds/" + filename);
		window.GameVariables.LifelineActiveSound.play();
	}
	catch(e){
		console.log(e);
	}
}
/**********************************************************************************************************/
/* Stop the lifeline passive sound */
function stopLifelinePassiveSound(){
	try{
		window.GameVariables.LifelinePassiveSound.pause();
	}
	catch(e){
		console.log(e);
	}
}

/* Start the lifeline passive sound with the specified filename */
function startLifelinePassiveSound(filename){
	try{
		stopLifelinePassiveSound();
		window.GameVariables.LifelinePassiveSound = new Audio("Sounds/" + filename);
		window.GameVariables.LifelinePassiveSound.play();
	}
	catch(e){
		console.log(e);
	}
}
/**********************************************************************************************************/
/* Start the general sound with the specified filename */
function startGeneralSound(filename){
	try{
		window.GameVariables.GeneralSound = new Audio("Sounds/" + filename);
		window.GameVariables.GeneralSound.play();
	}
	catch(e){
		console.log(e);
	}
}
