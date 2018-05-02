window.onload = function() {
  var BLI2017 = "http://stats.oecd.org/SDMX-JSON/data/BLI/AUS+AUT+BEL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA.EQ_AIRP+EQ_WATER+HS_SFRH+SW_LIFS.L.TOT/all?"
  var BLI2014 = "http://stats.oecd.org/SDMX-JSON/data/BLI2014/AUS+AUT+BEL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA.EQ_AIRP+EQ_WATER+HS_SFRH+SW_LIFS.L.TOT/all?"

  d3.queue()
  .defer(d3.request, BLI2017)
  .defer(d3.request, BLI2014)
  .awaitAll(doFunction);


  d3.select("head").append("title").text("Scatter plot")
  d3.select("body").append("p").text("Linsey Schaap (11036109)")

};

function doFunction(error, response) {
  if (error) throw error;


  var json = response[0].responseText
  obj = JSON.parse(json);


  var data = []
  for (var i = 0; i < 34; i++) {
    obj0 = obj["structure"]["dimensions"]["observation"]["0"]["values"][i]["id"]
    obj1 = obj["dataSets"]["0"]["observations"][i + ":" + "0:0:0"][0]
    obj2 = obj["dataSets"]["0"]["observations"][i + ":" + "1:0:0"][0]
    obj3 = obj["dataSets"]["0"]["observations"][i + ":" + "2:0:0"][0]
    obj4 = obj["dataSets"]["0"]["observations"][i + ":" + "3:0:0"][0]
    data.push({land: obj0, luchtVervuiling: obj1, waterKwaliteit: obj2, zelfGerapporteerdeGezondheid: obj3, levensVoldoening: obj4});
  };

  console.log(data);

  // stel hoogte en breedte vast
  var hoogte = 500
  var breedte = 750
  var grens = 20

  // marges vast leggen
  var marge = {boven: 70, beneden: 40, rechts: 10, links: 70}
  var grafiekHoogte = hoogte - marge.boven - marge.beneden
  var grafiekBreedte = breedte - marge.rechts - marge.links

  console.log(data.luchtVervuiling)


  // maak een schaalfunctie voor de x waarden
  var x = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) {
      return d["luchtVervuiling"];})])
      .range([marge.links, grafiekBreedte + marge.links/2])

  // maak een schaalfunctie voor de y waarden
  var y = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) {
        return d["waterKwaliteit"];})+5])
      .range([grafiekHoogte + marge.boven, marge.boven])


  //Create SVG element
  var svg = d3.select("body")
          .append("svg")
          .attr("height", hoogte)
          .attr("width", breedte);

  var bucketCijfer = []
  for (var i = 0; i < data.length; i++) {
    if (data[i].levensVoldoening < 5.6) {
      data[i]["bucketCijfer"] = 1;
    }
    if (data[i].levensVoldoening > 5.5 && data[i].levensVoldoening < 6.1) {
      data[i]["bucketCijfer"] = 2;
    }
    if (data[i].levensVoldoening > 6 && data[i].levensVoldoening < 6.6) {
      data[i]["bucketCijfer"] = 3;
    }
    if (data[i].levensVoldoening > 6.5 && data[i].levensVoldoening < 7.1) {
      data[i]["bucketCijfer"] = 4;
    }
    if (data[i].levensVoldoening > 7) {
      data[i]["bucketCijfer"] = 5;
    }
  }

  svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", function(d) {
      return x(d["luchtVervuiling"]); })
    .attr("cy", function(d) {
      return y(d["waterKwaliteit"]); })
    .attr("r", function(d) {
      return Math.sqrt(hoogte - d["zelfGerapporteerdeGezondheid"] * 5.5);})
    .attr("fill", function(d) {
      return "rgb(0, 0, " + (d["bucketCijfer"] * 30) + ")";});

    // creëer een x-as
    var asX = d3.axisBottom(x);

    // voeg de x-as en waarden toe
    svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(" + 0 + "," + (grafiekHoogte + marge.boven)  + ")")
      .call(asX)
      .attr("font-size", "10px");

    // geef de x-as een titel
    svg.append("text")
    .attr("x", breedte / 2 )
    .attr("y",  y(0) + marge.beneden + grens)
    .style("text-anchor", "middle")
    .text("Lucht Vervuiling");

    // creëer een y-as
    var asY = d3.axisLeft(y);


    // voeg de y-as en waarden toe
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + marge.links + "," + 0 + ")")
        .call(asY)
        .attr("font-size", "10px");

    // geef de y-as een titel
    svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 + marge.rechts)
    .attr("x", 0 - (hoogte / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Water Kwaliteit");

};
