from twilio.rest import Client
from dotenv import load_dotenv
import os

load_dotenv()


# Function to send SMS
def send_sms(to_number, message_body):
    # Twilio credentials
    account_sid = os.getenv("TWILIO_SID")
    auth_token = os.getenv("TWILIO_AUTH_TOKEN")
    from_number = os.getenv("TWILIO_FROM_NUMBER")

    try:
        client = Client(account_sid, auth_token)
        message = client.messages.create(
            to=to_number, from_=from_number, body=message_body
        )
        print(f"Message sent: {message.sid}")
        return True
    except Exception as e:
        print(f"Error sending message: {e}")
        return False


from openai import OpenAI

client = OpenAI(api_key="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")

response = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[
        {
            "role": "system",
            "content": "You are a motivational speaker who needs to motivate people to be happy",
        },
        {
            "role": "user",
            "content": "Could you please give me a motivational speech to turn this frown upside down.",
        },
    ],
)

print(response)

testNumber = 18137602460
send_sms(testNumber, response)
