// file responsible for world/templates/map javascript

var map;
var marker = null, circle = null;

var irelandBounds = [[51.3, -10.5], [55.5, -5.5]];

let addMarkerMode = false; 

map = L.map('map', {
    center: [53.0, -8.0],
    zoom: 7, 
    maxBounds: irelandBounds,
    maxBoundsViscosity: 1.0 
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18, 
    minZoom: 6 
}).addTo(map);

var markers = L.markerClusterGroup({
    disableClusteringAtZoom: 17 
});

// logic for assigning marker colours
const blueIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const goldIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-gold.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const redIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41], 
    iconAnchor: [12, 41], 
    popupAnchor: [1, -34], 
    shadowSize: [41, 41] 
});

const greenIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const orangeIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const greyIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// fetch amenities and add to map
const fetchAmenities = async (filterParams = {}) => {
    
    const queryParams = new URLSearchParams();
    if (filterParams.amenity) {
        filterParams.amenity.forEach((amenity) => queryParams.append('amenity', amenity));
    }
    if (filterParams.name) {
        queryParams.append('name', filterParams.name); 
    }

    const url = `/api/amenities/places/?${queryParams.toString()}`;
    try {
        const response = await fetch(url, {
            headers: {
                Accept: 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            },
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();

        markers.clearLayers();

        // logic for assigning marker colours and adding markers to map
        if (data.features.length > 0) {
            data.features.forEach((feature) => {
                const { latitude, longitude, name, amenity } = feature.properties;
                let icon;
                if (amenity === 'pub') {
                    icon = blueIcon;
                } else if (amenity === 'restaurant') {
                    icon = goldIcon;
                } else if (amenity === 'cafe') {
                    icon = redIcon;
                } else if (amenity === 'bar') {
                    icon = greenIcon;
                } else if (amenity === 'fast_food') {
                    icon = orangeIcon;
                } else {
                    icon = greyIcon;
                }
                const amenityMarker = L.marker([latitude, longitude], { icon });
                amenityMarker.bindPopup(`<b>${name}</b><br>${amenity}`);
                markers.addLayer(amenityMarker);
            });

            map.addLayer(markers);

            // zoom in on first result if data is only one
            if (filterParams.name && data.features.length === 1) {
                const firstFeature = data.features[0];
                map.setView(
                    [firstFeature.properties.latitude, firstFeature.properties.longitude],
                    15
                ); 
            }
        } else {
            alert('No amenities found matching your search.');
        }
    } catch (error) {
        console.error('Error fetching amenities:', error);
        alert('Failed to fetch amenities. Check the console for details.');
    }
};

// filter interaction
document.getElementById('filter-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const selectedAmenities = Array.from(document.querySelectorAll('input[name="amenity"]:checked'))
        .map(input => input.value);

    fetchAmenities({ amenity: selectedAmenities });
});

// add amenity marker button
document.getElementById('toggle-marker-mode').addEventListener('click', () => {
    addMarkerMode = !addMarkerMode; // Toggle the mode
    const statusText = document.getElementById('marker-mode-status');
    statusText.innerHTML = `Marker mode is <strong>${addMarkerMode ? 'enabled' : 'disabled'}</strong>`;
});

let selectedLatLng = null; 

// clicking on map logic
map.on('click', (e) => {

    if (!addMarkerMode) {
        return; 
    }
   
    selectedLatLng = e.latlng;

    if (marker) {
        map.removeLayer(marker); 
    }
    marker = L.marker([selectedLatLng.lat, selectedLatLng.lng]).addTo(map);

    // popup for adding amenity
    const formHtml = `
        <div>
            <h5>Add Amenity</h5>
            <form id="popup-add-amenity-form">
                <div class="mb-3">
                    <label for="popup-name" class="form-label">Name</label>
                    <input type="text" class="form-control" id="popup-name" placeholder="Enter name" required>
                </div>
                <div class="mb-3">
                    <label for="popup-amenity" class="form-label">Amenity Type</label>
                    <select class="form-select" id="popup-amenity" required>
                        <option value="pub">Pub</option>
                        <option value="restaurant">Restaurant</option>
                        <option value="cafe">Cafe</option>
                         <option value="bar">Bar</option>
                        <option value="fast_food">Fast Food</option>
                    </select>
                </div>
                <button type="submit" class="btn btn-primary">Add Amenity</button>
            </form>
        </div>
    `;

    marker.bindPopup(formHtml).openPopup();

    // sending POST request to rest framework backend to add amenity
    setTimeout(() => {
        const popupForm = document.getElementById('popup-add-amenity-form');
        popupForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const name = document.getElementById('popup-name').value;
            const amenity = document.getElementById('popup-amenity').value;

            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

            try {
                const response = await fetch('/api/amenities/places/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrfToken, 
                    },
                    body: JSON.stringify({
                        name: name,
                        amenity: amenity,
                        geom: {
                            type: 'Point',
                            coordinates: [selectedLatLng.lng, selectedLatLng.lat], 
                        },
                    }),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                alert('Amenity added successfully!');

                fetchAmenities();

                addMarkerMode = false;
                document.getElementById('marker-mode-status').innerHTML = `Marker mode is <strong>disabled</strong>`;
            } catch (error) {
                console.error('Error adding amenity:', error);
                alert('Failed to add amenity. Check the console for details.');
            }
        });
    }, 0); 
});

// search bar
document.getElementById('search-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const query = document.getElementById('search-query').value.trim();
    if (!query) {
        alert('Please enter a search term.');
        return;
    }

    try {
        const response = await fetch(`/api/amenities/places/?name=${query}`, {
            headers: {
                Accept: 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            },
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();

        if (data.features.length === 0) {
            alert('No amenities found with that name.');
            return;
        }

        // get first result from search and fly to it
        const feature = data.features[0]; 
        const { latitude, longitude, name, amenity } = feature.properties;
        map.flyTo([latitude, longitude], 15, { animate: true });

        // highlight the searched amenity
        const searchMarker = L.marker([latitude, longitude], { icon: greenIcon })
            .addTo(map)
            .bindPopup(`<b>${name}</b><br>${amenity}`)
            .openPopup();

        // remove marker highlight after delay
        setTimeout(() => map.removeLayer(searchMarker), 5000);
    } catch (error) {
        console.error('Error during search:', error);
        alert('Failed to search for amenity. Check the console for details.');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    fetchAmenities();
});