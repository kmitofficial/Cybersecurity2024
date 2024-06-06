const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware to parse JSON bodies
app.use(express.json());

// Students Data
const students = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
    { id: 3, name: "Charlie" }
];

// Public Route without JWT
app.get('/api/students', (req, res) => {
    res.json(students);
});

// JWT Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Protected Route with JWT
app.get('/api/protected/students', authenticateToken, (req, res) => {
    res.json(students);
});

// Default route for generating JWT
app.get('/api/login', (req, res) => {
    // In a real app, you'd want to validate credentials first
    const username = req.query.username || 'guest';
    const user = { name: username };

    const accessToken = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ accessToken });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});