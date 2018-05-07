window.onload = function() {
  var BLI2017 = "https://stats.oecd.org/SDMX-JSON/data/BLI/AUS+AUT+BEL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA.EQ_AIRP+EQ_WATER+HS_SFRH+SW_LIFS.L.TOT/all?"
  var BLI2014 = "https://stats.oecd.org/SDMX-JSON/data/BLI2014/AUS+AUT+BEL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA.EQ_AIRP+EQ_WATER+HS_SFRH+SW_LIFS.L.TOT/all?"

  d3.queue()
  .defer(d3.request, BLI2017)
  .defer(d3.request, BLI2014)
  .awaitAll(doFunction);

  d3.select("head").append("title").text("Scatter plot")

};



function doFunction(error, response) {
  if (error) throw error;
  var projection = d3.geo.conicConformalEurope();
}
