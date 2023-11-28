# `task_database.py` Documentation

This file is part of a Flask API and is responsible for handling database operations related to tasks. It uses PostgreSQL for data storage and management.

## Table of Contents

- [Imports and Global Variables](#imports-and-global-variables)
- [Function: `create_tables`](#function-create_tables)
- [Function: `add_food_task`](#function-add_food_task)
- [Function: `add_service_task`](#function-add_service_task)
- [Function: `add_accepted_task`](#function-add_accepted_task)

## Imports and Global Variables

- **psycopg2**: PostgreSQL database adapter for Python.
- **os**: To interact with the operating system.
- **errors** from `psycopg2`: To handle database-specific errors.
- **load_dotenv** from `dotenv`: To load environment variables.
- **RealDictCursor** from `psycopg2.extras\*\*: Provides a dictionary-like cursor for PostgreSQL.
- **date** from `datetime`: To work with dates.

The `DATABASE_URL` is retrieved from environment variables, used for connecting to the PostgreSQL database.

## Function: `create_tables`

- **Purpose**: Creates tables in the PostgreSQL database related to tasks.
- **Tables Created**:
  - `tasks`
  - `foodtasks`
  - `servicetasks`
  - `accepted_tasks`
- **Exception Handling**: Catches and logs errors related to table creation, such as duplicate tables or other exceptions.

## Function: `add_food_task`

- **Purpose**: Adds a new food task to the database.
- **Parameters**: `task_name`, `date_posted`, `task_owner`, `start_loc`, `end_loc`, `price`, `restaurant`, `description`
- **Process**:
  - Inserts a task into the `tasks` table.
  - Inserts corresponding details into the `foodtasks` table.
- **Error Handling**: Logs any exceptions and rolls back transaction if an error occurs.

## Function: `add_service_task`

- **Purpose**: Adds a new service task to the database.
- **Parameters**: `task_name`, `date_posted`, `task_owner`, `location`, `description`, `price`
- **Process**:
  - Inserts a task into the `tasks` table.
  - Inserts corresponding details into the `servicetasks` table.
- **Error Handling**: Logs any exceptions and rolls back transaction if an error occurs.

## Function: `add_accepted_task`

- **Purpose**: Records an acceptance of a task.
- **Parameters**: `task_id`, `task_owner_id`, `task_acceptor_id`
- **Returns**: A success message with the `accepted_task_id`, or an error message with details.
- **Error Handling**:
  - Handles integrity errors (e.g., task already accepted or non-existent).
  - Handles other exceptions, with a rollback of the transaction in case of errors.

## Function: `get_all_tasks`

- **Purpose**: Retrieves all tasks from the database, combining information from `tasks`, `foodtasks`, and `servicetasks`.
- **Return**: A list of dictionaries, each representing a task with its detailed information.
- **Error Handling**: Logs any errors encountered during data retrieval.

## Function: `get_user_accepted_tasks`

- **Purpose**: Fetches all tasks accepted by a specific user.
- **Parameters**: `user_id` - The ID of the user.
- **Return**: A JSON object containing a list of accepted tasks.
- **Error Handling**: Returns a detailed error message and a 500 status code in case of failure.

## Function: `delete_task`

- **Purpose**: Deletes a task from the database based on its ID.
- **Parameters**: `task_id` - The ID of the task to delete.
- **Process**:
  - Determines the category of the task and deletes it from the respective table.
  - Deletes the task from the main `tasks` table.
- **Error Handling**: Logs any errors and rolls back the transaction in case of failure.

## Function: `delete_accepted_task`

- **Purpose**: Removes an accepted task from the `accepted_tasks` table.
- **Parameters**: `task_id` - The ID of the task to delete.
- **Return**: Success message on successful deletion.
- **Error Handling**: Returns an error message in case of failure.

## Function: `clear_all_tasks`

- **Purpose**: Deletes all task records from the database.
- **Process**:
  - Deletes entries from `foodtasks` and `servicetasks` first.
  - Deletes entries from the main `tasks` table.
- **Error Handling**: Logs errors and performs a rollback in case of failure.

## Function: `get_all_accepted_tasks`

- **Purpose**: Retrieves all tasks from the `accepted_tasks` table.
- **Return**: A JSON object containing a list of accepted tasks and a 200 status code.
- **Error Handling**: Returns a detailed error message and a 500 status code in case of failure.

## Function: `get_task_info`

- **Purpose**: Retrieves detailed information about a specific task.
- **Parameters**: `task_id` - The ID of the task.
- **Return**: A detailed dictionary of task information if found, or a "Task not found" message.
- **Error Handling**: Returns an error message in case of failure.

## Function: `delete_tables`

- **Purpose**: Drops all task-related tables from the database.
- **Process**:
  - Executes drop table queries for `accepted_tasks`, `foodtasks`, `servicetasks`, and `tasks` in order.
- **Error Handling**: Logs any errors encountered during the process.
