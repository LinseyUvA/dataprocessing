/*
 * Naam: Linsey Schaap
 * Studentnummer: 11036109
 *
 * Dit script haalt de gegevens op van het aantal overnachtingen dat plaats vindt in Nederland.
 * Hierbij wordt onderscheid gemaakt tussen verschillende landen en het soort hotel waar deze gasten in verblijven.
 *
**/
// stel hoogte en breedte vast
var hoogte = 600
var breedte = 700

// marges vast leggen
var marge = {boven: 70, beneden: 50, rechts: 20, links: 100}
var grafiekHoogte = hoogte - marge.boven - marge.beneden
var grafiekBreedte = breedte - marge.rechts - marge.links
var grens = 10

// creëer een format voor een afbeelding
var svg = d3.select("body")
            .append("svg")
            .attr("height", hoogte)
            .attr("width", breedte)



window.onload = function() {

  d3.queue()
    .defer(d3.json, "overnachtingen.json")
    .defer(d3.json, "sterren.json")
    .defer(d3.xml, "Map_of_Europe.svg")
    .awaitAll(grafieken);


  var sterren = []
  var overnachtingen = []
  var land = "Europa"

  function grafieken(error, response) {
    if (error) throw error;

    kaart(response)
    staafdiagram(response)

  }
};

function kaart(response) {

  // creëer een infoKnop
  var infoKnop = d3.select("body").append("g")
                   .attr("class", "tooltipje");

  // data opslaan
  var overnachtingen = response["0"]["data"]
  var sterren = response["1"]["data"]
  document.body.appendChild(response[2].documentElement);

  europa(sterren)
  document.getElementById("knop").onclick = function() {europa(sterren)};


  // maak een schaalfunctie voor de x waarden
  var x = d3.scaleBand()
            .range([0, grafiekBreedte], .1)

  var svg = d3.selectAll("#Nederland, #Duitsland, #Belgie, #VerenigdKoninkrijk, #Ierland, #Frankrijk, #Italie, #Spanje, #Portugal, #Oostenrijk, #Griekenland, #Denemarken, #Polen, #Rusland")
              .style("fill", "Indigo")
              .data(overnachtingen)
              // maak de staven interactief
              .on("mouseover", function() {
                  infoKnop.style("display", null);
                  d3.select(this).style("fill", "SlateGray");})
              .on("mouseout", function() {
                  infoKnop.style("display", null);
                  d3.select(this).style("fill", "Indigo");})
              .on("mousemove", function(d) {
                  infoKnop.html("Vanuit " + d.Land + " overnachten " + d.Overnachtingen + " duizend mensen in Nederland (2012)<br/>")})
              .on("click", function(d) {
                  updateStaafdiagram(d.Land, sterren)})

}

function staafdiagram(response) {
  // data opslaan
  var sterren = response["1"]["data"]

  // creëer een format voor een afbeelding
  var svg = d3.select("body")
              .append("svg")
              .attr("class", "bar")
              .attr("height", hoogte)
              .attr("width", breedte)

  // sla de data voor alleen europa op
  ster = []
  for (var i = 0; i < sterren.length; i++) {
    if (sterren[i].Land == "Europa"){
      ster.push(sterren[i])
    }
  }

  // bepaal maximale waarden en de breedte van een staaf
  var maxWaarde = Math.max.apply(Math, ster.map(function(d) {
    return d.aantalOvernachtingen
  }))

  // maak een schaalfunctie voor de x waarden
  var x = d3.scaleBand()
            .range([0, grafiekBreedte], .1)

  // maak een schaalfunctie voor de y waarden
  var y = d3.scaleLinear([maxWaarde, 0])
            .range([grafiekHoogte, 0])

  x.domain(ster.map(function(d) {
    return d.soortHotel}))
  y.domain([0, maxWaarde])


  // creëer alle staven
  var staaf = svg.selectAll("rect")
                 .data(ster)
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
                 .attr("fill", "Indigo")
                 .attr("stroke", "Black")

                 // maak de staven interactief
                 .on("mouseover", function() {
                     infoKnop2.style("display", null);
                     d3.select(this).style("fill", "SlateGray");})
                 .on("mouseout", function() {
                     infoKnop2.style("display", "none");
                     d3.select(this).style("fill", "Indigo");})
                 .on("mousemove", function(d) {
                     var xPos = d3.mouse(this)[0] - marge.rechts;
                     var yPos = d3.mouse(this)[1] - marge.beneden;
                     infoKnop2.attr("transform", "translate(" + xPos + "," + yPos + ")")
                     infoKnop2.select("text").text(d.aantalOvernachtingen);})


  // creëer een infoKnop
  var infoKnop2 = svg.append("g")
                     .attr("class", "tooltipje")
                     .style("display", "none");

  // voeg de informatie toe aan de infoKnop
  infoKnop2.append("text")
           .attr("x", 15)
           .attr("dy", "1.2em");

  // creëer een x-as
  var asX = d3.axisBottom(x);

  // voeg de x-as en waarden toe
  svg.append("g")
     .attr("class", "xAs")
     .attr("transform", "translate(" + marge.links + "," + (grafiekHoogte + marge.boven) + ")")
     .call(asX);

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
      .attr("class", "yAs")
      .attr("transform", "translate(" + marge.links + "," +  marge.boven + ")")
      .call(asY);

  // geef de y-as een titel
  svg.append("text")
     .attr("transform", "rotate(-90)")
     .attr("y", 0 + marge.rechts)
     .attr("x", 0 - (hoogte / 2))
     .attr("dy", "1em")
     .style("text-anchor", "middle")
     .text("Aantal overnachtingen in Nederland x1000");

  // voeg een titel aan de staafdiagram toe
  svg.append("text")
     .attr("class", "title")
     .attr("x", breedte / 2 )
     .attr("y", marge.boven / 2 - 20)
     .text("Het aantal overnachtingen dat plaats vindt in verschillende soorten hotels");

  // voeg een ondertitel aan de staafdiagram toe
  svg.append("text")
     .attr("class", "ondertitel")
     .attr("x", breedte / 2)
     .attr("y", marge.boven / 2 + 10)
     .text("Europa")
}


function updateStaafdiagram(land, sterren) {
  d3.selectAll("rect").remove()
  d3.selectAll(".ondertitel").remove()
  d3.selectAll(".yAs").remove()

  var svg = d3.select("body")
              .select(".bar")
              .attr("height", hoogte)
              .attr("width", breedte)

  // sla de data voor het land waar op geklikt wordt op
  ster = []
  for (var i = 0; i < sterren.length; i++) {
    if (sterren[i].Land == land){
      ster.push(sterren[i])
    }
  }

  // bepaal maximale waarden en de breedte van een staaf
  var maxWaarde = Math.max.apply(Math, ster.map(function(d) {
    return d.aantalOvernachtingen
  }))

  // maak een schaalfunctie voor de x waarden
  var x = d3.scaleBand()
            .range([0, grafiekBreedte], .1)

  // maak een schaalfunctie voor de y waarden
  var y = d3.scaleLinear([maxWaarde, 0])
            .range([grafiekHoogte, 0])

  x.domain(ster.map(function(d) {
    return d.soortHotel}))
  y.domain([0, maxWaarde])

  // creëer alle staven
  var staaf = svg.selectAll("rect")
                 .data(ster)
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
                .attr("fill", "Indigo")
                .attr("stroke", "Black")

                // maak de staven interactief
                .on("mouseover", function() {
                    infoKnop2.style("display", null);
                    d3.select(this).style("fill", "SlateGray");})
                .on("mouseout", function() {
                    infoKnop2.style("display", "none");
                    d3.select(this).style("fill", "Indigo");})
                .on("mousemove", function(d) {
                    var xPos = d3.mouse(this)[0] - marge.rechts;
                    var yPos = d3.mouse(this)[1] - marge.beneden;
                    infoKnop2.attr("transform", "translate(" + xPos + "," + yPos + ")")
                    infoKnop2.select("text").text(d.aantalOvernachtingen);})


  // creëer een infoKnop
  var infoKnop2 = svg.append("g")
                     .attr("class", "tooltipje")
                     .style("display", "none");

  // voeg de informatie toe aan de infoKnop
  infoKnop2.append("text")
           .attr("x", 15)
           .attr("dy", "1.2em");

 // creëer een y-as
 var asY = d3.axisLeft(y)

 // voeg de y-as en waarden toe
 svg.append("g")
     .attr("class", "yAs")
     .attr("transform", "translate(" + marge.links + "," +  marge.boven + ")")
     .call(asY);

  // voeg een ondertitel aan de staafdiagram toe
  svg.append("text")
     .attr("class", "ondertitel")
     .attr("x", breedte / 2)
     .attr("y", marge.boven / 2 + 10)
     .text(land)
}


function europa(sterren) {
  console.log("hoi")
  console.log(sterren)
  // if (document.getElementsByClassName("btn")){
  updateStaafdiagram("Europa", sterren)
  // }
}
