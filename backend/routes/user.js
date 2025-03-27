const bcrypt = require("bcrypt");
const {userModel} = require("../db");

const jwt = require("jsonwebtoken");
const {z} = require("zod");

const jwt_pass = process.env.jwt_pass;

const {Router} = require("express");
const userRouter = Router();

userRouter.post("/signup", async(req,res)=>{
    const requiredBody = z.object({
        email: z.string().min(7).max(100).email(),
        password : z.string().min(5, "Password must be atleast 5 charachters long").max(100, "Password is long too store"),
        name : z.string().min(3)
    })
    const parsedDatawithSuccess = requiredBody.safeParse(req.body);
    if (!parsedDatawithSuccess.success){
        res.json({
            message : "Incorrect Format",
            error : parsedDatawithSuccess.error
        })
        return;
    }
    const email = req.body.email;
    const password = req.body.password;
    const hashedPassword = await bcrypt.hash(password,10);
    const name = req.body.name;

    const existingUser = await userModel.findOne({email : email});
    if(existingUser){
        return res.json({
            message : "User with this Email Id already exists!"
        })

    }
    let errorThrown = false;
    try{
        await userModel.create({
            email : email,
            name : name,
            password : hashedPassword
        })
        res.json({
            message : "Account Sucessfully created!"
        })
    }
    catch(e){
        errorThrown = true;
        console.log(e)
    }
    if(errorThrown){
        res.json({
            message: "Error in creating a user model."
        })
    }
})

userRouter.post("/login", async(req,res)=>{
    const email = req.body.email;
    const emailVerified = await userModel.findOne({email : email});
    if(!emailVerified){
        res.json({
            message : "No user found with this email id!"
        })
        return;
    }
    const password = req.body.password;
    const passwordMatched = await bcrypt.compare(password, emailVerified.password);
    if(passwordMatched){
        const token = await jwt.sign({id: emailVerified._id}, jwt_pass);
        res.json({
            message : "You are successfully loggd in!",
            token : token
        })
    }
    else{
        res.json({
            message : "Password does not match, Try again!"
        })
    }
})


module.exports = {
    userRouter : userRouter
}