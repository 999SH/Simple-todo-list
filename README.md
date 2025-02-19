File structure is as following:

```
/Simple-todo-list
  ├── client/               # React frontend application
  │     ├── public/
  │     ├── src/
  │     ├── package.json
  │     └── README.md       # Client-specific instructions
  ├── server/               # Node.js/Express backend API
  │     ├── src/
  │     ├── package.json
  │     └── README.md       # Server-specific instructions
  ├── db/                   # Database configuration and scripts (PostgreSQL)
  │     ├── init.sql        # Initialization scripts for the database
  │     └── README.md       # DB-specific instructions
  ├── docker-compose.yml    # Orchestrates server, client, and database containers
  └── README.md             # (This file) overall project documentation
```

Entire app should work by running:

docker-compose up --build

and connecting to localhost:3000
