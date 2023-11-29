import hashlib
import os
import psycopg2
from psycopg2 import errors, sql
from dotenv import load_dotenv

load_dotenv()
# connecting URL for user database
# Please make sure you have set the correct environment variable name
DATABASE_URL = os.getenv("DB_URL")


def create_user_table():
    """Creates the 'users' table in the database."""

    # Connect to the PostgreSQL database
    conn = psycopg2.connect(DATABASE_URL, sslmode="require")
    cursor = conn.cursor()

    # SQL statement to create the users table
    create_table_query = """
    CREATE TABLE users (
        user_id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,    
        first_name VARCHAR(255),           
        last_name VARCHAR(255),            
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


def add_user(
    username: str,
    email: str,
    phone_number: str,
    password: bytes,
    first_name: str,
    last_name: str,
):
    # Connect to the PostgreSQL database
    conn = psycopg2.connect(DATABASE_URL, sslmode="require")
    cursor = conn.cursor()

    # Convert hashed password to string for storage
    hashed_password_str = password.decode("utf-8")

    # SQL statement to insert the user into the users table
    insert_query = """
    INSERT INTO users (username, email, password, first_name, last_name, phone_number)
    VALUES (%s, %s, %s, %s, %s, %s);
    """

    try:
        cursor.execute(
            insert_query,
            (username, email, hashed_password_str, first_name, last_name, phone_number),
        )
        conn.commit()
        return f"User '{username}' added successfully!"
    except Exception as err:
        return f"Error: {err}"
    finally:
        cursor.close()
        conn.close()


def get_all_users():
    """Retrieves all users from the 'users' table in the database."""
    # Connect to the PostgreSQL database
    conn = psycopg2.connect(DATABASE_URL, sslmode="require")
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


def rate_user_inDB(user_id, rating):
    conn = psycopg2.connect(DATABASE_URL, sslmode="require")
    cursor = conn.cursor()

    try:
        # Get the current rating_sum and num_reviews for the user
        cursor.execute(
            "SELECT rating_sum, num_reviews FROM users WHERE user_id = %s", (user_id,)
        )
        result = cursor.fetchone()

        if not result:
            return "User not found"

        current_rating_sum, current_num_reviews = result

        # Update the rating_sum and num_reviews for the user
        new_rating_sum = current_rating_sum + rating
        new_num_reviews = current_num_reviews + 1
        cursor.execute(
            "UPDATE users SET rating_sum = %s, num_reviews = %s WHERE user_id = %s",
            (new_rating_sum, new_num_reviews, user_id),
        )

        # Commit the changes to the database
        conn.commit()

        return "User rated successfully"
    except Exception as e:
        return str(e)
    finally:
        cursor.close()
        conn.close()


def get_user_info(user_id):
    conn = psycopg2.connect(DATABASE_URL, sslmode="require")
    cursor = conn.cursor()

    try:
        cursor.execute("SELECT * FROM users WHERE user_id = %s", (user_id,))
        user = cursor.fetchone()

        if not user:
            return None, "User not found"

        # Calculate average rating
        rating_sum, num_reviews = user[7], user[8]
        if num_reviews == 0:
            avg_rating = 0
        else:
            avg_rating = rating_sum / num_reviews

        # Construct user info dictionary
        user_info = {
            "user_id": user[0],
            "username": user[1],
            "email": user[2],
            "first_name": user[4],
            "last_name": user[5],
            "phone_number": user[6],
            "rating": avg_rating,
        }

        return user_info, None
    except Exception as e:
        return None, str(e)
    finally:
        cursor.close()
        conn.close()


def get_user_id(username):
    """Get user_id based on a username."""

    # Connect to the PostgreSQL database
    conn = psycopg2.connect(DATABASE_URL, sslmode="require")
    cursor = conn.cursor()

    # SQL statement to fetch user_id for the given username
    select_query = """
    SELECT user_id FROM users WHERE username = %s;
    """

    try:
        cursor.execute(select_query, (username,))
        result = cursor.fetchone()
        if result:
            return result[0]
        else:
            return None
    except Exception as err:
        print(f"Error: {err}")
    finally:
        cursor.close()
        conn.close()


# Test the functions
# addUser('testuser3', 'test2@email.com', '+123456789')
# print(getAllUsers())
# createUserTable()


#                                                   DANGER ZONE
def delete_users_table():
    """Deletes the 'users' table from the database."""

    # Connect to the PostgreSQL database
    conn = psycopg2.connect(DATABASE_URL, sslmode="require")
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


def clear_users():
    """
    Deletes all users from the 'users' table in the database.
    """
    # Connect to the PostgreSQL database
    conn = psycopg2.connect(DATABASE_URL, sslmode="require")
    cursor = conn.cursor()

    # SQL statement to delete all rows from the users table
    delete_query = "DELETE FROM users;"

    try:
        cursor.execute(delete_query)
        conn.commit()
        return "All users deleted successfully!"
    except psycopg2.IntegrityError as e:
        conn.rollback()
        return f"Cannot delete users due to foreign key constraints: {e}"
    except Exception as err:
        return f"Error: {err}"
    finally:
        cursor.close()
        conn.close()


# print(get_all_users())
# delete_users_table()
# createUserTable()
# print(clearUsers())
