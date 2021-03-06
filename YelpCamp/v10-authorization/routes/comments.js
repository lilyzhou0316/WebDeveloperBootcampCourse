var express = require("express");
var router = express.Router({mergeParams:true});//this merge the params from campgrounds and comments together
var CampGround = require("../models/campGround");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//get new comment's content from the form
//isLoggedIn is to check whether a user is logged in ,if it is the case, then he/she can add a new comment.
router.get("/new",middleware.isLoggedIn,function(req,res){
	CampGround.findById(req.params.id,function(err,returnData){
		if(err){
			console.log(err);
		}else{
			res.render("comments/new",{campground:returnData});
		}
	});
	
});

//add the new comment's content to the specific campground's comments page
router.post("/",middleware.isLoggedIn,function(req,res){
		CampGround.findById(req.params.id,function(err,returnData){
			if(err){
				console.log(err);
				res.redirect("/campgrounds");
			}else{
				Comment.create(req.body.comment,function(err,newComment){
					if(err){
						console.log(err);
					}else{
						//add username and id to the comment
						newComment.author.id = req.user._id;
						newComment.author.username = req.user.username;
						//save comment
						newComment.save();
						
						returnData.comments.push(newComment);
						returnData.save();
						//console.log(newComment);
						res.redirect("/campgrounds/"+returnData._id);
					}
				})
				
			}
		});
});

//EDIT ROUTE
//to show edit form to user and get the info that user entered
router.get("/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
	//pass the campground's id to comments/edit.ejs
	var campground_id = req.params.id;
	
	Comment.findById(req.params.comment_id,function(err,editComment){
		if(err){
			res.redirect("back");
		}else{
			res.render("comments/edit",{comment: editComment,campground_id:campground_id});
		}	
	})
});

//UPDATE ROUTE
//to update the specific comment according to the info that user entered 
router.put("/:comment_id",middleware.checkCommentOwnership,function(req,res){
	//find the comment and update it, the second param is the form returned to us
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComm){
		if(err){
			res.redirect("back")
		}else{
			res.redirect("/campgrounds/"+ req.params.id);
		}
	});
	
});

//DELETE ROUTE
//to delete a comment
router.delete("/:comment_id",middleware.checkCommentOwnership,function(req,res){
	Comment.findByIdAndDelete(req.params.comment_id,function(err){
		if(err){
			res.redirect("back")
		}else{
			res.redirect("/campgrounds/"+ req.params.id)
		}
	});
});

module.exports = router;