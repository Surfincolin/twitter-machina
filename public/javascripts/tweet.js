var words = [];	// An array for the collection of all the words.
var allTweets = [];	// An array to hold all the tweets.
var lookup = {};	// Used to count words and determine duplicates.

// Creates the individual tweet objects.
function Tweet(tweet, refSet) {
	this.fullTweet = tweet;
	this.ref = [refSet];
	var tmpWords = tweet.split(" ")
	this.words = tmpWords;
	allTweets.push(tweet);
	
	for (var i = 0; i < tmpWords.length; i++) {
    	if (lookup[tmpWords[i]] == undefined) {
    		lookup[tmpWords[i]] = 1;
    		words.push(new Word(tmpWords[i], refSet, true));
    	} else {
    		lookup[tmpWords[i]] = 1 + lookup[tmpWords[i]];
    		words.push(new Word(tmpWords[i], refSet, false));
    	}		
	}

};