var map;
var directionsService;
var directionsRenderer;
var autocomplete1, autocomplete2;

  window.onload = initMap;
function loadApiKey(callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'api-keys.txt', true);

    xhr.onload = function () {
      if (xhr.status === 200) {
        // Parse the API key from the text file content
        var apiKey = xhr.responseText.match(/API_KEY\s*=\s*(\S+)/)[1];
        callback(apiKey);
      } else {
        console.error('Error loading API key:', xhr.status, xhr.statusText);
      }
    };

    xhr.onerror = function () {
      console.error('Network error while loading API key');
    };

    xhr.send();
  }

  // Example of how to use the API key in a URL
  loadApiKey(function (apiKey) {
    var script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js?key=' + apiKey + '&libraries=places&region=US&language=en&callback=initMap';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  });
  function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 33.7966455, lng: -84.324358 },
        zoom: 14.41
    });
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer({ map: map });

    // Initialize autocomplete
    autocomplete1 = new google.maps.places.Autocomplete(
        document.getElementById('getUserLocation')
    );
    autocomplete2 = new google.maps.places.Autocomplete(
        document.getElementById('getTaskRestaurant')
    );

    // Add listeners for place changed event
    autocomplete1.addListener('place_changed', updateMap);
    autocomplete2.addListener('place_changed', updateMap);
}

function updateMap() {
    var userPlace = autocomplete1.getPlace();
    var restaurantPlace = autocomplete2.getPlace();
    if (map.userMarker) {
        map.userMarker.setMap(null);
    }
    if (map.restaurantMarker) {
        map.restaurantMarker.setMap(null);
    }
    if (userPlace && userPlace.place_id && restaurantPlace && restaurantPlace.place_id) {
        // Both locations are filled out, request and display directions
        directionsService.route({
            origin: { 'placeId': userPlace.place_id },
            destination: { 'placeId': restaurantPlace.place_id },
            travelMode: 'WALKING'
        }, function (response, status) {
            if (status === 'OK') {
                directionsRenderer.setDirections(response);
                var duration = response.routes[0].legs[0].duration.text;

                // If an InfoWindow already exists, close it
                if (map.infoWindow) {
                    map.infoWindow.close();
                }

                // Create an InfoWindow to display the walk time
                map.infoWindow = new google.maps.InfoWindow({
                    content: "Estimated walk time: " + duration,
                    position: response.routes[0].legs[0].end_location
                });

                // Open the InfoWindow on the map
                map.infoWindow.open(map);
            } else {
                alert("Directions request failed due to " + status);
            }
        });
    }else {
        // Only one location is filled out, center map on it and place a marker
        var location, marker;
        if (userPlace && userPlace.geometry) {
            location = userPlace.geometry.location;
        } else if (restaurantPlace && restaurantPlace.geometry) {
            location = restaurantPlace.geometry.location;
        }
        if (location) {
            map.setCenter(location);
            marker = new google.maps.Marker({
                position: location,
                map: map
            });
            if (userPlace && userPlace.geometry) {
                map.userMarker = marker;
            } else {
                map.restaurantMarker = marker;
            }
        }
    }
}
  function toggleView(isChecked) {
      if (isChecked) {
          document.getElementById('GetAFavor').style.display = 'none';
          document.getElementById('DoAFavor').style.display = 'block';
      } else {
          document.getElementById('GetAFavor').style.display = 'block';
          document.getElementById('DoAFavor').style.display = 'none';
      }
  }

function addTask(listType) {
  var taskTitleInput = document.getElementById(listType === 'GetAFavor' ? 'getTaskTitle' : 'doTaskTitle');
  var taskDescriptionInput = document.getElementById(listType === 'GetAFavor' ? 'getTaskDescription' : 'doTaskDescription');
  var taskList = document.getElementById(listType === 'GetAFavor' ? 'getTaskList' : 'doTaskList');

  var taskTitle = taskTitleInput.value.trim();
  var taskDescription = taskDescriptionInput.value.trim();

  if (listType === 'GetAFavor') {
    var taskRestaurantInput = document.getElementById('getTaskRestaurant');
    var taskPriceInput = document.getElementById('getTaskPrice');
    var taskPaymentMethodInput = document.getElementById('getTaskPaymentMethod');

    var taskRestaurant = taskRestaurantInput.value.trim();
    var taskPrice = taskPriceInput.value.trim();
    var taskPaymentMethod = taskPaymentMethodInput.value;
  }

  if (taskTitle !== "" && taskDescription !== "" && (listType === 'DoAFavor' || (taskRestaurant !== "" && taskPrice !== ""))) {
    var taskItem = document.createElement("li");
    taskItem.innerHTML = `<strong>${taskTitle}</strong>: ${taskDescription}`;

    if (listType === 'GetAFavor') {
      taskItem.innerHTML += ` <br> Restaurant: ${taskRestaurant} <br> Price: ${taskPrice} <br> Payment Method: ${taskPaymentMethod}`;
    }

    taskItem.innerHTML += ` <button onclick="removeTask(this, '${listType}')">Remove Order</button>`;
    taskItem.innerHTML += ` <button onclick="removeTask(this, '${listType}')">Track Order</button>`;
    taskList.appendChild(taskItem);

    // Clear input fields
    taskTitleInput.value = "";
    taskDescriptionInput.value = "";

    if (listType === 'GetAFavor') {
      taskRestaurantInput.value = "";
      taskPriceInput.value = "";
      taskPaymentMethodInput.value = "";
    }
  }
}


  function removeTask(button, listType) {
    var taskList = document.getElementById(listType === 'GetAFavor' ? 'getTaskList' : 'doTaskList');
    var taskItem = button.parentNode;
    taskList.removeChild(taskItem);
  }
