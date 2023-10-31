import os
from dotenv import load_dotenv
import requests
import json

load_dotenv()
BASE_URL = os.getenv("API_BASE_URL")

# test add_task endpoint
def add_task(task_name, description, date_posted, task_owner):
    endpoint = f'{BASE_URL}/add_task'
    payload = {
        "task_name": task_name,
        "description": description,
        "date_posted": date_posted,
        "task_owner": task_owner
    }
    response = requests.post(endpoint, json=payload)
    if response.status_code == 200:
        print("Task added successfully!")
    else:
        print(f"Failed to add task. Reason: {response.text}")

# test get_tasks endpoint
def get_tasks():
    endpoint = f'{BASE_URL}/get_tasks'
    response = requests.get(endpoint)

    if response.status_code == 200:
        tasks = response.json().get('tasks', [])
        # Using json.dumps to pretty print the JSON object
        print(json.dumps(tasks, indent=4))
    else:
        print(f"Failed to fetch tasks. Error message: {response.text}")


# Example usage
# Add a task
# add_task("test test test", "This is a new task test 3", "2023-10-01", "j dub")

# Get and display tasks
get_tasks()
