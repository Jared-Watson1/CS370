// Define the base URL of the API
const API_BASE_URL = process.env.API_BASE_URL;

// Function to add a task
// function addTask_API(taskType) {
//   // Gather task information from the form
//   const taskTitle = document.getElementById(
//     `${taskType === "DoAFavor" ? "doTask" : "getTask"}Title`
//   ).value;
//   const taskDescription = document.getElementById(
//     `${taskType === "DoAFavor" ? "doTask" : "getTask"}Description`
//   ).value;

//   // Prepare the request data
//   const requestData = {
//     task_name: taskTitle,
//     description: taskDescription,
//     // Add other task-related properties here as needed
//   };

//   // Make a POST request to the API to add the task
//   fetch(`${API_BASE_URL}/add_task`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(requestData),
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       console.log(data)
//       // Handle the API response
//       if (data.message === "Task added successfully!") {
//         // Clear the form
//         document
//           .getElementById(
//             `${taskType === "DoAFavor" ? "doTask" : "getTask"}Form`
//           )
//           .reset();
//       } else {
//         alert("Failed to add the task. Please try again.");
//       }
//     })
//     .catch((error) => {
//       // console.error("Error:", error);
//       // alert("An error occurred while communicating with the server.");
//     });
// }

// Function to fetch and display tasks (you can call this function to update the task list)
function fetchAndDisplayTasks(taskType) {
  // Make a GET request to the API to retrieve tasks
  fetch(`${API_BASE_URL}/get_tasks`)
    .then((response) => response.json())
    .then((data) => {
      // Handle the API response
      const taskList = document.getElementById(
        `${taskType === "DoAFavor" ? "doTask" : "getTask"}List`
      );
      taskList.innerHTML = ""; // Clear existing task list

      // Iterate through the tasks and add them to the task list
      data.tasks.forEach((task) => {
        const listItem = document.createElement("li");
        listItem.textContent = `Title: ${task.task_name}, Description: ${task.description}`;
        taskList.appendChild(listItem);
      });
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("An error occurred while fetching tasks from the server.");
    });
}

// Optional: You can call fetchAndDisplayTasks initially to populate the task list on page load
// fetchAndDisplayTasks('GetAFavor');
