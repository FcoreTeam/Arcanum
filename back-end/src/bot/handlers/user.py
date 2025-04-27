from aiogram import Router, Bot, F
from aiogram.types import Message, WebAppInfo, LabeledPrice, PreCheckoutQuery
from aiogram.filters.command import CommandStart, CommandObject
from aiogram.utils.keyboard import InlineKeyboardBuilder 

from auth.models import User
from games.models import Game

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
    prices = [LabeledPrice(label=game.name, amount=int(game.price * 100))]
    await message.answer_invoice(
        title=f"Покупка игры: {game.name}",
        description=f"Описание игры: {game.description}",
        payload=f"buy-game:{game.id}",
        provider_token="381764678:TEST:121786",
        currency="RUB",
        prices=prices
    )

async def process_pre_checkout_query(pre_checkout_query: PreCheckoutQuery, bot: Bot):
    await bot.answer_pre_checkout_query(pre_checkout_query.id, ok=True)

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
    router.message.register(process_successfull_payment, F.successful_payment)
    router.pre_checkout_query.register(process_pre_checkout_query)

