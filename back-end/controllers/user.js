import { client } from "../config/database.js";

export class UserController {
    static async getMessages(req, res) {
        try {
            const { user_id } = req.query;
            const { rows } = await client.query('SELECT * FROM messages WHERE sender_id = $1 OR receiver_id = $1 ORDER BY created_at', [user_id]);
            res.json({success: true, messages: rows});
        } catch (err) {
            console.error(err);
            res.json({success: false, error: 'Error while getting messages'});
        }
    }

    static async updateEmailPhone(req, res) {
        try {   
            const { phone, email, user_id } = req.body;
            await client.query('update users set email = $1, phone = $2 where id = $3', [email, phone, user_id]);
            res.json({success: true, message: 'Данные обновлены'});
        } catch (err) {
            console.error(err);
            res.json({success: false, error: 'Error while update user'});
        }
    }
    
    static async userInfo(req, res) {
        // GET
        try {
            const { user_id } = req.query;
            const { rows } = await client.query('SELECT * FROM users WHERE id = $1', [user_id]);
            if (rows.length === 0) {
                res.json({success: false, error: 'User not found'});
                return;
            }
            res.json({success: true, user: rows[0]});
        } catch (err) {
            console.error(err);
            res.json({success: false, error: 'Error while getting user info'});
        }
    }

    static async usersInfo(req, res) {
        try {
            const { rows } = await client.query('SELECT * FROM users');
            res.json({success: true, users: rows});
        } catch (err) {
            console.error(err);
            res.json({success: false, error: 'Error while getting users info'});
        }
    }

    static async makeRequest(req, res) {
        try {
            const { user_id, msg } = req.body;
            await client.query('INSERT INTO messages (user_id, msg) VALUES ($1)', [user_id]);
            await client.query('INSERT INTO requests (user_id) VALUES ($1)', [user_id]);
            res.json({success: true, message: 'Заявка отправлена'});
        } catch (err) {
            console.error(err);
            res.json({success: false, error: 'Error while make request'});
        }
    }
}