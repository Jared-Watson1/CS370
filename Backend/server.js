const express = require('express');
const sendGridMail = require('@sendgrid/mail');

// Use your real SendGrid API Key here
sendGridMail.setApiKey('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'); 

const app = express();
app.use(express.json());

app.use('/static', express.static(__dirname, + '../frontend'));

// Serve your HTML and other static assets
app.use(express.static('frontend/templates'));


// Send email verification when the relevant API endpoint is hit
app.post('http://localhost:3000/api/send_verification', (req, res) => {
    console.log("Received request on /api/send_verification");
    const { email } = req.body;

    const msg = {
        to: email,
        from: 'johnzhaixingyu@gmail.com',  
        templateId: 'd-b97a373634f844f8a5b3106d5951085f',  
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
    res.sendFile('forgot_password.html', { root: __dirname + '/../frontend/templates/' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
