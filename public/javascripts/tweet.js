// var words = [];  // An array for the collection of all the words.             // DEV: moved locally inside tweet object belonging to a comparison
var allTweets = []; // An array to hold all the tweets.                          // DEV: keeping, in case we want to have an array of all tweets ever...?
// var lookup = {}; // Used to count words and determine duplicates.             // DEV: moved locally inside tweet object belonging to a comparison
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
    //NEW WORD
    if (tmpWords[i].cleanTweet() == '') {
      this.comparison.words.push(new Word(tmpWords[i], this.set.name, tweetNum, false, undefined, undefined, this.comparison.words.length));
      this.comparison.lookup[tmpWords[i]] = { 'count' : 0, 'sets' : 'junk', 'firstWord': 0, 'secondSet': 0};
    //Does the word exist yet? If not create it and add it to the lookup. Visibility true.
    } else if (this.comparison.lookup[tmpWords[i]] == undefined) {

      this.comparison.lookup[tmpWords[i]] = {'count' : 1, 'sets' : this.set.name, 'firstWord' : this.comparison.words.length, 'secondSet' : undefined, 'tweets' : []};
      this.comparison.lookup[tmpWords[i]].tweets.push({'set': this.set.name, 'tweet' : tweetNum});
      this.comparison.words.push(new Word(tmpWords[i], this.set.name, tweetNum, true, this.comparison.lookup[tmpWords[i]].firstWord, this.comparison.lookup[tmpWords[i]].secondSet, this.comparison.words.length));

    } else {

      //DUPLICATE UNION
        //Has the word been seen in both sets? Make visibility false.
        if (this.comparison.lookup[tmpWords[i]].sets == 'union') {

        this.comparison.lookup[tmpWords[i]].count = ++this.comparison.lookup[tmpWords[i]].count;
        this.comparison.lookup[tmpWords[i]].tweets.push({'set': this.set.name, 'tweet' : tweetNum});
        this.comparison.words.push(new Word(tmpWords[i], this.set.name, tweetNum, false, this.comparison.lookup[tmpWords[i]].firstWord, this.comparison.lookup[tmpWords[i]].secondSet, this.comparison.words.length));

      //DUPLICATE IN SET
      //Has the word been seen in the set yet? Make visibility false.
        } else if (this.comparison.lookup[tmpWords[i]].sets == this.set.name) {

        this.comparison.lookup[tmpWords[i]].count = ++this.comparison.lookup[tmpWords[i]].count;
        this.comparison.lookup[tmpWords[i]].tweets.push({'set': this.set.name, 'tweet' : tweetNum});
        this.comparison.words.push(new Word(tmpWords[i], this.set.name, tweetNum, false, this.comparison.lookup[tmpWords[i]].firstWord, undefined, this.comparison.words.length));

      //NEW UNION WORD
      //By process of elimination an remaining words are initial union words.
      } else {

        this.comparison.lookup[tmpWords[i]] = {'count' : ++this.comparison.lookup[tmpWords[i]].count, 'sets' : 'union', 'firstWord' : this.comparison.lookup[tmpWords[i]].firstWord, 'secondSet' : this.comparison.words.length, 'tweets' : this.comparison.lookup[tmpWords[i]].tweets};
        this.comparison.lookup[tmpWords[i]].tweets.push({'set': iSet.name, 'tweet' : tweetNum});
        this.comparison.words.push(new Word(tmpWords[i], this.set.name, tweetNum, true, this.comparison.lookup[tmpWords[i]].firstWord, this.comparison.lookup[tmpWords[i]].secondSet, this.comparison.words.length));
      }
    }       
  }

};