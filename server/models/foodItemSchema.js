'use strict';

import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const FoodItemSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    measuringUnit: [{
      type: String,
      required: false,
    }],
    quantity: {
      type: Number,
      required: false,
    },
    mealType: [{
      type: String,
      required: true,
      enum: ['breakfast', 'brunch', 'lunch', 'afternoon', 'evening', 'dinner'],
    }],
    veg: {
      type: Boolean,
      required: true,
    },
    gluten: {
      type: Boolean,
      required: true,
    },
    dairy: {
      type: Boolean,
      required: true,
    },
    soy: {
      type: Boolean,
      required: true,
    },
    peanuts: {
      type: Boolean,
      required: true
    },
    fishPrawns: {
      type: Boolean,
      required: true
    },
    diabetesOk:{
      type: Boolean,
      required: true
    },
    thyroidOk:{
      type: Boolean,
      required: true
    },
  },
  { timestamps: true }
);
const FoodItem = mongoose.model('FoodItem', FoodItemSchema);
export default FoodItem;
