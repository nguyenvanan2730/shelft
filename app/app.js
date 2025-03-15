// Import express.js
const express = require("express");
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Import morgan for logging
const morgan = require('morgan');
const router = require('./router/router');

// Create express app
var app = express();
const allowedOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000'];

app.use(cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (origin.indexOf('localhost') !== -1 || origin.indexOf('127.0.0.1') !== -1) {
        console.log('Allowed origin:', origin);
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'), false);
    },
    credentials: true
  }));
  
// Set static files directory
const statics = __dirname.replace('app', 'public');

app.set("port", process.env.PORT || 3000);
app.set("views", "./public/view");
app.set("view engine", "pug");
app.use(express.json());
app.use(cookieParser());

// Get the functions in the db.js file to use
const db = require('./services/db');

// Use morgan for logging
app.use(morgan('dev'));

// Serve static files
app.use(express.static(statics));

// Use the router
app.use(router);

// Start server on the specified port
app.listen(app.get("port"), function(){
    console.log(`Server running at http://127.0.0.1:${app.get("port")}/`);
});

module.exports = app;