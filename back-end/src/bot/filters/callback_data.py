from aiogram.filters.callback_data import CallbackData

class ChatAction(CallbackData, prefix="chat-action"):
    sid: str

class YesNoAction(CallbackData, prefix="yes-no-action"):
    decide: bool

class TipAction(CallbackData, prefix="tip-action"):
    is_continue: bool
