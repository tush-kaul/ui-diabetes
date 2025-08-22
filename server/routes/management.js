import express from "express";
import { addTeamMember, channelPartnerRequest, createTrimester, getAllTrimesters, getCPForm, getRefCode, getSalesReferralsStat, getSubscriptionsRef, getTeamMember, getTeamMemberByAccount, getTeamMembers, getTrimesterById, getTrimesterData, updateTeamMember, updateTrimester } from "../controllers/management.js";

const router = express.Router();
router.get("/team-members", getTeamMembers);
router.post("/team-members", addTeamMember);
router.put("/team-members/:id", updateTeamMember);
router.get("/team-members/:id", getTeamMember);
router.get("/find-by-account", getTeamMemberByAccount)
router.post("/submit-partner", channelPartnerRequest)
router.get("/refCode",getRefCode)
router.get('/ref-stats',getSalesReferralsStat)
router.get('/channel-partners',getCPForm)
router.get('/subs-ref', getSubscriptionsRef)
router.get('/trimesters', getAllTrimesters)
router.get('/trimester/:id', getTrimesterById)
router.post('/trimester', createTrimester)
router.put('/trimester/:id', updateTrimester)
router.get("/trimester-graph-data", getTrimesterData)
export default router;