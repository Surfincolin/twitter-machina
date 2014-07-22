// DEV: made this local to each comparison object.
// var sets = [];	//An array to hold sets of word origins.

// Creates set objects. This creates the parent objects for the tweets and word.
function Set(iComparison, iData, iName) {
	// sets.push(this);
	this.comparison = iComparison;
	this.name = iName;
	this.tweets = [];
	this.circleArea = 0;
	this.fullName = iData[0].user.name;
	this.screenName = iData[0].user.screen_name;

	this.listPack = {
		'usedSpace': 0,
		'lineCount': 0,
		'currentTweet': 0,
	};

	for (var i = 0; i < iData.length; i++) {
		var tweetText = iData[i].text;
		this.tweets.push(new Tweet(this.comparison, this, tweetText, i));
			
	}

  // console.log("set.js- words: - - - - - - - - - *");
  // console.log(this.comparison.words);
  // console.log("set.js- lookup: - - - - - - - - - *");
  // console.log(this.comparison.lookup);
};

