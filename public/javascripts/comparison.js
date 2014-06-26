// Compares words from 2 twitter feeds to one another.

// Params: item1 = a twitter username, item2 = a twitter username.
function comparison(iId, iItem1, iItem2){

	// --- Properties
	this.id = iId;
	this.item1 = iItem1;
	this.item2 = iItem2;
	this.stateMachine = null;
	this.twitterDataItem1 = null;
	this.twitterDataItem2 = null;
	this.allQueriesReceived = false;

	// --- Behavior
	// this.setupServerCalls();
	//
	this.buildStateMachine();
	this.stateMachine.gotoState("intro");
	// introView();																	
	// 
	// console.log("* * * * * * * * states = ");
	// console.log(this.stateMachine.states);
	// console.log("* * * * * * * * transitions = ");
	// console.log(this.stateMachine.transitions);
	// console.log("* * * * * * * * curState = "+ this.stateMachine.curState.name);

}
comparison.prototype = {
	//
	setupServerCalls: function(){
		// Send request for Twitter data.
		socket.emit('eClientRequestsTwitterQuery', this.id, this.item1, this.item2);
		// Receive Twitter data.
		var _this = this;
		socket.on('eServerReturnsTwitterResult_'+this.id, function (iResponse) {
			console.log("comparison.js- eServerReturnsTwitterResult_"+ _this.id +"- iResponse : ");
			console.log(iResponse);
			logTwitterResults(iResponse);

			// Store query results.
			if(iResponse.iQueryNum == 1){
				_this.twitterDataItem1 = iResponse.iData;
			} else if(iResponse.iQueryNum == 2){
				_this.twitterDataItem2 = iResponse.iData;
			}

			// When all data received, trigger the views.
			if(_this.twitterDataItem1 != null && _this.twitterDataItem2 != null){
				// console.log("t- ALL QUERIES RECEIVED");
				_this.allQueriesReceived = true;			// Currently unused.
				
				// Clear Model & View items.
				emptyModelItems();
				// emptyViewItems();
				
				// Create sets.
				createSet(_this.twitterDataItem1, "set1");
				createSet(_this.twitterDataItem2, "set2");
				emptyResultObjects();
				
				console.log(sets);
			}
		});
	},
	// Define the state machine transitions here.
	buildStateMachine: function(){
		this.stateMachine = new sosoStateMachine();

		this.stateMachine.addTransition("intro", "tweetList");
		this.stateMachine.addTransition("tweetList", "initialTweetBubbles");
		this.stateMachine.addTransition("initialTweetBubbles", "unionTweetBubbles");
	},
	// TODO: instead of using IF statemtn for each step, make this automatically know what the enxt state is.
	nextState: function(){

		if (this.stateMachine.curState == this.stateMachine.getState("intro")){

			var stateChangeSuccess = this.stateMachine.gotoState("tweetList");
			// If the transition is valid, do stuff.
			if (stateChangeSuccess) {

				emptyViewItems();
				listView();													// Fill content div with tweetList content.
			}
		} else if (this.stateMachine.curState == this.stateMachine.getState("tweetList")){

			var stateChangeSuccess = this.stateMachine.gotoState("initialTweetBubbles");
			// If the transition is valid, do stuff.
			if (stateChangeSuccess) {

				emptyViewItems();
				initialTweetBubblesView();
			}
		} else if (this.stateMachine.curState == this.stateMachine.getState("initialTweetBubbles")){

			var stateChangeSuccess = this.stateMachine.gotoState("unionTweetBubbles");
			// If the transition is valid, do stuff.
			if (stateChangeSuccess) {

				// Don't want to empty things when coming into here, want to keep the initialTweetBubbles, and just add another bubble for Union.
				unionTweetBubblesView();
			}
		}

	}
}