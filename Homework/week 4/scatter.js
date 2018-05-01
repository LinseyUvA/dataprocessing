window.onload = function() {
  var BLI2017 = "http://stats.oecd.org/SDMX-JSON/data/BLI/AUS+AUT+BEL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA.EQ_AIRP+EQ_WATER+HS_SFRH+SW_LIFS.L.TOT/all?"
  var BLI2014 = "http://stats.oecd.org/SDMX-JSON/data/BLI2014/AUS+AUT+BEL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA.EQ_AIRP+EQ_WATER+HS_SFRH+SW_LIFS.L.TOT/all?"

  d3.queue()
  .defer(d3.request, BLI2017)
  .defer(d3.request, BLI2014)
  .awaitAll(doFunction);

  function doFunction(error, response) {
    if (error) throw error;


    var json = response[0].responseText
    obj = JSON.parse(json);


    var element = []
    for (var i = 0; i < 34; i++) {
      obj0 = obj["structure"]["dimensions"]["observation"]["0"]["values"][i]["id"]
      obj1 = obj["dataSets"]["0"]["observations"][i + ":" + "0:0:0"][0]
      obj2 = obj["dataSets"]["0"]["observations"][i + ":" + "1:0:0"][0]
      obj3 = obj["dataSets"]["0"]["observations"][i + ":" + "2:0:0"][0]
      obj4 = obj["dataSets"]["0"]["observations"][i + ":" + "3:0:0"][0]
      element.push({land: obj0, luchtVervuiling: obj1, waterKwaliteit: obj2, zelfGerapporteerdeGezondheid: obj3, levensVoldoening: obj4});
    };

    console.log(element);
    var data = []
    for (var i = 0; i < 34; i++) {
      console.log(element[i].luchtVervuiling)
    }


    // {
    //   "usa": {
    //     "gdp": 200,
    //     "wellbeing": 8
    //   }
    // }
    //
    // [
    //   {"country": "usa", "gdp": 200, "wellbeing": 8}
    // ]

    // Use response
  };

  d3.select("head").append("title").text("Scatter plot")
  d3.select("body").append("p").text("Linsey Schaap (11036109)")

};
