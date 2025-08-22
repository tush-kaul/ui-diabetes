'use strict';

import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const TeamMember = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    mobile: {
        type: String,
        required: true,
        unique:true
    },
    email: {
      type: String,
      required: false
     
  },
    partner: {
        type: Schema.Types.ObjectId,
        ref: 'Account',
        required: true,
    },
    account: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
  },
    status: {
      type: String,
      enum: ['active', 'disabled'],
    },
    role: {
        type: String,
        enum: ['admin', 'editor', 'viewer'],
    },
    specialisation: {
      type: String,
      required: false
    },
    photo: {
        type: String,
        required: false
    }
  },
  { timestamps: true }
);
const TeamMemberSchema = mongoose.model("TeamMember", TeamMember);
export default TeamMemberSchema;
