window.onload = function() {
  // creëer een infoKnop
  var infoKnop = d3.select("body").append("g")
      .attr("class", "tooltip");

  d3.queue()
  .defer(d3.json, "overnachtingen.json")
  .defer(d3.json, "sterren.json")
  .defer(d3.xml, "Map_of_Europe.svg")
  .awaitAll(grafieken);

  function grafieken(error, response) {
    if (error) throw error;

    var overnachtingen = response["0"]["data"]
    var sterren = response["1"]["data"]

    document.body.appendChild(response[2].documentElement);

    var svg = d3.selectAll("#Nederland, #Duitsland, #Belgie, #VerenigdKoninkrijk, #Ierland, #Frankrijk, #Italie, #Spanje, #Portugal, #Oostenrijk, #Griekenland, #Denemarken, #Polen, #Rusland")
      .style("fill", "Navy")
      .data(overnachtingen)
      // maak de staven interactief
      .on("mouseover", function() {
          infoKnop.style("display", null);
          d3.select(this).style("fill", "SlateGray");})
      .on("mouseout", function() {
          infoKnop.style("display", null);
          d3.select(this).style("fill", "Navy");})
      .on("mousemove", function(d) {
          infoKnop.html("Vanuit " + d.Land + " overnachten " + d.Overnachtingen + " duizend mensen in Nederland (2012)<br/>")
        });

    // stel hoogte en breedte vast
    var hoogte = 600
    var breedte = 700

    // marges vast leggen
    var marge = {boven: 70, beneden: 50, rechts: 250, links: 70}
    var grafiekHoogte = hoogte - marge.boven - marge.beneden
    var grafiekBreedte = breedte - marge.rechts - marge.links

    // creëer een format voor een afbeelding
    var svg = d3.select("body")
        .append("svg")
        .attr("height", hoogte)
        .attr("width", breedte)

    // bepaal maximale waarden en de breedte van een staaf
    var maxWaarde = Math.max(...sterren)
    var staafBreedte = (breedte - (sterren.length - 1)) / sterren.length
    var jaren = ["2012", "2013", "2014", "2015"]
    // tekst voor bij de legenda
    var soortSterren = ["geen enkele ster", "1 ster", "2 sterren", "3 sterren", "4 sterren", "5 sterren"]


    // maak een schaalfunctie voor de x waarden
    var x = d3.scaleBand()
              .rangeRound([0, grafiekBreedte + marge.links/2])

    // maak een schaalfunctie voor de y waarden
    var y = d3.scaleLinear()
              .rangeRound([grafiekHoogte, 0])

    x.domain(sterren.map(function(d) {
      return d.jaar
    }))
    y.domain([0, d3.max(sterren, function(d) {
      return d.
    })])

    // creëer een x-as
    var asX = d3.axisBottom(x);

    // voeg de x-as en waarden toe
    svg.append("g")
       .attr("class", "axis")
       .attr("transform", "translate(" + marge.links + "," + (grafiekHoogte + marge.boven) + ")")
       .call(asX)
       .attr("font-size", "10px");

    // geef de x-as een titel
    svg.append("text")
       .attr("x", (breedte - marge.rechts + marge.links)/ 2 )
       .attr("y",  y(0) + marge.beneden + marge.boven)
       .style("text-anchor", "middle")
       .text("Jaar");

    // creëer een y-as
    var asY = d3.axisLeft(y)

    // voeg de y-as en waarden toe
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + marge.links + "," +  marge.boven + ")")
        .call(asY)
        .attr("font-size", "10px");

    // geef de y-as een titel
    svg.append("text")
       .attr("transform", "rotate(-90)")
       .attr("y", 0 + 20)
       .attr("x",0 - (hoogte / 2))
       .attr("dy", "1em")
       .style("text-anchor", "middle")
       .text("Aantal overnachtingen in Nederland x1000");

   // voeg een titel aan de scatterplot toe
   svg.append("text")
      .attr("class", "title")
      .attr("x", breedte / 2 )
      .attr("y", marge.boven / 2 - 20)
      .attr("font-size", "22px")
      .attr("text-anchor", "middle")
      .text("Het aantal overnachtingen dat plaatst vindt in verschillende soorten hotels");


    // kleuren aanmaken voor de legenda
    var kleur = d3.scaleOrdinal()
                  .domain(["1450"])
                  .range(["#eff3ff", "#c6dbef", "#9ecae1","#6baed6","#4292c6", "#2171b5", "#084594"]);

    // maak legenda voor de kleuren
    var legenda = svg.append("g")
                     .attr("class", "legend")

    // maak de vakjes voor de legenda
    legenda.selectAll("rect")
           .data(soortSterren)
           .enter().append("rect")
           .attr("height", 8)
           .attr("width", 8)
           .attr("x", grafiekBreedte + marge.links + 50)
           .attr("y", function(d, i) {
             return i * 16 + marge.boven})
           .style("fill", kleur)

    // voeg tekst toe aan de legenda
    legenda.selectAll("text")
           .data(soortSterren)
           .enter()
           .append("text")
           .attr("x", grafiekBreedte + marge.links + 75)
           .attr("y", function(d, i) {
             return i * 16 + marge.boven})
           .attr("dy", ".35em")
           .text(function(d,i) {
             return soortSterren[i]})

    // voeg extra uitleg aan legenda toe
    svg.append("text")
       .attr("x", grafiekBreedte + marge.links + 50)
       .attr("y", marge.boven - 10)
       .text("Aantal sterren van ieder hotel");
  }
};


function barchart(error, response) {



}
