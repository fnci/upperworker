mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/dark-v11',
center: area.geometry.coordinates,
zoom: 15,
});

// Set marker options.
const marker = new mapboxgl.Marker({
    color: "#FF5722",
    draggable: true
}).setPopup(
    new mapboxgl.Popup({offset: 25})
    .setHTML(`<h5>${area.title}</h5><p>${area.location}</p>`)
).setLngLat(area.geometry.coordinates)
    .addTo(map);

/* function onDragEnd() {
const lngLat = marker.getLngLat();
coordinates.style.display = 'block';
coordinates.innerHTML = `Longitude: ${lngLat.lng}<br />Latitude: ${lngLat.lat}`;
}

marker.on('dragend', onDragEnd); */