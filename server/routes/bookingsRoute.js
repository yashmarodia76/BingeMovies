const router = require("express").Router();
const stripe = require("stripe")(process.env.stripe_key);
const authMiddleWare = require("../middlewares/authMiddleware");

//make payment
router.post("/make-payment", authMiddleWare, async (req,res) => {
    try {
        const { token , amount } = req.body;


        //create a customer
        const customer = await stripe.customers.create({
            email: token.email,
            source: token.id,
        });

        //create a charge
        const charge = await stripe.charges.create({
            amount: amount,
            currency: "usd",
            customer: customer.id,
            receipt_email: token.email,
            description: "Purchased the Movie Ticket NJOY!!", 
        }, 

    //     const charge = await stripe.PaymentIntent.create({
    //         amount: amount,
    //          currency: "usd",
    //          customer: customer.id,
    //          receipt_email: token.email,
    //          description: "Purchased the Movie Ticket NJOY!!", 
    // },
        {
            idempotencyKey: Math.random().toString(36).substring(7)
        }
        );

        const transactionId = charge.id;

        res.send({
            success: true,
            message: "Payment Successfull",
            data: transactionId,
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        });
    }
});



module.exports = router;