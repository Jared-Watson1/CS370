let users;
function populateTasks() {
  fetch("/get_all_users")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json(); // Parse JSON data
    })
    .then((data) => {
      
      console.log("Tasks fetched from Node.js Server:", data.users); // Log her
      var spanElement = document.querySelector(".user-location");
      spanElement.textContent = "Hi " + data.users[6].first_name + "!"
      var phone = document.querySelector(".pn");
      phone.textContent = data.users[6].phone_number
      document.querySelector(".fn").textContent = data.users[6].first_name
      document.querySelector(".ln").textContent = data.users[6].last_name
      document.querySelector(".em").textContent = data.users[6].email
    })
    .catch((error) => {
      console.error("Error during fetch operation:", error);
    });
}
window.onload = function () {
    populateTasks();
  }