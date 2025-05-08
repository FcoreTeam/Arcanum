from aiogram import Router, Bot, F
from aiogram.methods import UnbanChatSenderChat
from aiogram.types import Message, WebAppInfo, LabeledPrice, PreCheckoutQuery, message
from aiogram.filters.command import CommandStart, CommandObject
from aiogram.utils.keyboard import InlineKeyboardBuilder 

from auth.models import User, Promo
from games.models import Game

from datetime import date, datetime, timedelta

from config import TelegramSettings

async def start(message: Message):
    builder = InlineKeyboardBuilder()
    builder.button(text="Начать! 🧩", web_app=WebAppInfo(url=TelegramSettings.app_url))
    response = (
        "👋 Привествую в боте Золтана!\n"
        "_Нажмите на кнопку чтобы начать!_"
    )
    await message.answer(response, reply_markup=builder.as_markup())

async def start_buy_game(message: Message, command: CommandObject, user: User):
    game_id = command.args
    game = await Game.get_or_none(id=game_id).prefetch_related("users")
    if not game:
        return await message.answer("Error.")
    if user in game.users:
        return await message.answer("🦺 У вас уже есть игра")
    promo = (await user.promos.all())
    price = game.price
    if len(promo) > 0:
        price = game.price * (promo[0].discount) / 100
        await user.promos_used.add(promo[0])
        await user.promos.remove(promo[0])
    prices = [LabeledPrice(label=game.name, amount=int(price * 100))]
    await message.answer_invoice(
        title=f"Покупка игры: {game.name}",
        description=f"Описание игры: {game.description}",
        payload=f"buy-game:{game.id}",
        provider_token="381764678:TEST:121786",
        currency="RUB",
        prices=prices
    )

async def enter_promo(message: Message, user: User):
    promo = await Promo.get_or_none(code=message.text)
    if not promo: return await message.answer("Не существует!")
    if promo in user.promos_used: await message.answer("Вы уже использовали этот промокод.")
    await user.promos.add(promo)
    await message.answer("Вы успешно активировали промокод!")

async def buy_subscription(message: Message, user: User):
    if user.subscription.expire >= datetime.now():
        return await message.answer("Вы уже имеете подписку")
    prices = [LabeledPrice(label="Подписка", amount=100000)]
    await message.answer_invoice(
        title=f"Покупка подписки на 7 дней",
        description=f"Покупка подписки на 7 дней",
        payload=f"buy-subscription",
        provider_token="381764678:TEST:121786",
        currency="RUB",
        prices=prices
    )

async def process_pre_checkout_query(pre_checkout_query: PreCheckoutQuery, bot: Bot):
    await bot.answer_pre_checkout_query(pre_checkout_query.id, ok=True)

async def process_successfull_payment_subscription(message: Message, user: User):
    user.subscription.expire += timedelta(days=7)
    await user.save()
    builder = InlineKeyboardBuilder()
    builder.button(text="Открыть и начать играть! 🚀", web_app=WebAppInfo(url=TelegramSettings.app_url))
    await message.answer("✅ Вы успешно купили игру! Зайдите в игру!", reply_markup=builder.as_markup())

async def process_successfull_payment(message: Message, user: User):
    game_id = message.successful_payment.invoice_payload.split(":")[-1]
    game = await Game.get_or_none(id=game_id)
    await game.users.add(user)
    builder = InlineKeyboardBuilder()
    builder.button(text="Открыть и начать играть! 🚀", web_app=WebAppInfo(url=TelegramSettings.app_url))
    await message.answer("✅ Вы успешно купили игру! Зайдите в игру!", reply_markup=builder.as_markup())

def register_user_handlers(router: Router):
    router.message.register(start_buy_game, CommandStart(deep_link=True))
    router.message.register(start, CommandStart())
    router.message.register(
        process_successfull_payment,
        F.successful_payment, 
        F.successful_payment.payload.startswith("buy-game")
    )
    router.message.register(
        process_successfull_payment_subscription,
        F.successful_payment, 
        F.successful_payment.payload.startswith("buy-susbcription")
    )
    router.pre_checkout_query.register(process_pre_checkout_query)

