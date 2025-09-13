"use strict";

const mapViewBtn = document.getElementById("mapViewBtn");
const aboutBtn = document.getElementById("aboutBtn");
const resetMapbtn = document.getElementById("resetMapbtn");

const mapViewSection = document.getElementById("mapViewSection");
const aboutSection = document.getElementById("aboutSection");

var visitedStatus = new Map();

if (localStorage.visitedStatus) { visitedStatus = new Map(JSON.parse(localStorage.visitedStatus)); }

const totalPlacesVisited = document.getElementById("totalPlacesVisited");
const totalPlaces = document.getElementById("totalPlaces");
const percentComplete = document.getElementById("percentComplete");

var unvisitedColor = '#4169E1';
var plannedColor = '#FEB204';
var visitedColor = '#008000';


const mapViewBtnHandler = (e) => {
  if (e.type == "click" || e.code == "Enter" || e.code == "NumpadEnter") {
    mapViewSection.classList.add("active");
    aboutSection.classList.remove("active");
  }
}

const aboutBtnHandler = (e) => {
  if (e.type == "click" || e.code == "Enter" || e.code == "NumpadEnter") {
    aboutSection.classList.add("active");
    mapViewSection.classList.remove("active");
  }
}

mapViewBtn.addEventListener("click", mapViewBtnHandler);
mapViewBtn.addEventListener("keydown", mapViewBtnHandler);

aboutBtn.addEventListener("click", aboutBtnHandler);
aboutBtn.addEventListener("keydown", aboutBtnHandler);


/* Section for interactive map */

const map = L.map('map', {
  center: [35, 0],
  zoom: 3,
  minZoom: 2,
  maxZoom: 13
});

var bounds = L.latLngBounds(
  L.latLng(-65, -180), // Southwest corner
  L.latLng(90, 180)  // Northeast corner
);
map.setMaxBounds(bounds);
map.on('drag', function() { map.panInsideBounds(bounds, { animate: false }); });

map.createPane('labels');

// This pane is above markers but below popups
map.getPane('labels').style.zIndex = 650;

// Layers in this pane are non-interactive and do not obscure mouse/touch events
map.getPane('labels').style.pointerEvents = 'none';

// Sets the cartodbAttribution variable
const cartodbAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attribution">CARTO</a>';


// // Draws country boarders
// const positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
//   noWrap: true,
//   bounds: [[-90, -180], [90, 180]],
//   attribution: cartodbAttribution
// }).addTo(map);

// Adds country labels
const positronLabels = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png', {
  noWrap: true,
  bounds: [[-90, -180], [90, 180]],  
  attribution: cartodbAttribution,
	pane: 'labels'
}).addTo(map);


/* Section for countries */

function featureClickHandler(feature, layer) {
  layer.on('click', function (e) {

    // console.log('');
    // console.log(e.latlng);
    // console.log(layer.feature.properties.name + '/' + layer.feature.properties.iso_a3 + ' pressed with fill colour ' + layer.options.fillColor);

    if (layer.options.fillColor == unvisitedColor) {

      layer.setStyle({ fillColor: plannedColor });
      visitedStatus.set(layer.feature.properties.iso_a3, 1);

    } else if (layer.options.fillColor == plannedColor) {
      
      layer.setStyle({ fillColor: visitedColor });
      visitedStatus.set(layer.feature.properties.iso_a3, 2);

    } else if (layer.options.fillColor == visitedColor) {

      layer.setStyle({ fillColor: unvisitedColor });
      visitedStatus.delete(layer.feature.properties.iso_a3);

    }

    localStorage.visitedStatus = JSON.stringify(Array.from(visitedStatus.entries()));

    generateStats();

    // console.log('Storage updated: ' + localStorage.visitedStatus);

  });
}

function featureSetStyle(feature) {
  if (visitedStatus.get(feature.properties.iso_a3) == 1) {
    return {
      fillColor: plannedColor
    };
  } else if (visitedStatus.get(feature.properties.iso_a3) == 2) {
    return {
      fillColor: visitedColor
    };
  } else {
    return {
      fillColor: unvisitedColor
    };
  }
}

var geojson = L.geoJson(countries, {
  onEachFeature: featureClickHandler,
  style: featureSetStyle
}).addTo(map);

const resetMapBtnHandler = (e) => {
  if (e.type == "click" || e.code == "Enter" || e.code == "NumpadEnter") {
    visitedStatus.clear();
    localStorage.clear();

    generateStats();

    map.removeLayer(geojson);

    geojson = L.geoJson(countries, {
      onEachFeature: featureClickHandler,
      style: featureSetStyle
    }).addTo(map);

  }
}

resetMapbtn.addEventListener("click", resetMapBtnHandler);
resetMapbtn.addEventListener("keydown", resetMapBtnHandler);


// For debuging countries purposes:
// for (let i = 0; i < countries.features.length; i++) {
//   // if ( countries.features[i].properties.type.toString() != "Sovereign country" && countries.features[i].properties.type.toString() != "Country"  ) {
//   //     console.log(countries.features[i].properties.name);
//   // }
//   console.log(countries.features[i].properties.region_un);
// }


/* Section for stats */

function generateStats() {

  let placesVisited = new Map(
    [...visitedStatus.entries()].filter(([key, value]) => value == "2")
  );

  totalPlacesVisited.textContent = placesVisited.size;

  totalPlaces.textContent = countries.features.length;

  percentComplete.textContent = Number.parseFloat((placesVisited.size / countries.features.length *100).toFixed(2)) + '%';

  document.getElementById("progressBar").style.width = percentComplete.textContent;

}

generateStats();