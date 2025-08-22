import TeamMemberSchema from "../models/teamMemberSchema.js"
import Referral from "../models/referralSchema.js"
import ChannelPartner from "../models/ChannelPartnerSchema.js"
import Account from "../models/accountSchema.js"
import Subscription from "../models/subscriptionSchema.js"
import Product from "../models/productSchema.js"
import axios from "axios"
import Order from "../models/orderSchema.js"
import Transaction from "../models/transactionSchema.js"
import Trimester from "../models/trimesterSchema.js"

export const getTeamMembers = async (req, res) => {
    try{
        const { partner } = req.query
        const user = await TeamMemberSchema.find({partner: partner})
        res.status(200).json(user)

    } catch (error) {
        res.status(404).json({message: error.message})
    }
}

export const getTeamMember = async (req, res) => {
    try{
        const { id } = req.params
        const user = await TeamMemberSchema.findById(id).populate('partner')
        res.status(200).json(user)

    } catch (error) {
        res.status(404).json({message: error.message})
    }
}

export const getTeamMemberByAccount = async (req, res) => {
    try{
        const { mobile } = req.query
        const user = await TeamMemberSchema.findOne({mobile:mobile}).populate({
            path: 'partner', 
            populate:{
              path: 'userReferralCode',
              model:'Referral'
      }})
        res.status(200).json(user)

    } catch (error) {
        res.status(404).json({message: error.message})
    }
}

export const addTeamMember = async (req, res) => {
    try{
        const {specialisation, name, mobile, partner, role, status, photo, account } = req.body
        const user = await TeamMemberSchema.create({account:account, specialisation: specialisation,name: name, mobile: mobile, partner: partner, role: role, status:status,  photo: photo})
        res.status(200).json(user)

    } catch (error) {
        res.status(404).json({message: error.message})
    }
}

export const updateTeamMember = async (req, res) => {
    try{
        const { id } = req.params;
        const updatedTeamMember = req.body
        const user = await TeamMemberSchema.findByIdAndUpdate(id, updatedTeamMember, {new: true})
        res.status(200).json(user)

    } catch (error) {
        res.status(404).json({message: error.message})
    }
}

export const getRefCode = async (req, res) =>  {
    try {
        const {user} = req.query.user
        let refCode = await Referral.findOne({user:user})
        res.status(200).json(refCode)
    } catch (error) {
        res.status(404).json({message: error.message})
    }
}

export const channelPartnerRequest = async (req, res) => {
    try{
        const {  
            account, 
            name,
            phone,
            dob,
            state,
            city,
            pincode,
            email,
            areaOfOperation,
            partnerCompanyName,
            enterpriseType,
            gstNumber,
            gst,
            aadharNumber,
            aadhar,
            panNumber,
            pan,
            trainingDone,
            awareOfCasamed,
            agreement  } = req.body;
     
        const findUser = await Account.findOne({mobile:phone}).populate([{ path: "userReferralCode" }])
      
        
        const user = await ChannelPartner.create({
            account,
            refCode:findUser.userReferralCode.code,
            name,
            phone,
            dob,
            state,
            city,
            pincode,
            email,
            areaOfOperation,
            partnerCompanyName,
            enterpriseType,
            gstNumber,
            gst,
            aadharNumber,
            aadhar,
            panNumber,
            pan,
            trainingDone,
            awareOfCasamed,
            agreement
        })
       
        res.status(200).json({user,userDetail:findUser})

    } catch (error) {
        res.status(404).json({message: error.message})
    }
}

export const getSalesReferralsStat = async (req, res) => {
    try {
        const {referralCode} = req.query
        let teamMembers = await Account.find({ role: "Team_Member", referralCode:referralCode}).populate({path:"userReferralCode"})
       
        let refCodesByTeam = []
        let promise = teamMembers.map(async(tm)=>{
            let refUsers = await Account.find({referralCode: tm.userReferralCode._id})
            
            if (refUsers.length > 0 ){
                
                
                for (let index = 0; index < refUsers.length; index++) {
                    const element = refUsers[index];
                    let activeSubscriptions = await Subscription.find({user: element._id, status: "active"})
                    let inactiveSubscriptions = await Subscription.find({user: element._id, status: {$ne:"active"}})
                   
                    refCodesByTeam.push({
                        name: tm.name,
                        memberId: tm._id,
                        code: tm.userReferralCode.code,
                        userCount: refUsers.length,
                        activeSubs: activeSubscriptions.length,
                        inactiveSubs: inactiveSubscriptions.length,
                   
                    }) 
                }
               
                
            } else {
                refCodesByTeam.push({
                    name: tm.name,
                    memberId: tm._id,
                    code: tm.referralCode.code,
                    userCount: 0,
                    activeSubs: 0,
                    inactiveSubs: 0,
               
                }) 
               
            }
            return tm

        })
        const results = await Promise.all(promise);
        res.status(200).json(refCodesByTeam)
    } catch (error) {
        res.status(404).json({message: error.message})
    }
}

export const getCPForm = async (req,res)=>{
    try {
        const {accountId} = req.query
        const channelPartner = await ChannelPartner.find({account: accountId})
        if (channelPartner.length > 0) {
            return res.status(200).json(channelPartner[0])
        } else {
            res.status(404).json({message:"Not found"})
        }
    } catch (error) {
        res.status(404).json({message: error.message})
    }
}

export const getSubscriptionsRef = async (req, res) => {
    try {
        
        const subs = await Subscription.find({}).populate([{path: "user"}, {path:"plan", select:["name"]}])
        if (subs.length > 0) {
            let tempSubs = []
            for (let index = 0; index < subs.length; index++) {
                const element = subs[index];
                if (element.user) {
                    if (element.user.referralCode) {
                        if (element.user.referralCode == "63197eaaa12b044d6fa8fc56") {
                            tempSubs.push(element)
                        }
                    }
                }
            }
            let orders = [];
            
            for (let index = 0; index < tempSubs.length; index++) {
                const element = tempSubs[index];
                const product = await Product.findOne({name: element.plan.name, days: element.days})
                if (product) {
                    orders.push({
                        user:element.user._id,
                       products:[product._id],
                       addons:[],
                       couponId:product.days === 30 ? "6503e75b7b93a88b1b8104a0" : "6503e7297b93a88b1b81048c" 
                    })
                    let orderCreated = await axios.post("http://65.2.3.52:9999/api/v1/services/order-service/orders", {
                        user:element.user._id,
                       products:[product._id],
                       addons:[],
                       couponId:product.days === 30 ? "6503e75b7b93a88b1b8104a0" : "6503e7297b93a88b1b81048c" 
                    })
                    let orderUpdate = await Order.findByIdAndUpdate(orderCreated.data.data._id, {$set:{status:"paid"}})
                    let tnxUpdate = await Transaction.findByIdAndUpdate(orderUpdate.paymentId, {$set:{paymentStatus:true}})
                    console.log(tnxUpdate)
                }
            }
            

            return res.status(200).json({orders, size:orders.length, subs: tempSubs})
        } else {
            res.status(404).json({message:"Not found"})
        }
    } catch (error) {
       return res.status(404).json({message: error.message}) 
    }
}

export const createTrimester = async (req, res) => {
    try {
      const trimester = new Trimester(req.body);
      const savedTrimester = await trimester.save();
      res.status(201).json(savedTrimester);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  // Get all Trimesters
  export const getAllTrimesters = async (req, res) => {
    try {
      const trimesters = await Trimester.find(req.query);
      res.status(200).json(trimesters);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
 
  export async function getTrimesterData(req, res) {
    try {
        const { date, userId } = req.query;

        // Assuming you have a method in your TrimesterModel to fetch data by date and userId
        const trimesterData = await Trimester.findOne(date, userId);

        // Format data for graph card consumption
        const formattedData = formatForGraphCard(trimesterData);

        res.json({ success: true, data: formattedData });
    } catch (error) {
        console.error('Error fetching trimester data:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}

// Function to format trimester data for graph card
function formatForGraphCard(trimesterData) {
    const formattedData = [];

    // Iterate through each parameter in the trimester schema
    Object.keys(trimesterData).forEach(param => {
        const value = trimesterData[param];

        // Check if value is null or undefined, replace it with "-"
        const formattedValue = (value === null || value === undefined) ? "-" : value;

        // Check if the parameter has a specific unit
        let unit = "";
        if (param === 'weight') {
            unit = "kg"; // Example unit for weight, you can adjust it as per your requirement
        }

        // Add parameter, formatted value, and unit to the formattedData array as an object
        formattedData.push({
            title: param,
            value: formattedValue,
            unit: unit
        });
    });

    return formattedData;
}
  
  // Get a single Trimester by ID
  export const getTrimesterById = async (req, res) => {
    try {
      const trimester = await Trimester.findById(req.params.id);
      if (!trimester) {
        return res.status(404).json({ message: 'Trimester not found' });
      }
      res.status(200).json(trimester);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Update a Trimester by ID
  export const updateTrimester = async (req, res) => {
    try {
      const trimester = await Trimester.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!trimester) {
        return res.status(404).json({ message: 'Trimester not found' });
      }
      res.status(200).json(trimester);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Delete a Trimester by ID
  export const deleteTrimester = async (req, res) => {
    try {
      const trimester = await Trimester.findByIdAndDelete(req.params.id);
      if (!trimester) {
        return res.status(404).json({ message: 'Trimester not found' });
      }
      res.status(200).json({ message: 'Trimester deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };