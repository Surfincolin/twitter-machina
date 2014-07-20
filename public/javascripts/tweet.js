// var words = [];	// An array for the collection of all the words.             // DEV: moved locally inside tweet object belonging to a comparison
var allTweets = [];	// An array to hold all the tweets.                          // DEV: keeping, in case we want to have an array of all tweets ever...?
// var lookup = {};	// Used to count words and determine duplicates.             // DEV: moved locally inside tweet object belonging to a comparison
// Creates the individual tweet objects.
function Tweet(iComparison, iSet, tweet, tweetNum) {
	this.comparison = iComparison;
    this.set = iSet;
    this.fullTweet = tweet;
    this.number = tweetNum;
    this.height = 0;  // for retaining height once the words start floating.

  var tmpWords = tweet.splitTweet();
	//var tmpWords = tweet.cleanTweet().split(" ");

    allTweets.push(tweet);

  // NEW
  for (var i = 0; i < tmpWords.length; i++) {  
    var lookupWord = this.comparison.lookup[tmpWords[i]];
    var setName = this.set.name;
    var tweetLocation = new Object({ setName : tweetNum});
    //NEW WORD
    if (tmpWords[i].cleanTweet() == "") {
      this.comparison.words.push(new Word(tmpWords[i], this.set.name, tweetNum, false, undefined, undefined, this.comparison.words.length));
      lookupWord = { "count" : 0, "sets" : "junk", "firstWord": 0, "secondSet": 0};
    //Does the word exist yet? If not create it and add it to the lookup. Visibility true.
    } else if (lookupWord == undefined) {
      lookupWord = { "count" : 1, "sets" : this.set.name, "tweets": [], "firstWord": this.comparison.words.length, "secondSet": undefined};
      lookupWord.tweets.push(tweetLocation);
      this.comparison.words.push(new Word(tmpWords[i], this.set.name, tweetNum, true, lookupWord.firstWord, lookupWord.secondSet, this.comparison.words.length));

    } else {

      //DUPLICATE UNION
        //Has the word been seen in both sets? Make visibility false.
        if (lookupWord.sets == "union") {

        lookupWord.count = 1 + lookupWord.count;
        lookupWord.tweets.push(tweetLocation);
        this.comparison.words.push(new Word(tmpWords[i], this.set.name, tweetNum, false, lookupWord.firstWord, lookupWord.secondSet, this.comparison.words.length));

      //DUPLICATE IN SET
      //Has the word been seen in the set yet? Make visibility false.
        } else if (lookupWord.sets == this.set.name) {

        lookupWord.count = 1 + lookupWord.count;
        lookupWord.tweets.push(tweetLocation);
        this.comparison.words.push(new Word(tmpWords[i], this.set.name, tweetNum, false, lookupWord.firstWord, undefined, this.comparison.words.length));

      //NEW UNION WORD
      //By process of elimination an remaining words are initial union words.
      } else {

        lookupWord.count = 1 + lookupWord.count;
        lookupWord.sets =  "union";
        lookupWord.tweets.push(tweetLocation);
        lookupWord.firstWord = lookupWord.firstWord;
        lookupWord.secondSet = this.comparison.words.length;
        this.comparison.words.push(new Word(tmpWords[i], this.set.name, tweetNum, true, lookupWord.firstWord, lookupWord.secondSet, this.comparison.words.length));
      }
    }       
  }

};
