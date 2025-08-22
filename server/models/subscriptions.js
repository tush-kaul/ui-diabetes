// INACTIVE COLLECTION


import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const schema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    selfDiagnostic: {
        type: Schema.Types.ObjectId,
        ref: 'SelfDiagnostic',
        required: true
    },
    startsAt: {
        type: Date,
        default: null
    },
    endsAt: {
        type: Date,
        default: null
    },
    planMonths: {
        type: Number,
        default: 0
    },
    reminderSent:{
        type : Boolean,
        default : false
    },
    notes: {
        type: {},
        required: false
    },
    status: {
        type: String,
        enum: ['created', 'active', 'expired'],
        default: 'created'
    },
    razorpayOrderId: {
        type: String,
        default: null
    },
    razorpayPaymentId: {
        type: String,
        default: null
    },
    razorpaySignature: {
        type: String,
        default: null
    },
    razorpayPaymentStatus: {
        type: String,
        default: null
    },
    razorpayOrderObject: {
        type: {}
    },
    razorpayPaymentObject: {
        type: {}
    },
    couponId:{
        type:String,
        required:false
    }
},
{
    timestamps: true
});

// const Transactions = mongoose.model('Order', schema);

export default schema