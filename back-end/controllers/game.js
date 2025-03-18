import { client } from "../config/database.js";

export class GameController {
    static async getGames(req, res) {
        const { rows } = await client.query(`SELECT * FROM games`);
        res.json(rows);
    }

    static async getGame(req, res) {
        const { id } = req.query;
        const { rows } = await client.query(`SELECT * FROM games WHERE id = $1`, [id]);
        res.json(rows);
    }

    static async answerGame(req, res) {
        const { user_id, game_id, answer } = req.body;
        const true_answer = await client.query('SELECT answer FROM games WHERE id = $1', [game_id]);
        if (answer != true_answer.rows[0].answer) {
            return res.json({success: false, message: 'Неправильный ответ'});
        }
        await client.query('INSERT INTO leaderboard (user_id, game_id) VALUES ($1, $2)', [user_id, game_id]);
        res.json({success: true, message: 'Ответ сохранен'});
    }

    static async successGame(req, res) {
        const { user_id } = req.query;
        const games = await client.query('SELECT * FROM games JOIN leaderboard ON games.id = leaderboard.game_id WHERE leaderboard.user_id = $2', [user_id]);
        res.json({success: true, rows: games.rows});
    }

    static async unsuccessGame(req, res) {
        const { user_id } = req.query;
        const games = await client.query(`SELECT * FROM games WHERE id NOT IN (SELECT game_id FROM leaderboard WHERE user_id = $1)`, [user_id]);
        res.json({success: true, rows: games.rows});
    }
}