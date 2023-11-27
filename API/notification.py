from twilio.rest import Client
from dotenv import load_dotenv
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

load_dotenv()
TWILIO_ACCOUNT_SID = os.getenv("TWILIO_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_FROM_NUMBER = os.getenv("TWILIO_FROM_NUMBER")

twilio_client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
EMAIL_APP_PASS = os.getenv("EMAIL_APP_PASS")
print(EMAIL_APP_PASS)


def send_email(
    recipient_email,
    subject,
    message,
    sender_email="emorydooleyafavor@gmail.com",
):
    try:
        GMAIL_APP_PASSWORD = EMAIL_APP_PASS
        msg = MIMEText(message)
        msg["Subject"] = subject
        msg["To"] = recipient_email
        msg["From"] = sender_email

        smtp_server = smtplib.SMTP_SSL("smtp.gmail.com", 465)
        smtp_server.login("emorydooleyafavor", EMAIL_APP_PASS)
        smtp_server.sendmail(msg["From"], recipient_email, msg.as_string())
        smtp_server.quit()
        return f"Email sent successfully"
    except Exception as e:
        return f"Error sending email: {e}"


def send_sms_notification(to_number, body, from_number=TWILIO_FROM_NUMBER):
    try:
        message = twilio_client.messages.create(
            body=body, from_=from_number, to=to_number
        )
        print(f"SMS sent successfully: {message.sid}")
    except Exception as e:
        print(f"Error sending SMS: {e}")
