// Define the base URL of the API
const API_BASE_URL = 'https://task-manager-0-94114aee724a.herokuapp.com/';

// Function to add a task
function addUser_API(taskType) {
  // Gather task information from the form
  const first_name = document.getElementById('first name').value.trim();
  const last_name = document.getElementById('last name').value.trim();
  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const phone_number = document.getElementById('phone number').value.trim();

  // Prepare the request data
  const requestData = {
    'username': username, 
    'email': email, 
    'password': password, 
    "first_name": first_name,
    "last_name": last_name,
    "phone_number": phone_number, 
    // Add other task-related properties here as needed
  };

  // Make a POST request to the API to add the user 
  fetch(`/add_user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestData)
  })
  .then(response => response.json())
  .then(data => {
    // Handle the API response
    if (data.message === "User " + str(username) + " successfully!") {
      // Clear the form
      document.getElementById('first name').reset();
      document.getElementById('last name').reset();
      document.getElementById('username').reset();
      document.getElementById('email').reset();
      document.getElementById('password').reset();
      document.getElementById('phone number').reset();

    } else {
      alert('Failed to add the user. Please try again.');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('An error occurred while communicating with the server.');
  });
}
