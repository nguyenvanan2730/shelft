const express = require('express');
const morgan = require('morgan');
const router = require('./router/router');

const app = express();
const statics = __dirname.replace('app', 'public');

app.set("port", process.env.PORT || 3000);
app.set("views", "./src/public/view");
app.set("view engine", "pug");

app.use(morgan('dev'));
app.use(express.static(statics));
app.use(router);

module.exports = app;
