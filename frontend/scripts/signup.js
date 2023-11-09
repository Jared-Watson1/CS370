let email;
document.getElementById("registerButton").addEventListener("click", signup);


function signup() {
  console.log("Signup button clicked!"); // Add this line
  let password_length = 8;
  let usernameField = document.getElementById("username");
  let passwordField = document.getElementById("password");
  let password2Field = document.getElementById("password2");
  let phone_numberField = document.getElementById("phone_number");
  let emails = document.getElementById("email");
  email = emails.value; // updates global email var to be used for resendEmail
  let username = usernameField.value;
  let password = passwordField.value;
  let password2 = password2Field.value;
  let first_name = document.getElementById("first_name").value.trim();
  let last_name = document.getElementById("last_name").value.trim();
  let phone_number = phone_numberField.value.trim();

  if (password != password2) {
    alert("Passwords do not match. Please re-enter your passwords");
    passwordField.value = "";
    password2Field.value = "";
    passwordField.focus(); // put clicker back on password
  } else if (
    password.length < password_length ||
    password2.length < password_length
  ) {
    alert("Password is too short");
    passwordField.value = "";
    password2Field.value = "";
    passwordField.focus(); // put clicker back on password
  } else if (!email.endsWith("@emory.edu")) {
    alert("Must have an @emory.edu email");
    usernameField.value = "";
    passwordField.value = "";
    password2Field.value = "";
    usernameField.focus(); // put focus back on the username field
  } else if (phone_number.length < 10) {
    alert("Phone number is an invalid length.");
    phone_numberField.value = "";
    phone_numberField.focus();
  } else {
    alert(
      "Signup Successful!\nUsername: " + username + "\nPassword: " + password
    );
    // console.log("here");

    const tasData = {
      username: username,
      email: email,
      phone_number: phone_number,
      password: password,
      first_name: first_name,
      last_name: last_name,
    };
    postUserToAp(tasData);
    window.location.href = "../templates/tasks.html";
  }
}


// When the user hits enter and they're inside of the form, it submits the form.
document
  .getElementById("signupForm")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      signup();
    }
  });

document
  .getElementById("personalForm")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      signup();
    }
  });

// Define the base URL of the API
const API_BASE_URL = "https://task-manager-0-94114aee724a.herokuapp.com/";

// Function to add a user
function postUserToAp(data) {
  const requestBody = data;

  console.log("Sending:", JSON.stringify(requestBody)); // Log the request payload

  fetch("/add_user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  })
    .then((response) => {
      console.log("Received:", response); // Log the response object for debugging purposes

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
