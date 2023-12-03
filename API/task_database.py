import psycopg2
import os
from psycopg2 import errors
from dotenv import load_dotenv
from psycopg2.extras import RealDictCursor
from datetime import date
from user_database import get_username


load_dotenv()
# connecting URL for database
DATABASE_URL = os.getenv("DB_URL")


def create_tables():
    """Create tables for tasks"""
    # Connect to the PostgreSQL database
    conn = psycopg2.connect(DATABASE_URL, sslmode="require")
    cursor = conn.cursor()

    # SQL statement to create the tasks table
    create_tasks_table_query = """
    CREATE TABLE IF NOT EXISTS tasks (
        task_id SERIAL PRIMARY KEY,
        task_name VARCHAR(255) NOT NULL,
        category VARCHAR(50) NOT NULL CHECK (category IN ('Food', 'Service')),
        date_posted DATE NOT NULL,
        task_owner INT NOT NULL,
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

    create_accepted_tasks_table_query = """
    CREATE TABLE IF NOT EXISTS accepted_tasks (
        task_id INT NOT NULL,
        task_owner_id INT NOT NULL,
        task_acceptor_id INT NOT NULL,
        date_accepted TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (task_id, task_acceptor_id),
        FOREIGN KEY (task_id) REFERENCES tasks(task_id),
        FOREIGN KEY (task_owner_id) REFERENCES users(user_id),
        FOREIGN KEY (task_acceptor_id) REFERENCES users(user_id)
    );
    """

    try:
        cursor.execute(create_tasks_table_query)
        cursor.execute(create_food_task_table_query)
        cursor.execute(create_service_task_table_query)
        cursor.execute(create_accepted_tasks_table_query)
        conn.commit()
        print("Tables created successfully!")
    except errors.DuplicateTable:
        print("Some tables already exist!")
    except Exception as err:
        print(f"Error: {err}")
    finally:
        cursor.close()
        conn.close()


def add_food_task(
    task_name,
    date_posted,
    task_owner,
    start_loc,
    end_loc,
    price,
    restaurant,
    description,
):
    # Connect to the PostgreSQL database
    conn = psycopg2.connect(DATABASE_URL, sslmode="require")
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
        cursor.execute(
            insert_food_task_query,
            (task_id, start_loc, end_loc, price, restaurant, description),
        )
        conn.commit()
        print("Food task added successfully!")
    except Exception as err:
        print(f"Error: {err}")
    finally:
        cursor.close()
        conn.close()


def add_service_task(task_name, date_posted, task_owner, location, description, price):
    # Connect to the PostgreSQL database
    conn = psycopg2.connect(DATABASE_URL, sslmode="require")
    cursor = conn.cursor()

    # SQL statement to insert a new task into the tasks table
    insert_task_query = """
    INSERT INTO tasks (task_name, category, date_posted, task_owner)
    VALUES (%s, 'Service', %s, %s) RETURNING task_id;
    """

    # SQL statement to insert details into servicetasks table
    insert_service_task_query = """
    INSERT INTO servicetasks (task_id, location, description, price)
    VALUES (%s, %s, %s, %s);
    """

    try:
        # Add entry to tasks table
        cursor.execute(insert_task_query, (task_name, date_posted, task_owner))
        # Get the task_id of the just-added task
        task_id = cursor.fetchone()[0]

        # Add corresponding details to servicetasks table
        cursor.execute(
            insert_service_task_query,
            (task_id, location, description, price),
        )
        conn.commit()
        print("Service task added successfully!")
    except Exception as err:
        print(f"Error: {err}")
        conn.rollback()  # Ensure a rollback on error
    finally:
        cursor.close()
        conn.close()


def add_accepted_task(task_id, task_owner_id, task_acceptor_id):
    # Connect to the PostgreSQL database
    conn = psycopg2.connect(DATABASE_URL, sslmode="require")
    cursor = conn.cursor()

    # SQL statement to insert a new accepted task
    insert_accepted_task_query = """
    INSERT INTO accepted_tasks (task_id, task_owner_id, task_acceptor_id, date_accepted)
    VALUES (%s, %s, %s, CURRENT_TIMESTAMP)
    """

    try:
        # Execute the SQL command, passing the data
        cursor.execute(
            insert_accepted_task_query, (task_id, task_owner_id, task_acceptor_id)
        )
        conn.commit()
        accepted_task_id = cursor.fetchone()[0]  # Fetch the id of the new accepted task
        return {
            "message": "Task accepted successfully!",
            "accepted_task_id": accepted_task_id,
        }, 200
    except psycopg2.IntegrityError as e:
        conn.rollback()
        return {
            "error": "An integrity error occurred. Perhaps the task is already accepted or does not exist.",
            "details": str(e),
        }, 400
    except Exception as e:
        conn.rollback()
        return {
            "error": "An error occurred while accepting the task.",
            "details": str(e),
        }, 500
    finally:
        cursor.close()
        conn.close()


def get_all_tasks():
    """Function to retrieve all tasks that have not been accepted."""

    # Connect to the PostgreSQL database
    conn = psycopg2.connect(DATABASE_URL, sslmode="require")
    cursor = conn.cursor()

    # SQL statement to retrieve tasks that are not in the accepted_tasks table
    select_all_tasks_query = """
    SELECT 
        t.task_id, t.task_name, t.category, t.date_posted, t.task_owner,
        f.start_loc, f.end_loc, f.price AS food_price, f.restaurant, f.description AS food_description,
        s.location, s.description AS service_description, s.price AS service_price
    FROM tasks t
    LEFT JOIN foodtasks f ON t.task_id = f.task_id
    LEFT JOIN servicetasks s ON t.task_id = s.task_id
    LEFT JOIN accepted_tasks a ON t.task_id = a.task_id
    WHERE a.task_id IS NULL;
    """

    result_tasks = []

    try:
        cursor.execute(select_all_tasks_query)
        tasks = cursor.fetchall()

        for task in tasks:
            task_data = {
                "task_id": task[0],
                "task_name": task[1],
                "category": task[2],
                "date_posted": str(task[3]),
                "task_owner": task[4],
            }

            if task[2] == "Food":
                task_data.update(
                    {
                        "start_loc": task[5],
                        "end_loc": task[6],
                        "price": task[7],
                        "restaurant": task[8],
                        "description": task[9],
                    }
                )
            elif task[2] == "Service":
                task_data.update(
                    {"location": task[10], "description": task[11], "price": task[12]}
                )

            result_tasks.append(task_data)

    except Exception as err:
        print(f"Error: {err}")
    finally:
        cursor.close()
        conn.close()

    return result_tasks


def get_tasks_posted_by_user(user_id):
    """Retrieve all tasks posted by a specific user."""

    # Connect to the PostgreSQL database
    conn = psycopg2.connect(DATABASE_URL, sslmode="require")
    cursor = conn.cursor()

    # SQL query to fetch tasks based on task_owner
    query = """
    SELECT 
        t.task_id, t.task_name, t.category, t.date_posted, t.task_owner,
        f.start_loc, f.end_loc, f.price AS food_price, f.restaurant, f.description AS food_description,
        s.location, s.description AS service_description, s.price AS service_price
    FROM tasks t
    LEFT JOIN foodtasks f ON t.task_id = f.task_id
    LEFT JOIN servicetasks s ON t.task_id = s.task_id
    WHERE t.task_owner = %s;
    """

    try:
        # Execute the query
        cursor.execute(query, (user_id,))
        tasks = cursor.fetchall()

        # Format and return the task data
        result_tasks = []
        for task in tasks:
            task_data = {
                "task_id": task[0],
                "task_name": task[1],
                "category": task[2],
                "date_posted": task[3],
                "task_owner": task[4],
                "additional_info": {
                    "food": {
                        "start_loc": task[5],
                        "end_loc": task[6],
                        "price": task[7],
                        "restaurant": task[8],
                        "description": task[9],
                    },
                    "service": {
                        "location": task[10],
                        "description": task[11],
                        "price": task[12],
                    },
                },
            }
            result_tasks.append(task_data)

        return result_tasks
    except Exception as e:
        print(f"Error: {e}")
        return None
    finally:
        cursor.close()
        conn.close()


def get_user_accepted_tasks(user_id):
    conn = psycopg2.connect(DATABASE_URL, sslmode="require")
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    query = """
        SELECT * FROM accepted_tasks
        JOIN tasks ON accepted_tasks.task_id = tasks.task_id
        WHERE task_acceptor_id = %s;
    """
    try:
        cursor.execute(query, (user_id,))
        accepted_tasks = cursor.fetchall()
        result = {"accepted_tasks": accepted_tasks}
        # result["task_owner_username"] = get_username(
        #     result["accepted_tasks"]["task_owner_id"]
        # )
        return result, 200
    except Exception as e:
        return {
            "error": "An error occurred while retrieving accepted tasks.",
            "details": str(e),
        }, 500
    finally:
        cursor.close()
        conn.close()


def delete_task1(task_id):
    """Delete task by task_id"""
    # Connect to the PostgreSQL database
    conn = psycopg2.connect(DATABASE_URL, sslmode="require")
    cursor = conn.cursor()

    try:
        # Begin a transaction
        conn.autocommit = False

        # Determine the category of the task
        cursor.execute("SELECT category FROM tasks WHERE task_id = %s", (task_id,))
        category_result = cursor.fetchone()
        if not category_result:
            raise Exception("Task not found")

        category = category_result[0].lower()

        # Delete from the specific task table based on category
        if category == "food":
            cursor.execute("DELETE FROM foodtasks WHERE task_id = %s", (task_id,))
        elif category == "service":
            cursor.execute("DELETE FROM servicetasks WHERE task_id = %s", (task_id,))
        else:
            raise Exception("Unknown task category")

        # After deleting from specific task table, delete from the tasks table
        cursor.execute("DELETE FROM tasks WHERE task_id = %s", (task_id,))

        # Commit the transaction
        conn.commit()
        print("Task deleted successfully!")
    except Exception as err:
        print(f"Error: {err}")
        conn.rollback()  # Rollback in case of error
    finally:
        cursor.close()
        conn.close()


def delete_task2(task_id):
    """Delete a task from the database."""

    # Connect to the PostgreSQL database
    conn = psycopg2.connect(DATABASE_URL, sslmode="require")
    cursor = conn.cursor()

    try:
        # Delete task from related tables first
        cursor.execute("DELETE FROM accepted_tasks WHERE task_id = %s;", (task_id,))
        cursor.execute("DELETE FROM foodtasks WHERE task_id = %s;", (task_id,))
        cursor.execute("DELETE FROM servicetasks WHERE task_id = %s;", (task_id,))

        # Finally, delete the task from the tasks table
        cursor.execute("DELETE FROM tasks WHERE task_id = %s;", (task_id,))

        conn.commit()
        return "Task deleted successfully"

    except Exception as e:
        conn.rollback()
        return f"Error: {e}"
    finally:
        cursor.close()
        conn.close()


def delete_accepted_task(task_id):
    """Delete an accepted task from the accepted_tasks table."""

    try:
        # Connect to the PostgreSQL database
        conn = psycopg2.connect(DATABASE_URL, sslmode="require")
        cursor = conn.cursor()

        # SQL DELETE statement
        delete_query = "DELETE FROM accepted_tasks WHERE task_id = %s;"

        # Execute the query
        cursor.execute(delete_query, (task_id,))

        # Commit the changes
        conn.commit()
        return "Task deleted successfully"

    except Exception as e:
        return f"Error: {e}"
    finally:
        cursor.close()
        conn.close()


def clear_all_tasks():
    # Connect to the PostgreSQL database
    conn = psycopg2.connect(DATABASE_URL, sslmode="require")
    cursor = conn.cursor()

    # SQL statements to delete all tasks from the related tables
    delete_food_tasks_query = "DELETE FROM foodtasks;"
    delete_service_tasks_query = "DELETE FROM servicetasks;"
    delete_all_tasks_query = "DELETE FROM tasks;"
    delete_all_accepted_tasks_query = "DELETE FROM accepted_tasks;"

    try:
        # Since we are deleting all records, we should start with the child tables
        cursor.execute(delete_food_tasks_query)
        cursor.execute(delete_service_tasks_query)
        cursor.execute(delete_all_accepted_tasks_query)

        # After the child tables have been cleared, we can clear the main tasks table
        cursor.execute(delete_all_tasks_query)

        # Commit the transaction
        conn.commit()
        return "Cleared all tasks and related entries from database."
    except Exception as err:
        # Rollback in case of error
        conn.rollback()
        return f"Error: {err}"
    finally:
        # Close the cursor and connection
        cursor.close()
        conn.close()


def get_all_accepted_tasks():
    """Function to retrieve all tasks from the accepted_tasks table"""

    # Connect to the PostgreSQL database
    conn = psycopg2.connect(DATABASE_URL, sslmode="require")
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    # SQL query to select all tasks from accepted_tasks
    query = """
    SELECT *
    FROM accepted_tasks
    JOIN tasks ON accepted_tasks.task_id = tasks.task_id;
    """

    try:
        cursor.execute(query)
        accepted_tasks = cursor.fetchall()
        return {"accepted_tasks": accepted_tasks}, 200

    except Exception as e:
        return {
            "error": "An error occurred while retrieving accepted tasks.",
            "details": str(e),
        }, 500

    finally:
        cursor.close()
        conn.close()


import psycopg2


def get_task_info(task_id):
    """Retrieve information about a task by task_id."""

    # SQL query to join tasks with foodtasks, servicetasks, and accepted_tasks
    query = """
    SELECT t.task_id, t.task_name, t.category, t.date_posted, t.task_owner,
           ft.start_loc, ft.end_loc, ft.price AS food_price, ft.restaurant, ft.description AS food_description,
           st.location, st.description AS service_description, st.price AS service_price,
           at.task_acceptor_id, at.date_accepted
    FROM tasks t
    LEFT JOIN foodtasks ft ON t.task_id = ft.task_id
    LEFT JOIN servicetasks st ON t.task_id = st.task_id
    LEFT JOIN accepted_tasks at ON t.task_id = at.task_id
    WHERE t.task_id = %s;
    """

    try:
        # Connect to the PostgreSQL database
        conn = psycopg2.connect(DATABASE_URL, sslmode="require")
        cursor = conn.cursor()

        # Execute the query
        cursor.execute(query, (task_id,))
        task_info = cursor.fetchone()

        # Construct a dictionary with the task information
        if task_info:
            task_details = {
                "task_id": task_info[0],
                "task_name": task_info[1],
                "category": task_info[2],
                "date_posted": task_info[3],
                "task_owner": task_info[4],
                "additional_info": {
                    "food": {
                        "start_loc": task_info[5],
                        "end_loc": task_info[6],
                        "price": task_info[7],
                        "restaurant": task_info[8],
                        "description": task_info[9],
                    },
                    "service": {
                        "location": task_info[10],
                        "description": task_info[11],
                        "price": task_info[12],
                    },
                    "accepted_task": {
                        "task_acceptor_id": task_info[13],
                        "date_accepted": task_info[14],
                    },
                },
            }
            return task_details
        else:
            return "Task not found"

    except Exception as e:
        return f"Error: {e}"
    finally:
        cursor.close()
        conn.close()


def delete_tables():
    # Connect to the PostgreSQL database
    conn = psycopg2.connect(DATABASE_URL, sslmode="require")
    cursor = conn.cursor()

    # SQL statements to drop the tables
    drop_accepted_tasks_table_query = "DROP TABLE IF EXISTS accepted_tasks;"
    drop_foodtasks_table_query = "DROP TABLE IF EXISTS foodtasks;"
    drop_servicetasks_table_query = "DROP TABLE IF EXISTS servicetasks;"
    drop_tasks_table_query = "DROP TABLE IF EXISTS tasks;"

    try:
        # Order of execution is important due to foreign key constraints
        cursor.execute(drop_accepted_tasks_table_query)
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
