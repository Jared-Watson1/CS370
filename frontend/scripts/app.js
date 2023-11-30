require("dotenv").config({ path: "../../.env" });
const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 3000;
// Verify the API key is being loaded
app.use(express.json());
app.use(express.static(__dirname + "/../../frontend"));
app.use("/static", express.static(__dirname + "/../../frontend/static")); // For static files
app.use("/templates", express.static(__dirname + "/../../frontend/templates"));
app.use(cors());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const axios = require("axios");
app.get("/api/link", (req, res) => {
  try {
    res.json({ link: process.env.TASK_DB_URL });
  } catch (error) {
    console.error("Error sending API key:", error);
    res.status(500).send("Internal Server Error");
  }
});
app.get("/api/data", (req, res) => {
  try {
    res.json({ apiKey: process.env.API_KEY });
  } catch (error) {
    console.error("Error sending API key:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/add_task", async (req, res) => {
  try {
    const {
      task_name,
      category,
      description,
      task_owner,
      start_loc,
      end_loc,
      price,
      restaurant,
      date_posted,
    } = req.body;
    const response = await axios.post(
      "https://task-manager-0-94114aee724a.herokuapp.com/add_task",
      {
        task_name,
        category,
        description,
        start_loc,
        task_owner,
        end_loc,
        date_posted,
        price,
        restaurant,
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error posting task to Flask API:", error);
    res.status(500).send("Internal Server Error");
  }
});
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Add your logic for validating the username and password.
  // This could involve a database call or an external API request.
  // For demonstration, let's assume we're making a request to an external API for validation.

  try {
    const loginResponse = await axios.post(
      "https://task-manager-0-94114aee724a.herokuapp.com/login",
      {
        username,
        password,
      }
    );
    if (loginResponse.status === 200) {
      // If the response indicates a successful login
      console.log("Login successful for:", username);
      res.status(200).json({ message: "Login successful" });
    } else {
      // If the response indicates a failed login
      console.log("Login failed for:", username);
      res
        .status(loginResponse.status)
        .json({ error: "Invalid username or password" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});
app.post("/schedule_task", async (req, res) => {
  try {
    const {
      task_name,
      category,
      description,
      task_owner,
      start_loc,
      end_loc,
      price,
      restaurant,
      date_posted,
      scheduled_time, // Added for scheduling
    } = req.body;

    // Here, we're assuming that the Flask API endpoint can handle scheduled_time.
    const response = await axios.post(
      "https://task-manager-0-94114aee724a.herokuapp.com/add_task",
      {
        task_name,
        category,
        description,
        start_loc,
        task_owner,
        end_loc,
        date_posted,
        price,
        restaurant,
        scheduled_time, // Send the scheduled_time to the API
      }
    );

    console.log("Tasks scheduled successfully:", response.data);
    res.json(response.data);
  } catch (error) {
    console.error("Error scheduling task with Flask API:", error);
    if (error.response) {
      // If the API responded with an error, forward that error status and message to the client
      res.status(error.response.status).send(error.response.data);
    } else {
      // If the API did not respond or there was a network error, send a generic server error
      res.status(500).send("Internal Server Error");
    }
  }
});
app.get('/get_user_posted_tasks', async (req, res) => {
  try {
    const { username } = req.query;

    // Making a GET request with Axios using query parameters
    const response = await axios.get("https://task-manager-0-94114aee724a.herokuapp.com/get_user_posted_tasks", {
      params: {
        username
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error("Error posting task to Flask API:", error);
    res.status(500).send("Internal Server Error");
  }
});
app.delete('/completed_task', async (req, res) => {
  try {
    const { task_id } = req.query;

    // Making a GET request with Axios using query parameters
    const response = await axios.delete("https://task-manager-0-94114aee724a.herokuapp.com/completed_task", {
      params: {
        task_id
      }
    });
    console.log(response.data);
    res.json(response.data);
  } catch (error) {
    console.error("Error posting task to Flask API:", error);
    res.status(500).send("Internal Server Error");
  }
});
app.delete('/delete_task', async (req, res) => {
  try {
    const { task_id } = req.query;

    // Making a GET request with Axios using query parameters
    const response = await axios.delete("https://task-manager-0-94114aee724a.herokuapp.com/delete_task", {
      params: {
        task_id
      }
    });
    console.log(response.data);
    res.json(response.data);
  } catch (error) {
    console.error("Error posting task to Flask API:", error);
    res.status(500).send("Internal Server Error");
  }
});
app.get('/get_username', async (req, res) => {
  try {
    const { user_id } = req.query;

    // Making a GET request with Axios using query parameters
    const response = await axios.get("https://task-manager-0-94114aee724a.herokuapp.com/get_username", {
      params: {
        user_id
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error("Error posting task to Flask API:", error);
    res.status(500).send("Internal Server Error");
  }
});
app.get('/get_accepted_tasks_by_user', async (req, res) => {
  try {
    const { username } = req.query;

    // Making a GET request with Axios using query parameters
    const response = await axios.get(
      "https://task-manager-0-94114aee724a.herokuapp.com/get_accepted_tasks_by_user",
      {
        params: {
          username,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error posting task to Flask API:", error);
    res.status(500).send("Internal Server Error");
  }
});
app.post("/accept_task", async (req, res) => {
  try {
    const { task_id, task_owner_id, task_acceptor_username } = req.body;
    const response = await axios.post(
      "https://task-manager-0-94114aee724a.herokuapp.com/accept_task",
      {
        task_id,
        task_owner_id,
        task_acceptor_username,
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error posting task to Flask API:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/tasks", async (req, res) => {
  const tasks = await getTasksFromFlaskAPI();
  console.log(typeof tasks);
  if (!tasks) {
    console.log("not");
    return res.status(500).json({ error: "Failed to fetch tasks." });
  }
  res.json({ tasks });
});

app.get("/get_all_users", async (req, res) => {
  const users = await getUsersFromFlaskAPI();
  console.log(users);

  if (!users) {
    return res.status(500).json({ error: "Failed to fetch users." });
  }
  res.json({ users });
});

app.get("/get_info_by_user", async (req, res) => {
  try {
    const { username } = req.query;
    console.log(req.query);

    // Making a GET request with Axios using query parameters
    const response = await axios.get("https://task-manager-0-94114aee724a.herokuapp.com/get_info_by_user", {
      params: {
        username
      }
  });

    console.log("safdsa");
    res.json(response.data);
  } catch (error) {
    console.error("Error posting task to Flask API:", error);
    res.status(500).send("Internal Server Error");
  }
});

const getUsersFromFlaskAPI = async () => {
  try {
    const response = await axios.get(
      "https://task-manager-0-94114aee724a.herokuapp.com/get_all_users"
    );

    return response.data.users;
  } catch (error) {
    console.error("Error fetching tasks from Flask API:", error);
    return null;
  }
};

const getTasksFromFlaskAPI = async () => {
  try {
    const response = await axios.get(
      "https://task-manager-0-94114aee724a.herokuapp.com/get_tasks"
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching tasks from Flask API:", error);
    return null;
  }
};

app.post("/add_user", async (req, res) => {
  try {
    const { username, email, password, first_name, last_name, phone_number } =
      req.body;
    const response = await axios.post(
      "https://task-manager-0-94114aee724a.herokuapp.com/add_user",
      {
        username,
        email,
        password,
        first_name,
        last_name,
        phone_number,
      }
    );
    console.log(response.data);
    res.json(response.data);
  } catch (error) {
    console.error("Error posting task to Flask API:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.delete("/clear_task", async (req, res) => {
  //app.post('/add_task', async (req, res) => {
  const taskName = req.body.task_name;
  //console.log('task name', taskName);
  //console.log('#####^^^^^^^^^^^^^^^^^^1');
  if (!taskName) {
    return res
      .status(400)
      .json({ error: "Missing 'task_name' query parameter" });
  }

  try {
    // Forward the DELETE request to the Python Flask server
    //console.log('#####^^^^^^^^^^^^^^^^^^2');
    const flaskServerUrl = "https://task-manager-0-94114aee724a.herokuapp.com"; // Replace with your Flask server's URL if different
    const response = await axios.delete(`${flaskServerUrl}/clear_task`, {
      data: { task_name: taskName },
    });
    //console.log('#####^^^^^^^^^^^^^^^^^^3');
    // Respond to the client with the response from the Flask server
    console.log(response.data);
    res.json(response.data);
  } catch (error) {
    console.error("Error forwarding DELETE request:", error);
    res.status(500).send("Error forwarding DELETE request");
  }
});

