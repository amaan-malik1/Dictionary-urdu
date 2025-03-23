const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const Redis = require('ioredis');
const compression = require('compression');
const morgan = require('morgan');

// Initialize Express app
const app = express();

// Redis client setup
const redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD,
    retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
    }
});

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});

// Middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
    crossOriginEmbedderPolicy: false,
}));
app.use(cors());
app.use(compression());
app.use(morgan('combined'));
app.use(express.json());
app.use('/api/', limiter);

// Cache middleware
const cacheMiddleware = (duration) => async (req, res, next) => {
    const key = `cache:${req.originalUrl}`;

    try {
        const cachedData = await redis.get(key);
        if (cachedData) {
            return res.json(JSON.parse(cachedData));
        }
        res.sendResponse = res.json;
        res.json = (body) => {
            redis.setex(key, duration, JSON.stringify(body));
            res.sendResponse(body);
        };
        next();
    } catch (error) {
        next(error);
    }
};

// Routes
app.get('/api/search', cacheMiddleware(300), async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ error: 'Query parameter is required' });
        }

        // Implement your search logic here
        const results = await searchWords(query);
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/word/:word', cacheMiddleware(300), async (req, res) => {
    try {
        const { word } = req.params;
        if (!word) {
            return res.status(400).json({ error: 'Word parameter is required' });
        }

        // Implement your word lookup logic here
        const wordData = await getWordDetails(word);
        if (!wordData) {
            return res.status(404).json({ error: 'Word not found' });
        }
        res.json(wordData);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'healthy' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 