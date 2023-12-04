## Overview

DooleyAFavor is a web application that allows Emory students to post and complete tasks for each other. Students can post tasks for any type of help they need, such as academic assistance, running errands, picking up food, or getting help with a project. Other students can then accept these tasks to earn money.

To use DooleyAFavor visit our [site](https://dooley-8c253088e812.herokuapp.com/) and login or create an account to start benefiting from the Emory community!

## File Structure

The DooleyAFavor repository has the following file structure:

DooleyAFavor
```
├── API
│   └── README.md
├── Frontend
│   ├── static
│   ├── template
│   └── style
└── README.md
```
## API Folder

The API folder contains a Flask API that handles all operations with the database. This includes task management, task retrieval, user management, and user information retrieval. For more information on how to interact with the API, please see the [README file](../API/README.md) within the API directory.

## Frontend Folder

The Frontend folder contains all files pertaining to the DooleyAFavor website. This includes the static, template, and style folders. The Bootstrap framework is used for styling the website.

## Getting Started

To get started developing with DooleyAFavor, please follow these steps:

Clone the DooleyAFavor repository from GitHub.
Install the required dependencies for the API and Frontend folders.

## Explanation of Frontend Scripts 

### Script 1: Accepted.js 
This code is part of a web application that involves mapping, task management, and user interaction. It defines various variables to store map-related objects, user data, and task information. The code includes functions for fetching user information, fetching tasks, posting tasks to an API, deleting tasks, and initializing the Google Maps API. Additionally, there are functions to update the map based on user input, display tasks on the page, and handle user interactions with tasks.

The application has two main sections: "GetAFavor" and "DoAFavor," which involve users either requesting assistance or offering help with specific tasks. The map is used to display task locations, and tasks are fetched and updated periodically. The code also handles user location retrieval, task acceptance, and deletion.

Furthermore, there are elements related to user interface interactions, such as buttons for taking or dropping tasks, toggling views between "GetAFavor" and "DoAFavor," and displaying tasks based on pagination. The code utilizes asynchronous functions and promises, making use of the Fetch API to communicate with the server.

### Script 2: app.js
This file is a Node.js server script using the Express framework to create a RESTful API. It starts by loading environment variables from a .env file located in the parent directory. The server listens on a specified port or defaults to 3000. The script sets up routes for handling various HTTP requests:

Static Files and Frontend: It serves static files (HTML, CSS, JS) from the ../../frontend directory, and specific routes for static files, templates, and the login page.

API Endpoints: It defines several API endpoints that interact with an external Flask API hosted at "https://task-manager-0-94114aee724a.herokuapp.com". These endpoints handle tasks such as retrieving links and API keys, posting tasks, user authentication, scheduling tasks, retrieving user-specific tasks, completing tasks, deleting tasks, and managing users.

Axios Requests: The script utilizes the Axios library to make HTTP requests to the external Flask API. It handles responses and errors appropriately, logging them to the console.

Utility Functions: There are utility functions (getTasksFromFlaskAPI and getUsersFromFlaskAPI) for fetching tasks and users from the Flask API.

Overall, this script acts as an intermediary server that exposes various endpoints, interacting with an external Flask API to perform CRUD (Create, Read, Update, Delete) operations related to tasks and users in a task management system. It also handles user authentication and serves static files for a web application.

### Script 3: dafttask_service.js
Variables: The code declares variables such as map, doAFavorMap, directionsService, directionsRenderer, sharedTaskList, globalApiKey, userLocation, autocomplete1, username, currenttask, and more. These variables are used to store map objects, user data, and other relevant information.

Functions:
1. fetchUsernameByUserID: Fetches the username associated with a given user ID from an external service.
2. getUserLocation: Retrieves the user's location using the Geolocation API.
3. getUserbyID: Sends a POST request to retrieve user information based on user ID.
4. postTaskToApi: Sends a POST request to add a task to the server.
5. fetchAddressFromCoordinates: Fetches the formatted address from geographical coordinates using the Google Maps Geocoding API.
6. initMap and initModelMap: Initialize Google Maps with markers at the user's location.
7. initAutocompleteAndListeners: Initializes autocomplete for location search.
8. populateTasks: Fetches and populates tasks from the server, updating the UI.
9. loadScriptWithApiKey: Dynamically loads the Google Maps API script with the provided API key.
10. updateMap: Updates the map based on selected locations and travel mode.
11. Various UI-related functions such as modal display, button clicks, and toggling views.
12. Functions for adding, removing, and rendering tasks in different lists.
13. Event Listeners: The code includes event listeners for page load, button clicks, and mode change.

Page Initialization: The window.onload function ensures that user location is fetched before initializing the map.

API Requests: The code makes several asynchronous requests to the server using the Fetch API to interact with server endpoints for tasks and user-related data.

HTML Interaction: The code manipulates the DOM to display and update various elements on the web page.

Overall, the code integrates Google Maps functionality, user location, and task management features into a web application.

### Script 4: dafttask.js
Functions:
1. fetchUsernameByUserID(userID): Fetches a username from the server based on the user ID.
2. getUserLocation(callback): Retrieves the user's geolocation using the browser's navigator.
3. getUserbyID(data): Sends a POST request to get user information based on the user ID.
4. postTaskToApi(data): Sends a POST request to add a task.
5. fetchAddressFromCoordinates(lat, lon): Fetches the address from given coordinates using the Google Maps Geocoding API.
6. initMap() and initModelMap(): Initialize Google Maps instances.
7. initAutocompleteAndListeners(targetMap): Initializes autocomplete for location input fields.
8. populateTasks(): Fetches tasks from the server and populates them in the UI.
9. loadScriptWithApiKey(apiKey): Dynamically loads the Google Maps API script with the provided API key.
10. updateMap(targetMap, autocomplete1, autocomplete2, selectedMode): Updates the map based on user input.

Event Listeners:
1. Event Listeners: Listens for the page load event (window.onload) and initializes the map, fetches user location, and populates tasks.
2. Listens for changes in the transportation mode dropdown (modeElement).
3. Listens for clicks on the "Accept" button (acceptModal) and sends a POST request to accept a task.

Modal Handling:
1. Contains modal-related code for displaying and hiding modals.
2. Displays task details in a modal when a task is clicked.
3. Task List Handling:
4. Functions to add, remove, and display tasks in different task lists (GetAFavor, DoAFavor).
5. Pagination functionality for displaying tasks.

Task Interaction:
1. Allows users to take, drop, and track tasks.
2. Displays shared tasks and allows users to take or remove them.

Tab Activation:
1. setActiveTab(): Sets the active tab in the navigation based on the current URL path.
2. Automatically called on page load.

### Script 5: emailvrf.js
The function inside emailvrf.js makes a post request using the username of the person 
to send an email to the user to verify your account on our platform. 

### Script 6: fetch.js
Contains a function to fetch and display tasks (you can call this function to update the task list). 

### Script 7: forgot_passwrod.js
If a user forgots their password they can use the function in this js file to send an email to their emory 
email to update their password. 

### Script 8: login.js
When a user attempts to login to their account a post request is made to the API to determine if the 
credentials they earned are in fact in our database (verification of the user). If so they are moved to the 
next page, if not they are told their password or username is incorrect. 

### Script 9: post_favor_service.js
This JavaScript code is a part of the web application related to a task management system that involves location-based features, such as creating and managing tasks based on user location. Here's a breakdown of the code:

1. Variable Declarations: The code declares several variables to store instances related to Google Maps, user location, and other elements needed for the application.
2. Geolocation: The getUserLocation function retrieves the user's geographical location using the browser's geolocation API.
3. API Key: The application fetches an API key from the server to use Google Maps services, and the script is loaded asynchronously with the API key.
4. Task Retrieval: The code fetches tasks from the server using fetch("/tasks") and logs the tasks received from the server.
5. Map Initialization: After the page loads, it initializes the map using the user's location and sets up the UI with tasks.
6. Task Rendering: There's commented-out code for rendering tasks in the UI based on the fetched data.
7. Task Posting: The postTaskToApi function sends a new task to the server using a POST request.
8. Task Removal: There's a function removeTaskFromApi for removing a task from the server using a DELETE request.
9. Script Loading: Functions like loadScriptWithApiKey and fetchAddressFromCoordinates handle the loading of scripts and fetching address details.
10. Map Interaction: Functions like initMap, initAutocompleteAndListeners, and placeMarkers are involved in initializing and interacting with Google Maps, including adding markers and handling autocomplete for location inputs.
11. Task Taking/Dropping: The code includes functions for taking and dropping tasks, involving interaction with shared task lists.
12. UI Elements Control: Functions like toggleView, setActiveTab, and others control the visibility and behavior of different UI elements.

### Script 10: posted.js
This JavaScript code defines various variables and functions related to a web application, presumably with features related to location-based tasks and maps. The code initializes variables for handling maps, directions, user information, and task lists. It includes functions for deleting tasks, fetching user information, getting the user's location, posting tasks to an API, and updating maps. Additionally, the code fetches an API key, retrieves tasks from the server, populates tasks on the page, and sets up map-related functionalities using the Google Maps API. The user interface is also handled, including the display of tasks, a modal for task details, and buttons for accepting or deleting tasks. Furthermore, the code includes functions for toggling views, taking and dropping tasks, and setting the active tab based on the current page. The application involves users posting and accepting location-based tasks, with a focus on tasks related to getting or delivering items from one location to another. 

### Script 11: require.js
A file generated by node.js

### Script 12: signup.js
When a user attempts to sign up multiple criterions must be met for them to become a user of our platform. 
The most important is that the person attempting to create an account has an emory email (in other words they
are an emory student). If all the conditions are passed we had the user to our database to record them and store 
the username as a incripted cookie so that future actions by the user can be tracked on the platform (such as posting 
accepting tasks)

### Script 13: task.js
1. getUserLocation function uses the Geolocation API to obtain the user's location coordinates.
2. API Interaction: postTaskToApi function sends a POST request to the server with task data.
The script fetches the API key and tasks from the server using fetch requests to /api/data and /tasks.
3. Page Initialization: The window.onload function is triggered when the page is fully loaded. It fetches the user's location and initializes the map.
4. Map Initialization: initMap initializes the Google Map using the obtained user location and sets up autocomplete and listeners.
5. Task Rendering: There's commented-out code for rendering tasks on the page. It appears to iterate through tasks, create HTML elements for each task, and append them to the DOM.
6. Task Removal: The removeTaskFromApi function sends a DELETE request to remove a task from the server.
7. Script Loading: loadScriptWithApiKey dynamically loads the Google Maps script using the provided API key.
8. Address Fetching: fetchAddressFromCoordinates fetches the user's address using the Google Geocoding API based on latitude and longitude.
9. Map Interaction: Functions like initAutocompleteAndListeners, placeMarkers, and updateMap handle map interaction and marker placement based on user input.
10. UI Toggle: toggleView shows or hides sections of the UI based on a checkbox state.
11. Date Formatting: getTodayDate returns the current date in a specific format.
12. Task Addition: addTask function adds tasks to the UI and updates the shared task list.
13. Task Scheduling: scheduleTask is called to post scheduled tasks.
14. Task Taking and Dropping: takeTask and dropTask functions handle the process of taking and dropping tasks, updating respective lists.
15. Rendering Shared Task List:renderSharedTaskList updates the shared task list on the UI.
16. UI Initialization: setActiveTab is intended to set the active tab based on the current page.

### Script 14: user.js
This code defines variables for user data, including the user profile, ratings sum, and the number of ratings. The getUserData function is asynchronous and uses the Fetch API to retrieve user information based on their username stored in the local storage. Once the data is fetched, it populates the corresponding elements in the HTML document with the user's first name, last name, email, and phone number. The script also contains a function displayStars to dynamically generate HTML for displaying star ratings based on the average rating calculated. Finally, there is a conditional check to determine whether there are enough ratings to display a meaningful average. If the number of ratings is less than three, a message is displayed indicating that there are too few reviews to show a rating; otherwise, the average rating is calculated and displayed using the displayStars function. Note that there is a potential typo in the conditional statement at the end, where ratingSum should be corrected to ratingsSum.


## Note: 
Under of profile page the functionality of "edit profile" and display profile picture were features we didn't have time to 
add but would in future iterations. 
