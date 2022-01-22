const jwt = require('jsonwebtoken');
const User = require('../models/user')


// const auth = (req, res, next) => {
//     const {authorization} = req.headers
//     const payload = jwt.verify(authorization , 'cdgisqekkh74g')
    
//     User.findOne({username: payload.username})
//     .then(user => {
//         req.user = user;
//         next();
//     })
// }

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

module.exports = {
    authMiddleware
}
