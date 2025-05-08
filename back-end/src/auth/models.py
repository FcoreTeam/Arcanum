from aiogram.client import default
from tortoise import Model, fields

from datetime import datetime

from uuid import uuid4

class Promo(Model):
    id = fields.UUIDField(default=uuid4, primary_key=True)
    code = fields.CharField(max_length=255)
    discount = fields.IntField(default=15)
    users: fields.ManyToManyRelation["User"]
    used_users: fields.ManyToManyRelation["User"]

class Subscription(Model):
    id = fields.UUIDField(default=uuid4, primary_key=True)
    expire = fields.DatetimeField(default=datetime.now)
    user: fields.OneToOneRelation["User"]

class User(Model):
    id = fields.UUIDField(default=uuid4, primary_key=True)
    telegram_id = fields.BigIntField()
    balance = fields.DecimalField(max_digits=100, decimal_places=2, default=0.00)
    is_admin = fields.BooleanField(default=False)
    email = fields.CharField(max_length=255, null=True)
    phone = fields.CharField(max_length=255, null=True)
    avatar_url = fields.CharField(max_length=255, null=True)
    first_name = fields.CharField(max_length=255, null=True)
    username = fields.CharField(max_length=255, null=True)
    bought_games: fields.ReverseRelation["Game"]
    games: fields.ReverseRelation["Game"]
    results: fields.ReverseRelation["GameResult"]
    subscription: fields.OneToOneRelation["Subscription"]

    promos = fields.ManyToManyField("models.Promo", related_name="users")
    promos_used = fields.ManyToManyField("models.Promo", related_name="used_users")

    class Meta:
        table = "users"

    def __str__(self):
        return f"<{self.id} {self.username or self.first_name} {self.telegram_id} {'admin' if self.is_admin else 'default'}>"

