window.onload = function() {

  d3.queue()
  .defer(d3.json, "overnachtingen.json")
  .defer(d3.json, "sterren.json")
  .defer(d3.xml, "Map_of_Europe.svg")
  .awaitAll(kaart);
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
    .attr("x", 15)
    .attr("dy", "1.2em")
    .style("text-anchor", "middle")
    .attr("font-size", "12px")
    .attr("font-weight", "bold");


  document.body.appendChild(response[2].documentElement);

  var svg = d3.selectAll("#Portugal, #Spanje, #Belgie, #Italie, #Polen, #Griekenland, #Duitsland, #Ierland, #Frankrijk, #Oostenrijk, #Verenigd Koninkrijk, #Nederland, #Denemarken, #Rusland")
    .style("fill", "Navy")
    .data(overnachtingen)
    // maak de staven interactief
    .on("mouseover", function() {
        d3.select(this).style("fill", "SlateGray");})
    .on("mouseout", function() {
        d3.select(this).style("fill", "Navy");})
    .on("mousemove", function(d) {
      console.log(d)
        var xPos = d3.mouse(this)[0];
        var yPos = d3.mouse(this)[1];
        infoKnop.attr("transform", "translate(" + xPos + "," + yPos + ")")
        infoKnop.select("text").text(d.Jaar);
      });


}

function barchart(error, response) {
  if (error) throw error;

  var sterren = response["1"]["data"]
  console.log(sterren)

  // stel hoogte en breedte vast
  var hoogte = 500
  var breedte = 800

  // marges vast leggen
  var marge = {boven: 70, beneden: 50, rechts: 10, links: 70}
  var grafiekHoogte = hoogte - marge.boven - marge.beneden
  var grafiekBreedte = breedte - marge.rechts - marge.links

  // creëer een format voor een afbeelding
  var svg = d3.select("body")
      .append("svg")
      .attr("height", hoogte)
      .attr("width", breedte)


}
