// Represents the entire Common Ground app. This object must be created to run the project.
// Params:
// iUseLiveData: true = get data from Twitter API, false = use static data files (for development).
function clientApp(iUseLiveData){

	// --- Properties
	this.comparisons = [];
	this.curComparison = null;
	
	// --- Behavior
	// Comparison objects
	// var comparison1 = new comparison("BarackObama", "MichelleObama");
	this.comparisons.push(new comparison(1, "BarackObama", "MichelleObama"));
	this.comparisons.push(new comparison(2, "WholeFoods", "McDonalds"));
	this.comparisons.push(new comparison(3, "facebook", "twitter"));

	this.comparisons.push(new comparison(4, "foxnews", "CNN"));
	this.comparisons.push(new comparison(5, "kanyewest", "KimKardashian"));
	this.curComparison = this.comparisons[0];

	// Generic button setup
	setupButtons();
	
	// Comparison obj setup
	for (var i = 0; i < this.comparisons.length; i++){
		if (iUseLiveData){
			// Initiating server calls (they are not done in the comparison constructor so the comparisons array gets its length quicker).
			this.comparisons[i].setupServerCalls();
		} else {
			this.comparisons[i].setupStaticData();
		}
	}	
	
	// 
	this.buildIntroHTML();


	// console.log("clientApp- comparisons :");
	// console.log(this.comparisons);
}
clientApp.prototype = {
	// Cutomize the intro text for each comparison. 
	buildIntroHTML: function(){
		for (var i = 0; i < this.comparisons.length; i++){
			this.comparisons[i].introHTML = "<div id='intro_view'>" +
																				"<p>There is a lot of strife out there in the world. And that discord reaches online with arguments, name-calling, and all out twitter warfare. But aren’t we all humans, born of the same stuff? Can’t we find some Common Ground?</p>" +
																				"<p>People who talk similarly are said to be likely matches for friends. Let’s see who deep-down, should be getting along, and who might be better off staying far away from each other.</p>" +
																			"</div>";

			//console.log("INTRO HTML : "+ this.comparisons[i].introHTML);

		}
	},
	start: function(){
		// Display the first comparison.
		emptyViewItems();
		introView();

	},
	switchCurComparison: function(iComparisonNum){
		console.log("switchCurComparison- iComparisonNum : "+ iComparisonNum);

		// Reset the old comparison to its initial state.
		this.curComparison.stateMachine.forceState("intro");

		// Get the comparison with the specified id.
		var newComparison = $.grep(this.comparisons, function(c, i){
			return (c.id == iComparisonNum);
		});
		this.curComparison = newComparison[0];
		this.start();

		// Update the view to reflect the current comparison.
		updateView();
	},
	customComparison: function(iComparisonNum){
		console.log("-customComparison-");

		// Reset the old comparison to its initial state.
		this.curComparison.stateMachine.forceState("intro");
		emptyViewItems();
		//emptySearchView();
		introView();
		searchView();
	},
	search: function(iComparionObj) {
		console.log("* * * * * * * * SEARCH FIRED * * * * * * * * * *");
		console.log(iComparionObj.input1);
		console.log(iComparionObj.input2);
		//console.log(this);
		if (this.comparisons[5] != undefined) {
			console.log("conditional true");
			this.comparisons.pop();
		};
		this.comparisons.push(new comparison("custom", iComparionObj.input1, iComparionObj.input2));
		this.comparisons[5].setupServerCalls();

		this.comparisons[5].introHTML = "<div id='intro_view'>" +
																				"<p>There is a lot of strife out there in the world. And that discord reaches online with arguments, name-calling, and all out twitter warfare. But aren’t we all humans, born of the same stuff? Can’t we find some Common Ground?</p>" +
																				"<p>People who talk similarly are said to be likely matches for friends. Let’s see who deep-down, should be getting along, and who might be better off staying far away from each other.</p>" +
																			"</div>";

		this.curComparison = this.comparisons[5];
		console.log(this.comparisons);
		// Reset the old comparison to its initial state.
		this.curComparison.stateMachine.forceState("intro");
		this.start();
		updateView();
	}
}

