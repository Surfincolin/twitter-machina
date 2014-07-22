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
	this.sets = [];
	this.words = [];
	this.lookup = {};
	this.introHTML = '';
	this.imageUrlItem1 = null;
	this.imageUrlItem2 = null;

	// --- Behavior
	this.buildStateMachine();
	this.stateMachine.gotoState('intro');
	
	// console.log('* * * * * * * * states = ');
	// console.log(this.stateMachine.states);
	// console.log('* * * * * * * * transitions = '');
	// console.log(this.stateMachine.transitions);
	// console.log('* * * * * * * * curState = '+ this.stateMachine.curState.name);

}
comparison.prototype = {
	// Get live data from Twitter API for the provided user items.
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
				_this.sets.push(new Set(_this, _this.twitterDataItem1, "set1"));
				_this.sets.push(new Set(_this, _this.twitterDataItem2, "set2"));

				console.log("comparison.js- comparison["+_this.id+"]- sets : ");
				console.log(_this.sets);
			}
		});

		// Receive twitter users' image urls.
		socket.on('eServerReturnsUserImage_'+this.id, function(iResponse){
			if(iResponse.iQueryNum == 1){
				_this.imageUrlItem1 = iResponse.iImageUrl;
			} else if(iResponse.iQueryNum == 2){
				_this.imageUrlItem2 = iResponse.iImageUrl;
			}
			// Populate navigation menu bar with the images.
			if(_this.imageUrlItem1 != null && _this.imageUrlItem2 != null){
				buildUserImageSet(_this.id, _this.item1, _this.imageUrlItem1, _this.item2, _this.imageUrlItem2);
			}
			
		});

	},
	// Use static data instead of live data from Twitter API (useful for development).
	setupStaticData: function(){
		var _this = this;

		this.allQueriesReceived = true;			// Currently unused.
		emptyModelItems();
		// 1 --- Build user1 data.
		$.getJSON("data_backup/"+ this.item1 +".json", function(json1) {
	    // console.log("data_backup/"+ _this.item1 +" ------------ ")
	    // console.log(json1);

	    _this.twitterDataItem1 = json1;
	  	_this.sets.push(new Set(_this, _this.twitterDataItem1, "set1"));

	  	// 1 --- Build user2 data.
  		$.getJSON("data_backup/"+ _this.item2 +".json", function(json2) {
  	    // console.log("data_backup/"+ _this.item2 +" ------------ ")
  	    // console.log(json2);

  	    _this.twitterDataItem2 = json2;
  	  	_this.sets.push(new Set(_this, _this.twitterDataItem2, "set2"));

  	  	// 2 --- Build user images.
  	  	_this.imageUrlItem1 = "assets/user_logo_backup/"+ _this.item1 +".png";
  	  	_this.imageUrlItem2 = "assets/user_logo_backup/"+ _this.item2 +".png";
  	  	buildUserImageSet(_this.id, _this.item1, _this.imageUrlItem1, _this.item2, _this.imageUrlItem2);
  		});
	  		
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

				//emptyViewItems();
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