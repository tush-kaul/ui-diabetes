import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ChannelPartnerSchema = new Schema(
  {
    account:{
        type: Schema.Types.ObjectId,
        ref: 'Account',
        equired: true,
    },
    refCode:{
        type:String,
        required: true,
    },
    name:{
        type:String,
        required: true,
    },
    phone:{
        type:String,
        required: true,
    },
    dob:{
        type:String,
        required: true,
    },
    state:{
        type:String,
        required: true,
    },
    city:{
        type:String,
        required: true,
    },
    pincode:{
        type:Number,
        required: true,
    },
    email:{
        type:String,
        required: true,
    },
    areaOfOperation:{
        type:String,
        required: true,
    },
    partnerCompanyName:{
        type:String,
        required: true,
    },
    enterpriseType:{
        type:String,
        required: true,
    },
    gstNumber:{
        type:String,
        required: true,
    },
   
    gst:{
        type:String,
        required: true,
    },
    aadharNumber:{
        type:String,
        required: true,
    },
    aadhar:{
        type:String,
        required: true,
    },
    panNumber:{
        type:String,
        required: true,
    },
    pan:{
        type:String,
        required: true,
    },
    trainingDone:{
        type:Boolean,
        required: true,
    },
    awareOfCasamed:{
        type:Boolean,
        required: true,
    },
    agreement:{
        type:Boolean,
        required: true,
    }
  },
  {
    timestamps: true,
  }
);
const ChannelPartner = mongoose.model("ChannelPartner", ChannelPartnerSchema);
export default ChannelPartner;