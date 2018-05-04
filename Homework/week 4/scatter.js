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

  jaartal = 0

  function jaartalVeranderen(){
    d3.select("svg").remove()
    jaartal = 1

    var json = response[jaartal].responseText
    obj = JSON.parse(json);

    // verzamel alle nodige gegeven in data
    var data = []
    for (var i = 0; i < 34; i++) {
      obj0 = obj["structure"]["dimensions"]["observation"]["0"]["values"][i]["id"]
      obj1 = obj["dataSets"]["0"]["observations"][i + ":" + "0:0:0"][0]
      obj2 = obj["dataSets"]["0"]["observations"][i + ":" + "1:0:0"][0]
      obj3 = obj["dataSets"]["0"]["observations"][i + ":" + "2:0:0"][0]
      obj4 = obj["dataSets"]["0"]["observations"][i + ":" + "3:0:0"][0]
      data.push({land: obj0, luchtVervuiling: obj1, waterKwaliteit: obj2, zelfGerapporteerdeGezondheid: obj3, levensVoldoening: obj4});
    };

    // stel hoogte en breedte vast
    var hoogte = 500
    var breedte = 800

    // marges vast leggen
    var marge = {boven: 70, beneden: 50, rechts: 10, links: 70}
    var grafiekHoogte = hoogte - marge.boven - marge.beneden
    var grafiekBreedte = breedte - marge.rechts - marge.links

    // maak een schaalfunctie voor de x waarden
    var x = d3.scaleLinear()
              .domain([0, d3.max(data, function(d) {
                return d["luchtVervuiling"];}) + 2])
              .range([marge.links, grafiekBreedte + marge.links/2])

    // maak een schaalfunctie voor de y waarden
    var y = d3.scaleLinear()
              .domain([0, d3.max(data, function(d) {
                return d["waterKwaliteit"];}) + 5])
              .range([grafiekHoogte + marge.boven, marge.boven])

    // maak een SVG element
    var svg = d3.select("body")
                .append("svg")
                .attr("height", hoogte)
                .attr("width", breedte);

    // stel een kleur vast voor ieder cijfer voor levens voldoening
    var bucketCijfer = []
    for (var i = 0; i < data.length; i++) {
      if (data[i].levensVoldoening < 5.6) {
        data[i]["bucketCijfer"] = "rgb(0, 0, 30)";
      }
      if (data[i].levensVoldoening > 5.5 && data[i].levensVoldoening < 6.1) {
        data[i]["bucketCijfer"] = "rgb(0, 0, 60)";
      }
      if (data[i].levensVoldoening > 6 && data[i].levensVoldoening < 6.6) {
        data[i]["bucketCijfer"] = "rgb(0, 0, 90)";
      }
      if (data[i].levensVoldoening > 6.5 && data[i].levensVoldoening < 7.1) {
        data[i]["bucketCijfer"] = "rgb(0, 0, 120)";
      }
      if (data[i].levensVoldoening > 7) {
        data[i]["bucketCijfer"] = "rgb(0, 0, 150)";
      }
    }

    // maak de cirkels voor de scatterplot
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
         return d["bucketCijfer"];})
       .attr("stroke", "#FFFFFF")

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
       .attr("y",  y(0) + marge.beneden - 3)
       .style("text-anchor", "middle")
       .text("Lucht Vervuiling (percentage)");

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
       .text("Water Kwaliteit (percentage)");

     // voeg een titel aan de scatterplot toe
     svg.append("text")
        .attr("class", "title")
        .attr("x", breedte / 2 )
        .attr("y", marge.boven / 2)
        .attr("font-size", "30px")
        .attr("text-anchor", "middle")
        .text("De relatie tussen de lucht vervuiling en de water kwaliteit per land");

    // cijfer en percentage indicatie aanmaken en de grote van de legenda
    cijfers = ["5.5 of lager", "5.5 tot 6", "6 tot 6.5", "6.5 tot 7", "7 of hoger"]
    percentage = ["0 tot 33", "34 tot 66", "67 tot 100"]
    punten = [1, 5, 10]

    // kleuren aanmaken voor de legenda
    var kleur = d3.scaleOrdinal()
        .domain(["1450"])
        .range(["#00001E", "#00003C", "#00005A","#000078","#000096", "#0000B4"]);

    // maak legenda voor de kleuren
    var legenda1 = svg.append("g")
                     .attr("class", "legend")

    // maak de vakjes voor de legenda
    legenda1.selectAll("rect")
            .data(cijfers)
            .enter().append("rect")
            .attr("height", 8)
            .attr("width", 8)
            .attr("x", marge.links + marge.rechts + 10)
            .attr("y", function(d, i) {
              return i * 16 + 250
            })
            .style("fill", kleur)

    // voeg tekst toe aan de legenda
    legenda1.selectAll("text")
           .data(cijfers)
           .enter()
           .append("text")
           .attr("x", marge.links + marge.rechts + 25)
           .attr("y", function(d, i) {
             return i * 16 + 250 })
           .attr("dy", ".35em")
           .text(function(d,i) {
             return cijfers[i]})

    // maak een lengda voor de stipgroote
    var legenda2 = svg.append("g")
                      .attr("class", "legend")

    // maak de rondjes voor de legenda
    legenda2.selectAll("circle")
           .data(punten)
           .enter().append("circle")
           .attr("cx", marge.links + marge.rechts + 14)
           .attr("cy", function(d,i) {
             return (d+i)*4 + 360;
           })
           .attr("r", function(d){
             return (d+2) })

    // voeg tekst toe aan de legenda
    legenda2.selectAll("text")
            .data(percentage)
            .enter()
            .append("text")
            .attr("x", marge.links + marge.rechts + 32)
            .attr("y", function(d, i) {
             return i * 23 + 362 })
            .attr("dy", ".35em")
            .text(function(d,i) {
             return percentage[i]})

    // voeg extra uitleg aan legenda toe
    svg.append("text")
        .attr("x", marge.links + marge.rechts + 8)
        .attr("y", 240)
        .text("levens voldoening (cijfer)");

    // voeg extra uitleg aan legenda toe
    svg.append("text")
       .attr("x", marge.links + marge.rechts + 8)
       .attr("y", 350)
       .text("zelf gerapporteerde gezondheid (percentage)");

  }

  document.getElementById("jaar2014").onclick = jaartalVeranderen;

  var json = response[jaartal].responseText
  obj = JSON.parse(json);

  // verzamel alle nodige gegeven in data
  var data = []
  for (var i = 0; i < 34; i++) {
    obj0 = obj["structure"]["dimensions"]["observation"]["0"]["values"][i]["id"]
    obj1 = obj["dataSets"]["0"]["observations"][i + ":" + "0:0:0"][0]
    obj2 = obj["dataSets"]["0"]["observations"][i + ":" + "1:0:0"][0]
    obj3 = obj["dataSets"]["0"]["observations"][i + ":" + "2:0:0"][0]
    obj4 = obj["dataSets"]["0"]["observations"][i + ":" + "3:0:0"][0]
    data.push({land: obj0, luchtVervuiling: obj1, waterKwaliteit: obj2, zelfGerapporteerdeGezondheid: obj3, levensVoldoening: obj4});
  };

  // stel hoogte en breedte vast
  var hoogte = 500
  var breedte = 800

  // marges vast leggen
  var marge = {boven: 70, beneden: 50, rechts: 10, links: 70}
  var grafiekHoogte = hoogte - marge.boven - marge.beneden
  var grafiekBreedte = breedte - marge.rechts - marge.links

  // maak een schaalfunctie voor de x waarden
  var x = d3.scaleLinear()
            .domain([0, d3.max(data, function(d) {
              return d["luchtVervuiling"];}) + 2])
            .range([marge.links, grafiekBreedte + marge.links/2])

  // maak een schaalfunctie voor de y waarden
  var y = d3.scaleLinear()
            .domain([0, d3.max(data, function(d) {
              return d["waterKwaliteit"];}) + 5])
            .range([grafiekHoogte + marge.boven, marge.boven])

  // maak een SVG element
  var svg = d3.select("body")
              .append("svg")
              .attr("height", hoogte)
              .attr("width", breedte);

  // stel een kleur vast voor ieder cijfer voor levens voldoening
  var bucketCijfer = []
  for (var i = 0; i < data.length; i++) {
    if (data[i].levensVoldoening < 5.6) {
      data[i]["bucketCijfer"] = "rgb(0, 0, 30)";
    }
    if (data[i].levensVoldoening > 5.5 && data[i].levensVoldoening < 6.1) {
      data[i]["bucketCijfer"] = "rgb(0, 0, 60)";
    }
    if (data[i].levensVoldoening > 6 && data[i].levensVoldoening < 6.6) {
      data[i]["bucketCijfer"] = "rgb(0, 0, 90)";
    }
    if (data[i].levensVoldoening > 6.5 && data[i].levensVoldoening < 7.1) {
      data[i]["bucketCijfer"] = "rgb(0, 0, 120)";
    }
    if (data[i].levensVoldoening > 7) {
      data[i]["bucketCijfer"] = "rgb(0, 0, 150)";
    }
  }

  // maak de cirkels voor de scatterplot
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
       return d["bucketCijfer"];})
     .attr("stroke", "#FFFFFF")

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
     .attr("y",  y(0) + marge.beneden - 3)
     .style("text-anchor", "middle")
     .text("Lucht Vervuiling (percentage)");

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
     .text("Water Kwaliteit (percentage)");

   // voeg een titel aan de scatterplot toe
   svg.append("text")
      .attr("class", "title")
      .attr("x", breedte / 2 )
      .attr("y", marge.boven / 2)
      .attr("font-size", "30px")
      .attr("text-anchor", "middle")
      .text("De relatie tussen de lucht vervuiling en de water kwaliteit per land");

  // cijfer en percentage indicatie aanmaken en de grote van de legenda
  cijfers = ["5.5 of lager", "5.5 tot 6", "6 tot 6.5", "6.5 tot 7", "7 of hoger"]
  percentage = ["0 tot 33", "34 tot 66", "67 tot 100"]
  punten = [1, 5, 10]

  // kleuren aanmaken voor de legenda
  var kleur = d3.scaleOrdinal()
      .domain(["1450"])
      .range(["#00001E", "#00003C", "#00005A","#000078","#000096", "#0000B4"]);

  // maak legenda voor de kleuren
  var legenda1 = svg.append("g")
                   .attr("class", "legend")

  // maak de vakjes voor de legenda
  legenda1.selectAll("rect")
          .data(cijfers)
          .enter().append("rect")
          .attr("height", 8)
          .attr("width", 8)
          .attr("x", marge.links + marge.rechts + 10)
          .attr("y", function(d, i) {
            return i * 16 + 250
          })
          .style("fill", kleur)

  // voeg tekst toe aan de legenda
  legenda1.selectAll("text")
         .data(cijfers)
         .enter()
         .append("text")
         .attr("x", marge.links + marge.rechts + 25)
         .attr("y", function(d, i) {
           return i * 16 + 250 })
         .attr("dy", ".35em")
         .text(function(d,i) {
           return cijfers[i]})

  // maak een lengda voor de stipgroote
  var legenda2 = svg.append("g")
                    .attr("class", "legend")

  // maak de rondjes voor de legenda
  legenda2.selectAll("circle")
         .data(punten)
         .enter().append("circle")
         .attr("cx", marge.links + marge.rechts + 14)
         .attr("cy", function(d,i) {
           return (d+i)*4 + 360;
         })
         .attr("r", function(d){
           return (d+2) })

  // voeg tekst toe aan de legenda
  legenda2.selectAll("text")
          .data(percentage)
          .enter()
          .append("text")
          .attr("x", marge.links + marge.rechts + 32)
          .attr("y", function(d, i) {
           return i * 23 + 362 })
          .attr("dy", ".35em")
          .text(function(d,i) {
           return percentage[i]})

  // voeg extra uitleg aan legenda toe
  svg.append("text")
      .attr("x", marge.links + marge.rechts + 8)
      .attr("y", 240)
      .text("levens voldoening (cijfer)");

  // voeg extra uitleg aan legenda toe
  svg.append("text")
     .attr("x", marge.links + marge.rechts + 8)
     .attr("y", 350)
     .text("zelf gerapporteerde gezondheid (percentage)");
};
