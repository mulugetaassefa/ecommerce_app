
// Import from package
const express=require('express')
const mongoose =require("mongoose");
// Import from other files

const authRouter =require('./routes/auth');
const productRouter = require('./routes/product');
const  userRouter =require("./routes/user");
const adminRouter = require("./routes/admin");


// datase init 

const DB ='mongodb+srv://<userName:<password>@ecommerce.09srtes.mongodb.net/test?retryWrites=true&w=majority';

// init
const app=express();
 const port = process.env.port || 6000;

 //midleware
 app.use(express.json());
 app.use(authRouter);
 app.use(adminRouter);
 app.use(productRouter);
 app.use(userRouter);

// connections 
mongoose.connect(DB).then(() => {
    console.log(" Database Connection Successful");
}).catch((e) =>{
    console.log(e);
});


 app.listen(port, "0.0.0.0",() => {console.log(`server is running on port ${port}....`)});
 