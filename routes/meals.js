const express = require('express');
const router = express.Router();
const {
    getMeal,
    getMeals,
    createMeal,
    updateMeal,
    deleteMeal
} = require('../controllers/meals.js')

router
    .route('/')
    .get(getMeals)
    .post(createMeal);

router
    .route('/:id')
    .get(getMeal)
    .put(updateMeal)
    .delete(deleteMeal);

module.exports = router