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
    var marge = {boven: 70, beneden: 50, rechts: 20, links: 100}
    var grafiekHoogte = hoogte - marge.boven - marge.beneden
    var grafiekBreedte = breedte - marge.rechts - marge.links

    // creëer een format voor een afbeelding
    var svg = d3.select("body")
        .append("svg")
        .attr("height", hoogte)
        .attr("width", breedte)

    // bepaal maximale waarden en de breedte van een staaf
    var maxWaarde = Math.max.apply(Math, sterren.map(function(d) {
      return d.aantalOvernachtingen
    }))
    var grens = 10

    // tekst voor bij de legenda
    var soortSterren = ["geen enkele ster", "1 ster", "2 sterren", "3 sterren", "4 sterren", "5 sterren"]


    // maak een schaalfunctie voor de x waarden
    var x = d3.scaleBand()
              .range([0, grafiekBreedte], .1)

    // maak een schaalfunctie voor de y waarden
    var y = d3.scaleLinear([maxWaarde, 0])
              .range([grafiekHoogte, 0])

    x.domain(sterren.map(function(d) {
      return d.soortHotel
    }))
    y.domain([0, Math.max.apply(Math, sterren.map(function(d) {return d.aantalOvernachtingen }))])

    // creëer alle staven
    var staaf = svg.selectAll("rect")
        .data(sterren)
        .enter()
        .append("rect")

        // zet de staaf op de juiste positie
        .attr("x", function(d, i) {
            return x(d.soortHotel) + marge.links + grens; })
        .attr("y", function(d) {
            return y(d.aantalOvernachtingen) + marge.boven; })

        // geef de staaf de juiste hoogte en breedte mee
        .attr("width", x.bandwidth() - grens)
        .attr("height", function(d) {
            return grafiekHoogte - y(d.aantalOvernachtingen); })

        // geef de staaf een kleur en rand
        .attr("fill", "Navy")
        .attr("stroke", "Black")

        // maak de staven interactief
        .on("mouseover", function() {
            infoKnop2.style("display", null);
            d3.select(this).style("fill", "SlateGray");})
        .on("mouseout", function() {
            infoKnop2.style("display", "none");
            d3.select(this).style("fill", "Navy");})
        .on("mousemove", function(d) {
            var xPos = d3.mouse(this)[0] - marge.rechts;
            var yPos = d3.mouse(this)[1] - marge.beneden;
            infoKnop2.attr("transform", "translate(" + xPos + "," + yPos + ")")
            infoKnop2.select("text").text(d.aantalOvernachtingen);});

    // creëer een infoKnop
    var infoKnop2 = svg.append("g")
                       .attr("class", "tooltip")
                       .style("display", "none");

    // voeg de informatie toe aan de infoKnop
    infoKnop2.append("text")
             .attr("x", 15)
             .attr("dy", "1.2em")
             .style("text-anchor", "middle")
             .attr("font-size", "12px")
             .attr("font-weight", "bold");

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
       .text("Soort Hotel");

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
       .attr("y", 0 + marge.beneden)
       .attr("x", 0 - (hoogte / 2))
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
      .text("Het aantal overnachtingen dat plaats vindt in verschillende soorten hotels");

  }
};


function barchart(error, response) {



}
