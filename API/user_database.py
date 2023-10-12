import psycopg2
import os
from psycopg2 import errors
from dotenv import load_dotenv
from datetime import date

load_dotenv()
DATABASE_URL = os.getenv("TASK_DB_URL")

def createTable():

    # Connect to the PostgreSQL database
    conn = psycopg2.connect(DATABASE_URL, sslmode='require')
    cursor = conn.cursor()

    # SQL statement to create the tasks table
    create_table_query = """
    CREATE TABLE users (
        uid SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
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