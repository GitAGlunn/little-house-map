var markers = []

//var GeoJSON = require('geojson');
//var fs = require('fs');

//var convertedData = null;
//var returnData = function () {
// $.ajax({
//         async: false,
//         url: "http://localhost:3000/locations",
//         type: 'GET',
//         dataType: 'json', // added data type
//         success: function(res) {
//             console.log(res);
//             convertedData = GeoJSON.parse(res, {Point: ['Latitude', 'Longitude']});
//             console.log(convertedData);
//         }
//     });
//     return convertedData;
//   }();



// fs.appendFile('store-list.geojson', JSON.stringify(results), function (err) {
//     if (err) return console.log(err);
//     console.log('Hello World > helloworld.txt');
//     });





var pointsJSON = 'https://little-house-foods.herokuapp.com/locations';
//var pointsJSON = 'http://localhost:3000/locations';
//var pointsJSON = '/test.geojson';
var nhoodJSON = 'https://cdn.glitch.com/cf5dbcff-c39e-43dc-8826-13e124b578d9%2FBubbler_ct_for_Parks.geojson?1500858269830'
var parksJSON = 'https://opendata.arcgis.com/datasets/03c05d0d0b0243c1be34f1c7e5c9bb40_35.geojson'


var tiles = window.L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  })

var grayTiles = window.L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});


var map = window.L.map('map', {
    center: [45.5231,-122.6765],
    zoom: 13,
    layers: [tiles, grayTiles ]
});

var baseMaps = {
      "Streets": tiles,
    "Grayscale": grayTiles
};


var nhoodLayer = window.L.geoJSON(null, { style: nhoodStyle })
var parksLayer = window.L.geoJSON(null, { style: parksStyle })


var clusters = window.L.markerClusterGroup()

var pointLayer = window.L.geoJSON(null, {
  pointToLayer: function (feature, latlng) {
    return new window.L.CircleMarker(latlng, {
      radius: 30,
      fillColor: "#A463F2",
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.4
    })
  }, onEachFeature: onEachFeature })

window.L.control.layers(baseMaps).addTo(map);
tiles.addTo(map)

$("#all").click(function () {
    map.addLayer(pointLayer)
    nhoodLayer.addTo(map).bringToBack()
    map.addLayer(parksLayer)
    map.addLayer(clusters)
    map.addLayer(allMarkers)
})


$("#parks").click(function () {
    map.removeLayer(pointLayer)
    map.removeLayer(nhoodLayer)
    map.removeLayer(clusters)
    map.addLayer(parksLayer)
    map.removeLayer(allMarkers)
})


$("#bubblers").click(function () {
    map.addLayer(pointLayer)
    map.removeLayer(parksLayer)
    map.removeLayer(nhoodLayer)
    map.addLayer(allMarkers)
    map.addLayer(clusters)
})

$("#layerDB").click(function () {
    map.removeLayer(pointLayer)
    map.removeLayer(parksLayer)
    map.removeLayer(nhoodLayer)
    map.removeLayer(allMarkers)
    map.removeLayer(clusters)
})


var allMarkers = window.L.geoJSON(null, {
  pointToLayer: randomMarker,
}).addTo(map)

function createMarkerData (e) {
  return {
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [e.latlng.lng, e.latlng.lat]
    }
  }
}

function plotDB () {


}

map.on('click', function (e) {
  var feature = createMarkerData(e)

  db.put(e.latlng.lng, e.latlng.lat)
  db.get(e.latlng.lng, function (err, value) {
    if (err) return console.log('Ooops!', err) // likely the key was not found
    console.log('longitude' + e.latlng.lng + ' ' + 'latitude:' + value)
  })

  markers.push(feature)
  console.log(feature)
  allMarkers.addData(markers)
})


getData(nhoodJSON, function (err, data) {
 if (err) return console.error(err)
 nhoodLayer.addData(data)
 nhoodLayer.addTo(map).bringToBack() // we want these shapes in the back
})



getData(parksJSON, function (err, data) {
 if (err) return console.error(err)
 parksLayer.addData(data)
 parksLayer.addTo(map)
})



getData(pointsJSON, function (err, data) {
 if (err) return console.error(err)
  convertedData = GeoJSON.parse(data, {Point: ['Latitude', 'Longitude']});
  console.log(convertedData);
  pointLayer.addData(convertedData)
  //  pointLayer.addData(data)
// map.fitBounds(pointLayer.getBounds()) // fit map bounds to point data
  pointLayer.addTo(map) // add markers without clustering

 clusters.addLayer(pointLayer)
      clusters.addTo(map)
  })


function nhoodStyle(feature) {
  return {
    fillColor: getColor(feature.properties.NUMPOINTS),
    weight: 2,
    opacity: .8,
    color: 'white',
    dashArray: '0',
    fillOpacity: 0.7
  }

  function getColor(d) {
    return d < 1 ? '#ffffff' :
           d < 2 ? '#c8ddf0' :
           d < 3 ? '#73b3d8' :
           d < 4 ? '#2879b9' :
           d < 5 ? '#08306b' :
                    '#08306b'
  }
}


function parksStyle(feature) {
  return {
    fillColor: '#7b935b',
    weight: 2,
    opacity: 0,
    color: 'white',
    dashArray: '0',
    fillOpacity: 0.7
  }
}


function onEachFeature (feature, marker) {
  marker.on({
    click: marker.bindPopup(`<p>Location: ${feature.properties.COMMENTARY}`)
  })
}




function getData (url, cb) {

  var xhr = new XMLHttpRequest()
  xhr.open('GET', url, true)
  xhr.responseType = 'json'
  xhr.setRequestHeader('Accept', 'application/json')
  xhr.onload = function () {
    if (xhr.readyState !== 4) return // readyState = 4 when DONE
    if (xhr.status !== 200 && xhr.response) return cb(xhr.response) // Check we got a successful response, if not return error

    // successful xhr
    cb(null, xhr.response)
  }
  xhr.send()
}


function randomMarker (feature, latlng) {
  var icon = new window.L.Icon({
    iconUrl: `https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  })

  var marker = window.L.marker(latlng, {icon: icon})
  return marker
}
