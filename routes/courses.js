const express = require('express');
const router = express.Router(); 
const Joy = require('@hapi/joi/lib');
const mongoose = require('mongoose');

/// MongoDV related things 

const courseSchema = new mongoose.Schema({
    id : Number,
    name : String
    // name : {
    //     type : String,
    //     require : true,
    //     minlength: 5,
    //     maxlength : 20
    // }
});


const Course = mongoose.model('Course', courseSchema);

async function createCourses() {

    const now = await getCourses();
    const course1 = new Course({
    id : now + 1,
    name : "My course"
    });

    const result = await course1.save();
    console.log(result);
}

async function temp() {
    await createCourses();
    await createCourses();
    await createCourses();
}

//temp();

//Find couses from mongodb
async function getCourses() {
    const courses = await Course.find()
    return courses;
}

async function getNumberOfCourses() {
    const courseNumber = await Course.find().count();
    return courseNumber;
}


// Updating Mongo DB data
/*
There is two approach : 
1.
Query first
->FindById
->modify its property
->save 

2.
Update first
->Update directly
->Optionally get the update 

*/

//First apprroach 
async function updateCourseInDb(Id) {
    const course1 = await Course.findById(Id)
    if(!course1) return;
    course1.name = "Limon upadted this courses";

    const result = await course1.save();
    console.log(result); 
}

//updateCourseInDb('636f436c03a026d2f31beae1');

// Second  approach 
async function updateCourseInDbAnotherApproach(ID){
    const result = await Course.updateMany({id : ID}, {
        $set : {
            name : "Updating course by second approach"
        }
    });

    console.log(result);
}

// updateCourseInDbAnotherApproach(3);

// Removing or deleting data from mongoDV
async function removeCourses(ID){
    const result = await Course.deleteOne({id : ID});
    console.log(result);
}
// removeCourses(3);

///********** */ mongoDVrelated things 


router.get('/',async(req, res) => {
    const courses = await Course.find().sort('name')
    // finding the course and sorting by their name;
    res.send(courses);
});

//get data from data base 
router.get('/:id', (req, res) => {
    const course = courses.find(i => i.id === parseInt(req.params.id));
    if (!course) res.status(404).send("Can not get courses");
    res.send(course);  
});


//post data into database
router.post('/', async(req, res) => {

    // checking input validation using joy 
    //designing a schema for input validation
    const result = validateCourse(req.body);
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return ;
    }

    const currentNumberOfCourses = await Course.find().count();
     
    const course = new Course({
        id : currentNumberOfCourses + 1,
        name : req.body.name  
    });

    await course.save();
    res.send(course);
});


// upadating datamodel using put request
router.put('/:id', (req, res) => {

    console.log("Hit enter in put");
    // at first try to find that courses
    const course = courses.find(i => i.id === parseInt(req.params.id));
    if (!course) res.status(404).send("Can not get courses");
    
    // now try to validate the input
    // clean code by object desstructuring 
    const {error} = validateCourse(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return ;
    }
    
    course.name = req.body.name;
    res.send(course);
});


// deleting courses from data model delete requst
router.delete('/:id', (req, res) => {
    
    console.log("Hit enter in delete : ");   
    // at first try to find that courses
    const course = courses.find(i => i.id === parseInt(req.params.id));
    if (!course) res.status(404).send("Can not get courses");

    const index = courses.indexOf(course);
    courses.slice(index, 1);
    res.send(course);
});


//Validating our input of the request body using joy framework of javascript 
function validateCourse(course) {
    const schema = Joy.object({
        name : Joy.string() .min(3).required()
    })
    const result = Joy.validate(course, schema);
    return result;
}

module.exports = router;

