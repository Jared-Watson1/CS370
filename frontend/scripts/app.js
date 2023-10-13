require('dotenv').config({ path: '../../.env' });
const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

console.log('API Key:', process.env.API_KEY); // Verify the API key is being loaded

app.use(express.static(__dirname + '/../../frontend'));
app.use('/static', express.static(__dirname + '/../../frontend/static')); // For static files
app.use('/templates', express.static(__dirname + '/../../frontend/templates'));


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const axios = require('axios');

app.get('/api/data', (req, res) => {
    try {
        res.json({ apiKey: process.env.API_KEY });
    } catch (error) {
        console.error('Error sending API key:', error);
        res.status(500).send('Internal Server Error');
    }
});

