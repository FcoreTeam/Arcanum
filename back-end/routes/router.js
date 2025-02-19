import { Router } from "express";
import { getCatOfUser, updatePremium, getUserInfo, enterPromocode, updateIncome, updateTimeIncoming, memberStatus, getRandomError, uploadImage, successBonus, getBonusInfo, updateMaxStorage } from "../controllers/user.js";

const router = Router();

router.get('/api/', getUserInfo)



export default router;