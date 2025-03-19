export class UserController {
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
}