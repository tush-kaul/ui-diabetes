import express from "express";
import clientRouter, {  getCustomers, getTransactions, getGeography } from "../controllers/client.js"

const router = express.Router();


router.get("/customers", getCustomers)
router.get("/transactions", getTransactions)
router.get("/geography", getGeography)
router.use("/services", clientRouter)
export default router;