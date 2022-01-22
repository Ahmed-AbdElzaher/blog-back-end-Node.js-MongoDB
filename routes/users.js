const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');


// auth middleware
const authMiddleware = async (req, res, next) => {
    const {authorization} = req.headers
    const payload = jwt.verify(authorization , 'cdgisqekkh74g')
    const user = await User.findOne({username: payload.username}) 
    // console.log(user)
        if(user){
            // console.log(user)
            req.user = user; 
            next();    
        }else{
            next("user not found !")
        }
}


// UPDATE
router.put("/:id",async (req, res) => {
    if(req.body.userId === req.params.id){
        if(req.body.password){
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password,salt);
        }
        try {
            const updatedUser = await User.findByIdAndUpdate(req.params.id,{
                $set: req.body,
            },{new: true})
            res.status(200).json(updatedUser);
        } catch (error) {
            res.status(500).json(error)
        }

    }else{
        res.status(401).json("not allowed!")
    }
})

// DELETE

router.delete("/:id",async (req, res) => {
    if(req.body.userId === req.params.id){

            const user = await User.findById(req.params.id);
            if(user){
            try {
                await Post.deleteMany({username: user.username})
                await User.findByIdAndDelete(req.params.id)
                res.status(200).json("deleted successfully");
            } catch (error) {
                res.status(500).json(error)
            }
        }else{
            res.status(404).json("not found!")
        }

    }else{
        res.status(401).json("not allowed!")
    }
})


// GET 
router.get("/" ,async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        // const {password,_id, ...others} = user._doc
        // res.status(200).json(others)
        res.status(200).json(user.username)
    } catch (error) {
        res.status(500).json(error)
    }
})


module.exports = router;