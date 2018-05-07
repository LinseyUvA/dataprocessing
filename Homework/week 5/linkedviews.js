window.onload = function() {

  d3.queue()
  .defer(d3.json, "overnachtingen.json")
  .defer(d3.json, "sterren")
  .awaitAll(grafieken);
};

function grafieken(error, overnachtingen, sterren) {
  if (error) throw error;

  var projection = d3.geo.conicConformalEurope();
}
