// access token
mapboxgl.accessToken = 'pk.eyJ1IjoibmFsb2FtbzEiLCJhIjoiY2t5Yzdob2lqMDR5aDJvbzRqYm9tYmU1MSJ9.31FYs3oVLTdISgoQFZyONw';

const buses = {};

// Map
let map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/satellite-streets-v11',
  center: [-71.104081, 42.365554],
  zoom: 12,
});

// create a marker for each individual bus
const makeMarker = function (lng, lat) {
  return new mapboxgl.Marker()
    .setLngLat([lng, lat])
    .addTo(map);
};

// update marker
const updateMarker = function (marker, lng, lat) {
  marker.setLngLat([lng, lat]);
};

async function run(){
  const locations = await getBusLocations(); // ping for bus location
  locations.forEach((bus) => {
    if (buses[bus.attributes.label]) {
      updateMarker(buses[bus.attributes.label], bus.attributes.longitude, bus.attributes.latitude); // attempts to update
   } else {
      buses[bus.attributes.label] = makeMarker(bus.attributes.longitude, bus.attributes.latitude); // if it doesnt exist create a marker
   }; 
  });
  setTimeout(run, 1000);
};

// Request bus data from MBTA
async function getBusLocations(){
const url = 'https://api-v3.mbta.com/vehicles?filter[route]=1&include=trip';
const response = await fetch(url);
const json     = await response.json();
return json.data;
};

run();
