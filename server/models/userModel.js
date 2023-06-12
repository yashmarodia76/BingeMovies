const mongoose= require("mongoose");

const userSchema = new mongoose.Schema({

    //{}-> iske andar wala validation h taki user koi name ke jagah email na dale
    
    name: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
    },

    password:{
        type:String,
        required: true,
    },
    
    isAdmin: {
        type:  Boolean,
        required: true,
        default: false,
        // movie upload karne ke liye ye use karenge aur default false hi wahi rakhna padega
    },
}, 
{
    // timestamps model which will get automatically updated when our model changes
    timestamps: true,
});

//it registers our schema with mongoose 
//using mongoose.model it then can be accessed anywhere in our application

module.exports = mongoose.model("users",userSchema);