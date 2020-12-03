const mongoose = require('mongoose')
const BlogPost = require('./models/BlogPost')

mongoose.connect('mongodb://localhost/mydatabase',{useNewUrlParser:true})

var id = "5fc3b95b3dc5bc14880d7988"
BlogPost.findById(id,(error,blogpost)=> {
	console.log(error, blogpost)})
