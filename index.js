const express = require('express');
const morgan = require('morgan');
const client = require('prom-client');
const schedule = require('node-schedule');
const collectDefaultMetrics = client.collectDefaultMetrics;
const database_connector = require('./db');
const cors = require('cors');
const winston = require('winston');
require('dotenv').config()


// Configure Winston logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'server.log' })
    ]
});

// Routers
const loginRouter = require('./Controllers/routes/Login');
const signUpRouter = require('./Controllers/routes/Signup');
const verificationRouter = require('./Controllers/routes/verification');
const schoolRouter= require('./Controllers/routes/School');
const postRouter = require('./Controllers/routes/Post');
const commentRouter = require('./Controllers/routes/Comment');
const userRouter = require('./Controllers/routes/User');


// Initialize express app
const app = express();

// Database connection
database_connector();

// Metrics setup
collectDefaultMetrics();

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());
app.use(morgan('combined'));

// Routes
app.use(postRouter);
app.use(commentRouter);
app.use(userRouter);
app.use('/login', loginRouter);
app.use('/register', signUpRouter);
app.use('/verify', verificationRouter);

// Health Check
app.get('/health', (req, res) => {
    res.status(200).send({ status: 'OK', uptime: process.uptime(), timestamp: Date.now() });
});

// Metrics Endpoint
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', client.register.contentType);
    res.send(await client.register.metrics());
});


// Root Endpoint
app.get('/', async (req, res) => {
    try {
        return res.status(200).send("<h1>...LIVE...</h1>");
    } catch (error) {
        logger.error('Error in root endpoint:', error);
        return res.status(500).send(error.message);
    }
});

// Error Handling
process.on('uncaughtException', async (err) => {
    logger.error('Unhandled Exception:', { message: err.message, stack: err.stack });
    await sendAdminAlert('Critical Error on B-Academy Server', err.message);
});

process.on('unhandledRejection', async (reason) => {
    logger.error('Unhandled Rejection:', { reason });
    await sendAdminAlert('Unhandled Rejection on B-Academy Server', reason.toString());
});

// Scheduling Reports
const WEEKLY_CRON = process.env.WEEKLY_CRON || '0 0 * * 0';
const THREE_DAY_CRON = process.env.THREE_DAY_CRON || '0 0 */3 * *';

// Weekly report
schedule.scheduleJob(WEEKLY_CRON, async () => {
    try {
        const metricsSummary = await client.register.metrics();
        await sendAdminAlert('Weekly Metrics Report', metricsSummary);
        logger.info('Weekly report sent successfully.');
    } catch (error) {
        logger.error('Error sending weekly report:', error);
    }
});

// Three-day report
schedule.scheduleJob(THREE_DAY_CRON, async () => {
    try {
        const metricsSummary = await client.register.metrics();
        await sendAdminAlert('Three-Day Metrics Report', metricsSummary);
        logger.info('Three-day report sent successfully.');
    } catch (error) {
        logger.error('Error sending three-day report:', error);
    }
});

// Graceful Shutdown
process.on('SIGTERM', async () => {
    logger.info('Shutting down server...');
    // Add cleanup logic here, e.g., closing DB connections
    process.exit(0);
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});

