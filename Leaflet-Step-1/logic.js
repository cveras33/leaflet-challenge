var myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 5
});

L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

d3.json(queryURL, function(data) {

  function createFeatures(feature){
    return{
      opacity: 1, 
      fillOpacity: 1, 
      fillColor: colorRetrieval(feature.geometry.coordinates[2]),
      color: "black",
      radius: radiusRetrieval(feature.properties.mag),
      stroke: true, 
      weight: .5, 
    }; 

  }

  function colorRetrieval(depth){
    switch(true){
      case depth > 90: 
        return "#ff3300"; 
      case depth > 70: 
        return "#ff8533"; 
      case depth > 50: 
        return "#ffb366"; 
      case depth > 30: 
        return "#ffd11a"; 
      case depth > 10: 
        return "#d5ff80";
      default: 
        return "#80ff00"; 
    }
  }

  function radiusRetrieval(mag){
    if(mag === 0){
      return 1; 
    }
    return mag * 4; 
  }

  L.geoJson(data, {
    pointToLayer: function(feature, latlng){
      return L.circleMarker(latlng); 
      },
    style: createFeatures,
    onEachFeature: function(feature, layer){
      layer.bindPopup(
        "mag: " + feature.properties.mag + "<br>location: " + feature.properties.place
      );
    }
  }).addTo(myMap);

  var legend = L.control({
    position: "bottomright"

  });
  legend.onAdd = function(){
    var div = L.DomUtil.create("div", "info legend"); 
    var colors = ["#80ff00", "#d5ff80", "#ffd11a", "#ffb366", "#ff8533", "#ff3300"];
    var color_values = [-10, 10, 30, 50, 70, 90];

    for(var i = 0; i < color_values.length; i++){
      div.innerHTML += '<i style="background: ' + colors[i] + '"></i>' + 
      color_values[i] + (color_values[i + 1] ? '&ndash;' + color_values[i+1] + '<br>' : '+');
    }
    return div; 
  };

  legend.addTo(myMap);


});

