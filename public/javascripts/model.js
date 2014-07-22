/*
Client.js
Contains the code relative to the Model parts of the app (following an MVC approach).
*/

// Global variables - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

var socket = io.connect();						// Connect to the socket server.
var cgApp;														// The main client-side app, which controls everything.
var circlePackinglineHeight = 15;									// Used for circle packing.

// Main execution body - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
$(function(){

	// --- Setup

	cgApp = new clientApp(false);				// DEV: run the app with static data (ie. 'false').
	cgApp.start();
	
});

// Global functions - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

// Empties the sets array.
function emptyModelItems(){
	// words.length = 0;			// before var was made local to comparison obj
	allTweets.length = 0;
	// lookup = {};			// before var was made local to comparison obj
	// sets.length = 0;			// before var was made local to comparison obj
}

//DEV: should this be in view.js?
// Empties the tweet bubble divs.
function emptyViewItems(){
	// console.log("model.js- EMPTY VIEW ITEMS");
	// Clear current content div.
	$("#content").empty();
	//
	$("#tweetBubble1").empty();
	$("#tweetBubble2").empty();
	$("#tweetBubble3").empty();
	//
	$("#list1").empty();
	$("#list2").empty();
	//
	$("#searchContainer").empty();

	$('#user1').fadeOut(500);
	$('#user2').fadeOut(500);
}

//DEV: should this be in view.js?
// Empties the tweet bubble divs.
function emptySearchView(){
	console.log("model.js- EMPTY SEARCH VIEW");
	// Clear current content div.
	
}

// Print out the tweet text for each query.
function logTwitterResults(data) {
	console.log("-logTwitterResults - - - - - - - - - - - - - - - - - - - - - - - - - ");
	console.log("query string: "+ data.iQueryString);
	console.log("query num: "+ data.iQueryNum);
	$.each(data.iData, function(key, value){
		var tweetText = value.text;
		console.log("Tweet #"+ key + ": " + tweetText.cleanTweet() );
	});
}


function createSet(iData, iName) {
	var set = new Set(iData, iName);
}

// Common function, to clean a tweet of unwanted features.
String.prototype.cleanTweet = function() {		
	var tweet = this;
	// -- NB: we're not doing it now, but it's possible to store the regex matches in arrays for later use. We would need to use
	// Matches punctuation. Leaves words, time ex. 2:20, p.m, 5.7, urls, and contractions.
	var punctRegEx = new RegExp(/(?!\.\w{1,2})(?!\.\d{1,2})(?!\:\d{1,2})([^A-Za-z0-9#'\u2026]+|https?:\/\/\S+)/g);
	// Matches URLs that start with http, ftp, and https.
	var urlRegEx = new RegExp(/(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/g);
	// Matches most emoticons.
	var emojiRegEx = new RegExp(/([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g);

	//tweet = tweet.replace(/@([a-zA-Z0-9]+)/g, "");	// remove user mentions.
	tweet = tweet.replace(punctRegEx, ""); // remove punctuation.
	tweet = tweet.replace(urlRegEx, "");	// remove http links.
	tweet = tweet.replace(emojiRegEx, "EMOJI "); //Swap Most Emoji with EMOJI	
	tweet = tweet.replace(/([\u2014])/g, '');	//em dash
	tweet = tweet.replace(/([\u201C])/g, '');	//left double quote
	tweet = tweet.replace(/([\u201D])/g, '');	//right double quote
	//tweet = tweet.replace(/([\u2026])/g, '');	// ... ellipsis
	tweet = tweet.replace(/([\u2019])/g, '\u0027');	// Make funky apostrophes regular
	tweet = tweet.replace(/([\u02BC])/g, '\u0027');	// Make funky apostrophes regular

	$.trim(tweet);	// Remove leading and trailing whitespace.

	return tweet;
}

// Common function, to split a tweet of unwanted features.
String.prototype.splitTweet = function() {		
	var tweet = this;
	// Matches punctuation. Leaves words, em dash signatures, time ex. 2:20, p.m, 5.7, urls, and contractions.
	var punctRegEx = new RegExp(/(?!\u2014\w{1,2})(?!\.\w{1,2})(?!\.\d{1,2})(?!\:\d{1,2})([^A-Za-z0-9#'\u2026]|https?:\/\/\S+)/g);

	tweet = tweet.split(punctRegEx); // remove punctuation.

	return tweet;
}

function set1Filter(element) {
  return element.linkedSets == "set1" && element.visible == true;
}

function set2Filter(element) {
  return element.linkedSets == "set2" && element.visible == true;
}

function NonUnionSet1Filter(element) {
  return element.linkedSets == "set1" && element.visible == true && element.union == false;
}

function NonUnionSet2Filter(element) {
  return element.linkedSets == "set2" && element.visible == true && element.union == false;
}

function unionFilter(element) {
  return element.union == true && element.visible == true;
}

function unionVizFilter(element) {
  return element.union == true && element.visible == false;
}

function zeroVisFilter(element) {
  return element.visible == false;
}


// -- -- -- -- -- Animations -- -- -- -- --

// Line Packing
function linePack(id, setCount, delayCount) {
	var span = $('#word' + id),
			width = span.width() + 3,
			canvasWidth = 1200 - 15,
			freeSpace = canvasWidth/3 - setCount.lineWidth,
			newTop = 0,
			newLeft = 0;

	if (width - 3 <= freeSpace) {
		newTop = setCount.lineCount * circlePackinglineHeight;
		newLeft = setCount.lineWidth;
		//console.log(newTop + ":" + newLeft);
		setCount.lineWidth = setCount.lineWidth + width;
	} else if (width - 3 > freeSpace) {
		++setCount.lineCount;
		setCount.lineWidth = 0;
		newTop = setCount.lineCount * circlePackinglineHeight;
		newLeft = setCount.lineWidth;
		setCount.lineWidth = setCount.lineWidth + width;
	}

	span.delay( 200 + delayCount * 10 ).animate({

			top: newTop + 50,
			left: newLeft + setCount.setPos + 10

		}, 1000, function() {

		//console.log("animation complete");

		});

	return {"lineWidth": setCount.lineWidth, "lineCount": setCount.lineCount , "setPos": setCount.setPos};

}

// Tweet List Line Packing
function listPack(iWord, iWidth, iSet, iKey) {

	var punctuation = new RegExp(/(?!\.\w{1,2})(?!\.\d{1,2})(?!\:\d{1,2})([^A-Za-z0-9#@'\u2026])/g);

	var	width = iWidth,
			set = iSet,
			padding = 30,
			usedSpace = cgApp.curComparison.sets[set].listPack.usedSpace,
			lineCount = cgApp.curComparison.sets[set].listPack.lineCount,
			currentTweet = cgApp.curComparison.sets[set].listPack.currentTweet,
			tweetHeight = 30;

		var span = $('#word' + iKey),
				spanWidth = iWord.pixelWidth,
				tweet = iWord.linkedTweet;
		
		if (span.html() == '') {
		
			iWord.startPosition.left = 0;
			iWord.startPosition.top = 0;
			span.attr({style: "top: " +	iWord.startPosition.top + "px;left: " + iWord.startPosition.left + "px; position: absolute; display: none;"});

		} else {

			if (tweet != currentTweet) {
				currentTweet = tweet;
				cgApp.curComparison.sets[set].listPack.currentTweet = tweet;
				lineCount= 0;
				cgApp.curComparison.sets[set].listPack.lineCount = 0;
				usedSpace = 0;
				cgApp.curComparison.sets[set].listPack.usedSpace = 0;
			}

			if (usedSpace + spanWidth > width) {
					lineCount++;
					cgApp.curComparison.sets[set].listPack.lineCount++;
					usedSpace = 0;
					cgApp.curComparison.sets[set].listPack.usedSpace = 0;
			}

			iWord.startPosition.left =  503*set + padding*set/2 + padding + usedSpace;
			iWord.startPosition.top = currentTweet*padding*1.7 + padding + lineCount*circlePackinglineHeight;
			if (spanWidth == 0) {
				usedSpace += 4;
				cgApp.curComparison.sets[set].listPack.usedSpace += 4;
			} else {
				usedSpace += spanWidth;
				cgApp.curComparison.sets[set].listPack.usedSpace += spanWidth;
			}

			span.attr({style: "top: " +	iWord.startPosition.top + "px;left: " + iWord.startPosition.left + "px; position: absolute; display: none;"});

			span.delay( currentTweet * 50 ).fadeIn(1000);
		}
}

// Line Count for packing circles
function lineCounter(iArea, iLh) {
   
    var intArea = iArea, // Initial Area to reference back to.
        lH = iLh, // Line Height **Could make this a global variable for animations.
        radius = Math.sqrt(intArea / Math.PI), // initial radius of estimated circle.
        lC = (2*radius / lH), // initial line count.
        sqAr = 0, // The square area of the circle based on the words square space.
        loopOn = 1,
        sqRad = 0,
        pcErr = 1; // percent Error

   	// A for loop to get the square area as close to the initial area as possible (0.01)
   	// For better acuraccy this should be reworked to account for a greater area or negative difference.
     for (; loopOn != 0;) {

        //console.log(lC + 1);

        if (pcErr > 0.01) {
	        sqAr = 0;  // As the loop cycles through this needs to be reset.

	        // Calculate the area based on Line Height * Line Count for the circle.
	        for (i = 0; i <= lC/2; i++) {
	            if (i * lH < radius) {
		              var s = Math.sqrt(radius * radius - i * lH * i * lH);
		              sqAr = 2 * s * 15 + sqAr; // both sides of the circle.
                }
	            //console.log("line : " + (i + 1) + " : " + sqAr);
	        }

	        var pcErr = 1 - sqAr / intArea; // Percent Error
	        //console.log(pcErr);

	        // new area to shoot for...
	        sqRad = Math.sqrt(sqAr / Math.PI);
	        radius = 1 + radius;
	        lC = (radius / lH);
	        //console.log(radius);
	        //console.log(sqAr);
        } else {
          loopOn = 0;
        }

    };
    //console.log(lC + 1);
    return {"radius": sqRad, "lineCount": lC+1};
}


// - - - - - - - - - - - - 
// Circle Pack
// - - - - - - - - - - - - 
function circlePack(iWords, iArea, iX, iY) {

	var lC = lineCounter(iArea, circlePackinglineHeight),
			radius = lC.radius,
			lineCount = lC.lineCount,
			count = 0,
			aCount = 0,
			bCount = 1,
			boxSize = radius*2,
			yPos = iY,
			xPos = iX - radius,
			lineWidth = [],
			spaceAvail = [];

	console.log("lineCount:"+lineCount+" radius:"+radius);

	for (i=0; i<lineCount/2; i++) {
	    var widthEq = 2*Math.sqrt(Math.pow(radius, 2)-Math.pow(i*circlePackinglineHeight, 2))
	   	spaceAvail.push({"line": count, "width": widthEq}); 
	    lineWidth.push({"line": count++, "width": widthEq});
	    spaceAvail.push({"line": count, "width": widthEq});
	    lineWidth.push({"line": count++, "width": widthEq});
	    
	};

	// reset count
	count = 0;

	$.each(iWords, function(key, value) {
	    var left,
	    		top;

	    if (count < spaceAvail.length) {
	        if (value.pixelWidth <= spaceAvail[count].width) {
	            left  = xPos + (boxSize-lineWidth[count].width)/2 + lineWidth[count].width - spaceAvail[count].width;
	            if (count%2 == 0) {
	                top = yPos + count*circlePackinglineHeight-aCount*circlePackinglineHeight;                
	            } else {
	                top = yPos + count*-circlePackinglineHeight-bCount*-circlePackinglineHeight-2*circlePackinglineHeight;
	            }
	            spaceAvail[count].width -= value.pixelWidth+3; 
	        } else {
	            count++;
	            if (count < spaceAvail.length) {
	                left  = xPos + (boxSize-lineWidth[count].width)/2 + lineWidth[count].width - spaceAvail[count].width;
	                if (count%2 == 0) {
	                    aCount++;
	                    top = yPos + count*circlePackinglineHeight-aCount*circlePackinglineHeight;
	                } else {
	                    bCount++;
	                    top = yPos + count*-circlePackinglineHeight-bCount*-circlePackinglineHeight-2*circlePackinglineHeight;
	                }
	                spaceAvail[count].width -= value.pixelWidth+3;
	            }
	        }
	    } else {
	        console.log("Using Empty Space");
	        var keepGoing = 1;
	        $.each(spaceAvail, function (k, v) {
	            if (keepGoing == 1) {
	                if (value.pixelWidth < v.width) {
	                    left = xPos + (boxSize-lineWidth[k].width)/2 + lineWidth[k].width - spaceAvail[k].width;
	                    if (k%2 == 0) {
	                        top = yPos + k*circlePackinglineHeight/2;                
	                    } else {
	                        top = yPos + k*-circlePackinglineHeight/2-circlePackinglineHeight/2;
	                    }
	                    spaceAvail[k].width -= value.pixelWidth+3;
	                    keepGoing = 0;
	                }
	            }
	        });
	    }
	    value.circlePosition.left = left;
	    value.circlePosition.top = top;
	});

	$.each(iWords, function(key, value) {
	    $('#word'+ value.selfRef).delay( 20*key ).animate({

	      top: value.circlePosition.top,
				left: value.circlePosition.left

			}, 500, function() {

				//console.log("circle animation complete");

			});

	});
}

// - - - - - - - - - - - - - - - - - - - - - - - -
// Animate the extra words to their first instance.
// - - - - - - - - - - - - - - - - - - - - - - - -

function animateToDuplicate(iWord, iDelay, iPosition) {
	//console.log("top:"+iTop+", left:"+iLeft);
	$('#word'+ iWord.selfRef).delay( 1000 ).animate({

	    top: iPosition.top,
			left: iPosition.left

		}, 500, function() {

			$('#word'+iWord.selfRef).fadeOut(2000);
			$('#word'+iWord.selfRef).addClass("extra");
			//console.log("circle animation complete");

	});

}

//-- -- -- -- -- -- -- -- -- -- -- -- -- --
