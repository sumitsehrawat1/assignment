const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const colors = require('colors');
const errorHandler = require('./middleware/error');

//Route Files
const meals = require('./routes/meals');
const auth = require('./routes/auth');

//Load env vars
dotenv.config({ path: './config/config.env' });

//connect to databse
connectDB();

const app = express();

//Body Parser
app.use(express.json());

// Dev logging middleware
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

// Mount routers
app.use('/api/v1/meals',meals);
app.use('/api/v1/auth',auth);


app.use(errorHandler);

const PORT = process.env.PORT || 2000;

const server = app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} node on port ${PORT}`.yellow.bold));

// Hanlde unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red);
    //Close server and exit process
    server.close(() => process.exit(1));
});