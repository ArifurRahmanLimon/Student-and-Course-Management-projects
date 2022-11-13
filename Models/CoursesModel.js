const mongoose = require('mongoose');
const Joy = require('@hapi/joi/lib');
const express = require('express');

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

//Validating our input of the request body using joy framework of javascript 
function validateCourse(course) {
    const schema = Joy.object({
        name : Joy.string() .min(3).required()
    })
    const result = Joy.validate(course, schema);
    return result;
}

exports.Course = Course; 
exports.validate = validateCourse;