import { Router } from "express";
import { UserController } from "../controllers/user.js";
import { GameController } from "../controllers/game.js";


const router = Router();

router.get('/update_settings', UserController.updateEmailPhone);
router.get('/get_success_game', GameController.successGame);
router.get('/get_unsuccess_game', GameController.unsuccessGame);

export default router;