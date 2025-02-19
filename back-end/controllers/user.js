import { client } from '../config/database.js';
import { errorLogStream } from '../app.js';
import { bot } from '../bot/bot.js';
import { total_url } from '../app.js';

// GET query]

export const updateUser = async (ctx) => {
    await bot.telegram.getChat(ctx.from.id).then(async (data) => {
        await client.query('UPDATE users SET username=$1, first_name=$2 WHERE tg_id = $3', [data.username, data.first_name, ctx.from.id]);
    })
    await bot.telegram.getUserProfilePhotos(ctx.from.id).then(async (data) => {
        if (data.total_count == 0) return;
        await bot.telegram.getFileLink(data.photos[0][0].file_id).then(async (data) => {
            client.query('UPDATE users SET avatar_url = $1 WHERE tg_id = $2', [data.href, ctx.from.id]);
        });
    })
    await console.log('Updated user: ' + ctx.from.id)
}
export const getUserInfo = async (req, res) => {
    // GET
    try {
        await fetch(total_url + 'updatetimeincoming', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ tg_id: req.query.tg_id })
        })
        await updateUser({ from: { id: req.query.tg_id } });
        var info = await client.query(`SELECT *,
        (
            SELECT COUNT(*) 
            FROM users u2
            WHERE from_ref_id = u.tg_id
        ) AS referrer_count,
        (
            SELECT SUM(quantity)
            FROM cat_of_user
            WHERE user_tg_id = u.tg_id
        ) AS quantity_of_pictures
        FROM users u WHERE u.tg_id = ${req.query.tg_id}`);
        await res.json(info.rows[0]);
        console.log(info.rows[0]);
    } catch (err) {
        await console.log(err);
        await errorLogStream.write(`User not found: ${err.message}\n`);
        await res.json({ error: 'User not found' })
    }
};