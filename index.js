const express = require('express');
const app = express();
const courses = require('./routes/courses');
const home = require('./routes/home');

// joy is for input validation package before posting a data to database 

app.use(express.json());
app.use('/api/courses', courses);
app.use('/', home);


const port = process.env.port || 3000
app.listen(port, ()=> console.log(`Listening on port ${port}`));


