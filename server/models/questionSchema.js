'use strict';

import mongoose from 'mongoose';


const Schema = mongoose.Schema;

const QuestionSchema = new Schema(
  {
    question: {
      type: String,
      required: true,
    },
    painPoint: {
      type: String,
      enum:  [
        'lowerBack',
        'upperBack',
        'neck',
        'shoulder',
        'knee',
        'hip',
        'ankle',
        'elbow',
        'wristAndHand',
      ],
      index: true,
      required: true,
    },
    options: {
      type: Object,
      required: true,
    },
    identifier: {
      type: String,
      required: true,
    },
    priority: {
      type: Number,
      required: true,
    },
    videoUrl: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);
const Question = mongoose.model('Question', QuestionSchema);
export default Question;
