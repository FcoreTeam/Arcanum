import { Markup, Telegraf } from 'telegraf'
import dotenv from 'dotenv'
import { addUser } from './utils/adduser.js'
dotenv.config()

const token = process.env.TOKEN || null
export const bot = new Telegraf(token)

bot.start(async (ctx) => {
    await addUser(ctx);
})

bot.on('callback_query', async (ctx) => {
})