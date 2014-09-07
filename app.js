$(document).ready(function(){
  var width = 960,
      height = 502;
  var wq_data =
{
    "1986": {
        "1": 1.7,
        "2": 1.8,
        "3": 2.2,
        "4": 5.5,
        "5": 5.1,
        "6": 7.2,
        "7": 8.6,
        "8": 11.4,
        "9": 15.5,
        "10": 10.1,
        "11": 10.6,
        "12": 2,
        "13": 2.2,
        "15": 1,
        "16": 1.1
    },
    "1993": {
        "1": 1.3,
        "2": 1.4,
        "3": 1.6,
        "4": 2.3,
        "5": 2.5,
        "6": 1.9,
        "7": 24.5,
        "8": 1.8,
        "9": 1.9,
        "10": 0.8,
        "11": 1,
        "12": 1.2,
        "13": 1.5,
        "15": 0.9,
        "16": 0.9
    },
    "2008": {
        "1": 1.2,
        "2": 1.4,
        "3": 1.9,
        "4": 2.9,
        "5": 3.1,
        "6": 3.4,
        "7": 4.1,
        "8": 4.8,
        "9": 3.2,
        "10": 2.2,
        "11": 3,
        "12": 1.7,
        "13": 2.4,
        "15": 2.2,
        "16": 3.6
    },
    "2011": {
        "1": 1.7,
        "2": 5.6,
        "3": 3.4,
        "4": 4.5,
        "5": 5.5,
        "6": 3,
        "7": 8.4,
        "8": 4.2,
        "9": 4,
        "10": 3.9,
        "11": 8,
        "12": 2.7,
        "13": 2.9,
        "15": 2.1,
        "16": 2.8
    }
};
  var svg = d3.select(".map_div").append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("id", 'map') 
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

//Town labels
//  svg.selectAll(".place-label")
//      .data(topojson.feature(ganga, towns).features)
//    .enter().append("text")
//      .attr("class", "place-label")
//      .attr("transform", function(d) { return "translate(" + india_projection(d.geometry.coordinates) + ")"; })
//      .attr("dy", "0.5em")
//      .attr("dx", "-3em")
//      .text(function(d) { return d.properties["Location"]; });

//Towns
 wq_scale = d3.scale.sqrt().domain([1, 11.5]).range([5, 22]) 
 function update(data) {
 svg.append("g")
      .attr("class", "towns")
    .selectAll("circle")
      .data(topojson.feature(ganga, towns).features)
      .enter().append("circle")
      .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
      .attr("r", function(d) { 
        if (d.properties.id < 17) {
          return( wq_scale(data[d.properties.id]));}
        else {return 0;}
      })
      .attr("fill", function(d) {
        if (d.properties.id < 17) {
          if( data[d.properties.id] < 2) {return 'green'}
          else {return 'red'};
        }
        else {return 'none';}

      })
    .append("title")
      .text(function(d) {
        title = d.properties.Location + ": " + data[d.properties.id]+ " mg/L";
        return title;
      });
 }
 update(wq_data["1986"])
 $('.year-switch').click(function(){
   year = $(this).data('year');
   $('.towns').remove()
   title_text = "BoD levels of the River Ganga in " + year
   $('#title').text(title_text)
   update(wq_data[year]);
 });

//end topojson
  });

});
