const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

//Register User
//POST api/v1/auth/register
exports.register = asyncHandler( async (req, res, next) => {
    const { name, email, password } = req.body
    const user = await User.create({
        name,
        email,
        password
    });

    res.status(200).json({ success: true, user_id: user._id});
});

//Login User
//POST api/v1/auth/login
exports.login = asyncHandler( async (req, res, next) => {
    const { email, password } = req.body
    
    // validate email & password
    if(!email || !password){
        return next(new ErrorResponse('Please provide an Email and Password', 400));
    }

    // Check for user
    const user = await User.findOne({ email: email }).select('+password');

    if(!user){
        return next(new ErrorResponse('Invalid credentials email not found in db', 401));
    }

    // check if password matches
    const isMatch = await user.matchPassword(password);
    if(!isMatch){
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    res.status(200).json({ success: true, user_id: user._id});
});