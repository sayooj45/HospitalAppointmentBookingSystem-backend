import { Router } from "express";
import authentication from "../middleWere/auth.js";
import { signup } from "../models/model.js";
import bcrypt from 'bcrypt'
const admin = Router()

admin.post('/addDoctor',authentication,async(req,res)=>{
    try{
        const {name,
            email,
            phone,
            qualification,
            specialization,
            experience,
            fee,
            hospital,
            startTime,
            endTime,
            availableDays,
            password} = req.body 
        
            if(!email||!phone||!qualification||!specialization||!experience||!fee||!hospital||!startTime||!endTime||!availableDays||!password){
                return res.status(400).json("All fields required");
            }

            const doctorCheck = await signup.findOne({Email:email})

            if(doctorCheck){
                return res.status(400).json("Doctor already exists, please login");
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newDoctor = new signup({
                FullName:name,
                Email:email,
                Phone:phone,
                Qualification:qualification,
                Specialization:specialization,
                Experience:experience,
                Fee:fee,
                Hospital:hospital,
                StartTime:startTime,
                EndTime:endTime,
                AvailableDays:availableDays,
                Password:hashedPassword,
                Role:"doctor"

            })
            newDoctor.save()
            return res.status(201).json("Doctor added successful");

    }
    catch(error){
        console.error(error);
        return res.status(500).json("Server error");
    }
})

admin.get("/doctors",authentication, async (req, res) => {
  try {
    const doctors = await signup.find({Role:"doctor"})
    if(doctors.length != 0){
        res.status(200).json(doctors)
        console.log(doctors);
        
    }
    else{
        res.status(400).json("Cant find doctors")
        console.log("no doctors");
        
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json("Server error")
    
  }
});

export default admin