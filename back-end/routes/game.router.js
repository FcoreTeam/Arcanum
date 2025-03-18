import { Router } from "express";
import { GameController } from "../controllers/game.js";

const router = Router();

router.get('/getgames', GameController.getGames); // https://localhost:3000/api/game/getgames
router.get('/getgame', GameController.getGame); // https://localhost:3000/api/game/getgame
router.post('/answergame', GameController.answerGame); // https://localhost:3000/api/user/answergame

export default router;