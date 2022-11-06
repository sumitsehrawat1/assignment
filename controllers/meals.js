const Meal = require('../models/Meal');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');

// get all the meals
// get /api/v1/meals
exports.getMeals = asyncHandler( async (req, res, next) => {
    await validateUserPresence(req,res,next);
    console.log(req.headers.user_id);

    const meals = await Meal.find({ user: req.headers.user_id });

    res.status(200).json({
        success: true,
        count: meals.length,
        data: meals
    });
});

// get a specific meal
// get /api/v1/meal/:id
exports.getMeal = asyncHandler( async (req, res, next) => {
    await validateUserPresence(req,res,next);
    const meal = await Meal.find({_id: req.params.id, user: req.headers.user_id});
    console.log(!meal);
    if(!meal || meal.length==0){
        return next( new ErrorResponse(`Meal not found with id of ${req.params.id}`, 404) );
    }

    res.status(200).json({
        success: true,
        data: meal
    });
});

// create a meal
// post /api/v1/meals
exports.createMeal = asyncHandler( async (req, res, next) => {
    await validateUserPresence(req,res,next);
    req.body.user = req.headers.user_id;

    const meal = await Meal.create(req.body);
    res.status(201).json({
        sucess: true,
        data: meal
    });
});

// delete a meal
// delete /api/v1/meals/:id
exports.deleteMeal = asyncHandler( async (req, res, next) => {
    await validateUserPresence(req,res,next);
    const meal = await Meal.findOneAndDelete({_id: req.params.id, user: req.headers.user_id});

    if(!meal || meal.length==0){
        return res.status(400).json({success: false, error: `meal with id ${req.params.id} not found`});
    }
    res.status(200).json({success: true, data: {}});
});

// update a meal
exports.updateMeal = asyncHandler( async (req, res, next) => {
    await validateUserPresence(req,res,next);
    const meal = await Meal.findOneAndUpdate({_id: req.params.id, user: req.headers.user_id}, req.body, {
        new: true,
        runValidators: true
    });

    if(!meal || meal.length==0){
        return res.status(400).json({success: false, error: `meal with id ${req.params.id} not found`});
    }
    res.status(200).json({success: true, data: meal});
});

validateUserPresence = async (req,res, next) => {
    const user = await User.findOne({ _id: req.headers.user_id }).select('+password');
    if(!user || user.length == 0){
        return next( new ErrorResponse(`User not found with id of ${req.headers.user_id}`, 404) );
    }
};