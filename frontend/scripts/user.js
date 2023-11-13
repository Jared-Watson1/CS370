let users;
let ratingsSum;
let numRatings;
let API_BASE_URL = "https://task-manager-0-94114aee724a.herokuapp.com";


async function getUserData() { // function to get user data to fill in profile
  let username = localStorage.getItem('Username');
  console.log(username)
  let requestBody = { username: username }
  let response = await fetch(`https://task-manager-0-94114aee724a.herokuapp.com/get_info_by_user?username=${username}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json'},
  });
  
  if (!response.ok) { throw new Error(`HTTP error! Status: ${response.status}`); }
  let data = await response.json();
  console.log(data)
}

// .then(res => {  // see if there is an error with network 
    //   if (!res.ok) { throw new Error("Network response was not ok " + res.statusText); }
    //   return res.json()
    // })
    // .then(data => console.log(data))
    // .catch((error) => {console.error("Error during fetch operation:", error);}); // see if there is an error w/ actual fetch operation
// {
    // method: 'GET',
    // headers: {
    //   'Content-Type': 'application/json'
    // },
    // body: JSON.stringify({name: 'User'})
  // })

function populateTasks() {
  data = getUserData()
  console.log(data)
  fetch('/get_all_users')
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json(); // Parse JSON data
    })
    .then((data) => {
      console.log("Tasks fetched from Node.js Server:", data.users); // Log her
      var spanElement = document.querySelector(".user-location");
      spanElement.textContent = "Hi " + data.users[6].first_name + "!";
      var phone = document.querySelector(".pn");



      // phone.textContent = data.users[6].phone_number;
      // document.querySelector(".fn").textContent = data.users[6].first_name;
      // document.querySelector(".ln").textContent = data.users[6].last_name;
      // document.querySelector(".em").textContent = data.users[6].email;
      // ratingsSum = data.users[6].rating_sum;
      // numRatings = data.users[6].num_reviews;
    })
    .catch((error) => {
      console.error("Error during fetch operation:", error);
    });
}
window.onload = function () {
  populateTasks();
};
const ratingsList = document.querySelector(".ratings-list");
const ratingMessage = document.getElementById("ratingMessage");

function displayStars(rating, maxStars = 5) {
  const fullStar =
    '<li style="border: none !important; padding: none !important;"><i class="fas fa-star" style="color: gold; "></i></li>';
  const halfStar =
    '<li style="border: none !important; padding: none !important;"><i class="fas fa-star-half-alt" style="color: gold; "></i></li>';
  const emptyStar =
    '<li style="border: none !important; padding: none !important;"><i class="fas fa-star" style="color: #ddd; "></i></li>';

  const fullStarsCount = Math.floor(rating);
  const isHalfStar = rating - fullStarsCount >= 0.5;
  const emptyStarsCount = maxStars - fullStarsCount - (isHalfStar ? 1 : 0);

  let starsHTML = "";

  for (let i = 0; i < fullStarsCount; i++) starsHTML += fullStar;
  if (isHalfStar) starsHTML += halfStar;
  for (let i = 0; i < emptyStarsCount; i++) starsHTML += emptyStar;

  ratingsList.innerHTML = starsHTML;
}

if (numRatings < 3) {
  // You can adjust the threshold as required
  ratingMessage.textContent = "There are too few reviews to display a rating";
} else {
  ratingMessage.textContent = ""; // Clear the message
  const averageRating = ratingSum / numRatings;
  displayStars(averageRating);
}