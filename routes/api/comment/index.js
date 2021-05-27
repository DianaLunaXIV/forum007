//setup router
const router = require('express').Router();
//import js files performing the work on the route
const getComment = require('./getComment');
const createComment = require('./createComment');
const updateComment = require('./updateComment');
const deleteComment = require('./deleteComment');
//connect the js files to the route
router.get("/comment/:id",getComment); //getCommentById
router.post("/comment",createComment);
router.put("/comment/:id",updateComment);
router.delete("/comment/:id",deleteComment);
//export router to 
module.exports = router;