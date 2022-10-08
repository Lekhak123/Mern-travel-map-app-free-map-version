const router = require("express").Router();
const Pin = require("../models/Pin");


//CREATE A PIN
 
router.post("/",async (req,res)=>{
    const newPin = new Pin(req.body);
    try {
       const savedPin= await newPin.save();
       res.status(200).json(savedPin);
       return;
    }catch(err){
        res.status(500).json(err);
        return;
    }
})


//get all pins
router.get("/",async(req,res)=>{
    try {
       await Pin.find((err,value)=>{
            if(err){
                res.status(500).json(err);
                return;
            } else {
                res.status(200).json(value);
                return;
            }
        });
       
    } catch (error) {
     
    }
})



module.exports= router