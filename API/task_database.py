import psycopg2
import os
from psycopg2 import errors
from dotenv import load_dotenv
from datetime import date


load_dotenv()
# connecting URL for database
DATABASE_URL = os.getenv("DB_URL")

# Create table for tasks


def create_tables():
    # Connect to the PostgreSQL database
    conn = psycopg2.connect(DATABASE_URL, sslmode='require')
    cursor = conn.cursor()

    # SQL statement to create the tasks table
    create_tasks_table_query = """
    CREATE TABLE IF NOT EXISTS tasks (
        task_id SERIAL PRIMARY KEY,
        task_name VARCHAR(255) NOT NULL,
        category VARCHAR(50) NOT NULL CHECK (category IN ('Food', 'Service')),
        date_posted DATE NOT NULL,
        task_owner VARCHAR(255) NOT NULL,
        FOREIGN KEY (task_owner) REFERENCES users(user_id)
    );
    """

    create_food_task_table_query = """
    CREATE TABLE IF NOT EXISTS foodtasks (
        task_id SERIAL PRIMARY KEY,
        start_loc TEXT NOT NULL,
        end_loc TEXT NOT NULL,
        price DECIMAL NOT NULL,
        restaurant VARCHAR(255) NOT NULL,
        description TEXT,
        FOREIGN KEY (task_id) REFERENCES tasks(task_id)
    );
    """

    create_service_task_table_query = """
    CREATE TABLE IF NOT EXISTS servicetasks (
        task_id SERIAL PRIMARY KEY,
        location TEXT NOT NULL,
        description TEXT NOT NULL,
        price DECIMAL NOT NULL,
        FOREIGN KEY (task_id) REFERENCES tasks(task_id)
    );
    """

    try:
        cursor.execute(create_tasks_table_query)
        cursor.execute(create_food_task_table_query)
        cursor.execute(create_service_task_table_query)
        conn.commit()
        print("Tables created successfully!")
    except errors.DuplicateTable:
        print("Some tables already exist!")
    except Exception as err:
        print(f"Error: {err}")
    finally:
        cursor.close()
        conn.close()


def add_food_task(task_name, date_posted, task_owner, start_loc, end_loc, price, restaurant, description):
    # Connect to the PostgreSQL database
    conn = psycopg2.connect(DATABASE_URL, sslmode='require')
    cursor = conn.cursor()

    # SQL statement to insert a new task in tasks table
    insert_task_query = """
    INSERT INTO tasks (task_name, category, date_posted, task_owner)
    VALUES (%s, 'Food', %s, %s) RETURNING task_id;
    """

    # SQL statement to insert details into foodtasks table
    insert_food_task_query = """
    INSERT INTO foodtasks (task_id, start_loc, end_loc, price, restaurant, description)
    VALUES (%s, %s, %s, %s, %s, %s);
    """

    try:
        # Add entry to tasks table
        cursor.execute(insert_task_query, (task_name, date_posted, task_owner))
        # Get the task_id of the just added task
        task_id = cursor.fetchone()[0]

        # Add corresponding details to foodtasks table
        cursor.execute(insert_food_task_query, (task_id, start_loc,
                       end_loc, price, restaurant, description))
        conn.commit()
        print("Food task added successfully!")
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
        print("Cleared all tasks from database.")
    except Exception as err:
        conn.rollback()  # Rollback in case of error
        print(f"Error: {err}")
    finally:
        cursor.close()
        conn.close()


def clear_task_by_name(task_name):
    conn = psycopg2.connect(DATABASE_URL, sslmode='require')
    cursor = conn.cursor()

    # SQL statement to insert a new task
    delete_task_query = """
    DELETE FROM tasks (task_name)
    VALUES (%s);
    """

    #console.log('perform send *****');

    # list_task_query="""
    # SELECT * FROM tasks
    # """

    # SQL statement to delete a task by task_name
    #delete_task_query = "DELETE FROM tasks WHERE task_name = %s;"

    try:
        cursor.execute(delete_task_query, (task_name))
        # cursor.execute(list_task_query)
        conn.commit()  # Commit the transaction
        print("Task removed successfully!")
    except Exception as err:
        conn.rollback()
        print(f"Error: {err}")
    finally:
        cursor.close()
        conn.close()


def delete_tables():
    # Connect to the PostgreSQL database
    conn = psycopg2.connect(DATABASE_URL, sslmode='require')
    cursor = conn.cursor()

    # SQL statements to drop the tables
    drop_foodtasks_table_query = "DROP TABLE IF EXISTS foodtasks;"
    drop_servicetasks_table_query = "DROP TABLE IF EXISTS servicetasks;"
    drop_tasks_table_query = "DROP TABLE IF EXISTS Tasks;"

    try:
        cursor.execute(drop_foodtasks_table_query)
        cursor.execute(drop_servicetasks_table_query)
        cursor.execute(drop_tasks_table_query)
        conn.commit()
        print("Tables deleted successfully!")
    except Exception as err:
        print(f"Error: {err}")
    finally:
        cursor.close()
        conn.close()


# Example of retrieving and printing all tasks
# get_all_tasks()
# create_tables()
# delete_tables()

# Example task
# get_all_tasks_tester