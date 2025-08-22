'use strict';

import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const DietPlanSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    days: {
      type: Number,
      required: true,
    },
    multiWeekDietPlan: [
      {
        day: {
          type: String,
          required: true,
        },
        meals: [
          {
            mealType: {
              type: String,
              required: true,
              enum: [
                'breakfast',
                'brunch',
                'lunch',
                'afternoon',
                'evening',
                'dinner',
              ],
            },
            time: {
              type: Date,
              required: true,
            },
            foodItems: [
              {
                type: Schema.Types.ObjectId,
                ref: 'FoodItem',
              },
            ],
          },
        ],
      },
    ],
    notes: [
      {
        type: String,
        required: false,
      },
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
    },
  },
  { timestamps: true }
);
const DietPlan = mongoose.model('DietPlan', DietPlanSchema);
export default DietPlan;
