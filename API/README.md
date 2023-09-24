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
   pip install psycopg2'''
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

-**Manage Multiple Databases: Create, manage, and delete PostgreSQL instances.
-**SQL Browser: Directly run SQL commands on your database using the browser-based UI.
-**Monitoring & Analytics: View metrics related to your database's performance and usage.