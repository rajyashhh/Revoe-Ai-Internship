const bcrypt = require("bcrypt");
const {userModel} = require("../db");

const jwt = require("jsonwebtoken");
const {z} = require("zod");

const jwt_pass = process.env.jwt_pass;

const {Router} = require("express");
const userRouter = Router();

userRouter.post("/signup", async(req,res)=>{
    const requiredBody = z.object({
        email: z.string().min(7).maxx(100).email(),
        password : z.string().min(5, "Password must be atleast 5 charachters long").max(100, "Password is long too store"),
        name : z.string().min(3)
    })
    const parsedDatawithSuccess = requiredBody.safeParse(req.body);
    if (!parsedDatawithSuccess.success){
        res.json({
            message : "Incorrect Format",
            error : parsedDatawithSuccess.error
        })
    }
    const email = req.body.email;
    const password = req.body.password;
    const hashedPassword = await bcrypt.hash(password,10);
    const name = req.body.name;

    const existingUser = await userModel.findOne({email : email});
    if(existingUser){
        res.json({
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

module.exports = {
    userRouter : userRouter
}