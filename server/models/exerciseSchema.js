

import mongoose from 'mongoose';


const Schema = mongoose.Schema;

const ExerciseSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: false,
      enum:  [
        'stretching',
        'strengthening',
        'mobilisation',
        'isometric',
      // Plyometric
      // Mild Stretching
      // Eccentric Strengthening
      // Coordination Exercise
      // Range Of Motion Exercise
      // Isotonic Exercise
      // Putty Exercises
      ],
    },
    audioUrl: {
      en: {
        type: String,
        required: true,
      },
      hi: {
        type: String,
        required: false,
      },
    },
    videoUrl: {
      type: String,
      required: true,
    },
    thumbnailUrl: {
      type: String,
      required: true,
    },
    videoDuration: {
      type: Number,
      required: true,
    },
    aiConfigStatus: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
  }
);
const Exercise = mongoose.model("Exercise", ExerciseSchema);
export default Exercise;
