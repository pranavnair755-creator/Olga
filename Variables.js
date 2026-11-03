(function(gameVariables) {
	/* Initialization Variables */
	gameVariables.IsPAFLifeLineUsed = false;
	gameVariables.IsFFLifeLineUsed = false;
	gameVariables.IsATALifeLineUsed = false;
	gameVariables.IsSTQLifeLineUsed = false;
	gameVariables.IsSTQLifeLineActiveAtStart = false;
	gameVariables.IsHintHelpUsed = false;
	gameVariables.HintHelpMessages = [];
	gameVariables.IsHintHelpOpen = false;
	gameVariables.hintHelpSequenceCounter = 0;
	gameVariables.StartingQuestionLevel = 1;
	
	gameVariables.TotalPrizeText = "Total Winnings";
	gameVariables.MillionaireText = "MILLIONAIRE";
	
	gameVariables.ContestantFirstName = "Contestant";
	gameVariables.ContestantLastName = "Name";
	gameVariables.ContestantLocation = "Location";
	
	/* Number Format Settings */
	gameVariables.LocaleCode = "en-IN";				/* Uses the country's locale code to determine the numbering system that the country uses. See the "List of Locales.txt" file for a list of locale codes. */
	gameVariables.FormatOptions = {
		style: "decimal",							/* The formatting style to use. Use code "decimal" for plain number formatting and "currency" for currency formatting. */
		numberingSystem: "latn",					/* The numbering system to be used for the amounts. */
		minimumFractionDigits: 0,					/* Displays the number of Fraction Digits at the end of the amount. */
		maximumFractionDigits: 0,
	};
	gameVariables.ReplaceCharacterBefore = "₹";		/* Targets the exact character that you want to replace. */
	gameVariables.ReplaceCharacterAfter = "Rs. ";	/* Replaces the targeted character with a different one. */
	gameVariables.NumberPrefix = "Rs. ";			/* The text that displays before the amount. */
	gameVariables.NumberSuffix = "";				/* The text that displays after the amount. */
	gameVariables.LevelNumberingSystem = "latn";	/* The numbering system to be used for the question levels. Uses the same numbering system for the amounts. */
	gameVariables.PaFNumberingSystem = "latn";		/* The numbering system to be used for the Phone a Friend timer. Uses the same numbering system for the amounts. */
	gameVariables.AtANumberingSystem = "latn";		/* The numbering system to be used for the Ask the Audience percentages. Uses the same numbering system for the amounts. */
	gameVariables.TimerNumberingSystem = "latin";	/* The numbering system to be used for the question timer. Uses the same numbering system for the amounts. */
	
	gameVariables.UseTopPrizeText = true;			/* If set to true, the top prize amount(s) will be displayed in text instead of a number. */
	gameVariables.TopPrizeQuestionNumber = 15;		/* The value where the top prize text(s) are displayed above the level set by this value. */
	gameVariables.TopPrizeText = ["One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Rs. 1 CRORE"];
	gameVariables.UseTopPrizeLevelStrapText = false;	/* If set to true, the top prize amount shown in the Level Strap will be displayed in text instead of a number. */
	gameVariables.TopPrizeLevelStrapQuestionNumber = 15;	/* The value where the top prize text in the Level Strap is displayed above the level set by this value. */
	gameVariables.TopPrizeLevelStrapText = ["One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Rs. 1 CRORE"];
	gameVariables.UseZeronaireText = false;			/* If set to true, when a contestant walks away with nothing, the Zeronaire text is displayed instead of just 0 and a currency. */
	gameVariables.ZeronaireText = "Nothing";		/* The text that displays when a contestant walks away with nothing. */
	
	gameVariables.TreeScale = 100;					/* DEFAULT: 100%; The percentage of scale on the X axis (left and right) for the money tree. */
	gameVariables.TreeBackgroundPosition = -743;	/* DEFAULT: -743; The position of the background on the X axis (left and right) in pixels that is displayed when the amount from the money tree is highlighted. The maximum position is -485px. */
	gameVariables.WinTextScale = 100;				/* DEFAULT: 100%; The percentage of scale on the X axis (left and right) for the text that shows the amount that the contestant has won. */
	gameVariables.TPMTextScale = 100;				/* DEFAULT: 100%; The percentage of scale on the X axis (left and right) for the text that shows the total prize money. */
	
	/* Timer Settings */
	gameVariables.FirstTierTimer = 1;				/* The amount of seconds for Tier 1 (Questions 1 to 5). */
	gameVariables.SecondTierTimer = 2;				/* The amount of seconds for Tier 2 (Questions 6 to 10). */
	/* 1 = 15 seconds */
	/* 2 = 30 seconds */
	/* 3 = 45 seconds */
	/* 4 = 60 seconds */
	
	gameVariables.displaySecondsAndTimerBar = true;
	/* true = Shows the number of seconds & its timer bar, KBC style */
	/* false = Hides the number of seconds & its timer bar, showing only the bottom bar */
	
	gameVariables.RevealAllAnswersBeforeStartingTimer = true;
	/* true = Pressing the Right Arrow key to start the timer, revealing all four answers. */
	/* false = Pressing the Right Arrow key reveals one answer at a time. The Up Arrow key is used to start the timer after the fourth answer is revealed. */
	
	gameVariables.ReduceAmountAfterTimeUp = false;
	/* true = If the timer runs out, the contestant leaves with the amount won from the safety net. */
	/* false = If the timer runs out, the contestant leaves with the amount won from the previous question. */
	
	/* Do not modify the value of this variable, fastest finger is not fully implemented yet... */
	gameVariables.IsPlayingFasestFinger = false;
	/**************/
	
	/* Boolean Variables */
	gameVariables.IsNameStrapShowing = false;
	gameVariables.IsMoneyTreeShowing = false;
	gameVariables.IsLogoShowing = false;
	gameVariables.IsExplainingRules = true;
	gameVariables.IsFirstQuestionOfGame = true;
	gameVariables.IsInCommercial = true;
	gameVariables.IsLevelStrapShowing = false;
	gameVariables.IsLifeLineStrapShowing = false;
	gameVariables.IsTotalPrizeMoneyShowing = false;
	gameVariables.IsWalkingAway = false;
	gameVariables.CannotLockInFinalAnswer = false;
	gameVariables.QuestionInProgress = false;
	gameVariables.ContinuePulsingLifeLineCenter = false;
	gameVariables.AnswerAIsOut = false;
	gameVariables.AnswerBIsOut = false;
	gameVariables.AnswerCIsOut = false;
	gameVariables.AnswerDIsOut = false;
	gameVariables.ShowLifeLineCenteredAnimation = false;
	gameVariables.FirstTierBackgroundSoundPlaying = false;
	gameVariables.TimerPaused = true;
	gameVariables.TimerReady = false;

	/* Number Variables */
	gameVariables.AnswerAPercent = 0;
	gameVariables.AnswerBPercent = 0;
	gameVariables.AnswerCPercent = 0;
	gameVariables.AnswerDPercent = 0;
	gameVariables.QuestionLevel = null;
	gameVariables.RevealAnswerCounter = 0;
	gameVariables.RevealFastestFingerWinnersCounter = 0;
	gameVariables.RevealFastestFingerContestantCounter = 0;
	gameVariables.FastestFingerConstestantWinner = 3;
	gameVariables.FastestFingerRevealAnswerCounter = 0;
	gameVariables.FastestFingerSequenceCounter = 0;
	gameVariables.MoneyTreeSequenceCounter = 0;
	gameVariables.QuestionSequenceCounter = 0;
	gameVariables.pafLifeLineSequenceCounter = 0;
	gameVariables.ataLifeLineSequenceCounter = 0;
	gameVariables.stqLifeLineSequenceCounter = 0;
	gameVariables.walkAwaySequenceCounter = 0;
	gameVariables.commericalSequenceCounter = 0;
	gameVariables.ScaleTreeCounter = 0;
	gameVariables.LifeLineAnimationCounter = 0;
	gameVariables.STQUnlockedLevel = 11;
		
	/* String and Char Variables */
	gameVariables.CurrentCorrectAnswer = "";
	gameVariables.CurrentTargetAnswer = "";
	
	/* Audio Variables */
	gameVariables.GeneralSound = null;
	gameVariables.LifelineActiveSound = null;
	gameVariables.LifelinePassiveSound = null;
	gameVariables.LongActiveSound = null;
	gameVariables.LongPassiveSound = null;
	gameVariables.ShortActiveSound = null;
	gameVariables.ShortPassiveSound = null;

	/* Array Variables */
	gameVariables.QuestionsAndAnswers = [];
	gameVariables.SwitchQuestionsAndAnswers = [];
	gameVariables.AskTheAudienceVotingPercents = [];
	gameVariables.PrizeAmounts = [1000,2000,3000,5000,10000,20000,40000,80000,160000,320000,640000,1250000,2500000,5000000,10000000];
	gameVariables.FastestFingerContestantWinners = [false,false,true,false,false,false,true,false,false,false];
	gameVariables.FastestFingerContestantTimes = [2.541,4.541,5.541,6.541,9.541,13.541,15.541,16.541,7.541,19.541];
	gameVariables.FastestFingerContestants = []
	gameVariables.LightsDownSounds = ["q1_to_q5_lights_down.mp3","q1_to_q5_lights_down.mp3","q1_to_q5_lights_down.mp3","q1_to_q5_lights_down.mp3","q1_to_q5_lights_down.mp3","lights_down_1.mp3","lights_down_2.mp3","lights_down_3.mp3","lights_down_4.mp3","lights_down_5.mp3","lights_down_1.mp3","lights_down_2.mp3","lights_down_3.mp3","lights_down_4.mp3","lights_down_5.mp3"];
	gameVariables.RoundBackgroundSounds = ["q1_to_q5_bed.mp3","q1_to_q5_bed.mp3","q1_to_q5_bed.mp3","q1_to_q5_bed.mp3","q1_to_q5_bed.mp3","q6_bed.mp3","q7_bed.mp3","q8_bed.mp3","q9_bed.mp3","q10_bed.mp3","q11_bed.mp3","q12_bed.mp3","q13_bed.mp3","q14_bed.mp3","q15_bed.mp3"];
	gameVariables.FinalAnswerSounds = ["","","","","","final_answer_1.mp3","final_answer_2.mp3","final_answer_3.mp3","final_answer_4.mp3","final_answer_5.mp3","final_answer_1.mp3","final_answer_2.mp3","final_answer_3.mp3","final_answer_4.mp3","final_answer_5.mp3"];
	gameVariables.CorrectAnswerSounds = ["q1_to_q4_correct.mp3","q1_to_q4_correct.mp3","q1_to_q4_correct.mp3","q1_to_q4_correct.mp3","q5_correct.mp3","q6_correct.mp3","q7_correct.mp3","q8_correct.mp3","q9_correct.mp3","q10_correct.mp3","q11_correct.mp3","q12_correct.mp3","q13_correct.mp3","q14_correct.mp3","q15_correct.mp3"];
	gameVariables.WrongAnswerSounds = ["q1_to_q5_lose.mp3","q1_to_q5_lose.mp3","q1_to_q5_lose.mp3","q1_to_q5_lose.mp3","q1_to_q5_lose.mp3","q6_lose.mp3","q7_lose.mp3","q8_lose.mp3","q9_lose.mp3","q10_lose.mp3","q11_lose.mp3","q12_lose.mp3","q13_lose.mp3","q14_lose.mp3","q15_lose.mp3"];

	/* Interval/Timeout Variables */
	gameVariables.ShowAnswerTimeout = null;
	gameVariables.ShowWinnerTimeout = null;
	gameVariables.ScaleTreeTimeout = null;
	gameVariables.PAFClockTimeout = null;

})(window.GameVariables = window.GameVariables || {});








