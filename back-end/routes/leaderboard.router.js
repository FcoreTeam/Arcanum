import { Router } from "express";
import { LeaderboardController } from "../controllers/leaderboard.js";

const router = Router();

router.get('/getleaderboard', LeaderboardController.getLeaderboard);

export default router;