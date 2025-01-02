import React, { useEffect, useRef, useState } from "react";
import "leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import axios from "axios";

// like map.html from django templates, deals with the map page

const MapPage = () => {
    const mapRef = useRef(null);                                              // the map
    const markerClusterRef = useRef(null);                                    // marker clusters
    const [addMarkerMode, setAddMarkerMode] = useState(false);                // adding markers state
    const [selectedLatLng, setSelectedLatLng] = useState(null);               // selected coordinates state
    const userMarkerRef = useRef(null);                                       // the user marker
    const userCircleRef = useRef(null);                                       // the radius around the user
    const [statusText, setStatusText] = useState("Marker mode is disabled");  // message for disabling marker mode
    const markerRef = useRef(null);                                           // the current marker
    const [csrfToken, setCsrfToken] = useState("");                           // store the csrf

    useEffect(() => {
      
      //fetch csrf token for POST requests
      const fetchCsrfToken = async () => {
        try {
          const response = await axios.get("/api/csrf/");
          setCsrfToken(response.data.csrfToken);
        } catch (err) {
          console.error("Failed to fetch CSRF token", err);
        }
      };
  
      fetchCsrfToken();
    }, []);
  

    // different icon colours
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


    // map initialisation
    useEffect(() => {
      
      const map = L.map("map", {
        center: [53.0, -8.0],
        zoom: 7,
        maxBounds: [[51.3, -10.5], [55.5, -5.5]],
        maxBoundsViscosity: 1.0,
      });
  
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
        minZoom: 6,
      }).addTo(map);
  
      const markers = L.markerClusterGroup({
        disableClusteringAtZoom: 17,
      });

      markerClusterRef.current = markers;
      map.addLayer(markers);
      mapRef.current = map;
  
      fetchAmenities();

      return () => {
        map.remove(); 
      };
    }, []);
  
    // update map the map after user updates their location
    const updateMapWithLocation = (latitude, longitude, accuracy) => {
      if (userMarkerRef.current) mapRef.current.removeLayer(userMarkerRef.current);
      if (userCircleRef.current) mapRef.current.removeLayer(userCircleRef.current);

      userMarkerRef.current = L.marker([latitude, longitude], { icon: greyIcon }).addTo(mapRef.current);
      userCircleRef.current = L.circle([latitude, longitude], { radius: accuracy }).addTo(mapRef.current);

      mapRef.current.setView([latitude, longitude], 13);
  };

  // update the user's location
  const updateLocation = () => {
      if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
              (position) => {
                  const { latitude, longitude, accuracy } = position.coords;

                  updateMapWithLocation(latitude, longitude, accuracy);

                  fetch("http://localhost/update_location/", {
                      method: "POST",
                      headers: {
                          "Content-Type": "application/x-www-form-urlencoded",
                      },
                      body: `latitude=${latitude}&longitude=${longitude}`,
                  })
                      .then((response) => response.json())
                      .then((data) => {
                          if (data.success) {
                              console.log("Location updated successfully.");
                          } else {
                              console.error("Error updating location.");
                          }
                      })
                      .catch((error) => console.error("Fetch error:", error));
              },
              (error) => {
                  console.error("Error getting location:", error);
              }
          );
      } else {
          console.error("Geolocation is not supported by this browser.");
      }
  };

    // fetch amenities and update the map
    const fetchAmenities = async (filterParams = {}) => {
      const queryParams = new URLSearchParams();
      if (filterParams.amenity) {
        filterParams.amenity.forEach((amenity) => queryParams.append("amenity", amenity));
      }
      if (filterParams.name) {
        queryParams.append("name", filterParams.name);
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
  
        markerClusterRef.current.clearLayers();
  
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
                markerClusterRef.current.addLayer(amenityMarker);
            });

            // zoom in on first result if data is only one
            if (filterParams.name && data.features.length === 1) {
                const firstFeature = data.features[0];
                mapRef.current.setView(
                    [firstFeature.properties.latitude, firstFeature.properties.longitude],
                    15
                ); 
            }
        } else {
          alert("No amenities found matching your search.");
        }
      } catch (error) {
        console.error("Error fetching amenities:", error);
        alert("Failed to fetch amenities. Check the console for details.");
      }
    };
  
    // selected filter state
    const handleFilterSubmit = (e) => {
      e.preventDefault();
      
      const selectedAmenities = Array.from(document.querySelectorAll('input[name="amenity"]:checked')
      ).map((input) => input.value);
      fetchAmenities({ amenity: selectedAmenities });
    };
  
     // add marker mode state
  const toggleAddMarkerMode = () => {
    setAddMarkerMode((prevMode) => {
      const newMode = !prevMode;
      setStatusText(`Marker mode is ${newMode ? "enabled" : "disabled"}`);
      return newMode;
    });
  };

  // adding amenity to map
  useEffect(() => {
    if (!mapRef.current) return;

    const handleMapClick = (e) => {
      if (!addMarkerMode) return;

      const { lat, lng } = e.latlng;
      setSelectedLatLng({ lat, lng });

      if (markerRef.current) {
        mapRef.current.removeLayer(markerRef.current);
      }

      const marker = L.marker([lat, lng], { icon: greyIcon }).addTo(mapRef.current);

      markerRef.current = marker;

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

      // sending POST request to backend to add amenity
      setTimeout(() => {
        const popupForm = document.getElementById("popup-add-amenity-form");
        if (popupForm) {
          popupForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const name = document.getElementById("popup-name").value;
            const amenity = document.getElementById("popup-amenity").value;

            try {
              const response = await fetch("/api/amenities/places/", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "X-CSRFToken": csrfToken, 
                },
                body: JSON.stringify({
                  name: name,
                  amenity: amenity,
                  geom: {
                    type: "Point",
                    coordinates: [lng, lat],
                  },
                }),
              });

              if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
              }

              const data = await response.json();
              alert("Amenity added successfully!");
              fetchAmenities(); 

            } catch (error) {
              console.error("Error adding amenity:", error);
              alert("Failed to add amenity. Check the console for details.");
            }
          });
        }
      }, 0); 
    };

    mapRef.current.on("click", handleMapClick);

    return () => {
      mapRef.current.off("click", handleMapClick);
    };
  }, [addMarkerMode]);

  // search bar
  const handleSearch = async (e) => {
    e.preventDefault();
  
    const query = document.getElementById("search-query").value.trim();
    if (!query) {
      alert("Please enter a search term.");
      return;
    }
  
    try {
      
      const response = await fetch(`/api/amenities/places/?name=${query}`, {
        headers: {
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
      });
  
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  
      const data = await response.json();
  
      if (data.features.length === 0) {
        alert("No amenities found with that name.");
        return;
      }
  
      // get first filtered amenity and fly to it
      const feature = data.features[0];
      const { latitude, longitude, name, amenity } = feature.properties;
      mapRef.current.flyTo([latitude, longitude], 15, { animate: true });
  
      // highlight the searched amenity
      const searchMarker = L.marker([latitude, longitude], { icon: greenIcon })
        .addTo(mapRef.current)
        .bindPopup(`<b>${name}</b><br>${amenity}`)
        .openPopup();
  
      // remove marker highlight after delay
      setTimeout(() => mapRef.current.removeLayer(searchMarker), 5000); // 5 seconds
    } catch (error) {
      console.error("Error during search:", error);
      alert("Failed to search for amenity. Check the console for details.");
    }
  };  

  //html
  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="row">
        <div className="col text-center">
          <h1 className="display-5">Ireland Amenities</h1>
          <p className="text-muted">Places to eat and drink</p>
        </div>
      </div>

      {/* Map Section */}
      <div className="row justify-content-center">
        <div className="col-12 col-md-10">
          <div className="card shadow">
            <div className="card-body p-0">
              <div id="map" style={{ height: "400px", width: "100%" }}></div>
            </div>
            <div className="card-footer text-center">
              <button className="btn btn-primary btn-sm mt-2" onClick={updateLocation}>Update Location</button>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 text-center">
          <div id="legend" className="mb-3">
            <h5></h5>
            <span>
              <img
                src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png"
                alt="You"
                style={{ width: "20px", verticalAlign: "middle" }}
              />{" "}
              You
            </span>
            <span>
              <img
                src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png"
                alt="Pubs"
                style={{ width: "20px", verticalAlign: "middle" }}
              />{" "}
              Pubs
            </span>
            <span className="ms-3">
              <img
                src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-gold.png"
                alt="Restaurants"
                style={{ width: "20px", verticalAlign: "middle" }}
              />{" "}
              Restaurants
            </span>
            <span className="ms-3">
              <img
                src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png"
                alt="Cafes"
                style={{ width: "20px", verticalAlign: "middle" }}
              />{" "}
              Cafes
            </span>
            <span className="ms-3">
              <img
                src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png"
                alt="Bars"
                style={{ width: "20px", verticalAlign: "middle" }}
              />{" "}
              Bars
            </span>
            <span className="ms-3">
              <img
                src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png"
                alt="Fast Food"
                style={{ width: "20px", verticalAlign: "middle" }}
              />{" "}
              Fast Food
            </span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 text-center">
            <div id="filter-options" className="mb-4">
              <h5>Filter Amenities</h5>
              <form id="filter-form" onSubmit={handleFilterSubmit} >
                <label>
                  <input type="checkbox" name="amenity" value="pub" /> Pubs
                </label>
                <label>
                  <input type="checkbox" name="amenity" value="restaurant" /> Restaurants
                </label>
                <label>
                  <input type="checkbox" name="amenity" value="cafe" /> Cafes
                </label>
                <label>
                  <input type="checkbox" name="amenity" value="bar" /> Bars
                </label>
                <label>
                  <input type="checkbox" name="amenity" value="fast_food" /> Fast Food
                </label>
                <button type="submit" className="btn btn-primary btn-sm mt-2">
                  Apply Filters
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Add Marker */}
      <div className="text-center my-3">
        <button className="btn btn-primary" onClick={toggleAddMarkerMode}>
          {addMarkerMode ? "Disable Add Marker Mode" : "Enable Add Marker Mode"}
        </button>
        <p className="text-muted mt-2">{statusText}</p>
      </div>

      {/* Search */}
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8">
            <form className="d-flex" onSubmit={handleSearch}>
              <input
                type="text"
                id="search-query"
                className="form-control me-2"
                placeholder="Search for an amenity by name"
              />
              <button type="submit" className="btn btn-primary">
                Search
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
