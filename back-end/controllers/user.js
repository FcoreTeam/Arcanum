export class UserController {
    static async createConclusion(req, res) {
        // POST
        try {
            const user = await client.query('select * from users where id = $1', [req.id]);
            const { total_sum, url } = req.body;
            await client.query('insert into conclusion (user_id, total_sum, url) values ($1, $2, $3)', [user.rows[0].id, total_sum, url]);
            res.json({ success: true, message: 'Заключение создано' });
        } catch (err) {
            console.error(err);
            res.json({ success: false, error: 'Error while create conclusion' });
        }
    }
}