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

        const { task_name, description, date_posted, task_owner} = req.body;
        const response = await axios.post('https://task-manager-0-94114aee724a.herokuapp.com/add_task', {
            task_name,
            description,
            date_posted,
            task_owner,
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
        console.log("dsafdsa")
        console.log(req.body)
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
