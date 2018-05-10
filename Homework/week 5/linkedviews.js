window.onload = function() {

  d3.queue()
  .defer(d3.json, "overnachtingen.json")
  .defer(d3.json, "sterren.json")
  .defer(d3.xml, "Map_of_Europe.svg")
  .awaitAll(barchart);
};

function kaart(error, response) {
  if (error) throw error;

  var overnachtingen = response["0"]["data"]
  console.log(overnachtingen)


  // creëer een infoKnop
  var infoKnop = d3.select("body").append("g")
      .attr("class", "tooltip")
      .style("display", "none");

  // voeg de informatie toe aan de infoKnop
  infoKnop.append("text")
    .attr("x", 300)
    .attr("y", 300)
    .style("text-anchor", "middle")
    .attr("font-size", "12px")
    .attr("font-weight", "bold");


  document.body.appendChild(response[2].documentElement);

  var svg = d3.selectAll("#Nederland, #Duitsland, #Belgie, #VerenigdKoninkrijk, #Ierland, #Frankrijk, #Italie, #Spanje, #Portugal, #Oostenrijk, #Griekenland, #Denemarken, #Polen, #Rusland")
    .style("fill", "Navy")
    .data(overnachtingen)
    // maak de staven interactief
    .on("mouseover", function() {
        infoKnop.style("display", null);
        d3.select(this).style("fill", "SlateGray");})
    .on("mouseout", function() {
        infoKnop.style("display", "none");
        d3.select(this).style("fill", "Navy");})
    .on("mousemove", function(d) {
      console.log(d)
        infoKnop.select("text").text(d.Overnachtingen);
      });


}

function barchart(error, response) {
  if (error) throw error;

  var sterren = response["1"]["data"]
  console.log(sterren)

  // stel hoogte en breedte vast
  var hoogte = 500
  var breedte = 700

  // marges vast leggen
  var marge = {boven: 70, beneden: 50, rechts: 10, links: 70}
  var grafiekHoogte = hoogte - marge.boven - marge.beneden
  var grafiekBreedte = breedte - marge.rechts - marge.links

  // creëer een format voor een afbeelding
  var svg = d3.select("body")
      .append("svg")
      .attr("height", hoogte)
      .attr("width", breedte)

  // bepaal maximale waarden en de breedte van een staaf
  var maxWaarde = Math.max(...sterren)
  var staafBreedte = (breedte - (dataReeks.length - 1) * staafVulling) / dataReeks.length


  // maak een schaalfunctie voor de x waarden
  var x = d3.scale.ordinal()
      .domain(sterren)
      .rangeBands([0, grafiekBreedte])

  // maak een schaalfunctie voor de y waarden
  var y = d3.scale.linear()
      .domain([maxWaarde, 0])
      .range([0, grafiekHoogte])

  // creëer een x-as
  var asX = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  // voeg de x-as en waarden toe
  svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(" + marge.links + "," + (grafiekHoogte + marge.boven) + ")")
      .call(asX)
      .attr("font-size", "10px");

  // geef de x-as een titel
  svg.append("text")
  .attr("x", breedte / 2 )
  .attr("y",  y(0) + marge.beneden + marge.boven)
  .style("text-anchor", "middle")
  .text("Provincies");

  // creëer een y-as
  var asY = d3.svg.axis()
      .scale(y)
      .orient("left")

  // voeg de y-as en waarden toe
  svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(" + marge.links + "," +  marge.boven + ")")
      .call(asY)
      .attr("font-size", "10px");

  // geef de y-as een titel
  svg.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 + marge.rechts)
  .attr("x",0 - (hoogte / 2))
  .attr("dy", "1em")
  .style("text-anchor", "middle")
  .text("Gasten x1000");


}
