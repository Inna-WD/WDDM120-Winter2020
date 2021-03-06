const express = require("express");
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
// const session = require('express-session')

require('dotenv').config({path:"./config/keys.env"});

//load controllers
const generalController = require("./controllers/general");
const productController = require("./controllers/product");
const featuredController = require("./controllers/featured");
const roomController = require("./controllers/room");
const userController = require("./controllers/user");


const app = express();

//parse application
app.use(bodyParser.urlencoded({ extended: false }))


app.use(express.static('public'));

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');


//custom middleware functions
app.use((req,res,next)=>{

    if(req.query.method=="PUT")
    {
        req.method="PUT"
    }
    else if(req.query.method=="DELETE")
    {
        req.method="DELETE"
    }
    next();
})


app.use(fileUpload());

// app.use(session({secret: `${process.env.SESSION_SECRET}` , resave: false,saveUninitialized: true}))

// //custom middleware functions
// app.use((req,res,next)=>{

//     res.locals.user = req.session.user;
//     next();
// });



app.use("/",generalController);
app.use("/",productController);
app.use("/",featuredController);
app.use("/room",roomController);
app.use("/user",userController);
app.use("/",(req,res)=>{
    res.render("general/404");
});



mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
console.log(`Connected to MongoDB`);
})
.catch(err=>console.log(`Error occured when connected to db ${err}`));
const PORT = process.env.PORT;
app.listen(PORT,()=>{

    console.log(`Web Server is up and running`);    
});
