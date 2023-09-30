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
```https://task-manager-0-94114aee724a.herokuapp.com/```
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
**Response**:
```json
{
    "message": "Task added successfully!"
}
```
##Get All Tasks
Endpoint: /get_tasks
Method: GET
**Response**:
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
##Making Requests
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
