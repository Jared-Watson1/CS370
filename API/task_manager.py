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
    try:
        task_name = data.get('task_name')
        description = data.get('description')
        date_posted = datetime.strptime(
            data.get('date_posted'), '%Y-%m-%d').date()
        task_owner = data.get('task_owner')
    except Exception as e:
        print("Error: might of missed task attributes: " + str(e))

    try:
        # Use the add_task function to add the task to the database
        add_task(task_name, description, date_posted, task_owner)
        return jsonify({"message": "Task added successfully!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/get_tasks', methods=['GET'])
def get_tasks_endpoint():
    tasks = get_all_tasks()
    return jsonify({"tasks": tasks})


def get_all_tasks():

    # Connect to the PostgreSQL database
    conn = psycopg2.connect(DATABASE_URL, sslmode='require')
    cursor = conn.cursor()

    # SQL statement to retrieve all tasks
    select_all_tasks_query = "SELECT * FROM tasks;"

    result_tasks = []

    try:
        cursor.execute(select_all_tasks_query)
        tasks = cursor.fetchall()

        for task in tasks:
            task_data = {
                "task_id": task[0],
                "task_name": task[1],
                "description": task[2],
                "date_posted": str(task[3]),
                "task_owner": task[4]
            }
            result_tasks.append(task_data)

    except Exception as err:
        print(f"Error: {err}")
    finally:
        cursor.close()
        conn.close()

    return result_tasks


@app.route('/clear_tasks', methods=['DELETE'])
def clear_tasks_endpoint():
    try:
        clear_all_tasks()
        return jsonify({"message": "All tasks cleared successfully!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


def clear_all_tasks():
    # Connect to the PostgreSQL database
    conn = psycopg2.connect(DATABASE_URL, sslmode='require')
    cursor = conn.cursor()

    # SQL statement to delete all tasks
    delete_all_tasks_query = "DELETE FROM tasks;"

    try:
        cursor.execute(delete_all_tasks_query)
        conn.commit()  # Commit the transaction
    except Exception as err:
        conn.rollback()  # Rollback in case of error
        print(f"Error: {err}")
    finally:
        cursor.close()
        conn.close()


port = int(os.environ.get("PORT", 5000))
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=port)
    # print(get_all_tasks())
