var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger-output.json')
const bodyParser = require('body-parser')

var usersRouter = require('./routes/users');
var todoRouter = require('./routes/todos')
var categoryRouter = require('./routes/category')
var statusRouter = require('./routes/status')
require('dotenv').config();
var db = require('./models');
//db.sequelize.sync({ force: false });

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json())
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

app.use('/', usersRouter);
app.use('/todos', todoRouter);
app.use('/category', categoryRouter);
app.use('/status', statusRouter);

async function initializeApp() {
    try {
        await db.sequelize.sync();

		const statusData = [
			{  name: "Not started" },
			{  name: "Started" },
            {  name: "Completed" },
            {  name: "Deleted" }
		];
        for (const status of statusData) {
			const existingStatus = await db.Status.findOne({ where: {name: status.name} });
			if (!existingStatus) {
				await db.Status.create(status);
				console.log(`Status "${status.name}" created successfully.`);
			} else {
				console.log(`Status "${status.name}" already exists.`);
			}
		}
        console.log('Application initialized successfully.');
    } catch (error) {
        console.error('Error initializing the application:', error);
    }
}

// Call the initializeApp function to start your application
initializeApp();

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});



module.exports = app;

