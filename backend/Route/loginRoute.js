import { Router } from "express";
import { signup } from "../models/model.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'

const router = Router();

// signup 

router.post("/signup", async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;

    // validation
    if (!fullName || !email || !phone || !password) {
      return res.status(400).json("All fields required");
    }

    // check existing user
    const userCheck = await signup.findOne({ Email: email });

    if (userCheck) {
      return res.status(400).json("User already exists, please login");
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // save user
    const newUser = new signup({
      FullName: fullName,
      Email: email,
      Phone: phone,
      Password: hashedPassword,
      Role:"patient"
    });

    await newUser.save();

    return res.status(201).json("Signup successful");
  } catch (error) {
    console.error(error);
    return res.status(500).json("Server error");
  }
});

// login 

router.post("/login",async(req,res)=>{
    
    try {
        const {email,password} = req.body
        console.log(email,password);

        const userCheck = await signup.findOne({Email:email})
        console.log(userCheck);

        if(userCheck){
            const valid = await bcrypt.compare(password,userCheck.Password)
            console.log(valid,'valid');
        

        if(valid){
            const token = jwt.sign({email,userRole:userCheck.Role},process.env.SECRET_KEY)
            if(token){
                    console.log(token);
                    
                    res.cookie('logToken',token,{httpOnly:true})
                    res.status(201).json({msg:'login success',email:email,role:userCheck.Role})
                    console.log('login success');
                    
                }
                else{
                    console.log('faild to generate token');
                    res.status(500).json('faild to generate token')
                    console.log('faild to generate token');
                    
                    
                }
        
        }
        else{
                console.log('incorrect password');
                res.status(400).json('incorrect password')
                
            }
        }
        else{
            console.log('user not found');
            res.status(404).json('user not found')
            
        }
        
                
        
    } catch (error) {
        console.log(error);
    }
})

router.post('/logout',(req,res) => {
    const cookieOpts = {
    httpOnly: true,
    sameSite: 'lax',                               // match your login
    secure: process.env.NODE_ENV === 'production',
    path: '/',                                     // match path
    // domain: '.yourdomain.com',                  // include if you set it at login
  };

  res.clearCookie('logToken', cookieOpts);
  res.cookie('logToken', '', { ...cookieOpts, expires: new Date(0) });
  res.set('Cache-Control', 'no-store, private');
  res.status(200).json({ msg: 'Successfully logged out' });
});

export default router;
