import { Router } from "express";
import { getCatOfUser, updatePremium, getUserInfo, enterPromocode, updateIncome, updateTimeIncoming, memberStatus, getRandomError, uploadImage, successBonus, getBonusInfo, updateMaxStorage } from "../controllers/user.js";

const router = Router();

router.get('/api/', getUserInfo)
router.get('/api/categoryofuser', getCatOfUser)
router.get('/api/randomError', getRandomError)
router.get('/api/getBonusInfo', getBonusInfo)

router.put('/api/updateincome', updateIncome)
router.put('/api/updatetimeincoming', updateTimeIncoming)
router.put('/api/enterPromocode', enterPromocode)
router.put('/api/uploadImage', uploadImage)
router.put('/api/successBonus', successBonus)
router.put('/api/updateMaxStorage', updateMaxStorage)
router.put('/api/updatePremium', updatePremium)
router.put('/api/memberStatus', memberStatus)



export default router;