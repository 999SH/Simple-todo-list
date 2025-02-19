Commands needed to run:

npm install

npm start

# Todo API Documentation

## Overview
The Todo API provides endpoints for managing a simple todo list. It supports operations such as retrieving, adding, updating, and deleting todos. The API is built using Express.js and connects to a PostgreSQL database.

### Base URL
```
http://localhost:3001
```

## Authentication
This API does not currently require authentication.

---

## Endpoints

### 1. Health Check
#### `GET /ping`
##### Description:
Checks if the API is running.
##### Response:
```json
"pong"
```

---

### 2. Retrieve All Todos
#### `GET /todos`
##### Description:
Fetches all todo items, sorted by the `created_at` timestamp in descending order.
##### Response:
- **200 OK**
```json
[
    {
        "id": 1,
        "content": "Buy groceries",
        "complete": false,
        "created_at": "2024-02-19T12:34:56.789Z"
    },
    {
        "id": 2,
        "content": "Walk the dog",
        "complete": true,
        "created_at": "2024-02-19T10:22:33.123Z"
    }
]
```
- **500 Internal Server Error**
```json
{"error": "Database error"}
```

---

### 3. Add a New Todo
#### `POST /todos`
##### Description:
Creates a new todo item.
##### Request Body:
```json
{
    "content": "Finish homework"
}
```
##### Response:
- **200 OK**
```json
{
    "id": 3,
    "content": "Finish homework",
    "complete": false,
    "created_at": "2024-02-19T15:45:00.123Z"
}
```
- **500 Internal Server Error**
```json
{"error": "Database error"}
```

---

### 4. Update a Todo
#### `PUT /todos/:id`
##### Description:
Updates the `complete` status of a specific todo item.
##### Request Parameters:
- `id` (path parameter): The ID of the todo to update.

##### Request Body:
```json
{
    "complete": true
}
```
##### Response:
- **200 OK**
```json
{
    "id": 3,
    "content": "Finish homework",
    "complete": true,
    "created_at": "2024-02-19T15:45:00.123Z"
}
```
- **404 Not Found**
```json
{"error": "Todo not found"}
```
- **500 Internal Server Error**
```json
{"error": "Database error"}
```

---

### 5. Delete a Todo
#### `DELETE /todos/:id`
##### Description:
Deletes a specific todo item by ID.
##### Request Parameters:
- `id` (path parameter): The ID of the todo to delete.

##### Response:
- **200 OK**
```json
{
    "id": 3,
    "content": "Finish homework",
    "complete": true,
    "created_at": "2024-02-19T15:45:00.123Z"
}
```
- **404 Not Found**
```json
{"error": "Todo not found"}
```
- **500 Internal Server Error**
```json
{"error": "Database error"}
```

---

## Environment Variables
This API relies on environment variables to configure the PostgreSQL connection. Ensure that the following variables are set in a `.env` file:

```
PORT=3001
DB_USER=your_database_user
DB_HOST=your_database_host
DB_DATABASE=your_database_name
DB_PASSWORD=your_database_password
DB_PORT=5432
```

---

## Error Handling
- `500 Internal Server Error`: Indicates an issue with the database connection or query execution.
- `404 Not Found`: Returned when an update or delete operation is attempted on a non-existent todo item.

## Notes
- Ensure PostgreSQL is running and accessible for the API to function correctly.
- This API is designed for local development and may need authentication/security layers before deployment.

