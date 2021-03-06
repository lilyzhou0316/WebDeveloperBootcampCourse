var mongoose = require("mongoose");

//create comment schema
var commentSchema = new mongoose.Schema({
	text: String,
    author: {
		id:{
			type:mongoose.Schema.Types.ObjectId,
			ref:"User"
		},
		username:String
	}
});
//save it to a model
module.exports = mongoose.model("Comment",commentSchema);