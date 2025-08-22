import express from "express";
import { getPartnersProfile, getUser } from "../controllers/general.js"

const router = express.Router();

router.get("/user/:id", getUser);
router.get("/partners", getPartnersProfile);

export default router