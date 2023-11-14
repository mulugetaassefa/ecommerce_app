
// Import from package
const express=require('express')
const mongoose =require("mongoose");
const bodyParser = require('body-parser');
const cors =require('cors');

// Import from other files

const authRouter =require('./routes/auth');
const productRouter = require('./routes/product');
const  userRouter =require("./routes/user");
const adminRouter = require("./routes/admin");


// datase init 

const DB ='mongodb://127.0.0.1:27017/ecommerce';

// initip
const app=express();
 const port = process.env.port || 3000;
 app.use(cors())
 app.use(bodyParser.urlencoded({extended:true}))
 //midleware
 app.use(express.json());
 app.use(bodyParser.json());
 app.use(authRouter);
 app.use(adminRouter);
 app.use(productRouter);
 app.use(userRouter);

// connections 
mongoose.connect(DB,{ useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log(" Database Connection Successful on localhost");
})
.catch((e) =>{
    console.log(e);
});


 app.listen(port , "0.0.0.0" , () => {console.log(`server is running on port ${port}....`)});
 