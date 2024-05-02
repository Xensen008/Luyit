mapboxgl.accessToken = maptoken;
    

const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: coordinates, // starting position [lng, lat]
    zoom: 10 // starting zoom
});
const marker = new mapboxgl.Marker({color: "red"})
.setLngLat(coordinates)
.setPopup(
    new mapboxgl.Popup({ offset: 25 })
.setHTML(`<h4>${listingLocation}</h4><p>Exact location provided after booking</p>`)
)
.addTo(map);