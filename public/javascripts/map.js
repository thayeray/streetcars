// <app-root>/public/javascripts/map.js

// start leaflet map
let map = L.map('map', {
    center: [39.29564, -76.60689], //coordinates for Baltimore
    zoom: 13,
    minZoom: 4,
    maxZoom: 19
});

// add basemap
L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// fetch the data from our API and render it on the map:
$.getJSON('/api/streetcars', function(data) {
    L.geoJson(data, {
        style: {
            color: "#5322A4",
            opacity: 0.4,
            weight: 3
        }
    }).addTo(map);
});