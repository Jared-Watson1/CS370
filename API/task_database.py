import psycopg2
import os
from psycopg2 import errors
from dotenv import load_dotenv
from datetime import date


load_dotenv()
# connecting URL for database
DATABASE_URL = os.getenv("TASK_DB_URL")

# Create table for tasks


def createTable():

    # Connect to the PostgreSQL database
    conn = psycopg2.connect(DATABASE_URL, sslmode='require')
    cursor = conn.cursor()

    # SQL statement to create the tasks table
    create_table_query = """
    CREATE TABLE tasks (
        task_id SERIAL PRIMARY KEY,
        task_name VARCHAR(255) NOT NULL,
        description TEXT,
        date_posted DATE NOT NULL,
        task_owner VARCHAR(255) NOT NULL 
        FOREIGN KEY (task_owner) REFERENCES users(user_id)
    );
    """

    try:
        cursor.execute(create_table_query)
        conn.commit()
        print("Table 'tasks' created successfully!")
    except errors.DuplicateTable:
        print("Table 'tasks' already exists!")
    except Exception as err:
        print(f"Error: {err}")
    finally:
        cursor.close()
        conn.close()


def add_task(task_name, description, date_posted, task_owner):

    # Connect to the PostgreSQL database
    conn = psycopg2.connect(DATABASE_URL, sslmode='require')
    cursor = conn.cursor()

    # SQL statement to insert a new task
    insert_task_query = """
    INSERT INTO tasks (task_name, description, date_posted, task_owner)
    VALUES (%s, %s, %s, %s);
    """

    try:
        cursor.execute(insert_task_query, (task_name,
                       description, date_posted, task_owner))
        conn.commit()
        print("Task added successfully!")
    except Exception as err:
        print(f"Error: {err}")
    finally:
        cursor.close()
        conn.close()

# tester function to see all tasks


def get_all_tasks_tester():

    # Connect to the PostgreSQL database
    conn = psycopg2.connect(DATABASE_URL, sslmode='require')
    cursor = conn.cursor()

    # SQL statement to retrieve all tasks
    select_all_tasks_query = "SELECT * FROM tasks;"

    try:
        cursor.execute(select_all_tasks_query)
        tasks = cursor.fetchall()

        if not tasks:
            print("No tasks found.")
            return

        print("Tasks in the database:")
        for task in tasks:
            print(
                f"Task ID: {task[0]}, Task Name: {task[1]}, Description: {task[2]}, Date Posted: {task[3]}, Task Owner: {task[4]}")
    except Exception as err:
        print(f"Error: {err}")
    finally:
        cursor.close()
        conn.close()


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

# Example of retrieving and printing all tasks
# get_all_tasks()


# Example task
# add_task("Sample Task2", "This is a description for the sample task2.",
#          date.today(), "John Doe2")
