from flask import Flask, request, jsonify
import psycopg2
from datetime import datetime
import os
from dotenv import load_dotenv
from task_database import add_task
load_dotenv()
DATABASE_URL = os.getenv("TASK_DB_URL")

app = Flask(__name__)


@app.route('/add_task', methods=['POST'])
def add_task_endpoint():
    data = request.get_json()

    # Extract task details from the incoming JSON data
    task_name = data.get('task_name')
    description = data.get('description')
    date_posted = datetime.strptime(data.get('date_posted'), '%Y-%m-%d').date()
    task_owner = data.get('task_owner')

    try:
        # Use the add_task function to add the task to the database
        add_task(task_name, description, date_posted, task_owner)
        return jsonify({"message": "Task added successfully!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
