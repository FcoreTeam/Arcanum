import { Router } from "express";
import { UserController } from "../controllers/user.js";
import { GameController } from "../controllers/game.js";


const router = Router();

router.post('/update_settings', UserController.updateEmailPhone);
router.get('/get_success_game', GameController.successGame);
router.get('/get_unsuccess_game', GameController.unsuccessGame);
router.get('/user_info', UserController.userInfo);
router.get('/users_info', UserController.usersInfo);
router.get('/get_messages', UserController.getMessages);

export default router;