# Table of Contents
1. [Task Database with ElephantSQL](#task-database-with-elephantsql)
   - [Code Overview](#code-overview)
   - [Prerequisites](#prerequisites)
   - [Setup](#setup)
   - [Interacting with ElephantSQL](#interacting-with-elephantsql)
2. [Task Manager API](#task-manager-api)
   - [Setting up the API on Heroku](#setting-up-the-api-on-heroku)
   - [API Endpoints](#api-endpoints)
      - [API Base URL](#api-base-url)
      - [Add a Task](#add-a-task)
      - [Get All Tasks](#get-all-tasks)
   - [Making Requests](#making-requests)

---

# Task Database with ElephantSQL

This repository contains a Python script `task_database.py` which sets up and interacts with a PostgreSQL database hosted on [ElephantSQL](https://www.elephantsql.com/).

## Code Overview

The script uses the `psycopg2` library to connect to the PostgreSQL database and perform various operations:

- **Setting up a table**: `createTable()` sets up a table for tasks with attributes such as task ID, name, description, date posted, and task owner.
- **Adding a task**: `add_task(task_name, description, date_posted, task_owner)` adds a task to the table.
- **Retrieving all tasks**: `get_all_tasks()` retrieves all tasks from the table and prints them out.

## Prerequisites

1. **Python**: Ensure you have Python installed.
2. **psycopg2**: Install the psycopg2 library using pip:
   ```bash
   pip install psycopg2
   ```
3. dotenv: Install the python-dotenv library to use environment variables:
    ```bash
    pip install python-dotenv
    ```
4. ElephantSQL Account: Create an account on ElephantSQL.

## Setup
1. Environment Variable:
After creating your PostgreSQL instance on ElephantSQL, you'll be provided with a connection URL.
Save this URL as an environment variable named TASK_DB_URL in a .env file in the root of your project.
The load_dotenv() function in the script ensures the environment variables from your .env file are loaded.
2. Run the Script:
Uncomment the desired function calls at the bottom of task_database.py to perform specific operations.
Execute the script:
    ```bash
    python task_database.py
    ```

## Interacting with ElephantSQL
With an ElephantSQL account, you can:

- Manage Multiple Databases: Create, manage, and delete PostgreSQL instances.
- SQL Browser: Directly run SQL commands on your database using the browser-based UI.
- Monitoring & Analytics: View metrics related to your database's performance and usage.

# Task Manager API

The Task Manager API allows users to interact with tasks in a database. It's built with Flask and is hosted on Heroku.

## Setting up the API on Heroku

1. The application is hosted on Heroku and is connected to a PostgreSQL database.
2. Environment variables (like `TASK_DB_URL`) are set in Heroku and are utilized within the application for database connections and other configurations.
3. The `requirements.txt` file in the root directory contains all the Python libraries required for the application. Heroku uses this file to install dependencies.
4. The `Procfile` informs Heroku how to run the application.
5. The application binds to a port specified by the `PORT` environment variable, which is automatically set by Heroku.

## API Endpoints 
### API Base URL 
```bash
https://task-manager-0-94114aee724a.herokuapp.com
```
### Add a Task

- **Endpoint**: `/add_task`
- **Method**: POST
- **Data Format**: JSON

**Request Body Example**:
```json
{
    "task_name": "Sample Task",
    "description": "This is a sample task for demonstration purposes.",
    "date_posted": "2023-09-30",
    "task_owner": "John Doe"
}
```
** Response:
```json
{
    "message": "Task added successfully!"
}
```
## Get All Tasks
Endpoint: /get_tasks
Method: GET
** Response**:
```json
{
    "tasks": [
        {
            "task_id": 1,
            "task_name": "Sample Task",
            "description": "This is a sample task for demonstration purposes.",
            "date_posted": "2023-09-30",
            "task_owner": "John Doe"
        }
        // ... other tasks
    ]
}
```
## Making Requests
You can interact with the API using tools like curl or Postman. Here are some examples using curl:

Add a Task
```bash
curl -X POST https://task-manager-0-94114aee724a.herokuapp.com/add_task \
-H "Content-Type: application/json" \
-d '{
    "task_name": "Sample Task",
    "description": "This is a sample task.",
    "date_posted": "2023-09-30",
    "task_owner": "John Doe"
}'
```
Get All Tasks
```bash
curl https://task-manager-0-94114aee724a.herokuapp.com/get_tasks
```
