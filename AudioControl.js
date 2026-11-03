var blockedAudios = [];
var audioUnlocked = false;

function unlockAudioEngine(){
	audioUnlocked = true;
	// Resume Web Audio Context if present
	try {
		var AudioContext = window.AudioContext || window.webkitAudioContext;
		if (AudioContext) {
			if (!window._globalAudioCtx) {
				window._globalAudioCtx = new AudioContext();
			}
			if (window._globalAudioCtx.state === 'suspended') {
				window._globalAudioCtx.resume();
			}
		}
	} catch(e) {}

	// Play any blocked audios that were waiting for a user gesture
	while(blockedAudios.length > 0){
		var a = blockedAudios.shift();
		if(a){
			try {
				a.play().catch(function(err){
					console.warn('Playback error after unlock:', err);
				});
			} catch(e){}
		}
	}

	// Hide sound enable hint if visible
	var hint = document.getElementById('soundEnableHint');
	if (hint) {
		hint.style.display = 'none';
	}
}

// Attach user gesture listeners
if (typeof window !== 'undefined') {
	['click', 'keydown', 'pointerdown', 'touchstart'].forEach(function(evt){
		window.addEventListener(evt, function(){
			unlockAudioEngine();
		}, { passive: true });
	});
}

function safePlay(audio){
	if(!audio) return;
	try{
		audio.volume = 1.0;
		var p = audio.play();
		if(p && typeof p.catch === 'function'){
			p.catch(function(e){
				// Browser autoplay restriction: queue until user clicks or presses a key
				if(blockedAudios.indexOf(audio) === -1){
					blockedAudios.push(audio);
				}
				var hint = document.getElementById('soundEnableHint');
				if (hint) {
					hint.style.display = 'flex';
				}
			});
		}
	}catch(e){
		console.warn('safePlay error:', e);
	}
}

/* Stop the long active sound */
function stopLongActiveSound(){
	try{
		if(window.GameVariables && window.GameVariables.LongActiveSound && window.GameVariables.RelieveActiveSound == false){
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
		safePlay(window.GameVariables.LongActiveSound);
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
		if(window.GameVariables && window.GameVariables.LongPassiveSound){
			window.GameVariables.LongPassiveSound.pause();
		}
	}
	catch(e){
		console.log(e);
	}
}

function fadeOutLongPassiveSound(vol){
	if(!window.GameVariables || !window.GameVariables.LongPassiveSound) return;
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
function startLongPassiveSound(filename, loop){
	try{
		stopLongPassiveSound();
		window.GameVariables.LongPassiveSound = new Audio("Sounds/" + filename);
		if(loop !== false){
			window.GameVariables.LongPassiveSound.loop = true;
		}
		safePlay(window.GameVariables.LongPassiveSound);
	}
	catch(e){
		console.log(e);
	}
}

/**********************************************************************************************************/
/* Stop the short active sound */
function stopShortActiveSound(){
	try{
		if(window.GameVariables && window.GameVariables.ShortActiveSound){
			window.GameVariables.ShortActiveSound.pause();
		}
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
		safePlay(window.GameVariables.ShortActiveSound);
	}
	catch(e){
		console.log(e);
	}
}

/**********************************************************************************************************/
/* Stop the short passive sound */
function stopShortPassiveSound(){
	try{
		if(window.GameVariables && window.GameVariables.ShortPassiveSound){
			window.GameVariables.ShortPassiveSound.pause();
		}
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
		safePlay(window.GameVariables.ShortPassiveSound);
	}
	catch(e){
		console.log(e);
	}
}

/**********************************************************************************************************/
/* Stop the lifeline active sound */
function stopLifelineActiveSound(){
	try{
		if(window.GameVariables && window.GameVariables.LifelineActiveSound){
			window.GameVariables.LifelineActiveSound.pause();
		}
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
		safePlay(window.GameVariables.LifelineActiveSound);
	}
	catch(e){
		console.log(e);
	}
}

/**********************************************************************************************************/
/* Stop the lifeline passive sound */
function stopLifelinePassiveSound(){
	try{
		if(window.GameVariables && window.GameVariables.LifelinePassiveSound){
			window.GameVariables.LifelinePassiveSound.pause();
		}
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
		safePlay(window.GameVariables.LifelinePassiveSound);
	}
	catch(e){
		console.log(e);
	}
}

/**********************************************************************************************************/
/* Start the general sound with the specified filename */
function startGeneralSound(filename, loop){
	try{
		if(window.GameVariables && window.GameVariables.GeneralSound){
			try { window.GameVariables.GeneralSound.pause(); } catch(e){}
		}
		window.GameVariables.GeneralSound = new Audio("Sounds/" + filename);
		if(loop === true){
			window.GameVariables.GeneralSound.loop = true;
		}
		safePlay(window.GameVariables.GeneralSound);
	}
	catch(e){
		console.log(e);
	}
}
