import { Schema,model } from "mongoose";

const signupSchema = new Schema({
    FullName : {type:String,required:true},
    Email:{type : String,required :true,uniqe:true},
    Phone:{type:Number,required:true},
    Password:{type:String,required:true},
    Role:{type:String,required:true},
    Qualification: String,
    Specialization: String,
    Experience:String,
    Fee:String,
    Hospital: String,
    StartTime : String,
    EndTime : String,
    AvailableDays:String
})

const signup = model('signup',signupSchema)

export {signup}

