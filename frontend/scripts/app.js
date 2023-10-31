require('dotenv').config({ path: '../../.env' });
const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 3000;


// Verify the API key is being loaded
app.use(express.json());
app.use(express.static(__dirname + '/../../frontend'));
app.use('/static', express.static(__dirname + '/../../frontend/static')); // For static files
app.use('/templates', express.static(__dirname + '/../../frontend/templates'));
app.use(cors());

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const axios = require('axios');
app.get('/api/link', (req, res) => {
    try {
        res.json({ link: process.env.TASK_DB_URL });
    } catch (error) {
        console.error('Error sending API key:', error);
        res.status(500).send('Internal Server Error');
    }
});
app.get('/api/data', (req, res) => {
    try {
        res.json({ apiKey: process.env.API_KEY });
    } catch (error) {
        console.error('Error sending API key:', error);
        res.status(500).send('Internal Server Error');
    }
});
app.post('/add_task', async (req, res) => {
    try {
        const { task_name, category, description, task_owner, start_loc, end_loc, price, restaurant, date_posted} = req.body;
        const response = await axios.post('https://task-manager-0-94114aee724a.herokuapp.com/add_task', {
            task_name,
            category,
            description,
            start_loc,
            task_owner,
            end_loc,
            date_posted,
            price,
            restaurant
        });
        console.log(response.data)
        res.json(response.data);

    } catch (error) {
        console.error('Error posting task to Flask API:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/tasks', async (req, res) => {
    const tasks = await getTasksFromFlaskAPI();

    if (!tasks) {
        return res.status(500).json({ error: "Failed to fetch tasks." });
    }
    res.json({ tasks });
});


app.get('/get_all_users', async (req, res) => {
    const users = await getUsersFromFlaskAPI();
    console.log(users)

    if (!users) {
        return res.status(500).json({ error: "Failed to fetch users." });
    }
    res.json({ users });
});

app.post('/get_info_by_user', async (req, res) => {
    const user_id = req.body.user_id;

    if (!user_id) {
        return res.status(400).json({ error: "User ID is required." });
    }

    try {
        // Assuming you're communicating with a Flask backend:
        const flaskServerUrl = 'https://task-manager-0-94114aee724a.herokuapp.com';  // Replace with your Flask API's base URL if different
        const response = await axios.post(`${flaskServerUrl}/get_info_by_user`, { user_id: user_id });

        // Forward the response from Flask to the frontend
        console.log(response)
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching user info:', error);
        res.status(500).send('Internal Server Error');
    }
});



const getUsersFromFlaskAPI = async () => {
    try {
        const response = await axios.get('https://task-manager-0-94114aee724a.herokuapp.com/get_all_users');

        return response.data.users;
    } catch (error) {
        console.error('Error fetching tasks from Flask API:', error);
        return null;
    }
};

const getTasksFromFlaskAPI = async () => {
    try {
        const response = await axios.get('https://task-manager-0-94114aee724a.herokuapp.com/get_tasks');

        return response.data.tasks;
    } catch (error) {
        console.error('Error fetching tasks from Flask API:', error);
        return null;
    }
};

app.post('/add_user', async (req, res) => {
    try {

        const {username, email, password, first_name, last_name, phone_number} = req.body;
        const response = await axios.post('https://task-manager-0-94114aee724a.herokuapp.com/add_user', {
            username,
            email,
            password,
            first_name,
            last_name,
            phone_number,
        });
        console.log(response.data)
        res.json(response.data);

    } catch (error) {
        console.error('Error posting task to Flask API:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.delete('/clear_task', async (req, res) => {
//app.post('/add_task', async (req, res) => {
    const taskName = req.body.task_name;
    //console.log('task name', taskName);
    //console.log('#####^^^^^^^^^^^^^^^^^^1');
    if (!taskName) {
        return res.status(400).json({ error: "Missing 'task_name' query parameter" });
    }

    try {
        // Forward the DELETE request to the Python Flask server
        //console.log('#####^^^^^^^^^^^^^^^^^^2');
        const flaskServerUrl = 'https://task-manager-0-94114aee724a.herokuapp.com'; // Replace with your Flask server's URL if different
        const response = await axios.delete(`${flaskServerUrl}/clear_task`, { data: { task_name: taskName } });
        //console.log('#####^^^^^^^^^^^^^^^^^^3');
        // Respond to the client with the response from the Flask server
        console.log(response.data)
        res.json(response.data);
    } catch (error) {
        console.error('Error forwarding DELETE request:', error);
        res.status(500).send( 'Error forwarding DELETE request' );
    }
});
