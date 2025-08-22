import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import clientRoutes from "./routes/client.js";
import generalRoutes from "./routes/general.js";
import managementRoutes from "./routes/management.js";
import salesRoutes from "./routes/sales.js";
// import AdminBro from 'admin-bro';
// import mongooseAdminBro from '@admin-bro/mongoose';
// import  AdminBroMongoose from 'admin-bro-mongoose';
// import AdminBroExpress from '@admin-bro/express';
// import bcrypt from 'bcryptjs'
// import Account from "./models/accountSchema.js";
// import Referral from "./models/referralSchema.js";
// import Plan from "./models/planSchema.js";
// import Exercise from "./models/exerciseSchema.js";
// import Subscription from "./models/subscriptionSchema.js";
// import Users from "./models/userSchema.js";
// import Partner from "./models/partnerSchema.js";
// import Appointments from "./models/AppointmentSchema.js";
// import Transaction from "./models/transactionSchema.js";
// import Order from "./models/orderSchema.js";
// import Pricing from "./models/pricingSchema.js";
// import Product from "./models/productSchema.js";
// import Inventory from "./models/inventorySchema.js";
// import Discount from "./models/discountSchema.js";
// import Coupon from "./models/couponSchema.js";
// import Question from "./models/questionSchema.js";
// import ScenarioMap from "./models/scenarioMapSchema.js";
// import MedicalRecord from "./models/medicalRecordSchema.js";
// import FoodItem from "./models/foodItemSchema.js";
// import Feedbacks from "./models/feedbackSchema.js";
// import DietPlan from "./models/dietPlanSchema.js";
// import Service from "./models/serviceSchema.js";
// import TimeSlot from "./models/timeSlotsSchema.js";
// AdminBro.registerAdapter(AdminBroMongoose); 

/*  CONFIGURATION   */
dotenv.config();
const app = express();


// const AdminUser = mongoose.model('Admin', { name: String, email: String, encryptedPassword: String, role: String, status:String })



/*   MONGOOSE SETUP   */
mongoose.set('strictQuery', false);

const PORT = process.env.PORT || 9000;
mongoose.connect(process.env.MONGO_URL, { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
   
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`))
}).catch( (error) => console.log(`${error} did not connect`));
// const adminBro = new AdminBro({
//     databases:[mongoose],
//     resources:[Referral, Plan, Exercise, Subscription, Account,Users, Partner, Appointments, Transaction, Order, Pricing, Product, Inventory, Discount, Coupon, Question, ScenarioMap, MedicalRecord, FoodItem, Feedbacks, DietPlan, Service, TimeSlot ],
//     rootPath: '/admin',
//     locale: {
//         translations: {
//           labels: {
//             // change Heading for Login
//             loginWelcome: 'CasaMed Admin',
//           },
//           messages: {
//             loginWelcome: 'Welcome to CasaMed admin panel. Please login to admin access!',
//           },
          
//         },
//       },
//       branding: {
//         companyName: '',
//         softwareBrothers: false,
//         logo: 'https://casamed.in/static/media/logo.ca2a73c42c559614a4ec05c3f7de5e9d.svg',
//       }
//   });
// const router = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
//     authenticate: async (email, password) => {
//       const user = await AdminUser.findOne({ email });
//       if (user) {
//         const matched = await bcrypt.compareSync(
//           password,
//           user.encryptedPassword
//         );
//         if (matched) {
//           return user;
//         }
//       }
//       // if (email === "admin" && password === "admin") {
//       //   return true;
//       // }
//       return false;
//     },
//     cookiePassword: "39869f8c971868cabec103736e162aef",
//   });
// const router = AdminBroExpress.buildRouter(adminBro)
// app.use(adminBro.options.rootPath, router);
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy : "cross-origin" }));
app.use(helmet({
    contentSecurityPolicy: false
}));

app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : "false" }));
app.use(cors());
/*   ROUTES  */
app.use("/client", clientRoutes);
app.use("/general", generalRoutes);
app.use("/management", managementRoutes);
app.use("/sales", salesRoutes);