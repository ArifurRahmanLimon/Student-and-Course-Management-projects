const express = require('express');
const router = express.Router(); 
const mongoose = require('mongoose');
const {Course, validate} = require('../Models/CoursesModel');

/// MongoDV related things 

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
router.get('/:id', async(req, res) => {
    const result = await Course.find({id : req.params.id});
    if (!result) res.status(404).send("Can not get courses");
    res.send(result);
});


//post data into database
router.post('/', async(req, res) => {

    // checking input validation using joy 
    //designing a schema for input validation
    const result = validate(req.body);
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
router.put('/:id', async(req, res) => {

    // now try to validate the input
    // clean code by object desstructuring 
    const {error} = validate(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return ;
    }

    const result = await Course.updateMany({id : req.params.id}, {
        $set : {
            name : req.body.name
        }
    });

    if (!result) res.status(404).send("Can not get courses");

    console.log(result);
    
    res.send(result);
});


// deleting courses from data model delete requst
router.delete('/:id', async(req, res) => {
    
    console.log("Hit enter in delete : ");  
    const result = await Course.deleteOne({id : req.params.id});

    if (!result) res.status(404).send("Can not get to delete");
    res.send(result);
});


module.exports = router;

