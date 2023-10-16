const express = require('express');
const sendGridMail = require('@sendgrid/mail');

// Use your real SendGrid API Key here
sendGridMail.setApiKey('___'); 

const app = express();
app.use(express.json());

// Serve your HTML and other static assets
app.use(express.static('frontend/templates'));

// Send email verification when the relevant API endpoint is hit
app.post('/api/send_verification', (req, res) => {
    const { email } = req.body;

    const msg = {
        to: email,
        from: 'johnzhaixingyu@gmail.com',  // Use your verified sender email
        templateId: 'd-b97a373634f844f8a5b3106d5951085f',  // Use your actual template ID
        dynamicTemplateData: {
            email
        }
    };

    sendGridMail.send(msg)
        .then(() => {
            res.status(200).send('Email sent successfully!');
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Internal Server Error');
        });
});

// Handle requests to the root URL by serving your HTML file
app.get('/', (req, res) => {
    res.sendFile('forgot_password.html', { root: __dirname + '/frontend/templates/' });
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
