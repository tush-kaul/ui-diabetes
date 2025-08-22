import User from "../models/doctorModel.js"
import Partner from "../models/partnerSchema.js";
import Users from "../models/userSchema.js";


export const getUser = async (req, res) => {
    try{
        const { id } = req.params
        const user = await User.findOne({ account: id });
        res.status(200).json(user)

    } catch (error) {
        res.status(404).json({message: error.message})
    }
}

export const getPartnersProfile = async (req, res) => {
    try{
        
        const user = await Partner.find().populate([{ path: "account", select: ["name", "role"]},{ path: "user", select: ["name", "role"]}])
        res.status(200).json(user)

    } catch (error) {
        res.status(404).json({message: error.message})
    }
}