var map;
var doAFavorMap;
var directionsService;
var directionsRenderer;
var autocomplete1, autocomplete2;
var sharedTaskList = [];
let globalApiKey;
function postTaskToApi(data) {
  const requestBody = data;

  console.log("Sending:", JSON.stringify(requestBody)); // Log the request payload

  fetch("/add_task", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  })
    .then((response) => {
      console.log("Received:", response); // Log the response object

      if (!response.ok) {
        throw new Error("Network response was not ok: " + response.statusText);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new TypeError("Oops, we haven't got JSON!");
      }

      return response.json();
    })
    .then((data) => {
      console.log("Success:", data); // Log the parsed data
    })
    .catch((error) => {
      console.error("Error:", error); // Log any error
    });
}

// Fetch the API key on page load
fetch("/api/data")
  .then((response) => response.json())
  .then((data) => {
    if (data && data.apiKey) {
      globalApiKey = data.apiKey;
      loadScriptWithApiKey(globalApiKey); // Load the Google Maps script using the API key
    } else {
      console.error("Error loading API key: Key not found in response.");
    }
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });

fetch("/tasks")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    return response.json(); // Parse JSON data
  })
  .then((data) => {
    console.log("Tasks fetched from Node.js Server:", data.tasks); // Log here

    // Here you could update your UI with the tasks data...
  })
  .catch((error) => {
    console.error("Error during fetch operation:", error);
  });

// Fetch tasks every 1 second (1000 milliseconds)

window.onload = function () {
  initMap();
  populateTasks(); //...
};

function populateTasks() {
  fetch("/tasks")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json(); // Parse JSON data
    })
    .then((data) => {
      console.log("Tasks fetched from Node.js Server:", data.tasks); // Log here

      // Grabbing the taskUl element
      const taskUl = document.getElementById("taskUl");

      // Iterate through the tasks data and append to the UL
      data.tasks.forEach((task) => {
        // Create li element
        const li = document.createElement("li");

        // Add task details to li
        li.innerHTML = `
                    <h3>${task.task_name}</h3>
                    <p>${task.description}</p>
                    <p>Date Posted: ${task.date_posted}</p>
                    <p>Task Owner: ${task.task_owner}</p>
                `;

        // Append li to ul
        taskUl.appendChild(li);
      });
    })
    .catch((error) => {
      console.error("Error during fetch operation:", error);
    });
}

// Call populateTasks on page load or whenever needed.

populateTasks();

function loadScriptWithApiKey(apiKey) {
  var script = document.createElement("script");
  script.src =
    "https://maps.googleapis.com/maps/api/js?key=" +
    apiKey +
    "&libraries=places&region=US&language=en&callback=initMap";
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
}

// Example of how to use the API key in a URL
function initMap() {
  // First map initialization...
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 33.7966455, lng: -84.324358 },
    zoom: 14.41,
  });
  initAutocompleteAndListeners(map, "getUserLocation", "getTaskRestaurant");

  // Second map initialization...
  doAFavorMap = new google.maps.Map(document.getElementById("doAFavorMap"), {
    center: { lat: 33.7966455, lng: -84.324358 },
    zoom: 14.41,
  });

  // Additional code to place markers on doAFavorMap using data from tasks...
  placeMarkers(doAFavorMap);
}
function initAutocompleteAndListeners(targetMap, inputId1, inputId2) {
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer({ map: targetMap });

  // Initialize autocomplete...
  const autocomplete1 = new google.maps.places.Autocomplete(
    document.getElementById(inputId1)
  );
  const autocomplete2 = new google.maps.places.Autocomplete(
    document.getElementById(inputId2)
  );

  // Add listeners for place changed event...
  autocomplete1.addListener("place_changed", () =>
    updateMap(
      targetMap,
      autocomplete1,
      autocomplete2,
      document.getElementById("mode")
    )
  );
  autocomplete2.addListener("place_changed", () =>
    updateMap(
      targetMap,
      autocomplete1,
      autocomplete2,
      document.getElementById("mode")
    )
  );
  document.getElementById("mode").addEventListener("change", function () {
    updateMap(
      targetMap,
      autocomplete1,
      autocomplete2,
      document.getElementById("mode")
    );
    // Ensure that the 'updateMap' function utilizes the newly selected mode of travel.
  });
}
function placeMarkers(targetMap) {
  // Example data structure for tasks. This might come from your back-end/API...
  const tasks = [
    { title: "Task 1", location: { lat: 33.7966455, lng: -84.324358 } },
    // ... Other tasks ...
  ];

  tasks.forEach((task) => {
    new google.maps.Marker({
      position: task.location,
      map: targetMap,
      title: task.title,
    });
  });
}
function updateMap(targetMap, autocomplete1, autocomplete2, selectedMode) {
  var userPlace = autocomplete1 ? autocomplete1.getPlace() : null;
  var restaurantPlace = autocomplete2 ? autocomplete2.getPlace() : null;

  // if (targetMap.userMarker) {
  //     targetMap.userMarker.setMap(null);
  // }
  // if (targetMap.restaurantMarker) {
  //     targetMap.restaurantMarker.setMap(null);
  // }
  if (
    userPlace &&
    userPlace.place_id &&
    restaurantPlace &&
    restaurantPlace.place_id
  ) {
    directionsService.route(
      {
        origin: { placeId: userPlace.place_id },
        destination: { placeId: restaurantPlace.place_id },
        travelMode:
          google.maps.TravelMode[document.getElementById("mode").value],
      },
      function (response, status) {
        if (status === "OK") {
          directionsRenderer.setDirections(response);
          var duration = response.routes[0].legs[0].duration.text;

          // If an InfoWindow already exists, close it
          if (map.infoWindow) {
            map.infoWindow.close();
          }

          // Create an InfoWindow to display the walk time
          map.infoWindow = new google.maps.InfoWindow({
            content: "Estimated time: " + duration,
            position: response.routes[0].legs[0].end_location,
          });

          // Open the InfoWindow on the map
          map.infoWindow.open(map);
        } else {
          alert("Directions request failed due to " + status);
        }
      }
    );
  } else {
    // Handling when one or none locations are available...
    var location, marker;

    if (userPlace && userPlace.geometry) {
      location = userPlace.geometry.location;
    } else if (restaurantPlace && restaurantPlace.geometry) {
      location = restaurantPlace.geometry.location;
    }

    // Additional logic to handle scenario when autocompletes are not provided

    if (location) {
      targetMap.setCenter(location);
      marker = new google.maps.Marker({
        position: location,
        map: targetMap,
      });
      if (userPlace && userPlace.geometry) {
        targetMap.userMarker = marker;
      } else {
        targetMap.restaurantMarker = marker;
      }
    }
  }
}

function toggleView(isChecked) {
  if (isChecked) {
    document.getElementById("GetAFavor").style.display = "none";
    document.getElementById("DoAFavor").style.display = "block";
    renderSharedTaskList();
  } else {
    document.getElementById("GetAFavor").style.display = "block";
    document.getElementById("DoAFavor").style.display = "none";
    renderSharedTaskList();
  }
}
function getTodayDate() {
  const today = new Date();
  const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1; // January is 0
  let dd = today.getDate();

  // Pad month and day with zero if below 10
  mm = mm < 10 ? "0" + mm : mm;
  dd = dd < 10 ? "0" + dd : dd;

  return yyyy + "-" + mm + "-" + dd;
}
function addTask(listType) {
  var taskTitleInput = document.getElementById(
    listType === "GetAFavor" ? "getTaskTitle" : "doTaskTitle"
  );
  var taskDescriptionInput = document.getElementById(
    listType === "GetAFavor" ? "getTaskDescription" : "doTaskDescription"
  );
  var taskList = document.getElementById(
    listType === "GetAFavor" ? "getTaskList" : "doTaskList"
  );

  var taskTitle = taskTitleInput.value.trim();
  var taskDescription = taskDescriptionInput.value.trim();

  if (listType === "GetAFavor") {
    var taskRestaurantInput = document.getElementById("getTaskRestaurant");
    var taskPriceInput = document.getElementById("getTaskPrice");
    var taskPaymentMethodInput = document.getElementById(
      "getTaskPaymentMethod"
    );
    var taskTitleInput = document.getElementById("getTaskTitle");
    var taskRestaurant = taskRestaurantInput.value.trim();
    var taskPrice = taskPriceInput.value.trim();
    var taskPaymentMethod = taskPaymentMethodInput.value;
    var taskTitle = taskTitleInput.value.trim();
    const taskData = {
      task_name: taskTitle,
      description: taskRestaurant,
      date_posted: getTodayDate(),
      task_owner: "John Doe",
    };
    postTaskToApi(taskData);
  }

  if (
    taskTitle !== "" &&
    taskDescription !== "" &&
    (listType === "DoAFavor" || (taskRestaurant !== "" && taskPrice !== ""))
  ) {
    var taskItem = document.createElement("li");
    taskItem.innerHTML = `<strong>${taskTitle}</strong>: ${taskDescription}`;

    if (listType === "GetAFavor") {
      taskItem.innerHTML += ` <br> Restaurant: ${taskRestaurant} <br> Price: ${taskPrice} <br> Payment Method: ${taskPaymentMethod}`;
      sharedTaskList.push({
        title: taskTitle,
        description: taskDescription,
        Restaurant: taskRestaurant,
        Price: taskPrice,
        Payment_Method: taskPaymentMethod,
      });
    }

    taskItem.innerHTML += ` <button onclick="removeTask(this, '${listType}')">Remove Order</button>`;
    taskItem.innerHTML += ` <button onclick="removeTask(this, '${listType}')">Track Order</button>`;
    taskList.appendChild(taskItem);

    // Clear input fields
    taskTitleInput.value = "";
    taskDescriptionInput.value = "";

    if (listType === "GetAFavor") {
      taskRestaurantInput.value = "";
      taskPriceInput.value = "";
      taskPaymentMethodInput.value = "";
    }
  }
}

function removeTask(button, listType) {
  var taskList = document.getElementById(
    listType === "GetAFavor" ? "getTaskList" : "doTaskList"
  );
  var taskItem = button.parentNode;
  taskList.removeChild(taskItem);

  if (listType === "GetAFavor") {
    // Remove the task from the sharedTaskList
    var taskText = taskItem.textContent.split(":");
    var taskTitle = taskText[0].trim();
    sharedTaskList = sharedTaskList.filter((task) => task.title !== taskTitle);

    // Update the availableList
    renderSharedTaskList();
  }
}

function renderSharedTaskList() {
  var sharedList = document.getElementById("sharedTaskList");
  //sharedList.innerHTML = "";

  for (var i = 0; i < sharedTaskList.length; i++) {
    var taskItem = document.createElement("li");
    taskItem.innerHTML = `<strong>${sharedTaskList[i].title}</strong>: ${sharedTaskList[i].description}`;
    taskItem.innerHTML += ` <br> Restaurant: ${sharedTaskList[i].Restaurant} <br> Price: ${sharedTaskList[i].Price} <br> Payment Method: ${sharedTaskList[i].Payment_Method}`;
    taskItem.innerHTML += ` <button onclick="takeTask(this, '${sharedTaskList[i].title}', '${sharedTaskList[i].description}', '${sharedTaskList[i].Restaurant}', '${sharedTaskList[i].Price}', '${sharedTaskList[i].Payment_Method}')">Take Task</button>`;
    sharedList.appendChild(taskItem);
  }
}

function takeTask(
  button,
  title,
  description,
  restaurant,
  price,
  paymentMethod
) {
  var takenTaskList = document.getElementById("doTaskList");
  var taskItem = document.createElement("li");
  taskItem.innerHTML = `<strong>${title}</strong>: ${description} <br> Restaurant: ${restaurant} <br> Price: ${price} <br> Payment Method: ${paymentMethod}`;
  var dropButton = document.createElement("button");
  dropButton.textContent = "Drop Task";
  dropButton.addEventListener("click", function () {
    dropTask(title, description, restaurant, price, paymentMethod);
    // Remove the task item from the takenTaskList
    takenTaskList.removeChild(taskItem);
  });
  taskItem.appendChild(dropButton);
  takenTaskList.appendChild(taskItem);

  // Remove the taken task from the sharedTaskList
  sharedTaskList = sharedTaskList.filter((task) => task.title !== title);

  // Remove the taken task from the sharedTaskList displayed in the DoAFavor page
  var sharedTaskListElement = document.getElementById("sharedTaskList");
  var taskItems = sharedTaskListElement.getElementsByTagName("li");
  for (var i = 0; i < taskItems.length; i++) {
    if (taskItems[i].textContent.includes(title)) {
      sharedTaskListElement.removeChild(taskItems[i]);
      break;
    }
  }

  // Remove the taken task from the getTaskList displayed in the GetAFavor page
  var getTaskList = document.getElementById("getTaskList");
  var taskItemsGet = getTaskList.getElementsByTagName("li");
  for (var i = 0; i < taskItemsGet.length; i++) {
    if (taskItemsGet[i].textContent.includes(title)) {
      getTaskList.removeChild(taskItemsGet[i]);
      break;
    }
  }

  renderSharedTaskList();
}

function dropTask(title, description, restaurant, price, paymentMethod) {
  var sharedTaskListElement = document.getElementById("sharedTaskList");
  var taskItem = document.createElement("li");
  taskItem.innerHTML = `<strong>${title}</strong>: ${description} <br> Restaurant: ${restaurant} <br> Price: ${price} <br> Payment Method: ${paymentMethod}`;
  var takeButton = document.createElement("button");
  takeButton.textContent = "Take Task";
  takeButton.addEventListener("click", function () {
    takeTask(takeButton, title, description, restaurant, price, paymentMethod);
    sharedTaskListElement.removeChild(taskItem);
  });
  taskItem.appendChild(takeButton);
  sharedTaskListElement.appendChild(taskItem);

  // Add the task back to the sharedTaskList
  sharedTaskList.push({
    title,
    description,
    Restaurant: restaurant,
    Price: price,
    Payment_Method: paymentMethod,
  });

  // Add the task back to the getTaskList in the GetAFavor page
  var getTaskList = document.getElementById("getTaskList");
  var taskItemGet = document.createElement("li");
  taskItemGet.innerHTML = `<strong>${title}</strong>: ${description} <br> Restaurant: ${restaurant} <br> Price: ${price} <br> Payment Method: ${paymentMethod}`;
  var removeButton = document.createElement("button");
  removeButton.textContent = "Remove Order";
  removeButton.addEventListener("click", function () {
    removeTask(removeButton, "GetAFavor");
  });
  var trackButton = document.createElement("button");
  trackButton.textContent = "Track Order";
  taskItemGet.appendChild(removeButton);
  taskItemGet.appendChild(trackButton);
  getTaskList.appendChild(taskItemGet);

  renderSharedTaskList();
}

// Define a function to set the active tab based on the current page
function setActiveTab() {
  // Get the current URL path (excluding the domain part)
  var currentUrlPath = window.location.pathname;

  // Get the list of nav links
  var navLinks = document.querySelectorAll("#myTabs .nav-link");

  // Loop through each nav link and check if its href matches the current URL path
  for (var i = 0; i < navLinks.length; i++) {
    var navLink = navLinks[i];

    // Get the href attribute value and remove the domain part
    var href = navLink.getAttribute("href");
    var hrefPath = href.substring(href.lastIndexOf("/") + 1);

    // Check if the href path matches the current URL path
    if (hrefPath === currentUrlPath) {
      // Add the 'active' class to the matching nav link
      navLink.classList.add("active");
    }
  }
}

// Call the setActiveTab function when the page loads
window.onload = setActiveTab;
