from twilio.rest import Client
from dotenv import load_dotenv
import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from user_database import get_user_info
from task_database import get_task_info

load_dotenv()
TWILIO_ACCOUNT_SID = os.getenv("TWILIO_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_FROM_NUMBER = os.getenv("TWILIO_FROM_NUMBER")

twilio_client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
EMAIL_APP_PASS = os.getenv("EMAIL_APP_PASS")
print(EMAIL_APP_PASS)


def send_email(
    recipient_email, subject, html_message, sender_email="emorydooleyafavor@gmail.com"
):
    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["To"] = recipient_email
        msg["From"] = sender_email

        # Attach HTML content
        part = MIMEText(html_message, "html")
        msg.attach(part)

        smtp_server = smtplib.SMTP_SSL("smtp.gmail.com", 465)
        smtp_server.login("emorydooleyafavor", EMAIL_APP_PASS)
        smtp_server.sendmail(msg["From"], recipient_email, msg.as_string())
        smtp_server.quit()
        return "Email sent successfully"
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


def send_accept_notification(task_owner_id, task_acceptor_id, task_id):
    # Fetch user information
    task_owner_info, _ = get_user_info(task_owner_id)
    task_acceptor_info, _ = get_user_info(task_acceptor_id)
    task_details = get_task_info(task_id)

    if not task_owner_info or not task_acceptor_info or not task_details:
        return "User or Task information not found"

    # Enhanced styling
    header_color = "#0056b3"  # Example: Blue
    body_color = "#f8f9fa"  # Example: Light grey
    accent_color = "#ffc107"  # Example: Yellow
    font_family = (
        "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"  # Example: Modern font
    )

    # Format the task details into HTML
    task_details_html = format_task_details_html(task_details)

    # Constructing email content with enhanced styling
    email_template = f"""
    <html>
    <head>
        <style>
            body {{
                font-family: {font_family};
                background-color: {body_color};
                color: #333;
                line-height: 1.6;
            }}
            .header {{
                background-color: {header_color};
                color: #fff;
                padding: 10px;
                text-align: center;
            }}
            .content {{
                padding: 20px;
            }}
            .footer {{
                background-color: {accent_color};
                color: #fff;
                padding: 10px;
                text-align: center;
            }}
            a {{
                color: {header_color};
            }}
            .task-details {{
                margin-top: 20px;
                border-top: 2px solid {accent_color};
                padding-top: 10px;
            }}
        </style>
    </head>
    <body>
        <div class="header">
            <h1>DooleyAFavor Task Notification</h1>
        </div>
        <div class="content">
            <h2>{'Your task has been accepted!' if task_owner_id == task_id else 'You have accepted a task!'}</h2>
            <p><strong>{'Accepted by:' if task_owner_id == task_id else 'Task Owner:'}</strong> {task_acceptor_info['username'] if task_owner_id == task_id else task_owner_info['username']}</p>
            <p><strong>Contact Email:</strong> <a href="mailto:{task_acceptor_info['email'] if task_owner_id == task_id else task_owner_info['email']}">{task_acceptor_info['email'] if task_owner_id == task_id else task_owner_info['email']}</a></p>
            <p><strong>Contact Phone:</strong> <a href="tel:{task_acceptor_info['phone_number'] if task_owner_id == task_id else task_owner_info['phone_number']}">{task_acceptor_info['phone_number'] if task_owner_id == task_id else task_owner_info['phone_number']}</a></p>
            <div class="task-details">
                {task_details_html}
            </div>
            <p><a href="{'https://dooley-8c253088e812.herokuapp.com/templates/posted.html' if task_owner_id == task_id else 'https://dooley-8c253088e812.herokuapp.com/templates/accepted.html'}">View your {'posted' if task_owner_id == task_id else 'accepted'} tasks</a></p>
        </div>
        <div class="footer">
            <p>Thank you for using DooleyAFavor!</p>
        </div>
    </body>
    </html>
    """

    # Email content for the task owner
    email_body_owner = email_template.format(task_id=task_owner_id, **locals())

    # Email content for the task acceptor
    email_body_acceptor = email_template.format(task_id=task_acceptor_id, **locals())

    # Send emails using the modified send_email function to handle HTML content
    send_result_owner = send_email(
        task_owner_info["email"], "Your Task Has Been Accepted", email_body_owner
    )
    send_result_acceptor = send_email(
        task_acceptor_info["email"], "You Accepted a Task", email_body_acceptor
    )

    return f"Notifications sent: {send_result_owner}, {send_result_acceptor}"


def format_task_details_html(task_details):
    """Format task details into HTML for email content."""
    html_content = "<h2>Task Details</h2>"
    html_content += f"<p><strong>Name:</strong> {task_details['task_name']}</p>"
    html_content += f"<p><strong>Category:</strong> {task_details['category']}</p>"
    html_content += (
        f"<p><strong>Date Posted:</strong> {task_details['date_posted']}</p>"
    )

    # Add additional information based on task category
    if task_details["category"] == "Food":
        food_info = task_details["additional_info"]["food"]
        html_content += "<h3>Food Task Details</h3>"
        html_content += (
            f"<p><strong>Start Location:</strong> {food_info['start_loc']}</p>"
        )
        html_content += f"<p><strong>End Location:</strong> {food_info['end_loc']}</p>"
        html_content += f"<p><strong>Price:</strong> ${food_info['price']}</p>"
        html_content += f"<p><strong>Restaurant:</strong> {food_info['restaurant']}</p>"
        html_content += (
            f"<p><strong>Description:</strong> {food_info['description']}</p>"
        )
    elif task_details["category"] == "Service":
        service_info = task_details["additional_info"]["service"]
        html_content += "<h3>Service Task Details</h3>"
        html_content += f"<p><strong>Location:</strong> {service_info['location']}</p>"
        html_content += (
            f"<p><strong>Description:</strong> {service_info['description']}</p>"
        )
        html_content += f"<p><strong>Price:</strong> ${service_info['price']}</p>"

    return html_content
