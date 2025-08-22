import Product from "../models/productSchema.js";
import ProductStat from "../models/selfdiagnostic.js";
import TrueUsers from "../models/userModel.js";
import Transactions from "../models/subscriptions.js";
import apiAdapter from "../utilities/apiAdapter.js";
import moment from "moment";
import express from "express";
import FormData from "form-data";
import multer from "multer";
import admin from "firebase-admin";
const clientRouter = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
import serviceAccount from "../casamed-6ec79-firebase-adminsdk-1fm23-08cc0857b4.json" assert { type: "json" };
import { FirebaseDynamicLinks } from "firebase-dynamic-links";
import Users from "../models/userSchema.js";
import Order from "../models/orderSchema.js";
import Account from "../models/accountSchema.js";
import querystring from "querystring";
import fetch from "node-fetch";
import Appointments from "../models/AppointmentSchema.js";
import axios from "axios";
import Plan from "../models/planSchema.js";
import Inventory from "../models/inventorySchema.js";
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const BASE_URL = "https://api.casamed.org/api/v1/services";
const api = apiAdapter(BASE_URL);
clientRouter.get("/share-app-link", async (req, res) => {
  try {
    const firebaseDynamicLinks = new FirebaseDynamicLinks(
      "REDACTED_FIREBASE_KEY"
    );
    const { shortLink, previewLink } = await firebaseDynamicLinks.createLink({
      dynamicLinkInfo: {
        domainUriPrefix: "https://casamed.page.link",
        link: "https://casamed.in/",
        androidInfo: {
          androidPackageName: "com.casamed",
        },
        iosInfo: {
          iosBundleId: "com.casamed.app",
          iosAppStoreId: "1557631518",
        },
        navigationInfo: {
          enableForcedRedirect: true,
        },
      },
    });
    res.status(200).json({ shortLink: shortLink });
  } catch (error) {
    res.status(400).json({ success: false, message: error });
  }
});
clientRouter.post("/request-patient-join", async (req, res) => {
  try {
    const messageRes = await admin.messaging().send(req.body);
    if (messageRes) {
      res.status(200).json({ success: true });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});
clientRouter.get("/products", async (req, res, next) => {
  try {
    const resp = await api.get(`/product-service/${req.path}`, {
      params: req.query,
    });
    const planData = await api.get(`/plan-service/plans/`);
    const filteredProducts = await resp.data.data;

    const promises = filteredProducts.map(async (product) => {
      try {
        product.items = product.items.filter(
          (item) => item.itemId.itemType == "Plan"
        )[0];

        let exTemp = [];
        const subscriptionData = await api.get(
          `/subscription-service/subscriptions?plan=${product.items.itemId.itemId}&status=active&days=${product.days}`
        );
        const subscription = subscriptionData.data.data;
        const plan = planData.data.data.filter(
          (p) => p.name === product.name
        )[0];

        if (plan) {
          for (let index = 0; index < plan.multiWeekPlan.length; index++) {
            const element = plan.multiWeekPlan[index];
            for (let j = 0; j < element.exercises.length; j++) {
              exTemp.push(element.exercises[j]);
              //    console.log(element.exercises[j])
            }
            // console.log(element.exercises.length)
          }
        } else {
          console.log(plan);
        }
        const uniqueItems = exTemp.filter(
          (elem, index) =>
            exTemp.findIndex((obj) => obj.exercise === elem.exercise) === index
        );

        let exerciseCount = uniqueItems.length;
        const subscriptionCount = subscription ? subscription.length : 0;

        return {
          product,
          exerciseCount,
          subscriptionCount,
        };
      } catch (e) {
        console.log(e);
        product.items = product.items.filter(
          (item) => item.itemId.itemType == "Plan"
        )[0];
        let exTemp = [];
        // const subscriptionData = await api.get(`/subscription-service/subscriptions?plan=${product.items.itemId.itemId}&status=active&days=${product.days}`)
        // const subscription = subscriptionData.data.data
        const plan = planData.data.data.filter(
          (p) => p.name === product.name
        )[0];

        for (let index = 0; index < plan.multiWeekPlan.length; index++) {
          const element = plan.multiWeekPlan[index];
          for (let j = 0; j < element.exercises.length; j++) {
            exTemp.push(element.exercises[j]);
            //    console.log(element.exercises[j])
          }
          // console.log(element.exercises.length)
        }
        const uniqueItems = exTemp.filter((item, idx) => {
          // Find the index of the first occurrence of the item with the same name
          const firstIndex = exTemp.findIndex(
            (i) => i.exercise === item.exercise
          );
          // Return true only if the current index is the same as the first index
          console.log(firstIndex);
          return idx === firstIndex;
        });

        let exerciseCount = uniqueItems.length;
        const subscriptionCount = 0;
        return {
          product,
          exerciseCount,
          subscriptionCount,
        };
      }
    });

    const results = await Promise.all(promises);

    res.status(200).json(results);
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: "Couldn't find products!", error });
  }
});

clientRouter.get("/physio-session", async (req, res, next) => {
  try {
    const physioSession = await api.get(`/physio-session-service/${req.path}`, {
      params: req.query,
    });
    if (physioSession.data) {
      return res.status(200).json(physioSession.data.data);
    }
  } catch (e) {
    return res.status(400).json({ success: false, message: e.message });
  }
});

clientRouter.post("/physio-session", async (req, res) => {
  try {
    const physioSession = await api.post(
      `/physio-session-service/${req.path}`,
      req.body
    );
    if (physioSession.data) {
      return res.status(200).json(physioSession.data.data);
    }
  } catch (e) {
    return res.status(400).json({ success: false, message: e.message });
  }
});
clientRouter.put("/physio-session/:id", async (req, res) => {
  try {
    const physioSession = await api.put(
      `/physio-session-service/${req.path}`,
      req.body
    );
    if (physioSession.data) {
      return res.status(200).json(physioSession.data.data);
    }
  } catch (e) {
    return res.status(400).json({ success: false, message: e.message });
  }
});
clientRouter.post("/appointments-generate-token", async (req, res) => {
  try {
    const appointments = await api.post(
      `/appointment-service/${req.path}`,
      req.body
    );

    res.status(200).json(appointments.data);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
    console.log(error?.message);
  }
});
clientRouter.post(
  "/medical-records",
  upload.single("file"),
  async (req, res) => {
    try {
      const name = req.body.name; // get the user name from the request body
      const user = req.body.user;
      const pdfBuffer = req.file.buffer;

      const formData = new FormData();
      formData.append("file", pdfBuffer, { filename: `${req.file.filename}` });
      formData.append("user", user);
      formData.append("name", name);
      const medicalRecord = await api.post(
        `/medical-record-service/${req.path}`,
        formData,
        {
          headers: formData.getHeaders(),
        }
      );

      res.status(200).json(medicalRecord.data);
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
      console.log(error?.message);
    }
  }
);
clientRouter.get("/appointments", async (req, res) => {
  try {
    const users = await api.get(`/account-service/accounts`, {
      params: req.query,
    });
    if (!users) {
      return res
        .status(400)
        .json({ success: false, message: "Couldn't find users!" });
    } else {
      let subscriptionData = [];
      const promises = users.data.data.map(async (user) => {
        try {
          const subscriptions = await api.get(
            `/appointment-service/appointments?user=${user._id}`
          );

          for (let index = 0; index < subscriptions.data.data.length; index++) {
            const element = subscriptions.data.data[index];
            element.user = user;
            subscriptionData.push(element);
          }

          return user;
        } catch (error) {
          return user;
        }
      });

      const results = await Promise.all(promises);

      return res.status(200).json(subscriptionData);
    }
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
});
clientRouter.put("/appointments/:id", async (req, res) => {
  try {
    const appointment = await api.put(
      `/appointment-service/${req.path}`,
      req.body
    );
    if (appointment.data) {
      return res.status(200).json(appointment.data.data);
    }
  } catch (e) {
    return res.status(400).json({ success: false, message: e.message });
  }
});
clientRouter.get("/orders", async (req, res) => {
  try {
    const { referralCode } = req.query;
    const orders = await api.get(`/order-service/${req.path}`, {
      params: req.query,
    });
    const promises = orders.data.data.map(async (order) => {
      try {
        const transactionData = await api.get(
          `/transaction-service/transactions/${order.paymentId}`
        );
        const transaction = transactionData
          ? transactionData.data.data
          : order.paymentId;

        const userData = await api.get(
          `/account-service/accounts/${order.user}`
        );
        const user = userData ? userData.data.data : order.user;

        let products = [];
        for (let index = 0; index < order.products.length; index++) {
          const element = order.products[index];
          const productData = await api.get(
            `/product-service/products/${element}`
          );
          products.push(productData.data.data);
        }
        order.products = products;
        order.user = user;
        order.paymentId = transaction;
        return order;
      } catch (error) {
        let products = [];
        for (let index = 0; index < order.products.length; index++) {
          const element = order.products[index];
          const productData = await api.get(
            `/product-service/products/${element}`
          );
          products.push(productData.data.data);
        }
        order.products = products;
        return order;
      }
    });

    const results = await Promise.all(promises);

    console.log(results);
    console.log(referralCode);
    res
      .status(200)
      .json(results.filter((o) => o.user.referralCode == referralCode));
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: "Couldn't find users!" });
  }
});
clientRouter.get("/referral-user-subscriptions", async (req, res) => {
  try {
    const users = await api.get(`/account-service/accounts`, {
      params: req.query,
    });
    if (!users) {
      return res
        .status(400)
        .json({ success: false, message: "Couldn't find users!" });
    }
    let subscriptionData = [];
    const promises = users.data.data.map(async (user) => {
      try {
        const subscriptions = await api.get(
          `/subscription-service/subscriptions?user=${user._id}`
        );

        for (let index = 0; index < subscriptions.data.data.length; index++) {
          const element = subscriptions.data.data[index];
          element.user = user;
          subscriptionData.push(element);
        }

        return user;
      } catch (error) {
        return user;
      }
    });

    const results = await Promise.all(promises);

    return res.status(200).json(subscriptionData);
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: "Couldn't find users!" });
  }
});
clientRouter.get("/accounts", async (req, res) => {
  try {
    const users = await api.get(`/account-service/${req.path}`, {
      params: req.query,
    });

    const promises = users.data.data.map(async (user) => {
      try {
        const referralData = await api.get(
          `/referral-service/referrals/${user.userReferralCode}`
        );
        const referral = referralData
          ? referralData.data.data
          : user.referralCode;

        user.userReferralCode = referral;
        return user;
      } catch (error) {
        return user;
      }
    });

    const results = await Promise.all(promises);
    res.status(200).json(results);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});
clientRouter.get("/plans", async (req, res) => {
  try {
    const plans = await api.get(`/plan-service/${req.path}`, {
      params: req.query,
    });

    res.status(200).json(plans.data.data);
  } catch (error) {
    res.status(200).json([]);
  }
});
clientRouter.get("/medical-records", async (req, res) => {
  try {
    const plans = await api.get(`/medical-record-service/${req.path}`, {
      params: req.query,
    });

    res.status(200).json(plans.data.data);
  } catch (error) {
    res.status(200).json([]);
  }
});
clientRouter.get("/medical-records/:id", async (req, res) => {
  try {
    const plans = await api.get(`/medical-record-service/${req.path}`, {
      params: req.query,
    });

    res.status(200).json(plans.data.data);
  } catch (error) {
    res.status(200).json([]);
  }
});
clientRouter.get("/users", async (req, res) => {
  try {
    const users = await api.get(`/user-service/${req.path}`, {
      params: req.query,
    });

    res.status(200).json(users.data.data[0]);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});
clientRouter.post("/users", async (req, res) => {
  try {
    const users = await api.post(`/user-service/${req.path}`, req.body);

    res.status(200).json(users.data.data[0]);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});
clientRouter.put("/partners/:id", async (req, res) => {
  try {
    const users = await api.put(`/account-service/${req.path}`, req.body);

    res.status(200).json(users.data.data);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});
clientRouter.put("/accounts/:id", async (req, res) => {
  try {
    const users = await api.put(`/account-service/${req.path}`, req.body);

    res.status(200).json(users.data.data);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

clientRouter.put("/users/:id", async (req, res) => {
  try {
    const users = await api.put(`/user-service/${req.path}`, req.body);

    res.status(200).json(users.data.data[0]);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});
clientRouter.post("/accounts", async (req, res) => {
  try {
    const users = await api.post(`/account-service/${req.path}`, req.body);

    res.status(200).json(users.data.data);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});
clientRouter.get("/user-cases", async (req, res) => {
  try {
    const userCases = await api.get(`/account-service/${req.path}`, {
      params: req.query,
    });
    const userCasesWithPlan = userCases.data.data.map(async (u) => {
      return u;
    });
    const userCasesWait = await Promise.all(userCasesWithPlan);
    res.status(200).json(userCasesWait);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});
clientRouter.post("/user-cases", async (req, res) => {
  try {
    const userCases = await api.post(`/account-service/${req.path}`, req.body);
    const updateAccount = await api.put(
      `/account-service/accounts/${req.body.user}`,
      { isCaseTransfered: true }
    );

    res.status(200).json(userCases.data.data);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});
clientRouter.put("/user-cases/:id", async (req, res) => {
  try {
    const userCases = await api.put(`/account-service/${req.path}`, req.body);

    res.status(200).json(userCases.data.data);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});
clientRouter.post("/user-cases/invite", async (req, res) => {
  try {
    const { account, userCase, name, link } = req.body;

    const userCases = await api.post(`/account-service/user-cases`, userCase);
    const otpRequestHeaders = {
      // "Content-Type": "application/x-www-form-urlencoded",
      "api-key": "REDACTED_KALEYRA_KEY",
    };
    const otpRequestParams = {
      to: `${account.mobile}`,
      type: "TXN",
      sender: "CSMEDX",
      body: `Dear ${account.name}, Partner ${name} has requested you to update CasaMed mobile app by following the link ${link}`,
      // template_id: 1007168593802908500
    };
    const feedbackUpdate = await axios.post(
      `https://api.kaleyra.io/v1/HXAP1683868966IN/messages`,
      querystring.stringify(otpRequestParams),
      { headers: otpRequestHeaders }
    );

    const responseData = await feedbackUpdate.data;

    res.status(200).json(userCases.data.data);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});
clientRouter.get("/partners", async (req, res) => {
  try {
    const users = await api.get(`/account-service/${req.path}`, {
      params: req.query,
    });
    res.status(200).json(users.data.data[0]);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});
clientRouter.post("/partners", async (req, res) => {
  try {
    const users = await api.post(`/account-service/${req.path}`, req.body);

    res.status(200).json(users.data.data);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});
clientRouter.post("/plans", async (req, res) => {
  try {
    const planData = await api.post(`/plan-service/${req.path}`, req.body);
    res.status(200).json(planData.data.data);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});
clientRouter.put("/plans/:id", async (req, res) => {
  try {
    const planData = await api.put(`/plan-service/${req.path}`, req.body);
    res.status(200).json(planData.data.data);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});
clientRouter.get("/plans/:id", async (req, res) => {
  try {
    const planData = await api.get(`/plan-service/${req.path}`, req.body);
    res.status(200).json(planData.data.data);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

clientRouter.get("/exercises", async (req, res) => {
  try {
    const feedbackUpdate = await api.get(`/exercise-service/${req.path}`, {
      params: req.query,
    });
    res.status(200).json(feedbackUpdate.data.data);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

clientRouter.post("/subscriptions", async (req, res) => {
  try {
    const { autoScheduleAppointment } = req.body;
    const users = await api.post(`/subscription-service/${req.path}`, req.body);

    const inventory = await Inventory.findOne({
      itemId: req.body.plan,
      itemType: "Plan",
    });
    // console.log("invenory", inventory)
    const product = await Product.findOne({
      days: req.body.days,
      items: { $elemMatch: { itemId: inventory._id } },
    });
    // console.log("product", product)
    const order = {
      products: [product._id],
      user: req.body.user,
      status: "active",
      addons: [],
    };
    // console.log("order", order)
    const createOrder = await api.post("/order-service/orders", order);
    // console.log("createOrder", createOrder.data)
    if (createOrder.data) {
      await Order.findByIdAndUpdate(createOrder.data.data._id, {
        status: "active",
      });
    }

    if (autoScheduleAppointment === true) {
      if (req.body.days === 45) {
        for (let index = 0; index < 2; index++) {
          let currentDate = moment();
          currentDate = moment()
            .hour(9)
            .minute(0)
            .second(0)
            .add((index + 1) * 15, "d")
            .toDate();
          const appointment = {
            user: req.body.user,
            partner: req.body.partner,
            payment: true,
            status: "paid",
            schedule: moment(currentDate).utc(true).format("YYYY-MM-DD HH:mm"),
            appointmentType: "Physio Evaluation",
            department: req.body.department,
            painPoint: req.body.painPoint,
          };
          await api.post(`/appointment-service/appointments`, appointment);
        }
      } else if (req.body.days === 90) {
        for (let index = 0; index < 6; index++) {
          let currentDate = moment();
          currentDate = moment()
            .hour(9)
            .minute(0)
            .second(0)
            .add((index + 1) * 15, "d")
            .toDate();
          const appointment = {
            user: req.body.user,
            partner: req.body.partner,
            payment: true,
            status: "paid",
            schedule: moment(currentDate).utc(true).format("YYYY-MM-DD HH:mm"),
            appointmentType: "Physio Evaluation",
            department: req.body.department,
            painPoint: req.body.painPoint,
          };
          await api.post(`/appointment-service/appointments`, appointment);
        }
      } else {
        for (let index = 0; index < 12; index++) {
          let currentDate = moment();
          currentDate = moment()
            .hour(9)
            .minute(0)
            .second(0)
            .add((index + 1) * 15, "d")
            .toDate();
          const appointment = {
            user: req.body.user,
            partner: req.body.partner,
            payment: true,
            status: "paid",
            schedule: moment(currentDate).utc(true).format("YYYY-MM-DD HH:mm"),
            appointmentType: "Physio Evaluation",
            department: req.body.department,
            painPoint: req.body.painPoint,
          };
          await api.post(`/appointment-service/appointments`, appointment);
        }
      }
    }
    res.status(200).json(users.data.data);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

clientRouter.get("/subscriptions", async (req, res) => {
  try {
    const users = await api.get(`/subscription-service/${req.path}`, {
      params: req.query,
    });

    const promises = users.data.data.map(async (appointment) => {
      try {
        const userData = await api.get(
          `/account-service/accounts/${appointment.user}`
        );
        const user = userData ? userData.data.data : appointment.user;
        appointment.user = user;
        return appointment;
      } catch (error) {
        return appointment;
      }
    });

    const results = await Promise.all(promises);
    res.status(200).json(results);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

clientRouter.put("/feedbacks/:id", async (req, res) => {
  try {
    const feedbackUpdate = await api.put(
      `/feedback-service/${req.path}`,
      req.body
    );
    res.status(200).json(feedbackUpdate.data.data);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

clientRouter.get("/feedbacks", async (req, res) => {
  try {
    const feedbacks = await api.get(`/feedback-service/${req.path}`, {
      params: req.query,
    });
    if (!feedbacks.data.data) {
      return res.status(500).json({ error: "No data found" });
    }
    const promises = feedbacks.data.data.map(async (appointment) => {
      try {
        const userData = await api.get(
          `/account-service/accounts/${appointment.user}`
        );
        const planData = await api.get(
          `/plan-service/plans/${appointment.plan}`
        );
        const user = userData ? userData.data.data : appointment.user;
        const plan = planData ? planData.data.data : appointment.plan;
        appointment.user = user;
        appointment.plan = plan;
        return appointment;
      } catch (error) {
        return appointment;
      }
    });

    const results = await Promise.all(promises);
    res.status(200).json(results);
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: "Couldn't find users!" });
  }
});

clientRouter.post("/send-sms", async (req, res) => {
  try {
    const otpRequestHeaders = {
      // "Content-Type": "application/x-www-form-urlencoded",
      "api-key": "REDACTED_KALEYRA_KEY",
    };
    const otpRequestParams = {
      to: `${req.body.phoneClient}`,
      type: "TXN",
      sender: "CasaMD",
      body: `Dear ${req.body.name}, Partner ${req.body.partner} has requested you to update CasaMed mobile app by following the link ${req.body.link}`,
      // template_id: 1007168593802908500
    };
    const feedbackUpdate = await axios.post(
      `https://api.kaleyra.io/v1/HXAP1683868966IN/messages`,
      querystring.stringify(otpRequestParams),
      { headers: otpRequestHeaders }
    );

    const responseData = await feedbackUpdate.data;

    res.status(200).json({ success: responseData });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

clientRouter.get("/tiers", async (req, res) => {
  try {
    const tiers = await api.get(`/tier-service/${req.path}`, {
      params: req.query,
    });
    const tierRes = await tiers.data;
    return res.status(200).json(tierRes);
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

clientRouter.get("/tier-subscriptions-invoice/:id", async (req, res) => {
  try {
    const tiersInvoice = await api.get(
      `/tier-subscription-service/${req.path}`,
      { params: req.query }
    );
    const tierInvoiceRes = await tiersInvoice.data;
    return res.status(200).json(tierInvoiceRes);
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});
clientRouter.put("/tier-subscriptions/:id", async (req, res) => {
  try {
    const users = await api.put(
      `/tier-subscription-service/${req.path}`,
      req.body
    );

    res.status(200).json(users.data.data);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});
clientRouter.post("/tier-subscriptions", async (req, res) => {
  try {
    const { user, tier, offerId } = req.body;
    const tiers = await api.post(
      "/tier-subscription-service/tier-subscriptions",
      { user: user, tier: tier, offerId: offerId }
    );

    const tierRes = await tiers.data;
    return res.status(200).json(tierRes);
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});
clientRouter.get("/tier-subscriptions", async (req, res) => {
  try {
    const tiers = await api.get(`/tier-subscription-service/${req.path}`, {
      params: req.query,
    });

    const tierRes = await tiers.data;
    return res.status(200).json(tierRes);
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});
clientRouter.post("/tier-transactions/verify", async (req, res) => {
  try {
    const tiers = await api.post(
      "/tier-transaction-service/tier-transactions/verify",
      req.body
    );

    const tierRes = await tiers.data;
    return res.status(200).json(tierRes);
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});
clientRouter.get("/dashboard-stats", async (req, res) => {
  const user = await Account.find({
    referralCode: req.query.referralCode,
    role: "Client",
  });
  if (!user) {
    return res.status(500).json({ error: "No data found" });
  }

  let totalActiveUsers = 0;
  let totalSubs = 0;
  let totalAppointments = 0;
  let monthCustomers = [];
  let monthSubscriptions = [];
  let appointmentCount = [];
  let activeUsersCount = [];
  let subsGrow = 0;
  let usersGrow = 0;
  let activeUsersGrow = 0;
  let appointmentGrow = 0;
  const promises = user.map(async (userNew) => {
    try {
      const planData = await api.get(
        `/subscription-service/subscriptions?user=${userNew._id}&status=active`
      );

      if (!planData) {
        console.log("error");
      }
      if (planData.data.data.length > 0) {
        totalActiveUsers += 1;
      }
      let activeUserArray = uniqueItems(planData.data.data);
      for (let j = 0; j < activeUserArray.length; j++) {
        const element = activeUserArray[j];
        let actCreatedMonth = moment(element.createdAt).format("MMMM YYYY");

        activeUsersCount.push(actCreatedMonth);
      }

      const subs = await api.get(
        `/subscription-service/subscriptions?user=${userNew._id}`
      );
      if (!subs) {
        console.log("error");
      }
      const appointments = await api.get(
        `/appointment-service/appointments?user=${userNew._id}`
      );
      if (!appointments) {
        console.log("error");
      }

      totalSubs += subs.data.data.length;
      totalAppointments += appointments.data.data.length;
      let appointsArray = appointments.data.data;
      for (let k = 0; k < appointsArray.length; k++) {
        const element = appointsArray[k];
        let apptCreatedMonth = moment(element.createdAt).format("MMMM YYYY");
        appointmentCount.push(apptCreatedMonth);
      }

      let createdMonth = moment(userNew.createdAt).format("MMMM YYYY");
      for (let index = 0; index < subs.data.data.length; index++) {
        const element = subs.data.data[index];
        let subCreatedMonth = moment(element.createdAt).format("MMMM YYYY");
        monthSubscriptions.push(subCreatedMonth);
      }

      monthCustomers.push(createdMonth);
      return userNew;
    } catch (error) {
      console.log(error.message);
      let createdMonth = moment(userNew.createdAt).format("MMMM YYYY");
      monthCustomers.push(createdMonth);
      return userNew;
    }
  });

  const results = await Promise.all(promises);
  const currentMonth = moment().format("MMMM YYYY");
  const custMonth = countMonths(monthCustomers);
  const actMonth = countMonths(activeUsersCount);
  const apptMonth = countMonths(appointmentCount);
  const subsMonth = countMonths(monthSubscriptions);

  for (let indexCust = 0; indexCust < custMonth.length; indexCust++) {
    const element = custMonth[indexCust];
    const currentMonthElement = custMonth.filter(
      (i) => i.month === currentMonth
    )[0];

    if (!currentMonthElement) {
      usersGrow += 0;
    } else if (
      moment(element.month, "MMMM YYYY").isBefore(currentMonth, "month")
    ) {
      usersGrow += Math.round(
        ((currentMonthElement.count - element.count) / element.count) * 100,
        2
      );
    }
  }

  for (let indexCust = 0; indexCust < actMonth.length; indexCust++) {
    const element = actMonth[indexCust];
    const currentMonthElement = actMonth.filter(
      (i) => i.month === currentMonth
    )[0];
    if (!currentMonthElement) {
      activeUsersGrow += 0;
    } else if (
      moment(element.month, "MMMM YYYY").isBefore(currentMonth, "month")
    ) {
      activeUsersGrow += Math.round(
        ((currentMonthElement.count - element.count) / element.count) * 100,
        2
      );
    }
  }

  for (let indexCust = 0; indexCust < apptMonth.length; indexCust++) {
    const element = apptMonth[indexCust];
    const currentMonthElement = apptMonth.filter(
      (i) => i.month === currentMonth
    )[0];
    if (!currentMonthElement) {
      appointmentGrow += 0;
    } else if (
      moment(element.month, "MMMM YYYY").isBefore(currentMonth, "month")
    ) {
      appointmentGrow += Math.round(
        ((currentMonthElement.count - element.count) / element.count) * 100,
        2
      );
    }
  }

  for (let indexCust = 0; indexCust < subsMonth.length; indexCust++) {
    const element = subsMonth[indexCust];
    const currentMonthElement = subsMonth.filter(
      (i) => i.month === currentMonth
    )[0];

    if (!currentMonthElement) {
      subsGrow += 0;
    } else if (
      moment(element.month, "MMMM YYYY").isBefore(currentMonth, "month")
    ) {
      subsGrow += Math.round(
        ((currentMonthElement.count - element.count) / element.count) * 100,
        2
      );
    }
  }

  res.status(200).json({
    totalActiveUsers: totalActiveUsers,
    totalAppointments: totalAppointments,
    totalSubs: totalSubs,
    totalUsers: user.length,
    monthCustomers: countMonths(monthCustomers),
    monthSubscriptions: countMonths(monthSubscriptions),
    activeUsersCount: countMonths(activeUsersCount),
    appointmentCount: countMonths(appointmentCount),
    usersGrow: usersGrow,
    subsGrow: subsGrow,
    appointmentGrow: appointmentGrow,
    activeUsersGrow: activeUsersGrow,
  });
});
clientRouter.post("/book-appointment", async (req, res) => {
  try {
    const appointment = req.body;
    const appointmentCreated = await Appointments.create(appointment);
    return res.status(200).json({
      success: true,
      message: `Appointment scheduled at ${moment(appointmentCreated.schedule)
        .utc(false)
        .format("DD MMMM YYYY HH:mm:ss")}`,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
});

clientRouter.post("/prescriptions", async (req, res) => {
  try {
    const prescription = req.body;
    const prescriptionCreated = await api.post(
      "/prescription-service/prescriptions",
      prescription
    );

    return res
      .status(200)
      .json({ success: true, message: ` Prescription Created Successfully` });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
});
clientRouter.put("/prescriptions/:id", async (req, res) => {
  try {
    const prescription = req.body;
    const prescriptionUpdated = await api.put(
      `/prescription-service/prescriptions/${prescription._id}`,
      prescription
    );

    return res
      .status(200)
      .json({ success: true, message: ` Prescription Updated Successfully` });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
});
clientRouter.get("/prescriptions", async (req, res) => {
  try {
    const prescriptions = await api.get(
      `/prescription-service/prescriptions?partner=${req.query.partner}`
    );

    return res.status(200).json(prescriptions.data.data);
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
});
const countMonths = (arr) => {
  const counts = {};
  arr.forEach((month) => {
    counts[month] = (counts[month] || 0) + 1;
  });
  const result = [];
  for (const [month, count] of Object.entries(counts)) {
    result.push({ month, count });
  }
  return result.sort((a, b) => {
    const monthA = moment(a.month, "MMMM YYYY");
    const monthB = moment(b.month, "MMMM YYYY");
    return monthA.diff(monthB);
  });
};
const uniqueItems = (arr) => {
  const seenIds = {};
  return arr.filter((item) => {
    if (seenIds[item.user]) {
      return false;
    } else {
      seenIds[item.user] = true;
      return true;
    }
  });
};
export default clientRouter;
export const getCustomers = async (req, res) => {
  try {
    const customers = await Users.find();
    res.status(200).json(customers);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getTransactions = async (req, res) => {
  try {
    // sort should look like this : {"field" : "userId", "sort" : "desc"}
    const { page = 1, pageSize = 20, sort = null, search = "" } = req.query;

    // formatted sort should look like this { userId: -1 }
    const generateSort = () => {
      const sortParsed = JSON.parse(sort);
      const sortFormatted = {
        [sortParsed.field]: (sortParsed.sort = "asc" ? 1 : -1),
      };

      return sortFormatted;
    };
    const sortFormatted = Boolean(sort) ? generateSort() : {};

    const transactions = await Order.find({
      $or: [
        { user: { $regex: new RegExp(search, "i") } },
        { selfDiagnostic: { $regex: new RegExp(search, "i") } },
        { razorpayOrderObject: { $regex: new RegExp(search, "i") } },
      ],
    })
      .sort(sortFormatted)
      .skip(page * pageSize)
      .limit(pageSize);

    const total = await Transactions.countDocuments({
      user: { $regex: search, $options: "i" },
    });

    res.status(200).json({
      transactions,
      total,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getGeography = async (req, res) => {
  try {
    const users = await Users.find;
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
