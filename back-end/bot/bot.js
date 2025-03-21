import { Markup, Scenes, session, Telegraf } from 'telegraf';
import dotenv from 'dotenv';
import { io } from 'socket.io-client'; // Import socket.io-client
import { client } from '../config/database.js';
import { addUser } from './utils/adduser.js';

dotenv.config();
const token = process.env.TOKEN || null;
export const bot = new Telegraf(token);
const total_url = process.env.DEV_URL || null

bot.use(session());
// Initialize socket
const socket = io('http://localhost:3000'); // Replace with your server URL

const createGameScene = new Scenes.BaseScene("createGameScene");
const testScene = new Scenes.BaseScene("testScene");
const nameScene = new Scenes.BaseScene("nameScene");
const dateScene = new Scenes.BaseScene("dateScene");
const descriptionScene = new Scenes.BaseScene("descriptionScene");
const priceScene = new Scenes.BaseScene("priceScene");
const videoScene = new Scenes.BaseScene("videoScene");
const afterVideoScene = new Scenes.BaseScene("afterVideoScene");
const answerScene = new Scenes.BaseScene("answerScene");
const stage = new Scenes.Stage([createGameScene, nameScene, testScene, dateScene, descriptionScene, priceScene, videoScene, afterVideoScene, answerScene]);
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
    ctx.scene.enter('videoScene');
});

videoScene.enter(async (ctx) => {
    await ctx.reply('Скиньте видео-превью игры');
});

videoScene.on('video', async (ctx) => {
    const fileId = ctx.message.video.file_id;

    const fileLink = await ctx.telegram.getFileLink(fileId);
    ctx.session.game.video = fileLink;
    ctx.scene.enter('afterVideoScene');
});

afterVideoScene.enter(async (ctx) => {
    await ctx.reply('Скиньте видео игры');
});

afterVideoScene.on('video', async (ctx) => {
    const fileId = ctx.message.video.file_id;

    const fileLink = await ctx.telegram.getFileLink(fileId);
    ctx.session.game.video_after = fileLink;
    ctx.scene.enter('priceScene');
});

priceScene.enter(async (ctx) => {
    await ctx.reply('Введите цену игры');
});

priceScene.on('text', async (ctx) => {
    ctx.session.game.price = ctx.message.text;
    ctx.scene.enter('dateScene');
});

dateScene.enter(async (ctx) => {
    await ctx.reply('Введите дату проведения игры в формате DD.MM.YYYY');
});

dateScene.on('text', async (ctx) => {
    const dateRegex = /^\d{2}\.\d{2}\.\d{4}$/;
    if (dateRegex.test(ctx.message.text)) {
        ctx.session.game.date = ctx.message.text;
        ctx.scene.enter('answerScene');
    } else {
        await ctx.reply('Неправильный формат даты. Попробуйте снова');
        ctx.scene.enter('dateScene');
    }
});

answerScene.enter(async (ctx) => {
    await ctx.reply('Введите ответ на игру');
});

answerScene.on('text', async (ctx) => {
    ctx.session.game.answer = ctx.message.text;
    const game = ctx.session.game;
    try {
        await client.query('INSERT INTO games (name, description, video_url, video_after_url, price, date, is_test, answer) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [game.name, game.description, game.video, game.video_after, game.price, game.date, game.is_test, game.answer]);
        await ctx.reply('Игра успешно создана!');
    } catch (error) {
        await ctx.reply('Что-то пошло не так');
        console.error(error);
    }
    ctx.scene.leave();
});

bot.command('create_game', async (ctx) => {
    const user = await client.query('SELECT * FROM users where id = $1', [ctx.from.id])
    ctx.session.game = {};
    
    ctx.scene.enter('createGameScene');
});

bot.launch();