import bcrypt
from flask import Flask, request, jsonify
import psycopg2
from datetime import datetime
import os
from dotenv import load_dotenv
from task_database import (
    add_food_task,
    get_all_tasks,
    add_service_task,
)
from user_database import (
    addUser,
    getAllUsers,
    clearUsers,
    rateUserInDB,
    getUserInfo,
    get_user_id,
)
from flask_cors import CORS

load_dotenv()
DATABASE_URL = os.getenv("DB_URL")

app = Flask(__name__)
CORS(app)


###   ---          TASK END POINTS          ---   ###


@app.route("/add_task", methods=["POST"])
def add_task_endpoint():
    """Endpoint to add a task to the database. Takes in task specific attributes."""
    data = request.get_json()

    try:
        task_name = data.get("task_name")
        category = data.get("category", "").lower()
        description = data.get("description")
        date_posted = datetime.strptime(data.get("date_posted"), "%Y-%m-%d").date()
        username = data.get("username")
        task_owner = get_user_id(username=username)

    except (ValueError, TypeError) as e:
        return jsonify({"error": f"Invalid input: {e}"}), 400

    try:
        if category == "food":
            start_loc = data.get("start_loc")
            end_loc = data.get("end_loc")
            price = float(data.get("price", 0))  # Default price to 0 if not provided
            restaurant = data.get("restaurant")

            add_food_task(
                task_name=task_name,
                date_posted=date_posted,
                task_owner=task_owner,
                start_loc=start_loc,
                end_loc=end_loc,
                price=price,
                restaurant=restaurant,
                description=description,
            )
        elif category == "service":
            # Assume location, price, and description are required for service tasks
            location = data.get("location")
            price = float(data.get("price", 0))  # Default price to 0 if not provided

            add_service_task(
                task_name=task_name,
                date_posted=date_posted,
                task_owner=task_owner,
                location=location,
                description=description,
                price=price,
            )
        else:
            # Return an error if the category is neither food nor service
            return jsonify({"error": "Category not recognized"}), 400

        return jsonify({"message": "Task added successfully!"}), 200

    except Exception as e:
        # Log the error for server-side debugging
        app.logger.error(f"Error adding task to the database: {e}")
        return jsonify({"error": "Internal server error"}), 500


@app.route("/get_tasks", methods=["GET"])
def get_tasks_endpoint():
    """Endpoint to get all tasks."""
    try:
        tasks = get_all_tasks()
        return jsonify(tasks), 200
    except Exception as e:
        app.logger.error(f"Failed to retrieve tasks: {e}")
        return jsonify({"error": "Internal server error"}), 500


###   ---              USER ENDPOINTS           ---   ###


def hash_password(password: str) -> bytes:
    """Hashes a password using bcrypt."""
    salt = bcrypt.gensalt()  # Generate a unique salt
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed


def check_password(plain_password: str, hashed_password: bytes) -> bool:
    """Verifies a password against its hashed version."""
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password)


@app.route("/add_user", methods=["POST"])
def add_user_endpoint():
    """End point to add user to the DB. Takes in all user attributes"""
    data = request.get_json()

    # Extract user details from the incoming JSON data
    try:
        username = data.get("username")
        email = data.get("email")
        phone_number = data.get("phone_number")
        password = data.get("password")
        first_name = data.get("first_name")
        last_name = data.get("last_name")

        # Check if mandatory attributes are provided
        if not (username and email and password):  # Password made mandatory
            raise ValueError("Missing mandatory user attributes.")

        hashed_password = hash_password(password)

    except Exception as e:
        return jsonify({"error": "Might have missed user attributes: " + str(e)}), 400

    # Use the addUser function to add the user to the database
    response_message = addUser(
        username, email, phone_number, hashed_password, first_name, last_name
    )

    # Check the response to determine the status code
    if "successfully" in response_message:
        return jsonify({"message": response_message}), 200
    else:
        return jsonify({"error": response_message}), 400


@app.route("/get_all_users", methods=["GET"])
def get_all_users_endpoint():
    """Endpoint to get all users in DB"""
    try:
        users_data = getAllUsers()

        # Format the users data into a list of dictionaries for JSON representation
        users_list = []
        for user in users_data:
            user_dict = {
                "user_id": user[0],
                "username": user[1],
                "email": user[2],
                "password": user[3],
                "first_name": user[4],
                "last_name": user[5],
                "phone_number": user[6],
                "rating_sum": user[7],
                "num_reviews": user[8],
            }
            users_list.append(user_dict)

        return jsonify({"users": users_list}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/rate_user", methods=["POST"])
def rate_user():
    """Endpoint to rate user based off of a username"""
    data = request.get_json()

    try:
        user_id = data.get("user_id")
        rating = int(data.get("rating"))

        # Validation check for rating
        if rating < 1 or rating > 5:
            return jsonify({"error": "Rating should be between 1 and 5"}), 400

        response_message = rateUserInDB(user_id, rating)

        # Check the response to determine the status code
        if "successfully" in response_message:
            return jsonify({"message": response_message}), 200
        else:
            return jsonify({"error": response_message}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/get_info_by_user", methods=["GET"])
def get_info_by_user():
    """Get user information based on the user's username."""
    username = request.args.get("username")

    if not username:
        return jsonify({"error": "Username is required"}), 400

    try:
        user_id = get_user_id(username)
        if user_id is None:
            return jsonify({"error": "User not found"}), 404

        user_info, error_message = getUserInfo(user_id)

        if error_message:
            return jsonify({"error": error_message}), 500

        if user_info is None:
            return jsonify({"error": "User not found"}), 404

        return jsonify(user_info), 200
    except Exception as e:
        app.logger.error(f"Error fetching user info: {e}")
        return jsonify({"error": "Internal server error"}), 500


@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    plain_password = data.get("password")

    if not username or not plain_password:
        return jsonify({"error": "Missing username or password"}), 400

    user_id = get_user_id(username)
    if user_id is None:
        return jsonify({"error": "Invalid username or password"}), 401

    # Connect to the PostgreSQL database
    conn = psycopg2.connect(DATABASE_URL, sslmode="require")
    cursor = conn.cursor()

    try:
        # Fetch the hashed password from the database
        cursor.execute("SELECT password FROM users WHERE user_id = %s", (user_id,))
        result = cursor.fetchone()
        if result is None:
            return jsonify({"error": "Invalid username or password"}), 401

        hashed_password = result[0]

        # Check the password
        if check_password(plain_password, hashed_password):
            # User authenticated, return success message
            return jsonify({"message": "Login successful"}), 200
        else:
            return jsonify({"error": "Invalid username or password"}), 401

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()


@app.route("/DANGER_clear_users", methods=["POST"])
def clear_users_endpoint():
    response_message = clearUsers()
    if "successfully" in response_message:
        return jsonify({"message": response_message}), 200
    else:
        return jsonify({"error": response_message}), 500


port = int(os.environ.get("PORT", 3000))
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=port)
    # print(get_all_tasks())
