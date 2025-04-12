from aiogram.filters.callback_data import CallbackData

class YesNoAction(CallbackData, prefix="yes-no-action"):
    decide: bool

class TipAction(CallbackData, prefix="tip-action"):
    is_continue: bool
