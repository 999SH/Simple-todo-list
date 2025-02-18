// src/index.ts
import express, { Request, Response } from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config();

const app = express();
const port: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Set up PostgreSQL connection pool
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
});

// Add a basic test route
app.get('/ping', (_req, res) => {
    res.send('pong');
});

// Endpoint to retrieve all entries
app.get('/todos', async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM todos ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching entries:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Endpoint to add a new entry
app.post('/todos', async (req: Request, res: Response) => {
    try {
        const { content } = req.body;
        const result = await pool.query(
            'INSERT INTO todos (content) VALUES ($1) RETURNING *',
            [content]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error adding entry:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Endpoint to update an entry
app.put('/todos/:id', async (req: Request, res: Response) => {
    try {
        const { complete, id } = req.body;
        const result = await pool.query(
            'UPDATE todos SET complete = $1 WHERE id = $2 RETURNING *',
            [complete, id]
        );

        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Todo not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error adding entry:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Endpoint to delete an entry
app.delete('/todos/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'DELETE FROM todos WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Todo not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error deleting entry:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${port}`);
});
