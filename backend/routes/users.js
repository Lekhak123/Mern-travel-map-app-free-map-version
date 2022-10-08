const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt")
//register
router.post("/register",async (req,res)=>{
    try {
        //generate new password
        const {username,email,password} = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

       

        //create new user
        const newUser = new User({
            username:username,
            email:email,
            password:hashedPassword,
        })


        //save user and send response
        const user = await newUser.save();  
        
        res.status(200).json(user._id);
        return;

    } catch (error) {
        res.status(500).json(error);
        return;
    }
})


//login

router.post("/login",async(req,res)=>{
    try {
        const {username,password} = req.body;
        //find user
        let user = await User.findOne({username:username});
        if(!user){
            res.status(400).json("Wrong Username or password");
            return;
        }
        //validate password
        let validPassword = await bcrypt.compare(password,user.password);


        !validPassword&&res.status(400).json("Wrong Username or password");


        //send res
        res.status(200).json({_id:user._id,username:username});

        user="";
        validPassword="";
        return;
    } catch (error) {
        res.status(500).json(error);
        return;
    }
})


module.exports= router