import { client } from "../config/database.js";

export class LeaderboardController {
    static async getLeaderboard(req, res) {
        const { game_id } = req.query;
        const { rows } = await client.query(`SELECT * FROM leaderboard l 
            LEFT JOIN users ON l.user_id = users.id
            WHERE l.game_id = $1`, [game_id]);
        res.json({success: true, leaderboard: rows});
    }
}