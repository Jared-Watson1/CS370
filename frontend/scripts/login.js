// Define the base URL of the API
const API_BASE_URL = "https://task-manager-0-94114aee724a.herokuapp.com/";

function valid_login() {
  var username = document.getElementById("username_auth").value;
  var passwordField = document.getElementById("password_auth").value;

  requestBody = {"username": username, "password": passwordField}

  console.log("Sending:", JSON.stringify(requestBody)); // Log the request payload

  fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  })
    .then((response) => {
      console.log("Received:", response); // Log the response object for debugging purposes

      if (!response.ok) {
        alert('Login unsuccessful!');
        throw new Error("Network response was not ok: " + response.statusText);
      }
      else {
        alert('Login successful!');
        window.location.href = "../templates/tasks.html"; // take you to main page after success
      }

      return response.json();
    })
    .catch((error) => {
      console.error("Error:", error); // Log any error
      alert("An error occurred while logining in");
    });
}


