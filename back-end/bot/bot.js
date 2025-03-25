import { Markup, Scenes, session, Telegraf } from 'telegraf';
import dotenv from 'dotenv';
import { io } from 'socket.io-client';
import { client } from '../config/database.js';
import { addUser } from './utils/adduser.js';
import { json } from 'stream/consumers';

dotenv.config();
const token = process.env.TOKEN || null;
export const bot = new Telegraf(token);
const total_url = process.env.DEV_URL || null

bot.use(session());
const socket = io('wss://api.zoltansgametma.ru', {
    path: '/socket.io/',
    extraHeaders: {
        // Authorization: `Bearer ${token}`
    }
});

const createGameScene = new Scenes.BaseScene("createGameScene");
const testScene = new Scenes.BaseScene("testScene");
const nameScene = new Scenes.BaseScene("nameScene");
const dateScene = new Scenes.BaseScene("dateScene");
const descriptionScene = new Scenes.BaseScene("descriptionScene");
const priceScene = new Scenes.BaseScene("priceScene");
const photoScene = new Scenes.BaseScene("photoScene");
const afterVideoScene = new Scenes.BaseScene("afterVideoScene");
const answerScene = new Scenes.BaseScene("answerScene");
const hipplesCountScene = new Scenes.BaseScene("hipplesCountScene");
const hippleScene = new Scenes.BaseScene("hippleScene");
const chatScene = new Scenes.BaseScene("chatScene");
const stage = new Scenes.Stage([chatScene, createGameScene, hippleScene, hipplesCountScene, nameScene, testScene, dateScene, descriptionScene, priceScene, photoScene, afterVideoScene, answerScene]);
bot.use(stage.middleware());

// Command: /start
bot.start(async (ctx) => {
    await addUser(ctx);
});

createGameScene.enter(async (ctx) => {
    await ctx.scene.enter('testScene');
});

testScene.enter(async (ctx) => {
    await ctx.reply('Тестовая ли игра?', await Markup.keyboard([
        [await Markup.button.text('Да'),
        await Markup.button.text('Нет')],
    ], ).resize());
});

testScene.on('text', async (ctx) => {
    if (ctx.message.text === 'Да') {
        await ctx.scene.enter('nameScene');
        ctx.session.game.is_test = true;
    } else if (ctx.message.text === 'Нет') {
        await ctx.scene.enter('nameScene');
        ctx.session.game.is_test = false;
    } else {
        await ctx.reply('Неправильный ответ');
        await ctx.scene.enter('testScene');
    }
    
});

nameScene.enter(async (ctx) => {
    await ctx.reply('Введите название игры', Markup.removeKeyboard());
});

nameScene.on('text', async (ctx) => {
    ctx.session.game.name = ctx.message.text;
    await ctx.scene.enter('descriptionScene');
});

descriptionScene.enter(async (ctx) => {
    await ctx.reply('Введите описание игры');
});

descriptionScene.on('text', async (ctx) => {
    ctx.session.game.description = ctx.message.text;
    await ctx.scene.enter('photoScene');
});

photoScene.enter(async (ctx) => {
    await ctx.reply('Скиньте фото-превью игры');
});

photoScene.on('photo', async (ctx) => {
    const fileId = ctx.message.photo[0].file_id;

    const fileLink = await ctx.telegram.getFileLink(fileId);
    ctx.session.game.photo = fileLink;
    await ctx.scene.enter('afterVideoScene');
});

afterVideoScene.enter(async (ctx) => {
    await ctx.reply('Скиньте видео игры');
});

afterVideoScene.on('video', async (ctx) => {
    const fileId = ctx.message.video.file_id;

    const fileLink = await ctx.telegram.getFileLink(fileId);
    ctx.session.game.video_after = fileLink;
    await ctx.scene.enter('priceScene');
});

priceScene.enter(async (ctx) => {
    await ctx.reply('Введите цену игры');
});

priceScene.on('text', async (ctx) => {
    ctx.session.game.price = ctx.message.text;
    await ctx.scene.enter('dateScene');
});

dateScene.enter(async (ctx) => {
    await ctx.reply('Введите дату проведения игры в формате DD.MM.YYYY');
});

dateScene.on('text', async (ctx) => {
    const dateRegex = /^\d{2}\.\d{2}\.\d{4}$/;
    if (dateRegex.test(ctx.message.text)) {
        ctx.session.game.date = ctx.message.text;
        await ctx.scene.enter('hipplesCountScene');
    } else {
        await ctx.reply('Неправильный формат даты. Попробуйте снова');
        await ctx.scene.enter('dateScene');
    }
});

answerScene.enter(async (ctx) => {
    await ctx.reply('Введите ответ на игру');
});

answerScene.on('text', async (ctx) => {
    ctx.session.game.answer = ctx.message.text;
    const game = ctx.session.game;
    try {
        await client.query('INSERT INTO games (name, description, preview_url, video_after_url, price, date, is_test, answer) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [game.name, game.description, game.photo, game.video_after, game.price, game.date, game.is_test, game.answer]);
        const game_info = await client.query('SELECT * FROM games where name = $1 and description = $2 and preview_url = $3 and video_after_url = $4 and price = $5 and date = $6 and is_test = $7 and answer = $8', [game.name, game.description, game.photo, game.video_after, game.price, game.date, game.is_test, game.answer]);
        game.hipples.forEach(async (hipple) => {
            await client.query('INSERT INTO hipples (game_id, description) VALUES ($1, $2)', [game_info.rows[0].id, hipple]);
        });
        await ctx.reply('Игра успешно создана!');
    } catch (error) {
        await ctx.reply('Что-то пошло не так');
        console.error(error);
    }
    await ctx.scene.leave();
});

hipplesCountScene.enter(async (ctx) => {
    await ctx.reply('Введите количество подсказок');
});

hipplesCountScene.on('text', async (ctx) => {
    ctx.session.game.hipples = [];
    ctx.session.game.hipplesCount = parseInt(ctx.message.text);
    await ctx.scene.enter('hippleScene');
});

hippleScene.enter(async (ctx) => {
    await ctx.reply('Введите описание подсказки');
});

hippleScene.on('text', async (ctx) => {
    ctx.session.game.hipples.push(ctx.message.text);
    if (ctx.session.game.hipples.length < ctx.session.game.hipplesCount) {
        await ctx.scene.enter('hippleScene');
    } else {
        console.log(ctx.session.game.hipples);
        await ctx.scene.enter('answerScene');
    }
});



bot.command('create_game', async (ctx) => {
    const user = await client.query('SELECT * FROM users where id = $1 and is_admin = true', [ctx.from.id]);
    if (user.rowCount == 0) {
        await ctx.reply('Вы не администратор');
        return;
    }
    ctx.session.game = {};
    
    await ctx.scene.enter('createGameScene');
});

bot.command('get_game_stats', async (ctx) => {
    console.log('get_game_stats');
    const user = await client.query('SELECT * FROM users where id = $1 and is_admin = true', [ctx.from.id]);
    if (user.rowCount == 0) {
        await ctx.reply('Вы не администратор');
        return;
    }
    const game_id = ctx.message.text.split(' ')[1];
    const game = await client.query('SELECT * FROM games where id = $1', [game_id]);
    if (game.rowCount == 0){
        await ctx.reply('Такой игры не существует');
        return;
    }
    console.log('game success');
    const stats = await client.query(`
                            SELECT 
                            leaderboard.*, 
                            users.*, 
                            games.*
                            FROM leaderboard
                            JOIN users ON leaderboard.user_id = users.id
                            JOIN games ON leaderboard.game_id = games.id
                            WHERE leaderboard.game_id = $1
                            ORDER BY leaderboard.created_at ASC 
                            LIMIT 10`, [game_id]);
    if (stats.rowCount == 0){
        await ctx.reply('Таблица лидеров пуста');
        return;
    }
    console.log('stats success');
    await ctx.replyWithDocument({
        source: Buffer.from(JSON.stringify(stats.rows, null, 2)),
        filename: 'stats.json'
    });
    console.log('send success');
});

bot.command('chats', async (ctx) => {
    try {
        const requests = await client.query(`
            SELECT requests.*, users.username 
            FROM requests 
            JOIN users ON requests.user_id = users.id 
            WHERE requests.admin_id IS NULL
        `);

        if (requests.rows.length === 0) {
            return await ctx.reply('Нет активных запросов.');
        }

        const buttons = requests.rows.map(request => 
            Markup.button.callback(
                `Запрос от @${request.username}`,
                `handle_request_${request.user_id}`
            )
        );

        await ctx.reply('Вот список всех чатов:', {
            reply_markup: {
                inline_keyboard: [buttons]
            }
        });
    } catch (error) {
        console.error('Error in chats command:', error);
        await ctx.reply('Произошла ошибка при получении списка чатов.');
    }
});

chatScene.enter(async (ctx) => {});

chatScene.command('stop', async (ctx) => {
    await ctx.reply(`Чат с пользователем @${ctx.session.users.username} закрыт.`);
    await client.query(`DELETE FROM requests WHERE user_id = $1`, [ctx.session.users.user_id]);
    ctx.session.users = {};
    await ctx.scene.leave();
    socket.disconnect();
});

chatScene.on('text', async (ctx) => {
    await client.query(`INSERT INTO messages (sender_id, receiver_id, msg) VALUES ($1, $2, $3)`, [ctx.from.id, ctx.session.users.user_id, ctx.message.text]);
    socket.emit('private_message', JSON.stringify({socket_id: socket.id, chat_id: ctx.session.users.user_id, msg: ctx.message.text}));
    ctx.scene.enter('chatScene');
});

// Обработчик callback-запросов
bot.action(/^handle_request_(\d+)$/, async (ctx) => {
    const requestId = ctx.match[1];
    try {

        await client.query(`
            UPDATE requests 
            SET admin_id = $1 
            WHERE user_id = $2
        `, [ctx.from.id, requestId]);
        console.log(`Request ${requestId} accepted by admin ${ctx.from.id}`);
        socket.emit('join_chat', requestId);

        const user = await client.query('SELECT * FROM users WHERE id = $1', [requestId]);
        const request = user.rows[0];
        
        await ctx.reply(`Чат с пользователем @${request.username} открыт!`);

        ctx.session.users = {};
        ctx.session.users.user_id =request.id;
        ctx.session.users.username = request.username;
        ctx.scene.enter('chatScene');
    } catch (error) {
        console.error('Error handling request:', error);
        await ctx.answerCbQuery('Произошла ошибка при обработке запроса');
    }
});

socket.on('private_message', async (data) => {
    data = JSON.parse(data);
    if (data.socket_id == socket.id) return;
    const admin_id = (await client.query('SELECT admin_id FROM requests WHERE user_id = $1', [parseInt(data.chat_id)])).rows[0].admin_id;
    await client.query('INSERT INTO messages (sender_id, receiver_id, msg) VALUES ($1, $2, $3)', [data.chat_id, admin_id, data.msg]);
    bot.telegram.sendMessage(admin_id, data.msg);
});

bot.launch();