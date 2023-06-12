const router = require("express").Router();
const user = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");


//register for a new user usko ham router.post karke use karenge uske liye 1st header likha hua h
//anybody can access this
router.post("/register", async (req, res) => {

    //try mai action perform karna aur catch block mai error show karna best method rhega

    try {
        //pehle check karna h ki user jo enter kar rha h wo already exist toh nae h na...
        const userExists = await user.findOne({ email: req.body.email });
        if (userExists) {
            return res.send({
                success: false,
                message: "User already exists",
            });
        }
        
        //yhn pe aa gaya mtlb user jo h valid h so abhi password ko hash karenge
        const salt = await bcrypt.genSalt(10);
        //hashed aise karenge wo do input lega ek toh password aur ek salt rounds
        const hashedpassword = await bcrypt.hash(req.body.password, salt);
        //exchange kar dena isse password hashed ho jayega
        req.body.password = hashedpassword;
        
        //save karo user ko
        const newUser = new user(req.body);
        await newUser.save();

        res.send({success:true,message:"User Created Successfully"});
    }
    catch (error) {
        res.send({
            success: false,
            message: error.message,
        });
    }
});

//login a user
router.post("/login", async (req, res) => {

    try {

        //check if user exists

        const logUser = await user.findOne({ email: req.body.email });
        if (!logUser) {
            return res.send({
                success: false,
                message: "User does not exists",
            });
        }

        //check if the password is correct using bcrypt as we are getting the plain password
        const validPassword = await bcrypt.compare(req.body.password, logUser.password);
        if (!validPassword) {
            return res.send({
                success: false,
                message: "Invalid Password",
            });
        }

        //create and assign a token doubt part
        const token = jwt.sign({ userId: logUser._id }, process.env.jwt_secret, {
            expiresIn: "1d",
        });

        res.send({ 
            success: true, 
            message: "User Logged in Successfully", 
            data: token
         });
    }

    catch (error) {
        res.send({
            success: false,
            message: error.message,
        });
    }
});

//we have to get user details by id
//only the loged in user can be used to access this
router.get("/get-current-user" , authMiddleware, async(req,res)=>{
    try{
        const diuser = await user.findById(req.body.userId).select('-password')
        res.send({
            success: true,
            message: "User details fetched successfully",
            data: diuser,
        });
    }catch(error){
        res.send({
            success: false,
            message: error.message,
        });
    }
});

module.exports = router;
