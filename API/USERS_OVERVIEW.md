# `user_database.py` Documentation

This file is part of a Flask API and is responsible for handling database operations related to users. It uses PostgreSQL for data storage and management.

## Table of Contents

- [Imports and Global Variables](#imports-and-global-variables)
- [Function: `createUserTable`](#function-createUserTable)
- [Function: `hash_username`](#function-hash_username)
- [Function: `addUser`](#function-addUser)
- [Function: `getAllUsers`](#function-getAllUsers)
- [Function: `rateUserInDB`](#function-rateUserInDB)
- [Function: `getUserInfo`](#function-getUserInfo)
- [Function: `get_user_id`](#function-get_user_id)
- [Function: `delete_users_table`](#function-delete_users_table)
- [Function: `clearUsers`](#function-clearUsers)

## Imports and Global Variables

- **hashlib**: For hashing usernames.
- **os**: To interact with the operating system.
- **psycopg2**: PostgreSQL database adapter for Python.
- **errors** and **sql** from `psycopg2`: For handling database-specific errors.
- **load_dotenv** from `dotenv`: To load environment variables.

The `DATABASE_URL` is retrieved from environment variables, used for connecting to the PostgreSQL database.

## Function: `createUserTable`

- **Purpose**: Creates the `users` table in the PostgreSQL database.
- **Process**: Executes an SQL statement to create the table.
- **Error Handling**: Catches and logs errors, such as duplicate tables or other exceptions.

## Function: `hash_username`

- **Purpose**: Generates a SHA256 hash for the provided username.
- **Parameters**: `username` - The username to hash.
- **Return**: The SHA256 hash of the username.

## Function: `addUser`

- **Purpose**: Adds a new user to the `users` table.
- **Parameters**: `username`, `email`, `phone_number`, `password`, `first_name`, `last_name`.
- **Return**: Success message on successful addition or error message in case of failure.
- **Error Handling**: Logs and returns any exceptions that occur.

## Function: `getAllUsers`

- **Purpose**: Retrieves all users from the `users` table.
- **Return**: A list of all users or an empty list if an error occurs.
- **Error Handling**: Logs and returns any errors.

## Function: `rateUserInDB`

- **Purpose**: Updates the rating for a given user.
- **Parameters**: `user_id`, `rating` - The ID of the user and the rating to add.
- **Return**: Success message on successful rating update or error message in case of failure.
- **Error Handling**: Logs and returns any errors.

## Function: `getUserInfo`

- **Purpose**: Retrieves detailed information about a specific user.
- **Parameters**: `user_id` - The ID of the user.
- **Return**: A dictionary with user information or an error message.
- **Error Handling**: Logs and returns any errors.

## Function: `get_user_id`

- **Purpose**: Fetches the user ID based on a username.
- **Parameters**: `username` - The username to search for.
- **Return**: The user ID or None if not found.
- **Error Handling**: Logs and returns any errors.

## Function: `delete_users_table`

- **Purpose**: Deletes the `users` table from the database.
- **Error Handling**: Logs and returns any errors.

## Function: `clearUsers`

- **Purpose**: Deletes all user records from the `users` table.
- **Return**: Success message on successful deletion or error message in case of failure.
- **Error Handling**: Handles integrity errors and logs any other errors.
