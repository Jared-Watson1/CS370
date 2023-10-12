import hashlib
import os
import psycopg2
from psycopg2 import errors, sql
from dotenv import load_dotenv

load_dotenv()
# connecting URL for user database
# Please make sure you have set the correct environment variable name
DATABASE_URL = os.getenv("DB_URL")

# Create table for users


def createUserTable():
    """Creates the 'users' table in the database."""

    # Connect to the PostgreSQL database
    conn = psycopg2.connect(DATABASE_URL, sslmode='require')
    cursor = conn.cursor()

    # SQL statement to create the users table
    create_table_query = """
    CREATE TABLE users (
        user_id VARCHAR(255) PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        phone_number VARCHAR(15),
        rating_sum INT DEFAULT 0,
        num_reviews INT DEFAULT 0
    );
    """

    try:
        cursor.execute(create_table_query)
        conn.commit()
        print("Table 'users' created successfully!")
    except psycopg2.errors.DuplicateTable:
        print("Table 'users' already exists!")
    except Exception as err:
        print(f"Error: {err}")
    finally:
        cursor.close()
        conn.close()


def hash_username(username: str) -> str:
    """Generates a hash for the given username."""
    return hashlib.sha256(username.encode()).hexdigest()


def addUser(username: str, email: str, phone_number: str):
    """
    Adds a user to the 'users' table in the database.
    """
    # Connect to the PostgreSQL database
    conn = psycopg2.connect(DATABASE_URL, sslmode='require')
    cursor = conn.cursor()

    user_id = hash_username(username)

    # SQL statement to insert the user into the users table
    insert_query = """
    INSERT INTO users (user_id, username, email, phone_number)
    VALUES (%s, %s, %s, %s);
    """

    try:
        cursor.execute(insert_query, (user_id, username, email, phone_number))
        conn.commit()
        return f"User '{username}' added successfully!"
    except psycopg2.IntegrityError as e:
        conn.rollback()
        if "duplicate key value violates unique constraint" in str(e):
            if "users_pkey" in str(e):
                return f"A user already exists with username: {username}"
            elif "email" in str(e):
                return f"Email '{email}' is already associated with another user."
            else:
                return "An error occurred while trying to add the user. Please try again."
        else:
            return "An error occurred while trying to add the user. Please try again."
    except Exception as err:
        return f"Error: {err}"
    finally:
        cursor.close()
        conn.close()


def getAllUsers():
    """
    Retrieves all users from the 'users' table in the database.
    """
    # Connect to the PostgreSQL database
    conn = psycopg2.connect(DATABASE_URL, sslmode='require')
    cursor = conn.cursor()

    # SQL statement to fetch all users
    fetch_query = "SELECT * FROM users;"

    try:
        cursor.execute(fetch_query)
        users = cursor.fetchall()
        return users
    except Exception as err:
        print(f"Error: {err}")
        return []
    finally:
        cursor.close()
        conn.close()


# Test the functions
# addUser('testuser3', 'test2@email.com', '+123456789')
# print(getAllUsers())
# createUserTable()


# DANGER ZONE
def delete_users_table():
    """Deletes the 'users' table from the database."""

    # Connect to the PostgreSQL database
    conn = psycopg2.connect(DATABASE_URL, sslmode='require')
    cursor = conn.cursor()

    # SQL statement to delete the users table
    delete_table_query = """
    DROP TABLE IF EXISTS users;
    """

    try:
        cursor.execute(delete_table_query)
        conn.commit()
        print("'users' table deleted successfully!")
    except Exception as err:
        print(f"Error: {err}")
    finally:
        cursor.close()
        conn.close()

# delete_users_table()
