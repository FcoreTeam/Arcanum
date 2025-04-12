from aiogram.utils.keyboard import InlineKeyboardBuilder
from aiogram.types import InlineKeyboardMarkup
from ..filters.callback_data import YesNoAction, TipAction

def is_test_kb() -> InlineKeyboardMarkup:
    builder = InlineKeyboardBuilder()
    builder.button(text="Да", callback_data=YesNoAction(decide=True))
    builder.button(text="Нет", callback_data=YesNoAction(decide=False))
    return builder.as_markup()

def tip_kb() -> InlineKeyboardMarkup:
    builder = InlineKeyboardBuilder()
    builder.button(text="Создать еще одну подсказку ➕", callback_data=TipAction(is_continue=True))
    builder.button(text="Продолжить ↪️", callback_data=TipAction(is_continue=False))
    return builder.as_markup()

def cancel() -> InlineKeyboardMarkup:
    builder = InlineKeyboardBuilder()
    builder.button(text="Отменить создание игры ☁️", callback_data="cancel")
    return builder.as_markup()

