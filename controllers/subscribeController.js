 const subscriber = require("../models/Subscriber")
 
 const subscribeEmail = async (req,res) => {
     const {email} = req.body
     if(!email){
        return res.status(400).json({message : "Email is required"})
     }
     try{
        const exist = await subscriber.findOne({email})
        if(exist){
            return res.status(409).json({message : "Already Subscribed"})
        }
        await subscriber.create({email})
        res.status(201).json({message:"Subscribed successfully"})
     }
   catch(err){
    res.status(500).json(err.message)
   }
 }

 module.exports = { subscribeEmail}

