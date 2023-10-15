require('dotenv').config({ path: '../../.env' });
const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

 // Verify the API key is being loaded

app.use(express.static(__dirname + '/../../frontend'));
app.use('/static', express.static(__dirname + '/../../frontend/static')); // For static files
app.use('/templates', express.static(__dirname + '/../../frontend/templates'));


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
app.get('/tasks', async (req, res) => {
    const tasks = await getTasksFromFlaskAPI();

    if (!tasks) {
        return res.status(500).json({ error: "Failed to fetch tasks." });
    }
    res.json({ tasks });
});

const getTasksFromFlaskAPI = async () => {
    try {
        const response = await axios.get('https://task-manager-0-94114aee724a.herokuapp.com/get_tasks');

        return response.data.tasks;
    } catch (error) {
        console.error('Error fetching tasks from Flask API:', error);
        return null;
    }
};