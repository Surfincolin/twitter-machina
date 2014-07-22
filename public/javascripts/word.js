//word exclusion array
var exWordArray = ['the', 'a', 'if', 'is', 'on', 'in', 'to', 'it', 'of'];
var wordCount = 0;
// Creates the individual word objects.
function Word(theWord, refSet, refTweet, vis, firstPairLoc, secondSetPairLoc, selfRef) {
	this.value = theWord;
	this.linkedSets = refSet;
	this.linkedTweet = refTweet;
	this.selfRef = selfRef;
	this.firstPairLocation = firstPairLoc;
	this.secondSetPairLocation = secondSetPairLoc;
	this.union = false;
	this.unionViz = false;
	//this.linkedTweetWord = null;
	this.pixelWidth = 0;  // Established when the word first appears in the DOM.
	//this.count = 1;

	this.startPosition = {'left': 450, 'top': 300}; // For tweet list.
	this.circlePosition = {'top': 0, 'left': 600}; 		// For circle packing.

	//if word is in exclusion array or only one letter, set visibility to false.
	if (exWordArray.indexOf(theWord) !== -1 || theWord.length < 2) {
		// If capital "I" allow visibility.
		if (theWord == 'I') {
			this.visible = vis;
		} else {
			this.visible = false;
		}
	} else {
		this.visible = vis;	//true or false
	}
}

Word.prototype = {
	setVisible: function(iVisible){

	}
}