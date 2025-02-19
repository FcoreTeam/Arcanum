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

export const getCatOfUser = async (req, res) => {
    // GET
    try {
        var info = await client.query(`SELECT c.title, cu.quantity
        FROM category c
        JOIN cat_of_user cu ON c.id = cu.category_id
        WHERE cu.user_tg_id = ${req.query.tg_id};`);
        await res.json(info.rows);
    } catch (err) {
        await
            await errorLogStream.write(`Category not found: ${err.message}\n`);
        await console.log(err);
    }
}

export const getRandomError = async (req, res) => {
    // GET
    try {
        var info = await client.query('SELECT * FROM errors ORDER BY RANDOM() LIMIT 1');
        await res.json(info.rows[0]);
    } catch (err) {
        await console.log(err);
        await errorLogStream.write(`Error not found: ${err.message}\n`);
        await res.json({ error: 'Error not found' })
    }
}

export const memberStatus = async (req, res) => {
    // PUT
    const chatId = req.body.chat_id; // ID of the channel
    const tgId = req.body.tg_id;

    try {
        const member = await bot.telegram.getChatMember(chatId, tgId);
        let info = await client.query('SELECT * FROM users WHERE tg_id = $1', [tgId]);
        if (member.status != 'left' && member.status != 'kicked' && info.rows[0].reward_by_member == false) {
            await client.query(`UPDATE users SET balance = balance + $1, income = income + $1 WHERE tg_id = ${tgId}`, [100]);
            await client.query(`UPDATE users SET reward_by_member = true WHERE tg_id = ${tgId}`);
        }
        await res.json(member.status);
    } catch (err) {
        await console.log(err);
        await errorLogStream.write(`Error while fetching status: ${err.message}\n`);
        await res.json({ status: 'left' })
    }
}

// export const updateCatOfUsers = async (req, res) => {
//     // PUT
//     try {
//         var info = await client.query(`UPDATE cat_of_user SET quantity = ${req.body.quantity} WHERE user_tg_id = ${req.body.user_tg_id} AND category_id = ${req.body.category_id}`);
//             if(info.rowCount == 0) {
//             await res.json({failure: "Не обновилось. Такой категории не существует!"});
//         } else {
//             await res.json({success: true});
//         }
//     } catch (err) {
//         await console.log(err);
//         await errorLogStream.write(`Error while updating categories: ${err.message}\n`);
//         await res.json({error: 'Error while updating categories'})
//     }
// }

export const updateTimeIncoming = async (req, res) => {
    // PUT
    try {
        var info = await client.query(`SELECT last_income_updated FROM users WHERE tg_id = ${req.body.tg_id}`);
        const today = new Date();
        const lastIncomeUpdated = new Date(info.rows[0].last_income_updated);
        const diffTime = await Math.abs(today - lastIncomeUpdated);
        const diffDays = await Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays >= 7) {
            await client.query(`UPDATE users SET incoming = 0 WHERE tg_id = ${req.body.tg_id}`);
            await client.query(`UPDATE users SET last_income_updated = ${today} WHERE tg_id = ${req.body.tg_id}`);
            await res.json({ success: true });
        } else {
            await res.json({ success: false });
        }
    } catch (err) {
        await console.log(err);
        await errorLogStream.write(`Error while fetching last income updated: ${err.message}\n`);
        await res.json({ error: 'Error while fetching last income updated' })
    }
}
export const updateIncome = async (req, res) => {
    // PUT
    var info = await client.query(`UPDATE users SET income = income + ${req.body.income} WHERE tg_id = ${req.body.tg_id}`);
    try {
        await res.json(info);
    } catch (err) {
        await console.log(err);
        await errorLogStream.write(`Error while updating income: ${err.message}\n`);
        await res.json({ error: 'Error while updating income' })
    };
}

export const enterPromocode = async (req, res) => {
    // PUT
    var info = await client.query('SELECT id, discount from promo WHERE code = $1', [req.body.code.toLowerCase().trim()]);
    try {
        if (info.rowCount === 0) {
            await res.json({ success: false, error: 'Промокод не найден' });
            return;
        }
        const dis = info.rows[0]['discount'];
        const info2 = await client.query('SELECT * FROM promo_of_user WHERE promo_id=$1, user_tg_id=$2', [info.rows[0].id, req.body.tg_id]);
        if (info2.rowCount !== 0) {
            await res.json({ success: false, error: 'Промокод уже использован' });
            return;
        }
        await client.query(`UPDATE users SET balance = balance + ${dis} WHERE tg_id = ${req.body.tg_id}`);
        await client.query('INSERT INTO promo_of_user (user_tg_id, promo_id) VALUES ($1, $2)', [req.body.tg_id, info.rows[0].id])
        req.body.income = dis;
        await fetch(total_url + 'updateincome', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ income: dis, tg_id: req.body.tg_id })
        })
        await fetch(total_url + 'updatetimeincoming', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ tg_id: req.body.tg_id })
        })
        // await client.query('DELETE FROM promo WHERE code = $1', [req.body.code]);
        await res.json({ 'success': true });
    } catch (err) {
        await console.log(err);
        await errorLogStream.write(`Error while fetching user info: ${err.message}\n`);
        await res.json({ error: err.message });
    }
}

export const uploadImage = async (req, res) => {
    // PUT
    try {
        const photosSum = req.body.photos.reduce((acc, curr) => acc + curr.price, 0);
        const photosSize = req.body.photos.reduce((acc, curr) => acc + curr.size, 0);
        await client.query('UPDATE cat_of_user SET quantity = quantity + $1 FROM category WHERE cat_of_user.category_id = category.id AND category.title = $3 AND cat_of_user.user_tg_id = $2;', [req.body.photos.length, req.body.tg_id, req.body.cat_title]);
        await client.query('UPDATE users SET balance = balance+$1, current_storage = current_storage+$2, income = income+$1 WHERE tg_id = $3', [photosSum.toFixed(2), photosSize.toFixed(3), req.body.tg_id]);
        await res.json({ success: true });
    } catch (err) {
        await console.log(err);
        await errorLogStream.write(`Error while uploading image: ${err.message}\n`);
        await res.json({ error: 'Error while uploading image' })
    };
}

export const getBonusInfo = async (req, res) => {
    // GET
    try {
        var info = await client.query('SELECT * FROM bonus WHERE user_tg_id = $1', [req.query.tg_id]);
        await res.json(info.rows);
    } catch (err) {
        await console.log(err);
        await errorLogStream.write(`Error while fetching bonus info: ${err.message}\n`);
        await res.json({ error: 'Error while fetching bonus info' })
    };
}

export const successBonus = async (req, res) => {
    // PUT
    try {
        var info = await client.query('SELECT * FROM bonus WHERE user_tg_id = $1', [req.body.tg_id]);
        if (info.rowCount === 0) {
            await res.json({ success: true });
            return;
        }
        var user_info = await client.query(`SELECT *,
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
            FROM users u WHERE u.tg_id = ${req.body.tg_id}`);
        await info.rows.forEach(async (bonus) => {
            if (user_info.rows[0].quantity_of_pictures < bonus.quantity_of_pictures) {
                return;
            }
            await client.query('UPDATE users SET balance = balance + $1 WHERE tg_id = $2', [parseFloat(bonus.price).toFixed(2), bonus.user_tg_id]);
            await client.query('UPDATE users SET income = income + $1 WHERE tg_id = $2', [parseFloat(bonus.price).toFixed(2), bonus.user_tg_id]);
            await client.query('UPDATE bonus SET success = $1 WHERE id = $2', [true, bonus.id]);
        })
        await res.json({ success: true });
    } catch (err) {
        await console.log(err);
        await errorLogStream.write(`Error while updating bonus active: ${err.message}\n`);
        await res.json({ error: 'Error while updating bonus active' })
    };
}

export const updateMaxStorage = async (req, res) => {
    // PUT
    try {
        await client.query('UPDATE users SET max_storage = max_storage + $1 WHERE tg_id = $2', [req.body.max_storage, req.body.tg_id]);
        await res.json({ success: true });
    } catch (err) {
        await console.log(err);
        await errorLogStream.write(`Error while updating storage: ${err.message}\n`);
        await res.json({ error: 'Error while updating storage', msg: err.message })
    };
}

export const updatePremium = async (req, res) => {
    // PUT
    try {
        await client.query('UPDATE users SET is_premium = $1 WHERE tg_id = $2', [true, req.body.tg_id]);
        await res.json({ success: true });
    } catch (err) {
        await console.log(err);
        await errorLogStream.write(`Error while updating premium: ${err.message}\n`);
        await res.json({ error: 'Error while updating premium', msg: err.message })
    };
}