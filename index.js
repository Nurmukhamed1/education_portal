const express= require('express') 
const path = require('path')
const app = new express() 
const ejs = require('ejs')

const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const BlogPost = require('./models/BlogPost.js')

const fileUpload = require('express-fileupload')
app.use(fileUpload())
mongoose.connect('mongodb://localhost/mydatabase', {useNewUrlParser: true});

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

const newUserController = require('./controllers/newUser')
const flash = require('connect-flash');
const storeUserController = require('./controllers/storeUser')
const expressSession = require('express-session');
const loginController = require('./controllers/login')
const loginUserController = require('./controllers/loginUser')
const logoutController = require('./controllers/logout')

const validateMiddleware = require("./middleware/validateMiddleware");
const redirectIfAuthenticatedMiddleware = require('./middleware/redirectIfAuthenticatedMiddleware')


app.set('view engine', 'ejs'); 

app.use(express.static('public'));

app.listen(2000, ()=> {
	console.log('App is listenning');
})

app.use(expressSession({
    secret: 'keyboard cat' 
})) 

global.loggedIn = null;

app.use("*", (req, res, next) => {
    loggedIn = req.session.userId; 
    next()   
});

app.get('/',(req,res)=>{
	res.render('index');
})

app.get('/about',(req,res)=>{
	res.render('about');
})

/////////
app.get('/post/:id',async (req,res)=>{        
    const blogpost = await BlogPost.findById(req.params.id)
    console.log(blogpost)
    res.render('post',{
        blogpost
    });    
})

///////
app.get('/courses',async (req,res)=>{
	const blogposts = await BlogPost.find({})
	res.render('courses',{
		blogposts
	});
})

app.get('/create1',(req,res)=>{
	res.render('create1')
})
app.get('/register',(req,res)=>{
    res.render('register')
})

app.post('/posts/store', (req,res)=>{ 
    let image = req.files.image;  
    image.mv(path.resolve(__dirname,'public/images',image.name),async (error)=>{
        await BlogPost.create({
            ...req.body,
            image: '/images/' + image.name
        })
        res.redirect('/')
    })            
})


app.get('/register', redirectIfAuthenticatedMiddleware, newUserController)
app.post('/users/register', redirectIfAuthenticatedMiddleware, storeUserController)
app.get('/login', redirectIfAuthenticatedMiddleware, loginController)
app.post('/users/login',redirectIfAuthenticatedMiddleware, loginUserController) 
app.get('/logout', logoutController)