const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// First create a connection without database selection
const initialConnection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || ''
});

// Create database and tables
const dbSetup = async () => {
    try {
        // Read SQL file
        const sql = fs.readFileSync(path.join(__dirname, 'database.sql'), 'utf8');
        
        // Split SQL file into separate statements
        const statements = sql.split(';').filter(stmt => stmt.trim());
        
        // Execute each statement
        for (let statement of statements) {
            if (statement.trim()) {
                await initialConnection.promise().query(statement);
            }
        }
        
        console.log('Database and tables created successfully');
        initialConnection.end();
        
        // Create the main connection
        const db = mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'alumni_management'
        });
        
        db.connect((err) => {
            if (err) {
                console.error('Error connecting to the database:', err);
                return;
            }
            console.log('Connected to database');
        });
        
        return db;
    } catch (error) {
        console.error('Error setting up database:', error);
        process.exit(1);
    }
};

// Initialize database and get connection
let db;
(async () => {
    db = await dbSetup();
})();

// File upload configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret', (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

// Test route to verify API is working
app.get('/test', (req, res) => {
    res.json({ message: 'Backend API is working!' });
});

// Auth routes
app.post('/auth/register', async (req, res) => {
    try {
        console.log('Register request received:', req.body);
        const { name, email, password, course } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        // Start a transaction
        db.beginTransaction(async (err) => {
            if (err) {
                console.error('Error starting transaction:', err);
                return res.status(500).json({ message: 'Error creating user' });
            }

            // First insert the user
            const userQuery = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
            db.query(userQuery, [name, email, hashedPassword], (err, result) => {
                if (err) {
                    db.rollback(() => {
                        console.error('Registration error:', err);
                        if (err.code === 'ER_DUP_ENTRY') {
                            return res.status(400).json({ message: 'Email already exists' });
                        }
                        return res.status(500).json({ message: 'Error creating user' });
                    });
                    return;
                }

                const userId = result.insertId;

                // Then insert the alumni profile if course is provided
                if (course) {
                    const profileQuery = 'INSERT INTO alumni_profiles (user_id, course) VALUES (?, ?)';
                    db.query(profileQuery, [userId, course], (err, result) => {
                        if (err) {
                            db.rollback(() => {
                                console.error('Error creating alumni profile:', err);
                                return res.status(500).json({ message: 'Error creating alumni profile' });
                            });
                            return;
                        }

                        // Commit the transaction
                        db.commit((err) => {
                            if (err) {
                                db.rollback(() => {
                                    console.error('Error committing transaction:', err);
                                    return res.status(500).json({ message: 'Error creating user' });
                                });
                                return;
                            }
                            console.log('User registered successfully with course');
                            res.status(201).json({ message: 'User registered successfully' });
                        });
                    });
                } else {
                    // Commit the transaction if no course provided
                    db.commit((err) => {
                        if (err) {
                            db.rollback(() => {
                                console.error('Error committing transaction:', err);
                                return res.status(500).json({ message: 'Error creating user' });
                            });
                            return;
                        }
                        console.log('User registered successfully without course');
                        res.status(201).json({ message: 'User registered successfully' });
                    });
                }
            });
        });
    } catch (error) {
        console.error('Server error during registration:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/auth/login', async (req, res) => {
    try {
        console.log('Login request received:', req.body);
        const { email, password } = req.body;

        const query = 'SELECT * FROM users WHERE email = ?';
        db.query(query, [email], async (err, results) => {
            if (err) {
                console.error('Login error:', err);
                return res.status(500).json({ message: 'Server error' });
            }

            if (results.length === 0) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const user = results[0];
            const validPassword = await bcrypt.compare(password, user.password);

            if (!validPassword) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const token = jwt.sign(
                { id: user.id, email: user.email, type: user.type },
                process.env.JWT_SECRET || 'your_jwt_secret',
                { expiresIn: '24h' }
            );

            console.log('User logged in successfully:', user.email);
            res.json({
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    type: user.type
                }
            });
        });
    } catch (error) {
        console.error('Server error during login:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Forum routes
app.get('/auth/forums', (req, res) => {
    console.log('Fetching forums');
    const query = 'SELECT * FROM forum_topics ORDER BY created_at DESC';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching forums:', err);
            return res.status(500).json({ message: 'Error fetching forums' });
        }
        console.log(`Found ${results.length} forum topics`);
        res.json(results);
    });
});

app.post('/auth/forum', authenticateToken, (req, res) => {
    console.log('Creating new forum topic:', req.body);
    const { title, description } = req.body;
    const userId = req.user.id;
    const createdBy = req.user.name;

    const query = 'INSERT INTO forum_topics (title, description, user_id, created_by) VALUES (?, ?, ?, ?)';
    db.query(query, [title, description, userId, createdBy], (err, result) => {
        if (err) {
            console.error('Error creating forum topic:', err);
            return res.status(500).json({ message: 'Error creating forum topic' });
        }
        console.log('Forum topic created successfully');
        res.status(201).json({ message: 'Forum topic created successfully' });
    });
});

// Events routes
app.get('/auth/up_events', (req, res) => {
    console.log('Fetching upcoming events');
    const query = 'SELECT * FROM events WHERE schedule >= CURDATE() ORDER BY schedule ASC';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching events:', err);
            return res.status(500).json({ message: 'Error fetching events' });
        }
        console.log(`Found ${results.length} upcoming events`);
        res.json(results);
    });
});

// Courses route
app.get('/courses', (req, res) => {
    console.log('Fetching courses');
    // For now, return hardcoded courses
    const courses = [
        { id: 1, course: 'Computer Science' },
        { id: 2, course: 'Information Technology' },
        { id: 3, course: 'Mechanical Engineering' },
        { id: 4, course: 'Electrical Engineering' },
        { id: 5, course: 'Civil Engineering' },
        { id: 6, course: 'Electronics and Communication' },
        { id: 7, course: 'Business Administration' },
        { id: 8, course: 'Data Science' }
    ];
    console.log('Sending courses:', courses);
    res.json({ courses });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 