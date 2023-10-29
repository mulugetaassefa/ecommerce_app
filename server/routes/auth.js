const express =require("express")
const User = require('../models/user')
const bcryptjs =require("bcryptjs")
const authRouter =express.Router();
 const jwt = require('jsonwebtoken');
const auth=require("../middlewares/auth");

// signup
authRouter.post("/api/signup", async (req, res) => {
    const {name, email , password} =req.body;
    try { 
    const existigUser =await User.findOne({email});
    if(existigUser) {
        return res.status(400).json({msg:"User with same email exist"})
    }
    const hashedPassword = await bcryptjs.hash(password, 8);
    let user = new User ({  
        email,
        password : hashedPassword,
        name
    });
   user =await user.save();

   res.json(user);
} catch(e) { 
    res.status(500).json({error:e.msg});

}
});
//get all user
authRouter.get("/api/signup", async (req,res) => {
    try{
        const user=await User.find({});
        if(!user) {
            return res.status(400).json({msg:"user does not exist"})
        }
        res.status(200).json(user)
    }  catch (e) {

        res.status(500).json({error:e.msg})
    }
})
// signin In Route
authRouter.post("/api/signin", async (req,res) =>{
    try {
       const { email, password } =req.body;
       const user=await User.findOne({email})

           if(!user){
            return res.status(400)
            .json({msg:"user with this email does not exist!"});
           }
      const isMatch=await bcryptjs.compare(password, user.password);
       if(!isMatch) {
        return res.status(400).json({msg:"Incorrect password"});
       }
      const token = jwt.sign({id:user._id},"passwordKey");
      res.json({token,...user._doc});
    } catch (error) {
        res.status(500).json({error:e.message})
    }
})

authRouter.post("/tokenIsValid", async (req, res) => {
    try {
         const token=req.header("x-auth-token");
         if(!token) return res.json(false);
         const verified =jwt.verify(token, "passwordKey");
         if(!verified) return res.json(false);


         const user =await User.findById(verified.id);
         if(!user) return res.json(false);
      res.json(true);

    } catch (e) {
        res.status(500).json({error : e.message}) 
    }
});

// get user data

authRouter.get("/", auth, async (req, res) => {
    const user=await User.findById(req.user);
    res.json({...user._doc, token: req.token});
}); 

module.exports =authRouter;


