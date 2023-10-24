const express=require('express')
const mongoose =require("mongoose");
const authRouter =require('./routes/auth')
const DB ='mongodb+srv://mulugeta:12345@ecommerce.09srtes.mongodb.net/?retryWrites=true&w=majority';
 const app=express();
 port=6000
 //midleware
 app.use(express.json());
 app.use(authRouter);


mongoose.connect(DB).then(() => {
    console.log(" DatabASE Connection Successful");
}).catch((e) =>{
    console.log(e);
})


 app.listen(port, "0.0.0.0",() => {console.log(`server is running on port ${port}....`)});
 