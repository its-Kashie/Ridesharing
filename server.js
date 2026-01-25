const express = require('express');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());

const DB_PATH = path.join(__dirname, 'users.json');
const BACKEND_URL = 'http://localhost:8082';

// Initialize DB
if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({
        users: [
            { id: "admin-1", name: "System Admin", email: "admin@demo.com", password: "admin123", role: "admin" },
            { id: "driver-1", name: "John Driver", email: "driver@demo.com", password: "driver123", role: "driver" },
            { id: "user-1", name: "Alice Passenger", email: "user@demo.com", password: "user123", role: "user" },
        ]
    }));
}

// Auth API
app.post('/api/auth/signup', (req, res) => {
    const { name, email, password, role } = req.body;
    const db = JSON.parse(fs.readFileSync(DB_PATH));

    if (db.users.find(u => u.email === email)) {
        return res.status(400).json({ message: "User already exists" });
    }

    const newUser = { id: Math.random().toString(36).substr(2, 9), name, email, password, role };
    db.users.push(newUser);
    fs.writeFileSync(DB_PATH, JSON.stringify(db));

    const { password: _, ...userWithoutPassword } = newUser;
    res.json(userWithoutPassword);
});

app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const db = JSON.parse(fs.readFileSync(DB_PATH));
    const user = db.users.find(u => u.email === email && u.password === password);

    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
});

// Proxy to C++ Backend
app.use('/api', async (req, res) => {
    if (req.path === '/auth/login' || req.path === '/auth/signup') return;

    try {
        const url = `${BACKEND_URL}/api${req.path}`;
        const response = await axios({
            method: req.method,
            url,
            data: req.body,
            headers: req.headers
        });
        res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Proxy error:', error.message);
        res.status(error.response?.status || 500).json({ error: "Backend unavailable" });
    }
});

// Real-time Simulation
setInterval(() => {
    const load = Math.floor(Math.random() * 40) + 10;
    io.emit('metrics_update', {
        coreEngineLoad: load,
        timestamp: new Date().toLocaleTimeString()
    });
}, 2000);

io.on('connection', (socket) => {
    console.log('Client connected for real-time updates');
});

const PORT = 8080;
server.listen(PORT, () => {
    console.log(`RideFlow API Bridge running on port ${PORT}`);
});
