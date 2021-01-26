// Create a map object
var myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 3
});

L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

// Retrieve data 
var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson"; 

// Make call to data 
// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {

  function createFeatures(feature){
    return{
      opacity: 1, 
      fillOpacity: 1, 
      fillColor: colorRetrieval(feature.geometry.coordinates[2]),
      color: "#00000",
      //build function to retrieve radius based on magnitude -- function name: radiusRetrieval()
      radius: radiusRetrieval(feature.properties[0]),
      stroke: True, 
      weight: 0.5, 
    }; 

  }

  function colorRetrieval(depth){
    switch(True){
      case depth > 90: 
        return "#0000cc"; 
      case depth > 70: 
        return "#00cc00"; 
      case depth > 50: 
        return "#ff9933"; 
      case depth > 30: 
        return "#ff33cc"; 
      case depth > 10: 
        return "#ffff00";
      default: 
        return "#9933ff"; 
    }
  }

  function radiusRetrieval(mag){
    if(mag === 0){
      return 1; 
    }
    
    return mag * 3; 

  }

  L.geoJson(data, {
    pointToLayer: function(feature, latlng){
      return 
        L.circleMarker (latlng); 
        style: createFeatures
      },
    
    style: function(feature) {
      return {
        color: "white",
        fillColor: chooseColor(feature.properties.borough),
        fillOpacity: 0.5,
        weight: 1.5
      };
    }
  }).addTo(myMap);

  // Once we get a response, send the data.features object to the createFeatures function
  //createFeatures(data.features);
});


