import bcrypt
from flask import Flask, request, jsonify
import psycopg2
from datetime import datetime
import os
from dotenv import load_dotenv
from task_database import clear_all_tasks, add_food_task, get_all_tasks
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
    """Endpoint to add a task to the database. Takes in task specific attributes"""
    data = request.get_json()

    # Extract task details from the incoming JSON data
    try:
        task_name = data.get("task_name")
        # This will determine the type of task (food or service)
        category = data.get("category", "").lower()
        description = data.get("description")
        date_posted = datetime.strptime(data.get("date_posted"), "%Y-%m-%d").date()
        username = data.get("username")
        task_owner = get_user_id(username=username)
    except Exception as e:
        print("Error: might of missed task attributes: " + str(e))

    try:
        if category == "food":
            # add the food task to the database
            start_loc = data.get("start_loc")
            end_loc = data.get("end_loc")
            price = data.get("price")
            restaurant = data.get("restaurant")
            add_food_task(
                task_name,
                date_posted,
                task_owner,
                start_loc,
                end_loc,
                price,
                restaurant,
                description,
            )
        else:
            # add_task(task_name, description, date_posted, task_owner)
            print("Other categories not added implemented yet")

        return jsonify({"message": "Task added successfully!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500



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
        task_owner = get_user_id(username=username)  # Ensure this does not raise an unhandled exception

        # Initialize scheduled_time as None
        scheduled_time = None
        if data.get('scheduled_time'):
            scheduled_time = datetime.strptime(data['scheduled_time'], "%H:%M").time()

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
                scheduled_time=scheduled_time
            )
        else:
            return jsonify({"error": "Category not implemented"}), 400  # Use 400 if no other categories will be added

        return jsonify({"message": "Task added successfully!"}), 200

    except Exception as e:
        # Log the error for server-side debugging
        app.logger.error(f"Error adding task to the database: {e}")
        return jsonify({"error": "Internal server error"}), 500



@app.route("/clear_task", methods=["DELETE"])
def clear_task_endpoint():
    # console.log('#####^^^^^^^^^^^^^^^^^^000');
    data = request.get_json()
    task_name = data.get("task_name")
    # task_name='a'
    if not task_name:
        return jsonify({"error": "Missing 'task_name' parameter"}), 400
    try:
        clear_task_by_name(task_name)
        return jsonify({"message": f"Task '{task_name}' cleared successfully!"}), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "Failed to clear task"}), 500


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


@app.route("/get_info_by_user", methods=["POST"])
def get_info_by_user():
    """Get user information based off of user's username."""
    data = request.get_json()

    try:
        username = data.get("username")
        user_id = get_user_id(username)
        user_info, error_message = getUserInfo(user_id)

        if error_message:
            return jsonify({"error": error_message}), 400

        return jsonify(user_info), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


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
