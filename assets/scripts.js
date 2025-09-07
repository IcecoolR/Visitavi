"use strict";

const mapViewBtn = document.getElementById("mapViewBtn");
const aboutBtn = document.getElementById("aboutBtn");

const mapViewSection = document.getElementById("mapViewSection");
const aboutSection = document.getElementById("aboutSection");


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
  center: [47.040182144806664, 9.667968750000002],
  zoom: 3,
  minZoom: 2,
  maxZoom: 7
});

var bounds = L.latLngBounds(
  L.latLng(-65, -180), // Southwest corner
  L.latLng(90, 180)  // Northeast corner
);
map.setMaxBounds(bounds);
map.on('drag', function() {
    map.panInsideBounds(bounds, { animate: false });
});
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


// Countries
const geojson = L.geoJson(countries).addTo(map);

geojson.eachLayer((layer) => {
  layer.bindPopup(layer.feature.properties.name);
});


