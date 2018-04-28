// INDEX.HTML WIL HET JSON BESTAND NIET INLEZEN, DUS ALLES STAAT IN INDEX.HTML

d3.select("head").append("title").text("Barchart")
d3.select("body").append("p").text("Het aantal Gasten dat in een provincie verblijft verkregen via het cbs") .style("color", "grey")
d3.select("body").append("p").text("Linsey Schaap (11036109)")

var hoogte = 500
var breedte = 500
var staafBreedte = 20

var svg = d3.select("body")
    .append("svg")
    .attr("height", hoogte)
    .attr("width", breedte)

console.log(svg)

var provincies = ["groningen", "friesland", "drenthe", "overijssel", "flevoland", "gelderland", "utrecht", "n-holland", "z-holland", "zeeland", "n-brabant", "limburg"]

var marge = {top: 80, beneden: 80, rechts: 40, links: 80}
var grafiekHoogte = hoogte - marge.top - marge.beneden
var grafiekBreedte = breedte - marge.rechts - marge.links


d3.json("data.json", function(error, data){
  if (error){
    return alert(error);
  }

  // van de data een reeks maken
  dataReeks = []
  for (var i = 0; i < data.data.length; i++)
  {
    dataReeks[i] = +data.data[i]["Gasten *1000"]
  }

  var staaf = svg.selectAll("rect")
      .data(dataReeks)
      .enter()
      .append("rect");



})
