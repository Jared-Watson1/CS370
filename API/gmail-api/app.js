const nodemailer = require('nodemailer')
const { google } = require('googleapis')

const CLIENT_ID = '159269617087-1o4lrm4nqejtugm1t9vvqo46a1f12rbu.apps.googleusercontent.com'
const CLIENT_SECRET = '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'
const REDIRECT_URL = 'https://developers.google.com/oauthplayground'
const REFRESH_TOKEN = '1//044TjvO5nHGZVCgYIARAAGAQSNwF-L9IrKhH0i0NiVB8FWsuDcYdwhd2Ynlug3NiPXtDc9WhkqWJV2fXAnQwfk7J6kEZe05wom5o'

// when required, generate an access token
const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL)
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })

async function sendMail() {
    try {
        const accessToken = await oAuth2Client.getAccessToken()
        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'DooleyAFavor@gmail.com',
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken
            }
        })
    
        const mailOptions = {
            from: 'DooleyAFavor <DooleyAFavor@gmail.com>',
            to: 'temp@emory.edu',
            subject: "DooleyAFavor Email Verification",
            text: "Hi dawit verify your email",
        };

        const result = await transport.sendMail(mailOptions)
        return result

    } catch(error) {
        return error
    }
}

sendMail().then(result => console.log("email sent", result)).catch(error => console.log(error.messsage))