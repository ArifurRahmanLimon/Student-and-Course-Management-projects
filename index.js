const express = require('express');
const app = express();
const courses = require('./routes/courses');
const home = require('./routes/home');
const mongoose = require('mongoose');

// joy is for input validation package before posting a data to database 

mongoose.connect('mongodb://localhost/playground')
     .then(() => console.log("Successfully connected to mongoDB"))
     .catch(err => console.error('Could not connect to mongoDB..', err));


app.use(express.json());
app.use('/api/courses', courses);
app.use('/', home);



const port = process.env.port || 3000
app.listen(port, ()=> console.log(`Listening on port ${port}`));


