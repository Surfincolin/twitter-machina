//word exclusion array
var exWordArray = ["the", "a", "if", "is", "on", "in", "to", "it", "of"];

// Creates the individual word objects.
function Word(theWord, refSet, vis, firstPairLoc, secondSetPairLoc) {
	this.value = theWord;
	this.linkedSets = [refSet];
	this.firstPairLocation = firstPairLoc;
	this.secondSetPairLocation = secondSetPairLoc;
	//this.linkedTweetWord = null;
	this.pixelWidth = 0;  // Established when the word first appears in the DOM.
	//this.count = 1;

	this.startPosition = {"left": 450, "top": 300};
	this.position1 = {"left": 0, "top": 0};
	this.position2 = {"left":0, "top":0};
	this.position3 = {"left": 0, "top": 0};

	this.circlePosition = {"line": 0, "percent": 0}; // For circle packing.

	//if word is in exclusion array or only one letter, set visibility to false.
	if (exWordArray.indexOf(theWord) !== -1 || theWord.length < 2) {
		// If capital "I" allow visibility.
		if (theWord == "I") {
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