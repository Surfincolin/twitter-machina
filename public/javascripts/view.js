/*
View.js
Contains the code relative to the View parts of the app (following an MVC approach).
*/

// View for intro/1st state of a comparison.
function introView(){
	//console.log("introView -- - - - - cgApp");
	//console.log(cgApp);
	//console.log("introView -- - - - - cgApp.curComparison");
	//console.log(cgApp.curComparison);
	//console.log("introView -- - - - - cgApp.curComparison.introHTML");
	//console.log(cgApp.curComparison.introHTML);

	$("#state_title").html("state : intro");

	// $("#content").html("<div id='intro_view'>" +
	// 											"<p>There is a lot of strife out there in the world. And that discord reaches online with arguments, name-calling, and all out twitter warfare. But aren’t we all humans, born of the same stuff? Can’t we find some Common Ground?</p>" +
	// 											"<p>People who talk similarly are said to be likely matches for friends. Let’s see who deep-down, should be getting along, and who might be better off staying far away from each other.</p>" +
	// 										"</div>");

	$("#content").html(cgApp.curComparison.introHTML);

}


// A list view of both sets of tweets. Un-cleaned.
function listView(){
	$("#state_title").html("Let's compare the words that they each use");

	var sets = cgApp.curComparison.sets;
	$('#user1').html('<span class="name">' + sets[0].fullName + '</span><span class="screen_name">@' + sets[0].screenName + '</span>');
	$('#user2').html('<span class="name">' + sets[1].fullName + '</span><span class="screen_name">@' + sets[1].screenName + '</span>');
	$('#user1').fadeIn(1000);
	$('#user2').fadeIn(1000);

	// Add the HTML structure to be populated.
	$("#content").html("<div id='canvasBg' class='col-md-10 col-md-offset-1'></div><div id='listView'>");
		$('#listView').html("<div class='row'>" +
													"<div class='col-lg-5 col-md-offset-1'>" +
														"<div class='listContainer'>" +
															// "<h2>List 1</h2>" +
															"<div id='list1' class='tweetlist'></div>" +
														"</div>" +
													"</div>" +
													"<div class='col-lg-5'>" +
														"<div class='listContainer'>" +
															// "<h2>List 2</h2>" +
															"<div id='list2' class='tweetlist'></div>" +
														"</div>" +
													"</div>" +
												"</div>" +
											"</div>");

	// Populate it.
	$.each(cgApp.curComparison.words, function(key, value) {
			value.circlePosition.left = 530;
	    value.circlePosition.top = 0;
		if (value.linkedSets == "set1") {
				$("#canvasBg").append('<span id="word'+ key +'"  onclick="wordClick(\'' + value.value + '\');" class="tword" style="display: none;">' + value.value + '</span>');
				value.pixelWidth = $('#word' + key).width();
				// send word to listPack for positioning. (wordObj, width, set, word's key)
				listPack(value, 503 - 30, 0, key);
		} else if (value.linkedSets == "set2") {
				$("#canvasBg").append('<span id="word'+ key +'" onclick="wordClick(\'' + value.value + '\');" class="tword" style="display: none;">' + value.value + '</span>');
				value.pixelWidth = $('#word' + key).width();
				// send word to listPack for positioning. (wordObj, width, set, word's key)
				listPack(value, 503 - 30, 1, key);
		}
	});

	// Make an array of each sets tweetCount.
	var aTc = [cgApp.curComparison.sets[0].listPack.currentTweet, cgApp.curComparison.sets[1].listPack.currentTweet];

	// Take the largest tweetCount and calculate the canvas height, then animate.
	var maxHeight = Math.max.apply(null, aTc) * 52 + 30;
	$('#canvasBg').animate({
		height: 30 + maxHeight + 30
	}, 1000, function() {

			console.log("canvasBg Grow!");
			console.log(30 + maxHeight + 30);

	});

	// reset set's listPacking values for future packing.
	cgApp.curComparison.sets[0].listPack = {
		"usedSpace": 0,
		"lineCount": 0,
		"currentTweet": 0,
	};
	cgApp.curComparison.sets[1].listPack = {
		"usedSpace": 0,
		"lineCount": 0,
		"currentTweet": 0,
	};

}

// 
function initialTweetBubblesView() {
	$("#state_title").html("Finally, what words do both of them use?");


	// Add the HTML structure to be populated.


	//Bubble Area Count
	var bA1 = 0,
	    bA2 = 0;

	// Preperations fot absolute positioning.
	$.each(cgApp.curComparison.words, function(key, value) {
		value.startPosition = $("#word" + key).position();
		//value.pixelWidth = $('#word'+key).width();
		value.selfRef = key;
		// if (value.linkedSets == "set1") {
		// 	if (cgApp.curComparison.sets[0].tweets[this.linkedTweet].height == 0) {
		// 		cgApp.curComparison.sets[0].tweets[this.linkedTweet].height = $("#list1 #tweet" + this.linkedTweet).innerHeight();
		// 	}
		// 	$("#list1 #tweet" + this.linkedTweet).attr({style: "height: " +	cgApp.curComparison.sets[0].tweets[this.linkedTweet].height + "px"});
		// } else {
		// 	if (cgApp.curComparison.sets[1].tweets[this.linkedTweet].height == 0) {
		// 		cgApp.curComparison.sets[1].tweets[this.linkedTweet].height = $("#list2 #tweet" + this.linkedTweet).innerHeight();
		// 	}
		// 	$("#list2 #tweet" + this.linkedTweet).attr({style: "height: " +	cgApp.curComparison.sets[1].tweets[this.linkedTweet].height + "px"});
		// }
	});
	

	// Populate it.
	$.each(cgApp.curComparison.words, function(key, value){
		var theWord = value.value;
/*		if (theWord.cleanTweet() == "") {
			$("#word" + key).attr({class: "extra word", style: "top: " +	value.startPosition.top + "px;left: " + value.startPosition.left + "px"});
		} else {*/
			if(value.linkedSets == "set1") {

			        if (value.visible == true) {
											$("#word" + key).attr({class: "word", style: "top: " +	value.startPosition.top + "px;left: " + value.startPosition.left + "px"});

							bA1 = value.pixelWidth + bA1; //Counting set1 visible word lengths.

			        } else {
			        				// None Visisble words. "extra" has replaced hide, which was already in bootstrap.
			        				$("#word" + key).attr({class: "extra word", style: "top: " +	value.startPosition.top + "px;left: " + value.startPosition.left + "px"});
											
			        }
			} else if(value.linkedSets == "set2") {
			        if (value.visible == true) {
					            $("#word" + key).attr({class: "word", style: "top: " +	value.startPosition.top + "px;left: " + value.startPosition.left + "px"});

			                bA2 = value.pixelWidth + bA2; //Counting set2 visible word lengths.

			        } else {
			        				// None Visible words.  "extra" has replaced hide, which was already in bootstrap.
	                    $("#word" + key).attr({class: "extra word", style: "top: " +	value.startPosition.top + "px;left: " + value.startPosition.left + "px"});
			        }

			} else {
			        console.log(" ********** Unaccounted Word! **********");
			}
		//}
	});
	cgApp.curComparison.sets[0].circleArea = bA1;
	cgApp.curComparison.sets[1].circleArea = bA2;

	// newAnimation - Colin :: Circle Packing!!!!
	console.log("-*-*-*-*- Begin packCircle -*-*-*-*-");
	var positioning = $('#canvasBg').width();
	console.log(positioning);
	circlePack(cgApp.curComparison.words.filter(set1Filter), bA1*16, positioning*.25*1, 200);
	circlePack(cgApp.curComparison.words.filter(set2Filter), bA2*16, positioning*.25*3, 200);

	$.each(cgApp.curComparison.words.filter(zeroVisFilter), function(key, value){
		
		if (value.firstPairLocation == undefined) {
			$("#word" + value.selfRef).fadeOut();
		} else if (value.secondSetPairLocation != undefined) {
			animateToDuplicate(value, key, cgApp.curComparison.words[value.secondSetPairLocation].circlePosition);
		} else {
			animateToDuplicate(value, key, cgApp.curComparison.words[value.firstPairLocation].circlePosition);
		}

	});

	$('#canvasBg').delay( 3000 ).animate({
			height: 15 + Math.max.apply(null, [Math.sqrt(bA1*15/Math.PI)*2, Math.sqrt(bA2*15/Math.PI)*2]) + 30
		}, 1000, function() {

				console.log("canvasBg shrink!");
				//console.log(15 + maxHeight + 15);

			});
	
}




function unionTweetBubblesView(){
	$("#state_title").html("Start over or choose another pair of users");

	// Add the HTML structure to be populated.

	// Populate it.
	var unionCount = {}; //Counting Unions
	var bA3 = 0, //Count Union Words length
			bA1 = cgApp.curComparison.sets[0].circleArea, //Pull Old Area Counts
			bA2 = cgApp.curComparison.sets[1].circleArea;


	$.each(cgApp.curComparison.words,  function(key, value) {
    	var id = "#word" + key;

    	if (cgApp.curComparison.lookup[cgApp.curComparison.words[key].value].sets == "union") {
    		
    		//Union Count to check for duplicates.
	    	if (unionCount[cgApp.curComparison.words[key].value] == undefined) {
		    	bA3 = cgApp.curComparison.words[key].pixelWidth + bA3;  //Counting Length
		    	cgApp.curComparison.words[key].union = true;
		    	if (cgApp.curComparison.words[key].linkedSets == "set1") bA1 -= cgApp.curComparison.words[key].pixelWidth;
					if (cgApp.curComparison.words[key].linkedSets == "set2") bA2 -= cgApp.curComparison.words[key].pixelWidth;
					value.unionViz = true;
		    	unionCount[cgApp.curComparison.words[key].value] = true;
		    	$(id).addClass("union");

	    	} else {
	    		//Hide the Duplicates
	    		//value.unionViz = false;
	    		cgApp.curComparison.words[key].union = true;
		    	if (cgApp.curComparison.words[key].linkedSets == "set1") bA1 -= cgApp.curComparison.words[key].pixelWidth;
					if (cgApp.curComparison.words[key].linkedSets == "set2") bA2 -= cgApp.curComparison.words[key].pixelWidth;
    		}
    	} 		
	});

	console.log("-*-*-*-*- Begin Middle packCircle -*-*-*-*-");
	var positioning = $('#canvasBg').width();
	console.log(positioning);
	circlePack(cgApp.curComparison.words.filter(unionFilter), bA3*17, positioning*.5, 200);

	$.each(cgApp.curComparison.words.filter(unionVizFilter), function(key, value){
			animateToDuplicate(value, key, cgApp.curComparison.words[value.firstPairLocation].circlePosition);
	});
	
	console.log(cgApp.curComparison.words.filter(NonUnionSet1Filter));
	circlePack(cgApp.curComparison.words.filter(NonUnionSet1Filter), bA1*26, positioning*.25*1, 200);
	circlePack(cgApp.curComparison.words.filter(NonUnionSet2Filter), bA2*26, positioning*.25*3, 200);

}


// Create menu items for each query, click one to display it. The custom search query is prepopulated in index.jade.
function buildUserImageSet(iComparisonId, iItem1, iUrlItem1, iItem2, iUrlItem2){
	// console.log("buildUserImageSet- iComparisonId : "+ iComparisonId +" | cgApp.curComparison : "+ cgApp.curComparison);

	// Set the selected class on the default query at start.
	var curComparison = "";
	if(iComparisonId == cgApp.curComparison.id){
		curComparison = "selected";
	}
	// console.log("*********************************");
	// console.log(cgApp.curComparison.id);
	// console.log("*********************************");
	// Create query blocks containing the Twitter user images.
	if (cgApp.curComparison.id != "custom") {
		// NEW post-bootstrap
		$("#query-menu").prepend("<div class='col-lg-2 query-block "+ curComparison +"' id='"+ iComparisonId +"' onClick='queryBlockController("+ iComparisonId +")')>" +
			"<div class='row'>" +
				"<div class='col-lg-6'>" +
					"<img class='twitterUserImage custom pull-right' src='"+ iUrlItem1 +"' alt='@"+ iItem1 +"'>" +
				"</div>" +
				"<div class='col-lg-6'>" +
					"<img class='twitterUserImage custom pull-left' src='"+ iUrlItem2 +"' alt='@"+ iItem2 +"'>" +
				"</div>" +
			"</div>" +
		"</div>");
	} else {
		$("#query_block_container #" + cgApp.curComparison.id).html("<img class='twitterUserImage' src='"+ iUrlItem1 +"' alt='@"+ iItem1 +"'>" +
											"<img class='twitterUserImage' src='"+ iUrlItem2 +"' alt='@"+ iItem2 +"'>" +
											"<div class='comparisonTitle'>"+ iItem1 +"<br><span class='versus'>VS</span><br>"+ iItem2 +"</div>");
	}
	// console.log("buildUserImageSet- curComparison : "+ curComparison);
}

function updateView(){

	// Change the selected/hilited query block according to the newly selected comparison.
	$(".query-block").removeClass("selected");
	var _this = this;
	$(".query-block").each(function(){
		//console.log("* * * * attr id :"+ $(this).attr('id'));
		//console.log("^ ^ ^ : "+ cgApp.curComparison.id);

		if ($(this).attr('id') == cgApp.curComparison.id){
			$(this).addClass("selected");
		}
	});
}

function searchView() {
	$('#user1').html('<span class="name">Person 1: </span><span class="screen_name">@<input id="input1" class="typeahead" type="text" name="person1" value="DalaiLama"></span>');
	$('#user2').html('<span class="name">Person 2: </span><span class="screen_name">@<input id="input2" class="typeahead" type="text" name="person2" value="PutinRF_Eng"></span>' +
		'<input id="submit1" type="submit" value="Submit" onclick="searchButton(); return false;">');

	$('#user1').fadeIn(1000);
	$('#user2').fadeIn(1000);

	var substringMatcher = function(strs) {
	  return function findMatches(q, cb) {
	    var matches, substringRegex;
	 
	    // an array that will be populated with substring matches
	    matches = [];
	 
	    // regex used to determine if a string contains the substring `q`
	    substrRegex = new RegExp(q, 'i');
	 
	    // iterate through the pool of strings and for any string that
	    // contains the substring `q`, add it to the `matches` array
	    $.each(strs, function(i, str) {
	      if (substrRegex.test(str)) {
	        // the typeahead jQuery plugin expects suggestions to a
	        // JavaScript object, refer to typeahead docs for more info
	        matches.push({ value: str });
	      }
	    });
	 
	    cb(matches);
	  };
	};
	 
	var states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
	  'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii',
	  'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
	  'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
	  'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
	  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
	  'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island',
	  'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
	  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
	];
	 
	$('#searchForm .typeahead').typeahead({
	  hint: true,
	  highlight: true,
	  minLength: 1
	},
	{
	  name: 'states',
	  displayKey: 'value',
	  source: substringMatcher(states)
	});
}

function searchButton() {
	var inputs = {
		"input1": $("#input1").val(),
		"input2": $("#input2").val()
	};
	cgApp.search(inputs);
}

function wordClick(iWord) {
	$('#list1').html('');
	$('#list2').html('');

	var wordRegEx = new RegExp("(\\b"+ iWord + "\\b)", "g");
	console.log("WORD!!!")
	//this.comparison.lookup[tmpWords[i]].tweets
	console.log(cgApp.curComparison.lookup[iWord].tweets);
	$.each(cgApp.curComparison.lookup[iWord].tweets, function(key, value) {
		//var splitString = string.split(/(my)/);
		var highlightedString = "";
		if (value.set == "set1") {
			var tweetArray = cgApp.curComparison.sets[0].tweets[value.tweet].fullTweet.replace(wordRegEx, "<strong>$&</strong>");
			console.log(tweetArray);
			/*$.each(tweetArray, function(k,v) {
				highlightedString = highlightedString + v;	
			});
			console.log(highlightedString);*/
			//$('#list1').append('<p>' + cgApp.curComparison.sets[0].tweets[value.tweet].fullTweet + '</p>');
			$('#list1').append('<p>' + tweetArray + '</p>');
		} else {
			var tweetArray = cgApp.curComparison.sets[1].tweets[value.tweet].fullTweet.replace(wordRegEx, "<strong>$&</strong>");
			
			$('#list2').append('<p>' + tweetArray + '</p>');
		};
	});

}

// 
function diagramView(){

}

// 
function setView(){

}

// 
function tweetView(){

}

//---------------------------------------------


// Alex's D3 code.
function drawD3TestChart() {

	// console.log('hello');

	var canvas = document.getElementById('tlt');
	
		/*var $tlt = $viewport.find('.tlt')
			.on('start.tlt', log('start.tlt triggered.'))
			.on('inAnimationBegin.tlt', log('inAnimationBegin.tlt triggered.'))
			.on('inAnimationEnd.tlt', log('inAnimationEnd.tlt triggered.'))
			.on('outAnimationBegin.tlt', log('outAnimationBegin.tlt triggered.'))
			.on('outAnimationEnd.tlt', log('outAnimationEnd.tlt triggered.'))
			.on('end.tlt', log('end.tlt'));*/
		
		//$form.on('change', function () {
			//var obj = getFormData();
			//var tlt = document.getElementById('tlt');
			var obj = "fadeInLeftBig";
			$('.tlt').textillate({ in: { effect: 'rollIn' } });
			//trigger('change');
		//}).trigger('change');

	var w = 1280,
		h = 800;


	var words = ["hello", "cat", "mouse", "pizza", "noodle", "sofa"];


	//var nodes = d3.range(200).map(function() { return {radius: Math.random() * 12 + 4}; }),
	//    color = d3.scale.category10();

	var nodes = d3.range(200).map(function() { return {radius: Math.random() * 12 + 4}; }),
			color = d3.scale.category10();

	 // console.log(nodes);

	var force = d3.layout.force()
			.gravity(0.05)
			.charge(function(d, i) { return i ? 0 : -2000; })
			.nodes(nodes)
			.size([w, h]);

	var root = nodes[0];
	root.radius = 0;
	root.fixed = true;

	force.start();

	// console.log("making circles");
	var svg = d3.select("body").append("svg:svg")
			.attr("width", w)
			.attr("height", h);

	svg.selectAll("circle")
			.data(nodes.slice(1))
		.enter().append("svg:circle")
			.attr("r", function(d) { return d.radius - 2; })
			.style("fill", function(d, i) { return color(i % 3); });

	force.on("tick", function(e) {
		var q = d3.geom.quadtree(nodes),
				i = 0,
				n = nodes.length;

		while (++i < n) {
			q.visit(collide(nodes[i]));
		}

		svg.selectAll("circle")
				.attr("cx", function(d) { return d.x; })
				.attr("cy", function(d) { return d.y; });
	});

	svg.on("mousemove", function() {

		// console.log('mouse move');
		var p1 = d3.mouse(this);
		root.px = p1[0];
		root.py = p1[1];
		force.resume();
	});

	function collide(node) {
		var r = node.radius + 16,
				nx1 = node.x - r,
				nx2 = node.x + r,
				ny1 = node.y - r,
				ny2 = node.y + r;
		return function(quad, x1, y1, x2, y2) {
			if (quad.point && (quad.point !== node)) {
				var x = node.x - quad.point.x,
						y = node.y - quad.point.y,
						l = Math.sqrt(x * x + y * y),
						r = node.radius + quad.point.radius;
				if (l < r) {
					l = (l - r) / l * .5;
					node.x -= x *= l;
					node.y -= y *= l;
					quad.point.x += x;
					quad.point.y += y;
				}
			}
			return x1 > nx2
					|| x2 < nx1
					|| y1 > ny2
					|| y2 < ny1;
		};
	} 

}
