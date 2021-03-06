
console.log('client');

window.onload = function() {

		console.log("loaded window");
		// Get a reference to the canvas object
		var canvas = document.getElementById('myCanvas');
		// Create an empty project and a view for the canvas:
		paper.setup(canvas);
		// Create a Paper.js Path to draw a line into it:
		var path = new paper.Path();
		// Give the stroke a color
		path.strokeColor = 'black';
		var start = new paper.Point(100, 100);
		// Move to start and draw a line from there
		path.moveTo(start);
		// Note that the plus operator on Point objects does not work
		// in JavaScript. Instead, we need to call the add() function:
		path.lineTo(start.add([ 200, -50 ]));
		// Draw the view now:
		paper.view.draw();

		console.log('hello');

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

 console.log(nodes);

var force = d3.layout.force()
    .gravity(0.05)
    .charge(function(d, i) { return i ? 0 : -2000; })
    .nodes(nodes)
    .size([w, h]);

var root = nodes[0];
root.radius = 0;
root.fixed = true;

force.start();

console.log("making circles");
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

	console.log('mouse move');
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


//This is the front end
$(function(){

	console.log('connecting to socket');
	//attempt to require paper

	// connect to the socket server
	var socket = io.connect(); 

	// if we get an "info" emit from the socket server then console.log the data we recive
	socket.on('info', function (data) {
	    console.log(data);
	});

	// On "twitter" event, append the tweet's text to the ul.
	socket.on('twitter_stream', function (data) {

	    
	    // Show only the last 5 tweets from stream.
	    if ($('ul.tweet_list').children().length >= 5) {
	    	$('ul.tweet_list li').first().remove();
	    	console.log("delete!");
	    }
    	$('ul.tweet_list').append('<li>'+ data.text +'</li>');

    	//$('ul.tweet_list').textillate();
	});

	//
	socket.on('twitter_search', function (data) {

		var tweet = jQuery.parseJSON( data);

		var status = tweet.statuses[0].text;
		//console.log(data.text)
	
		//$('#tweet_search').append(data);
		$('#tweet_search').append(status);
		$('#tweet_search').textillate();
		/*{ 
    in: { effect: 'flip' },
    out: { effect: 'noneOut', sync: true }, 
    loop: true 
});*/

		//data.textillate();
	});

});