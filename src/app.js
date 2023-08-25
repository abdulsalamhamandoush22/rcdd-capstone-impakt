const path = require('path');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const swaggerUi = require('swagger-ui-express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env file

const swaggerDocument = require('./docs/swagger.json');
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const donationRoutes = require('./routes/donationRoutes');
const blogRoutes = require('./routes/blogRoutes');
const connectToMongo = require('./config/db');

const app = express();
const port = 8080;

app.use(express.static('assets'));

// View engine setup
app.set('views', path.join(__dirname, 'views')); // Set the views directory
app.set('view engine', 'ejs'); // Use EJS as the view engine

// Middleware
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname, 'views')));
app.use(
  session({
    secret: process.env.JWT_SECRET
    resave: false,
    saveUninitialized: true,
  })
);

// Initialize Passport and add it as middleware
app.use(passport.initialize());
app.use(passport.session());


// Routes
app.use('/', userRoutes);
app.use('/', eventRoutes);
app.use('/', donationRoutes);
app.use('/', blogRoutes);

// Error handling middlewarejb
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  connectToMongo();
});

module.exports = server;
