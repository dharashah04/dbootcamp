$(document).ready(function(){
  var width = 960,
      height = 660;

  var svg = d3.select(".map_div").append("svg")
      .attr("width", width)
      .attr("height", height);
   
  d3.json("ganga.json", function(error, ganga) {
    if (error) return console.error(error);
    console.log(ganga);
    var states = ganga.objects.ganga_states;
    var towns = ganga.objects.ganga_towns;
    var river = ganga.objects.ganga_river;
    india_projection = d3.geo.conicConformal().center([0, 23.5]).parallels([16, 21]).rotate([-82.5,0]).scale(2800).translate([width/2, 400])
    path = d3.geo.path().projection(india_projection)

//States
    svg.append("path")
      .datum(topojson.feature(ganga, states))
      .attr("class", 'state')
      .attr("d", path);

//State internal boundaries
    svg.append("path")
      .datum(topojson.mesh(ganga, states, function(a, b) { return a !== b }))
      .attr("d", path)
      .attr("class", "internal-boundary");

//River
    svg.append("path")
      .datum(topojson.feature(ganga, river))
      .attr("class", 'river')
      .attr("d", path);

//Towns
 svg.append("g")
      .attr("class", "towns")
    .selectAll("circle")
      .data(topojson.feature(ganga, towns).features)
      .enter().append("circle")
      .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
      .attr("r", function(d) { 
        if (d.properties.id < 16) {return 6;}
        else {return 0;}
      })
    .append("title")
      .text(function(d) {
        return d.properties.Location
      });

//end topojson
  });

});
